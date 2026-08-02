/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DifficultyMix, Noun } from './nouns';

export type SrsBox = 0 | 1 | 2 | 3 | 4 | 5;

export interface SrsCardState {
  box: SrsBox;
  /** Epoch ms. Used to schedule cards in boxes 1-5 (real-time spacing). */
  dueAt: number;
  /** Round counter. Used only for box 0, so a missed word resurfaces within the same session. */
  dueRound: number;
  lastSeen: number;
  /** Epoch ms of the first time this word was answered. Preserves the user's practice order. */
  firstSeenAt: number;
  totalSeen: number;
  totalCorrect: number;
  totalIncorrect: number;
}

export interface SrsState {
  version: 1;
  round: number;
  cards: Record<string, SrsCardState>;
}

export const SRS_STORAGE_KEY = 'genero_srs_v1';
const LEGACY_HISTORY_KEY = 'genero_history';

export const BOX_INTERVAL_MS: Record<Exclude<SrsBox, 0>, number> = {
  1: 10 * 60 * 1000,
  2: 24 * 60 * 60 * 1000,
  3: 3 * 24 * 60 * 60 * 1000,
  4: 7 * 24 * 60 * 60 * 1000,
  5: 14 * 24 * 60 * 60 * 1000,
};

export const BOX0_ROUND_DELAY = { min: 3, max: 6 };

const BOX_WEIGHT: Record<SrsBox, number> = { 0: 10, 1: 6, 2: 3, 3: 2, 4: 1, 5: 0.5 };
const UNSEEN_WEIGHT = 10;

export function emptySrsState(): SrsState {
  return { version: 1, round: 0, cards: {} };
}

/** Fills in `firstSeenAt` for cards persisted before that field existed, using key insertion order as the best available approximation of practice order. */
function backfillFirstSeenAt(state: SrsState): SrsState {
  const entries = Object.entries(state.cards);
  if (entries.every(([, card]) => card.firstSeenAt != null)) return state;
  const now = Date.now();
  const cards: Record<string, SrsCardState> = {};
  entries.forEach(([word, card], index) => {
    cards[word] = card.firstSeenAt != null ? card : { ...card, firstSeenAt: now + index };
  });
  return { ...state, cards };
}

export function loadSrsState(): SrsState {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && parsed.cards) return backfillFirstSeenAt(parsed as SrsState);
    }
  } catch (e) {
    console.error(e);
  }

  // One-time migration from the legacy binary correct/incorrect history model.
  try {
    const legacy = localStorage.getItem(LEGACY_HISTORY_KEY);
    if (legacy) {
      const parsed: Record<string, 'correct' | 'incorrect'> = JSON.parse(legacy);
      const now = Date.now();
      const cards: Record<string, SrsCardState> = {};
      Object.entries(parsed).forEach(([word, result], index) => {
        // No order info in the legacy model; approximate it with insertion order.
        const firstSeenAt = now + index;
        cards[word] = result === 'correct'
          ? { box: 2, dueAt: now + BOX_INTERVAL_MS[2], dueRound: 0, lastSeen: now, firstSeenAt, totalSeen: 1, totalCorrect: 1, totalIncorrect: 0 }
          : { box: 0, dueAt: now, dueRound: 3, lastSeen: now, firstSeenAt, totalSeen: 1, totalCorrect: 0, totalIncorrect: 1 };
      });
      const migrated: SrsState = { version: 1, round: 0, cards };
      persistSrsState(migrated);
      localStorage.removeItem(LEGACY_HISTORY_KEY);
      return migrated;
    }
  } catch (e) {
    console.error(e);
  }

  return emptySrsState();
}

export function persistSrsState(state: SrsState) {
  localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(state));
}

