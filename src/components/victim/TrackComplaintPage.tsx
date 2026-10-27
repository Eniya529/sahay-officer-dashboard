import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CheckCircle2, Clock, Lock, UserCheck } from 'lucide-react';

export const TrackComplaintPage: React.FC = () => {
  const { cases } = useApp();
  const [searchId, setSearchId] = useState('NHAA-1024');
  const [searchedCase, setSearchedCase] = useState(cases.find(c => c.id === 'NHAA-1024') || cases[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = cases.find(c => c.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) {
      setSearchedCase(found);
    } else {
      alert('Reference ID not found. Please check your reference code.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">Track Your Concern Status</h2>
        <p className="text-xs text-slate-400">
          Enter your reference ID below to view the latest status of your report.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter reference ID (e.g. NHAA-1024)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md"
        >
          Check Status
        </button>
      </form>

      {/* Status Details Card */}
      {searchedCase && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Reference Code</span>
              <h3 className="text-xl font-bold text-white font-mono">{searchedCase.id}</h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Information Received & Logged</span>
              </span>
            </div>
          </div>

          {/* Simple Step Progress */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Status Milestones</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Intake Registered</span>
                </div>
                <p className="text-[11px] text-slate-400">Report details recorded safely in helpline database.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-sky-400">
                  <UserCheck className="w-4 h-4" />
                  <span>2. Assigned Responder</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {searchedCase.assignedOfficer ? `Assigned to ${searchedCase.assignedOfficer}` : 'Assigned to Response Desk Officer'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span>3. Action & Check-in</span>
                </div>
                <p className="text-[11px] text-slate-400">Follow-up check-in scheduled for ongoing guidance.</p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-teal-400">
              <Lock className="w-4 h-4" />
              <span>Protective Measures Active</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If your situation changes or if you require emergency assistance, you can call NHAA helpline 14566 or re-open the interactive support channel anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
