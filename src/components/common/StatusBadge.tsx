import React from 'react';
import { RiskLevel, ComponentStatus } from '../../types';

interface StatusBadgeProps {
  level?: RiskLevel;
  status?: ComponentStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  level,
  status,
  label,
  size = 'md'
}) => {
  let color = 'text-slate-400 border-slate-700 bg-slate-900/60';
  let dotColor = 'bg-slate-400';
  let text = label || level || status || 'UNKNOWN';

  if (level === 'HIGH' || level === 'CRITICAL' || status === 'ATTENTION REQUIRED' || status === 'GROUNDED') {
    color = 'text-rose-400 border-rose-500/30 bg-rose-950/30';
    dotColor = 'bg-rose-500 ring-2 ring-rose-500/20';
  } else if (level === 'MEDIUM' || status === 'MONITORING') {
    color = 'text-amber-400 border-amber-500/30 bg-amber-950/30';
    dotColor = 'bg-amber-400 ring-2 ring-amber-400/20';
  } else if (level === 'LOW' || status === 'NORMAL') {
    color = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
    dotColor = 'bg-emerald-400 ring-2 ring-emerald-400/20';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border ${padding} ${color} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{text}</span>
    </span>
  );
};
