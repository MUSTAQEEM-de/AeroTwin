import React from 'react';
import {
  BarChart3,
  Layers,
  Plane,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Activity,
  FileCheck2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SparklineChart } from '../components/common/SparklineChart';

export const EngineeringDashboardPage: React.FC = () => {
  const {
    selectedAircraft,
    selectedComponent,
    sensorData,
    recommendation,
    auditLogs,
    setActiveTab
  } = useApp();

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Propulsion Fleet Reliability
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Engineering Telemetry Dashboard — {selectedAircraft.id}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Fleet Asset: {selectedAircraft.model} · Left Powerplant: CFM56-5B (ENG-01) · Engineering Base: Hangar 4
          </p>
        </div>

        <button
          onClick={() => setActiveTab('model-registry')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-cyan-400 font-mono text-xs rounded transition-colors"
        >
          <span>VIEW AI MODEL REGISTRY</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Component Health Distribution KPI Bar (Section 34) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {/* Total Components Monitored */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">MONITORED STAGES</div>
          <div className="text-2xl font-bold text-white">24 PARTS</div>
          <div className="text-[10px] text-slate-400">Fan, Compressor & Turbine</div>
        </div>

        {/* Healthy Components */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>HEALTHY COMPONENTS</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">18</div>
          <div className="text-[10px] text-slate-400">Health Index ≥ 85 / Nominal</div>
        </div>

        {/* Attention Required */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>ATTENTION / MONITORING</span>
          </div>
          <div className="text-2xl font-bold text-amber-300">5</div>
          <div className="text-[10px] text-slate-400">Health Index 70 - 84</div>
        </div>

        {/* High Risk */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>CRITICAL / HIGH RISK</span>
          </div>
          <div className="text-2xl font-bold text-rose-400">1</div>
          <div className="text-[10px] text-rose-400 font-bold">Turbine Blade #07 (TB-007)</div>
        </div>
      </div>

      {/* Sensor Trends & Open Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sensor Trends (7 cols) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              <span>PROPULSION VIBRATION HARMONIC SPECTRUM</span>
            </span>
            <span className="text-rose-400 text-[10px] font-bold">ANOMALY DETECTED (+80.5%)</span>
          </div>

          <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3">
            <SparklineChart
              data={sensorData.vibration.history}
              color="#EF4444"
              baselineColor="#64748B"
              height={150}
              unit=" mm/s"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 bg-[#080C14] border border-[#1E293B] rounded">
              <div className="text-[10px] text-slate-400">CH-ACC-07</div>
              <div className="text-sm font-bold text-rose-400">7.4 mm/s</div>
              <div className="text-[9px] text-rose-400">HPT Stage 1</div>
            </div>
            <div className="p-2.5 bg-[#080C14] border border-[#1E293B] rounded">
              <div className="text-[10px] text-slate-400">CH-ACC-01</div>
              <div className="text-sm font-bold text-emerald-400">2.1 mm/s</div>
              <div className="text-[9px] text-emerald-400">Fan Front Bearing</div>
            </div>
            <div className="p-2.5 bg-[#080C14] border border-[#1E293B] rounded">
              <div className="text-[10px] text-slate-400">CH-ACC-03</div>
              <div className="text-sm font-bold text-emerald-400">3.4 mm/s</div>
              <div className="text-[9px] text-emerald-400">HPC Stage 3</div>
            </div>
          </div>
        </div>

        {/* Open Recommendations & Actions (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <FileCheck2 size={14} className="text-amber-400" />
                <span>OPEN MAINTENANCE ACTION</span>
              </span>
              <StatusBadge level="HIGH" size="sm" />
            </div>

            <div className="p-3 bg-[#080C14] border border-rose-800/40 rounded-lg space-y-1.5">
              <div className="text-rose-300 font-bold text-xs">
                TB-007: Non-Destructive Inspection (NDI) Required
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                4.2 mm leading-edge defect correlated with 80.5% vibration rise. Ground hold in effect pending eddy-current verification.
              </p>
              <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                <span>Work Order: WO-2026-8842</span>
                <span className="text-cyan-400">Status: {recommendation.decisionState}</span>
              </div>
            </div>

            <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg space-y-1">
              <div className="text-slate-300 font-bold text-xs">
                TB-006: Scheduled Borescope Re-check
              </div>
              <p className="text-[10px] text-slate-400">
                Minor surface wear recorded. Due at next A-Check cycle.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('recommendations')}
            className="w-full py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center justify-center gap-2 transition-colors"
          >
            <span>DISPATCH GROUND HOLD PROTOCOL</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
