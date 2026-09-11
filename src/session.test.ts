/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { Noun } from './nouns';
import { emptySrsState, SrsCardState, SrsState } from './srs';
import { formatNextReview, sessionStatus } from './session';

const noun = (word: string): Noun =>
  ({ word, gender: 'masculino', difficulty: 'fácil', translation: '', rule: 'Terminación estándar -o', explanation: '', example: '' });

const pool = ['A', 'B', 'C', 'D'].map(w => noun(w));

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

/** Carta agendada por reloj (cajas 1–5). */
function scheduled(box: SrsCardState['box'], dueAt: number): SrsCardState {
  return { box, dueAt, dueRound: 0, lastSeen: NOW, firstSeenAt: NOW, totalSeen: 3, totalCorrect: 3, totalIncorrect: 0 };
}

/** Carta caja 0 agendada por ronda (recién fallada). */
function roundPending(dueRound: number): SrsCardState {
  return { box: 0, dueAt: NOW - 1, dueRound, lastSeen: NOW, firstSeenAt: NOW, totalSeen: 1, totalCorrect: 0, totalIncorrect: 1 };
}

function stateWith(round: number, cards: Record<string, SrsCardState>): SrsState {
  return { ...emptySrsState(), round, cards };
}

describe('sessionStatus', () => {
  it('con estado vacío todas están vencidas y no está al día', () => {
    const status = sessionStatus(pool, emptySrsState(), NOW);
    expect(status.dueCount).toBe(pool.length);
    expect(status.caughtUp).toBe(false);
    expect(status.scheduledCount).toBe(0);
    expect(status.nextReviewAt).toBeNull();
  });

  it('con todo agendado a futuro está al día y reporta el próximo repaso', () => {
    const state = stateWith(9, {
      A: scheduled(3, NOW + 3 * 24 * 60 * 60 * 1000),
      B: scheduled(4, NOW + 24 * 60 * 60 * 1000),
      C: scheduled(3, NOW + 7 * 24 * 60 * 60 * 1000),
      D: scheduled(5, NOW + 14 * 24 * 60 * 60 * 1000),
    });
    const status = sessionStatus(pool, state, NOW);
    expect(status.dueCount).toBe(0);
    expect(status.caughtUp).toBe(true);
    expect(status.scheduledCount).toBe(4);
    // El más próximo es B, a un día.
    expect(status.nextReviewAt).toBe(NOW + 24 * 60 * 60 * 1000);
  });

  it('no está al día si queda una caja 0 pendiente por ronda (no se traba)', () => {
    const state = stateWith(2, {
      A: scheduled(3, NOW + 24 * 60 * 60 * 1000),
      B: scheduled(4, NOW + 24 * 60 * 60 * 1000),
      C: scheduled(3, NOW + 24 * 60 * 60 * 1000),
      D: roundPending(5), // fallada, resurge en la ronda 5; la actual es la 2.
    });
    const status = sessionStatus(pool, state, NOW);
    expect(status.dueCount).toBe(0);
    expect(status.caughtUp).toBe(false);
  });

  it('nextReviewAt ignora las caja 0 (dueAt en el pasado) y toma la caja>0 más próxima', () => {
    const state = stateWith(9, {
      A: roundPending(20), // dueAt en el pasado; no debe ganar.
      B: scheduled(2, NOW + 2 * 60 * 60 * 1000),
      C: scheduled(3, NOW + 5 * 24 * 60 * 60 * 1000),
      D: scheduled(1, NOW + 30 * 60 * 1000),
    });
    const status = sessionStatus(pool, state, NOW);
    expect(status.nextReviewAt).toBe(NOW + 30 * 60 * 1000);
    expect(status.scheduledCount).toBe(3);
  });

  it('no muta el estado ni el pool', () => {
    const state = stateWith(9, { A: scheduled(3, NOW + DAY) });
    const snapshot = JSON.stringify(state);
    const poolSnapshot = JSON.stringify(pool);
    sessionStatus(pool, state, NOW);
    expect(JSON.stringify(state)).toBe(snapshot);
    expect(JSON.stringify(pool)).toBe(poolSnapshot);
  });
});

describe('formatNextReview', () => {
  it('null devuelve vacío', () => {
    expect(formatNextReview(null, NOW)).toBe('');
  });

  it('menos de una hora: "en un rato"', () => {
    expect(formatNextReview(NOW + 30 * 60 * 1000, NOW)).toBe('en un rato');
  });

  it('mismo día, más de una hora: "en N h"', () => {
    expect(formatNextReview(NOW + 3 * 60 * 60 * 1000, NOW)).toBe('en 3 h');
  });

  it('día calendario siguiente: "mañana"', () => {
    const today9am = new Date(2023, 10, 14, 9, 0, 0).getTime();
    const tomorrow9am = new Date(2023, 10, 15, 9, 0, 0).getTime();
    expect(formatNextReview(tomorrow9am, today9am)).toBe('mañana');
  });

  it('varios días adelante: "en N días"', () => {
    const day0 = new Date(2023, 10, 14, 9, 0, 0).getTime();
    const day3 = new Date(2023, 10, 17, 9, 0, 0).getTime();
    expect(formatNextReview(day3, day0)).toBe('en 3 días');
  });

  it('pasado o ahora: "ahora"', () => {
    expect(formatNextReview(NOW - 1000, NOW)).toBe('ahora');
  });
});
