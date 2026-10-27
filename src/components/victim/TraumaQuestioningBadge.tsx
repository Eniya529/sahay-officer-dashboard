import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const TraumaQuestioningBadge: React.FC = () => {
  const { selectedCase } = useApp();

  if (!selectedCase) return null;

  const svi = selectedCase.sviScore;
  const isTraumaActive = selectedCase.traumaModeActive || svi >= 70;

  const getStrategy = () => {
    if (svi >= 85) {
      return {
        level: 'CRITICAL SAFETY FOCUS',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50 glow-rose',
        reason: 'Severe distress & threat detected. Bypassing non-essential form questions.',
        rule: 'Ask ONLY current physical safety location. Trigger direct human officer emergency dispatch.',
        example: '“Are you currently in immediate danger? Connecting you to a senior officer right now.”'
      };
    } else if (svi >= 70) {
      return {
        level: 'HIGH TRAUMA REDUCTION',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/50 glow-orange',
        reason: 'High distress detected. Reducing repetitive questioning.',
        rule: 'Do not ask to re-explain historic events. Confirm single mandatory details only.',
        example: '“You have already provided information about the incident. I only need to confirm one detail.”'
      };
    } else if (svi >= 50) {
      return {
        level: 'MODERATE SIMPLIFIED MODE',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50 glow-amber',
        reason: 'Elevated anxiety detected. Using short, single-step prompts.',
        rule: 'Avoid complex multi-part forms. Offer simple yes/no or audio input options.',
        example: '“Are you currently in a safe location?”'
      };
    } else {
      return {
        level: 'STANDARD INFORMATIONAL MODE',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        reason: 'Low distress detected. Standard intake workflow.',
        rule: 'Gather initial incident category and reference details.',
        example: '“Please describe what support or information you require today.”'
      };
    }
  };

  const currentStrategy = getStrategy();

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-4 space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Adaptive AI Questioning Strategy
          </h4>
        </div>
        {isTraumaActive && (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold animate-pulse">
            <HeartHandshake className="w-3 h-3" />
            <span>Trauma-Aware Mode Active</span>
          </span>
        )}
      </div>

      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-semibold">Active Mode:</span>
          <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold border ${currentStrategy.badgeColor}`}>
            {currentStrategy.level}
          </span>
        </div>

        <div className="text-xs space-y-1">
          <p className="text-slate-300 font-medium">
            <strong className="text-sky-400">Strategy Reason:</strong> {currentStrategy.reason}
          </p>
          <p className="text-slate-400 text-[11px]">
            <strong className="text-slate-300">Prompting Rule:</strong> {currentStrategy.rule}
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-sky-200 italic flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>{currentStrategy.example}</span>
        </div>
      </div>
    </div>
  );
};
