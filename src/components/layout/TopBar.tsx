import React, { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Bell,
  Play,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Cpu,
  Cloud,
  ChevronDown,
  User,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';

export const TopBar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    selectedAircraft,
    selectedComponent,
    isOffline,
    toggleOffline,
    syncQueue,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveTab,
    isDemoRunning,
    startCompleteDemo,
    stopCompleteDemo,
    resetAllData
  } = useApp();

  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setShowStatusModal(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="h-14 bg-[#090D16] border-b border-[#1E293B] px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left zone: Aircraft & Active Component Context */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 rounded">
          <span className="text-slate-400 text-[10px] uppercase">Aircraft</span>
          <button
            onClick={() => setActiveTab('aircraft')}
            className="text-cyan-400 font-bold hover:underline"
          >
            {selectedAircraft.id}
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">{selectedAircraft.model}</span>
        </div>

        <div className="flex items-center gap-2 bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 rounded">
          <span className="text-slate-400 text-[10px] uppercase">Component</span>
          <button
            onClick={() => setActiveTab('components')}
            className="text-amber-400 font-bold hover:underline"
          >
            {selectedComponent.name}
          </button>
          <span className="text-slate-600">({selectedComponent.code})</span>
        </div>
      </div>

      {/* Right zone: Connectivity, Demo Controls, Alerts, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Run Complete Demo CTA */}
        <button
          onClick={isDemoRunning ? stopCompleteDemo : startCompleteDemo}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded border transition-colors ${
            isDemoRunning
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-300 animate-pulse'
              : 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60'
          }`}
          title="Run automated 12-step presentation flow"
        >
          {isDemoRunning ? (
            <>
              <Radio size={13} className="text-rose-400 animate-spin" />
              <span>STOP DEMO</span>
            </>
          ) : (
            <>
              <Play size={13} className="text-cyan-400" />
              <span>RUN COMPLETE DEMO</span>
            </>
          )}
        </button>

        {/* Reset State */}
        <button
          onClick={resetAllData}
          title="Reset simulation to initial baseline"
          className="p-1.5 text-slate-400 hover:text-slate-200 bg-[#0F172A] border border-[#1E293B] rounded hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={14} />
        </button>

        {/* Offline Simulation Toggle */}
        <button
          onClick={toggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded border transition-colors ${
            isOffline
              ? 'bg-amber-950/60 border-amber-600/50 text-amber-300 font-bold'
              : 'bg-[#0F172A] border-[#1E293B] text-slate-300 hover:text-white'
          }`}
          title="Toggle Edge Offline Mode simulation"
        >
          {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
          <span>{isOffline ? 'OFFLINE SIM' : 'GO OFFLINE'}</span>
        </button>

        {/* Connectivity Status Pill / Dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setShowStatusModal(!showStatusModal)}
            className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono rounded border transition-colors ${
              isOffline
                ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-amber-400 ring-2 ring-amber-400/20' : 'bg-emerald-400 ring-2 ring-emerald-400/20'
              }`}
            />
            <span className="font-bold">{isOffline ? 'OFFLINE MODE' : 'ONLINE'}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {/* Connectivity Popover */}
          {showStatusModal && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-xl p-3 z-50 text-xs font-mono space-y-2.5 animate-in fade-in duration-150">
              <div className="text-[11px] font-bold text-slate-300 border-b border-[#1E293B] pb-2 flex items-center justify-between">
                <span>SYSTEM & LINK TELEMETRY</span>
                <span className="text-[10px] text-cyan-400">AT-EDGE-07</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Wifi size={13} className={isOffline ? 'text-amber-400' : 'text-emerald-400'} />
                    Network
                  </span>
                  <span className={isOffline ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isOffline ? 'OFFLINE' : 'CONNECTED'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Cpu size={13} className="text-cyan-400" />
                    Edge AI
                  </span>
                  <span className="text-emerald-400 font-bold">ACTIVE (Local NPU)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="flex items-center gap-2 text-slate-400">
                    <HardDrive size={13} className="text-cyan-400" />
                    Local Storage
                  </span>
                  <span className="text-emerald-400 font-bold">HEALTHY (98% Free)</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Cloud size={13} className={isOffline ? 'text-amber-400' : 'text-cyan-400'} />
                    Cloud Sync
                  </span>
                  <span className={syncQueue.length > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {syncQueue.length > 0 ? `${syncQueue.length} QUEUED` : 'UP TO DATE'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setActiveTab('sync');
                }}
                className="w-full mt-2 py-1.5 text-center text-xs text-cyan-400 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800 rounded font-semibold transition-colors"
              >
                Open Sync Center →
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Flyout */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 text-slate-300 hover:text-white bg-[#0F172A] border border-[#1E293B] rounded relative hover:bg-slate-800 transition-colors"
          >
            <Bell size={14} />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-mono flex items-center justify-center font-bold">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-2xl p-3 z-50 text-xs font-mono space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="font-bold text-slate-200">OPERATIONAL ALERTS</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-slate-400 hover:text-cyan-400"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-[11px]">
                    No active maintenance notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.targetTab) setActiveTab(notif.targetTab);
                        setShowNotifMenu(false);
                      }}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        notif.read
                          ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                          : notif.type === 'ALERT'
                          ? 'bg-rose-950/30 border-rose-800/60 text-slate-200'
                          : notif.type === 'WARNING'
                          ? 'bg-amber-950/30 border-amber-800/60 text-slate-200'
                          : 'bg-cyan-950/30 border-cyan-800/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span className="flex items-center gap-1.5">
                          {notif.type === 'ALERT' && <AlertTriangle size={11} className="text-rose-400" />}
                          {notif.type === 'WARNING' && <AlertTriangle size={11} className="text-amber-400" />}
                          {notif.type === 'SUCCESS' && <CheckCircle2 size={11} className="text-emerald-400" />}
                          {notif.title}
                        </span>
                        <span className="text-[9px] text-slate-500 font-normal">{notif.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Technician Profile Card & Switcher */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#0F172A] border border-[#1E293B] rounded hover:border-slate-600 transition-colors"
          >
            <div className="w-7 h-7 rounded bg-cyan-900/80 border border-cyan-500/40 flex items-center justify-center text-xs font-mono font-bold text-cyan-200">
              {currentUser.avatar}
            </div>
            <div className="text-left font-mono leading-none">
              <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{currentUser.employeeId} · {currentUser.role}</div>
            </div>
            <ChevronDown size={12} className="text-slate-400 ml-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-xl p-2 z-50 text-xs font-mono space-y-1 animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 border-b border-[#1E293B]">
                Switch Mock Profile
              </div>
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded flex items-center gap-2.5 transition-colors ${
                    currentUser.id === user.id ? 'bg-cyan-950/60 text-cyan-300' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {user.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.employeeId} · {user.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
