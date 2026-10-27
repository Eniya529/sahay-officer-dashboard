import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { SVILevel } from '../../types';
import {
  FileText,
  Search,
  ChevronRight,
  UserCheck,
  ArrowUpDown,
  MapPin,
  Loader2,
} from 'lucide-react';

export const CaseManagementPage: React.FC<{
  onSelectCase?: (caseId: string) => void;
}> = ({ onSelectCase }) => {
  const {
    cases,
    setSelectedCaseId,
    setCurrentRoute,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] =
    useState<string>('ALL');
  const [statusFilter, setStatusFilter] =
    useState<string>('ALL');
  const [officerFilter, setOfficerFilter] =
    useState<string>('ALL');
  const [sortBy, setSortBy] =
    useState<'svi' | 'updated'>('svi');

  const handleCaseClick = (caseId: string) => {
    console.log(
      '[SAHAY] Opening Firebase case:',
      caseId
    );

    setSelectedCaseId(caseId);

    if (onSelectCase) {
      onSelectCase(caseId);
    }

    setCurrentRoute(
      'officer-case-detail'
    );
  };

  const filteredCases = useMemo(() => {
    const search =
      searchQuery.trim().toLowerCase();

    return cases.filter((c) => {
      const caseId =
        String(c.id || '').toLowerCase();

      const complainantName =
        String(
          c.complainantName || ''
        ).toLowerCase();

      const summary =
        String(
          c.summary || ''
        ).toLowerCase();

      const location =
        String(
          c.location ||
            c.district ||
            ''
        ).toLowerCase();

      const matchesSearch =
        !search ||
        caseId.includes(search) ||
        complainantName.includes(search) ||
        summary.includes(search) ||
        location.includes(search);

      const matchesPriority =
        priorityFilter === 'ALL' ||
        c.sviLevel === priorityFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        String(c.status || '')
          .toUpperCase() ===
          statusFilter.toUpperCase();

      const matchesOfficer =
        officerFilter === 'ALL'
          ? true
          : officerFilter === 'UNASSIGNED'
          ? !c.assignedOfficer
          : c.assignedOfficer ===
            officerFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus &&
        matchesOfficer
      );
    });
  }, [
    cases,
    searchQuery,
    priorityFilter,
    statusFilter,
    officerFilter,
  ]);

  const sortedCases = useMemo(() => {
    return [...filteredCases].sort(
      (a, b) => {
        if (sortBy === 'svi') {
          return (
            Number(b.sviScore || 0) -
            Number(a.sviScore || 0)
          );
        }

        const dateB = String(
          b.lastUpdate || ''
        );

        const dateA = String(
          a.lastUpdate || ''
        );

        return dateB.localeCompare(
          dateA
        );
      }
    );
  }, [filteredCases, sortBy]);

  const getPriorityBadgeClass = (level: SVILevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'severity-critical font-black';
      case 'HIGH':
        return 'severity-high font-black';
      case 'MODERATE':
        return 'severity-moderate font-bold';
      case 'LOW':
        return 'severity-low font-bold';
      default:
        return 'status-neutral';
    }
  };

  const getStatusClass = (status: string) => {
    const value = String(status || '').toUpperCase();
    if (value.includes('ESCALAT')) return 'status-escalated';
    if (value.includes('FOLLOW')) return 'status-followup';
    if (value.includes('PENDING') || value.includes('AWAITING') || value.includes('REVIEW')) return 'status-review';
    if (value.includes('ASSIGNED') || value.includes('PROGRESS')) return 'status-progress';
    if (value.includes('RESOLVED') || value.includes('CLOSED')) return 'status-completed';
    return 'status-neutral';
  };

  const uniqueOfficers = useMemo(() => {
    return Array.from(
      new Set(
        cases
          .map(
            (c) =>
              c.assignedOfficer
          )
          .filter(
            (
              officer
            ): officer is string =>
              Boolean(officer)
          )
      )
    );
  }, [cases]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">

      {/* TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Case Management Workspace
          </h2>

          <p className="text-xs text-muted">
            Search, filter, and review victim response cases across priority levels and operational statuses.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-white border border-line text-xs font-semibold text-slate-900/80">
            Total Cases:{' '}
            <strong className="text-teal-700 font-mono">
              {cases.length}
            </strong>
          </span>
        </div>

      </div>


      {/* FILTER BAR */}
      <div className="soft-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">

        {/* SEARCH */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            placeholder="Search Case ID, location, complainant..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-line text-xs text-slate-900 placeholder-muted focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* PRIORITY */}
        <div className="flex items-center space-x-1.5">
          <span className="text-muted font-semibold text-[11px]">
            Priority:
          </span>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="px-2.5 py-1.5 rounded-xl bg-white border border-line text-xs text-slate-900/80 cursor-pointer focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MODERATE">MODERATE</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        {/* STATUS */}
        <div className="flex items-center space-x-1.5">
          <span className="text-muted font-semibold text-[11px]">
            Status:
          </span>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="px-2.5 py-1.5 rounded-xl bg-white border border-line text-xs text-slate-900/80 cursor-pointer focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="NEW">NEW</option>
            <option value="AWAITING_REVIEW">AWAITING_REVIEW</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FOLLOW_UP">FOLLOW_UP</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        {/* OFFICER */}
        <div className="flex items-center space-x-1.5">
          <span className="text-muted font-semibold text-[11px]">
            Officer:
          </span>

          <select
            value={officerFilter}
            onChange={(e) =>
              setOfficerFilter(
                e.target.value
              )
            }
            className="px-2.5 py-1.5 rounded-xl bg-white border border-line text-xs text-slate-900/80 cursor-pointer focus:outline-none"
          >
            <option value="ALL">All Officers</option>
            <option value="UNASSIGNED">Unassigned Only</option>

            {uniqueOfficers.map(
              (officer) => (
                <option
                  key={officer}
                  value={officer}
                >
                  {officer}
                </option>
              )
            )}
          </select>
        </div>

        {/* SORT */}
        <button
          onClick={() =>
            setSortBy(
              (previous) =>
                previous === 'svi'
                  ? 'updated'
                  : 'svi'
            )
          }
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-line text-slate-900/70 font-semibold hover:text-slate-900 transition"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-teal-600" />
          <span>
            Sort by:{' '}
            {sortBy === 'svi'
              ? 'SVI Vulnerability'
              : 'Last Updated'}
          </span>
        </button>

      </div>


      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((level) => {
          const count = cases.filter((c) => c.sviLevel === level).length;
          return (
            <button
              key={level}
              onClick={() => setPriorityFilter(level)}
              className={`rounded-xl border px-3 py-2 text-left transition hover:-translate-y-0.5 ${getPriorityBadgeClass(level)}`}
            >
              <span className="block text-[9px] font-black uppercase tracking-wider opacity-80">{level}</span>
              <span className="block text-xl font-black font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      {/* CASE TABLE */}
      <div className="command-card rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          {cases.length === 0 ? (

            <div className="p-12 flex flex-col items-center justify-center text-muted">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-3" />
              <p>Loading cases from Firebase...</p>
              <p className="text-[11px] text-muted/70 mt-1">
                Waiting for the real-time case queue.
              </p>
            </div>

          ) : (

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 text-muted uppercase font-mono border-b border-line">
                <tr>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">SVI</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Language</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Assigned Officer</th>
                  <th className="p-3.5">Last Updated</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line">

                {sortedCases.length === 0 ? (

                  <tr>
                    <td
                      colSpan={9}
                      className="p-8 text-center text-muted italic"
                    >
                      No cases match the selected filters.
                    </td>
                  </tr>

                ) : (

                  sortedCases.map(
                    (c) => (

                      <tr
                        key={c.id}
                        onClick={() =>
                          handleCaseClick(
                            c.id
                          )
                        }
                        className="hover:bg-slate-50 transition cursor-pointer group"
                      >

                        <td className="p-3.5 font-bold text-teal-700 font-mono tracking-wider">
                          {c.id}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded border text-[10px] uppercase ${getPriorityBadgeClass(
                              c.sviLevel
                            )}`}
                          >
                            {c.sviLevel}
                          </span>
                        </td>

                        <td className={`p-3.5 font-mono font-black text-sm ${
                          c.sviLevel === 'CRITICAL'
                            ? 'text-red-700'
                            : c.sviLevel === 'HIGH'
                            ? 'text-orange-700'
                            : c.sviLevel === 'MODERATE'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}>
                          {c.sviScore ?? 0}
                        </td>

                        <td className="p-3.5 text-slate-900/80 font-medium">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-muted shrink-0" />
                            <span>
                              {c.location ||
                                c.district ||
                                'Not available'}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-muted text-[11px]">
                          {c.language || 'English'}
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-lg border font-semibold text-[10px] uppercase tracking-wide ${getStatusClass(String(c.status || 'NEW'))}`}>
                            {String(c.status || 'NEW').replaceAll('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-900/80 font-medium">
                          {c.assignedOfficer ? (
                            <span className="flex items-center space-x-1 text-slate-900/80">
                              <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span>{c.assignedOfficer}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 italic font-normal text-[11px]">
                              Unassigned
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-muted text-[11px]">
                          {c.lastUpdate || 'Just now'}
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCaseClick(c.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-300 transition text-xs font-bold inline-flex items-center space-x-1"
                          >
                            <span>Review Case</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
};