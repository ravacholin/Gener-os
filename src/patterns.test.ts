/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { Noun, nounsData } from './nouns';
import { familyOf } from './insights';
import {
  analyze, Attempt, COLD_START_ATTEMPTS, emptyErrorsState, ErrorsState,
  MAX_INTERVENED, RELAPSE_ERRORS, RESOLVE_SPAN_MS, activePatterns, patternIncludes,
} from './errors';

const T0 = 1_700_000_000_000;
const byWord = (word: string): Noun => nounsData.find(n => n.word === word)!;
const wordsOf = (family: string, n: number): string[] =>
  nounsData.filter(x => familyOf(x) === family).slice(0, n).map(x => x.word);

/** Construye un log a partir de tandas `[palabra, aciertos, errores]`. */
function makeLog(batches: Array<[string, number, number]>, opts: { latency?: number; box?: number } = {}): ErrorsState {
  let t = T0;
  const log: Attempt[] = [];
  for (const [word, hits, errors] of batches) {
    const noun = byWord(word);
    for (let i = 0; i < errors; i++) {
      log.push({ w: word, f: noun.gender === 'masculino' ? 1 : 0, k: 0, l: opts.latency ?? 2500, b: opts.box ?? 0, t: t += 1000 });
    }
    for (let i = 0; i < hits; i++) {
      log.push({ w: word, f: noun.gender === 'femenino' ? 1 : 0, k: 1, l: opts.latency ?? 2500, b: opts.box ?? 0, t: t += 1000 });
    }
  }
  return { ...emptyErrorsState(), log };
}

/** Concatena logs construidos con distintas opciones, reordenando por tiempo. */
function merge(...states: ErrorsState[]): ErrorsState {
  const log = states.flatMap(s => s.log).sort((a, b) => a.t - b.t);
  return { ...emptyErrorsState(), log };
}

/** Ruido de fondo sano, para que exista línea base sin inventar patrones. */
function background(hits: number, errors: number): Array<[string, number, number]> {
  const words = wordsOf('estandar-o', 12);
  const per = Math.ceil(hits / words.length);
  const batches: Array<[string, number, number]> = words.map(w => [w, per, 0]);
  for (let i = 0; i < errors; i++) batches[i % words.length][2] += 1;
  return batches;
}

const idsOf = (state: ErrorsState) => analyze(state, nounsData, T0 + 10 * 60_000).patterns.map(p => p.id);

describe('cold start', () => {
  it('no detecta nada antes de tener línea base propia', () => {
    const griegas = wordsOf('masculino-en-a', 5);
    const state = makeLog(griegas.map(w => [w, 0, 3] as [string, number, number]));
    expect(state.log.length).toBeLessThan(COLD_START_ATTEMPTS);
    expect(idsOf(state)).toEqual([]);
  });

  it('ignora intentos de palabras que ya no existen en el dataset', () => {
    const state = makeLog(background(30, 3));
    state.log.push({ w: 'PalabraBorrada', f: 0, k: 0, l: 1000, b: 0, t: T0 });
    expect(() => analyze(state, nounsData)).not.toThrow();
    expect(analyze(state, nounsData).attempts).toBe(state.log.length - 1);
  });
});

