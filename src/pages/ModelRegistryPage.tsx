import React from 'react';
import {
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ModelRegistryPage: React.FC = () => {
  const models = [
    {
      id: 'AeroTwin-YOLO-v1.2',
      name: 'AeroTwin-YOLO-v1.2',
      category: 'Computer Vision / Surface Defect Object Detection',
      status: 'DEPLOYED ON EDGE (NPU)',
      weightsSize: '48.2 MB (FP16 Quantized)',
      architecture: 'Custom DarkNet / YOLOv8 Backbone with Aerospace TBC Pretraining',
      metrics: {
        precision: '93%',
        recall: '89%',
        f1: '91%',
        map50: '91%',
        latency: '143 ms'
      },
      trainingSet: 'Airbus / CFM56 Borescope Inspection Dataset (4,820 labeled aerofoil defects)',
      validationStatus: 'FAA / EASA AI Assessment Framework Level 2 Compliant (Mock Validation)'
    },
    {
      id: 'AeroTwin-Anomaly-v1.0',
      name: 'AeroTwin-Anomaly-v1.0',
      category: 'Time-Series Sensor Anomaly & Harmonic Drift Detection',
      status: 'DEPLOYED ON EDGE (CPU)',
      weightsSize: '12.4 MB (ONNX Runtime)',
      architecture: 'Autoencoder + Transformer Temporal Convolutional Network (TCN)',
      metrics: {
        precision: '91%',
        recall: '94%',
        f1: '92%',
        map50: 'N/A',
        latency: '18 ms'
      },
      trainingSet: '14,000 flight hours accelerometer & EGT telemetry streams',
      validationStatus: 'Mock Validation Set / Baseline Calibration Active'
    },
    {
      id: 'Fusion-v1.0',
      name: 'Fusion-v1.0',
      category: 'Multi-Modal Evidence Fusion & Degradation Risk Engine',
      status: 'DEPLOYED ON EDGE',
      weightsSize: '6.1 MB (Deterministic Bayesian Network)',
      architecture: 'Probabilistic Graphical Model + Corroboration Fusion Matrix',
      metrics: {
        precision: '95%',
        recall: '92%',
        f1: '93%',
        map50: 'N/A',
        latency: '42 ms'
      },
      trainingSet: 'MRO fleet teardown and NDI inspection correlation archives',
      validationStatus: 'Decision Support Level 1 (Human-In-The-Loop Signoff Required)'
    }
  ];

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            On-Device Neural Engine Inventory
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            AI Model Registry — AT-EDGE-07
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Locally hosted quantized neural models running offline on device neural accelerator
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded text-amber-300">
          <AlertCircle size={14} className="text-amber-400" />
          <span>DEMO / VALIDATION DATA</span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="space-y-4 font-mono text-xs">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <Cpu size={16} className="text-cyan-400" />
                  <span className="text-base font-bold text-white tracking-wide">
                    {model.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {model.category}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {model.status}
                </span>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Precision</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{model.metrics.precision}</div>
              </div>

              <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Recall</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{model.metrics.recall}</div>
              </div>

              <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">F1-Score</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{model.metrics.f1}</div>
              </div>

              <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">mAP@50</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{model.metrics.map50}</div>
              </div>

              <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Inference Latency</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{model.metrics.latency}</div>
              </div>
            </div>

            {/* Specs & Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] bg-[#080C14] p-3 rounded-lg border border-[#1E293B]">
              <div>
                <span className="text-slate-400">Architecture: </span>
                <span className="text-slate-200">{model.architecture}</span>
              </div>
              <div>
                <span className="text-slate-400">Footprint: </span>
                <span className="text-slate-200">{model.weightsSize}</span>
              </div>
              <div>
                <span className="text-slate-400">Dataset: </span>
                <span className="text-slate-200">{model.trainingSet}</span>
              </div>
              <div>
                <span className="text-slate-400">Verification: </span>
                <span className="text-cyan-300 font-semibold">{model.validationStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 bg-[#0F172A] border border-amber-600/40 rounded-xl text-xs font-mono text-amber-300 space-y-1">
        <div className="font-bold flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-400" />
          <span>IMPORTANT REGULATORY NOTICE — POC DEMONSTRATION METRICS</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Metrics shown above represent laboratory validation trials on mock CFM56 inspection datasets. They do not constitute official FAA or EASA airworthiness certification benchmarks.
        </p>
      </div>
    </div>
  );
};
