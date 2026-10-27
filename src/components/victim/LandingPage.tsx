import React from 'react';
import { 
  Shield, 
  Mic, 
  MessageSquare, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  HeartHandshake
} from 'lucide-react';

export const VictimLandingPage: React.FC<{ onStartComplaint: () => void }> = ({ onStartComplaint }) => {

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
          <HeartHandshake className="w-4 h-4" />
          <span>NHAA 14566 National Helpline Portal</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          SAHAY
        </h1>
        <p className="text-lg md:text-xl font-medium text-slate-300 max-w-2xl mx-auto">
          AI-assisted support for victims and complainants.
        </p>

        <p className="text-sm text-slate-400 max-w-xl mx-auto italic">
          “From distress detection to intelligent, human-controlled response.”
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartComplaint}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-3 transition transform hover:-translate-y-0.5"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Start Support</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartComplaint}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center space-x-2 transition"
          >
            <span>Track Existing Complaint</span>
          </button>

          <a
            href="tel:112"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-bold text-base flex items-center justify-center space-x-2 transition shadow-lg shadow-rose-900/30"
          >
            <PhoneCall className="w-5 h-5 text-rose-400 animate-pulse" />
            <span>Emergency / Immediate Safety (112)</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <Mic className="w-4 h-4 text-sky-400" />
            <span className="font-semibold">Available through voice and text</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">AI assistance does not replace human officers.</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Confidential & End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Voice & Speech Intelligence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Speak in your preferred language (Hindi, Tamil, Telugu, Malayalam, English). The system detects speech tone and emotional markers without requiring typing.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Trauma-Aware Adaptability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates repeated questions. High distress levels trigger streamlined safety confirmation and direct priority dispatch to human responders.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Human Officer Control</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI provides real-time SVI decision-support metrics. Authorized NHAA human officers retain final authority on all case actions and resource allocations.
          </p>
        </div>
      </div>
    </div>
  );
};
