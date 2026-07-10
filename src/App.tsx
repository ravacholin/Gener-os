/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Search,
  BookOpen,
  X,
  ChevronRight,
  Info,
  Check,
  AlertTriangle,
  ListFilter,
} from 'lucide-react';
import { nounsData, Noun } from './nouns';
import { SrsState, loadSrsState, persistSrsState, recordAnswer, pickNextWord, emptySrsState, isDue, SRS_STORAGE_KEY } from './srs';

type Difficulty = 'fácil' | 'medio' | 'difícil';
type LibraryFilter = 'todos' | Difficulty | 'aprendiendo' | 'dominado';

// --- Small reusable pieces (kept in this file by design — the app has no components/ folder) ---

function Chip({ active, onClick, children, title, id }: { active?: boolean; onClick?: () => void; children: React.ReactNode; title?: string; id?: string }) {
  const className = `px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border whitespace-nowrap ${
    active ? 'bg-ink text-canvas border-ink' : 'border-ink-faint text-ink-dim'
  } ${onClick ? 'hover:text-ink hover:border-ink-dim cursor-pointer' : ''}`;
  if (onClick) {
    return <button id={id} onClick={onClick} title={title} className={className}>{children}</button>;
  }
  return <span id={id} title={title} className={className}>{children}</span>;
}

function wordSizeClass(len: number): string {
  if (len > 22) return 'text-2xl sm:text-3xl md:text-4xl';
  if (len > 14) return 'text-3xl sm:text-4xl md:text-5xl';
  return 'text-4xl sm:text-5xl md:text-6xl';
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center gap-1">
      <span className="text-[9px] font-mono uppercase tracking-widest text-ink-dim">{label}</span>
      <div className="text-ink">{children}</div>
    </div>
  );
}

