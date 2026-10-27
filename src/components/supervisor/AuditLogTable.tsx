import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Lock } from 'lucide-react';

export const AuditLogTable: React.FC = () => {
  const { auditLogs } = useApp();
  const [query, setQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.caseId.toLowerCase().includes(query.toLowerCase()) ||
    log.user.toLowerCase().includes(query.toLowerCase()) ||
    log.action.toLowerCase().includes(query.toLowerCase()) ||
    log.humanDecision.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Lock className="w-5 h-5 text-sky-400" />
            System Audit & Accountability Log
          </h3>
          <p className="text-xs text-slate-400">
            Immutable, timestamped record of all AI suggestions, officer decisions, and recommendation overrides.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search audit logs..."
            className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Case ID</th>
              <th className="p-3">User / Officer</th>
              <th className="p-3">Action</th>
              <th className="p-3">AI Recommendation</th>
              <th className="p-3">Human Decision</th>
              <th className="p-3">Reason / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition">
                <td className="p-3 text-slate-400">{log.timestamp}</td>
                <td className="p-3 font-bold text-sky-400">{log.caseId}</td>
                <td className="p-3 text-slate-200">{log.user}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.action.includes('Override') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    log.action.includes('Accepted') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-slate-300 max-w-xs truncate">{log.aiRecommendation}</td>
                <td className="p-3 font-bold text-amber-300">{log.humanDecision}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate">{log.reason || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
