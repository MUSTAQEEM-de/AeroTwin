import React from 'react';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  Cloud,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Server,
  Database,
  Layers,
  FileText,
  Activity,
  Boxes,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const SyncCenterPage: React.FC = () => {
  const {
    isOffline,
    toggleOffline,
    syncQueue,
    isSyncing,
    syncProgress,
    syncPhase,
    runSync,
    setActiveTab
  } = useApp();

  const totalPayloadKb = syncQueue.reduce((acc, curr) => acc + curr.payloadSizeKb, 0);

  // Group queued items by category
  const inspectionItems = syncQueue.filter((q) => q.type === 'INSPECTION');
  const sensorItems = syncQueue.filter((q) => q.type === 'SENSOR_BURST');
  const twinItems = syncQueue.filter((q) => q.type === 'TWIN_STATE');
  const auditItems = syncQueue.filter((q) => q.type === 'AUDIT_RECORD');

  const architectureSteps = [
    { title: 'LOCAL DATA', subtitle: 'Edge SQLite / Cache', icon: HardDrive },
    { title: 'SYNC QUEUE', subtitle: 'Delta Outbox', icon: Layers },
    { title: 'INTEGRITY VALIDATION', subtitle: 'SHA-256 Hashes', icon: ShieldCheck },
    { title: 'ENCRYPTED TRANSMISSION', subtitle: 'mTLS v1.3 Cipher', icon: Lock },
    { title: 'CENTRAL SERVER', subtitle: 'Airline MRO Cloud', icon: Server },
    { title: 'MRO DASHBOARD', subtitle: 'Fleet Reliability DB', icon: Database }
  ];

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Offline-First Data Pipeline
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Edge Synchronization Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographic reconciliation between local edge device <strong className="text-cyan-400">AT-EDGE-07</strong> and central airline MRO operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleOffline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs font-bold transition-colors ${
              isOffline
                ? 'bg-amber-950/70 border border-amber-600/60 text-amber-300'
                : 'bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white'
            }`}
          >
            {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>{isOffline ? 'SIMULATING OFFLINE' : 'DISCONNECT (GO OFFLINE)'}</span>
          </button>

          <button
            onClick={runSync}
            disabled={isSyncing || syncQueue.length === 0}
            className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded transition-colors shadow-lg shadow-cyan-950 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'SYNCHRONIZING...' : 'RESTORE CONNECTION & SYNC'}</span>
          </button>
        </div>
      </div>

      {/* Sync Architecture Flow Visualization (Section 33) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="font-bold text-white uppercase tracking-wider text-xs">
            DATA FLOW & SECURITY TOPOLOGY (AT-EDGE-07 → CLOUD MRO)
          </span>
          <span className="text-cyan-400 text-[10px]">
            EASA PART-M SECTION 7 COMPLIANT
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {architectureSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                <div className="bg-[#080C14] border border-[#1E293B] p-3 rounded-lg text-center space-y-1.5 hover:border-cyan-700/60 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto">
                    <Icon size={14} />
                  </div>
                  <div className="font-bold text-[11px] text-white tracking-wide">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {step.subtitle}
                  </div>
                </div>

                {/* Arrow between steps */}
                {idx < architectureSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 text-cyan-500/80 pointer-events-none">
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connectivity & Queue Summary Cards (Sections 31 & 32) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {/* Connection State */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">CONNECTION STATUS</div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOffline ? 'bg-amber-400 ring-4 ring-amber-400/20' : 'bg-emerald-400 ring-4 ring-emerald-400/20'
              }`}
            />
            <span className={`text-base font-bold ${isOffline ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isOffline ? 'OFFLINE (ISOLATED)' : 'CONNECTED (TLS 1.3)'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Link: Airline Base Hangar WLAN-AP4
          </div>
        </div>

        {/* Last Sync */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">LAST CLOUD SYNC</div>
          <div className="text-base font-bold text-white">
            {isOffline ? '14:28 UTC (4m ago)' : 'JUST NOW'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Hash: 0x8b32..4ef9 Verified
          </div>
        </div>

        {/* Pending Queue Count */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">PENDING DELTA RECORDS</div>
          <div className="text-base font-bold text-amber-300">
            {syncQueue.length} RECORDS
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Payload: {(totalPayloadKb / 1024).toFixed(2)} MB in local storage
          </div>
        </div>

        {/* Sync Progress or State */}
        <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase">RECONCILIATION ENGINE</div>
          <div className="text-base font-bold text-cyan-400">
            {isSyncing ? `${syncProgress}% PROCESSED` : syncQueue.length === 0 ? 'ALL DATA SYNCHRONIZED' : 'QUEUED LOCALLY'}
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Differential chunk syncing enabled
          </div>
        </div>
      </div>

      {/* Multi-Phase Progress Bar during Sync (Section 32) */}
      {isSyncing && (
        <div className="bg-[#0F172A] border border-cyan-500/40 rounded-xl p-5 space-y-3 font-mono text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-cyan-400" />
              <span>SYNCHRONIZING EDGE QUEUE TO CENTRAL MRO REPOSITORY...</span>
            </span>
            <span className="text-base font-bold text-white tabular-nums">{syncProgress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${syncProgress}%` }}
            />
          </div>

          <div className="text-[11px] text-cyan-300/90 font-semibold">
            {syncPhase || 'Processing delta records...'}
          </div>
        </div>
      )}

      {/* Queue Breakdown & Table (Section 31) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-bold text-white uppercase tracking-wider text-xs">
            PENDING SYNCHRONIZATION QUEUE ({syncQueue.length} ITEMS)
          </span>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Inspection Data: <strong className="text-white">{inspectionItems.length}</strong></span>
            <span>·</span>
            <span>Sensor Data: <strong className="text-white">{sensorItems.length}</strong></span>
            <span>·</span>
            <span>Digital Twin: <strong className="text-white">{twinItems.length}</strong></span>
            <span>·</span>
            <span>Audit Logs: <strong className="text-white">{auditItems.length}</strong></span>
          </div>
        </div>

        {syncQueue.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">ALL DATA SYNCHRONIZED</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All borescope inspection images, sensor burst buffers, and technician decisions have been securely written to the central MRO enterprise database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#080C14] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1E293B]">
                  <th className="py-3 px-4">Queue ID</th>
                  <th className="py-3 px-3">Data Category</th>
                  <th className="py-3 px-3">Entity Key</th>
                  <th className="py-3 px-4">Record Summary</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-4 text-right">Queue State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {syncQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 text-cyan-400 font-bold whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        {item.type === 'INSPECTION' && <Camera size={13} className="text-cyan-400" />}
                        {item.type === 'SENSOR_BURST' && <Activity size={13} className="text-rose-400" />}
                        {item.type === 'TWIN_STATE' && <Boxes size={13} className="text-amber-400" />}
                        {item.type === 'AUDIT_RECORD' && <FileText size={13} className="text-emerald-400" />}
                        <span className="font-semibold">{item.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white font-bold whitespace-nowrap">
                      {item.entityId}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {item.summary}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {item.payloadSizeKb} KB
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded border border-amber-800 text-amber-300 bg-amber-950/60 text-[10px] font-bold">
                        PENDING SYNC
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