export function recordAnswer(state: SrsState, word: string, correct: boolean): SrsState {
  const prev = state.cards[word];
  const now = Date.now();
  const round = state.round + 1;
  let next: SrsCardState;

  if (correct) {
    const box = Math.min((prev?.box ?? -1) + 1, 5) as SrsBox;
    const interval = box === 0 ? 0 : BOX_INTERVAL_MS[box as Exclude<SrsBox, 0>];
    next = {
      box,
      dueAt: now + interval,
      dueRound: round,
      lastSeen: now,
      firstSeenAt: prev?.firstSeenAt ?? now,
      totalSeen: (prev?.totalSeen ?? 0) + 1,
      totalCorrect: (prev?.totalCorrect ?? 0) + 1,
      totalIncorrect: prev?.totalIncorrect ?? 0,
    };
  } else {
    const delay = BOX0_ROUND_DELAY.min + Math.floor(Math.random() * (BOX0_ROUND_DELAY.max - BOX0_ROUND_DELAY.min + 1));
    next = {
      box: 0,
      dueAt: now,
      dueRound: round + delay,
      lastSeen: now,
      firstSeenAt: prev?.firstSeenAt ?? now,
      totalSeen: (prev?.totalSeen ?? 0) + 1,
      totalCorrect: prev?.totalCorrect ?? 0,
      totalIncorrect: (prev?.totalIncorrect ?? 0) + 1,
    };
  }

  return { ...state, round, cards: { ...state.cards, [word]: next } };
}

export function isDue(noun: Noun, state: SrsState): boolean {
  const card = state.cards[noun.word];
  if (!card) return true;
  if (card.box === 0) return card.dueRound <= state.round;
  return card.dueAt <= Date.now();
}

function weightFor(noun: Noun, state: SrsState): number {
  const card = state.cards[noun.word];
  return card ? BOX_WEIGHT[card.box] : UNSEEN_WEIGHT;
}

function weightedRandomPick(pool: Noun[], state: SrsState): Noun {
  const weights = pool.map(n => weightFor(n, state));
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return pool[Math.floor(Math.random() * pool.length)];
  let target = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    target -= weights[i];
    if (target <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/**
 * Agrupa el pool por dificultad y elige una bolsa respetando las frecuencias de la
 * mezcla. Solo compiten las dificultades presentes en el pool: la cuota de una bolsa
 * vacía se reparte entre las demás.
 */
function pickBucket(pool: Noun[], mix: DifficultyMix): Noun[] {
  const buckets = new Map<Noun['difficulty'], Noun[]>();
  for (const noun of pool) {
    const list = buckets.get(noun.difficulty);
    if (list) list.push(noun);
    else buckets.set(noun.difficulty, [noun]);
  }

  const entries = [...buckets.entries()]
    .map(([difficulty, nouns]) => ({ nouns, share: mix[difficulty] ?? 0 }))
    .filter(entry => entry.share > 0);
  const totalShare = entries.reduce((sum, entry) => sum + entry.share, 0);
  if (totalShare <= 0) return pool;

  let target = Math.random() * totalShare;
  for (const entry of entries) {
    target -= entry.share;
    if (target <= 0) return entry.nouns;
  }
  return entries[entries.length - 1].nouns;
}

/**
 * Picks the next word to show. Prefers due/unseen cards so errors resurface soon
 * and mastered words stay spaced out; falls back to a box-weighted pick across the
 * whole pool so the game never runs out of cards even when everything is caught up.
 *
 * Con `mix`, primero sortea la dificultad según las frecuencias del nivel y recién
 * después aplica el SRS dentro de esa bolsa. El orden importa: si filtráramos por
 * vencidas antes de mezclar, las fáciles ya dominadas (agendadas a días vista)
 * desaparecerían del nivel avanzado y la mezcla quedaría en nada.
 */
export function pickNextWord(pool: Noun[], state: SrsState, avoidWord?: string, mix?: DifficultyMix): Noun {
  const candidates = pool.length > 1 ? pool.filter(n => n.word !== avoidWord) : pool;
  const bucket = mix ? pickBucket(candidates, mix) : candidates;
  const due = bucket.filter(n => isDue(n, state));
  const source = due.length > 0 ? due : bucket;
  return weightedRandomPick(source, state);
}
