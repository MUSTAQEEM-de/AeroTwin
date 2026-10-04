import React from 'react';

interface HealthGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showSubtitle?: boolean;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'HEALTH SCORE',
  showSubtitle = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // emerald
  let statusText = 'NOMINAL';
  let textColor = 'text-emerald-400';

  if (score < 70) {
    strokeColor = '#EF4444'; // rose/red
    statusText = 'HIGH RISK';
    textColor = 'text-rose-400';
  } else if (score < 85) {
    strokeColor = '#F59E0B'; // amber
    statusText = 'MONITORING';
    textColor = 'text-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Calibrated value track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Gauge center numerical text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-mono tracking-tight text-slate-100 tabular-nums">
          {score}
        </span>
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
          / 100
        </span>
      </div>
      {showSubtitle && (
        <div className="mt-2 text-center">
          <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
            {label}
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wider ${textColor}`}>
            {statusText}
          </div>
        </div>
      )}
    </div>
  );
};
