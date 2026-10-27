import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  AlertOctagon,
  AlertTriangle,
  Clock,
  ChevronRight,
  Radio,
  MapPin,
  CheckCircle2,
  Search,
  Brain,
  UserCheck,
  Activity,
  Eye,
  ArrowRight,
} from 'lucide-react';

/**
 * OfficerDashboard
 *
 * Important data rule:
 * - confidence is normalized safely whether the backend stores 0.72 or 72.
 * - the dashboard does NOT invent or force CRITICAL/SVI values.
 * - riskLevel/SVI shown here are the values supplied by the assessment layer.
 * - therefore this page will not turn a normal "I need help" message into CRITICAL.
 *   If such a case is still CRITICAL after this replacement, the source is
 *   AppContext/Firebase/mock case data and must be corrected there.
 */

export const OfficerDashboard: React.FC<{
  onSelectCase?: (caseId: string) => void;
}> = ({ onSelectCase }) => {
  const {
    cases,
    setSelectedCaseId,
    setCurrentRoute,
  } = useApp();

  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  /* ------------------------------------------------------------
     SAFE HELPERS
  ------------------------------------------------------------ */

  const toNumber = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  };

  /**
   * Handles both:
   *   0.72 -> 72%
   *   72   -> 72%
   *
   * Prevents:
   *   33 -> 3300%
   *   26 -> 2600%
   */
  const formatConfidence = (value: unknown): string => {
    const number = toNumber(value);

    if (number === null) {
      return 'Not available';
    }

    const percentage = number <= 1
      ? number * 100
      : number;

    return `${Math.round(Math.max(0, Math.min(100, percentage)))}%`;
  };

  const confidencePercent = (value: unknown): number | null => {
    const number = toNumber(value);

    if (number === null) {
      return null;
    }

    const percentage = number <= 1
      ? number * 100
      : number;

    return Math.round(Math.max(0, Math.min(100, percentage)));
  };

  const getSafeText = (value: unknown, fallback: string) => {
    return typeof value === 'string' && value.trim()
      ? value
      : fallback;
  };

  /* ------------------------------------------------------------
     COUNTS
  ------------------------------------------------------------ */

  const activeCount = cases.filter(
    (c) =>
      c.status !== 'CLOSED' &&
      c.status !== 'RESOLVED'
  ).length;

  const criticalCount = cases.filter(
    (c) => c.sviLevel === 'CRITICAL'
  ).length;

  const highCount = cases.filter(
    (c) => c.sviLevel === 'HIGH'
  ).length;

  const awaitingReviewCount = cases.filter(
    (c) =>
      c.status === 'AWAITING_REVIEW' ||
      c.status === 'Pending' ||
      c.status === 'Requires Human Review' ||
      c.requiresHumanReview === true
  ).length;

  const followupsCount = cases.reduce(
    (total, c) =>
      total +
      (Array.isArray(c.followUpHistory)
        ? c.followUpHistory.filter(
            (followUp) =>
              followUp.status === 'Pending' ||
              followUp.status === 'Overdue'
          ).length
        : 0),
    0
  );

  /* ------------------------------------------------------------
     ATTENTION QUEUE
  ------------------------------------------------------------ */

  const attentionCases = useMemo(() => {
    return cases
      .filter((c) => {
        const matchesPriority =
          filterPriority === 'ALL' ||
          c.sviLevel === filterPriority;

        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          String(c.id ?? '').toLowerCase().includes(query) ||
          c.summary?.toLowerCase().includes(query) ||
          c.location?.toLowerCase().includes(query) ||
          c.district?.toLowerCase().includes(query);

        const requiresAttention =
          c.sviLevel === 'CRITICAL' ||
          c.sviLevel === 'HIGH' ||
          c.requiresHumanReview === true ||
          c.status === 'AWAITING_REVIEW' ||
          c.status === 'Pending' ||
          c.status === 'Requires Human Review';

        return (
          matchesPriority &&
          matchesSearch &&
          requiresAttention
        );
      })
      .sort((a, b) => {
        const rank: Record<string, number> = {
          CRITICAL: 4,
          HIGH: 3,
          MODERATE: 2,
          LOW: 1,
        };

        return (
          (rank[b.sviLevel] || 0) -
          (rank[a.sviLevel] || 0)
        );
      });
  }, [cases, filterPriority, search]);

  /* ------------------------------------------------------------
     OPEN CASE
  ------------------------------------------------------------ */

  const handleReviewCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId);

    if (onSelectCase) {
      onSelectCase(caseId);
    }

    setCurrentRoute('officer-case-detail');
  };

  /* ------------------------------------------------------------
     SEVERITY
  ------------------------------------------------------------ */

  const severityClasses = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200',
          text: 'text-red-700',
          dot: 'bg-red-500',
          border: 'border-red-200',
        };

      case 'HIGH':
        return {
          badge: 'bg-orange-50 text-orange-700 border-orange-200',
          text: 'text-orange-700',
          dot: 'bg-orange-500',
          border: 'border-orange-200',
        };

      case 'MODERATE':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          text: 'text-amber-700',
          dot: 'bg-amber-500',
          border: 'border-amber-200',
        };

      default:
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          text: 'text-emerald-700',
          dot: 'bg-emerald-500',
          border: 'border-emerald-200',
        };
    }
  };

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-7 animate-fadeIn">

      {/* HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-700" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  SAHAY
                </h1>

                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-black uppercase tracking-wider">
                  AI-Assisted Response Command Centre
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Monitor cases, review AI assessments and take
                human-led response decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>

            <div>
              <p className="text-[9px] uppercase font-black text-slate-400">
                Response Desk
              </p>
              <p className="text-xs font-bold text-slate-800">
                Available
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentRoute('officer-cases')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Open Cases
          </button>
        </div>
      </section>

      {/* RESPONSE PULSE */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Response Pulse
              </h2>
            </div>

            <p className="text-[10px] text-slate-400 mt-1">
              Live case queue and response workload
            </p>
          </div>

          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-teal-500" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[9px] uppercase font-black text-slate-400">
              Active Cases
            </p>
            <p className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {activeCount}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Currently active
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase font-black text-red-600">
                Critical
              </p>
              <AlertOctagon className="w-4 h-4 text-red-600" />
            </div>

            <p className="text-3xl font-black text-red-700 mt-2 font-mono">
              {criticalCount}
            </p>

            <p className="text-[10px] text-red-600/70 mt-1">
              Immediate attention
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase font-black text-orange-600">
                High Priority
              </p>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>

            <p className="text-3xl font-black text-orange-700 mt-2 font-mono">
              {highCount}
            </p>

            <p className="text-[10px] text-orange-600/70 mt-1">
              Requires review
            </p>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase font-black text-teal-700">
                Awaiting Review
              </p>
              <Brain className="w-4 h-4 text-teal-700" />
            </div>

            <p className="text-3xl font-black text-teal-800 mt-2 font-mono">
              {awaitingReviewCount}
            </p>

            <p className="text-[10px] text-teal-700/70 mt-1">
              Human decision needed
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase font-black text-emerald-700">
                Follow-ups
              </p>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>

            <p className="text-3xl font-black text-emerald-800 mt-2 font-mono">
              {followupsCount}
            </p>

            <p className="text-[10px] text-emerald-700/70 mt-1">
              Pending check-ins
            </p>
          </div>
        </div>
      </section>

      {/* AI OVERVIEW */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-teal-700" />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900">
                SAHAY AI Assessment Overview
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                AI identifies vulnerability indicators and
                recommends response actions. Final decisions
                remain with the authorized officer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-bold">
              AI Assessment
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold">
              Human Review
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            <span className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              Action
            </span>
          </div>
        </div>
      </section>

      {/* NEEDS YOUR ATTENTION */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-black text-slate-900">
                Needs Your Attention
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Cases requiring review, decision or immediate response.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case..."
                className="w-full sm:w-52 pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex items-center p-1 rounded-xl bg-white border border-slate-200">
              {['ALL', 'CRITICAL', 'HIGH'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterPriority(level)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition ${
                    filterPriority === level
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {attentionCases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto mb-3" />

            <h3 className="text-sm font-black text-slate-900">
              No cases require immediate attention
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              The current response queue is clear.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {attentionCases.slice(0, 8).map((c) => {
              const severity = severityClasses(
                getSafeText(c.sviLevel, 'LOW')
              );

              const confidence = confidencePercent(c.confidence);

              return (
                <article
                  key={c.id}
                  onClick={() => handleReviewCaseClick(c.id)}
                  className={`bg-white border ${severity.border} rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer`}
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${severity.dot}`}
                        />

                        <span className="font-mono text-sm font-black text-slate-900">
                          {c.id}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-md border text-[9px] font-black ${severity.badge}`}
                        >
                          {getSafeText(c.sviLevel, 'LOW')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        {c.category || 'Case assessment'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] uppercase font-black text-slate-400">
                        SVI
                      </p>

                      <p
                        className={`text-2xl font-black font-mono ${severity.text}`}
                      >
                        {c.sviScore ?? '—'}
                      </p>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                      {c.summary || 'Case requires officer review.'}
                    </h3>
                  </div>

                  {/* EVIDENCE */}
                  {Array.isArray(c.keyEvidence) &&
                    c.keyEvidence.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-3.5 h-3.5 text-amber-600" />

                          <span className="text-[9px] uppercase font-black text-amber-700">
                            Key Evidence Identified
                          </span>
                        </div>

                        <p className="text-xs text-amber-900 leading-relaxed">
                          "{c.keyEvidence[0]}"
                        </p>
                      </div>
                    )}

                  {/* AI INFO */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[8px] uppercase font-black text-slate-400">
                        AI Confidence
                      </p>

                      <p className="text-xs font-black text-slate-800 mt-1">
                        {confidence === null
                          ? 'Not available'
                          : `${confidence}%`}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[8px] uppercase font-black text-slate-400">
                        Risk Trend
                      </p>

                      <p
                        className={`text-xs font-black mt-1 ${
                          c.riskTrend === 'RISING'
                            ? 'text-red-600'
                            : c.riskTrend === 'FALLING'
                            ? 'text-emerald-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {c.riskTrend || 'STABLE'}
                      </p>
                    </div>
                  </div>

                  {/* META */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />

                      <span>
                        {c.location ||
                          c.district ||
                          c.state ||
                          'Location unavailable'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock className="w-3.5 h-3.5" />

                      <span>
                        {c.lastUpdate || 'Recently updated'}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      {c.assignedOfficer ? (
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {c.assignedOfficer}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-orange-600">
                          Unassigned
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewCaseClick(c.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black text-white flex items-center gap-1.5 transition ${
                        c.sviLevel === 'CRITICAL'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      Review Case
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* QUEUE SUMMARY */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">

        <button
          onClick={() => setCurrentRoute('officer-cases')}
          className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-teal-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-black text-slate-400">
                Case Workspace
              </p>

              <p className="text-sm font-black text-slate-900 mt-1">
                View all cases
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </div>
        </button>

        <button
          onClick={() => setCurrentRoute('officer-allocation')}
          className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-teal-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-black text-slate-400">
                Officer Allocation
              </p>

              <p className="text-sm font-black text-slate-900 mt-1">
                Manage case assignments
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </div>
        </button>

        <button
          onClick={() => setCurrentRoute('officer-followups')}
          className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-teal-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-black text-slate-400">
                Follow-up Management
              </p>

              <p className="text-sm font-black text-slate-900 mt-1">
                Track welfare check-ins
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </div>
        </button>

      </section>
    </div>
  );
};