describe('detección de familias', () => {
  it('detecta una familia claramente peor que el resto', () => {
    const griegas = wordsOf('masculino-en-a', 4);
    const state = makeLog([
      ...background(40, 3),
      ...griegas.map(w => [w, 1, 3] as [string, number, number]),
    ]);
    const patterns = analyze(state, nounsData, T0 + 10 * 60_000).patterns;
    expect(patterns.map(p => p.id)).toContain('family:masculino-en-a');
    expect(patterns.find(p => p.id === 'family:masculino-en-a')!.status).toBe('activo');
  });

  it('no acusa a la familia cuando todos los errores son de una sola palabra', () => {
    // Fallar siempre "altavoz" no es no entender la regla de -z: es una palabra que
    // no entra. La intervención correcta es repetirla, no una tanda de contraste.
    const familia = wordsOf('consonante', 6);
    const state = makeLog([
      ...background(40, 3),
      [familia[0], 2, 6],
      ...familia.slice(1).map(w => [w, 3, 0] as [string, number, number]),
    ]);
    const patterns = analyze(state, nounsData, T0 + 10 * 60_000).patterns;
    expect(patterns.map(p => p.id)).not.toContain('family:consonante');
    // Pero sí se reporta como palabra que se resiste.
    expect(patterns.map(p => p.id)).toContain('leech');
  });

  it('no inventa patrones cuando el usuario falla parejo en todo', () => {
    // 25% de error uniforme no es un patrón: es desconocimiento general, y ahí lo
    // correcto es callarse y dejar trabajar al SRS.
    const batches: Array<[string, number, number]> = [];
    for (const family of ['estandar-o', 'estandar-a', 'e-ambigua', 'sufijo-femenino']) {
      for (const w of wordsOf(family, 5)) batches.push([w, 3, 1]);
    }
    const familyPatterns = idsOf(makeLog(batches)).filter(id => id.startsWith('family:'));
    expect(familyPatterns).toEqual([]);
  });

  it('interviene como mucho en MAX_INTERVENED patrones a la vez', () => {
    const batches: Array<[string, number, number]> = [...background(60, 4)];
    for (const family of ['masculino-en-a', 'e-ambigua', 'sufijo-femenino', 'sis']) {
      for (const w of wordsOf(family, 4)) batches.push([w, 1, 3]);
    }
    const patterns = analyze(makeLog(batches), nounsData, T0 + 10 * 60_000).patterns;
    expect(patterns.length).toBeGreaterThan(MAX_INTERVENED);
    expect(activePatterns(patterns)).toHaveLength(MAX_INTERVENED);
  });

  it('ordena por severidad, no por tasa cruda', () => {
    const batches: Array<[string, number, number]> = [...background(60, 4)];
    for (const w of wordsOf('masculino-en-a', 5)) batches.push([w, 1, 4]);   // mucho volumen
    for (const w of wordsOf('sis', 3)) batches.push([w, 0, 1]);              // tasa 100%, sin volumen
    const patterns = analyze(makeLog(batches), nounsData, T0 + 10 * 60_000).patterns;
    expect(patterns[0].id).toBe('family:masculino-en-a');
  });
});

describe('sesgo de género', () => {
  it('detecta que ante la duda el usuario elige masculino', () => {
    const batches: Array<[string, number, number]> = [];
    for (const w of nounsData.filter(n => n.gender === 'masculino').slice(0, 10)) batches.push([w.word, 4, 0]);
    for (const w of nounsData.filter(n => n.gender === 'femenino').slice(0, 10)) batches.push([w.word, 1, 3]);
    expect(idsOf(makeLog(batches))).toContain('bias:falso-masculino');
  });

  it('no lo detecta cuando falla parejo en los dos géneros', () => {
    const batches: Array<[string, number, number]> = [];
    for (const w of nounsData.filter(n => n.gender === 'masculino').slice(0, 10)) batches.push([w.word, 3, 1]);
    for (const w of nounsData.filter(n => n.gender === 'femenino').slice(0, 10)) batches.push([w.word, 3, 1]);
    expect(idsOf(makeLog(batches)).filter(id => id.startsWith('bias:'))).toEqual([]);
  });
});

describe('velocidad y palabras resistentes', () => {
  it('detecta las respuestas impulsivas', () => {
    // El patrón no es "contesta rápido" sino "cuando contesta rápido, falla".
    const state = merge(
      makeLog(background(30, 2), { latency: 2500 }),
      makeLog(wordsOf('estandar-a', 4).map(w => [w, 0, 3] as [string, number, number]), { latency: 600 }),
    );
    expect(idsOf(state)).toContain('speed:impulsivo');
  });

  it('no acusa de impulsivo al que contesta rápido y acierta', () => {
    const state = merge(
      makeLog(background(20, 2), { latency: 2500 }),
      makeLog(wordsOf('estandar-a', 6).map(w => [w, 4, 0] as [string, number, number]), { latency: 600 }),
    );
    expect(idsOf(state)).not.toContain('speed:impulsivo');
  });

  it('detecta el acierto lento como conocimiento no automatizado', () => {
    const state = makeLog(background(30, 2), { latency: 8000 });
    expect(idsOf(state)).toContain('speed:fragil');
  });

  it('marca como resistente la palabra fallada estando ya dominada', () => {
    const state = makeLog([...background(30, 1), ['Mesa', 2, 1]], { box: 4 });
    const leech = analyze(state, nounsData, T0).patterns.find(p => p.id === 'leech');
    expect(leech?.words).toContain('Mesa');
  });
});

