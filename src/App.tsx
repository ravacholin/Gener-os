/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Info,
  Mars,
  Venus,
  Target,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { nounsData, Difficulty, DIFFICULTIES } from './nouns';
import { lessonFor } from './remediation';
import { formatNextReview } from './session';
import { Library } from './components/Library';
import { Stat } from './components/Stat';
import { wordSizeClass } from './components/wordSizeClass';
import { playFeedbackSound } from './audio';
import { useAppHeight } from './hooks/useAppHeight';
import { useGameEngine } from './hooks/useGameEngine';
import { safeGetItem, safeSetItem } from './storage';

export default function App() {
  // --- STATE ---
  const [isMuted, setIsMuted] = useState<boolean>(false);
  // Aviso breve al abrir con palabras en cola. Se apaga solo a los pocos segundos.
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  const engine = useGameEngine({
    onAnswered: isCorrect => {
      if (showWelcome) setShowWelcome(false);
      playFeedbackSound(isCorrect ? 'correct' : 'incorrect', isMuted);
    },
  });
  const {
    difficulty, levelMix, levelOwnNouns, activeNoun, gameState, userAnswer, lastAnswerWasCorrect,
    resolvedPattern, score, streak, maxStreak, srsState, patterns, status, showCaughtUp,
    handleAnswer, handleKeepPracticing,
  } = engine;
  const currentFilteredNouns = engine.pool;
  const dueCount = status.dueCount;

  // Library Overlay State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // Swipe gesture tracking state
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [xOffset, setXOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Rule box text-clamp detection: on mobile the rule box is a fixed compact
  // height and the explanation is line-clamped, so long rules (hard cards) get
  // an in-context "ver más" hint that opens the full text in the Diccionario.
  const ruleTextRef = useRef<HTMLParagraphElement>(null);
  const [isRuleClamped, setIsRuleClamped] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(safeGetItem('genero_muted') === 'true');
  }, []);

  // Aviso de bienvenida: si al abrir hay palabras vencidas, mostrarlo un momento.
  // Es el único gancho de retorno posible sin backend (nada de push). Corre una vez.
  useEffect(() => {
    if (dueCount > 0) {
      setShowWelcome(true);
      const t = setTimeout(() => setShowWelcome(false), 2800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El desplazamiento del arrastre es de la tarjeta: se apaga con cada cambio de palabra o de nivel.
  const handleNext = () => {
    setXOffset(0);
    engine.handleNext();
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas reiniciar tu puntuación, racha e historial?")) {
      setXOffset(0);
      engine.resetProgress();
    }
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setXOffset(0);
    engine.changeDifficulty(diff);
  };

  // --- KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLibraryOpen) return;

      const key = e.key.toLowerCase();
      if (gameState === 'playing') {
        // En el cierre "estás al día" no hay palabra que responder.
        if (showCaughtUp) return;
        if (key === 'a' || e.key === 'ArrowLeft') {
          handleAnswer('masculino');
        } else if (key === 'd' || e.key === 'ArrowRight') {
          handleAnswer('femenino');
        }
      } else if (gameState === 'answered') {
        if (key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activeNoun, difficulty, isLibraryOpen, currentFilteredNouns, srsState, score, streak, maxStreak, showCaughtUp, showWelcome]);

  // --- SWIPE GESTURE EVENT HANDLERS ---
  const handleDragStart = (clientX: number, clientY: number) => {
    if (gameState === 'answered') return;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !dragStart || gameState === 'answered') return;
    const deltaX = clientX - dragStart.x;
    setXOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragStart(null);

    if (xOffset < -110) {
      handleAnswer('masculino');
    } else if (xOffset > 110) {
      handleAnswer('femenino');
    } else {
      setXOffset(0);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUpOrLeave = () => handleDragEnd();

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleDragMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => handleDragEnd();

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    safeSetItem('genero_muted', nextMute.toString());
  };

  // --- STATS COMPUTATIONS ---
  const totalInDifficulty = levelOwnNouns.length;

  const practicedInDifficultyCount = useMemo(() => {
    return levelOwnNouns.filter(n => (srsState.cards[n.word]?.totalSeen ?? 0) > 0).length;
  }, [levelOwnNouns, srsState]);

  // Etiquetas de la mezcla para el pie: "difícil 65% · medio 25% · fácil 10%".
  const mixLabel = useMemo(() => {
    return DIFFICULTIES
      .filter(d => (levelMix[d] ?? 0) > 0)
      .sort((a, b) => (levelMix[b] ?? 0) - (levelMix[a] ?? 0))
      .map(d => `${d} ${Math.round((levelMix[d] ?? 0) * 100)}%`)
      .join(' · ');
  }, [levelMix]);

  const mixExtras = useMemo(() => {
    return DIFFICULTIES
      .filter(d => d !== difficulty && (levelMix[d] ?? 0) > 0)
      .sort((a, b) => (levelMix[b] ?? 0) - (levelMix[a] ?? 0))
      .join(' + ');
  }, [levelMix, difficulty]);

  const overallPracticedPercentage = useMemo(() => {
    const total = nounsData.length;
    const practiced = Object.keys(srsState.cards).length;
    return total > 0 ? Math.round((practiced / total) * 100) : 0;
  }, [srsState]);

  const masteredCount = useMemo(() => {
    return levelOwnNouns.filter(n => (srsState.cards[n.word]?.box ?? 0) >= 3).length;
  }, [levelOwnNouns, srsState]);

  // Micro-lección: al fallar, nombrar el patrón vale más que repetir la regla de la
  // palabra suelta. Es la diferencia entre "mapa es masculino" y "las griegas en -ma
  // son masculinas, ya van cinco".
  const activeLesson = useMemo(() => {
    if (gameState !== 'answered' || lastAnswerWasCorrect) return null;
    return lessonFor(patterns, activeNoun);
  }, [gameState, lastAnswerWasCorrect, patterns, activeNoun]);

  // Calculate current card visual transform
  const cardStyle = useMemo(() => {
    if (gameState === 'answered') {
      const tilt = userAnswer === 'masculino' ? -4 : 4;
      return {
        transform: `rotate(${tilt}deg)`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
      };
    }

    if (isDragging) {
      const rotation = xOffset * 0.08;
      return {
        transform: `translateX(${xOffset}px) rotate(${rotation}deg)`,
        cursor: 'grabbing'
      };
    }

    return {
      transform: 'none',
      transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
    };
  }, [xOffset, isDragging, gameState, userAnswer]);

  // Detect whether the (line-clamped) explanation is actually truncated so the
  // "ver más" hint only shows when there is hidden text. Runs after layout.
  useEffect(() => {
    if (gameState !== 'answered') {
      setIsRuleClamped(false);
      return;
    }
    const el = ruleTextRef.current;
    setIsRuleClamped(!!el && el.scrollHeight > el.clientHeight + 1);
  }, [gameState, activeNoun]);

  useAppHeight();

  return (
    <div
      id="app-root"
      style={{ height: 'var(--app-height, 100dvh)' }}
      className="w-full bg-canvas text-ink font-sans flex flex-col justify-between overflow-hidden select-none"
    >
      {/* HEADER SECTION */}
      <header id="header-container" style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top))' }} className="flex flex-wrap items-center justify-between gap-2 md:gap-3 border-b-2 border-ink px-4 md:px-8 py-2.5 md:py-4 bg-canvas z-10 shrink-0">
        <div className="flex items-baseline gap-3">
          <h1 id="app-title" className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
            Género
          </h1>
          <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-mega text-ink-faint">/ sustantivos</span>
        </div>

        {/* Difficulty Selection & Controls */}
        <div className="flex items-center gap-3 md:gap-5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Segmented difficulty control */}
          <div className="flex border border-ink">
            {DIFFICULTIES.map((diff, i) => (
              <button
                key={diff}
                id={`btn-diff-${diff}`}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-2.5 md:px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest ${
                  i > 0 ? 'border-l border-ink' : ''
                } ${difficulty === diff ? 'bg-ink text-canvas' : 'text-ink-dim hover:text-ink'}`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex">
            <button
              id="btn-mute-toggle"
              onClick={toggleMute}
              className="p-2 border border-ink hover:bg-ink hover:text-canvas"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              id="btn-open-library"
              onClick={() => setIsLibraryOpen(true)}
              className="p-2 border border-l-0 border-ink hover:bg-ink hover:text-canvas flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest"
              title="Biblioteca de sustantivos"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Biblioteca</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GAMEPLAY AREA */}
      <main id="gameplay-area" className="flex-1 min-h-0 grid grid-cols-12 gap-0 relative bg-canvas overflow-hidden">

        {/* MASCULINE SIDEBAR RAIL (LEFT) */}
        <button
          id="masculine-sidebar-rail"
          onClick={() => handleAnswer('masculino')}
          disabled={gameState === 'answered' || showCaughtUp}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-r-2 border-ink transition-[background-color,box-shadow] duration-75 cursor-pointer select-none group relative overflow-hidden ${
            showCaughtUp
              ? 'pattern-stripes bg-canvas text-ink-faint opacity-20 cursor-default'
              : gameState === 'answered'
                ? activeNoun.gender === 'masculino'
                  ? 'bg-ink text-canvas'
                  : 'pattern-stripes bg-canvas text-ink-faint opacity-30'
                : xOffset < -30
                  ? 'bg-ink text-canvas'
                  : 'pattern-stripes bg-canvas text-ink-dim hover:text-ink hover:bg-surface'
          }`}
        >
          <Mars className="w-16 h-16 lg:w-24 lg:h-24 select-none transition-transform duration-75 group-hover:scale-105" strokeWidth={2.5} aria-hidden="true" />
          <p className="mt-6 text-base lg:text-xl font-black uppercase tracking-mega select-none" style={{ writingMode: 'vertical-rl' }}>Masculino</p>
        </button>

        {/* CENTRAL GAMEPLAY COLUMN */}
        <div id="gameplay-center-column" className="col-span-12 md:col-span-8 flex flex-col items-center justify-center gap-3 md:gap-6 px-4 py-3 md:px-10 md:py-6 relative overflow-hidden min-h-0">

          {/* Aviso de bienvenida: cuántas palabras esperan al abrir. Se apaga solo. */}
          {showWelcome && !showCaughtUp && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-rise">
              <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-ink text-canvas px-3 py-1 text-[9px] md:text-[10px] font-mono font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                {dueCount} {dueCount === 1 ? 'palabra te espera' : 'palabras te esperan'}
              </span>
            </div>
          )}

          {showCaughtUp ? (
            <>
              {/* CIERRE DE SESIÓN — "estás al día": no hay nada vencido por repasar.
                  Reusa la caja y las animaciones de la tarjeta; no sirve repaso vacío. */}
              <div className="w-full flex-1 min-h-0 md:max-h-[380px] flex flex-col items-center justify-center relative">
                <div
                  id="caught-up-card"
                  className="w-full max-w-md h-56 md:h-full min-h-0 overflow-hidden bg-surface border-2 border-ink px-6 py-6 md:px-10 md:py-8 relative flex flex-col items-center justify-center text-center select-none shadow-brutal-md animate-rise"
                >
                  <CalendarCheck className="w-12 h-12 md:w-16 md:h-16 text-ink" strokeWidth={2} aria-hidden="true" />
                  <span className="mt-3 inline-block border-2 border-ink text-ink px-5 py-1.5 md:px-6 md:py-2 text-lg md:text-2xl font-black uppercase tracking-widest animate-stamp">
                    Al día
                  </span>
                  <p className="mt-3 text-xs md:text-sm font-mono uppercase tracking-wide text-ink-dim">
                    Repasaste todo lo que tocaba.
                  </p>
                  {status.nextReviewAt !== null && (
                    <p className="mt-2 text-[11px] md:text-xs font-mono uppercase tracking-widest text-ink-dim">
                      Próximo repaso: <span className="text-ink font-bold">{formatNextReview(status.nextReviewAt)}</span>
                    </p>
                  )}
                  {status.scheduledCount > 0 && (
                    <p className="mt-0.5 text-[11px] md:text-xs font-mono uppercase tracking-widest text-ink-faint">
                      {status.scheduledCount} {status.scheduledCount === 1 ? 'palabra agendada' : 'palabras agendadas'}
                    </p>
                  )}
                </div>
              </div>

              {/* Opt-out: seguir practicando igual (repaso de relleno). Ocupa el mismo
                  slot que el botón Siguiente para no reflujar el layout. */}
              <div className="w-full max-w-md shrink-0 h-10 flex items-center justify-center">
                <button
                  id="btn-keep-practicing"
                  onClick={handleKeepPracticing}
                  className="mx-auto bg-canvas text-ink text-[11px] font-mono font-black uppercase tracking-widest py-2.5 px-6 border-2 border-ink hover:bg-ink hover:text-canvas flex items-center gap-1.5 shadow-brutal-sm whitespace-nowrap animate-rise"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Seguir practicando igual</span>
                </button>
              </div>

              {/* Espaciador con el alto de la caja de regla, para que el footer no salte. */}
              <div aria-hidden="true" className="w-full max-w-md h-28 md:h-auto md:min-h-[88px] shrink-0" />
            </>
          ) : (
          <>
          {/* DRAGGABLE CARD CONTAINER */}
          <div className="w-full flex-1 min-h-0 md:max-h-[380px] flex flex-col items-center justify-center relative">

            {isDragging && xOffset !== 0 && (
              <div className="absolute inset-x-0 -top-3 flex justify-between px-2 z-20 pointer-events-none">
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border border-ink bg-ink text-canvas transition-opacity duration-75 ${xOffset < -20 ? 'opacity-100' : 'opacity-20'}`}>
                  ← <Mars className="w-3 h-3" aria-hidden="true" /> Masculino
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border border-ink bg-ink text-canvas transition-opacity duration-75 ${xOffset > 20 ? 'opacity-100' : 'opacity-20'}`}>
                  <Venus className="w-3 h-3" aria-hidden="true" /> Femenino →
                </span>
              </div>
            )}

            {/* The Main Card */}
            <div
              id="noun-active-card"
              ref={cardRef}
              style={cardStyle}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUpOrLeave}
              onMouseLeave={onMouseUpOrLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className={`w-full max-w-md h-56 md:h-full min-h-0 overflow-hidden bg-surface border-2 border-ink px-4 py-4 md:px-10 md:py-6 relative flex flex-col items-center justify-center select-none shadow-brutal-md transition-[box-shadow,opacity] duration-75 ${
                isDragging ? 'shadow-brutal-lg cursor-grabbing' : gameState === 'playing' ? 'cursor-grab' : ''
              } ${
                gameState === 'answered'
                  ? lastAnswerWasCorrect
                    ? 'shadow-brutal-lg'
                    : 'shadow-brutal-sm opacity-95'
                  : ''
              }`}
            >
              {/* Minimal card meta */}
              <span className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-widest text-ink-faint">
                {activeNoun.difficulty}
                {activeNoun.difficulty !== difficulty && ' · repaso'}
              </span>

              {/* CARD GAMEPLAY STATE DISPLAY */}
              <div className="text-center w-full flex flex-col items-center justify-center">
                <h2 id="active-word-display" className={`${wordSizeClass(activeNoun.word.length)} font-black uppercase tracking-tighter text-ink select-none leading-none`}>
                  {activeNoun.word}
                </h2>

                {gameState === 'answered' && (
                  <div className="mt-3 md:mt-5 flex flex-col items-center">
                    <span id="answer-stamp" className={`inline-block border-2 px-5 py-1.5 md:px-6 md:py-2 text-lg md:text-2xl font-black uppercase tracking-widest animate-stamp ${
                      lastAnswerWasCorrect
                        ? 'border-ink text-ink'
                        : 'border-ink-faint text-ink-faint line-through decoration-ink decoration-2'
                    }`}>
                      {lastAnswerWasCorrect ? 'Correcto' : 'Error'}
                    </span>
                    <p className="mt-2.5 md:mt-4 text-xs md:text-sm font-mono uppercase tracking-wide text-ink-dim">
                      Es <span className="text-ink font-bold inline-flex items-center gap-1 align-middle">
                        {activeNoun.gender === 'masculino'
                          ? <><Mars className="w-4 h-4" aria-hidden="true" /> masculino</>
                          : <><Venus className="w-4 h-4" aria-hidden="true" /> femenino</>}
                      </span>
                    </p>

                    {/* Cierre del arco: el patrón que venía costando quedó superado. */}
                    {resolvedPattern && (
                      <span
                        id="pattern-resolved-stamp"
                        className="mt-2 inline-flex items-center gap-1.5 border-2 border-ink bg-ink text-canvas px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest animate-stamp"
                      >
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        Patrón superado · {resolvedPattern.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* NEXT BUTTON SLOT — sits in flow between the card and the rule box.
              Reserves its height in both states so the flex-1 card container
              doesn't resize (no reflow) between playing/answered. */}
          <div className="w-full max-w-md shrink-0 h-10 flex items-center justify-center">
            {gameState === 'answered' && (
              <button
                id="btn-next-word"
                onClick={handleNext}
                className="mx-auto bg-ink text-canvas text-[11px] font-mono font-black uppercase tracking-widest py-2.5 px-6 border-2 border-ink hover:bg-canvas hover:text-ink hover:border-ink flex items-center gap-1.5 shadow-brutal-sm whitespace-nowrap animate-rise"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* RULE LESSON BOX — fixed compact height in both states so the layout
              never reflows between playing/answered or between cards. */}
          <div id="rule-lesson-box" className="w-full max-w-md h-28 md:h-auto shrink-0">
            {gameState === 'answered' ? (
              <div className="border-2 border-ink bg-surface px-3.5 pt-2.5 pb-3 md:p-4 animate-rise h-28 md:h-auto md:min-h-[88px] md:max-h-[120px] flex flex-col overflow-hidden md:overflow-y-auto">
                {/* Cuando hay micro-lección, reemplaza al título de la regla en vez
                    de sumarse: la caja tiene alto fijo en mobile y una fila más la
                    desbordaría. */}
                <div className="flex items-center justify-between gap-2 shrink-0" title={activeLesson ? activeLesson.tip : activeNoun.rule}>
                  <span className={`flex items-center gap-1 min-w-0 text-[9px] font-mono font-black uppercase tracking-widest ${activeLesson ? 'text-ink' : 'text-ink-dim'}`}>
                    {activeLesson
                      ? <Target className="w-3 h-3 shrink-0" aria-hidden="true" />
                      : <Info className="w-3 h-3 shrink-0" />}
                    <span className="truncate">
                      {activeLesson ? `${activeLesson.label} ×${activeLesson.errors}` : activeNoun.rule}
                    </span>
                  </span>
                  {isRuleClamped && (
                    <button
                      onClick={() => setIsLibraryOpen(true)}
                      className="shrink-0 text-[9px] font-mono font-black uppercase tracking-widest text-ink border-b border-ink hover:text-canvas hover:bg-ink px-1"
                    >
                      ver más
                    </button>
                  )}
                </div>
                <p ref={ruleTextRef} className="mt-1.5 text-[13px] md:text-sm text-ink/90 leading-snug md:leading-relaxed font-mono line-clamp-3 md:line-clamp-none">
                  {activeLesson ? activeLesson.tip : activeNoun.explanation}{' '}
                  <span className="text-ink-dim">Ej: <span className="text-ink">
                    {activeLesson && activeLesson.examples.length > 0
                      ? activeLesson.examples.join(', ')
                      : activeNoun.example}
                  </span></span>
                </p>
              </div>
            ) : (
              <div aria-hidden="true" className="h-28 md:h-auto md:min-h-[88px]" />
            )}
          </div>

          {/* Quick Tap Buttons for Mobile */}
          <div className={`w-full max-w-md flex gap-3 md:hidden ${gameState === 'answered' ? 'invisible pointer-events-none' : ''}`}>
            <button
              onClick={() => handleAnswer('masculino')}
              className="flex-1 flex items-center justify-center gap-2 pattern-stripes border-2 border-ink bg-surface text-ink py-3 font-mono font-black uppercase text-xs tracking-widest shadow-brutal-sm active:bg-ink active:text-canvas"
            >
              <Mars className="w-4 h-4" aria-hidden="true" /> Masculino
            </button>
            <button
              onClick={() => handleAnswer('femenino')}
              className="flex-1 flex items-center justify-center gap-2 pattern-dots border-2 border-ink bg-surface text-ink py-3 font-mono font-black uppercase text-xs tracking-widest shadow-brutal-sm active:bg-ink active:text-canvas"
            >
              <Venus className="w-4 h-4" aria-hidden="true" /> Femenino
            </button>
          </div>
          </>
          )}

        </div>

        {/* FEMININE SIDEBAR RAIL (RIGHT) */}
        <button
          id="feminine-sidebar-rail"
          onClick={() => handleAnswer('femenino')}
          disabled={gameState === 'answered' || showCaughtUp}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-l-2 border-ink transition-[background-color,box-shadow] duration-75 cursor-pointer select-none group relative overflow-hidden ${
            showCaughtUp
              ? 'pattern-dots bg-canvas text-ink-faint opacity-20 cursor-default'
              : gameState === 'answered'
                ? activeNoun.gender === 'femenino'
                  ? 'bg-ink text-canvas'
                  : 'pattern-dots bg-canvas text-ink-faint opacity-30'
                : xOffset > 30
                  ? 'bg-ink text-canvas'
                  : 'pattern-dots bg-canvas text-ink-dim hover:text-ink hover:bg-surface'
          }`}
        >
          <Venus className="w-16 h-16 lg:w-24 lg:h-24 select-none transition-transform duration-75 group-hover:scale-105" strokeWidth={2.5} aria-hidden="true" />
          <p className="mt-6 text-base lg:text-xl font-black uppercase tracking-mega select-none" style={{ writingMode: 'vertical-rl' }}>Femenino</p>
        </button>

      </main>

      {/* FOOTER STAT RAIL */}
      <footer id="footer-container" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }} className="border-t-2 border-ink px-4 md:px-8 py-2.5 md:py-3.5 bg-canvas z-10 shrink-0">
        <div className="flex items-stretch justify-between gap-3 md:gap-8 flex-wrap">

          <Stat label="Racha">
            <span className="text-xl md:text-3xl font-black tabular-nums leading-none">{streak}</span>
          </Stat>

          <Stat label="Puntos">
            <span className="text-xl md:text-3xl font-black tabular-nums leading-none">{score}</span>
          </Stat>

          <Stat label="Máx">
            <span className="text-xl md:text-3xl font-black tabular-nums leading-none">{maxStreak}</span>
          </Stat>

          <Stat label="En cola">
            <span className="text-xl md:text-3xl font-black tabular-nums leading-none">{dueCount}</span>
          </Stat>

          {/* Level progress */}
          <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-[150px] max-w-sm">
            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-ink-dim">
              <span title={`Mezcla del nivel: ${mixLabel}`}>Nivel · {difficulty}{mixExtras && ` + ${mixExtras}`}</span>
              <span>{practicedInDifficultyCount}/{totalInDifficulty} · dom {masteredCount} · {overallPracticedPercentage}%</span>
            </div>
            <div className="h-2 w-full border border-ink bg-surface-inset relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-ink transition-all duration-500"
                style={{ width: `${totalInDifficulty > 0 ? (practicedInDifficultyCount / totalInDifficulty) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Shortcuts + reset */}
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden lg:flex items-center gap-1.5 text-[9px] font-mono text-ink-dim uppercase tracking-wide">
              <kbd className="px-1.5 py-0.5 border border-ink bg-ink text-canvas font-bold">A</kbd>
              <span>masc</span>
              <kbd className="px-1.5 py-0.5 border border-ink bg-ink text-canvas font-bold ml-1">D</kbd>
              <span>fem</span>
            </div>

            <button
              id="btn-reset-stats"
              onClick={handleReset}
              className="p-2 border border-ink-faint text-ink-dim hover:border-ink hover:text-ink"
              title="Borrar todo el progreso"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {isLibraryOpen && (
        <Library
          srsState={srsState}
          patterns={patterns}
          poolNouns={currentFilteredNouns}
          onClose={() => setIsLibraryOpen(false)}
        />
      )}

    </div>
  );
}
