/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Inteligencia de errores.
 *
 * El SRS sabe qué palabra fallaste; esto sabe *por qué*. Registra cada intento con
 * algo más que un booleano, agrupa los errores en patrones y decide, con un criterio
 * estadístico explícito, cuáles de esos patrones son reales y cuándo están superados.
 *
 * Todo es lógica pura y determinista: la única dependencia externa es `Date.now()`,
 * que siempre se puede inyectar. Nada de esto sale del dispositivo.
 */

import { Noun } from './nouns';
import {
  BIAS_INSIGHT, Family, FAMILY_INSIGHT, familyOf,
  LEECH_INSIGHT, SPEED_INSIGHT, TRAP_INSIGHT,
} from './insights';

// --- Persistencia -----------------------------------------------------------

export const ERRORS_STORAGE_KEY = 'genero_errors_v1';

/** Intentos que se guardan. 400 × ~55 B ≈ 22 KB, holgado para localStorage. */
export const LOG_CAPACITY = 400;

/**
 * Un intento. Las claves son de una letra a propósito: se serializan cientos de
 * estos objetos y `JSON.stringify` repite el nombre de cada campo en cada uno.
 *
 * Sólo se guarda señal cruda. La familia y la terminación se derivan al leer, a
 * partir del `Noun`, para que editar el dataset no invalide el historial.
 */
export interface Attempt {
  /** `noun.word`, la misma clave que usa `SrsState.cards`. */
  w: string;
  /** El usuario eligió femenino. */
  f: 0 | 1;
  /** Acertó. */
  k: 0 | 1;
  /** Latencia en ms; `null` si superó `MAX_LATENCY_MS` (dejó el teléfono) o no se midió. */
  l: number | null;
  /** Caja SRS al momento de responder: distingue el olvido tras dominio de la confusión. */
  b: number;
  /** Epoch ms. */
  t: number;
}

export interface ErrorsState {
  version: 1;
  /** Ring buffer; el más viejo primero. */
  log: Attempt[];
  /** Estado persistido por patrón. Sobrevive a que su evidencia salga del log. */
  patterns: Record<string, PatternProgress>;
}

export function emptyErrorsState(): ErrorsState {
  return { version: 1, log: [], patterns: {} };
}

export function loadErrorsState(): ErrorsState {
  try {
    const raw = localStorage.getItem(ERRORS_STORAGE_KEY);
    if (!raw) return emptyErrorsState();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && Array.isArray(parsed.log)) {
      return { version: 1, log: parsed.log, patterns: parsed.patterns ?? {} };
    }
  } catch (e) {
    console.error(e);
  }
  return emptyErrorsState();
}

export function persistErrorsState(state: ErrorsState) {
  try {
    localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Cuota llena: perder el historial de errores nunca debe romper el juego.
    console.error(e);
  }
}

/** Agrega un intento y recorta el buffer. */
export function logAttempt(state: ErrorsState, attempt: Attempt): ErrorsState {
  const log = [...state.log, attempt];
  return { ...state, log: log.length > LOG_CAPACITY ? log.slice(log.length - LOG_CAPACITY) : log };
}

/** Latencias mayores a esto son "se fue a hacer otra cosa", no una respuesta lenta. */
export const MAX_LATENCY_MS = 30_000;

/** Normaliza una latencia medida al valor que se guarda. */
export function normalizeLatency(ms: number | null | undefined): number | null {
  if (ms == null || !Number.isFinite(ms) || ms < 0 || ms > MAX_LATENCY_MS) return null;
  return Math.round(ms);
}

// --- Features lingüísticas --------------------------------------------------

/**
 * Últimas letras del lema, en minúscula y sin el desambiguador entre paréntesis:
 * "Cometa (espacial)" → "eta". Los 41 homónimos del dataset traen paréntesis y sin
 * esto la terminación saldría ")".
 */
export function surfaceEnding(word: string, n = 2): string {
  const lemma = word.replace(/\s*\([^)]*\)\s*/g, '').trim().toLowerCase();
  return lemma.slice(-n);
}

export type TrapKind = 'a-masculina' | 'o-femenina' | 'a-tonica';

/**
 * La terminación superficial predice el género contrario al real. Son las palabras
 * donde el usuario no se equivoca por no saber, sino por aplicar bien una regla que
 * acá no vale: el problema, la mano.
 */
