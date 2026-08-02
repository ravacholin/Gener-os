/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Intervención sobre los patrones detectados. Detectar una confusión no sirve de
 * nada si después el juego sigue igual; acá está la mitad que la corrige.
 *
 * Dos mecanismos, deliberadamente distintos:
 *
 * - El **boost** inclina la selección del SRS hacia las palabras del patrón. Es
 *   ambiental y suave: el SRS sigue mandando.
 * - Las **tandas de contraste** son la intervención pedagógica real. Repetir
 *   problema, tema, idioma y sistema en fila enseña a decir "masculino" cuatro
 *   veces, no a discriminar; lo que arregla una confusión es el par mínimo, alternar
 *   la palabra trampa con la vecina que se le parece y va al revés.
 *
 * Que sean dos y no uno tiene una razón arquitectónica: `pickBucket` sortea la bolsa
 * de dificultad *antes* de aplicar pesos, así que en niveles con mezcla el boost
 * queda inerte en una parte de los turnos. La tanda es una lista pre-seleccionada y
 * por lo tanto esquiva ese sorteo por completo.
 */

import { Noun } from './nouns';
import { SrsState } from './srs';
import { CONTRAST_FAMILY, Family, familyOf, MIXED_GENDER_FAMILIES } from './insights';
import { activePatterns, ErrorPattern, patternIncludes, surfaceEnding } from './errors';

/** Tope del multiplicador. Es lo que mantiene al SRS al mando: el boost inclina, no secuestra. */
export const BOOST_CAP = 3;
export const BOOST_TOP = 2.5;
export const BOOST_OTHER = 1.6;

/** Palabras del patrón que tienen que existir en el pool activo para intervenir. */
export const MIN_POOL_WORDS = 4;

export const CONTRAST_MIN = 4;
export const CONTRAST_MAX = 6;
/** Respuestas antes de la primera tanda: no se le arma un drill a quien recién abre la app. */
export const CONTRAST_WARMUP = 15;
/** Respuestas entre tandas. */
export const CONTRAST_COOLDOWN = 25;

/**
 * Multiplicador de peso por sustantivo. Se aplica en `weightFor`, o sea *después*
 * del sorteo de dificultad, así que no altera las proporciones de `LEVEL_MIX`.
 */
export function patternBoost(patterns: ErrorPattern[]): (noun: Noun) => number {
  const active = activePatterns(patterns);
  if (active.length === 0) return () => 1;
  const [top, ...rest] = active;
  return (noun: Noun) => {
    if (patternIncludes(top, noun)) return BOOST_TOP;
    return rest.some(p => patternIncludes(p, noun)) ? BOOST_OTHER : 1;
  };
}

/** Palabras del patrón presentes en el pool activo. */
export function patternWordsInPool(pattern: ErrorPattern, pool: Noun[]): Noun[] {
  return pool.filter(noun => patternIncludes(pattern, noun));
}

/**
 * Un patrón puede quedar sin material: se detectó en difícil y el usuario bajó a
 * fácil, donde no existe ninguna de sus palabras. Se lo sigue mostrando en el panel
 * — el patrón lo espera cuando vuelva — pero no genera tanda.
 */
export function isLatent(pattern: ErrorPattern, pool: Noun[]): boolean {
  return patternWordsInPool(pattern, pool).length < MIN_POOL_WORDS;
}

/** Lema de un homónimo, sin la acepción: "Cometa (espacial)" → "cometa". */
function lemma(word: string): string {
  return word.replace(/\s*\([^)]*\)\s*/g, '').trim().toLowerCase();
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const boxOf = (noun: Noun, srs: SrsState): number => srs.cards[noun.word]?.box ?? -1;

/**
 * Lado A: lo que falla. Primero las palabras con error registrado, después las poco
 * consolidadas, después las que nunca vio.
 */
function sideA(pattern: ErrorPattern, pool: Noun[], srs: SrsState, rng: () => number): Noun[] {
  const failed = new Set(pattern.words);
  return shuffle(patternWordsInPool(pattern, pool), rng)
    .sort((a, b) => {
      const byFailed = Number(failed.has(b.word)) - Number(failed.has(a.word));
      if (byFailed !== 0) return byFailed;
      return boxOf(a, srs) - boxOf(b, srs);
    });
}

/**
 * Lado B: el ancla contra la que se contrasta. Se ordena por caja descendente a
 * propósito — tiene que ser lo que el usuario **ya sabe**. Si el lado B también
 * falla, la tanda deja de ser discriminación y pasa a ser frustración.
 */
