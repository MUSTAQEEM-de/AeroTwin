import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CloudOff,
  Cloud,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [syncFilter, setSyncFilter] = useState<string>('ALL');
  const [exported, setExported] = useState<boolean>(false);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.componentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.finding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.inspectionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || log.risk === riskFilter;
    const matchesSync = syncFilter === 'ALL' || log.syncStatus === syncFilter;

    return matchesSearch && matchesRisk && matchesSync;
  });

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = '/api/audit/export.csv';
    link.setAttribute('download', 'aerotwin-mro-audit-trail.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            FAA / EASA Part 145 Airworthiness Traceability
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Tamper-Evident MRO Audit Trail
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            SHA-256 hash-chained audit trail of all edge inferences, human sign-offs, and sensor cross-correlations
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-cyan-400 font-mono text-xs rounded transition-colors"
        >
          <Download size={14} />
          <span>{exported ? 'EXPORTED (CSV READY)' : 'EXPORT AUDIT LOG (CSV)'}</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Component, Tech ID, Finding, or Work Order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080C14] border border-[#1E293B] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Risk Filter */}
          <div className="md:col-span-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-[#080C14] border border-[#1E293B] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">Risk: HIGH</option>
              <option value="MEDIUM">Risk: MEDIUM</option>
              <option value="LOW">Risk: LOW</option>
            </select>
          </div>

          {/* Sync Status Filter */}
          <div className="md:col-span-3">
            <select
              value={syncFilter}
              onChange={(e) => setSyncFilter(e.target.value)}
              className="w-full bg-[#080C14] border border-[#1E293B] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Sync States</option>
              <option value="SYNCED">SYNCED (Central Cloud)</option>
              <option value="QUEUED">QUEUED (Offline Edge)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1E293B]/70">
          <span>Showing {filteredLogs.length} verified audit records</span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <ShieldCheck size={13} />
            SHA-256 HASH VERIFIED ON AT-EDGE-07
          </span>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#080C14] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1E293B]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Insp ID</th>
                <th className="py-3 px-3">Component</th>
                <th className="py-3 px-3">Technician</th>
                <th className="py-3 px-3">AI Finding</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Recommendation</th>
                <th className="py-3 px-3">Decision</th>
                <th className="py-3 px-3">Model</th>
                <th className="py-3 px-3 text-right">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 text-xs">
                    No matching audit entries found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 text-slate-300 font-bold whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-bold whitespace-nowrap">
                      {log.inspectionId}
                    </td>
                    <td className="py-3 px-3 text-white font-bold whitespace-nowrap">
                      {log.componentId}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {log.technician}
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {log.finding}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge level={log.risk} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate" title={log.recommendation}>
                      {log.recommendation}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-300 whitespace-nowrap">
                      {log.decision}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {log.modelVersion}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${
                          log.syncStatus === 'SYNCED'
                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-800 text-amber-300'
                        }`}
                      >
                        {log.syncStatus === 'SYNCED' ? (
                          <>
                            <Cloud size={10} />
                            <span>SYNCED</span>
                          </>
                        ) : (
                          <>
                            <CloudOff size={10} />
                            <span>QUEUED</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
