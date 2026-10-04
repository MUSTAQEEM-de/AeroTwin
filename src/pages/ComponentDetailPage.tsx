import React from 'react';
import {
  Layers,
  Plane,
  Clock,
  Calendar,
  AlertTriangle,
  Camera,
  Activity,
  Cpu,
  Boxes,
  ShieldCheck,
  FileCheck2,
  HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthGauge } from '../components/common/HealthGauge';
import { StatusBadge } from '../components/common/StatusBadge';
import { TURBINE_IMAGE_URI } from '../data/mockData';

export const ComponentDetailPage: React.FC = () => {
  const {
    selectedAircraft,
    selectedComponent,
    inspectionData,
    sensorData,
    setActiveTab
  } = useApp();

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Component Technical Dossier
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            {selectedComponent.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Aircraft: <strong className="text-cyan-400">{selectedAircraft.id}</strong> · Engine: <strong className="text-cyan-400">ENG-01</strong> · Component ID: <strong className="text-cyan-400">{selectedComponent.code}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge level={selectedComponent.risk} status={selectedComponent.status} />
          <button
            onClick={() => setActiveTab('inspection')}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded transition-colors"
          >
            <Camera size={14} />
            <span>TRIGGER INSPECTION</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Health & Specifications */}
        <div className="lg:col-span-4 space-y-4">
          {/* Health Gauge Box */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col items-center justify-center space-y-3">
            <HealthGauge score={selectedComponent.health} size={150} />
            <div className="text-center font-mono space-y-1">
              <div className="text-xs font-bold text-rose-400">
                DEGRADATION ANOMALY DETECTED
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Health index decreased from baseline 91 to 68 following on-wing borescope edge inference.
              </p>
            </div>
          </div>

          {/* Core Specifications Sheet */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 font-mono text-xs space-y-2.5">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider border-b border-[#1E293B] pb-1.5 flex items-center justify-between">
              <span>COMPONENT LIFECYCLE METRICS</span>
              <Layers size={13} className="text-cyan-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Flight Cycles:</span>
                <span className="text-white font-bold">{selectedComponent.cycles.toLocaleString()} cycles</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Operating Hours:</span>
                <span className="text-white font-bold">{selectedComponent.hours.toLocaleString()} hrs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Last Inspection:</span>
                <span className="text-slate-200">{inspectionData.timestamp.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Last Maintenance:</span>
                <span className="text-slate-200">C-Check (120 cycles ago)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Sensor Status:</span>
                <span className="text-rose-400 font-bold">{sensorData.vibration.status} (+80.5%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Defect:</span>
                <span className="text-rose-400 font-bold">4.2 mm Leading Edge Crack</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Edge Model Version:</span>
                <span className="text-cyan-400 font-bold">AeroTwin-YOLO-v1.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview, Telemetry & Actions */}
        <div className="lg:col-span-8 space-y-4">
          {/* Component Visual & Borescope Preview */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 text-xs font-mono">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                OPTICAL DEFECT PROBE & SURFACE MAPPING
              </span>
              <span className="text-cyan-400">
                INFERENCE LATENCY: 143 ms (LOCAL NPU)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Preview with Defect Indicator */}
              <div className="relative rounded-lg overflow-hidden border border-[#1E293B] bg-black aspect-4/3">
                <img
                  src={TURBINE_IMAGE_URI}
                  alt="Turbine Blade Inspection"
                  className="w-full h-full object-cover"
                />
                {/* Defect Box */}
                <div
                  className="absolute border-2 border-rose-500 bg-rose-500/10 rounded"
                  style={{ left: '38%', top: '32%', width: '28%', height: '34%' }}
                >
                  <div className="absolute -top-5 left-0 bg-rose-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                    CRACK 4.2mm (94%)
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                  Leading Edge Mid-Span (Section 4B)
                </div>
              </div>

              {/* Finding Summary */}
              <div className="flex flex-col justify-between space-y-3 font-mono text-xs">
                <div className="space-y-2">
                  <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded text-rose-300 space-y-1">
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-rose-400" />
                      <span>CRITICAL DEFECT PROFILE</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Micro-fissure observed propagating inward across thermal barrier coating. Rapid harmonic vibration escalation confirms mechanical stress concentration.
                    </p>
                  </div>

                  <div className="bg-[#080C14] border border-[#1E293B] p-3 rounded space-y-1.5">
                    <div className="text-[10px] uppercase text-slate-400">CORRELATED SENSOR READINGS</div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Vibration Amplitude:</span>
                      <span className="text-rose-400 font-bold">{sensorData.vibration.current} mm/s (Base 4.1)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Operating Temperature:</span>
                      <span className="text-amber-400 font-bold">{sensorData.temperature.current}°C (Base 68)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Rotor RPM:</span>
                      <span className="text-emerald-400 font-bold">8,420 RPM (Nominal)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('evidence-fusion')}
                    className="py-2 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Cpu size={13} />
                    <span>Run Evidence Fusion</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('digital-twin')}
                    className="py-2 px-3 bg-[#080C14] hover:bg-slate-900 border border-[#1E293B] text-slate-300 font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Boxes size={13} />
                    <span>View Digital Twin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <button
              onClick={() => setActiveTab('sensors')}
              className="p-3 bg-[#0F172A] border border-[#1E293B] hover:border-slate-600 rounded-lg text-left transition-colors space-y-1"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Activity size={14} />
                <span>Sensor Stream</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Inspect 10-minute vibration & temperature oscillograms
              </p>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className="p-3 bg-[#0F172A] border border-[#1E293B] hover:border-slate-600 rounded-lg text-left transition-colors space-y-1"
            >
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <FileCheck2 size={14} />
                <span>Decision Support</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Accept, override, or request engineering review
              </p>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className="p-3 bg-[#0F172A] border border-[#1E293B] hover:border-slate-600 rounded-lg text-left transition-colors space-y-1"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck size={14} />
                <span>Compliance Audit</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Review tamper-evident on-device audit trail
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