export function endingTrap(noun: Noun): 'a-masculina' | 'o-femenina' | null {
  const last = surfaceEnding(noun.word, 1);
  if (last === 'a' && noun.gender === 'masculino') return 'a-masculina';
  if (last === 'o' && noun.gender === 'femenino') return 'o-femenina';
  return null;
}

// --- Estadística ------------------------------------------------------------

/**
 * Cota inferior del intervalo de Wilson para una proporción.
 *
 * Es lo que separa un patrón de una racha de mala suerte: 3 errores en 4 intentos da
 * una tasa cruda de 75%, pero la cota inferior es ~40% — no alcanza para acusar a
 * nadie. Con 12 errores en 16 la cota sube a ~59% y ahí sí hay evidencia.
 */
export function wilsonLower(successes: number, n: number, z = WILSON_Z): number {
  if (n <= 0) return 0;
  const p = successes / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = p + z2 / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n));
  return Math.max(0, (centre - margin) / denom);
}

/**
 * z = 1.28 (80% de confianza), no 1.96. En una app de estudio el costo de practicar
 * de más una familia que en realidad estaba sana es bajo; el de no detectar una
 * confusión real es alto. La asimetría del costo justifica bajar el listón.
 */
export const WILSON_Z = 1.28;

/** Sin este mínimo de intentos totales no se detecta nada: no hay línea base contra qué comparar. */
export const COLD_START_ATTEMPTS = 20;

export const MIN_GROUP_ATTEMPTS = 5;
export const MIN_GROUP_ERRORS = 3;
/**
 * Errores en palabras *distintas*. Es el umbral que separa "no entendés la regla" de
 * "esta palabra no te entra": sin él, alguien que falla siempre *altavoz* haría
 * disparar toda la familia de terminaciones en -z, y la intervención correcta para
 * eso no es una tanda de contraste sino repetir la palabra. Wilson controla el ruido
 * en la tasa; esto controla la concentración, que es un problema distinto.
 */
export const MIN_DISTINCT_ERROR_WORDS = 3;
/** Cuánto tiene que superar el grupo a la línea base del usuario para contar como patrón. */
export const EXCESS_OVER_BASELINE = 0.1;
/** Piso de la línea base: sin él, un usuario casi perfecto vería patrones en cualquier tropiezo. */
export const BASELINE_FLOOR = 0.06;
/**
 * Patrones que reciben intervención a la vez. La atención es el recurso escaso y los
 * boosts se multiplican: trabajar tres confusiones en paralelo es no trabajar ninguna.
 */
export const MAX_INTERVENED = 2;

export const BIAS_MIN_ERRORS = 4;
export const BIAS_GAP = 0.15;

/** Por debajo de esto no llegó a leer la palabra: es automatismo, no decisión. */
export const FAST_MS = 1200;
/** Por encima de esto la acertó razonando, no recordando. */
export const SLOW_MS = 6000;
export const FRAGILE_MIN_SLOW = 6;
export const FRAGILE_SHARE = 0.25;

export const LEECH_MIN_ERRORS = 3;

// Máquina de estado.
export const IMPROVE_HITS = 5;
export const RESOLVE_HITS = 8;
/**
 * Ocho aciertos seguidos dentro de la misma tanda de contraste son memoria de
 * trabajo, no aprendizaje. Exigir que la racha abarque media hora obliga a que el
 * patrón sobreviva a un intervalo, que es la única prueba de que se consolidó.
 */
export const RESOLVE_SPAN_MS = 30 * 60 * 1000;
/** Un tropiezo aislado no reabre un patrón cerrado. */
export const RELAPSE_ERRORS = 3;

// --- Patrones ---------------------------------------------------------------

export type PatternKind = 'family' | 'trap' | 'bias' | 'speed' | 'leech';
export type PatternStatus = 'activo' | 'mejorando' | 'superado';

export interface ErrorPattern {
  /** `family:masculino-en-a`, `trap:a-tonica`, `bias:falso-masculino`, `speed:impulsivo`, `leech`. */
  id: string;
  kind: PatternKind;
  label: string;
  /** La regla en una línea, para la micro-lección. */
  tip: string;
  examples: string[];
  attempts: number;
  errors: number;
  errorRate: number;
  /** Peor tasa alcanzada; con `errorRate` cuenta la historia de la mejora. */
  peakRate: number;
  /** Certeza (cota de Wilson) ponderada por volumen. Ordena la lista. */
  severity: number;
  status: PatternStatus;
  /** Familia implicada, si la hay. `remediation.ts` la usa para expandir el patrón. */
  family?: Family;
  /** Palabras con error registrado en este patrón, de la más fallada a la menos. */
  words: string[];
  /** Aciertos consecutivos actuales dentro del patrón. */
  hits: number;
}

