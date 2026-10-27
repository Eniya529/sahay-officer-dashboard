import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Activity, Eye, Sliders, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

export const WhySahayModal: React.FC = () => {
  const { isWhySahayOpen, setIsWhySahayOpen } = useApp();

  if (!isWhySahayOpen) return null;

  const steps = [
    {
      number: '1',
      title: 'Real-Time',
      desc: 'Assessment evolves dynamically during interaction as emotional cues and safety indicators emerge.',
      icon: Activity,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
    },
    {
      number: '2',
      title: 'Explainable',
      desc: 'Clear indicators detail exact confidence percentages and evidence statements behind SVI scores.',
      icon: Eye,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    },
    {
      number: '3',
      title: 'Adaptive',
      desc: 'Trauma-aware questioning automatically simplifies forms to prevent re-traumatizing victims.',
      icon: Sliders,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    },
    {
      number: '4',
      title: 'Human-Controlled',
      desc: 'AI provides decision support only. Human officers hold full authority to accept, modify, or override.',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      number: '5',
      title: 'Continuous',
      desc: 'Tracks SVI trajectory through day 1, day 3, and day 7 follow-ups to measure recovery trends.',
      icon: RefreshCw,
      color: 'text-teal-400 border-teal-500/30 bg-teal-500/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-3xl w-full rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden p-6 md:p-8 relative">
        <button 
          onClick={() => setIsWhySahayOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Why SAHAY?</h2>
            <p className="text-xs text-sky-400 font-medium">Smart AI-Assisted Human Support & Response System</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/80 to-indigo-950/80 border border-sky-500/30 my-5">
          <p className="text-sm md:text-base text-sky-100 font-medium italic text-center leading-relaxed">
            “SAHAY does not stop at detecting distress. It converts real-time vulnerability signals into explainable, actionable and human-controlled response intelligence.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.number} className={`p-3.5 rounded-xl border ${step.color} flex flex-col justify-between space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900/60 text-white">
                    Step {step.number}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SIH Problem Statement PS26093 — NHAA (14566) Ecosystem Layer</span>
          </div>
          <button 
            onClick={() => setIsWhySahayOpen(false)}
            className="px-5 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition shadow-md shadow-sky-600/30"
          >
            Close UVP Card
          </button>
        </div>
      </div>
    </div>
  );
};
