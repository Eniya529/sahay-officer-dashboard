import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Eye, Sliders, UserCheck, RefreshCw, ArrowRight } from 'lucide-react';

export const FinalDemoSummary: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const pillars = [
    { title: 'Real-time Assessment', desc: 'Dynamic SVI score updates continuously during audio/text intake.', icon: Activity, color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
    { title: 'Explainable AI', desc: 'Transparent evidence & confidence metrics for every detected distress trigger.', icon: Eye, color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { title: 'Adaptive Interaction', desc: 'Trauma-aware questioning reduces re-traumatization and repetitive questions.', icon: Sliders, color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
    { title: 'Human Decision Support', desc: 'AI recommends; authorized human officers hold full authority to override.', icon: UserCheck, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { title: 'Case Lifecycle Tracking', desc: 'Follow-up module measures recovery trajectory across Day 1, 3, and 7.', icon: RefreshCw, color: 'border-teal-500/40 text-teal-400 bg-teal-500/10' }
  ];

  return (
    <div className="glass-panel rounded-3xl border border-teal-500/30 p-8 my-8 text-center space-y-6 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="space-y-2 relative z-10">
        <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold uppercase tracking-widest">
          SAHAY SYSTEM ARCHITECTURE • HUMANOVA
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight pt-1">
          SAHAY RESPONSE INTELLIGENCE
        </h2>
        <p className="text-base text-teal-300 font-bold max-w-2xl mx-auto italic">
          “Detect distress. Understand context. Assist the responder. Keep the human in control.”
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 relative z-10">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${p.color} text-left space-y-2 flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-mono font-bold opacity-60">0{idx + 1}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">{p.title}</h4>
                <p className="text-[11px] text-slate-300 leading-snug">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4 relative z-10">
        <button
          onClick={() => setCurrentRoute('officer-dash')}
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-lg flex items-center space-x-2"
        >
          <span>Open Officer Response Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentRoute('officer-analytics')}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition"
        >
          <span>View System Analytics & Audit Trail</span>
        </button>
      </div>
    </div>
  );
};