describe('máquina de estado', () => {
  const griegas = wordsOf('masculino-en-a', 4);
  const activo = (): ErrorsState => makeLog([...background(40, 3), ...griegas.map(w => [w, 1, 3] as [string, number, number])]);

  /** Suma aciertos de la familia al final del log. */
  function withHits(state: ErrorsState, hits: number, spacingMs: number): ErrorsState {
    const log = [...state.log];
    let t = log[log.length - 1].t;
    for (let i = 0; i < hits; i++) {
      const w = griegas[i % griegas.length];
      log.push({ w, f: 0, k: 1, l: 2000, b: 2, t: t += spacingMs });
    }
    return { ...state, log };
  }

  it('pasa a mejorando con una racha corta', () => {
    const state = withHits(activo(), 5, 20_000);
    const p = analyze(state, nounsData, T0 + 60 * 60_000).patterns.find(x => x.id === 'family:masculino-en-a');
    expect(p!.status).toBe('mejorando');
  });

  it('no da por superada una racha que cabe dentro de una sola tanda', () => {
    // Ocho aciertos en dos minutos son memoria de trabajo, no aprendizaje.
    const state = withHits(activo(), 8, 15_000);
    const last = state.log[state.log.length - 1].t;
    const p = analyze(state, nounsData, last + 1000).patterns.find(x => x.id === 'family:masculino-en-a');
    expect(p!.status).toBe('mejorando');
  });

  it('da por superada la racha que sobrevive al intervalo', () => {
    const state = withHits(activo(), 8, RESOLVE_SPAN_MS / 4);
    const last = state.log[state.log.length - 1].t;
    const p = analyze(state, nounsData, last + 1000).patterns.find(x => x.id === 'family:masculino-en-a');
    expect(p!.status).toBe('superado');
  });

  it('un error corta la racha', () => {
    const state = withHits(activo(), 8, RESOLVE_SPAN_MS / 4);
    const last = state.log[state.log.length - 1];
    state.log.push({ ...last, k: 0, t: last.t + 1000 });
    const p = analyze(state, nounsData, last.t + 2000).patterns.find(x => x.id === 'family:masculino-en-a');
    expect(p!.status).toBe('activo');
  });

  it('no reabre un patrón cerrado por un tropiezo aislado', () => {
    const resuelto = withHits(activo(), 8, RESOLVE_SPAN_MS / 4);
    const resolvedAt = resuelto.log[resuelto.log.length - 1].t + 1000;
    const first = analyze(resuelto, nounsData, resolvedAt);
    expect(first.progress['family:masculino-en-a'].status).toBe('superado');

    // Un error después de resolverlo: sigue superado.
    const conUnError: ErrorsState = {
      ...resuelto,
      patterns: first.progress,
      log: [...resuelto.log, { w: griegas[0], f: 1, k: 0, l: 2000, b: 3, t: resolvedAt + 60_000 }],
    };
    expect(analyze(conUnError, nounsData, resolvedAt + 120_000).patterns
      .find(p => p.id === 'family:masculino-en-a')!.status).toBe('superado');

    // Con RELAPSE_ERRORS sí recae.
    const conRecaida: ErrorsState = { ...conUnError };
    for (let i = 1; i < RELAPSE_ERRORS; i++) {
      conRecaida.log = [...conRecaida.log, { w: griegas[i], f: 1, k: 0, l: 2000, b: 3, t: resolvedAt + 60_000 * (i + 1) }];
    }
    expect(analyze(conRecaida, nounsData, resolvedAt + 600_000).patterns
      .find(p => p.id === 'family:masculino-en-a')!.status).toBe('activo');
  });

  it('es idempotente: recalcular no hace avanzar el patrón solo', () => {
    // Se recalcula en cada render; si `analyze` avanzara un paso por llamada, un
    // patrón se declararía superado sin que el usuario respondiera nada.
    let state = activo();
    const now = T0 + 60 * 60_000;
    const first = analyze(state, nounsData, now);
    state = { ...state, patterns: first.progress };
    const second = analyze(state, nounsData, now);
    expect(second.progress).toEqual(first.progress);
    expect(second.patterns.map(p => p.status)).toEqual(first.patterns.map(p => p.status));
  });

  it('conserva el patrón en la lista aunque ya no cruce el umbral', () => {
    // Es justamente lo que se quiere ver mientras se lo está superando.
    const state = withHits(activo(), 8, RESOLVE_SPAN_MS / 4);
    const last = state.log[state.log.length - 1].t;
    const analyzed = analyze(state, nounsData, last + 1000);
    const again = analyze({ ...state, patterns: analyzed.progress }, nounsData, last + 1000);
    expect(again.patterns.map(p => p.id)).toContain('family:masculino-en-a');
  });
});

describe('patternIncludes', () => {
  it('resuelve la pertenencia por familia, no por la lista de palabras falladas', () => {
    const griegas = wordsOf('masculino-en-a', 4);
    const state = makeLog([...background(40, 3), ...griegas.map(w => [w, 1, 3] as [string, number, number])]);
    const p = analyze(state, nounsData, T0 + 10 * 60_000).patterns.find(x => x.id === 'family:masculino-en-a')!;
    const otraGriega = nounsData.find(n => familyOf(n) === 'masculino-en-a' && !griegas.includes(n.word))!;
    expect(patternIncludes(p, otraGriega)).toBe(true);
    expect(patternIncludes(p, byWord('Mesa'))).toBe(false);
  });
});
