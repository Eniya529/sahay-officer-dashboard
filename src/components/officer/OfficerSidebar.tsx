import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AppRoute } from '../../types';
import { NotificationDrawer } from './NotificationDrawer';
import {
  Shield,
  LayoutDashboard,
  FileText,
  UserCheck,
  Calendar,
  BarChart3,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Siren,
  CircleCheck,
} from 'lucide-react';

export const OfficerSidebar: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    setUserRole,
    cases,
  } = useApp();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const criticalCount = useMemo(
    () => cases.filter((c) => c.sviLevel === 'CRITICAL').length,
    [cases]
  );

  const followupCount = useMemo(
    () =>
      cases.reduce(
        (total, c) =>
          total +
          (Array.isArray(c.followUpHistory)
            ? c.followUpHistory.filter((f) => f.status === 'Pending').length
            : 0),
        0
      ),
    [cases]
  );

  const navItems: {
    route: AppRoute;
    label: string;
    icon: ReactNode;
    count?: number;
    tone?: 'critical' | 'amber';
  }[] = [
    { route: 'officer-dash', label: 'Command Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { route: 'officer-cases', label: 'Case Workspace', icon: <FileText className="w-4 h-4" /> },
    {
      route: 'officer-allocation',
      label: 'Officer Allocation',
      icon: <UserCheck className="w-4 h-4" />,
      count: criticalCount,
      tone: 'critical',
    },
    {
      route: 'officer-followups',
      label: 'Follow-up Desk',
      icon: <Calendar className="w-4 h-4" />,
      count: followupCount,
      tone: 'amber',
    },
    { route: 'officer-analytics', label: 'Operational Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const isNavActive = (r: AppRoute) =>
    r === 'officer-cases' && currentRoute === 'officer-case-detail'
      ? true
      : currentRoute === r;

  const handleNavClick = (route: AppRoute) => {
    setCurrentRoute(route);
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="lg:hidden bg-white border-b border-line px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
            <Shield className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <span className="block font-black text-slate-900 text-sm tracking-tight">SAHAY</span>
            <span className="block text-[9px] text-muted font-semibold uppercase tracking-wider">Officer Workspace</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 border border-line"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-line flex flex-col transition-transform duration-300 shadow-sm ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-line">
          <div
            onClick={() => handleNavClick('officer-dash')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-sm group-hover:border-teal-400 transition">
              <Shield className="w-6 h-6 text-teal-700" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                SAHAY
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 border border-teal-200">
                  OFFICER
                </span>
              </h1>
              <p className="text-[10px] text-muted font-medium truncate">Response Intelligence Workspace</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-line">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-700">Duty desk active</span>
            </div>
            <span className="text-[9px] font-mono text-muted">LIVE</span>
          </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
          <div className="px-3 section-kicker">Response Workspace</div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isNavActive(item.route);

              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-teal-600" />
                  )}

                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-teal-700' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`min-w-5 h-5 px-1 rounded-full text-[9px] font-black flex items-center justify-center border ${
                          item.tone === 'critical'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                    {active && <ChevronRight className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="pt-3">
            <div className="px-3 py-3 rounded-xl border border-line bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <Siren className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Attention queue</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-lg font-black text-red-700 font-mono">{criticalCount}</span>
                  <span className="text-[9px] text-muted">Critical</span>
                </div>
                <div>
                  <span className="block text-lg font-black text-amber-700 font-mono">{followupCount}</span>
                  <span className="text-[9px] text-muted">Follow-up</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-line space-y-2">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-line text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Notifications</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">3</span>
          </button>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-teal-200 flex items-center justify-center text-teal-700">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Officer Rajesh Kumar</h4>
                <p className="text-[10px] text-muted truncate">NHAA-884 · Senior Officer</p>
              </div>
              <CircleCheck className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
            </div>
          </div>

          <button
            onClick={() => {
              setUserRole('victim');
              setCurrentRoute('home');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-line hover:border-red-200 text-slate-500 hover:text-red-700 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch / Logout</span>
          </button>
        </div>
      </aside>

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};
