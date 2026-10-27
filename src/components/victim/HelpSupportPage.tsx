import React from 'react';
import { HelpCircle } from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">Help & Support Resources</h2>
        <p className="text-xs text-slate-400">
          Immediate contact numbers, legal aid information, and safe guidance resources.
        </p>
      </div>

      {/* Emergency Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-teal-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-teal-400">Primary Helpline</span>
          <h3 className="text-2xl font-black text-white font-mono">14566</h3>
          <p className="text-xs text-slate-300 font-semibold">NHAA National Support Helpline</p>
          <span className="text-[10px] text-slate-400 block pt-1">Toll-free 24/7 Assistance</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-rose-400">Emergency Police</span>
          <h3 className="text-2xl font-black text-white font-mono">112</h3>
          <p className="text-xs text-slate-300 font-semibold">National Emergency Number</p>
          <span className="text-[10px] text-slate-400 block pt-1">Immediate Police Response</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-sky-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-sky-400">Women Helpline</span>
          <h3 className="text-2xl font-black text-white font-mono">1091</h3>
          <p className="text-xs text-slate-300 font-semibold">Women Safety Desk</p>
          <span className="text-[10px] text-slate-400 block pt-1">Dedicated Protective Unit</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-purple-400">Cyber Helpline</span>
          <h3 className="text-2xl font-black text-white font-mono">1930</h3>
          <p className="text-xs text-slate-300 font-semibold">National Cyber Crime</p>
          <span className="text-[10px] text-slate-400 block pt-1">Online Harassment Unit</span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-sm font-bold text-white block">Do I need to visit a police station to submit a concern?</strong>
            <p className="text-slate-300 leading-relaxed">
              No. You can record your concern safely through SAHAY using voice or text. Our human response officers will contact you to provide guidance and coordinate assistance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-sm font-bold text-white block">How does the AI assistant help me?</strong>
            <p className="text-slate-300 leading-relaxed">
              The AI assistant listens to your situation, organizes key details, and highlights safety indicators so human officers can respond quickly and prioritize urgent needs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <strong className="text-sm font-bold text-white block">Is my information shared with unauthorized persons?</strong>
            <p className="text-slate-300 leading-relaxed">
              No. Information is securely handled and accessible only to authorized response personnel handling your concern.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
