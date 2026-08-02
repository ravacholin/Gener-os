/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { Noun } from './nouns';
import { BOX0_ROUND_DELAY, emptySrsState, isDue, pickNextWord, recordAnswer, SrsState } from './srs';

const noun = (word: string, gender: Noun['gender'] = 'masculino', difficulty: Noun['difficulty'] = 'fácil'): Noun =>
  ({ word, gender, difficulty, translation: '', rule: 'Terminación estándar -o', explanation: '', example: '' });

const pool = ['A', 'B', 'C', 'D', 'E', 'F'].map(w => noun(w));

/** Secuencia determinista para `Math.random`, así los picks son reproducibles. */
function stubRandom(seed: number) {
  let s = seed;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  });
}

afterEach(() => vi.restoreAllMocks());

describe('recordAnswer', () => {
  it('sube de caja al acertar y acumula los contadores', () => {
    let state = emptySrsState();
    state = recordAnswer(state, 'A', true);
    expect(state.cards['A'].box).toBe(0);
    state = recordAnswer(state, 'A', true);
    expect(state.cards['A'].box).toBe(1);
    expect(state.cards['A'].totalSeen).toBe(2);
    expect(state.cards['A'].totalCorrect).toBe(2);
  });

  it('no pasa de la caja 5', () => {
    let state = emptySrsState();
    for (let i = 0; i < 10; i++) state = recordAnswer(state, 'A', true);
    expect(state.cards['A'].box).toBe(5);
  });

  it('devuelve a la caja 0 al fallar, conservando el historial', () => {
    let state = emptySrsState();
    for (let i = 0; i < 5; i++) state = recordAnswer(state, 'A', true);
    const firstSeenAt = state.cards['A'].firstSeenAt;
    state = recordAnswer(state, 'A', false);
    expect(state.cards['A'].box).toBe(0);
    expect(state.cards['A'].totalIncorrect).toBe(1);
    expect(state.cards['A'].totalCorrect).toBe(5);
    expect(state.cards['A'].firstSeenAt).toBe(firstSeenAt);
  });

  it('reprograma la fallada dentro de la misma sesión', () => {
    const state = recordAnswer(emptySrsState(), 'A', false);
    const delay = state.cards['A'].dueRound - state.round;
    expect(delay).toBeGreaterThanOrEqual(BOX0_ROUND_DELAY.min);
    expect(delay).toBeLessThanOrEqual(BOX0_ROUND_DELAY.max);
  });
});

describe('isDue', () => {
  it('considera vencida toda palabra no vista', () => {
    expect(isDue(noun('Z'), emptySrsState())).toBe(true);
  });

  it('agenda la caja 0 por rondas y el resto por reloj', () => {
    const fallada = recordAnswer(emptySrsState(), 'A', false);
    expect(isDue(noun('A'), fallada)).toBe(false);
    expect(isDue(noun('A'), { ...fallada, round: fallada.cards['A'].dueRound })).toBe(true);

    let dominada = emptySrsState();
    for (let i = 0; i < 3; i++) dominada = recordAnswer(dominada, 'B', true);
    expect(isDue(noun('B'), dominada)).toBe(false);
  });
});

describe('pickNextWord', () => {
  it('nunca repite la palabra que se acaba de responder', () => {
    stubRandom(1);
    for (let i = 0; i < 100; i++) {
      expect(pickNextWord(pool, emptySrsState(), 'A').word).not.toBe('A');
    }
  });

  it('sin boost se comporta exactamente igual que un boost neutro', () => {
    // Test de no regresión: agregar el parámetro no puede cambiar la selección de
    // nadie que no lo use.
    const state: SrsState = { ...emptySrsState(), cards: {} };
    stubRandom(42);
    const sinBoost = Array.from({ length: 200 }, () => pickNextWord(pool, state).word);
    vi.restoreAllMocks();
    stubRandom(42);
    const neutro = Array.from({ length: 200 }, () => pickNextWord(pool, state, undefined, undefined, () => 1).word);
    expect(neutro).toEqual(sinBoost);
  });

  it('el boost hace salir más seguido la palabra, sin monopolizar el juego', () => {
    stubRandom(7);
    const picks = Array.from({ length: 600 }, () => pickNextWord(pool, emptySrsState(), undefined, undefined, n => (n.word === 'C' ? 2.5 : 1)).word);
    const shareC = picks.filter(w => w === 'C').length / picks.length;
    expect(shareC).toBeGreaterThan(1 / pool.length);
    // El SRS sigue mandando: las otras cinco no desaparecen.
    expect(shareC).toBeLessThan(0.5);
    expect(new Set(picks).size).toBe(pool.length);
  });

  it('acota el boost por más que le pidan un multiplicador absurdo', () => {
    stubRandom(3);
    const picks = Array.from({ length: 600 }, () => pickNextWord(pool, emptySrsState(), undefined, undefined, n => (n.word === 'C' ? 1000 : 1)).word);
    const shareC = picks.filter(w => w === 'C').length / picks.length;
    // Con tope 3 sobre un pool de 6, el techo teórico es 3/8 = 0.375.
    expect(shareC).toBeLessThan(0.45);
  });

  it('ignora un boost inválido en vez de romper la selección', () => {
    stubRandom(5);
    expect(() => pickNextWord(pool, emptySrsState(), undefined, undefined, () => NaN)).not.toThrow();
    expect(pool).toContain(pickNextWord(pool, emptySrsState(), undefined, undefined, () => NaN));
  });
});
