import React, { useState } from 'react';
import { Play, Check, ChevronUp, ChevronDown, X, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoFloatingPanel: React.FC = () => {
  const { isDemoRunning, currentDemoStepIndex, demoSteps, stopCompleteDemo } = useApp();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  if (!isDemoRunning) return null;

  const currentStep = demoSteps[currentDemoStepIndex] || demoSteps[0];

  return (
    <aside
      aria-label="Automated demo walkthrough status"
      className="fixed bottom-6 right-6 z-50 w-80 bg-[#0B0F19]/95 border border-cyan-500/50 rounded-lg shadow-2xl backdrop-blur select-none font-mono text-xs overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-cyan-950/80 border-b border-cyan-800/60 p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-cyan-200 tracking-wider text-[11px]">
            AEROTWIN DEMO RUNNING
          </span>
          <span className="text-[10px] text-cyan-400/80 bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-700">
            {currentDemoStepIndex + 1}/{demoSteps.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand demo progress panel" : "Collapse demo progress panel"}
            className="p-1 text-slate-400 hover:text-white"
          >
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={stopCompleteDemo}
            aria-label="Stop automated demo walkthrough"
            className="p-1 text-slate-400 hover:text-rose-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2.5 max-h-80 overflow-y-auto">
          {/* Active step readout */}
          <div className="bg-[#0F172A] border border-cyan-500/30 rounded p-2 text-cyan-300">
            <div className="text-[10px] uppercase text-cyan-400/80 font-bold flex items-center gap-1.5">
              <Radio size={11} className="animate-spin text-cyan-400" />
              CURRENT WALKTHROUGH STEP
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {currentStep.label}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {currentStep.description}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1 pt-1">
            {demoSteps.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition-colors ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/40 font-bold'
                      : isDone
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isDone ? <Check size={10} /> : idx + 1}
                    </span>
                    <span className="truncate">{step.label}</span>
                  </div>

                  <span className="text-[9px] uppercase tracking-wider">
                    {isDone ? '✓' : isActive ? '● LIVE' : '○'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={stopCompleteDemo}
            className="w-full py-1 text-center text-xs text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 rounded font-semibold transition-colors"
          >
            Halt Demo Walkthrough
          </button>
        </div>
      )}
    </aside>
  );
};
