/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { Noun, nounsData, poolForLevel } from './nouns';
import { familyOf } from './insights';
import { ErrorPattern } from './errors';
import { emptySrsState, SrsCardState, SrsState } from './srs';
import {
  arrangeContrast, BOOST_OTHER, BOOST_TOP, buildContrastQueue, isLatent,
  lessonFor, patternBoost, shouldEnqueueContrast, CONTRAST_COOLDOWN, CONTRAST_WARMUP,
} from './remediation';

const byWord = (word: string): Noun => nounsData.find(n => n.word === word)!;
const familyWords = (family: string): Noun[] => nounsData.filter(n => familyOf(n) === family);

/** Generador determinista, para que las tandas sean reproducibles en los tests. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function pattern(over: Partial<ErrorPattern> = {}): ErrorPattern {
  return {
    id: 'family:masculino-en-a', kind: 'family', label: 'Masculinos en -a',
    tip: '', examples: [], attempts: 10, errors: 5, errorRate: 0.5, peakRate: 0.5,
    severity: 0.4, status: 'activo', family: 'masculino-en-a',
    words: familyWords('masculino-en-a').slice(0, 3).map(n => n.word), hits: 0,
    ...over,
  };
}

/** Estado SRS con las palabras indicadas ya dominadas. */
function srsWith(mastered: Noun[], box = 4): SrsState {
  const cards: Record<string, SrsCardState> = {};
  for (const n of mastered) {
    cards[n.word] = { box: box as SrsCardState['box'], dueAt: 0, dueRound: 0, lastSeen: 0, firstSeenAt: 0, totalSeen: 5, totalCorrect: 5, totalIncorrect: 0 };
  }
  return { ...emptySrsState(), cards };
}

const dificil = poolForLevel(nounsData, 'difícil');

describe('patternBoost', () => {
  it('no toca nada sin patrones', () => {
    expect(patternBoost([])(byWord('Mesa'))).toBe(1);
  });

  it('prioriza el patrón más severo sobre el resto', () => {
    const top = pattern();
    const other = pattern({ id: 'family:sis', family: 'sis', severity: 0.1, words: [] });
    const boost = patternBoost([top, other]);
    expect(boost(byWord('Problema'))).toBe(BOOST_TOP);
    expect(boost(familyWords('sis')[0])).toBe(BOOST_OTHER);
    expect(boost(byWord('Mesa'))).toBe(1);
  });

  it('ignora los patrones ya superados', () => {
    expect(patternBoost([pattern({ status: 'superado' })])(byWord('Problema'))).toBe(1);
  });
});

describe('buildContrastQueue', () => {
  it('alterna la familia del patrón con su contraste declarado', () => {
    const queue = buildContrastQueue(pattern(), dificil, emptySrsState(), seeded(7));
    expect(queue.length).toBeGreaterThanOrEqual(4);
    const families = new Set(queue.map(n => familyOf(n)));
    expect(families.has('masculino-en-a')).toBe(true);
    // El contraste de los masculinos en -a son las femeninas en -a: misma
    // terminación, género opuesto.
    expect([...families].some(f => f === 'estandar-a' || f === 'a-tonica')).toBe(true);
    expect(new Set(queue.map(n => n.gender)).size).toBe(2);
  });

  it('contrasta la a tónica contra los masculinos en -a', () => {
    // Las dos llevan "el": el contraste tiene que ser el género, no el artículo.
    const p = pattern({
      id: 'family:a-tonica', family: 'a-tonica',
      words: familyWords('a-tonica').slice(0, 3).map(n => n.word),
    });
    const queue = buildContrastQueue(p, dificil, emptySrsState(), seeded(3));
    const families = queue.map(n => familyOf(n));
    expect(families).toContain('a-tonica');
    expect(families).toContain('masculino-en-a');
  });

  it('usa contraste interno en las familias que ya tienen los dos géneros', () => {
    const p = pattern({
      id: 'family:e-ambigua', family: 'e-ambigua',
      words: familyWords('e-ambigua').slice(0, 3).map(n => n.word),
    });
    const queue = buildContrastQueue(p, poolForLevel(nounsData, 'medio'), emptySrsState(), seeded(11));
    expect(queue.every(n => familyOf(n) === 'e-ambigua')).toBe(true);
    expect(new Set(queue.map(n => n.gender)).size).toBe(2);
  });

  it('empareja cada homónimo con su otra acepción', () => {
    const cometas = nounsData.filter(n => n.word.startsWith('Cometa'));
    const p = pattern({
      id: 'family:homonimo', family: 'homonimo', kind: 'family',
      words: cometas.filter(n => n.gender === 'masculino').map(n => n.word),
    });
    const queue = buildContrastQueue(p, dificil, emptySrsState(), seeded(5));
    const lemas = queue.map(n => n.word.replace(/\s*\(.*\)/, ''));
    // El mismo significante con los dos géneros: el par mínimo perfecto.
    expect(lemas.filter(l => l === new Set(lemas).values().next().value).length).toBeGreaterThan(0);
    expect(new Set(queue.map(n => n.gender)).size).toBe(2);
  });

  it('elige como ancla las palabras que el usuario ya domina', () => {
    // Si el lado del contraste también falla, la tanda deja de ser discriminación.
    const anclas = familyWords('estandar-a').slice(0, 4);
    const queue = buildContrastQueue(pattern(), dificil, srsWith(anclas), seeded(13));
    const contraste = queue.filter(n => familyOf(n) !== 'masculino-en-a');
    expect(contraste.length).toBeGreaterThan(0);
    expect(contraste.every(n => anclas.some(a => a.word === n.word))).toBe(true);
  });

  it('devuelve vacío cuando el patrón no tiene material en el pool', () => {
    // Patrón detectado en difícil, usuario jugando en fácil: no hay ninguna
    // palabra griega en -a en ese pool.
    const facil = poolForLevel(nounsData, 'fácil');
    expect(isLatent(pattern(), facil)).toBe(true);
    expect(buildContrastQueue(pattern(), facil, emptySrsState(), seeded(1))).toEqual([]);
  });

  it('no arma tandas para los patrones de velocidad', () => {
    const p = pattern({ id: 'speed:impulsivo', kind: 'speed', family: undefined, words: ['Mesa', 'Libro'] });
    expect(buildContrastQueue(p, dificil, emptySrsState(), seeded(1))).toEqual([]);
  });

  it('nunca devuelve palabras fuera del pool activo', () => {
    const medio = poolForLevel(nounsData, 'medio');
    const p = pattern({
      id: 'family:e-ambigua', family: 'e-ambigua',
      words: familyWords('e-ambigua').slice(0, 3).map(n => n.word),
    });
    for (let seed = 1; seed <= 25; seed++) {
      for (const noun of buildContrastQueue(p, medio, emptySrsState(), seeded(seed))) {
        expect(medio).toContain(noun);
      }
    }
  });
});

