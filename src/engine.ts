/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Difficulty, DifficultyMix, Noun, nounsData } from './nouns';
import { SrsState, pickNextWord, recordAnswer } from './srs';
import { ErrorPattern, ErrorsState, analyze, logAttempt } from './errors';
import { buildContrastQueue, patternToWorkOn, shouldEnqueueContrast } from './remediation';

export type Gender = Noun['gender'];

export const POINTS_BY_DIFFICULTY: Record<Difficulty, number> = { 'fácil': 10, 'medio': 20, 'difícil': 30 };

export interface Stats {
  score: number;
  streak: number;
  maxStreak: number;
}

export interface AnswerInput {
  noun: Noun;
  answer: Gender;
  srs: SrsState;
  errors: ErrorsState;
  stats: Stats;
  /** Latencia ya normalizada; `null` si no se pudo medir. */
  latency: number | null;
  now?: number;
}

export interface AnswerResult {
  isCorrect: boolean;
  srs: SrsState;
  errors: ErrorsState;
  stats: Stats;
  /** Patrón que esta respuesta acaba de dejar en `superado`, si alguno. */
  resolvedPattern: ErrorPattern | null;
}

/** Aplica una respuesta al SRS, al historial de errores y al puntaje. Sin efectos. */
export function applyAnswer({ noun, answer, srs, errors, stats, latency, now = Date.now() }: AnswerInput): AnswerResult {
  const isCorrect = noun.gender === answer;

  // Se registra antes de `recordAnswer` para guardar la caja *previa*: fallar una
  // palabra ya dominada es olvido, y no se trabaja igual que una confusión.
  const boxAtAnswer = srs.cards[noun.word]?.box ?? -1;
  const logged = logAttempt(errors, {
    w: noun.word,
    f: answer === 'femenino' ? 1 : 0,
    k: isCorrect ? 1 : 0,
    l: latency,
    b: boxAtAnswer,
    t: now,
  });
  const analyzed = analyze(logged, nounsData);
  const nextErrors: ErrorsState = { ...logged, patterns: analyzed.progress };

  const resolvedPattern = analyzed.patterns.find(
    p => p.status === 'superado' && errors.patterns[p.id]?.status !== 'superado',
  ) ?? null;

  // Los puntos siguen a la palabra, no al nivel: una fácil mezclada en difícil vale como fácil.
  const streak = isCorrect ? stats.streak + 1 : 0;
  const nextStats: Stats = {
    score: isCorrect ? stats.score + POINTS_BY_DIFFICULTY[noun.difficulty] : stats.score,
    streak,
    maxStreak: Math.max(stats.maxStreak, streak),
  };

  return {
    isCorrect,
    srs: recordAnswer(srs, noun.word, isCorrect),
    errors: nextErrors,
    stats: nextStats,
    resolvedPattern,
  };
}

/** Tanda de contraste pendiente y contadores que deciden cuándo armar la próxima. */
export interface ContrastState {
  queue: string[];
  answersInSession: number;
  answersSinceContrast: number;
}

export const emptyContrast = (): ContrastState => ({ queue: [], answersInSession: 0, answersSinceContrast: 0 });

export interface FollowUpInput {
  current: string;
  pool: Noun[];
  patterns: ErrorPattern[];
  srs: SrsState;
  mix: DifficultyMix;
  boost: (noun: Noun) => number;
  contrast: ContrastState;
}

/**
 * Siguiente palabra. La tanda de contraste tiene prioridad sobre el SRS: es una
 * lista ya elegida, y además así esquiva el sorteo de dificultad de `pickBucket`,
 * que en los niveles con mezcla dejaría al boost inerte parte de los turnos.
 * No muta `contrast`: devuelve el estado nuevo.
 */
export function pickFollowUp({ current, pool, patterns, srs, mix, boost, contrast }: FollowUpInput): { word: string; contrast: ContrastState } {
  const inPool = (word: string) => pool.some(n => n.word === word);
  let queue = contrast.queue;

  while (queue.length > 0) {
    const [word, ...rest] = queue;
    queue = rest;
    if (word !== current && inPool(word)) return { word, contrast: { ...contrast, queue } };
  }

  let answersSinceContrast = contrast.answersSinceContrast;
  const target = patternToWorkOn(patterns, pool);
  if (target && shouldEnqueueContrast(contrast.answersInSession, answersSinceContrast)) {
    const built = buildContrastQueue(target, pool, srs).map(n => n.word);
    if (built.length > 0) {
      const [word, ...rest] = built;
      answersSinceContrast = 0;
      queue = rest;
      if (word !== current) return { word, contrast: { ...contrast, queue, answersSinceContrast } };
    }
  }

  const word = pickNextWord(pool, srs, current, mix, boost).word;
  return { word, contrast: { ...contrast, queue, answersSinceContrast } };
}
