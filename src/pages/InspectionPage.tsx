import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Crosshair,
  Sparkles,
  Sliders,
  Maximize2,
  ShieldCheck,
  ArrowRight,
  Info,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { TURBINE_IMAGE_URI } from '../data/mockData';

export const InspectionPage: React.FC = () => {
  const {
    selectedAircraft,
    selectedComponent,
    inspectionData,
    isInspecting,
    inspectionStepText,
    runInspection,
    setActiveTab,
    isOffline
  } = useApp();

  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeSample, setActiveSample] = useState<'crack' | 'nominal' | 'custom'>('crack');
  const [stagedImageUri, setStagedImageUri] = useState<string>(inspectionData.imageUri || TURBINE_IMAGE_URI);
  const [stagedBase64, setStagedBase64] = useState<string | undefined>(undefined);
  const [isCustomImage, setIsCustomImage] = useState<boolean>(false);
  const [isInspected, setIsInspected] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async () => {
    await runInspection(
      stagedImageUri,
      isCustomImage ? false : (activeSample === 'nominal'),
      stagedBase64
    );
    setIsInspected(true);
  };

  const handleSampleSwitch = async (sample: 'crack' | 'nominal') => {
    setActiveSample(sample);
    setIsCustomImage(false);
    setStagedBase64(undefined);
    setStagedImageUri(TURBINE_IMAGE_URI);
    setIsInspected(true);
    await runInspection(TURBINE_IMAGE_URI, sample === 'nominal');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setStagedImageUri(url);
        setStagedBase64(base64);
        setIsCustomImage(true);
        setActiveSample('custom');
        setIsInspected(false); // Staged: clear previous inspection result until user runs inspection
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input to allow re-uploading same file
    }
  };

  const defect = isInspected ? inspectionData.defect : null;

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Hidden file input for custom uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            High-Resolution Edge Vision Diagnostics
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            AI Component Inspection — {selectedComponent.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Component ID: <strong className="text-cyan-400">{selectedComponent.code}</strong> · Model Engine: <strong className="text-cyan-400">{inspectionData.modelVersion}</strong> · Target: High Pressure Turbine (HPT Stage 1)
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/60 border border-cyan-800/60 rounded text-cyan-300">
            <Cpu size={13} className="text-cyan-400" />
            <span>NPU / GEMINI VISION READY</span>
          </span>
          {isInspected ? (
            <StatusBadge level={defect?.severity || 'LOW'} label={defect ? 'CRACK DETECTED' : 'NOMINAL'} />
          ) : (
            <span className="px-2.5 py-1 bg-amber-950/70 border border-amber-600/70 rounded text-amber-300 font-bold">
              READY FOR ANALYSIS
            </span>
          )}
        </div>
      </div>

      {/* Inspection Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Camera Feed & Defect Viewport (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-cyan-400" />
              <span className="font-bold text-slate-200 uppercase">
                {isCustomImage ? 'CUSTOM BORESCOPE OPTICAL UPLOAD' : 'TURBINE BLADE CAMERA FEED (BORESCOPE MACRO CH-01)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#080C14] border border-[#1E293B] p-0.5 rounded text-[11px]">
                <button
                  onClick={() => handleSampleSwitch('crack')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeSample === 'crack' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Defect Sample
                </button>
                <button
                  onClick={() => handleSampleSwitch('nominal')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeSample === 'nominal' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Nominal Sample
                </button>
                {isCustomImage && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                    Custom Image
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors ${
                  showOverlay
                    ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {showOverlay ? 'Hide Reticle' : 'Show Reticle'}
              </button>
            </div>
          </div>

          {/* Interactive Borescope Viewport */}
          <div className="relative rounded-lg overflow-hidden border border-[#1E293B] bg-[#05070B] aspect-4/3 flex items-center justify-center">
            {/* Staged Blade Image */}
            <img
              src={stagedImageUri}
              alt="Turbine Blade Borescope Feed"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Viewport Crosshair & Grid HUD Overlay */}
            {showOverlay && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Rule of thirds hairline grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                  <div className="border-r border-b border-cyan-400" />
                  <div className="border-r border-b border-cyan-400" />
                  <div className="border-b border-cyan-400" />
                  <div className="border-r border-b border-cyan-400" />
                  <div className="border-r border-b border-cyan-400" />
                  <div className="border-b border-cyan-400" />
                  <div className="border-r border-cyan-400" />
                  <div className="border-r border-cyan-400" />
                  <div />
                </div>

                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80" />

                {/* Telemetry Overlays */}
                <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-cyan-300">
                  {isCustomImage ? 'CUSTOM CAPTURE · RAW RGB' : 'OPTICAL ZOOM: 1.0× · RES: 3840×2880 RAW'}
                </div>
                <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                  {isInspected ? 'INSPECTION COMPLETE' : 'STAGED FOR AI ANALYSIS'}
                </div>
              </div>
            )}

            {/* AI Bounding Box & Annotation Overlay (Shown ONLY when inspected) */}
            {showOverlay && isInspected && defect && !isInspecting && (
              <div
                className="absolute border-2 border-rose-500 bg-rose-500/15 rounded transition-all duration-500"
                style={{
                  left: `${defect.bbox.x}%`,
                  top: `${defect.bbox.y}%`,
                  width: `${defect.bbox.width}%`,
                  height: `${defect.bbox.height}%`
                }}
              >
                {/* Crosshairs on defect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-t border-b border-l border-r border-rose-400/60 rounded-full" />

                {/* Badge Tag */}
                <div className="absolute -top-7 left-0 bg-rose-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5">
                  <AlertTriangle size={11} />
                  <span>{defect.type.toUpperCase()} ({(defect.confidence * 100).toFixed(0)}%) · {defect.sizeMm} mm</span>
                </div>

                {/* Reticle dimension marker */}
                <div className="absolute -bottom-5 right-0 text-[9px] font-mono bg-slate-950/90 text-rose-300 border border-rose-800/80 px-1.5 rounded">
                  ΔL: {defect.sizeMm} mm · {defect.severity}
                </div>
              </div>
            )}

            {/* Simulated Edge Inference Loading HUD */}
            {isInspecting && (
              <div className="absolute inset-0 bg-[#090D16]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin flex items-center justify-center" />
                  <Cpu size={24} className="text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="space-y-1 font-mono">
                  <div className="text-sm font-bold text-white tracking-wider uppercase">
                    ANALYZING WITH EDGE AI...
                  </div>
                  <div className="text-xs text-cyan-400 font-semibold h-5">
                    {inspectionStepText || 'Evaluating neural activations...'}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Running multimodal inspection pipeline
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar Below Viewport */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCapture}
                disabled={isInspecting}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded transition-colors shadow-lg shadow-cyan-950 disabled:opacity-50"
              >
                <Camera size={14} />
                <span>{isInspecting ? 'ANALYZING...' : isCustomImage ? 'RUN AI INSPECTION' : 'CAPTURE & ANALYZE'}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isInspecting}
                className="flex items-center gap-2 px-3 py-2 bg-[#080C14] hover:bg-slate-900 border border-[#1E293B] text-slate-300 font-mono text-xs rounded transition-colors"
              >
                <Upload size={14} />
                <span>UPLOAD IMAGE</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Zoom:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                -
              </button>
              <span className="text-slate-200">{zoomLevel.toFixed(1)}×</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: AI Inspection Result & Explainability Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Result Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 font-mono text-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                EDGE AI INFERENCE RESULT
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.5 rounded font-bold">
                {isInspected ? inspectionData.modelVersion : 'AWAITING INSPECTION'}
              </span>
            </div>

            {!isInspected ? (
              <div className="p-4 bg-cyan-950/30 border border-cyan-800/60 rounded-lg text-cyan-300 space-y-2.5 text-center">
                <Upload size={24} className="text-cyan-400 mx-auto" />
                <div className="font-bold text-sm text-white">NEW IMAGE STAGED</div>
                <p className="text-[11px] text-slate-300">
                  Image loaded into the inspection viewport. Click below to trigger AI defect analysis.
                </p>
                <button
                  onClick={handleCapture}
                  disabled={isInspecting}
                  className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play size={13} />
                  <span>RUN AI INSPECTION NOW</span>
                </button>
              </div>
            ) : defect ? (
              <div className="space-y-3">
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 space-y-1">
                  <div className="text-base font-bold flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-400" />
                    <span>DEFECT DETECTED</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Defect localized to high aerodynamic stress zone.
                  </div>
                </div>

                <div className="space-y-2 bg-[#080C14] border border-[#1E293B] p-3 rounded-lg">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Defect Type:</span>
                    <span className="text-rose-300 font-bold">{defect.type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Model Confidence:</span>
                    <span className="text-white font-bold">{(defect.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Defect Severity:</span>
                    <span className="text-rose-400 font-bold">{defect.severity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Defect Location:</span>
                    <span className="text-slate-200">{defect.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Size:</span>
                    <span className="text-amber-400 font-bold">{defect.sizeMm} mm</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Inference Latency:</span>
                    <span className="text-cyan-400 font-bold">{inspectionData.inferenceTimeMs} ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-lg text-emerald-300 space-y-2 text-center">
                <CheckCircle2 size={24} className="text-emerald-400 mx-auto" />
                <div className="font-bold text-sm">NO DEFECTS DETECTED</div>
                <p className="text-[11px] text-slate-300">
                  Component surface thermal barrier coating verified uniform. No fissure anomalies.
                </p>
              </div>
            )}
          </div>

          {/* AI Explainability Panel */}
          {isInspected && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 font-mono text-xs space-y-3">
              <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                  {inspectionData.explainability.title}
                </span>
                <Sparkles size={13} className="text-cyan-400" />
              </div>

              <div className="space-y-2 text-slate-300">
                {inspectionData.explainability.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px]">AI CONFIDENCE</span>
                  <div className="text-base font-bold text-cyan-400">
                    {defect ? `${(defect.confidence * 100).toFixed(0)}%` : '98%'}
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-slate-400 text-[10px]">EDGE MODEL</span>
                  <div className="text-xs font-bold text-slate-200">
                    {inspectionData.modelVersion}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('evidence-fusion')}
                className="w-full mt-2 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>PROCEED TO EVIDENCE FUSION</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