export interface PatternProgress {
  status: PatternStatus;
  peakRate: number;
  /** Momento en que pasó a `superado` por primera vez; se limpia si recae. */
  resolvedAt?: number;
}

export interface Analysis {
  patterns: ErrorPattern[];
  /** Estado persistido actualizado. Idempotente: correr `analyze` dos veces da lo mismo. */
  progress: Record<string, PatternProgress>;
  /** Tasa de error global del usuario en el log. */
  baseline: number;
  attempts: number;
}

export function emptyAnalysis(): Analysis {
  return { patterns: [], progress: {}, baseline: 0, attempts: 0 };
}

/** Intento resuelto contra el dataset. */
interface Resolved {
  attempt: Attempt;
  noun: Noun;
  family: Family;
}

interface Group {
  id: string;
  kind: PatternKind;
  label: string;
  tip: string;
  examples: string[];
  family?: Family;
  attempts: number;
  errors: number;
  /** Palabra → cantidad de errores. */
  wordErrors: Map<string, number>;
  /** Intentos del grupo, en orden cronológico. Se usa para la racha. */
  timeline: Resolved[];
}

function newGroup(id: string, kind: PatternKind, label: string, tip: string, examples: string[], family?: Family): Group {
  return { id, kind, label, tip, examples, family, attempts: 0, errors: 0, wordErrors: new Map(), timeline: [] };
}

function addToGroup(groups: Map<string, Group>, group: Group, r: Resolved) {
  const g = groups.get(group.id) ?? group;
  if (!groups.has(group.id)) groups.set(group.id, g);
  g.attempts += 1;
  g.timeline.push(r);
  if (!r.attempt.k) {
    g.errors += 1;
    g.wordErrors.set(r.noun.word, (g.wordErrors.get(r.noun.word) ?? 0) + 1);
  }
}

/** Racha de aciertos consecutivos al final del timeline, y cuándo arrancó. */
function currentStreak(timeline: Resolved[]): { hits: number; firstHitAt: number } {
  let hits = 0;
  let firstHitAt = 0;
  for (let i = timeline.length - 1; i >= 0; i--) {
    if (!timeline[i].attempt.k) break;
    hits += 1;
    firstHitAt = timeline[i].attempt.t;
  }
  return { hits, firstHitAt };
}

/**
 * Línea base *excluyendo al propio grupo*. Sin esto, los grupos grandes se cancelan
 * solos: `estandar-o` es el 24% del dataset y buena parte del tráfico, así que sus
 * errores dominan la línea base contra la que se lo compara y nunca podría destacarse.
 * Con pocos datos afuera del grupo la exclusión es más ruidosa que útil, y ahí se
 * vuelve a la global.
 */
function baselineFor(group: Group, totalAttempts: number, totalErrors: number): number {
  const restAttempts = totalAttempts - group.attempts;
  const restErrors = totalErrors - group.errors;
  const rate = restAttempts >= 10 ? restErrors / restAttempts : totalErrors / Math.max(1, totalAttempts);
  return Math.max(BASELINE_FLOOR, rate);
}

function isOverThreshold(group: Group, baseline: number): boolean {
  if (group.attempts < MIN_GROUP_ATTEMPTS || group.errors < MIN_GROUP_ERRORS) return false;
  if (group.wordErrors.size < MIN_DISTINCT_ERROR_WORDS) return false;
  return wilsonLower(group.errors, group.attempts) > baseline + EXCESS_OVER_BASELINE;
}

/**
 * Estado del patrón. No es una máquina que "avanza" un paso por llamada sino una
 * clasificación pura de la racha actual: correrla dos veces sobre el mismo log da
 * exactamente el mismo resultado, así que se puede recalcular en cada render sin
 * que el patrón se escape solo hacia `superado`.
 */
function statusFor(group: Group, prev: PatternProgress | undefined, now: number): PatternStatus {
  if (prev?.status === 'superado' && prev.resolvedAt) {
    const errorsAfter = group.timeline.filter(r => r.attempt.t > prev.resolvedAt! && !r.attempt.k).length;
    return errorsAfter >= RELAPSE_ERRORS ? 'activo' : 'superado';
  }
  const { hits, firstHitAt } = currentStreak(group.timeline);
  if (hits >= RESOLVE_HITS && firstHitAt > 0 && now - firstHitAt >= RESOLVE_SPAN_MS) return 'superado';
  if (hits >= IMPROVE_HITS) return 'mejorando';
  return 'activo';
}

