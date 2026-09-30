/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, Check, Info, ListFilter, Mars, Search, Target, Venus, X } from 'lucide-react';
import { nounsData, Noun, Difficulty } from '../nouns';
import { SrsState } from '../srs';
import { ErrorPattern, patternIncludes } from '../errors';
import { isLatent } from '../remediation';
import { Chip } from './Chip';
import { PatternRow } from './PatternRow';

type LibraryFilter = 'todos' | Difficulty | 'aprendiendo' | 'dominado' | `foco:${string}`;

interface LibraryProps {
  srsState: SrsState;
  patterns: ErrorPattern[];
  /** Palabras en juego en el nivel actual; solo sirve para marcar patrones latentes. */
  poolNouns: Noun[];
  onClose: () => void;
}

/** Diccionario: las palabras practicadas, con búsqueda, filtros y el panel de patrones. */
export function Library({ srsState, patterns, poolNouns, onClose }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>('todos');

  const focusPattern = useMemo(() => {
    if (!libraryFilter.startsWith('foco:')) return null;
    return patterns.find(p => p.id === libraryFilter.slice('foco:'.length)) ?? null;
  }, [libraryFilter, patterns]);

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
      if (focusPattern) return patternIncludes(focusPattern, noun) && matchesSearch;
      const card = srsState.cards[noun.word];
      if (libraryFilter === 'aprendiendo') return !!card && card.box <= 2 && matchesSearch;
      if (libraryFilter === 'dominado') return !!card && card.box >= 3 && matchesSearch;
      return matchesSearch;
    });
  }, [searchQuery, libraryFilter, practicedLibraryNouns, srsState, focusPattern]);

  return (
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
            onClick={onClose}
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
            {focusPattern && (
              <Chip active onClick={() => setLibraryFilter('todos')} title="Quitar el foco">
                Foco: {focusPattern.label} ✕
              </Chip>
            )}
          </div>
        </div>

        {/* TUS PATRONES — el diagnóstico vive acá adentro y no en una pantalla
            nueva: el Diccionario ya es la superficie de repaso. */}
        {patterns.length > 0 && (
          <div id="patterns-panel" className="px-4 py-3 border-b border-ink-faint bg-canvas space-y-2 max-h-40 md:max-h-56 overflow-y-auto shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest text-ink-dim">
              <Target className="w-3 h-3" aria-hidden="true" /> Tus patrones
            </div>
            {patterns.map(pattern => (
              <PatternRow
                key={pattern.id}
                pattern={pattern}
                latent={isLatent(pattern, poolNouns)}
                active={focusPattern?.id === pattern.id}
                onFocus={() => setLibraryFilter(
                  focusPattern?.id === pattern.id ? 'todos' : `foco:${pattern.id}`,
                )}
              />
            ))}
          </div>
        )}

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
            filteredLibraryNouns.map(noun => {
              const card = srsState.cards[noun.word];
              const status: 'unseen' | 'aprendiendo' | 'dominado' = !card ? 'unseen' : card.box >= 3 ? 'dominado' : 'aprendiendo';
              return (
                <div
                  key={noun.word}
                  className={`border p-4 bg-surface relative ${
                    status === 'dominado'
                      ? 'border-ink hover:bg-surface-2'
                      : status === 'aprendiendo'
                        ? 'border-ink-faint hover:bg-surface-2'
                        : 'border-ink-faint hover:border-ink-dim'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2.5">
                    <span className="text-base md:text-lg font-black uppercase tracking-tight text-ink inline-flex items-center gap-1.5">
                      {noun.gender === 'masculino'
                        ? <Mars className="w-4 h-4 md:w-5 md:h-5 shrink-0" aria-hidden="true" />
                        : <Venus className="w-4 h-4 md:w-5 md:h-5 shrink-0" aria-hidden="true" />}
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
  );
}