export default function App() {
  // --- STATE ---
  const [difficulty, setDifficulty] = useState<Difficulty>('fácil');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [srsState, setSrsState] = useState<SrsState>(() => loadSrsState());

  // Active state
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'answered'>('playing');
  const [userAnswer, setUserAnswer] = useState<'masculino' | 'femenino' | null>(null);
  const [lastAnswerWasCorrect, setLastAnswerWasCorrect] = useState<boolean>(false);

  // Library Overlay State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>('todos');

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

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const savedScore = localStorage.getItem('genero_score');
    const savedStreak = localStorage.getItem('genero_streak');
    const savedMaxStreak = localStorage.getItem('genero_max_streak');
    const savedMute = localStorage.getItem('genero_muted');
    const savedDiff = localStorage.getItem('genero_difficulty');

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedMaxStreak) setMaxStreak(parseInt(savedMaxStreak, 10));
    if (savedMute) setIsMuted(savedMute === 'true');
    if (savedDiff && ['fácil', 'medio', 'difícil'].includes(savedDiff)) {
      setDifficulty(savedDiff as Difficulty);
    }
  }, []);

  const saveScoreStats = (newScore: number, newStreak: number, newMax: number) => {
    setScore(newScore);
    setStreak(newStreak);
    setMaxStreak(newMax);
    localStorage.setItem('genero_score', newScore.toString());
    localStorage.setItem('genero_streak', newStreak.toString());
    localStorage.setItem('genero_max_streak', newMax.toString());
  };

  // --- FILTERED NOUNS ---
  const currentFilteredNouns = useMemo(() => {
    return nounsData.filter(noun => noun.difficulty === difficulty);
  }, [difficulty]);

  // Active word selection (SRS-driven)
  const activeNoun = useMemo<Noun>(() => {
    return currentFilteredNouns.find(n => n.word === activeWord) ?? currentFilteredNouns[0] ?? nounsData[0];
  }, [currentFilteredNouns, activeWord]);

  useEffect(() => {
    if (currentFilteredNouns.length === 0) return;
    if (!activeWord || !currentFilteredNouns.some(n => n.word === activeWord)) {
      // Intentionally not depending on srsState: re-picking on every answer would fight handleNext's own pick.
      setActiveWord(pickNextWord(currentFilteredNouns, srsState).word);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilteredNouns]);

  // --- AUDIO SYNTHESIS FEEDBACK ---
  const playFeedbackSound = (type: 'correct' | 'incorrect') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120.00, ctx.currentTime);
        osc.frequency.setValueAtTime(90.00, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn("Audio feedback context error:", e);
    }
  };

  // --- GAME LOGIC CONTROLS ---
  const handleAnswer = (answer: 'masculino' | 'femenino') => {
    if (gameState === 'answered') return;

    const isCorrect = activeNoun.gender === answer;
    setUserAnswer(answer);
    setLastAnswerWasCorrect(isCorrect);
    setGameState('answered');

    const nextSrs = recordAnswer(srsState, activeNoun.word, isCorrect);
    setSrsState(nextSrs);
    persistSrsState(nextSrs);

    const newScore = isCorrect ? score + (difficulty === 'fácil' ? 10 : difficulty === 'medio' ? 20 : 30) : score;
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);
    saveScoreStats(newScore, newStreak, newMaxStreak);

    playFeedbackSound(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setGameState('playing');
    setUserAnswer(null);
    setXOffset(0);
    setActiveWord(pickNextWord(currentFilteredNouns, srsState, activeNoun.word).word);
  };

  // Reset current stats
  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas reiniciar tu puntuación, racha e historial?")) {
      saveScoreStats(0, 0, 0);
      setSrsState(emptySrsState());
      setActiveWord(null);
      setGameState('playing');
      setUserAnswer(null);
      setXOffset(0);
      localStorage.removeItem('genero_score');
      localStorage.removeItem('genero_streak');
      localStorage.removeItem('genero_max_streak');
      localStorage.removeItem(SRS_STORAGE_KEY);
    }
  };

  // Change difficulty
  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    localStorage.setItem('genero_difficulty', diff);
    setGameState('playing');
    setUserAnswer(null);
    setXOffset(0);
  };

  // --- KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLibraryOpen) return;

      const key = e.key.toLowerCase();
      if (gameState === 'playing') {
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
  }, [gameState, activeNoun, difficulty, isLibraryOpen, currentFilteredNouns, srsState, score, streak, maxStreak]);

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
    localStorage.setItem('genero_muted', nextMute.toString());
  };

  // --- STATS COMPUTATIONS ---
  const totalInDifficulty = currentFilteredNouns.length;

  const practicedInDifficultyCount = useMemo(() => {
    return currentFilteredNouns.filter(n => (srsState.cards[n.word]?.totalSeen ?? 0) > 0).length;
  }, [currentFilteredNouns, srsState]);

  const overallPracticedPercentage = useMemo(() => {
    const total = nounsData.length;
    const practiced = Object.keys(srsState.cards).length;
    return total > 0 ? Math.round((practiced / total) * 100) : 0;
  }, [srsState]);

  const dueCount = useMemo(() => {
    return currentFilteredNouns.filter(n => isDue(n, srsState)).length;
  }, [currentFilteredNouns, srsState]);

  const masteredCount = useMemo(() => {
    return currentFilteredNouns.filter(n => (srsState.cards[n.word]?.box ?? 0) >= 3).length;
  }, [currentFilteredNouns, srsState]);

  // --- LIBRARY FILTERING ---
  // The dictionary only ever shows nouns the user has actually practiced, ordered
  // by the moment each one was first answered (oldest first).
  const practicedLibraryNouns = useMemo(() => {
    return nounsData
      .filter(noun => !!srsState.cards[noun.word])
      .sort((a, b) => srsState.cards[a.word].firstSeenAt - srsState.cards[b.word].firstSeenAt);
  }, [srsState]);

  const filteredLibraryNouns = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return practicedLibraryNouns.filter(noun => {
      const matchesSearch = noun.word.toLowerCase().includes(q) || noun.rule.toLowerCase().includes(q);

      if (libraryFilter === 'todos') return matchesSearch;
      if (libraryFilter === 'fácil' || libraryFilter === 'medio' || libraryFilter === 'difícil') {
        return noun.difficulty === libraryFilter && matchesSearch;
      }
      const card = srsState.cards[noun.word];
      if (libraryFilter === 'aprendiendo') return !!card && card.box <= 2 && matchesSearch;
      if (libraryFilter === 'dominado') return !!card && card.box >= 3 && matchesSearch;
      return matchesSearch;
    });
  }, [searchQuery, libraryFilter, practicedLibraryNouns, srsState]);

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

  // Ancla #app-root a la altura visible REAL del viewport. 100dvh no es fiable en
  // algunos navegadores Android/WebView (se resuelve más alto que el área visible),
  // lo que hacía scrollear la página y ocultaba la barra superior o la inferior.
  useEffect(() => {
    const setAppHeight = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${h}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    window.visualViewport?.addEventListener('resize', setAppHeight);
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setAppHeight);
    };
  }, []);

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
            {(['fácil', 'medio', 'difícil'] as const).map((diff, i) => (
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
          disabled={gameState === 'answered'}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-r-2 border-ink transition-[background-color,box-shadow] duration-75 cursor-pointer select-none group relative overflow-hidden ${
            gameState === 'answered'
              ? activeNoun.gender === 'masculino'
                ? 'bg-ink text-canvas'
                : 'pattern-stripes bg-canvas text-ink-faint opacity-30'
              : xOffset < -30
                ? 'bg-ink text-canvas'
                : 'pattern-stripes bg-canvas text-ink-dim hover:text-ink hover:bg-surface'
          }`}
        >
          <span className="text-3xl md:text-4xl font-black leading-none select-none mb-2" aria-hidden="true">♂</span>
          <p className="text-7xl lg:text-[8rem] font-black tracking-tighter leading-none select-none transition-transform duration-75 group-hover:scale-105" style={{ writingMode: 'vertical-rl' }}>
            EL
          </p>
          <p className="mt-6 text-[10px] font-mono uppercase tracking-mega font-bold">Masculino</p>
        </button>

        {/* CENTRAL GAMEPLAY COLUMN */}
        <div id="gameplay-center-column" className="col-span-12 md:col-span-8 flex flex-col items-center justify-center gap-3 md:gap-10 px-4 py-3 md:p-10 relative overflow-hidden min-h-0">

          {/* DRAGGABLE CARD CONTAINER */}
          <div className="w-full flex-1 md:flex-none min-h-0 flex flex-col items-center justify-center relative">

            {isDragging && xOffset !== 0 && (
              <div className="absolute inset-x-0 -top-3 flex justify-between px-2 z-20 pointer-events-none">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border border-ink bg-ink text-canvas transition-opacity duration-75 ${xOffset < -20 ? 'opacity-100' : 'opacity-20'}`}>
                  ← ♂ EL
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border border-ink bg-ink text-canvas transition-opacity duration-75 ${xOffset > 20 ? 'opacity-100' : 'opacity-20'}`}>
                  ♀ LA →
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
              className={`w-full max-w-md h-56 md:h-auto md:aspect-[4/3] min-h-0 overflow-hidden bg-surface border-2 border-ink px-4 py-4 md:px-10 md:py-6 relative flex flex-col items-center justify-center select-none shadow-brutal-md transition-[box-shadow,opacity] duration-75 ${
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
                {difficulty}
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
                      Es <span className="text-ink font-bold">
                        {activeNoun.gender === 'masculino' ? '♂ EL · masculino' : '♀ LA · femenino'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Next button overlay if answered */}
              {gameState === 'answered' && (
                <button
                  id="btn-next-word"
                  onClick={handleNext}
                  className="absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 bg-ink text-canvas text-[11px] font-mono font-black uppercase tracking-widest py-2.5 px-6 border-2 border-canvas hover:bg-canvas hover:text-ink hover:border-ink flex items-center gap-1.5 shadow-brutal-sm whitespace-nowrap"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* RULE LESSON BOX — fixed compact height in both states so the layout
              never reflows between playing/answered or between cards. */}
          <div id="rule-lesson-box" className="w-full max-w-md h-28 md:h-auto shrink-0">
            {gameState === 'answered' ? (
              <div className="border-2 border-ink bg-surface px-3.5 pt-2.5 pb-3 md:p-4 animate-rise h-28 md:h-auto md:min-h-[88px] md:max-h-[120px] flex flex-col overflow-hidden md:overflow-y-auto">
                <div className="flex items-center justify-between gap-2 shrink-0" title={activeNoun.rule}>
                  <span className="flex items-center gap-1 min-w-0 text-[9px] font-mono font-black uppercase tracking-widest text-ink-dim">
                    <Info className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeNoun.rule}</span>
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
                  {activeNoun.explanation}{' '}
                  <span className="text-ink-dim">Ej: <span className="text-ink">{activeNoun.example}</span></span>
                </p>
              </div>
            ) : (
              <div className="border border-ink-faint border-dashed p-3 md:p-4 flex items-center justify-center text-center h-28 md:h-auto md:min-h-[88px] text-[11px] font-mono uppercase tracking-wide text-ink-faint">
                Responde para ver la regla
              </div>
            )}
          </div>

          {/* Quick Tap Buttons for Mobile */}
          <div className={`w-full max-w-md flex gap-3 md:hidden ${gameState === 'answered' ? 'invisible pointer-events-none' : ''}`}>
            <button
              onClick={() => handleAnswer('masculino')}
              className="flex-1 pattern-stripes border-2 border-ink bg-surface text-ink py-3 font-mono font-black uppercase text-xs tracking-widest shadow-brutal-sm active:bg-ink active:text-canvas"
            >
              ♂ EL · masc
            </button>
            <button
              onClick={() => handleAnswer('femenino')}
              className="flex-1 pattern-dots border-2 border-ink bg-surface text-ink py-3 font-mono font-black uppercase text-xs tracking-widest shadow-brutal-sm active:bg-ink active:text-canvas"
            >
              ♀ LA · fem
            </button>
          </div>

        </div>

        {/* FEMININE SIDEBAR RAIL (RIGHT) */}
        <button
          id="feminine-sidebar-rail"
          onClick={() => handleAnswer('femenino')}
          disabled={gameState === 'answered'}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-l-2 border-ink transition-[background-color,box-shadow] duration-75 cursor-pointer select-none group relative overflow-hidden ${
            gameState === 'answered'
              ? activeNoun.gender === 'femenino'
                ? 'bg-ink text-canvas'
                : 'pattern-dots bg-canvas text-ink-faint opacity-30'
              : xOffset > 30
                ? 'bg-ink text-canvas'
                : 'pattern-dots bg-canvas text-ink-dim hover:text-ink hover:bg-surface'
          }`}
        >
          <span className="text-3xl md:text-4xl font-black leading-none select-none mb-2" aria-hidden="true">♀</span>
          <p className="text-7xl lg:text-[8rem] font-black tracking-tighter leading-none select-none transition-transform duration-75 group-hover:scale-105" style={{ writingMode: 'vertical-rl' }}>
            LA
          </p>
          <p className="mt-6 text-[10px] font-mono uppercase tracking-mega font-bold">Femenino</p>
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
              <span>Nivel · {difficulty}</span>
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

      {/* --- NOUN DICTIONARY / LIBRARY OVERLAY PANEL --- */}
      {isLibraryOpen && (
        <div id="library-overlay" className="absolute inset-0 bg-canvas/90 flex justify-end z-50 animate-fade-in">

          <div className="w-full max-w-2xl bg-surface border-l-2 border-ink h-full flex flex-col justify-between relative">

            {/* Library Header */}
            <div className="p-6 border-b-2 border-ink bg-canvas flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-ink" />
                <div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter">Diccionario</h3>
                  <p className="text-[9px] font-mono opacity-50 uppercase tracking-widest">{practicedLibraryNouns.length} palabras practicadas · orden de aparición</p>
                </div>
              </div>

              <button
                id="btn-close-library"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1.5 border border-ink hover:bg-ink hover:text-canvas"
                title="Cerrar diccionario"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b border-ink-faint bg-surface-2 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-ink-dim absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar palabra o regla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-inset border border-ink py-2 pl-9 pr-4 text-sm font-mono text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-ink-dim hover:text-ink">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-mono text-ink-faint uppercase tracking-wide mr-1 flex items-center gap-1">
                  <ListFilter className="w-3 h-3" /> Filtrar:
                </span>

                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'fácil', label: 'Fácil' },
                  { id: 'medio', label: 'Medio' },
                  { id: 'difícil', label: 'Difícil' },
                  { id: 'aprendiendo', label: 'Aprendiendo' },
                  { id: 'dominado', label: 'Dominado' },
                ].map(filterBtn => (
                  <Chip
                    key={filterBtn.id}
                    active={libraryFilter === filterBtn.id}
                    onClick={() => setLibraryFilter(filterBtn.id as LibraryFilter)}
                  >
                    {filterBtn.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Scrollable Word List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
              {filteredLibraryNouns.length === 0 ? (
                <div className="text-center py-12 text-ink-dim">
                  <AlertTriangle className="w-7 h-7 mx-auto mb-3 text-ink" />
                  {practicedLibraryNouns.length === 0 ? (
                    <>
                      <p className="text-sm font-mono">Todavía no practicaste ningún sustantivo.</p>
                      <p className="text-xs text-ink-faint">Los que respondas van a aparecer acá.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-mono">No se encontraron sustantivos.</p>
                      <p className="text-xs text-ink-faint">Probá cambiando tu búsqueda o filtros.</p>
                    </>
                  )}
                </div>
              ) : (
                filteredLibraryNouns.map((noun, idx) => {
                  const card = srsState.cards[noun.word];
                  const status: 'unseen' | 'aprendiendo' | 'dominado' = !card ? 'unseen' : card.box >= 3 ? 'dominado' : 'aprendiendo';
                  return (
                    <div
                      key={idx}
                      className={`border p-4 bg-surface relative ${
                        status === 'dominado'
                          ? 'border-ink hover:bg-surface-2'
                          : status === 'aprendiendo'
                            ? 'border-ink-faint hover:bg-surface-2'
                            : 'border-ink-faint hover:border-ink-dim'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3 mb-2.5">
                        <span className="text-base md:text-lg font-black uppercase tracking-tight text-ink">
                          {noun.gender === 'masculino' ? '♂ EL' : '♀ LA'}{' '}
                          <span className="underline decoration-ink decoration-2 underline-offset-2">{noun.word}</span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Chip active>{noun.difficulty}</Chip>
                          {status === 'dominado' && (
                            <span className="text-ink border border-ink p-0.5" title="Dominado">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                          {status === 'aprendiendo' && card && (
                            <span className="text-[9px] font-mono uppercase text-ink-dim px-1.5 py-0.5 border border-ink-faint" title="Aprendiendo">
                              Caja {card.box}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-ink-faint pt-2.5">
                        <p className="text-[10px] font-mono text-ink-dim uppercase tracking-wide mb-1 flex items-center gap-1 font-bold">
                          <Info className="w-3 h-3" />
                          {noun.rule}
                        </p>
                        <p className="text-xs text-ink/80 font-mono leading-relaxed">
                          {noun.explanation}{' '}
                          <span className="text-ink-dim">Ej: <span className="text-ink">{noun.example}</span></span>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Library Footer summary */}
            <div className="p-4 border-t-2 border-ink bg-canvas flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
              <span className="text-ink-dim">{filteredLibraryNouns.length} / {practicedLibraryNouns.length} palabras</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLibraryFilter('todos');
                }}
                className="text-ink hover:underline font-bold"
              >
                Limpiar filtros
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
