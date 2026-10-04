import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { TURBINE_IMAGE_URI } from '../data/mockData';

export const HistoryPage: React.FC = () => {
  const { auditLogs, setActiveTab } = useApp();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(auditLogs[0]?.id || null);

  const historyItems = auditLogs.map((log) => ({
    id: log.inspectionId || log.id,
    auditId: log.id,
    date: log.timestamp,
    component: log.componentId,
    componentName: log.componentId === 'TB-007' ? 'Turbine Blade #07' : log.componentId === 'TB-006' ? 'Turbine Blade #06' : log.componentId === 'FAN-01' ? 'Fan Blade Set A' : log.componentId === 'HPC-02' ? 'Bleed Valve Actuator' : log.componentId,
    finding: log.finding,
    health: log.risk === 'HIGH' ? 68 : log.risk === 'MEDIUM' ? 82 : 94,
    risk: log.risk,
    decision: log.decision,
    technician: log.technician,
    model: log.modelVersion,
    stage: log.componentId.startsWith('TB') ? 'HPT Stage 1' : log.componentId.startsWith('FAN') ? 'Fan Stage' : 'High Pressure Compressor'
  }));

  const activeId = selectedRecordId || historyItems[0]?.id;
  const selectedItem = historyItems.find((h) => h.id === activeId || h.auditId === activeId) || historyItems[0] || {
    id: 'INSP-00482',
    auditId: 'AUD-0925-001',
    date: 'Today 14:32',
    component: 'TB-007',
    componentName: 'Turbine Blade #07',
    finding: '4.2 mm Crack Detected',
    health: 68,
    risk: 'HIGH' as const,
    decision: 'Pending',
    technician: 'TECH-024 (Alex Morgan)',
    model: 'AeroTwin-YOLO-v1.2',
    stage: 'HPT Stage 1'
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Historical Work Records
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Inspection History — Airbus A320-001
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            On-wing borescope and non-destructive inspection audit records stored in edge cache
          </p>
        </div>

        <button
          onClick={() => setActiveTab('audit')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-cyan-400 font-mono text-xs rounded transition-colors"
        >
          <FileText size={14} />
          <span>VIEW COMPREHENSIVE AUDIT TRAIL</span>
        </button>
      </div>

      {/* Main Grid: Table on left, Detail Drawer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inspection Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden font-mono text-xs">
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              COMPLETED INSPECTIONS & FINDINGS
            </span>
            <span className="text-[10px] text-slate-400">
              CLICK ROW FOR HISTORICAL DOSSIER
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#080C14] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1E293B]">
                  <th className="py-2.5 px-4">Inspection Date</th>
                  <th className="py-2.5 px-3">Part ID</th>
                  <th className="py-2.5 px-3">AI Finding</th>
                  <th className="py-2.5 px-3 text-center">Health</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {historyItems.map((item) => {
                  const isSelected = selectedRecordId === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRecordId(item.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-950/40 text-white font-semibold' : 'hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold flex items-center gap-2">
                        <Clock size={12} className="text-cyan-400 shrink-0" />
                        <span>{item.date}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-cyan-300 font-bold">{item.component}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        {item.finding}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={item.health < 75 ? 'text-rose-400' : 'text-emerald-400'}>
                          {item.health}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge level={item.risk} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[11px] text-slate-400 font-bold">{item.decision}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Record Detail Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
              <span className="font-bold text-white uppercase text-xs tracking-wider">
                INSPECTION DOSSIER
              </span>
              <span className="text-cyan-400 text-[10px] font-bold">{selectedItem.id}</span>
            </div>

            <div className="relative rounded overflow-hidden border border-[#1E293B] aspect-16/10 bg-black">
              <img
                src={TURBINE_IMAGE_URI}
                alt="Inspection Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-cyan-300">
                {selectedItem.component} · {selectedItem.date}
              </div>
            </div>

            <div className="space-y-2 bg-[#080C14] border border-[#1E293B] p-3 rounded-lg">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Component:</span>
                <span className="text-white font-bold">{selectedItem.componentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Subsystem:</span>
                <span className="text-slate-200">{selectedItem.stage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Technician:</span>
                <span className="text-slate-200">{selectedItem.technician}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">AI Model Version:</span>
                <span className="text-cyan-400 font-bold">{selectedItem.model}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Signoff Decision:</span>
                <span className="text-emerald-400 font-bold">{selectedItem.decision}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('inspection')}
            className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>RE-INSPECT THIS COMPONENT</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