/**
 * Detecta los patrones de error del usuario y actualiza su estado.
 *
 * Devuelve `[]` mientras no haya `COLD_START_ATTEMPTS` intentos: sin línea base
 * propia, cualquier agrupación es ruido y la app se pondría a "corregir" cosas que
 * el usuario todavía no hizo mal.
 */
export function analyze(state: ErrorsState, nouns: Noun[], now = Date.now()): Analysis {
  const byWord = new Map(nouns.map(n => [n.word, n]));
  const resolved: Resolved[] = [];
  for (const attempt of state.log) {
    const noun = byWord.get(attempt.w);
    if (noun) resolved.push({ attempt, noun, family: familyOf(noun) });
  }

  if (resolved.length < COLD_START_ATTEMPTS) {
    return { patterns: [], progress: state.patterns, baseline: 0, attempts: resolved.length };
  }

  const totalErrors = resolved.filter(r => !r.attempt.k).length;
  const baseline = totalErrors / resolved.length;
  const groups = new Map<string, Group>();

  for (const r of resolved) {
    const fam = FAMILY_INSIGHT[r.family];
    addToGroup(groups, newGroup(`family:${r.family}`, 'family', fam.label, fam.tip, fam.examples, r.family), r);

    const trap = endingTrap(r.noun);
    if (trap) {
      const t = TRAP_INSIGHT[trap];
      addToGroup(groups, newGroup(`trap:${trap}`, 'trap', t.label, t.tip, t.examples), r);
    }
    if (r.family === 'a-tonica') {
      const t = TRAP_INSIGHT['a-tonica'];
      addToGroup(groups, newGroup('trap:a-tonica', 'trap', t.label, t.tip, t.examples, 'a-tonica'), r);
    }
  }

  // Sesgo de género: no se mide contando respuestas "masculino" (el dataset no está
  // balanceado), sino comparando la tasa de error sobre femeninas contra la tasa
  // sobre masculinas. Si fallás mucho más las femeninas es porque ante la duda tirás
  // para masculino.
  for (const [target, id] of [['femenino', 'bias:falso-masculino'], ['masculino', 'bias:falso-femenino']] as const) {
    const own = resolved.filter(r => r.noun.gender === target);
    const other = resolved.filter(r => r.noun.gender !== target);
    if (own.length < MIN_GROUP_ATTEMPTS || other.length < MIN_GROUP_ATTEMPTS) continue;
    const ownErrors = own.filter(r => !r.attempt.k).length;
    const otherRate = other.filter(r => !r.attempt.k).length / other.length;
    if (ownErrors < BIAS_MIN_ERRORS) continue;
    if (wilsonLower(ownErrors, own.length) <= otherRate + BIAS_GAP) continue;
    const insight = BIAS_INSIGHT[id === 'bias:falso-masculino' ? 'falso-masculino' : 'falso-femenino'];
    const g = newGroup(id, 'bias', insight.label, insight.tip, insight.examples);
    groups.set(id, g);
    for (const r of own) addToGroup(groups, g, r);
  }

  // Impulsividad: errores en menos de FAST_MS.
  const fast = resolved.filter(r => r.attempt.l != null && r.attempt.l < FAST_MS);
  if (fast.length >= MIN_GROUP_ATTEMPTS) {
    const g = newGroup('speed:impulsivo', 'speed', SPEED_INSIGHT.impulsivo.label, SPEED_INSIGHT.impulsivo.tip, []);
    groups.set(g.id, g);
    for (const r of fast) addToGroup(groups, g, r);
  }

  // Fragilidad: aciertos lentos. No es un patrón de error — por eso no pasa por el
  // umbral de Wilson — sino de conocimiento no automatizado, que el SRS premia igual
  // que a un acierto instantáneo y por lo tanto aleja de la práctica.
  const slowHits = resolved.filter(r => r.attempt.k === 1 && r.attempt.l != null && r.attempt.l > SLOW_MS);
  const totalHits = resolved.length - totalErrors;
  const fragile = slowHits.length >= FRAGILE_MIN_SLOW && totalHits > 0 && slowHits.length / totalHits > FRAGILE_SHARE;

  // Palabras que se resisten: falladas muchas veces, o falladas ya estando dominadas
  // (caja >= 3), que es olvido y no confusión.
  const leechWords = new Map<string, number>();
  const perWordErrors = new Map<string, number>();
  for (const r of resolved) {
    if (r.attempt.k) continue;
    const n = (perWordErrors.get(r.noun.word) ?? 0) + 1;
    perWordErrors.set(r.noun.word, n);
    if (n >= LEECH_MIN_ERRORS || r.attempt.b >= 3) leechWords.set(r.noun.word, n);
  }

  const patterns: ErrorPattern[] = [];
  const progress: Record<string, PatternProgress> = {};

  const emit = (group: Group, opts: { forced?: boolean; words?: string[] } = {}) => {
    const prev = state.patterns[group.id];
    const groupBaseline = baselineFor(group, resolved.length, totalErrors);
    const over = opts.forced ?? isOverThreshold(group, groupBaseline);
    // Un patrón ya conocido sigue en la lista aunque hoy no cruce el umbral: eso es
    // exactamente lo que se quiere ver cuando el usuario lo está superando.
    if (!over && !prev) return;

    const errorRate = group.attempts > 0 ? group.errors / group.attempts : 0;
    const status = statusFor(group, prev, now);
    const peakRate = Math.max(prev?.peakRate ?? 0, errorRate);
    const resolvedAt = status === 'superado' ? (prev?.status === 'superado' ? prev.resolvedAt : now) : undefined;

    progress[group.id] = resolvedAt ? { status, peakRate, resolvedAt } : { status, peakRate };

    const words = opts.words ?? [...group.wordErrors.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([word]) => word);

    patterns.push({
      id: group.id,
      kind: group.kind,
      label: group.label,
      tip: group.tip,
      examples: group.examples,
      family: group.family,
      attempts: group.attempts,
      errors: group.errors,
      errorRate,
      peakRate,
      severity: Math.max(0, wilsonLower(group.errors, group.attempts) - groupBaseline) * Math.log2(1 + group.errors),
      status,
      words,
      hits: currentStreak(group.timeline).hits,
    });
  };

  for (const group of groups.values()) {
    if (group.kind === 'bias') emit(group, { forced: true });
    else if (group.id === 'speed:impulsivo') emit(group);
    else emit(group);
  }

  if (fragile) {
    const g = newGroup('speed:fragil', 'speed', SPEED_INSIGHT.fragil.label, SPEED_INSIGHT.fragil.tip, []);
    groups.set(g.id, g);
    for (const r of slowHits) addToGroup(groups, g, r);
    emit(g, { forced: true, words: [...new Set(slowHits.map(r => r.noun.word))] });
  }

  if (leechWords.size > 0) {
    const g = newGroup('leech', 'leech', LEECH_INSIGHT.label, LEECH_INSIGHT.tip, []);
    for (const r of resolved) if (leechWords.has(r.noun.word)) addToGroup(groups, g, r);
    emit(g, {
      forced: true,
      words: [...leechWords.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([w]) => w),
    });
  }

  patterns.sort((a, b) => b.severity - a.severity || a.id.localeCompare(b.id));
  return { patterns, progress, baseline, attempts: resolved.length };
}

/** Si un sustantivo cae dentro de un patrón. Es lo que conecta la detección con la intervención. */
export function patternIncludes(pattern: ErrorPattern, noun: Noun): boolean {
  switch (pattern.kind) {
    case 'family':
      return pattern.family === familyOf(noun);
    case 'trap': {
      if (pattern.id === 'trap:a-tonica') return familyOf(noun) === 'a-tonica';
      return `trap:${endingTrap(noun)}` === pattern.id;
    }
    case 'bias':
      return noun.gender === (pattern.id === 'bias:falso-masculino' ? 'femenino' : 'masculino');
    default:
      // `leech` y `speed` son listas de palabras concretas, no reglas.
      return pattern.words.includes(noun.word);
  }
}

/**
 * Patrones sobre los que se interviene, ya ordenados por severidad y recortados a
 * `MAX_INTERVENED`. El resto se sigue mostrando en el panel: verlos no cuesta
 * atención, trabajarlos sí.
 */
export function activePatterns(patterns: ErrorPattern[]): ErrorPattern[] {
  return patterns.filter(p => p.status !== 'superado').slice(0, MAX_INTERVENED);
}