describe('arrangeContrast', () => {
  it('no deja la secuencia de géneros perfectamente alternada', () => {
    // Una tanda M,F,M,F se resuelve entera alternando sin leer una sola palabra.
    const a = familyWords('masculino-en-a').slice(0, 3);
    const b = familyWords('estandar-a').slice(0, 3);
    for (let seed = 1; seed <= 50; seed++) {
      const seq = arrangeContrast(a, b, seeded(seed)).map(n => n.gender);
      const alternaSiempre = seq.every((g, i) => i === 0 || g !== seq[i - 1]);
      expect(alternaSiempre, `seed ${seed}`).toBe(false);
    }
  });

  it('no deja corridas largas de un mismo género, que borrarían el contraste', () => {
    const a = familyWords('masculino-en-a').slice(0, 3);
    const b = familyWords('estandar-a').slice(0, 3);
    for (let seed = 1; seed <= 50; seed++) {
      const seq = arrangeContrast(a, b, seeded(seed)).map(n => n.gender);
      let run = 1;
      for (let i = 1; i < seq.length; i++) {
        run = seq[i] === seq[i - 1] ? run + 1 : 1;
        expect(run, `seed ${seed}`).toBeLessThan(3);
      }
    }
  });

  it('conserva todas las palabras de los dos lados', () => {
    const a = familyWords('masculino-en-a').slice(0, 3);
    const b = familyWords('estandar-a').slice(0, 3);
    const words = (items: Noun[]) => items.map(n => n.word).sort();
    expect(words(arrangeContrast(a, b, seeded(9)))).toEqual(words([...a, ...b]));
  });
});

describe('shouldEnqueueContrast', () => {
  it('no interrumpe al que recién abre la app', () => {
    expect(shouldEnqueueContrast(CONTRAST_WARMUP - 1, 999)).toBe(false);
  });

  it('espacia las tandas', () => {
    expect(shouldEnqueueContrast(50, CONTRAST_COOLDOWN - 1)).toBe(false);
    expect(shouldEnqueueContrast(50, CONTRAST_COOLDOWN)).toBe(true);
  });
});

describe('lessonFor', () => {
  it('encuentra el patrón activo al que pertenece la palabra', () => {
    expect(lessonFor([pattern()], byWord('Problema'))?.id).toBe('family:masculino-en-a');
    expect(lessonFor([pattern()], byWord('Mesa'))).toBeNull();
  });

  it('no da lección de un patrón ya superado', () => {
    expect(lessonFor([pattern({ status: 'superado' })], byWord('Problema'))).toBeNull();
  });
});
