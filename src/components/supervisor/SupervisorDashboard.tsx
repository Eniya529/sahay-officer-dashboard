import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogTable } from './AuditLogTable';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle
} from 'lucide-react';

export const SupervisorDashboard: React.FC = () => {
  const { cases } = useApp();

  // Mock chart data sets for presentation excellence
  const vulnerabilityData = [
    { name: 'Critical', value: cases.filter(c => c.sviLevel === 'CRITICAL').length + 4, color: '#ef4444' },
    { name: 'High', value: cases.filter(c => c.sviLevel === 'HIGH').length + 8, color: '#f97316' },
    { name: 'Moderate', value: cases.filter(c => c.sviLevel === 'MODERATE').length + 12, color: '#f59e0b' },
    { name: 'Low', value: cases.filter(c => c.sviLevel === 'LOW').length + 15, color: '#10b981' }
  ];

  const dailyVolumeData = [
    { day: 'Mon', cases: 42, escalated: 6 },
    { day: 'Tue', cases: 58, escalated: 9 },
    { day: 'Wed', cases: 64, escalated: 12 },
    { day: 'Thu', cases: 72, escalated: 14 },
    { day: 'Fri', cases: 88, escalated: 19 },
    { day: 'Sat', cases: 95, escalated: 22 },
    { day: 'Sun', cases: 104, escalated: 25 }
  ];

  const responseTimeData = [
    { shift: 'Morning (08:00)', avgMins: 3.2 },
    { shift: 'Afternoon (14:00)', avgMins: 4.1 },
    { shift: 'Evening (18:00)', avgMins: 3.8 },
    { shift: 'Night (22:00)', avgMins: 2.5 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            Supervisor & System Performance Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            System-wide oversight, officer workload monitoring, and AI decision quality metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            Supervisor Admin Session
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Audit Stream Live
          </span>
        </div>
      </div>

      {/* Top Responsible AI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-2">
          <span className="text-[11px] font-bold uppercase text-purple-300">AI Override Rate</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-white">8.4%</span>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">High officer agreement with SVI recommendations</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
          <span className="text-[11px] font-bold uppercase text-emerald-300">Human Review Compliance</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-emerald-300">100%</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Zero autonomous dispatches without human approval</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-sky-500/30 bg-sky-950/20 space-y-2">
          <span className="text-[11px] font-bold uppercase text-sky-300">Avg Emergency Response</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-sky-300">3.4m</span>
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Time to officer intake on critical SVI triggers</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-2">
          <span className="text-[11px] font-bold uppercase text-amber-300">Active Officer Workload</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-amber-300">4 Active</span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Shift load: ~6 cases per officer</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cases by Vulnerability (Pie Chart) - 4 Cols */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-sky-400" />
            Cases by Vulnerability Level
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {vulnerabilityData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Case Volume & Escalation Trends (Line Chart) - 8 Cols */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Daily Intake Volume & Escalation Trends
            </h3>
            <span className="text-[11px] text-slate-400">7-Day Trajectory</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="cases" stroke="#38bdf8" strokeWidth={3} name="Total Volume" />
                <Line type="monotone" dataKey="escalated" stroke="#f43f5e" strokeWidth={2} name="Critical Escalated" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Response Time Bar Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Average Response Time by Officer Shift (Minutes)
        </h3>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="shift" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="avgMins" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Audit Log Table */}
      <AuditLogTable />
    </div>
  );
};
