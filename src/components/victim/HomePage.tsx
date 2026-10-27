import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  MessageSquare, 
  Search, 
  Lock, 
  UserCheck, 
  Globe, 
  Mic, 
  Brain, 
  Calendar, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/40 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Public Protection & Response System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your voice matters.<br />
            <span className="text-teal-400">We're here to listen.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            Share what happened in your own words. You can type or speak, and our system will help connect your situation with the appropriate support. You do not need to explain everything perfectly.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentRoute('victim-report')}
              className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-xl shadow-teal-600/25 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Report a Concern</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentRoute('victim-status')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition flex items-center space-x-2"
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>Track My Complaint</span>
            </button>
          </div>

          {/* TRUST BADGES BAR */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-teal-400" />
              <span>🔒 Secure information handling</span>
            </div>

            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>🤝 Human responders remain in control</span>
            </div>

            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>🌐 Language support available</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-STEP VISUAL WORKFLOW SECTION */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase text-teal-400 tracking-wider">How SAHAY Works</h2>
          <h3 className="text-2xl font-bold text-white tracking-tight">Four Simple Steps to Guidance & Response</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-teal-400" />
              Speak or Type
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe what happened in your own words. Use voice input or text in your comfortable language.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-400" />
              Understand
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our intelligent system evaluates safety indicators and context to understand urgency without judgment.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Human Response
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized human officers review the concern and initiate appropriate support actions and safety measures.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Follow Up
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scheduled welfare check-ins ensure ongoing protection, legal support, and long-term recovery.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK SECTIONS: SELECT A SITUATION & HELPLINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select a Situation Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-teal-400">
            <Shield className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Need Help Choosing Where to Start?</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            We have prepared guided situation templates to help you structure your concern regarding threats, social exclusion, workplace harassment, or physical safety.
          </p>
          <button
            onClick={() => setCurrentRoute('victim-scenarios')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 font-semibold text-xs transition flex items-center space-x-2"
          >
            <span>Browse Situation Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Emergency Helpline Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sky-400">
            <PhoneCall className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Emergency Helplines & Assistance</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If you are in immediate life-threatening physical danger, contact emergency services right away:
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
            <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
              NHAA Helpline: 14566
            </span>
            <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40">
              National Emergency: 112
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
