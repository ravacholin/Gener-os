/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center gap-1">
      <span className="text-[9px] font-mono uppercase tracking-widest text-ink-dim">{label}</span>
      <div className="text-ink">{children}</div>
    </div>
  );
}
