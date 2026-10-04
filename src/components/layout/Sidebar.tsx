import React from 'react';
import {
  LayoutDashboard,
  Plane,
  Layers,
  Camera,
  Activity,
  Cpu,
  Boxes,
  FileCheck2,
  History,
  FileText,
  RefreshCw,
  Settings,
  CpuIcon,
  BarChart3,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isOffline, syncQueue } = useApp();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'aircraft', label: 'Aircraft', icon: Plane },
    { id: 'components', label: 'Components', icon: Layers },
    { id: 'inspection', label: 'Inspection', icon: Camera, badge: 'AI Edge' },
    { id: 'sensors', label: 'Sensor Analytics', icon: Activity, live: true },
    { id: 'evidence-fusion', label: 'Evidence Fusion', icon: Cpu, hero: true },
    { id: 'digital-twin', label: 'Digital Twin', icon: Boxes },
    { id: 'recommendations', label: 'Recommendations', icon: FileCheck2 },
    { id: 'history', label: 'Inspection History', icon: History },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    {
      id: 'sync',
      label: 'Sync Center',
      icon: RefreshCw,
      badge: syncQueue.length > 0 ? `${syncQueue.length}` : undefined,
      badgeColor: isOffline ? 'text-amber-400 bg-amber-950/60 border-amber-800' : 'text-slate-400 bg-slate-800 border-slate-700'
    },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const secondaryNav = [
    { id: 'engineering', label: 'Engineering Dashboard', icon: BarChart3 },
    { id: 'model-registry', label: 'AI Model Registry', icon: CpuIcon }
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-[#1E293B] flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono shadow-sm shadow-cyan-950">
            AE
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-slate-100 font-mono">
              AEROTWIN EDGE
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Aerospace MRO Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Inspection & Diagnostics
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  size={15}
                  className={isActive ? 'text-cyan-400' : 'text-slate-400'}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    item.badgeColor || 'text-cyan-400 bg-cyan-950/60 border-cyan-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.live && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
              )}
            </button>
          );
        })}

        <div className="pt-4 px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Engineering & Registry
        </div>
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <Icon
                size={15}
                className={isActive ? 'text-cyan-400' : 'text-slate-400'}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Edge Device Status Card */}
      <div className="p-3 border-t border-[#1E293B] bg-[#080C14]">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded p-2.5 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <HardDrive size={12} className="text-cyan-400" />
              EDGE DEVICE
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">AT-EDGE-07</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <span className="flex items-center gap-1 text-[10px] font-bold">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOffline ? 'bg-amber-400 ring-2 ring-amber-400/20' : 'bg-emerald-400 ring-2 ring-emerald-400/20'
                }`}
              />
              <span className={isOffline ? 'text-amber-400' : 'text-emerald-400'}>
                {isOffline ? 'OFFLINE' : 'ONLINE'}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">AI Engine</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              READY
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
