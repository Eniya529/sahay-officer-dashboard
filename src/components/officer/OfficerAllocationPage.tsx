import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { computeOfficerSmartMatch } from '../../services/officerService';
import type { CaseData } from '../../types';

import {
  Users,
  UserCheck,
  CheckCircle2,
  Shield,
  ChevronRight,
  Filter,
  AlertCircle,
  MapPin,
  Languages,
  BriefcaseBusiness,
  Activity,
  ArrowRight,
  Search,
} from 'lucide-react';

export const OfficerAllocationPage: React.FC = () => {
  const {
    cases,
    officers,
    assignOfficerToCase,
    setSelectedCaseId,
    setCurrentRoute,
  } = useApp();

  const unassignedCases = cases.filter(
    (c) =>
      !c.assignedOfficer ||
      c.status === 'AWAITING_REVIEW' ||
      c.status === 'Pending' ||
      c.status === 'Requires Human Review'
  );

  const [selectedCaseForAlloc, setSelectedCaseForAlloc] =
    useState<CaseData>(
      unassignedCases[0] || cases[0]
    );

  const [searchTerm, setSearchTerm] = useState('');

  const {
    recommended,
    eligible,
  } = computeOfficerSmartMatch(
    selectedCaseForAlloc,
    officers
  );

  const filteredCases = unassignedCases.filter((c) => {
    const search = searchTerm.toLowerCase();

    return (
      c.id.toLowerCase().includes(search) ||
      c.summary?.toLowerCase().includes(search) ||
      c.location?.toLowerCase().includes(search) ||
      c.district?.toLowerCase().includes(search)
    );
  });

  const handleConfirmAssignment = (
    officerId: string,
    officerName: string
  ) => {
    assignOfficerToCase(
      selectedCaseForAlloc.id,
      officerId
    );

    window.alert(
      `Case ${selectedCaseForAlloc.id} assigned to ${officerName}`
    );
  };

  if (!selectedCaseForAlloc) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="command-card rounded-2xl p-10 text-center">
          <Users className="w-10 h-10 text-muted mx-auto mb-3" />

          <h2 className="text-lg font-black text-slate-900">
            No cases available for allocation
          </h2>

          <p className="text-xs text-muted mt-1">
            There are currently no unassigned or review-pending cases.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="command-card rounded-2xl p-5 sm:p-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <div className="flex items-center gap-2 mb-1">

              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>

              <div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Smart Officer Allocation
                </h1>

                <p className="text-xs text-muted mt-0.5">
                  Match cases with eligible officers using jurisdiction,
                  language, eligibility, availability and workload.
                </p>

              </div>

            </div>

          </div>

          <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">

            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-700 block">
              Awaiting allocation / review
            </span>

            <span className="text-xl font-black text-amber-800">
              {unassignedCases.length}
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section className="command-card rounded-2xl p-4">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <WorkflowStep
            number="01"
            title="Select Case"
            description="Choose a case requiring allocation."
            active
          />

          <WorkflowConnector />

          <WorkflowStep
            number="02"
            title="Smart Match"
            description="Review explainable officer matching."
            active
          />

          <WorkflowConnector />

          <WorkflowStep
            number="03"
            title="Officer Confirm"
            description="Authorized officer confirms assignment."
            active
          />

        </div>

      </section>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===================================================
            CASE QUEUE
        =================================================== */}

        <section className="lg:col-span-5 soft-card rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-line">

            <div className="flex items-center justify-between mb-3">

              <div>

                <div className="flex items-center gap-2">

                  <Filter className="w-4 h-4 text-teal-600" />

                  <h2 className="text-sm font-black text-slate-900">
                    Cases Requiring Allocation
                  </h2>

                </div>

                <p className="text-[10px] text-muted mt-1">
                  Select a case to generate its officer match.
                </p>

              </div>

              <span className="px-2 py-1 rounded-lg bg-slate-50 border border-line text-[9px] font-bold text-muted">
                {filteredCases.length} cases
              </span>

            </div>

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search case..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-line text-xs text-slate-900 placeholder:text-muted outline-none focus:border-teal-400"
              />

            </div>

          </div>

          <div className="p-4 space-y-2 max-h-[560px] overflow-y-auto">

            {filteredCases.length > 0 ? (

              filteredCases.map((c) => {

                const isSelected =
                  selectedCaseForAlloc.id === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      setSelectedCaseForAlloc(c)
                    }
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 shadow-sm'
                        : 'bg-white border-line hover:border-teal-200 hover:bg-slate-50'
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <span
                          className={`text-xs font-black font-mono ${
                            isSelected
                              ? 'text-teal-700'
                              : 'text-slate-900'
                          }`}
                        >
                          {c.id}
                        </span>

                        <p className="text-xs font-semibold text-slate-900 mt-1 line-clamp-2">
                          {c.summary}
                        </p>

                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 rounded-lg border text-[9px] font-black ${getPriorityClasses(
                          c.sviLevel
                        )}`}
                      >
                        {c.sviLevel}
                      </span>

                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-line">

                      <span className="flex items-center gap-1 text-[10px] text-muted">
                        <MapPin className="w-3 h-3" />
                        {c.location ||
                          c.district ||
                          'Location unavailable'}
                      </span>

                      <span className="flex items-center gap-1 text-[10px] text-muted">
                        SVI {c.sviScore}
                      </span>

                      <span
                        className={`ml-auto text-[9px] font-bold ${
                          c.assignedOfficer
                            ? 'text-sage-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {c.assignedOfficer
                          ? 'Assigned'
                          : 'Unassigned'}
                      </span>

                    </div>

                  </button>
                );
              })

            ) : (

              <div className="p-8 text-center">

                <Search className="w-7 h-7 text-line mx-auto mb-2" />

                <p className="text-xs font-bold text-slate-900">
                  No matching cases
                </p>

                <p className="text-[10px] text-muted mt-1">
                  Try a different case ID or location.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ===================================================
            MATCH WORKSPACE
        =================================================== */}

        <section className="lg:col-span-7 space-y-5">

          {/* SELECTED CASE */}

          <div className="command-card rounded-2xl p-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>

                <span className="text-[9px] uppercase tracking-wider font-bold text-muted">
                  Selected Case
                </span>

                <div className="flex flex-wrap items-center gap-2 mt-1">

                  <h2 className="text-lg font-black text-slate-900 font-mono">
                    {selectedCaseForAlloc.id}
                  </h2>

                  <span
                    className={`px-2 py-1 rounded-lg border text-[9px] font-black ${getPriorityClasses(
                      selectedCaseForAlloc.sviLevel
                    )}`}
                  >
                    {selectedCaseForAlloc.sviLevel}
                  </span>

                  <span className="text-xs font-bold text-muted">
                    SVI {selectedCaseForAlloc.sviScore}/100
                  </span>

                </div>

                <div className="flex flex-wrap gap-3 mt-2">

                  <span className="text-[10px] text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedCaseForAlloc.location ||
                      selectedCaseForAlloc.district ||
                      'Location unavailable'}
                  </span>

                  <span className="text-[10px] text-muted flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    {selectedCaseForAlloc.language}
                  </span>

                </div>

              </div>

              <button
                onClick={() => {
                  setSelectedCaseId(
                    selectedCaseForAlloc.id
                  );

                  setCurrentRoute(
                    'officer-case-detail'
                  );
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-line hover:border-teal-200 text-teal-700 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                Review Case
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

          {/* =================================================
              RECOMMENDED OFFICER
          ================================================= */}

          <div className="rounded-2xl bg-white border border-teal-200 shadow-sm overflow-hidden">

            <div className="p-5 bg-teal-50/60 border-b border-teal-200">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-white border border-teal-200 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-teal-600" />
                  </div>

                  <div>

                    <span className="text-[9px] uppercase tracking-wider font-black text-teal-700">
                      AI-assisted decision support
                    </span>

                    <h2 className="text-sm font-black text-slate-900">
                      Recommended Officer
                    </h2>

                  </div>

                </div>

                {recommended && (

                  <div className="px-3 py-1.5 rounded-xl bg-white border border-teal-200">

                    <span className="text-lg font-black text-teal-700">
                      {recommended.matchPercentage}%
                    </span>

                    <span className="text-[9px] font-bold text-muted ml-1">
                      MATCH
                    </span>

                  </div>

                )}

              </div>

            </div>

            {recommended ? (

              <div className="p-5 space-y-5">

                {/* OFFICER IDENTITY */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-black text-slate-900">
                      {recommended.name}
                    </h3>

                    <p className="text-xs text-muted mt-1">
                      {recommended.role}
                      {' · '}
                      {recommended.district}
                    </p>

                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-sage-700 text-[10px] font-black">
                    {recommended.availability}
                  </span>

                </div>

                {/* MATCH FACTORS */}

                <div>

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-[10px] uppercase tracking-wider font-black text-muted">
                      Match factors
                    </span>

                    <span className="text-[9px] text-muted">
                      Why this officer?
                    </span>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                    <MatchFactor
                      icon={
                        <MapPin className="w-3.5 h-3.5" />
                      }
                      label="Jurisdiction"
                      value={
                        recommended.district
                      }
                      matched={
                        recommended.jurisdictionMatch
                      }
                    />

                    <MatchFactor
                      icon={
                        <Languages className="w-3.5 h-3.5" />
                      }
                      label="Language"
                      value={
                        recommended.languages.join(
                          ', '
                        )
                      }
                      matched={
                        recommended.languageMatch
                      }
                    />

                    <MatchFactor
                      icon={
                        <Shield className="w-3.5 h-3.5" />
                      }
                      label="Eligibility"
                      value="Active Officer"
                      matched={
                        recommended.eligibilityMatch
                      }
                    />

                    <MatchFactor
                      icon={
                        <Activity className="w-3.5 h-3.5" />
                      }
                      label="Workload"
                      value={`${recommended.currentWorkload} active cases`}
                      matched={
                        recommended.currentWorkload <=
                        5
                      }
                    />

                  </div>

                </div>

                {/* OFFICER METRICS */}

                <div className="grid grid-cols-3 gap-2">

                  <Metric
                    label="Workload"
                    value={
                      recommended.currentWorkload
                    }
                  />

                  <Metric
                    label="Critical"
                    value={
                      recommended.criticalCasesCount
                    }
                  />

                  <Metric
                    label="Availability"
                    value={
                      recommended.availability ===
                      'Available'
                        ? 'Ready'
                        : 'Limited'
                    }
                  />

                </div>

                {/* ASSIGN */}

                <button
                  onClick={() =>
                    handleConfirmAssignment(
                      recommended.id,
                      recommended.name
                    )
                  }
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Assignment to{' '}
                  {recommended.name}
                </button>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-line">

                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />

                  <p className="text-[10px] text-muted leading-relaxed">
                    <strong className="text-slate-900">
                      Human confirmation required.
                    </strong>{' '}
                    The system recommends a match; the authorized
                    officer makes the final allocation decision.
                  </p>

                </div>

              </div>

            ) : (

              <div className="p-8 text-center">

                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />

                <p className="text-sm font-bold text-slate-900">
                  No recommended officer available
                </p>

                <p className="text-xs text-muted mt-1">
                  Review the eligible officer registry below.
                </p>

              </div>

            )}

          </div>

          {/* =================================================
              OTHER ELIGIBLE OFFICERS
          ================================================= */}

          <div className="command-card rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <div>

                <div className="flex items-center gap-2">

                  <Shield className="w-4 h-4 text-teal-600" />

                  <h2 className="text-sm font-black text-slate-900">
                    Other Eligible Officers
                  </h2>

                </div>

                <p className="text-[10px] text-muted mt-1">
                  Alternative officers available for human selection.
                </p>

              </div>

              <span className="px-2 py-1 rounded-lg bg-slate-50 border border-line text-[9px] font-bold text-muted">
                {eligible.length}
              </span>

            </div>

            <div className="space-y-2">

              {eligible.length > 0 ? (

                eligible.map((officer) => (

                  <div
                    key={officer.id}
                    className="p-4 rounded-xl bg-slate-50 border border-line hover:border-teal-200 transition"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <h3 className="text-xs font-black text-slate-900">
                            {officer.name}
                          </h3>

                          <span className="px-1.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-black">
                            {officer.matchPercentage}%
                          </span>

                        </div>

                        <p className="text-[10px] text-muted mt-1">
                          {officer.role}
                          {' · '}
                          {officer.district}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-2 text-[9px] text-muted">

                          <span className="flex items-center gap-1">
                            <Languages className="w-3 h-3" />
                            {officer.languages.join(', ')}
                          </span>

                          <span className="flex items-center gap-1">
                            <BriefcaseBusiness className="w-3 h-3" />
                            {officer.currentWorkload} active
                          </span>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          handleConfirmAssignment(
                            officer.id,
                            officer.name
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-white hover:bg-teal-600 border border-line hover:border-teal-600 text-teal-700 hover:text-white text-xs font-bold transition"
                      >
                        Assign
                      </button>

                    </div>

                  </div>

                ))

              ) : (

                <div className="p-5 text-center bg-slate-50 rounded-xl border border-line">

                  <p className="text-xs text-muted">
                    No alternative eligible officers found.
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

/* =========================================================
   WORKFLOW STEP
========================================================= */

const WorkflowStep: React.FC<{
  number: string;
  title: string;
  description: string;
  active?: boolean;
}> = ({
  number,
  title,
  description,
  active,
}) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-xl border ${
      active
        ? 'bg-teal-50 border-teal-200'
        : 'bg-slate-50 border-line'
    }`}
  >
    <span
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
        active
          ? 'bg-teal-600 text-white'
          : 'bg-white text-muted border border-line'
      }`}
    >
      {number}
    </span>

    <div>

      <p className="text-xs font-black text-slate-900">
        {title}
      </p>

      <p className="text-[9px] text-muted mt-0.5">
        {description}
      </p>

    </div>

  </div>
);

/* =========================================================
   WORKFLOW CONNECTOR
========================================================= */

const WorkflowConnector: React.FC = () => (
  <div className="hidden sm:flex items-center justify-center">
    <ChevronRight className="w-4 h-4 text-line" />
  </div>
);

/* =========================================================
   MATCH FACTOR
========================================================= */

const MatchFactor: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  matched?: boolean;
}> = ({
  icon,
  label,
  value,
  matched,
}) => (
  <div className="p-3 rounded-xl bg-slate-50 border border-line">

    <div className="flex items-center gap-2">

      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          matched
            ? 'bg-teal-50 text-teal-600'
            : 'bg-white text-muted'
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <span className="text-[9px] uppercase tracking-wider font-bold text-muted block">
          {label}
        </span>

        <span
          className={`text-[10px] font-bold ${
            matched
              ? 'text-teal-700'
              : 'text-slate-900'
          }`}
        >
          {value}
        </span>

      </div>

    </div>

  </div>
);

/* =========================================================
   METRIC
========================================================= */

const Metric: React.FC<{
  label: string;
  value: string | number;
}> = ({
  label,
  value,
}) => (
  <div className="p-3 rounded-xl bg-slate-50 border border-line text-center">

    <span className="text-[9px] uppercase font-bold text-muted block">
      {label}
    </span>

    <span className="text-sm font-black text-slate-900 mt-1 block">
      {value}
    </span>

  </div>
);

/* =========================================================
   PRIORITY COLORS
========================================================= */

const getPriorityClasses = (level: string) => {
  switch (String(level).toUpperCase()) {
    case 'CRITICAL':
      return 'severity-critical';
    case 'HIGH':
      return 'severity-high';
    case 'MODERATE':
      return 'severity-moderate';
    case 'LOW':
      return 'severity-low';
    default:
      return 'status-neutral';
  }
};;