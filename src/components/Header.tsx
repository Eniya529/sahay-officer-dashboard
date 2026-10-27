import React from 'react';
import { useApp } from '../context/AppContext';
import type { LanguageCode } from '../types';
import { 
  Shield, 
  MessageSquare, 
  Search, 
  HelpCircle, 
  Globe,
  Grid,
  FileCheck,
  UserCheck,
  Home,
  BarChart3,
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    language, 
    setLanguage, 
    setUserRole,
    setIsWhySahayOpen, 
    setIsResponsibleAiOpen,
    officerNotification,
    dismissOfficerNotification,
    setSelectedCaseId
  } = useApp();

  const isOfficerArea = currentRoute.startsWith('officer');

  const languagesList: { code: LanguageCode; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 glass-panel bg-slate-950/95 backdrop-blur-md">
      {/* Top Helpline & Trust Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 text-[10px]">
            NHAA 14566 HELPLINE
          </span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            AI-Assisted Victim Vulnerability & Response Intelligence Platform
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Switch Role Button */}
          <button 
            onClick={() => {
              if (isOfficerArea) {
                setUserRole('victim');
                setCurrentRoute('home');
              } else {
                setUserRole('officer');
                setCurrentRoute('officer-dash');
              }
            }}
            className="flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 transition font-bold text-[11px] bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isOfficerArea ? 'Switch to Victim Support Portal' : 'Officer Response Portal →'}</span>
          </button>

          <span className="text-slate-700 hidden md:inline">|</span>

          <button 
            onClick={() => setIsWhySahayOpen(true)}
            className="hidden md:flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition font-medium text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>About SAHAY</span>
          </button>

          <button 
            onClick={() => setIsResponsibleAiOpen(true)}
            className="hidden md:flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition font-medium text-[11px]"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Responsible AI Policy</span>
          </button>
        </div>
      </div>

      {/* OFFICER PRIORITY ESCALATION NOTIFICATION BANNER (Requirement 9) */}
      {officerNotification && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 border-b border-rose-500/40 px-4 py-2 text-xs text-white flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span className="font-bold">⚠️ Assessment Updated:</span>
            <span>Case <strong>{officerNotification.caseId}</strong> Priority increased: <span className="underline font-bold text-amber-300">{officerNotification.fromLevel} → {officerNotification.toLevel}</span>. Reason: {officerNotification.reason}</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                setSelectedCaseId(officerNotification.caseId);
                setUserRole('officer');
                setCurrentRoute('officer-case-detail');
                dismissOfficerNotification();
              }}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition shadow-md"
            >
              Review Case →
            </button>
            <button onClick={dismissOfficerNotification} className="text-slate-300 hover:text-white font-bold text-sm">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (isOfficerArea) setCurrentRoute('officer-dash');
            else setCurrentRoute('home');
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-0.5 border border-teal-500/40 shadow-lg shadow-teal-500/10 group-hover:border-teal-400 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                SAHAY
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  PUBLIC SERVICE
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Smart AI-Assisted Human Support & Response System
            </p>
          </div>
        </div>

        {/* Navigation Bar matching User Experience */}
        {!isOfficerArea ? (
          /* PUBLIC / VICTIM NAVIGATION */
          <nav className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full text-xs">
            <button
              onClick={() => setCurrentRoute('home')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'home' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentRoute('victim-report')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                currentRoute === 'victim-report' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Report a Concern</span>
            </button>

            <button
              onClick={() => setCurrentRoute('victim-scenarios')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'victim-scenarios' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Select a Situation</span>
            </button>

            <button
              onClick={() => setCurrentRoute('victim-status')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'victim-status' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Complaint</span>
            </button>

            <button
              onClick={() => setCurrentRoute('victim-help')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'victim-help' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & Support</span>
            </button>
          </nav>
        ) : (
          /* OFFICER EXPERIENCE NAVIGATION */
          <nav className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full text-xs">
            <button
              onClick={() => setCurrentRoute('officer-dash')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'officer-dash' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentRoute('officer-cases')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'officer-cases' || currentRoute === 'officer-case-detail' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => setCurrentRoute('officer-allocation')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'officer-allocation' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Allocation</span>
            </button>

            <button
              onClick={() => setCurrentRoute('officer-followups')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'officer-followups' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Follow-ups</span>
            </button>

            <button
              onClick={() => setCurrentRoute('officer-analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'officer-analytics' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setCurrentRoute('officer-audit-logs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                currentRoute === 'officer-audit-logs' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </button>
          </nav>
        )}

        {/* Multilingual Selector */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer appearance-none"
            >
              {languagesList.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
