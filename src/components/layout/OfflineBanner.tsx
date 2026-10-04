import React from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, syncQueue, runSync, isSyncing, setActiveTab } = useApp();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-950/80 border-b border-amber-600/50 px-4 py-2 flex items-center justify-between text-xs font-mono text-amber-200 select-none">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-500/20 text-amber-400">
          <WifiOff size={13} />
        </span>
        <span className="font-bold text-amber-100">OFFLINE MODE:</span>
        <span className="text-amber-200/90 hidden sm:inline">
          Core AI vision inference, sensor analytics, and maintenance decisions remain operational locally at edge device.
        </span>
        <span className="bg-amber-900/60 border border-amber-700/60 px-2 py-0.5 rounded text-[11px] font-bold text-amber-300">
          {syncQueue.length} PENDING RECORDS
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('sync')}
          className="text-[11px] underline hover:text-white px-2 py-1 text-amber-300"
        >
          View Local Queue
        </button>
        <button
          onClick={runSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors"
        >
          <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'SYNCHRONIZING...' : 'RESTORE CONNECTION'}</span>
        </button>
      </div>
    </div>
  );
};
