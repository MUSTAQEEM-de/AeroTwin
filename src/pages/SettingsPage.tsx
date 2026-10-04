import React, { useState } from 'react';
import {
  Settings,
  HardDrive,
  Cpu,
  Wifi,
  WifiOff,
  ShieldCheck,
  User,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Lock,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { settingsService } from '../services/settingsService';
import { MOCK_USERS } from '../data/mockData';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    isOffline,
    toggleOffline,
    resetAllData
  } = useApp();

  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(80);
  const [preferredCompute, setPreferredCompute] = useState<'NPU' | 'CPU'>('NPU');
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const handleSave = async () => {
    await settingsService.saveSettings({ confidenceThreshold, preferredCompute });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            System & Device Configuration
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Edge Settings & Device Health
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Host: <strong className="text-cyan-400">AT-EDGE-07</strong> · Local OS: Linux Embedded (Yocto MRO) · Firmware: v2.4.1
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-slate-300 rounded transition-colors"
          >
            <RotateCcw size={13} />
            <span>RESET DEMO DATA</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
          >
            <span>SAVE PREFERENCES</span>
          </button>
        </div>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-600 rounded-lg text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={15} />
          <span>Device preferences saved to on-board non-volatile memory.</span>
        </div>
      )}

      {/* Grid: Device Specs, Profile, Security, AI Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        {/* Edge Device Card (Section 36) */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3.5">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <HardDrive size={15} className="text-cyan-400" />
              <span>EDGE HARDWARE STATUS</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">HEALTHY</span>
          </div>

          <div className="space-y-2 bg-[#080C14] p-3 rounded-lg border border-[#1E293B]">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Device ID:</span>
              <span className="text-cyan-400 font-bold">AT-EDGE-07</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Neural Accelerator:</span>
              <span className="text-white font-semibold">Edge TPU / NPU 32 TOPS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">AI Models:</span>
              <span className="text-emerald-400 font-bold">Loaded in VRAM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Storage Volume:</span>
              <span className="text-slate-200">512 GB NVMe (4% Used)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Battery / Line Power:</span>
              <span className="text-emerald-400 font-bold">AC Operational (100%)</span>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3.5">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <User size={15} className="text-cyan-400" />
              <span>TECHNICIAN PROFILE</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">ACTIVE SESSION</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 uppercase mb-1">
                Active User Identity:
              </label>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const user = MOCK_USERS.find((u) => u.id === e.target.value);
                  if (user) setCurrentUser(user);
                }}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                {MOCK_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role} ({u.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#080C14] p-3 rounded-lg border border-[#1E293B] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Employee ID:</span>
                <span className="text-white font-bold">{currentUser.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Base:</span>
                <span className="text-slate-200">{currentUser.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MRO License:</span>
                <span className="text-emerald-400 font-bold">FAA A&P + Powerplant Cert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Cryptography Card (Section 47) */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3.5">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <ShieldCheck size={15} className="text-cyan-400" />
              <span>SECURITY & COMPLIANCE POSTURE</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">SECURE</span>
          </div>

          <div className="space-y-2 bg-[#080C14] p-3 rounded-lg border border-[#1E293B]">
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Session Security:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Lock size={12} />
                SECURE SESSION ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Transport Security:</span>
              <span className="text-emerald-400 font-bold">mTLS 1.3 ACTIVE</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Device Hardware ID:</span>
              <span className="text-white font-mono">DEVICE REGISTERED (TPM 2.0)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Local Data Encryption:</span>
              <span className="text-emerald-400 font-bold">AES-256 ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* AI & Edge Inference Configuration */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-3.5">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Sliders size={15} className="text-cyan-400" />
              <span>INFERENCE & THRESHOLDS</span>
            </span>
            <span className="text-[10px] text-cyan-400">LOCAL TUNING</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400 uppercase">Detection Alert Threshold:</span>
                <span className="text-cyan-400 font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 uppercase mb-1">
                Preferred Compute Backend:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredCompute('NPU')}
                  className={`p-2 rounded border text-xs font-bold transition-colors ${
                    preferredCompute === 'NPU'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-[#080C14] border-slate-800 text-slate-400'
                  }`}
                >
                  Edge NPU (Default, 143ms)
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredCompute('CPU')}
                  className={`p-2 rounded border text-xs font-bold transition-colors ${
                    preferredCompute === 'CPU'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-[#080C14] border-slate-800 text-slate-400'
                  }`}
                >
                  CPU Fallback (520ms)
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Offline Simulation Toggle:</span>
                <button
                  onClick={toggleOffline}
                  className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                    isOffline
                      ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {isOffline ? 'Offline Mode Active' : 'Switch to Offline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
