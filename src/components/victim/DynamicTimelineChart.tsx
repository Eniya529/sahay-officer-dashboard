import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceDot 
} from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

export const DynamicTimelineChart: React.FC = () => {
  const { selectedCase } = useApp();

  if (!selectedCase || !selectedCase.timeline || selectedCase.timeline.length === 0) return null;

  const data = selectedCase.timeline;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-sky-500/40 text-xs shadow-xl space-y-1">
          <div className="flex items-center justify-between gap-3 text-slate-300">
            <span className="font-semibold text-sky-400">Time: {label}</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              SVI: {p.svi}
            </span>
          </div>
          {p.label && (
            <div className="text-amber-300 font-semibold flex items-center gap-1.5 pt-1 border-t border-slate-700/60">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{p.label}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-sky-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Vulnerability During Interaction
          </h4>
        </div>
        <span className="text-[11px] text-sky-400 font-mono">
          Dynamic Trajectory ({data[0]?.svi || 30} → {data[data.length - 1]?.svi || 89})
        </span>
      </div>

      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sviGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="svi"
              stroke="#38bdf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#sviGradient)"
              animationDuration={800}
            />

            {/* Annotations / Milestone dots */}
            {data.map((pt, idx) => (
              pt.label ? (
                <ReferenceDot
                  key={idx}
                  x={pt.time}
                  y={pt.svi}
                  r={5}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ) : null
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Key Milestones */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
        {data.filter(d => d.label).map((d, i) => (
          <div key={i} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/60 text-[11px] text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{d.time}: <strong>{d.label}</strong> (SVI {d.svi})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
