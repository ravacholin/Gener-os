/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Difficulty, DIFFICULTIES, LEVEL_MIX, Noun, nounsData, poolForLevel } from '../nouns';
import {
  SRS_STORAGE_KEY, SrsState, emptySrsState, loadSrsState, pickNextWord, persistSrsState,
} from '../srs';
import {
  ERRORS_STORAGE_KEY, ErrorPattern, ErrorsState, analyze, emptyErrorsState, loadErrorsState,
  normalizeLatency, persistErrorsState,
} from '../errors';
import { patternBoost } from '../remediation';
import { sessionStatus } from '../session';
import { safeGetItem, safeRemoveItem, safeSetItem, parseStoredInt } from '../storage';
import { Gender, Stats, applyAnswer, emptyContrast, pickFollowUp } from '../engine';

interface Options {
  /** Se llama al registrar una respuesta (para sonido, avisos, etc.). */
  onAnswered?: (isCorrect: boolean) => void;
}

/**
 * Estado y reglas del juego: qué palabra toca, qué se respondió, puntaje, SRS e
 * inteligencia de errores. La lógica sin React vive en `engine.ts`; este hook la
 * conecta con el estado, la persistencia y el reloj de latencia.
 */
export function useGameEngine({ onAnswered }: Options = {}) {
  const [difficulty, setDifficulty] = useState<Difficulty>('fácil');
  const [stats, setStats] = useState<Stats>({ score: 0, streak: 0, maxStreak: 0 });
  const [srsState, setSrsState] = useState<SrsState>(() => loadSrsState());
  const [errorsState, setErrorsState] = useState<ErrorsState>(() => loadErrorsState());

  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'answered'>('playing');
  const [userAnswer, setUserAnswer] = useState<Gender | null>(null);
  const [lastAnswerWasCorrect, setLastAnswerWasCorrect] = useState<boolean>(false);
  const [resolvedPattern, setResolvedPattern] = useState<ErrorPattern | null>(null);
  // Cuando no queda nada por repasar, la app muestra "estás al día" en vez de seguir
  // sirviendo repaso vacío. `keepPracticing` es el opt-out del que igual quiere seguir.
  const [keepPracticing, setKeepPracticing] = useState<boolean>(false);

  // Momento en que la palabra quedó a la vista. La latencia distingue el error por
  // automatismo (contestó antes de leer) del error por duda, que piden cosas distintas.
  const promptShownAtRef = useRef<number>(0);
  // Si la app se ocultó con la tarjeta a la vista, la latencia medida es basura.
  const wasHiddenRef = useRef<boolean>(false);
  // Tanda de contraste pendiente: se drena antes de volver a pedirle palabras al SRS.
  const contrastRef = useRef(emptyContrast());

  // --- Persistencia de puntaje y nivel ---
  useEffect(() => {
    const savedDiff = safeGetItem('genero_difficulty');
    setStats({
      score: parseStoredInt(safeGetItem('genero_score')),
      streak: parseStoredInt(safeGetItem('genero_streak')),
      maxStreak: parseStoredInt(safeGetItem('genero_max_streak')),
    });
    if (savedDiff && (DIFFICULTIES as string[]).includes(savedDiff)) {
      setDifficulty(savedDiff as Difficulty);
    }
  }, []);

  const saveStats = (next: Stats) => {
    setStats(next);
    safeSetItem('genero_score', next.score.toString());
    safeSetItem('genero_streak', next.streak.toString());
    safeSetItem('genero_max_streak', next.maxStreak.toString());
  };

  // --- Pool y palabra activa ---
  // El pool de juego mezcla la dificultad elegida con una parte de las anteriores
  // (ver LEVEL_MIX); la mezcla decide con qué frecuencia sale cada bolsa.
  const levelMix = LEVEL_MIX[difficulty];
  const pool = useMemo(() => poolForLevel(nounsData, difficulty), [difficulty]);
  // Palabras propias del nivel: es lo que mide la barra de progreso.
  const levelOwnNouns = useMemo(() => nounsData.filter(n => n.difficulty === difficulty), [difficulty]);

  const activeNoun = useMemo<Noun>(
    () => pool.find(n => n.word === activeWord) ?? pool[0] ?? nounsData[0],
    [pool, activeWord],
  );

  useEffect(() => {
    if (pool.length === 0) return;
    if (!activeWord || !pool.some(n => n.word === activeWord)) {
      // Intentionally not depending on srsState: re-picking on every answer would fight handleNext's own pick.
      setActiveWord(pickNextWord(pool, srsState, undefined, levelMix).word);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  // --- Inteligencia de errores ---
  // `analyze` clasifica en vez de avanzar paso a paso, así que recalcularlo en cada
  // render es seguro: no empuja ningún patrón solo.
  const patterns = useMemo(() => analyze(errorsState, nounsData).patterns, [errorsState]);
  const boost = useMemo(() => patternBoost(patterns), [patterns]);

  // Todo derivado del SRS, sin estado nuevo persistido.
  const status = useMemo(() => sessionStatus(pool, srsState), [pool, srsState]);

  // El cierre solo aplica en juego, sin tanda de contraste pendiente y si el usuario
  // no eligió seguir practicando igual.
  const showCaughtUp = status.caughtUp && !keepPracticing && gameState === 'playing' && contrastRef.current.queue.length === 0;

  // El reloj arranca cuando la palabra queda a la vista. Si la app se ocultó en el
  // medio, la medición se descarta: no es una respuesta lenta, es un teléfono guardado.
  useEffect(() => {
    promptShownAtRef.current = Date.now();
    wasHiddenRef.current = false;
  }, [activeWord]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) wasHiddenRef.current = true;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // --- Acciones ---
  const handleAnswer = (answer: Gender) => {
    if (gameState === 'answered') return;

    const now = Date.now();
    const latency = wasHiddenRef.current ? null : normalizeLatency(now - promptShownAtRef.current);
    const result = applyAnswer({ noun: activeNoun, answer, srs: srsState, errors: errorsState, stats, latency, now });

    setUserAnswer(answer);
    setLastAnswerWasCorrect(result.isCorrect);
    setGameState('answered');
    setErrorsState(result.errors);
    persistErrorsState(result.errors);
    if (result.resolvedPattern) setResolvedPattern(result.resolvedPattern);
    setSrsState(result.srs);
    persistSrsState(result.srs);
    saveStats(result.stats);

    const c = contrastRef.current;
    contrastRef.current = { ...c, answersInSession: c.answersInSession + 1, answersSinceContrast: c.answersSinceContrast + 1 };

    onAnswered?.(result.isCorrect);
  };

  const advance = () => {
    const next = pickFollowUp({
      current: activeNoun.word, pool, patterns, srs: srsState, mix: levelMix, boost, contrast: contrastRef.current,
    });
    contrastRef.current = next.contrast;
    setActiveWord(next.word);
  };

  const handleNext = () => {
    setGameState('playing');
    setUserAnswer(null);
    setResolvedPattern(null);
    advance();
  };

  // Opt-out del cierre: el usuario elige seguir con repaso de relleno. Se apaga el
  // gate y se sirve la siguiente palabra por el camino normal (SRS ponderado).
  const handleKeepPracticing = () => {
    setKeepPracticing(true);
    setResolvedPattern(null);
    advance();
  };

  /** Borra puntaje, SRS e historial. La confirmación con el usuario es de quien llama. */
  const resetProgress = () => {
    saveStats({ score: 0, streak: 0, maxStreak: 0 });
    setSrsState(emptySrsState());
    setErrorsState(emptyErrorsState());
    setActiveWord(null);
    setGameState('playing');
    setUserAnswer(null);
    setResolvedPattern(null);
    setKeepPracticing(false);
    contrastRef.current = emptyContrast();
    safeRemoveItem('genero_score');
    safeRemoveItem('genero_streak');
    safeRemoveItem('genero_max_streak');
    safeRemoveItem(SRS_STORAGE_KEY);
    safeRemoveItem(ERRORS_STORAGE_KEY);
  };

  const changeDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    safeSetItem('genero_difficulty', diff);
    setGameState('playing');
    setUserAnswer(null);
    // El pool cambió: la tanda armada para el anterior ya no aplica, y el cierre se
    // recalcula sobre el pool nuevo (el opt-out no se arrastra entre niveles).
    contrastRef.current = { ...contrastRef.current, queue: [] };
    setKeepPracticing(false);
  };

  return {
    difficulty, levelMix, pool, levelOwnNouns, activeNoun, activeWord,
    gameState, userAnswer, lastAnswerWasCorrect, resolvedPattern,
    score: stats.score, streak: stats.streak, maxStreak: stats.maxStreak,
    srsState, patterns, status, showCaughtUp,
    handleAnswer, handleNext, handleKeepPracticing, resetProgress, changeDifficulty,
  };
}
