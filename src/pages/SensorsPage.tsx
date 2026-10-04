import React from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Thermometer,
  Gauge,
  Clock,
  AlertTriangle,
  ArrowRight,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparklineChart } from '../components/common/SparklineChart';
import { StatusBadge } from '../components/common/StatusBadge';

export const SensorsPage: React.FC = () => {
  const {
    sensorData,
    isSensorSimulating,
    toggleSensorSimulation,
    resetSensorsToBaseline,
    setActiveTab,
    selectedComponent
  } = useApp();

  const isAnomalous = sensorData.vibration.current > 5.5;

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span>Simulated Edge Telemetry</span>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">PROTOTYPE EMULATION</span>
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Sensor Analytics — High Pressure Turbine (HPT)
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Component: <strong className="text-cyan-400">{selectedComponent.name}</strong> · Accelerometer: <strong className="text-cyan-400">ACC-HPT-07</strong> · Thermocouple: <strong className="text-cyan-400">TC-EGT-02</strong>
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] rounded">
            <span
              className={`w-2 h-2 rounded-full ${
                isSensorSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            <span className={isSensorSimulating ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {isSensorSimulating ? '● SIMULATING LIVE TELEMETRY' : '○ PAUSED'}
            </span>
          </div>

          <button
            onClick={toggleSensorSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              isSensorSimulating
                ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50 hover:bg-amber-900/60'
                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
            }`}
          >
            {isSensorSimulating ? <Pause size={13} /> : <Play size={13} />}
            <span>{isSensorSimulating ? 'PAUSE STREAM' : 'START SIMULATED TELEMETRY'}</span>
          </button>

          <button
            onClick={resetSensorsToBaseline}
            title="Reset simulated telemetry to nominal baseline"
            className="p-1.5 bg-[#0F172A] hover:bg-slate-850 border border-[#1E293B] rounded text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Sensor KPI Cards Grid (4 Sensors) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        {/* Vibration Sensor */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Rotor Vibration</span>
            <Activity size={14} className={isAnomalous ? 'text-rose-400' : 'text-cyan-400'} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tabular-nums ${isAnomalous ? 'text-rose-400' : 'text-white'}`}>
              {sensorData.vibration.current.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 uppercase">mm/s</span>
          </div>

          <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline:</span>
              <span className="text-slate-200">{sensorData.vibration.baseline} mm/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deviation:</span>
              <span className={`font-bold ${isAnomalous ? 'text-rose-400' : 'text-emerald-400'}`}>
                +{sensorData.vibration.deviationPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Status:</span>
              <StatusBadge
                level={isAnomalous ? 'HIGH' : 'LOW'}
                label={sensorData.vibration.status}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Temperature Sensor */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Turbine EGT / Surface</span>
            <Thermometer size={14} className={sensorData.temperature.current > 75 ? 'text-amber-400' : 'text-cyan-400'} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tabular-nums ${sensorData.temperature.current > 75 ? 'text-amber-400' : 'text-white'}`}>
              {sensorData.temperature.current}
            </span>
            <span className="text-xs text-slate-400 uppercase">°C</span>
          </div>

          <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline:</span>
              <span className="text-slate-200">{sensorData.temperature.baseline}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trend:</span>
              <span className={`font-bold ${sensorData.temperature.trend === 'INCREASING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {sensorData.temperature.trend}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Status:</span>
              <StatusBadge
                level={sensorData.temperature.current > 75 ? 'MEDIUM' : 'LOW'}
                label={sensorData.temperature.trend === 'INCREASING' ? 'ELEVATED' : 'NOMINAL'}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Engine RPM */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Rotor Speed (N2)</span>
            <Gauge size={14} className="text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">
              {sensorData.rpm.current.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 uppercase">RPM</span>
          </div>

          <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Rated N2 Max:</span>
              <span className="text-slate-200">10,500 RPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Harmonic Mode:</span>
              <span className="text-slate-200">1X Nominal</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Status:</span>
              <StatusBadge level="LOW" label={sensorData.rpm.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Lifecycle Flight Exposure */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
            <span>Flight Exposure</span>
            <Clock size={14} className="text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">
              {sensorData.flightCycles.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 uppercase">Cycles</span>
          </div>

          <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Operating Hours:</span>
              <span className="text-slate-200">{sensorData.operatingHours.toLocaleString()} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fatigue Duty:</span>
              <span className="text-amber-400 font-bold">85% Overhaul Limit</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Status:</span>
              <StatusBadge level="MEDIUM" label="ELEVATED EXPOSURE" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts: Vibration Oscillogram & Temperature Time-Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Vibration Oscillogram */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-xs">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-rose-400" />
              <span className="font-bold text-white uppercase">
                VIBRATION AMPLITUDE OSCILLOGRAM (CH-ACC-07)
              </span>
            </div>
            <span className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded font-bold">
              THRESHOLD: &gt; 5.0 mm/s
            </span>
          </div>

          <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3">
            <SparklineChart
              data={sensorData.vibration.history}
              color={isAnomalous ? '#EF4444' : '#06B6D4'}
              baselineColor="#64748B"
              height={160}
              unit=" mm/s"
              showBaseline={true}
            />
          </div>

          <div className="text-[11px] text-slate-300 leading-relaxed bg-[#080C14] p-3 rounded border border-[#1E293B]">
            <strong className="text-rose-400">Signal Analysis:</strong> High-frequency harmonic oscillation correlates with physical mass unbalance or aerodynamic shedding caused by aerofoil leading edge cracking.
          </div>
        </div>

        {/* Temperature Time Series */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-xs">
            <div className="flex items-center gap-2">
              <Thermometer size={14} className="text-amber-400" />
              <span className="font-bold text-white uppercase">
                TURBINE SURFACE TEMPERATURE TREND (TC-02)
              </span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded font-bold">
              WARNING: &gt; 78°C
            </span>
          </div>

          <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3">
            <SparklineChart
              data={sensorData.temperature.history}
              color={sensorData.temperature.current > 75 ? '#F59E0B' : '#10B981'}
              baselineColor="#64748B"
              height={160}
              unit="°C"
              showBaseline={true}
            />
          </div>

          <div className="text-[11px] text-slate-300 leading-relaxed bg-[#080C14] p-3 rounded border border-[#1E293B]">
            <strong className="text-amber-400">Thermal Gradient Analysis:</strong> Heat barrier localized dissipation loss (+14°C climb) suggests thermal barrier coating (TBC) degradation at mid-span aerofoil.
          </div>
        </div>
      </div>

      {/* Action banner to Evidence Fusion */}
      <div className="bg-[#0F172A] border border-cyan-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Radio size={16} />
          </div>
          <div>
            <div className="font-bold text-white">
              Vibration & Temperature Telemetry Ready for Evidence Fusion
            </div>
            <div className="text-[11px] text-slate-400">
              Combine visual borescope crack detection with 80.5% vibration anomaly to calculate true component health risk.
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('evidence-fusion')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-2 transition-colors shrink-0 shadow-lg shadow-cyan-950"
        >
          <span>OPEN EVIDENCE FUSION ENGINE</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
