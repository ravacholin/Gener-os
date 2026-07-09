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
  Zap,
  HelpCircle,
  Award,
  ListFilter,
} from 'lucide-react';
import { nounsData, Noun } from './nouns';
import { SrsState, loadSrsState, persistSrsState, recordAnswer, pickNextWord, emptySrsState, isDue, SRS_STORAGE_KEY } from './srs';

type Difficulty = 'fácil' | 'medio' | 'difícil';
type LibraryFilter = 'todos' | Difficulty | 'aprendiendo' | 'dominado';

// --- Small reusable pieces (kept in this file by design — the app has no components/ folder) ---

function Chip({ active, onClick, children, title, id }: { active?: boolean; onClick?: () => void; children: React.ReactNode; title?: string; id?: string }) {
  const className = `px-2.5 py-1 text-[10px] font-bold uppercase border tracking-wide transition-all whitespace-nowrap ${
    active ? 'bg-ink text-canvas border-ink' : 'border-ink/30 text-ink-dim'
  } ${onClick ? 'hover:bg-surface-2 hover:border-ink/60 cursor-pointer' : ''}`;
  if (onClick) {
    return <button id={id} onClick={onClick} title={title} className={className}>{children}</button>;
  }
  return <span id={id} title={title} className={className}>{children}</span>;
}

