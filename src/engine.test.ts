/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { Noun, nounsData, LEVEL_MIX, poolForLevel } from './nouns';
import { emptySrsState } from './srs';
import { emptyErrorsState, ErrorPattern } from './errors';
import { familyOf } from './insights';
import { CONTRAST_COOLDOWN, CONTRAST_WARMUP } from './remediation';
import { applyAnswer, ContrastState, emptyContrast, pickFollowUp, POINTS_BY_DIFFICULTY, Stats } from './engine';

const byWord = (word: string): Noun => nounsData.find(n => n.word === word)!;
const NOW = 1_700_000_000_000;
const zero: Stats = { score: 0, streak: 0, maxStreak: 0 };

const answer = (noun: Noun, gender: Noun['gender'], stats = zero, srs = emptySrsState(), errors = emptyErrorsState()) =>
  applyAnswer({ noun, answer: gender, srs, errors, stats, latency: 900, now: NOW });

describe('applyAnswer', () => {
  it('acierta: suma los puntos de la palabra y sube la racha', () => {
    const mesa = byWord('Mesa');
    const r = answer(mesa, mesa.gender, { score: 5, streak: 2, maxStreak: 2 });
    expect(r.isCorrect).toBe(true);
    expect(r.stats).toEqual({ score: 5 + POINTS_BY_DIFFICULTY[mesa.difficulty], streak: 3, maxStreak: 3 });
  });

  it('falla: no suma, corta la racha pero conserva la máxima', () => {
    const mesa = byWord('Mesa');
    const wrong = mesa.gender === 'femenino' ? 'masculino' : 'femenino';
    const r = answer(mesa, wrong, { score: 50, streak: 4, maxStreak: 9 });
    expect(r.isCorrect).toBe(false);
    expect(r.stats).toEqual({ score: 50, streak: 0, maxStreak: 9 });
  });

  it('puntúa según la dificultad de la palabra, no del nivel', () => {
    const dificil = nounsData.find(n => n.difficulty === 'difícil')!;
    expect(answer(dificil, dificil.gender).stats.score).toBe(POINTS_BY_DIFFICULTY['difícil']);
  });

  it('registra el intento con la caja previa (-1 si nunca se vio) y no muta la entrada', () => {
    const mesa = byWord('Mesa');
    const errors = emptyErrorsState();
    const srs = emptySrsState();
    const first = answer(mesa, mesa.gender, zero, srs, errors);
    expect(first.errors.log).toHaveLength(1);
    expect(first.errors.log[0]).toMatchObject({ w: 'Mesa', k: 1, l: 900, b: -1, t: NOW });
    expect(errors.log).toHaveLength(0);
    expect(srs.cards).toEqual({});

    const second = answer(mesa, mesa.gender, first.stats, first.srs, first.errors);
    expect(second.errors.log[1].b).toBe(first.srs.cards['Mesa'].box);
  });

  it('marca f=1 sólo cuando el usuario eligió femenino', () => {
    const mesa = byWord('Mesa');
    expect(answer(mesa, 'femenino').errors.log[0].f).toBe(1);
    expect(answer(mesa, 'masculino').errors.log[0].f).toBe(0);
  });

  it('actualiza el SRS de la palabra respondida', () => {
    const mesa = byWord('Mesa');
    const r = answer(mesa, mesa.gender);
    expect(r.srs.cards['Mesa'].totalSeen).toBe(1);
    expect(r.srs.cards['Mesa'].totalCorrect).toBe(1);
  });

  it('sin historial suficiente no hay patrón resuelto', () => {
    expect(answer(byWord('Mesa'), 'masculino').resolvedPattern).toBeNull();
  });
});

const familyWords = (family: string): Noun[] => nounsData.filter(n => familyOf(n) === family);
const facil = poolForLevel(nounsData, 'fácil');
const base = (over: Partial<Parameters<typeof pickFollowUp>[0]> = {}) => ({
  current: 'Mesa', pool: facil, patterns: [] as ErrorPattern[], srs: emptySrsState(),
  mix: LEVEL_MIX['fácil'], boost: () => 1, contrast: emptyContrast(), ...over,
});

function pattern(): ErrorPattern {
  return {
    id: 'family:masculino-en-a', kind: 'family', label: 'Masculinos en -a', tip: '', examples: [],
    attempts: 10, errors: 5, errorRate: 0.5, peakRate: 0.5, severity: 0.4, status: 'activo',
    family: 'masculino-en-a', words: familyWords('masculino-en-a').slice(0, 3).map(n => n.word), hits: 0,
  };
}

describe('pickFollowUp', () => {
  it('sin cola ni patrón cae en el SRS y evita repetir la palabra actual', () => {
    for (let i = 0; i < 20; i++) {
      const r = pickFollowUp(base());
      expect(r.word).not.toBe('Mesa');
      expect(facil.some(n => n.word === r.word)).toBe(true);
    }
  });

  it('drena la cola de contraste en orden, sin mutar la original', () => {
    const contrast: ContrastState = { ...emptyContrast(), queue: [facil[1].word, facil[2].word] };
    const r = pickFollowUp(base({ current: '(ninguna)', contrast }));
    expect(r.word).toBe(facil[1].word);
    expect(r.contrast.queue).toEqual([facil[2].word]);
    expect(contrast.queue).toHaveLength(2);
  });

  it('salta las palabras de la cola que son la actual o quedaron fuera del pool', () => {
    const outside = nounsData.find(n => n.difficulty === 'difícil')!.word;
    const contrast: ContrastState = { ...emptyContrast(), queue: [facil[0].word, outside, facil[3].word] };
    const r = pickFollowUp(base({ current: facil[0].word, contrast }));
    expect(r.word).toBe(facil[3].word);
    expect(r.contrast.queue).toEqual([]);
  });

  it('no arma tanda antes del calentamiento ni durante el enfriamiento', () => {
    const early = pickFollowUp(base({
      patterns: [pattern()],
      contrast: { queue: [], answersInSession: CONTRAST_WARMUP - 1, answersSinceContrast: CONTRAST_COOLDOWN },
    }));
    expect(early.contrast.queue).toEqual([]);
    expect(early.contrast.answersSinceContrast).toBe(CONTRAST_COOLDOWN);

    const cooling = pickFollowUp(base({
      patterns: [pattern()],
      contrast: { queue: [], answersInSession: 100, answersSinceContrast: CONTRAST_COOLDOWN - 1 },
    }));
    expect(cooling.contrast.answersSinceContrast).toBe(CONTRAST_COOLDOWN - 1);
  });

  it('con un patrón activo y fuera de enfriamiento arma la tanda y reinicia el contador', () => {
    const dificil = poolForLevel(nounsData, 'difícil');
    const r = pickFollowUp(base({
      pool: dificil, mix: LEVEL_MIX['difícil'], patterns: [pattern()],
      contrast: { queue: [], answersInSession: 100, answersSinceContrast: CONTRAST_COOLDOWN },
    }));
    expect(r.contrast.answersSinceContrast).toBe(0);
    expect(dificil.some(n => n.word === r.word)).toBe(true);
    expect(r.contrast.queue.length).toBeGreaterThan(0);
  });
});
