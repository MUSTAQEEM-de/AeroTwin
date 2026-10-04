import React, { useState } from 'react';
import {
  Boxes,
  Activity,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Maximize2,
  RotateCw,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { HealthGauge } from '../components/common/HealthGauge';
import { ENGINE_IMAGE_URI } from '../data/mockData';

export const DigitalTwinPage: React.FC = () => {
  const {
    digitalTwin,
    selectedComponent,
    sensorData,
    inspectionData,
    setActiveTab
  } = useApp();

  const [activeHotspot, setActiveHotspot] = useState<string | null>(
    digitalTwin.stressPoints[0]?.id || null
  );
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [activeTimelineStep, setActiveTimelineStep] = useState<string>('dt-3');

  const selectedPoint = digitalTwin.stressPoints.find((p) => p.id === activeHotspot);

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Structural Aero-Thermal Twin
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Digital Twin — {digitalTwin.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Component: <strong className="text-cyan-400">{digitalTwin.componentId}</strong> · Subsystem: <strong className="text-cyan-400">High Pressure Turbine Rotor Disk 1</strong> · Synchronization: <strong className="text-emerald-400">EDGE SYNCHRONIZED</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-3 py-1.5 rounded border transition-colors ${
              wireframeMode
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {wireframeMode ? 'Wireframe Mesh ON' : 'Thermal Map Mode'}
          </button>
          <StatusBadge level={digitalTwin.risk} status={digitalTwin.status} />
        </div>
      </div>

      {/* Main Grid: Digital Twin Visualization & Current State Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Stylized 2D/3D Turbine Blade Model (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-3">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Boxes size={14} className="text-cyan-400" />
              <span>DIGITAL TWIN GEOMETRIC & THERMAL STRESS PROBE</span>
            </span>
            <span className="text-[10px] text-cyan-400">
              CLICK HOTSPOTS FOR FINITE ELEMENT DETAIL
            </span>
          </div>

          {/* Canvas Stage */}
          <div className="relative rounded-lg overflow-hidden border border-[#1E293B] bg-[#05070B] aspect-16/10 flex items-center justify-center">
            {/* Background aerospace turbine disk image */}
            <img
              src={ENGINE_IMAGE_URI}
              alt="Turbine Engine Assembly"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                wireframeMode ? 'opacity-25 filter grayscale contrast-150' : 'opacity-40'
              }`}
            />

            {/* Stylized SVG Blade Aerofoil Blueprint Overlay */}
            <svg
              viewBox="0 0 600 380"
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-auto"
            >
              <defs>
                <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Engineering Grid */}
              <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6" />

              {/* Blade Aerofoil Outline */}
              <path
                d="M 180 320 C 170 250, 190 120, 260 50 C 310 100, 360 210, 370 320 C 330 330, 220 330, 180 320 Z"
                fill="url(#bladeGrad)"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeDasharray={wireframeMode ? '4 2' : 'none'}
              />

              {/* Internal cooling passages */}
              <path
                d="M 230 310 C 220 240, 230 140, 270 90"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M 270 310 C 260 250, 280 160, 310 110"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Dovetail Root representation */}
              <path
                d="M 160 320 L 190 360 L 360 360 L 390 320 Z"
                fill="#0F172A"
                stroke="#64748B"
                strokeWidth="2"
              />

              {/* Stress Hotspot Markers */}
              {digitalTwin.stressPoints.map((point) => {
                const isSelected = activeHotspot === point.id;
                const cx = (point.x / 100) * 600;
                const cy = (point.y / 100) * 380;
                const isHigh = point.intensity === 'high';

                return (
                  <g
                    key={point.id}
                    onClick={() => setActiveHotspot(point.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ping ring for high stress */}
                    {isHigh && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 16 : 12}
                        className="fill-rose-500/20 stroke-rose-500 animate-ping opacity-75"
                        strokeWidth="1"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 9 : 6}
                      fill={isHigh ? '#EF4444' : '#F59E0B'}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all duration-200"
                    />

                    {/* Hotspot Label HUD */}
                    <g transform={`translate(${cx + 12}, ${cy - 8})`}>
                      <rect
                        x="0"
                        y="0"
                        width="150"
                        height="20"
                        rx="3"
                        fill="#0B0F19"
                        stroke={isSelected ? '#38BDF8' : '#1E293B'}
                        strokeWidth="1"
                      />
                      <text
                        x="6"
                        y="13"
                        fill={isHigh ? '#F87171' : '#FCD34D'}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {point.label.split('(')[0]}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Dimension markers */}
              <line x1="140" y1="50" x2="140" y2="360" stroke="#64748B" strokeWidth="1" strokeDasharray="2 2" />
              <text x="105" y="210" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                H: 142 mm
              </text>
            </svg>

            {/* Bottom info pill on stage */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded text-[11px] font-mono flex items-center gap-3">
              <span className="text-cyan-400 font-bold">TB-007 TWIN MODEL v3.4</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">Stress Concentration: Leading Edge 4B</span>
            </div>
          </div>

          {/* Active Hotspot Inspector Details */}
          {selectedPoint && (
            <div className="p-3 bg-[#080C14] border border-cyan-800/40 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle
                  size={16}
                  className={selectedPoint.intensity === 'high' ? 'text-rose-400' : 'text-amber-400'}
                />
                <div>
                  <span className="font-bold text-white">{selectedPoint.label}</span>
                  <div className="text-[10px] text-slate-400">
                    Finite Element Mesh Node ID: FEA-ND-{selectedPoint.id} · Stress Level: <strong className={selectedPoint.intensity === 'high' ? 'text-rose-400 uppercase' : 'text-amber-400 uppercase'}>{selectedPoint.intensity}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('inspection')}
                className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 rounded font-semibold text-[11px] transition-colors"
              >
                Inspect Camera View →
              </button>
            </div>
          )}
        </div>

        {/* Right: Current State Panel & Health Metrics (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase text-xs tracking-wider">
              CURRENT STATE TELEMETRY
            </span>
            <StatusBadge level={digitalTwin.risk} size="sm" />
          </div>

          <div className="flex justify-center py-1">
            <HealthGauge score={digitalTwin.healthScore} size={120} />
          </div>

          <div className="space-y-2 bg-[#080C14] border border-[#1E293B] p-3 rounded-lg">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Twin Health:</span>
              <span className="text-rose-400 font-bold">{digitalTwin.healthScore} / 100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="text-rose-400 font-bold">{digitalTwin.risk}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Operating Status:</span>
              <span className="text-amber-400 font-bold">{digitalTwin.status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Identified Defect:</span>
              <span className="text-rose-400 font-bold">4.2 mm Leading Edge Crack</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Rotor Vibration:</span>
              <span className="text-rose-400 font-bold">{sensorData.vibration.current} mm/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Operating Temp:</span>
              <span className="text-amber-400 font-bold">{sensorData.temperature.current}°C</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Flight Cycles:</span>
              <span className="text-slate-200">{sensorData.flightCycles.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('recommendations')}
            className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center justify-center gap-2 transition-colors"
          >
            <span>REVIEW MAINTENANCE RECOMMENDATION</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Component State History Timeline (Section 25) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono">
        <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-cyan-400" />
            <span>COMPONENT STATE HISTORY TIMELINE</span>
          </span>
          <span className="text-[10px] text-slate-400">
            CLICK EVENTS TO EXPAND DIAGNOSTIC SIGNALS
          </span>
        </div>

        {/* Horizontal/Vertical Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {digitalTwin.historyTimeline.map((item, idx) => {
            const isSelected = activeTimelineStep === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTimelineStep(item.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md'
                    : 'bg-[#080C14] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>STEP 0{idx + 1}</span>
                  <span className="text-cyan-400 font-bold">{item.time}</span>
                </div>

                <div className="text-xs font-bold text-slate-200 truncate">
                  {item.title}
                </div>

                <div className="text-[10px] font-bold text-amber-400 mt-1">
                  {item.state}
                </div>

                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
