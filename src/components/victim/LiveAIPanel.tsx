import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const LiveAIPanel: React.FC = () => {
  const { selectedCase, setIsResponsibleAiOpen } = useApp();

  if (!selectedCase) return null;

  const score = selectedCase.sviScore;
  const level = selectedCase.sviLevel;
  const confidence = selectedCase.confidence;
  const indicators = selectedCase.indicators;

  // Level color theme
  const getBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-rose animate-pulse';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40 glow-orange';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-emerald';
    }
  };

  const getGaugeColor = (lvl: string) => {
    switch (lvl) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MODERATE': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            LIVE AI ASSESSMENT
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Real-Time Core</span>
      </div>

      {/* SVI Gauge & Score Display */}
      <div className="flex items-center justify-around p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden">
        {/* Visual Radial Meter Background */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="transition-all duration-700 ease-out"
              strokeWidth="3.8"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
              stroke={getGaugeColor(level)}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white tracking-tight">{score}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">SVI Score</span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Stress Vulnerability</span>
            <div className={`px-3 py-1 rounded-lg border text-sm font-black tracking-wider uppercase inline-block mt-1 ${getBadgeStyle(level)}`}>
              {level}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Confidence: <strong className="text-white font-mono">{confidence}%</strong></span>
          </div>
        </div>
      </div>

      {/* Explainable AI Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            Why is assessment {level}?
          </h4>
          <button 
            onClick={() => setIsResponsibleAiOpen(true)}
            className="text-[10px] text-sky-400 hover:underline"
          >
            Methodology
          </button>
        </div>

        <div className="space-y-3">
          {indicators.map((ind) => (
            <div key={ind.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    ind.category === 'threat' ? 'bg-rose-400' :
                    ind.category === 'fear' ? 'bg-orange-400' :
                    ind.category === 'safety' ? 'bg-amber-400' : 'bg-sky-400'
                  }`} />
                  {ind.name}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{ind.confidence}% confidence</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    ind.confidence > 85 ? 'bg-gradient-to-r from-orange-500 to-rose-500' :
                    ind.confidence > 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-sky-500'
                  }`} 
                  style={{ width: `${ind.confidence}%` }}
                />
              </div>

              {ind.evidence && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2 bg-slate-950/40 p-1.5 rounded border border-slate-800/50">
                  {ind.evidence}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong>Notice:</strong> AI assessment is decision support, not a clinical diagnosis or legal proof.
        </p>
      </div>
    </div>
  );
};
