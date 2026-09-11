/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Noun } from './nouns';
import { SrsState, isDue } from './srs';

/**
 * Estado de la sesión de repaso sobre un pool. Todo se **deriva** del SRS: no se
 * persiste nada ni se agrega estado nuevo. Existe para que la app sepa cuándo el
 * usuario terminó lo que tenía que repasar (y no siga sirviendo repaso vacío) y
 * cuándo lo espera el próximo.
 */
export interface SessionStatus {
  /** Palabras del pool vencidas ahora (incluye no vistas). */
  dueCount: number;
  /** true = no queda nada por repasar en el pool. */
  caughtUp: boolean;
  /** Epoch ms del próximo repaso agendado, o null si no hay ninguno. */
  nextReviewAt: number | null;
  /** Palabras del pool con repaso a futuro (cajas 1–5 no vencidas). */
  scheduledCount: number;
}

/**
 * Clasifica el pool en vencidas / agendadas y decide si la sesión terminó.
 *
 * `caughtUp` exige, además de que no haya nada vencido, que no quede ninguna carta
 * caja 0 pendiente por ronda: una palabra recién fallada se reagenda unas rondas
 * adelante (no está "vencida" por reloj, pero la sesión no terminó). Sin ese
 * cuidado la app mostraría "estás al día" y quedaría trabada, porque las rondas
 * solo avanzan al responder.
 *
 * `nextReviewAt` mira solo cajas 1–5: la caja 0 se agenda por ronda y su `dueAt`
 * quedó en el pasado, así que no dice nada del reloj.
 */
export function sessionStatus(pool: Noun[], state: SrsState, now: number = Date.now()): SessionStatus {
  let dueCount = 0;
  let scheduledCount = 0;
  let nextReviewAt: number | null = null;
  let pendingRoundCard = false;

  for (const noun of pool) {
    if (isDue(noun, state, now)) {
      dueCount += 1;
      continue;
    }
    // No vencida: o es caja 0 esperando su ronda, o es caja 1–5 agendada por reloj.
    const card = state.cards[noun.word];
    if (!card) continue; // no debería pasar (una no vista siempre está vencida), pero por las dudas.
    if (card.box === 0) {
      pendingRoundCard = true;
      continue;
    }
    scheduledCount += 1;
    if (nextReviewAt === null || card.dueAt < nextReviewAt) nextReviewAt = card.dueAt;
  }

  return {
    dueCount,
    caughtUp: dueCount === 0 && !pendingRoundCard,
    nextReviewAt,
    scheduledCount,
  };
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Tiempo relativo hasta el próximo repaso, en rioplatense y sin exceso de jerga.
 * "mañana" se decide por día de calendario, no por bloques de 24 h: un repaso a las
 * 20 h de hoy no es "mañana" aunque falten menos de 24 h para uno de las 09 h.
 */
export function formatNextReview(nextReviewAt: number | null, now: number = Date.now()): string {
  if (nextReviewAt === null) return '';
  const delta = nextReviewAt - now;
  if (delta <= 0) return 'ahora';
  if (delta < HOUR_MS) return 'en un rato';
  if (delta < DAY_MS) {
    const hours = Math.max(1, Math.round(delta / HOUR_MS));
    return `en ${hours} h`;
  }

  const startOfDay = (ts: number) => {
    const d = new Date(ts);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };
  const days = Math.round((startOfDay(nextReviewAt) - startOfDay(now)) / DAY_MS);
  if (days <= 1) return 'mañana';
  return `en ${days} días`;
}
