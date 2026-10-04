import React, { useState } from 'react';
import {
  Plane,
  ChevronRight,
  ChevronDown,
  Layers,
  CircleDot,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComponentSummary } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { HealthGauge } from '../components/common/HealthGauge';

export const AircraftPage: React.FC = () => {
  const {
    selectedAircraft,
    selectedComponent,
    setSelectedComponent,
    setActiveTab
  } = useApp();

  const [expandedEngines, setExpandedEngines] = useState<Record<string, boolean>>({
    'ENG-01': true,
    'ENG-02': false
  });
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'ENG-01-High Pressure Turbine (HPT)': true,
    'ENG-01-Fan Stage': false,
    'ENG-01-High Pressure Compressor': false
  });

  const toggleEngine = (id: string) => {
    setExpandedEngines((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStage = (key: string) => {
    setExpandedStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectComponent = (comp: ComponentSummary) => {
    setSelectedComponent(comp);
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Fleet Asset Hierarchy
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Aircraft Subsystem Structure — {selectedAircraft.id}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Model: {selectedAircraft.model} · Serial: {selectedAircraft.tailNumber} · Flight Hours: {selectedAircraft.flightHours.toLocaleString()} hrs · Cycles: {selectedAircraft.flightCycles.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <StatusBadge level="HIGH" label="AIRFRAME ATTENTION REQUIRED" />
        </div>
      </div>

      {/* Grid: Hierarchy Tree on left, Component Spotlight on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Tree View */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              POWERTRAIN & COMPONENT EXPLORER
            </span>
            <span className="text-[10px] text-slate-400">
              Click component to inspect
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {/* Root Aircraft Node */}
            <div className="p-2.5 bg-[#080C14] border border-cyan-800/40 rounded flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <Plane size={15} className="text-cyan-400" />
                <span>{selectedAircraft.id} (Airbus A320-200)</span>
              </div>
              <span className="text-[10px] text-slate-400">2 CFM56 Turbofans + Landing Gear</span>
            </div>

            {/* Engines */}
            <div className="pl-4 space-y-3 border-l-2 border-[#1E293B] ml-3 mt-2">
              {selectedAircraft.engines.map((engine) => {
                const isEngExpanded = expandedEngines[engine.id];
                return (
                  <div key={engine.id} className="space-y-1.5">
                    <button
                      onClick={() => toggleEngine(engine.id)}
                      className="w-full flex items-center justify-between p-2 rounded bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isEngExpanded ? <ChevronDown size={14} className="text-cyan-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                        <span className="font-bold text-slate-100">{engine.code}</span>
                        <span className="text-slate-400 text-[11px]">— {engine.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {engine.stages.length} Assemblies
                      </span>
                    </button>

                    {/* Stages under Engine */}
                    {isEngExpanded && (
                      <div className="pl-4 space-y-2 border-l border-slate-800 ml-3">
                        {engine.stages.map((stage) => {
                          const stageKey = `${engine.id}-${stage.name}`;
                          const isStageExpanded = expandedStages[stageKey];
                          return (
                            <div key={stage.name} className="space-y-1">
                              <button
                                onClick={() => toggleStage(stageKey)}
                                className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-900 text-left text-slate-300 transition-colors"
                              >
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                  {isStageExpanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
                                  <span>{stage.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {stage.components.length} components
                                </span>
                              </button>

                              {/* Components */}
                              {isStageExpanded && (
                                <div className="pl-4 space-y-1 border-l border-slate-850 ml-2">
                                  {stage.components.map((comp) => {
                                    const isSelected = selectedComponent.id === comp.id;
                                    return (
                                      <div
                                        key={comp.id}
                                        onClick={() => handleSelectComponent(comp)}
                                        className={`p-2 rounded border cursor-pointer flex items-center justify-between transition-colors ${
                                          isSelected
                                            ? 'bg-cyan-950/70 border-cyan-500/60 text-white font-bold'
                                            : 'bg-[#080C14]/60 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <CircleDot
                                            size={10}
                                            className={
                                              comp.risk === 'HIGH'
                                                ? 'text-rose-400'
                                                : comp.risk === 'MEDIUM'
                                                ? 'text-amber-400'
                                                : 'text-emerald-400'
                                            }
                                          />
                                          <span>{comp.name}</span>
                                          <span className="text-[10px] text-slate-400">({comp.code})</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <span className="text-[10px] font-mono tabular-nums text-slate-400">
                                            Health: <strong className={comp.health < 75 ? 'text-rose-400' : 'text-emerald-400'}>{comp.health}</strong>
                                          </span>
                                          <StatusBadge level={comp.risk} size="sm" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Landing Gear node */}
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium">
                  <Layers size={13} className="text-slate-400" />
                  <span>Landing Gear System (Nose & Main Gear)</span>
                </div>
                <StatusBadge level="LOW" size="sm" label="NORMAL" />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Component Spotlight Card */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="border-b border-[#1E293B] pb-3 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Selected Node Inspection
              </div>
              <h2 className="text-lg font-bold font-mono text-white mt-0.5">
                {selectedComponent.name}
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Component ID: <strong className="text-cyan-400">{selectedComponent.code}</strong>
              </div>
            </div>
            <StatusBadge level={selectedComponent.risk} status={selectedComponent.status} />
          </div>

          <div className="flex justify-center py-2">
            <HealthGauge score={selectedComponent.health} size={130} />
          </div>

          <div className="space-y-2 text-xs font-mono bg-[#080C14] border border-[#1E293B] p-3 rounded-lg">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Parent Engine:</span>
              <span className="text-white font-semibold">ENG-01 (CFM56 Turbofan)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Subsystem:</span>
              <span className="text-white font-semibold">High Pressure Turbine (Stage 1)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Operating Exposure:</span>
              <span className="text-white">{selectedComponent.cycles.toLocaleString()} cycles · {selectedComponent.hours.toLocaleString()} hrs</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Edge Inference Model:</span>
              <span className="text-cyan-400 font-bold">AeroTwin-YOLO-v1.2</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setActiveTab('components')}
              className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded flex items-center justify-center gap-2 transition-colors"
            >
              <span>OPEN COMPONENT DETAIL SPEC</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setActiveTab('inspection')}
              className="w-full py-2 px-3 bg-[#080C14] hover:bg-slate-900 border border-[#1E293B] text-cyan-400 font-bold font-mono text-xs rounded flex items-center justify-center gap-2 transition-colors"
            >
              <span>LAUNCH BORESCOPE CAMERA INSPECTION</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
