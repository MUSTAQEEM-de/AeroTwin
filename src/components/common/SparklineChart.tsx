import React from 'react';
import { SensorPoint } from '../../types';

interface SparklineChartProps {
  data: SensorPoint[];
  color?: string;
  baselineColor?: string;
  height?: number;
  unit?: string;
  showBaseline?: boolean;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#06B6D4', // laser cyan
  baselineColor = '#64748B', // slate
  height = 140,
  unit = '',
  showBaseline = true
}) => {
  if (!data || data.length === 0) {
    return <div className="h-32 flex items-center justify-center text-xs text-slate-500 font-mono">NO TELEMETRY DATA</div>;
  }

  const values = data.map((d) => d.value);
  const baselines = data.map((d) => d.baseline);
  const allValues = showBaseline ? [...values, ...baselines] : values;

  const min = Math.min(...allValues) * 0.92;
  const max = Math.max(...allValues) * 1.08;
  const range = max - min || 1;

  const width = 480;
  const paddingX = 30;
  const paddingY = 20;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * usableWidth;
    const y = height - paddingY - ((d.value - min) / range) * usableHeight;
    return { x, y, value: d.value, time: d.time };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Baseline line
  const baselineValue = data[0]?.baseline ?? min;
  const baselineY = height - paddingY - ((baselineValue - min) / range) * usableHeight;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />

        {/* Baseline indicator */}
        {showBaseline && (
          <g>
            <line
              x1={paddingX}
              y1={baselineY}
              x2={width - paddingX}
              y2={baselineY}
              stroke={baselineColor}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={width - paddingX + 4}
              y={baselineY + 3}
              fill="#94A3B8"
              fontSize="9"
              fontFamily="monospace"
            >
              BASE {baselineValue}{unit}
            </text>
          </g>
        )}

        {/* Area fill */}
        {points.length > 1 && (
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
            fill={`url(#gradient-${color.replace('#', '')})`}
          />
        )}

        {/* Primary curve */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isLast ? 4.5 : 2.5}
                fill={isLast ? '#FFFFFF' : color}
                stroke={color}
                strokeWidth={isLast ? 2 : 1}
              />
              {/* Point tooltip/label on latest reading */}
              {isLast && (
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {p.value}{unit}
                </text>
              )}
            </g>
          );
        })}

        {/* Time labels */}
        {data.map((d, idx) => {
          if (idx === 0 || idx === Math.floor(data.length / 2) || idx === data.length - 1) {
            const x = paddingX + (idx / (data.length - 1)) * usableWidth;
            return (
              <text
                key={idx}
                x={x}
                y={height - 4}
                textAnchor="middle"
                fill="#64748B"
                fontSize="9"
                fontFamily="monospace"
              >
                {d.time}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};