function StatWidget({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <span className="text-[10px] uppercase font-mono font-bold opacity-60 tracking-wide">{label}</span>
      <div className="mt-1.5">{children}</div>
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
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
      transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
  }, [xOffset, isDragging, gameState, userAnswer]);

  return (
    <div id="app-root" className="w-full h-screen bg-canvas text-ink font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER SECTION */}
      <header id="header-container" className="flex flex-wrap items-center justify-between border-b-2 border-ink p-4 md:p-6 bg-surface z-10">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <div className="bg-ink text-canvas p-1.5 border border-ink">
            <Zap className="w-6 h-6 fill-canvas" />
          </div>
          <div>
            <h1 id="app-title" className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
              Género
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-ink-dim uppercase">Student Trainer</p>
          </div>
        </div>

        {/* Difficulty Selection & Controls */}
        <div className="flex items-center space-x-4 md:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex gap-1.5">
            {(['fácil', 'medio', 'difícil'] as const).map((diff) => (
              <Chip key={diff} id={`btn-diff-${diff}`} active={difficulty === diff} onClick={() => handleDifficultyChange(diff)}>
                {diff}
              </Chip>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-mute-toggle"
              onClick={toggleMute}
              className="p-2 border border-ink hover:bg-ink hover:text-canvas transition-all bg-canvas text-ink"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              id="btn-open-library"
              onClick={() => setIsLibraryOpen(true)}
              className="p-2 border border-ink hover:bg-ink hover:text-canvas transition-all bg-canvas text-ink flex items-center gap-1.5 text-xs font-bold uppercase"
              title="Biblioteca de sustantivos"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Biblioteca</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GAMEPLAY AREA */}
      <main id="gameplay-area" className="flex-1 grid grid-cols-12 gap-0 relative bg-canvas">

        {/* MASCULINE SIDEBAR RAIL (LEFT) */}
        <button
          id="masculine-sidebar-rail"
          onClick={() => handleAnswer('masculino')}
          disabled={gameState === 'answered'}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-r-2 border-ink transition-all cursor-pointer select-none group relative overflow-hidden ${
            gameState === 'answered'
              ? activeNoun.gender === 'masculino'
                ? 'bg-ink text-canvas opacity-100'
                : 'bg-canvas text-ink-faint opacity-20 border-r border-dashed border-ink-faint'
              : xOffset < -30
                ? 'bg-surface-2 opacity-90 scale-105 border-r-4'
                : 'bg-surface opacity-40 hover:opacity-80 hover:bg-surface-2'
          }`}
        >
          <div className="absolute top-4 left-4 text-[10px] uppercase font-mono tracking-wide opacity-60 flex items-center gap-1">
            <span className="px-1 border border-ink rounded font-bold">A</span> O
            <kbd className="px-1 font-bold">←</kbd>
          </div>
          <p className="text-7xl lg:text-9xl font-black tracking-tighter leading-none select-none transition-transform group-hover:scale-110" style={{ writingMode: 'vertical-rl' }}>
            EL
          </p>
          <p className="mt-4 text-[11px] font-mono uppercase tracking-mega font-bold">Masculino</p>
        </button>

        {/* CENTRAL GAMEPLAY COLUMN */}
        <div id="gameplay-center-column" className="col-span-12 md:col-span-8 flex flex-col items-center justify-between p-4 md:p-8 relative overflow-y-auto min-h-[450px]">

          {/* Top Score & Streak Indicators */}
          <div className="w-full max-w-xl flex items-center justify-between border-b border-ink border-dashed pb-3 mb-2 md:mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ink-dim uppercase tracking-wide">Racha:</span>
              <span className="text-lg font-black italic text-ink bg-canvas px-2 py-0.5 border border-ink">
                {streak} {streak === 1 ? 'ACIERTO' : 'ACIERTOS'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-ink-dim uppercase tracking-widest">Puntuación:</span>
              <p className="text-2xl font-black tracking-tight text-ink">{score}</p>
            </div>
          </div>

          {/* DRAGGABLE CARD CONTAINER */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative py-4">

            {isDragging && xOffset !== 0 && (
              <div className="absolute inset-x-0 top-2 flex justify-between px-6 z-20 pointer-events-none">
                <span className={`text-xs font-mono font-bold uppercase px-3 py-1 border-2 border-ink bg-ink text-canvas transition-opacity duration-150 ${xOffset < -20 ? 'opacity-100' : 'opacity-25'}`}>
                  ← MASCULINO (EL)
                </span>
                <span className={`text-xs font-mono font-bold uppercase px-3 py-1 border-2 border-ink bg-ink text-canvas transition-opacity duration-150 ${xOffset > 20 ? 'opacity-100' : 'opacity-25'}`}>
                  FEMENINO (LA) →
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
              className={`w-full max-w-md aspect-[4/3] bg-surface border-4 border-ink p-6 md:p-10 relative flex flex-col items-center justify-center select-none shadow-brutal-md transition-shadow duration-300 ${
                isDragging ? 'shadow-brutal-lg' : ''
              } ${
                gameState === 'answered'
                  ? lastAnswerWasCorrect
                    ? 'shadow-brutal-lg'
                    : 'border-ink-faint shadow-brutal-sm bg-canvas border-dashed'
                  : ''
              }`}
            >
              {/* Header inside Card */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-60 text-[10px] font-mono uppercase tracking-widest">
                <span>En cola {dueCount} · Dominadas {masteredCount}/{totalInDifficulty}</span>
                <Chip active>{difficulty}</Chip>
              </div>

              {/* CARD GAMEPLAY STATE DISPLAY */}
              <div className="text-center w-full my-auto">
                <h2 id="active-word-display" className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-ink mb-2 select-none">
                  {activeNoun.word}
                </h2>

                {gameState === 'answered' && (
                  <div className="animate-bounce">
                    <span id="answer-stamp" className={`inline-block border-4 px-6 py-2 text-2xl font-black uppercase tracking-widest transform -rotate-3 ${
                      lastAnswerWasCorrect
                        ? 'border-ink text-ink bg-canvas'
                        : 'border-ink-faint text-ink-faint bg-canvas line-through decoration-ink decoration-4'
                    }`}>
                      {lastAnswerWasCorrect ? '¡CORRECTO!' : '¡ERROR!'}
                    </span>
                    <p className="mt-2 text-lg font-bold">
                      Es <span className="underline uppercase font-black text-ink">
                        {activeNoun.gender === 'masculino' ? 'EL (MASCULINO)' : 'LA (FEMENINO)'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Next button overlay if answered */}
              {gameState === 'answered' && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                  <button
                    id="btn-next-word"
                    onClick={handleNext}
                    className="w-full max-w-[200px] bg-ink text-canvas text-xs font-black uppercase py-2 px-4 border border-ink hover:bg-surface-2 hover:text-ink transition-colors shadow-brutal-sm flex items-center justify-center gap-1.5"
                  >
                    <span>SIGUIENTE</span>
                    <ChevronRight className="w-4 h-4" />
                    <kbd className="hidden md:inline px-1 bg-canvas text-ink rounded text-[8px] ml-1">ESPACIO</kbd>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RULE LESSON BOX */}
          <div id="rule-lesson-box" className="w-full max-w-xl mt-4 min-h-[100px] transition-all">
            {gameState === 'answered' ? (
              <div className="border-2 border-ink bg-surface p-4 relative shadow-brutal-sm">
                <div className="absolute -top-3 left-4 bg-ink text-canvas border border-ink px-2 py-0.5 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {activeNoun.rule}
                </div>
                <p className="mt-2 text-xs md:text-sm text-ink/90 leading-relaxed font-mono">
                  {activeNoun.explanation}{' '}
                  <span className="text-ink-dim not-italic">Ejemplo: <span className="underline italic text-ink">{activeNoun.example}</span></span>
                </p>
              </div>
            ) : (
              <div className="border border-ink/30 border-dashed p-4 flex flex-col items-center justify-center text-center opacity-40 text-xs text-ink/70">
                <HelpCircle className="w-5 h-5 mb-2 text-ink" />
                <p>Responde para ver la regla gramatical.</p>
              </div>
            )}
          </div>

          {/* Quick Tap Buttons for Mobile */}
          {gameState === 'playing' && (
            <div className="w-full max-w-md flex gap-4 mt-2 md:hidden">
              <button
                onClick={() => handleAnswer('masculino')}
                className="flex-1 bg-surface-2 border-2 border-ink text-ink py-3 px-2 font-black uppercase text-sm tracking-widest shadow-brutal-sm hover:bg-ink hover:text-canvas transition-colors"
              >
                EL (MASC)
              </button>
              <button
                onClick={() => handleAnswer('femenino')}
                className="flex-1 bg-surface-2 border-2 border-ink text-ink py-3 px-2 font-black uppercase text-sm tracking-widest shadow-brutal-sm hover:bg-ink hover:text-canvas transition-colors"
              >
                LA (FEM)
              </button>
            </div>
          )}

        </div>

        {/* FEMININE SIDEBAR RAIL (RIGHT) */}
        <button
          id="feminine-sidebar-rail"
          onClick={() => handleAnswer('femenino')}
          disabled={gameState === 'answered'}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-l-2 border-ink transition-all cursor-pointer select-none group relative overflow-hidden ${
            gameState === 'answered'
              ? activeNoun.gender === 'femenino'
                ? 'bg-ink text-canvas opacity-100'
                : 'bg-canvas text-ink-faint opacity-20 border-l border-dashed border-ink-faint'
              : xOffset > 30
                ? 'bg-surface-2 opacity-90 scale-105 border-l-4'
                : 'bg-surface opacity-40 hover:opacity-80 hover:bg-surface-2'
          }`}
        >
          <div className="absolute top-4 right-4 text-[10px] uppercase font-mono tracking-wide opacity-60 flex items-center gap-1">
            <kbd className="px-1 font-bold">→</kbd>
            O <span className="px-1 border border-ink rounded font-bold">D</span>
          </div>
          <p className="text-7xl lg:text-9xl font-black tracking-tighter leading-none select-none transition-transform group-hover:scale-110" style={{ writingMode: 'vertical-rl' }}>
            LA
          </p>
          <p className="mt-4 text-[11px] font-mono uppercase tracking-mega font-bold">Femenino</p>
        </button>

      </main>

      {/* FOOTER INFO BAR */}
      <footer id="footer-container" className="border-t-2 border-ink p-4 md:p-6 bg-surface grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 z-10">

        <StatWidget label="Progreso nivel">
          <div className="flex justify-between items-center text-[10px] font-mono text-ink-dim mb-1.5">
            <span>{practicedInDifficultyCount} / {totalInDifficulty} practicados</span>
          </div>
          <div className="h-3 w-full border border-ink bg-surface-inset relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-ink transition-all duration-500"
              style={{ width: `${totalInDifficulty > 0 ? (practicedInDifficultyCount / totalInDifficulty) * 100 : 0}%` }}
            />
          </div>
          <span className="block text-[9px] font-mono text-ink-dim uppercase tracking-wide mt-1.5">
            {Object.keys(srsState.cards).length} / {nounsData.length} en toda la base · {overallPracticedPercentage}%
          </span>
        </StatWidget>

        <StatWidget label="Racha máxima" className="border-t border-ink/10 sm:border-t-0 sm:border-l border-ink/20 sm:pl-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-ink" />
            <span className="text-lg font-black text-ink uppercase font-mono italic">{maxStreak} correctos</span>
          </div>
        </StatWidget>

        <StatWidget label="Atajos & reset" className="border-t border-ink/10 sm:border-t-0 sm:border-l border-ink/20 sm:pl-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 text-[9px] font-mono">
              <kbd className="px-1.5 py-0.5 border border-ink bg-ink text-canvas font-bold">A</kbd>
              <span className="opacity-80">MASC</span>
              <kbd className="px-1.5 py-0.5 border border-ink bg-ink text-canvas font-bold ml-1">D</kbd>
              <span className="opacity-80">FEM</span>
            </div>

            <button
              id="btn-reset-stats"
              onClick={handleReset}
              className="text-[10px] font-black uppercase text-ink-dim hover:text-ink px-2 py-1 border border-transparent hover:border-ink transition-colors flex items-center gap-1 bg-transparent cursor-pointer"
              title="Borrar todo el progreso"
            >
              <RotateCcw className="w-3 h-3" />
              Reiniciar
            </button>
          </div>
        </StatWidget>

      </footer>

      {/* --- NOUN DICTIONARY / LIBRARY OVERLAY PANEL --- */}
      {isLibraryOpen && (
        <div id="library-overlay" className="absolute inset-0 bg-canvas/95 flex justify-end z-50 animate-fade-in">

          <div className="w-full max-w-2xl bg-surface border-l-4 border-ink h-full flex flex-col justify-between shadow-2xl relative">

            {/* Library Header */}
            <div className="p-6 border-b-2 border-ink bg-surface flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-ink" />
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Diccionario de Sustantivos</h3>
                  <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{practicedLibraryNouns.length} palabras que ya practicaste, en el orden en que las respondiste</p>
                </div>
              </div>

              <button
                id="btn-close-library"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1 border border-ink hover:bg-ink hover:text-canvas transition-colors"
                title="Cerrar diccionario"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b border-ink/20 bg-surface-2 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-ink/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar palabra o regla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-inset border-2 border-ink py-2 pl-9 pr-4 text-sm font-mono text-ink focus:outline-none focus:border-ink"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-ink/50 hover:text-ink">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-mono text-ink/40 uppercase mr-1 flex items-center gap-1">
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
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {filteredLibraryNouns.length === 0 ? (
                <div className="text-center py-12 text-ink/40">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-ink" />
                  {practicedLibraryNouns.length === 0 ? (
                    <>
                      <p className="text-sm font-mono">Todavía no practicaste ningún sustantivo.</p>
                      <p className="text-xs">Los que vayas respondiendo van a ir apareciendo acá.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-mono">No se encontraron sustantivos.</p>
                      <p className="text-xs">Prueba cambiando tu búsqueda o tus filtros.</p>
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
                      className={`border-2 p-4 transition-all bg-surface relative ${
                        status === 'dominado'
                          ? 'border-ink hover:bg-surface-2'
                          : status === 'aprendiendo'
                            ? 'border-ink-faint border-dashed hover:bg-surface-2'
                            : 'border-ink/20 hover:border-ink/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[18px] font-black uppercase text-ink">
                          {noun.gender === 'masculino' ? 'EL' : 'LA'}{' '}
                          <span className="underline decoration-ink decoration-2">{noun.word}</span>
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <Chip active>{noun.difficulty}</Chip>
                          {status === 'dominado' && (
                            <span className="text-ink bg-surface-2 p-0.5 border border-ink/40" title="Dominado">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                          {status === 'aprendiendo' && card && (
                            <span className="text-[9px] font-mono uppercase bg-surface-2 text-ink-dim px-1.5 py-0.5 border border-ink/20" title="Aprendiendo">
                              Caja {card.box}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-canvas/50 p-2.5 border border-ink/10">
                        <p className="text-[10px] font-mono text-ink uppercase mb-1 flex items-center gap-1 font-bold">
                          <Info className="w-3 h-3" />
                          {noun.rule}
                        </p>
                        <p className="text-xs text-ink/80 font-sans leading-relaxed">
                          {noun.explanation}{' '}
                          <span className="text-ink/50">Ejemplo: <strong className="text-ink uppercase font-mono">{noun.example}</strong></span>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Library Footer summary */}
            <div className="p-4 border-t-2 border-ink bg-surface flex items-center justify-between text-xs font-mono">
              <span className="opacity-60 uppercase">Mostrando {filteredLibraryNouns.length} de {practicedLibraryNouns.length} palabras practicadas</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLibraryFilter('todos');
                }}
                className="text-ink hover:underline uppercase text-[10px] font-bold"
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
