import React, { useState } from 'react';
import { HardDrive, ShieldCheck, Cpu, ArrowRight, Lock, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [employeeId, setEmployeeId] = useState<string>('TECH-024');
  const [password, setPassword] = useState<string>('••••••••');
  const [selectedUser, setSelectedUser] = useState<string>('TECH-024');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedUser);
  };

  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col justify-between p-6 select-none font-sans text-slate-200">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">
            AE
          </div>
          <div>
            <div className="text-base font-bold font-mono tracking-wider text-slate-100">
              AEROTWIN EDGE
            </div>
            <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
              Aerospace MRO Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          <span>EDGE NODE: AT-EDGE-07 (ONLINE)</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#0F172A] border border-[#1E293B] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              AEROTWIN EDGE
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Offline Edge-AI Maintenance Copilot
            </p>
            <div className="pt-2 text-[11px] text-cyan-400/90 font-mono">
              Turbine Blade Inspection + Health Assessment POC
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Select Technician / Engineer Profile
              </label>
              <div className="space-y-2">
                {MOCK_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUser(u.employeeId);
                      setEmployeeId(u.employeeId);
                    }}
                    className={`w-full text-left p-2.5 rounded border text-xs font-mono flex items-center justify-between transition-colors ${
                      selectedUser === u.employeeId
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.role} · {u.department}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">
                      {u.employeeId}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Password / Secure Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-950"
            >
              <span>SIGN IN TO EDGE CONSOLE</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Edge Device status footer inside card */}
          <div className="pt-4 border-t border-[#1E293B] grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <HardDrive size={11} className="text-cyan-400" />
              <span>EDGE DEVICE: <strong className="text-slate-200">AT-EDGE-07</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-right justify-end">
              <Cpu size={11} className="text-emerald-400" />
              <span>AI MODELS: <strong className="text-emerald-400">LOADED</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Telemetry */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400 pt-4 border-t border-[#1E293B]/40">
        <div>AeroTwin Edge Platform · Tata Technologies MRO Copilot Prototype</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck size={12} className="text-cyan-400" />
            AES-256 LOCAL STORAGE ENCRYPTION
          </span>
          <span className="text-slate-600">·</span>
          <span>AIRBUS A320 CFM56 VALIDATION SET</span>
        </div>
      </div>
    </div>
  );
};
