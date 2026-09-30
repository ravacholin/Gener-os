/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorPattern } from '../errors';

const PATTERN_STATUS_LABEL: Record<ErrorPattern['status'], string> = {
  activo: 'Activo',
  mejorando: 'Mejorando',
  superado: 'Superado',
};

/**
 * Una fila del panel de patrones. El medidor muestra la tasa de error actual y, si
 * bajó, cuál fue la peor: el punto no es informar un porcentaje sino hacer visible
 * que lo que costaba está cediendo.
 */
export function PatternRow({ pattern, latent, active, onFocus }: {
  pattern: ErrorPattern; latent: boolean; active: boolean; onFocus: () => void;
}) {
  const rate = Math.round(pattern.errorRate * 100);
  const peak = Math.round(pattern.peakRate * 100);
  const filled = Math.min(5, Math.max(0, Math.round(pattern.errorRate * 5)));
  const solved = pattern.status === 'superado';

  return (
    <button
      onClick={onFocus}
      title={pattern.tip}
      className={`w-full text-left border p-2.5 ${active ? 'border-ink bg-surface-2' : 'border-ink-faint hover:border-ink-dim'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-black uppercase tracking-tight text-ink">{pattern.label}</span>
        <span className={`shrink-0 text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 border ${
          solved ? 'bg-ink text-canvas border-ink' : 'border-ink-faint text-ink-dim'
        }`}>
          {PATTERN_STATUS_LABEL[pattern.status]}
        </span>
      </div>

      <p className="mt-1 text-[10px] font-mono text-ink-dim leading-snug line-clamp-2">{pattern.tip}</p>

      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
        <span aria-hidden="true" className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map(i => (
            <span key={i} className={`block w-3 h-1.5 border border-ink-faint ${i < filled ? 'bg-ink border-ink' : ''}`} />
          ))}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-ink-dim">
          {rate}% de error en {pattern.attempts}
          {peak > rate && ` · antes ${peak}%`}
        </span>
        {latent && !solved && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-ink-faint">no sale en este nivel</span>
        )}
      </div>
    </button>
  );
}
