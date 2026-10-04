import React from 'react';
import {
  Cpu,
  Eye,
  Activity,
  History,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Clock,
  ShieldAlert,
  ArrowDown,
  Layers,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EvidenceScenario } from '../types';
import { HealthGauge } from '../components/common/HealthGauge';
import { StatusBadge } from '../components/common/StatusBadge';

export const EvidenceFusionPage: React.FC = () => {
  const {
    fusionData,
    evidenceScenario,
    setScenario,
    selectedComponent,
    setActiveTab
  } = useApp();

  const scenarios: { id: EvidenceScenario; label: string; desc: string }[] = [
    {
      id: 'MULTI_SOURCE',
      label: 'MULTI-SOURCE HIGH RISK',
      desc: 'Corroborating visual crack + telemetry anomaly + high exposure'
    },
    {
      id: 'VISUAL_ONLY',
      label: 'VISUAL DEFECT ONLY',
      desc: 'Crack detected by camera, but vibration & telemetry normal'
    },
    {
      id: 'SENSOR_ONLY',
      label: 'SENSOR ANOMALY ONLY',
      desc: 'Severe vibration spike without visible external blade crack'
    },
    {
      id: 'NORMAL',
      label: 'NORMAL BASELINE',
      desc: 'Nominal surface and calibrated operational telemetry'
    }
  ];

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Multi-Modal Diagnostic Synthesis
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Evidence Fusion Engine — Hero Architecture
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time correlation of Borescope Computer Vision + On-Wing Telemetry + Historical Fatigue Exposure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-cyan-950/60 border border-cyan-800 text-cyan-300 px-2.5 py-1 rounded font-bold">
            ON-DEVICE FUSION-V1.0
          </span>
          <StatusBadge level={fusionData.overallRisk} label={`RISK: ${fusionData.overallRisk}`} />
        </div>
      </div>

      {/* Scenario Selector: Conflicting Evidence Simulator (Section 21) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Scale size={14} className="text-cyan-400" />
            <span className="uppercase text-[11px] tracking-wider">
              EVIDENCE CORRELATION SCENARIO SELECTOR (DEMO ENGINE)
            </span>
          </div>
          <span className="text-[10px] text-cyan-400">
            Simulate conflicting vs corroborating sensor/vision states
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          {scenarios.map((sc) => {
            const isSelected = evidenceScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md shadow-cyan-950'
                    : 'bg-[#080C14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`font-bold text-xs ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                  {sc.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  {sc.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Flow Architecture (Section 19) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono">
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span>EVIDENCE CORRELATION FLOW</span>
          <span className="text-[10px] text-slate-400">LATENCY: 42 ms (ON-DEVICE SYNTHESIS)</span>
        </div>

        {/* 3 Evidence Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Visual Evidence */}
          <div className="bg-[#080C14] border border-[#1E293B] p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Eye size={14} />
                <span>VISUAL EVIDENCE</span>
              </span>
              <StatusBadge level={fusionData.visualEvidence.level} size="sm" />
            </div>

            <div className="text-xs font-bold text-white pt-1">
              {fusionData.visualEvidence.summary}
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {fusionData.visualEvidence.findings.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-cyan-400">›</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Sensor Evidence */}
          <div className="bg-[#080C14] border border-[#1E293B] p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Activity size={14} />
                <span>SENSOR EVIDENCE</span>
              </span>
              <StatusBadge level={fusionData.sensorEvidence.level} size="sm" />
            </div>

            <div className="text-xs font-bold text-white pt-1">
              {fusionData.sensorEvidence.summary}
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {fusionData.sensorEvidence.findings.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-cyan-400">›</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Historical Context */}
          <div className="bg-[#080C14] border border-[#1E293B] p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <History size={14} />
                <span>HISTORICAL CONTEXT</span>
              </span>
              <StatusBadge level={fusionData.historicalContext.level} size="sm" />
            </div>

            <div className="text-xs font-bold text-white pt-1">
              {fusionData.historicalContext.summary}
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {fusionData.historicalContext.findings.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-cyan-400">›</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Downward Fusion Arrow */}
        <div className="flex justify-center -my-2 text-cyan-400">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
              WEIGHTED CROSS-CHANNEL CORRELATION
            </span>
            <ArrowDown size={18} className="animate-bounce" />
          </div>
        </div>

        {/* Overall Component Risk Synthesis Banner */}
        <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-4 ${
          fusionData.overallRisk === 'HIGH'
            ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
            : fusionData.overallRisk === 'MEDIUM'
            ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
            : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 border border-current text-lg font-bold">
              !
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                OVERALL COMPONENT RISK
              </div>
              <div className="text-xl font-bold tracking-tight text-white">
                {fusionData.overallRisk} RISK · HEALTH SCORE {fusionData.healthScore}/100
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <div className="text-[10px] opacity-80 uppercase">FUSION CONFIDENCE</div>
              <div className="text-base font-bold text-white">
                {(fusionData.fusionConfidence * 100).toFixed(0)}%
              </div>
            </div>
            <div className="border-l border-current/30 pl-4">
              <div className="text-[9px] uppercase font-bold text-amber-300">LEGAL NOTICE</div>
              <div className="text-[10px] opacity-90">DECISION SUPPORT — NOT CERTIFIED AUTHORIZATION</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Deep Dive: Explainability & POC Weights Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Explainability (Section 20) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3.5 font-mono">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase text-xs tracking-wider">
              WHY IS THE COMPONENT RISK {fusionData.overallRisk}?
            </span>
            <span className="text-[10px] text-cyan-400">EXPLAINABLE REASONING MATRIX</span>
          </div>

          <div className="space-y-2">
            {fusionData.explanationPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-[#080C14] border border-[#1E293B] flex items-start gap-2.5 text-xs text-slate-200"
              >
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-slate-400">Multi-Channel Corroboration Index:</span>
            <span className="text-cyan-400 font-bold">
              {fusionData.overallRisk === 'HIGH' ? 'STRONG AGREEMENT (3/3 CHANNELS)' : 'PARTIAL CORRELATION'}
            </span>
          </div>
        </div>

        {/* Right Side: Health Score & RUL Operating Window (Sections 22 & 23) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              HEALTH SCORE BREAKDOWN
            </span>
            <span className="text-[10px] text-amber-400">POC DEMONSTRATION MODEL</span>
          </div>

          <div className="flex items-center gap-4">
            <HealthGauge score={fusionData.healthScore} size={110} showSubtitle={false} />
            <div className="flex-1 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Visual Condition (25%):</span>
                  <span className="text-white font-bold">{fusionData.pocWeights.visual}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${fusionData.pocWeights.visual * 2}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Sensor Condition (30%):</span>
                  <span className="text-white font-bold">{fusionData.pocWeights.sensor}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400" style={{ width: `${fusionData.pocWeights.sensor * 2}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Historical Exposure (20%):</span>
                  <span className="text-white font-bold">{fusionData.pocWeights.historical}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${fusionData.pocWeights.historical * 2}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Recent Inspection (25%):</span>
                  <span className="text-white font-bold">{fusionData.pocWeights.recentInspection}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${fusionData.pocWeights.recentInspection * 2}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* RUL Operating Window Card (Section 23) */}
          <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" />
                ESTIMATED OPERATING WINDOW (RUL)
              </span>
              <StatusBadge level={fusionData.rulWindow.risk} size="sm" />
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">
                {fusionData.rulWindow.minHours}–{fusionData.rulWindow.maxHours} hours
              </span>
              <span className="text-slate-400 text-[11px]">
                Confidence: <strong className="text-cyan-400">{(fusionData.rulWindow.confidence * 100).toFixed(0)}%</strong>
              </span>
            </div>

            <div className="text-[10px] text-amber-400/90 leading-relaxed border-t border-slate-800 pt-1.5">
              ⚠ <strong>POC MODEL OUTPUT:</strong> Not a certified aerospace RUL measurement. Prediction depends on available validation data.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setActiveTab('digital-twin')}
              className="py-2 px-3 bg-[#080C14] hover:bg-slate-900 border border-[#1E293B] text-slate-200 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Digital Twin</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Review Action</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
