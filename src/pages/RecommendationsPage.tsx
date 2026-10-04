import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  FileCheck2,
  ShieldAlert,
  Send,
  X,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendation,
    acceptRecommendation,
    overrideRecommendation,
    requestReviewRecommendation,
    currentUser,
    selectedComponent,
    setActiveTab
  } = useApp();

  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Override Form
  const [overrideReason, setOverrideReason] = useState<string>('Additional inspection completed');
  const [overrideNotes, setOverrideNotes] = useState<string>('');

  // Review Form
  const [reviewPriority, setReviewPriority] = useState<string>('HIGH');
  const [reviewMessage, setReviewMessage] = useState<string>('');

  const handleConfirmOverride = () => {
    overrideRecommendation(overrideReason, overrideNotes);
    setShowOverrideModal(false);
  };

  const handleConfirmReview = () => {
    requestReviewRecommendation(reviewPriority, reviewMessage);
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Explainable AI Decision Support
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            Maintenance Action Recommendation
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Component: <strong className="text-cyan-400">{selectedComponent.name}</strong> ({selectedComponent.code}) · Signoff Authority: <strong className="text-cyan-400">{currentUser.name}</strong> ({currentUser.employeeId})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge level={recommendation.priority} label={`PRIORITY: ${recommendation.priority}`} />
          {recommendation.decisionState !== 'PENDING' && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300">
              STATUS: {recommendation.decisionState}
            </span>
          )}
        </div>
      </div>

      {/* Main Priority Alert Banner */}
      <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-xl p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-[10px] text-rose-400 uppercase font-bold tracking-widest">
                AUTOMATED DISPATCH WARNING
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                ⚠ HIGH MAINTENANCE PRIORITY — COMPONENT GROUND HOLD
              </h2>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-slate-400 text-[10px]">WORK ORDER ID</div>
            <div className="text-cyan-400 font-bold">{recommendation.id}</div>
          </div>
        </div>

        <div className="p-3.5 bg-black/40 border border-rose-800/40 rounded-lg space-y-1">
          <div className="text-[10px] uppercase font-bold text-rose-300">
            RECOMMENDED ACTION DIRECTIVE
          </div>
          <p className="text-sm font-bold text-white leading-relaxed">
            {recommendation.action}
          </p>
          <div className="text-[11px] text-slate-300 pt-1 leading-relaxed">
            <strong>Operational Rationale:</strong> {recommendation.reason}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Correlated Evidence & Decision Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Correlated Evidence (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              CORRELATED EVIDENCE SUMMARY
            </span>
            <span className="text-[10px] text-cyan-400">4 INDEPENDENT CHANNELS</span>
          </div>

          <div className="space-y-2.5">
            {recommendation.evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#080C14] border border-[#1E293B] flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="text-slate-200 leading-relaxed font-semibold">
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#080C14] border border-[#1E293B] rounded-lg space-y-1">
            <div className="text-[10px] text-amber-400 font-bold uppercase">
              OPERATIONAL IMPACT ANALYSIS
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {recommendation.operationalImpact}
            </p>
          </div>
        </div>

        {/* Right: Human-in-the-Loop Actions (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-[#1E293B] pb-2 flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-xs">
                HUMAN-IN-THE-LOOP DECISION
              </span>
              <span className="text-[10px] text-amber-400">SIGN-OFF REQUIRED</span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Airworthiness regulations require a certified technician or engineer to review and sign off on all AI-generated maintenance recommendations.
            </p>

            {/* Decision Status Box if already acted */}
            {recommendation.decisionState !== 'PENDING' && recommendation.decisionDetails && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>DECISION RECORDED: {recommendation.decisionDetails.action}</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  Technician: <strong className="text-white">{recommendation.decisionDetails.technician}</strong>
                </div>
                {recommendation.decisionDetails.reason && (
                  <div className="text-[10px] text-slate-300">
                    Reason: <em>{recommendation.decisionDetails.reason}</em>
                  </div>
                )}
                {recommendation.decisionDetails.notes && (
                  <div className="text-[10px] text-slate-300">
                    Notes: <em>{recommendation.decisionDetails.notes}</em>
                  </div>
                )}
                <div className="text-[9px] text-slate-500 pt-1">
                  Recorded at {recommendation.decisionDetails.timestamp}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (Section 27) */}
          <div className="space-y-2.5 pt-4 border-t border-[#1E293B]">
            {/* 1. Accept */}
            <button
              onClick={acceptRecommendation}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 size={16} />
              <span>ACCEPT RECOMMENDATION (DISPATCH NDT)</span>
            </button>

            {/* 2. Override */}
            <button
              onClick={() => setShowOverrideModal(true)}
              className="w-full py-2.5 px-4 bg-[#080C14] hover:bg-slate-900 border border-amber-600/60 text-amber-300 font-bold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <RotateCcw size={14} />
              <span>OVERRIDE AI RECOMMENDATION</span>
            </button>

            {/* 3. Request Review */}
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full py-2.5 px-4 bg-[#080C14] hover:bg-slate-900 border border-cyan-700/60 text-cyan-300 font-bold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <HelpCircle size={14} />
              <span>REQUEST ENGINEERING REVIEW</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className="w-full text-center text-[10px] text-slate-400 hover:text-cyan-400 pt-1 underline"
            >
              View updated entry in Audit Trail →
            </button>
          </div>
        </div>
      </div>

      {/* Override Modal (Section 27) */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono text-xs">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <RotateCcw size={15} />
                <span>Override AI Recommendation</span>
              </span>
              <button onClick={() => setShowOverrideModal(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">
                  Reason for Override:
                </label>
                <select
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Additional inspection completed">Additional inspection completed</option>
                  <option value="False positive">False positive</option>
                  <option value="Engineering assessment differs">Engineering assessment differs</option>
                  <option value="Alternate dispatch authorized by Chief Inspector">Alternate dispatch authorized by Chief Inspector</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">
                  Technician Notes & Reference Manual (AMM/CMM):
                </label>
                <textarea
                  rows={3}
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Enter manual inspection findings, AMM 72-51 task reference, or optical measurement justification..."
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E293B]">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Review Modal (Section 27) */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono text-xs">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                <HelpCircle size={15} />
                <span>Request Engineering Review</span>
              </span>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">
                  Review Priority Level:
                </label>
                <select
                  value={reviewPriority}
                  onChange={(e) => setReviewPriority(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="CRITICAL">CRITICAL — Immediate Gate Hold</option>
                  <option value="HIGH">HIGH — Review Prior to Departure</option>
                  <option value="MEDIUM">MEDIUM — Next Overnight Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">
                  Message for Lead Propulsion Engineer:
                </label>
                <textarea
                  rows={3}
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Explain ambiguity in sensor readings or vision defect location..."
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E293B]">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReview}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
              >
                Submit Review Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