function sideB(pattern: ErrorPattern, a: Noun[], pool: Noun[], srs: SrsState, rng: () => number): Noun[] {
  const exclude = new Set(a.map(n => n.word));
  const majority = a.filter(n => n.gender === 'masculino').length >= a.length / 2 ? 'masculino' : 'femenino';
  const opposite = majority === 'masculino' ? 'femenino' : 'masculino';
  const family = pattern.family;

  const rank = (items: Noun[]) => shuffle(items, rng).sort((x, y) => boxOf(y, srs) - boxOf(x, srs));
  const candidates = pool.filter(n => !exclude.has(n.word));

  // 1. Homónimos: el dataset ya trae las dos acepciones como entradas separadas.
  //    "el cometa" contra "la cometa" es el par mínimo perfecto, mismo significante.
  if (family === 'homonimo') {
    const bases = new Set(a.map(n => lemma(n.word)));
    const pairs = candidates.filter(n => bases.has(lemma(n.word)) && n.gender === opposite);
    if (pairs.length >= 2) return rank(pairs);
  }

  // 2. Familias que ya contienen los dos géneros: el mejor contraste es interno,
  //    misma terminación y género opuesto (el puente / la llave).
  if (family && MIXED_GENDER_FAMILIES.includes(family)) {
    const inside = candidates.filter(n => familyOf(n) === family && n.gender === opposite);
    if (inside.length >= 2) return rank(inside);
  }

  // 3. Familias de un solo género: la familia declarada como su contraste.
  const contrast: Family | undefined = family ? CONTRAST_FAMILY[family] : undefined;
  if (contrast) {
    const outside = candidates.filter(n => familyOf(n) === contrast && n.gender === opposite);
    if (outside.length >= 2) return rank(outside);
  }

  // 4. Sin familia (palabras resistentes, sesgo): misma terminación, género opuesto.
  const endings = new Set(a.map(n => surfaceEnding(n.word, 1)));
  const sameEnding = candidates.filter(n => endings.has(surfaceEnding(n.word, 1)) && n.gender === opposite);
  if (sameEnding.length >= 2) return rank(sameEnding);

  return [];
}

/**
 * Alterna los dos lados evitando que la secuencia de respuestas correctas quede
 * perfectamente alternada.
 *
 * Es una trampa fácil de pasar por alto: si la tanda va A,B,A,B y A es masculino y
 * B femenino, la respuesta correcta es M,F,M,F y se resuelve entera alternando sin
 * leer una sola palabra. Se exige que no haya corridas de 3 del mismo género (se
 * perdería el contraste) pero sí al menos una repetición (se rompe la predicción).
 */
export function arrangeContrast(a: Noun[], b: Noun[], rng: () => number): Noun[] {
  const interleaved: Noun[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) interleaved.push(a[i]);
    if (b[i]) interleaved.push(b[i]);
  }

  const acceptable = (seq: Noun[]) => {
    let run = 1;
    let hasRepeat = false;
    for (let i = 1; i < seq.length; i++) {
      if (seq[i].gender === seq[i - 1].gender) {
        run += 1;
        hasRepeat = true;
        if (run >= 3) return false;
      } else {
        run = 1;
      }
    }
    return hasRepeat;
  };

  if (acceptable(interleaved)) return interleaved;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = shuffle(interleaved, rng);
    if (acceptable(candidate)) return candidate;
  }
  return interleaved;
}

/**
 * Arma la tanda de contraste de un patrón. Devuelve `[]` si no hay material: sin
 * lado B no hay contraste, y repetir el lado A en fila sería peor que no hacer nada.
 */
export function buildContrastQueue(
  pattern: ErrorPattern,
  pool: Noun[],
  srs: SrsState,
  rng: () => number = Math.random,
): Noun[] {
  if (pattern.kind === 'speed') return [];
  if (isLatent(pattern, pool)) return [];

  const half = Math.ceil(CONTRAST_MAX / 2);
  const a = sideA(pattern, pool, srs, rng).slice(0, half);
  if (a.length < 2) return [];

  const b = sideB(pattern, a, pool, srs, rng).slice(0, half);
  if (b.length < 2) return [];

  const trimmed = Math.min(a.length, b.length);
  const queue = arrangeContrast(a.slice(0, trimmed), b.slice(0, trimmed), rng);
  return queue.length >= CONTRAST_MIN ? queue.slice(0, CONTRAST_MAX) : [];
}

/**
 * Cuándo corresponde armar una tanda. Espaciadas a propósito: la remediación tiene
 * que sentirse como que el juego sabe lo que te cuesta, no como un castigo.
 */
export function shouldEnqueueContrast(answersInSession: number, answersSinceLastContrast: number): boolean {
  if (answersInSession < CONTRAST_WARMUP) return false;
  return answersSinceLastContrast >= CONTRAST_COOLDOWN;
}

/** El patrón sobre el que conviene trabajar ahora, o `null`. */
export function patternToWorkOn(patterns: ErrorPattern[], pool: Noun[]): ErrorPattern | null {
  return activePatterns(patterns).find(p => p.kind !== 'speed' && !isLatent(p, pool)) ?? null;
}

/** Micro-lección para el reveal: el patrón activo al que pertenece la palabra fallada. */
export function lessonFor(patterns: ErrorPattern[], noun: Noun): ErrorPattern | null {
  return activePatterns(patterns).find(p => p.kind !== 'speed' && patternIncludes(p, noun)) ?? null;
}
