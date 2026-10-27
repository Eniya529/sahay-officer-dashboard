import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const ResponsibleAiModal: React.FC = () => {
  const { isResponsibleAiOpen, setIsResponsibleAiOpen } = useApp();

  if (!isResponsibleAiOpen) return null;

  const doesNotList = [
    'Diagnose medical or clinical mental illness',
    'Determine legal guilt or liability of any party',
    'Replace trained NHAA human officers or first responders',
    'Automatically execute legal orders or dispatch forces without officer review',
    'Treat emotional distress as legal proof of an incident'
  ];

  const doesList = [
    'Identify conversational distress & vulnerability indicators in real-time',
    'Estimate Stress Vulnerability Index (SVI) score for triage queueing',
    'Provide transparent, explainable evidence & confidence breakdowns',
    'Adapt conversation strategy to prevent victim re-traumatization',
    'Assist officer decision prioritization with audit-logged overrides',
    'Track multi-day follow-up recovery trajectories'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-3xl w-full rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden p-6 md:p-8 relative">
        <button 
          onClick={() => setIsResponsibleAiOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Safety & Responsible AI Policy</h2>
            <p className="text-xs text-amber-400 font-medium">NHAA Ecosystem Governance Framework</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 mb-6 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>Critical Policy Note:</strong> SAHAY operates strictly as an intelligent decision-support assistant. Final case authority, legal determinations, and emergency dispatches remain 100% human-controlled by authorized NHAA officers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          {/* SAHAY DOES NOT */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center space-x-2 mb-3 text-rose-400 font-bold text-sm uppercase tracking-wider border-b border-rose-500/20 pb-2">
              <XCircle className="w-4 h-4" />
              <span>SAHAY DOES NOT:</span>
            </div>
            <ul className="space-y-2.5">
              {doesNotList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SAHAY DOES */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center space-x-2 mb-3 text-emerald-400 font-bold text-sm uppercase tracking-wider border-b border-emerald-500/20 pb-2">
              <CheckCircle className="w-4 h-4" />
              <span>SAHAY DOES:</span>
            </div>
            <ul className="space-y-2.5">
              {doesList.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">Audit Trail Enabled & Logged Automatically</span>
          <button 
            onClick={() => setIsResponsibleAiOpen(false)}
            className="px-5 py-2 text-sm font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
