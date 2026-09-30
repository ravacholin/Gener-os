/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function Chip({ active, onClick, children, title, id }: { active?: boolean; onClick?: () => void; children: React.ReactNode; title?: string; id?: string }) {
  const className = `px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border whitespace-nowrap ${
    active ? 'bg-ink text-canvas border-ink' : 'border-ink-faint text-ink-dim'
  } ${onClick ? 'hover:text-ink hover:border-ink-dim cursor-pointer' : ''}`;
  if (onClick) {
    return <button id={id} onClick={onClick} title={title} className={className}>{children}</button>;
  }
  return <span id={id} title={title} className={className}>{children}</span>;
}
