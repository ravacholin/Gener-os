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
  Keyboard, 
  Award,
  ListFilter,
  CheckCircle2,
  XCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { nounsData, Noun } from './nouns';

export default function App() {
  // --- STATE ---
  const [difficulty, setDifficulty] = useState<'fácil' | 'medio' | 'difícil'>('fácil');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [history, setHistory] = useState<Record<string, 'correct' | 'incorrect'>>({});
  
  // Active state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<'playing' | 'answered'>('playing');
  const [userAnswer, setUserAnswer] = useState<'masculino' | 'femenino' | null>(null);
  const [lastAnswerWasCorrect, setLastAnswerWasCorrect] = useState<boolean>(false);
  
  // Library Overlay State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [libraryFilter, setLibraryFilter] = useState<'todos' | 'fácil' | 'medio' | 'difícil' | 'correct' | 'incorrect' | 'unseen'>('todos');

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
    const savedHistory = localStorage.getItem('genero_history');
    const savedMute = localStorage.getItem('genero_muted');
    const savedDiff = localStorage.getItem('genero_difficulty');

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedMaxStreak) setMaxStreak(parseInt(savedMaxStreak, 10));
    if (savedMute) setIsMuted(savedMute === 'true');
    if (savedDiff && ['fácil', 'medio', 'difícil'].includes(savedDiff)) {
      setDifficulty(savedDiff as 'fácil' | 'medio' | 'difícil');
    }
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync state helpers to localStorage
  const saveStats = (newScore: number, newStreak: number, newMax: number, newHistory: Record<string, 'correct' | 'incorrect'>) => {
    setScore(newScore);
    setStreak(newStreak);
    setMaxStreak(newMax);
    setHistory(newHistory);
    localStorage.setItem('genero_score', newScore.toString());
    localStorage.setItem('genero_streak', newStreak.toString());
    localStorage.setItem('genero_max_streak', newMax.toString());
    localStorage.setItem('genero_history', JSON.stringify(newHistory));
  };

  // --- FILTERED NOUNS ---
  const currentFilteredNouns = useMemo(() => {
    return nounsData.filter(noun => noun.difficulty === difficulty);
  }, [difficulty]);

  // Active word selection
  const activeNoun = useMemo<Noun>(() => {
    if (currentFilteredNouns.length === 0) {
      return nounsData[0]; // fallback
    }
    const idx = currentIndex % currentFilteredNouns.length;
    return currentFilteredNouns[idx];
  }, [currentFilteredNouns, currentIndex]);

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
        // Elegant rising note sequence
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        // Low buzzy sound
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
    
    // Update stats
    const updatedHistory = { ...history, [activeNoun.word]: (isCorrect ? 'correct' : 'incorrect') as 'correct' | 'incorrect' };
    const newScore = isCorrect ? score + (difficulty === 'fácil' ? 10 : difficulty === 'medio' ? 20 : 30) : score;
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);
    
    saveStats(newScore, newStreak, newMaxStreak, updatedHistory);
    playFeedbackSound(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setGameState('playing');
    setUserAnswer(null);
    setXOffset(0);
    // Go to next index (wrap around if needed)
    setCurrentIndex(prev => (prev + 1) % currentFilteredNouns.length);
  };

  // Reset current stats
  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas reiniciar tu puntuación, racha e historial?")) {
      saveStats(0, 0, 0, {});
      setCurrentIndex(0);
      setGameState('playing');
      setUserAnswer(null);
      setXOffset(0);
      localStorage.removeItem('genero_score');
      localStorage.removeItem('genero_streak');
      localStorage.removeItem('genero_max_streak');
      localStorage.removeItem('genero_history');
    }
  };

  // Change difficulty
  const handleDifficultyChange = (diff: 'fácil' | 'medio' | 'difícil') => {
    setDifficulty(diff);
    localStorage.setItem('genero_difficulty', diff);
    setCurrentIndex(0);
    setGameState('playing');
    setUserAnswer(null);
    setXOffset(0);
  };

  // --- KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger game commands when search library is open
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
  }, [gameState, activeNoun, difficulty, isLibraryOpen, currentFilteredNouns]);

  // --- SWIPE GESTURE EVENT HANDLERS ---
  const handleDragStart = (clientX: number, clientY: number) => {
    if (gameState === 'answered') return;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !dragStart || gameState === 'answered') return;
    const deltaX = clientX - dragStart.x;
    // Constrain delta value to avoid extreme offscreen
    setXOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragStart(null);

    // Swipe threshold
    if (xOffset < -110) {
      // Left swipe = Masculine (EL)
      handleAnswer('masculino');
    } else if (xOffset > 110) {
      // Right swipe = Feminine (LA)
      handleAnswer('femenino');
    } else {
      // Snap back
      setXOffset(0);
    }
  };

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const onMouseUpOrLeave = () => {
    handleDragEnd();
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Mute toggle helper
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    localStorage.setItem('genero_muted', nextMute.toString());
  };

  // --- STATS COMPUTATIONS ---
  const totalInDifficulty = currentFilteredNouns.length;
  
  // Count words practiced in current difficulty
  const practicedInDifficultyCount = useMemo(() => {
    return currentFilteredNouns.filter(noun => history[noun.word] !== undefined).length;
  }, [currentFilteredNouns, history]);

  // Compute overall percentage of database practiced
  const overallPracticedPercentage = useMemo(() => {
    const total = nounsData.length;
    const practiced = Object.keys(history).length;
    return total > 0 ? Math.round((practiced / total) * 100) : 0;
  }, [history]);

  // --- LIBRARY FILTERING ---
  const filteredLibraryNouns = useMemo(() => {
    return nounsData.filter(noun => {
      // Search text query
      const matchesSearch = noun.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            noun.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            noun.rule.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter status/difficulty
      if (libraryFilter === 'todos') return matchesSearch;
      if (['fácil', 'medio', 'difícil'].includes(libraryFilter)) {
        return noun.difficulty === libraryFilter && matchesSearch;
      }
      if (libraryFilter === 'correct') {
        return history[noun.word] === 'correct' && matchesSearch;
      }
      if (libraryFilter === 'incorrect') {
        return history[noun.word] === 'incorrect' && matchesSearch;
      }
      if (libraryFilter === 'unseen') {
        return history[noun.word] === undefined && matchesSearch;
      }
      return matchesSearch;
    });
  }, [searchQuery, libraryFilter, history]);

  // Calculate current card visual transform
  const cardStyle = useMemo(() => {
    if (gameState === 'answered') {
      // Keep it centered but show slight tilt depending on correct/incorrect or answer
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
    <div id="app-root" className="w-full h-screen bg-[#0A0A0A] text-white font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* HEADER SECTION */}
      <header id="header-container" className="flex flex-wrap items-center justify-between border-b-2 border-white p-4 md:p-6 bg-[#0E0E0E] z-10">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <div className="bg-white text-black p-1.5 border border-white">
            <Zap className="w-6 h-6 fill-black" />
          </div>
          <div>
            <h1 id="app-title" className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none flex items-center gap-2">
              Género
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">STUDENT TRAINER</p>
          </div>
          <span className="text-[10px] bg-white text-black px-2 py-0.5 font-bold tracking-tight uppercase border border-black hidden sm:inline-block">
            BRUTALISTA
          </span>
        </div>

        {/* Difficulty Selection & Controls */}
        <div className="flex items-center space-x-4 md:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex border border-white bg-black">
            {(['fácil', 'medio', 'difícil'] as const).map((diff) => (
              <button
                key={diff}
                id={`btn-diff-${diff}`}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-3 md:px-4 py-1.5 text-xs font-black uppercase transition-all tracking-wider border-r border-white last:border-0 ${
                  difficulty === diff 
                    ? 'bg-white text-black' 
                    : 'text-white hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Audio Toggle */}
            <button
              id="btn-mute-toggle"
              onClick={toggleMute}
              className="p-2 border border-white hover:bg-white hover:text-black transition-all bg-black text-white"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Library Toggle */}
            <button
              id="btn-open-library"
              onClick={() => setIsLibraryOpen(true)}
              className="p-2 border border-white hover:bg-white hover:text-black transition-all bg-black text-white flex items-center gap-1.5 text-xs font-bold uppercase"
              title="Biblioteca de sustantivos"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">BIBLIOTECA</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GAMEPLAY AREA */}
      <main id="gameplay-area" className="flex-1 grid grid-cols-12 gap-0 relative bg-[#060606]">
        
        {/* MASCULINE SIDEBAR RAIL (LEFT) - Clickable to choose "EL" */}
        <button
          id="masculine-sidebar-rail"
          onClick={() => handleAnswer('masculino')}
          disabled={gameState === 'answered'}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-r-2 border-white transition-all cursor-pointer select-none group relative overflow-hidden ${
            gameState === 'answered'
              ? activeNoun.gender === 'masculino'
                ? 'bg-white text-black opacity-100'
                : 'bg-black text-gray-700 opacity-20 border-r border-dashed border-gray-800'
              : xOffset < -30
                ? 'bg-[#1A1A1A] opacity-90 scale-105 border-r-4'
                : 'bg-[#0E0E0E] opacity-40 hover:opacity-80 hover:bg-[#111]'
          }`}
        >
          <div className="absolute top-4 left-4 text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
            <span className="px-1 border border-white rounded font-bold">A</span> O
            <kbd className="px-1 font-bold">←</kbd>
          </div>
          <p className="text-7xl lg:text-9xl font-black tracking-tighter leading-none select-none transition-transform group-hover:scale-110" style={{ writingMode: 'vertical-rl' }}>
            EL
          </p>
          <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.2em] font-bold">MASCULINO</p>
          <div className="absolute bottom-4 text-[10px] uppercase font-bold opacity-30 group-hover:opacity-100 transition-opacity">
            Hacer clic / Swipe Izq.
          </div>
        </button>

        {/* CENTRAL GAMEPLAY COLUMN */}
        <div id="gameplay-center-column" className="col-span-12 md:col-span-8 flex flex-col items-center justify-between p-4 md:p-8 relative overflow-y-auto min-h-[450px]">
          
          {/* Top Score & Streak Indicators (Mobile responsive header row) */}
          <div className="w-full max-w-xl flex items-center justify-between border-b border-white border-dashed pb-3 mb-2 md:mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Racha:</span>
              <span className="text-lg font-black italic text-white bg-black px-2 py-0.5 border border-white">
                {streak} {streak === 1 ? 'ACIERTO' : 'ACIERTOS'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">PUNTUACIÓN:</span>
              <p className="text-2xl font-black tracking-tight text-white">{score}</p>
            </div>
          </div>

          {/* DRAGGABLE CARD CONTAINER */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative py-4">
            
            {/* Visual Indicators for drag intent overlay */}
            {isDragging && xOffset !== 0 && (
              <div className="absolute inset-x-0 top-2 flex justify-between px-6 z-20 pointer-events-none">
                <span className={`text-xs font-mono font-bold uppercase px-3 py-1 border-2 border-white bg-white text-black transition-opacity duration-150 ${xOffset < -20 ? 'opacity-100' : 'opacity-25'}`}>
                  ← MASCULINO (EL)
                </span>
                <span className={`text-xs font-mono font-bold uppercase px-3 py-1 border-2 border-white bg-white text-black transition-opacity duration-150 ${xOffset > 20 ? 'opacity-100' : 'opacity-25'}`}>
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
              className={`w-full max-w-md aspect-[4/3] bg-[#0F0F0F] border-4 border-white p-6 md:p-10 relative flex flex-col items-center justify-center select-none shadow-[10px_10px_0px_0px_rgba(255,255,255,0.15)] transition-shadow duration-300 ${
                isDragging ? 'shadow-[18px_18px_0px_0px_rgba(255,255,255,0.3)] border-white' : ''
              } ${
                gameState === 'answered'
                  ? lastAnswerWasCorrect
                    ? 'border-white shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] bg-[#111111]'
                    : 'border-gray-500 shadow-[12px_12px_0px_0px_rgba(100,100,100,0.2)] bg-[#0C0C0C] border-dashed'
                  : ''
              }`}
            >
              {/* Header inside Card */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-50 text-[10px] font-mono uppercase tracking-widest">
                <span>SUSTANTIVO {currentIndex + 1} de {totalInDifficulty}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 border border-white ${
                    difficulty === 'fácil' ? 'bg-white' : difficulty === 'medio' ? 'bg-gray-400' : 'bg-transparent'
                  }`} />
                  {difficulty}
                </span>
              </div>

              {/* CARD GAMEPLAY STATE DISPLAY */}
              <div className="text-center w-full my-auto">
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-3">Toca/Arrastra o usa atajos</p>
                
                {/* Noun Word */}
                <h2 id="active-word-display" className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2 select-none">
                  {activeNoun.word}
                </h2>
                
                {/* English translation */}
                <p id="active-word-translation" className="text-sm md:text-base font-mono opacity-60 italic lowercase mb-6 select-none">
                  ({activeNoun.translation})
                </p>

                {/* Status Stamp (Answered state overlay) */}
                {gameState === 'answered' && (
                  <div className="animate-bounce">
                    <span id="answer-stamp" className={`inline-block border-4 px-6 py-2 text-2xl font-black uppercase tracking-widest transform -rotate-3 ${
                      lastAnswerWasCorrect 
                        ? 'border-white text-white bg-black' 
                        : 'border-gray-500 text-gray-400 bg-black line-through decoration-white decoration-4'
                    }`}>
                      {lastAnswerWasCorrect ? '¡CORRECTO!' : '¡ERROR!'}
                    </span>
                    <p className="mt-2 text-lg font-bold">
                      Es <span className="underline uppercase font-black text-white">
                        {activeNoun.gender === 'masculino' ? 'EL (MASCULINO)' : 'LA (FEMENINO)'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Drag/Swipe Prompt helper on bottom of card */}
              {gameState === 'playing' && (
                <div className="absolute bottom-4 text-center text-[10px] opacity-40 font-mono flex items-center gap-2 justify-center w-full">
                  <span>← Arrastra Izquierda (MASC)</span>
                  <span className="text-gray-600">|</span>
                  <span>Arrastra Derecha (FEM) →</span>
                </div>
              )}

              {/* Next button overlay if answered */}
              {gameState === 'answered' && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                  <button
                    id="btn-next-word"
                    onClick={handleNext}
                    className="w-full max-w-[200px] bg-white text-black text-xs font-black uppercase py-2 px-4 border border-black hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] flex items-center justify-center gap-1.5"
                  >
                    <span>SIGUIENTE</span>
                    <ChevronRight className="w-4 h-4" />
                    <kbd className="hidden md:inline px-1 bg-black text-white rounded text-[8px] ml-1">ESPACIO</kbd>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ERROR EXPLANATION / RULE LESSON (Shown dynamically or on answered) */}
          <div id="rule-lesson-box" className="w-full max-w-xl mt-4 min-h-[120px] transition-all">
            {gameState === 'answered' ? (
              <div className="border-2 border-white bg-[#0F0F0F] p-4 relative shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]">
                <div className="absolute -top-3 left-4 bg-white text-black border border-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  REGLA GRAMATICAL: {activeNoun.rule}
                </div>
                <div className="mt-2">
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed mb-2 font-mono">
                    {activeNoun.explanation}
                  </p>
                  <p className="text-xs text-gray-400 font-bold">
                    Ejemplo correcto: <span className="underline italic text-white uppercase">{activeNoun.example} {activeNoun.word.toLowerCase()}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-white border-dashed p-4 flex flex-col items-center justify-center text-center opacity-30 text-xs text-white/70">
                <HelpCircle className="w-6 h-6 mb-2 text-white" />
                <p>Haz swipe para ver la respuesta y aprender la regla gramatical del sustantivo.</p>
                <div className="mt-2 flex gap-3 text-[10px] font-mono">
                  <span>Fácil: terminan en -o / -a</span>
                  <span>Medio: -e, -l, -r, -z, -d</span>
                  <span>Difícil: casos excepcionales y tramposos</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tap Buttons for Mobile / Tablet Users below the card */}
          {gameState === 'playing' && (
            <div className="w-full max-w-md flex gap-4 mt-2 md:hidden">
              <button
                onClick={() => handleAnswer('masculino')}
                className="flex-1 bg-[#161616] border-2 border-white text-white py-3 px-2 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black transition-colors"
              >
                EL (MASC)
              </button>
              <button
                onClick={() => handleAnswer('femenino')}
                className="flex-1 bg-[#161616] border-2 border-white text-white py-3 px-2 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black transition-colors"
              >
                LA (FEM)
              </button>
            </div>
          )}

        </div>

        {/* FEMENINE SIDEBAR RAIL (RIGHT) - Clickable to choose "LA" */}
        <button
          id="feminine-sidebar-rail"
          onClick={() => handleAnswer('femenino')}
          disabled={gameState === 'answered'}
          className={`col-span-2 hidden md:flex flex-col items-center justify-center border-l-2 border-white transition-all cursor-pointer select-none group relative overflow-hidden ${
            gameState === 'answered'
              ? activeNoun.gender === 'femenino'
                ? 'bg-white text-black opacity-100'
                : 'bg-black text-gray-700 opacity-20 border-l border-dashed border-gray-800'
              : xOffset > 30
                ? 'bg-[#1A1A1A] opacity-90 scale-105 border-l-4'
                : 'bg-[#0E0E0E] opacity-40 hover:opacity-80 hover:bg-[#111]'
          }`}
        >
          <div className="absolute top-4 right-4 text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
            <kbd className="px-1 font-bold">→</kbd>
            O <span className="px-1 border border-white rounded font-bold">D</span>
          </div>
          <p className="text-7xl lg:text-9xl font-black tracking-tighter leading-none select-none transition-transform group-hover:scale-110" style={{ writingMode: 'vertical-rl' }}>
            LA
          </p>
          <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.2em] font-bold">FEMENINO</p>
          <div className="absolute bottom-4 text-[10px] uppercase font-bold opacity-30 group-hover:opacity-100 transition-opacity">
            Hacer clic / Swipe Der.
          </div>
        </button>

      </main>

      {/* FOOTER INFO BAR */}
      <footer id="footer-container" className="border-t-2 border-white p-4 md:p-6 bg-[#0E0E0E] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 z-10">
        
        {/* Progress in Current Difficulty */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold tracking-wider opacity-60">
            <span>PROGRESO NIVEL</span>
            <span>{practicedInDifficultyCount} / {totalInDifficulty} PRACTICADOS</span>
          </div>
          <div className="h-3 w-full border border-white bg-black mt-2 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-white transition-all duration-500" 
              style={{ width: `${totalInDifficulty > 0 ? (practicedInDifficultyCount / totalInDifficulty) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Global Statistics */}
        <div className="flex flex-col justify-center border-t border-white/10 sm:border-t-0 sm:border-l border-white/20 sm:pl-4 lg:pl-6">
          <span className="text-[10px] uppercase font-mono font-bold opacity-60 tracking-wider">RACHA MÁXIMA</span>
          <div className="flex items-center gap-2 mt-1">
            <Award className="w-5 h-5 text-white fill-none" />
            <span className="text-lg font-black text-white uppercase font-mono italic">
              {maxStreak} CORRECTOS
            </span>
          </div>
        </div>

        {/* Database coverage */}
        <div className="flex flex-col justify-center border-t border-white/10 lg:border-t-0 lg:border-l border-white/20 lg:pl-6">
          <span className="text-[10px] uppercase font-mono font-bold opacity-60 tracking-wider">BASE DE DATOS TOTAL</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-black">
              {Object.keys(history).length} / {nounsData.length} VISTOS
            </span>
            <span className="text-[10px] bg-white text-black px-1.5 font-black uppercase rounded-none border border-black">
              {overallPracticedPercentage}%
            </span>
          </div>
        </div>

        {/* Shortcuts / Reset Action */}
        <div className="flex flex-col justify-center border-t border-white/10 sm:border-t-0 lg:border-l border-white/20 sm:pl-4 lg:pl-6">
          <span className="text-[10px] uppercase font-mono font-bold opacity-60 tracking-wider">ATAJOS TECLADO & RESET</span>
          <div className="flex items-center justify-between mt-1 gap-2">
            <div className="flex space-x-1.5 text-[9px] font-mono">
              <kbd className="px-1.5 py-0.5 border border-white bg-white text-black font-bold">A</kbd>
              <span className="self-center opacity-80">MASC</span>
              <kbd className="px-1.5 py-0.5 border border-white bg-white text-black font-bold ml-1">D</kbd>
              <span className="self-center opacity-80">FEM</span>
            </div>
            
            <button
              id="btn-reset-stats"
              onClick={handleReset}
              className="text-[10px] font-black uppercase text-gray-400 hover:text-white px-2 py-1 border border-transparent hover:border-white transition-colors flex items-center gap-1 bg-transparent cursor-pointer"
              title="Borrar todo el progreso"
            >
              <RotateCcw className="w-3 h-3" />
              REINICIAR
            </button>
          </div>
        </div>

      </footer>

      {/* --- NOUN DICTIONARY / LIBRARY OVERLAY PANEL --- */}
      {isLibraryOpen && (
        <div id="library-overlay" className="absolute inset-0 bg-[#000000]/95 flex justify-end z-50 animate-fade-in">
          
          {/* Main Slide Panel */}
          <div className="w-full max-w-2xl bg-[#0C0C0C] border-l-4 border-white h-full flex flex-col justify-between shadow-2xl relative">
            
            {/* Library Header */}
            <div className="p-6 border-b-2 border-white bg-[#111111] flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Diccionario de Sustantivos</h3>
                  <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Base de datos de {nounsData.length} palabras de práctica</p>
                </div>
              </div>
              
              <button
                id="btn-close-library"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1 border border-white hover:bg-white hover:text-black transition-colors"
                title="Cerrar diccionario"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b border-white/20 bg-[#141414] space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar palabra, traducción, regla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070707] border-2 border-white py-2 pl-9 pr-4 text-sm font-mono text-white focus:outline-none focus:border-white"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-white/50 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick status/difficulty tags */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-mono text-white/40 uppercase mr-1 flex items-center gap-1">
                  <ListFilter className="w-3 h-3" /> Filtrar:
                </span>
                
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'fácil', label: 'Fácil' },
                  { id: 'medio', label: 'Medio' },
                  { id: 'difícil', label: 'Difícil' },
                  { id: 'correct', label: 'Vistos ✅' },
                  { id: 'incorrect', label: 'Fallados ❌' },
                  { id: 'unseen', label: 'Sin ver' }
                ].map(filterBtn => (
                  <button
                    key={filterBtn.id}
                    onClick={() => setLibraryFilter(filterBtn.id as any)}
                    className={`px-2 py-1 text-[10px] font-bold uppercase border border-white/30 transition-all ${
                      libraryFilter === filterBtn.id 
                        ? 'bg-white text-black border-white' 
                        : 'hover:bg-white/10 text-white'
                    }`}
                  >
                    {filterBtn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Word List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {filteredLibraryNouns.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-sm font-mono">No se encontraron sustantivos.</p>
                  <p className="text-xs">Prueba cambiando tu búsqueda o tus filtros.</p>
                </div>
              ) : (
                filteredLibraryNouns.map((noun, idx) => {
                  const status = history[noun.word];
                  return (
                    <div 
                      key={idx}
                      className={`border-2 p-4 transition-all bg-[#0F0F0F] relative ${
                        status === 'correct' 
                          ? 'border-white hover:bg-[#111111]' 
                          : status === 'incorrect' 
                            ? 'border-gray-600 border-dashed hover:bg-[#141414]' 
                            : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {/* Top labels */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[18px] font-black uppercase text-white`}>
                            {noun.gender === 'masculino' ? 'EL' : 'LA'}{' '}
                            <span className="underline decoration-white decoration-2">{noun.word}</span>
                          </span>
                          <span className="text-xs text-white/50 font-mono">({noun.translation})</span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[9px] font-mono uppercase bg-white/10 text-white px-1.5 py-0.5 border border-white/10">
                            {noun.difficulty}
                          </span>
                          {status === 'correct' && (
                            <span className="text-white bg-[#222222] p-0.5 border border-white/40" title="¡Correcto!">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                          {status === 'incorrect' && (
                            <span className="text-gray-400 bg-[#111111] p-0.5 border border-white/20 line-through" title="¡Erróneo!">
                              <X className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Explanation of the rule */}
                      <div className="bg-black/50 p-2.5 border border-white/10">
                        <p className="text-[10px] font-mono text-white uppercase mb-1 flex items-center gap-1 font-bold">
                          <Info className="w-3 h-3" />
                          Regla: {noun.rule}
                        </p>
                        <p className="text-xs text-white/80 font-sans leading-relaxed">
                          {noun.explanation}
                        </p>
                        <p className="text-xs mt-1 text-white/50">
                          Ejemplo: <strong className="text-white uppercase font-mono">{noun.example} {noun.word.toLowerCase()}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Library Footer summary */}
            <div className="p-4 border-t-2 border-white bg-[#111111] flex items-center justify-between text-xs font-mono">
              <span className="opacity-60 uppercase">Mostrando {filteredLibraryNouns.length} de {nounsData.length} palabras</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLibraryFilter('todos');
                }}
                className="text-white hover:underline uppercase text-[10px] font-bold"
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
