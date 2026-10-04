import React from 'react';
import {
  Plane,
  Layers,
  AlertTriangle,
  Flame,
  CloudOff,
  ArrowRight,
  Camera,
  Activity,
  Cpu,
  Boxes,
  ShieldAlert,
  Clock,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthGauge } from '../components/common/HealthGauge';
import { StatusBadge } from '../components/common/StatusBadge';
import { SparklineChart } from '../components/common/SparklineChart';

export const OverviewPage: React.FC = () => {
  const {
    selectedAircraft,
    selectedComponent,
    syncQueue,
    isOffline,
    inspectionData,
    sensorData,
    fusionData,
    setActiveTab,
    runInspection,
    isInspecting
  } = useApp();

  const healthHistoryPoints = [
    { time: 'T-60d', value: 94, baseline: 90 },
    { time: 'T-30d', value: 92, baseline: 90 },
    { time: 'T-14d', value: 91, baseline: 90 },
    { time: 'T-7d', value: 89, baseline: 90 },
    { time: 'T-2d', value: 85, baseline: 90 },
    { time: 'Today Pre', value: 82, baseline: 90 },
    { time: 'Post Insp', value: selectedComponent.health, baseline: 90 }
  ];

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Maintenance Operations
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            AeroTwin Edge Command Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Offline Edge-AI Maintenance Copilot for Aerospace MRO · Airbus A320 Powerplant Fleet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inspection')}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded transition-colors"
          >
            <Camera size={14} />
            <span>OPEN INSPECTION WORKSPACE</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards (5 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        {/* Aircraft */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Aircraft</span>
            <Plane size={13} className="text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {selectedAircraft.id}
          </div>
          <div className="text-[11px] text-slate-400">
            {selectedAircraft.model.replace('Airbus ', '')}
          </div>
        </div>

        {/* Components Monitored */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Components Monitored</span>
            <Layers size={13} className="text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            24
          </div>
          <div className="text-[11px] text-slate-400">
            Engine ENG-01 & Gear
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Active Alerts</span>
            <AlertTriangle size={13} className="text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 tracking-tight">
            3
          </div>
          <div className="text-[11px] text-amber-400/80">
            2 Telemetry + 1 Vision
          </div>
        </div>

        {/* High-Risk Components */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>High-Risk Components</span>
            <Flame size={13} className="text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-400 tracking-tight">
            1
          </div>
          <div className="text-[11px] text-rose-400/80 font-bold">
            TB-007 (Blade #07)
          </div>
        </div>

        {/* Offline Queue */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Offline Queue</span>
            <CloudOff size={13} className={isOffline ? 'text-amber-400' : 'text-slate-400'} />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {syncQueue.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {isOffline ? 'Pending Commit' : 'Local Delta Cache'}
          </div>
        </div>
      </div>

      {/* Main Section: Current Component & Health History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Current Component Spotlight Card */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Primary Monitored Component
              </div>
              <h2 className="text-xl font-bold font-mono text-white mt-0.5">
                {selectedComponent.name}
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Part Code: <strong className="text-cyan-400">{selectedComponent.code}</strong> · Engine ENG-01 (CFM56)
              </div>
            </div>
            <StatusBadge level={selectedComponent.risk} status={selectedComponent.status} />
          </div>

          {/* Health Gauge & Telemetry Summary */}
          <div className="grid grid-cols-2 items-center py-2 border-y border-[#1E293B]/70">
            <div className="flex justify-center">
              <HealthGauge score={selectedComponent.health} size={130} />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Risk Assessment:</span>
                <span className="text-rose-400 font-bold">{selectedComponent.risk}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Component Status:</span>
                <span className="text-amber-400 font-bold">{selectedComponent.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Flight Cycles:</span>
                <span className="text-slate-200">{selectedComponent.cycles.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Operating Hours:</span>
                <span className="text-slate-200">{selectedComponent.hours.toLocaleString()} hrs</span>
              </div>
            </div>
          </div>

          {/* Urgent Finding Callout */}
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-3 text-xs font-mono space-y-1">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-[11px]">
              <ShieldAlert size={14} className="text-rose-400" />
              <span>ACTIVE DEFECT DETECTED ON EDGE INFERENCE</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              4.2 mm structural crack identified on Leading Edge (Mid-span). Simulated vibration telemetry is currently +80.5% above calibrated nominal baseline.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('evidence-fusion')}
              className="py-2 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Cpu size={13} />
              <span>View Fusion Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="py-2 px-3 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Action Signoff</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Component Health History & Timeline */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Degradation Trajectory
              </div>
              <h2 className="text-base font-bold font-mono text-white">
                Turbine Blade #07 Health History
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">
                Initial: <strong className="text-emerald-400">91</strong>
              </span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-400">
                Current: <strong className="text-rose-400">{selectedComponent.health}</strong>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-rose-400 font-bold">RISK: HIGH</span>
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>HEALTH INDEX EVOLUTION (0 - 100)</span>
              <span className="text-cyan-400">CALIBRATED BASELINE: 90</span>
            </div>
            <SparklineChart
              data={healthHistoryPoints}
              color={selectedComponent.health < 75 ? '#EF4444' : '#10B981'}
              baselineColor="#64748B"
              height={140}
              unit=""
              showBaseline={true}
            />
          </div>

          {/* Health Transitions Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-[#080C14] border border-[#1E293B] p-2.5 rounded">
              <div className="text-[10px] text-slate-400 uppercase">Pre-Flight Baseline</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">91 / 100</div>
              <div className="text-[10px] text-slate-400 mt-1">Nominal dispatch state</div>
            </div>

            <div className="bg-[#080C14] border border-[#1E293B] p-2.5 rounded">
              <div className="text-[10px] text-slate-400 uppercase">After Edge Inspection</div>
              <div className="text-base font-bold text-rose-400 mt-0.5">68 / 100</div>
              <div className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                <TrendingDown size={11} />
                <span>-23 Pt Defect Penalty</span>
              </div>
            </div>

            <div className="bg-[#080C14] border border-[#1E293B] p-2.5 rounded">
              <div className="text-[10px] text-slate-400 uppercase">Operating Window</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">72–110 hrs</div>
              <div className="text-[10px] text-slate-400 mt-1">Immediate NDT required</div>
            </div>
          </div>

          {/* Quick Workflow Jump Bar */}
          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RECOMMENDED OPERATIONAL SEQUENCE:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('inspection')}
                className="text-cyan-400 hover:underline"
              >
                1. Inspect
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setActiveTab('sensors')}
                className="text-cyan-400 hover:underline"
              >
                2. Telemetry
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setActiveTab('evidence-fusion')}
                className="text-cyan-400 hover:underline"
              >
                3. Fusion
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setActiveTab('digital-twin')}
                className="text-cyan-400 hover:underline"
              >
                4. Twin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
