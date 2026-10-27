import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  RotateCcw,
  UserRound,
  X,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import {
  updateFollowupStatus,
  saveFollowup,
} from '../../services/followupService';
import type { CaseFollowUp } from '../../types';

type FollowUpTab = 'DUE_TODAY' | 'UPCOMING' | 'COMPLETED' | 'OVERDUE';

interface FollowUpRow {
  id: string;
  caseId: string;
  level: string;
  svi: string;
  date: Date | null;
  status: string;
  followUpType: string;
  officerName: string;
  notes: string;
  _raw: any;
}

interface ScheduleForm {
  caseId: string;
  date: string;
  followUpType: string;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeStatus = (value: unknown): string => {
  return String(value ?? '')
    .trim()
    .toLowerCase();
};

const normalizeLevel = (value: unknown): string => {
  return String(value ?? 'LOW')
    .trim()
    .toUpperCase();
};

const isCompletedStatus = (status: unknown): boolean => {
  const normalized = normalizeStatus(status);

  return [
    'completed',
    'complete',
    'closed',
    'done',
    'resolved',
  ].includes(normalized);
};

const isExplicitlyOverdue = (status: unknown): boolean => {
  const normalized = normalizeStatus(status);

  return [
    'overdue',
    'missed',
    'expired',
    'pending overdue',
  ].includes(normalized);
};

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const formatDate = (date: Date | null): string => {
  if (!date) return 'Not scheduled';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const toDate = (value: any): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (
    typeof value === 'object' &&
    typeof value.toDate === 'function'
  ) {
    const date = value.toDate();

    return date instanceof Date && !Number.isNaN(date.getTime())
      ? date
      : null;
  }

  if (
    typeof value === 'object' &&
    typeof value.seconds === 'number'
  ) {
    const date = new Date(value.seconds * 1000);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'number') {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const getCaseId = (caseItem: any): string => {
  return String(
    caseItem?.caseId ??
      caseItem?.id ??
      caseItem?.case_id ??
      'UNKNOWN'
  );
};

const getCaseLevel = (caseItem: any): string => {
  return normalizeLevel(
    caseItem?.priorityLevel ??
      caseItem?.priority ??
      caseItem?.riskLevel ??
      caseItem?.level ??
      'LOW'
  );
};

const getCaseSVI = (caseItem: any): string => {
  return String(
    caseItem?.sviLevel ??
      caseItem?.svi ??
      caseItem?.SVI ??
      caseItem?.riskScore ??
      '—'
  );
};

const getOfficerName = (
  followUp: any,
  caseItem: any
): string => {
  return String(
    followUp?.officerName ??
      followUp?.assignedOfficerName ??
      caseItem?.assignedOfficerName ??
      caseItem?.assignedOfficer ??
      'Unassigned'
  );
};

const getFollowUpDate = (followUp: any): Date | null => {
  return toDate(
    followUp?.date ??
      followUp?.dueDate ??
      followUp?.scheduledDate ??
      followUp?.followUpDate ??
      followUp?.nextFollowUpDate
  );
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const FollowUpsView: React.FC = () => {
  const {
    cases,
    setSelectedCaseId,
    setCurrentRoute,
  } = useApp();

  const [activeTab, setActiveTab] =
    useState<FollowUpTab>('DUE_TODAY');

  const [isScheduling, setIsScheduling] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [localOverrides, setLocalOverrides] =
    useState<Record<string, Partial<FollowUpRow>>>({});

  const [scheduleForm, setScheduleForm] =
    useState<ScheduleForm>({
      caseId: '',
      date: '',
      followUpType: 'Welfare Check',
      notes: '',
    });

  /* ------------------------------------------------------------------------ */
  /* Build follow-up rows                                                     */
  /* ------------------------------------------------------------------------ */

  const followUps = useMemo<FollowUpRow[]>(() => {
    const rows: FollowUpRow[] = [];

    (cases ?? []).forEach((caseItem: any) => {
      const history =
        Array.isArray(caseItem?.followUpHistory)
          ? caseItem.followUpHistory
          : [];

      history.forEach(
        (followUp: any, index: number) => {
          const id = String(
            followUp?.id ??
              followUp?.followUpId ??
              `fu-${getCaseId(caseItem)}-${index}`
          );

          const baseRow: FollowUpRow = {
            id,
            caseId: getCaseId(caseItem),
            level: getCaseLevel(caseItem),
            svi: getCaseSVI(caseItem),
            date: getFollowUpDate(followUp),
            status: String(
              followUp?.status ?? 'Scheduled'
            ),
            followUpType: String(
              followUp?.followUpType ??
                followUp?.type ??
                followUp?.purpose ??
                'Welfare Check'
            ),
            officerName: getOfficerName(
              followUp,
              caseItem
            ),
            notes: String(
              followUp?.notes ??
                followUp?.remarks ??
                ''
            ),
            _raw: {
              ...followUp,
              caseId: getCaseId(caseItem),
            },
          };

          rows.push({
            ...baseRow,
            ...localOverrides[id],
          });
        }
      );
    });

    return rows;
  }, [cases, localOverrides]);

  /* ------------------------------------------------------------------------ */
  /* Date/status filtering                                                    */
  /* ------------------------------------------------------------------------ */

  const today = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const dueToday = useMemo(() => {
    return followUps.filter((item) => {
      if (isCompletedStatus(item.status)) return false;
      if (isExplicitlyOverdue(item.status)) return false;
      if (!item.date) return false;

      const date = startOfDay(item.date);

      return date.getTime() === today.getTime();
    });
  }, [followUps, today]);

  const upcoming = useMemo(() => {
    return followUps.filter((item) => {
      if (isCompletedStatus(item.status)) return false;
      if (isExplicitlyOverdue(item.status)) return false;

      if (!item.date) return true;

      return item.date.getTime() > todayEnd.getTime();
    });
  }, [followUps, todayEnd]);

  const completed = useMemo(() => {
    return followUps.filter((item) =>
      isCompletedStatus(item.status)
    );
  }, [followUps]);

  const overdue = useMemo(() => {
    return followUps.filter((item) => {
      if (isCompletedStatus(item.status)) return false;

      if (isExplicitlyOverdue(item.status)) {
        return true;
      }

      if (!item.date) return false;

      return startOfDay(item.date).getTime() <
        today.getTime();
    });
  }, [followUps, today]);

  const visibleRows = useMemo(() => {
    switch (activeTab) {
      case 'UPCOMING':
        return upcoming;

      case 'COMPLETED':
        return completed;

      case 'OVERDUE':
        return overdue;

      case 'DUE_TODAY':
      default:
        return dueToday;
    }
  }, [
    activeTab,
    dueToday,
    upcoming,
    completed,
    overdue,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Refresh                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Complete follow-up                                                      */
  /* ------------------------------------------------------------------------ */

  const handleComplete = async (
    followUp: FollowUpRow
  ) => {
    try {
      await updateFollowupStatus(
        followUp.id,
        'Completed',
        'Officer completed check-in.'
      );

      setLocalOverrides((previous) => ({
        ...previous,
        [followUp.id]: {
          ...previous[followUp.id],
          status: 'Completed',
        },
      }));
    } catch (error) {
      console.error(
        'Failed to complete follow-up:',
        error
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Reschedule                                                               */
  /* ------------------------------------------------------------------------ */

  const handleReschedule = async (
    followUp: FollowUpRow
  ) => {
    try {
      const currentDate =
        followUp.date ?? new Date();

      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 2);

      const newDateString =
        `${newDate.getFullYear()}-${String(
          newDate.getMonth() + 1
        ).padStart(2, '0')}-${String(
          newDate.getDate()
        ).padStart(2, '0')}`;

      const updatedFollowUp = {
        ...followUp._raw,
        id: followUp.id,
        caseId: followUp.caseId,
        date: newDateString,
        dueDate: newDateString,
        status: 'Scheduled',
      } as CaseFollowUp;

      await saveFollowup(updatedFollowUp);

      setLocalOverrides((previous) => ({
        ...previous,
        [followUp.id]: {
          ...previous[followUp.id],
          date: newDate,
          status: 'Scheduled',
        },
      }));
    } catch (error) {
      console.error(
        'Failed to reschedule follow-up:',
        error
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Schedule new follow-up                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSchedule = async () => {
    if (!scheduleForm.caseId) return;

    try {
      const targetCase = (cases ?? []).find(
        (caseItem: any) =>
          getCaseId(caseItem) === scheduleForm.caseId
      );

      if (!targetCase) return;

      const dateString = scheduleForm.date ||
        new Date().toISOString().slice(0, 10);

      const followUp = {
        id: `fu-${Date.now()}`,
        caseId: scheduleForm.caseId,
        day: (targetCase.followUpHistory?.length ?? 0) + 1,
        date: dateString,
        dueDate: dateString,
        svi: Number(targetCase.sviScore ?? 0),
        level: normalizeLevel(targetCase.sviLevel),
        notes: scheduleForm.notes,
        status: 'Scheduled',
        followUpType: scheduleForm.followUpType,
        officerName: targetCase.assignedOfficer ?? 'Unassigned',
      } as CaseFollowUp;

      await saveFollowup(followUp);

      setIsScheduling(false);

      setScheduleForm({
        caseId: '',
        date: '',
        followUpType: 'Welfare Check',
        notes: '',
      });
    } catch (error) {
      console.error(
        'Failed to schedule follow-up:',
        error
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const openCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentRoute('officer-case-detail');
  };

  /* ------------------------------------------------------------------------ */
  /* Styling helpers                                                          */
  /* ------------------------------------------------------------------------ */

  const priorityClasses = (level: string) => {
    switch (normalizeLevel(level)) {
      case 'CRITICAL':
        return 'severity-critical';
      case 'HIGH':
        return 'severity-high';
      case 'MODERATE':
        return 'severity-moderate';
      case 'LOW':
      default:
        return 'severity-low';
    }
  };

  const statusClasses = (status: string) => {
    const normalized = normalizeStatus(status);
    if (isCompletedStatus(status)) return 'status-completed';
    if (normalized === 'overdue' || normalized === 'missed') return 'status-overdue';
    if (normalized === 'pending') return 'status-pending';
    return 'status-review';
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-5">

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-teal-600" />

            Follow-Up & Welfare Management
          </h1>

          <p className="text-sm text-muted mt-1">
            Manage victim welfare check-ins, safety
            verifications and SVI recovery follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-line text-slate-900/70 hover:bg-slate-50 transition"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />

            Refresh
          </button>

          <button
            onClick={() => setIsScheduling(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />

            Schedule Follow-up
          </button>

        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="soft-card rounded-2xl p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Total Follow-Ups
              </p>

              <p className="text-3xl font-black text-slate-900 mt-2">
                {followUps.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-900/60" />
            </div>

          </div>
        </div>

        <div className="soft-card rounded-2xl p-5 border-amber-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Due Today
              </p>

              <p className="text-3xl font-black text-amber-700 mt-2">
                {dueToday.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>

          </div>
        </div>

        <div className="soft-card rounded-2xl p-5 border-teal-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Upcoming
              </p>

              <p className="text-3xl font-black text-teal-700 mt-2">
                {upcoming.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>

          </div>
        </div>

        <div className="soft-card rounded-2xl p-5 border-emergency-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emergency-700">
                Overdue
              </p>

              <p className="text-3xl font-black text-emergency-700 mt-2">
                {overdue.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emergency-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emergency-600" />
            </div>

          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="soft-card rounded-2xl p-2 flex flex-wrap gap-2">

        <button
          onClick={() => setActiveTab('DUE_TODAY')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'DUE_TODAY'
              ? 'bg-amber-100 text-amber-800'
              : 'text-muted hover:bg-slate-50'
          }`}
        >
          Due Today
          <span className="ml-2 text-xs">
            {dueToday.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'UPCOMING'
              ? 'bg-teal-100 text-teal-800'
              : 'text-muted hover:bg-slate-50'
          }`}
        >
          Upcoming
          <span className="ml-2 text-xs">
            {upcoming.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'COMPLETED'
              ? 'bg-sage-100 text-sage-800'
              : 'text-muted hover:bg-slate-50'
          }`}
        >
          Completed
          <span className="ml-2 text-xs">
            {completed.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('OVERDUE')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'OVERDUE'
              ? 'bg-emergency-100 text-emergency-800'
              : 'text-muted hover:bg-slate-50'
          }`}
        >
          Overdue
          <span className="ml-2 text-xs">
            {overdue.length}
          </span>
        </button>

      </div>

      {/* Table */}
      <div className="soft-card rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 border-b border-line">

              <tr className="text-left">

                <th className="px-5 py-4 font-bold text-muted">
                  Case ID
                </th>

                <th className="px-5 py-4 font-bold text-muted">
                  Priority Level
                </th>

                <th className="px-5 py-4 font-bold text-muted">
                  Assigned Officer
                </th>

                <th className="px-5 py-4 font-bold text-muted">
                  Due Date
                </th>

                <th className="px-5 py-4 font-bold text-muted">
                  Follow-Up Type
                </th>

                <th className="px-5 py-4 font-bold text-muted">
                  Status
                </th>

                <th className="px-5 py-4 font-bold text-muted text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-line">

              {visibleRows.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-14 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <Calendar className="w-10 h-10 text-muted/40 mb-3" />

                      <p className="font-bold text-slate-900">
                        No follow-ups found
                      </p>

                      <p className="text-xs text-muted mt-1">
                        There are no follow-ups in this
                        category.
                      </p>

                    </div>
                  </td>
                </tr>

              ) : (

                visibleRows.map((followUp) => (

                  <tr
                    key={followUp.id}
                    className="hover:bg-slate-50/60 transition"
                  >

                    <td className="px-5 py-4">

                      <button
                        onClick={() =>
                          openCase(followUp.caseId)
                        }
                        className="font-bold text-teal-700 hover:text-teal-800 hover:underline"
                      >
                        {followUp.caseId}
                      </button>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${priorityClasses(
                          followUp.level
                        )}`}
                      >
                        {normalizeLevel(
                          followUp.level
                        )}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                          <UserRound className="w-4 h-4 text-teal-600" />
                        </div>

                        <span className="text-slate-900 font-medium">
                          {followUp.officerName}
                        </span>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-slate-900/80">

                        <Calendar className="w-4 h-4 text-muted" />

                        {formatDate(
                          followUp.date
                        )}

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <div>
                        <p className="font-semibold text-slate-900">
                          {followUp.followUpType}
                        </p>

                        {followUp.notes && (
                          <p className="text-xs text-muted mt-1 max-w-xs truncate">
                            {followUp.notes}
                          </p>
                        )}
                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${statusClasses(
                          followUp.status
                        )}`}
                      >
                        {followUp.status}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {!isCompletedStatus(
                          followUp.status
                        ) && (
                          <>
                            <button
                              onClick={() =>
                                handleComplete(
                                  followUp
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition text-xs font-bold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Complete
                            </button>

                            <button
                              onClick={() =>
                                handleReschedule(
                                  followUp
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900/70 border border-line hover:bg-slate-50 transition text-xs font-bold"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reschedule
                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            openCase(followUp.caseId)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition text-xs font-bold"
                        >
                          Case
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Schedule modal */}
      {isScheduling && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl border border-line shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Schedule Follow-Up
                </h2>

                <p className="text-xs text-muted mt-1">
                  Create a welfare check-in for a case.
                </p>
              </div>

              <button
                onClick={() => setIsScheduling(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted" />
              </button>

            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">

              {/* Case */}
              <div>
                <label className="block text-xs font-bold text-slate-900/70 mb-2">
                  Case
                </label>

                <select
                  value={scheduleForm.caseId}
                  onChange={(event) =>
                    setScheduleForm((previous) => ({
                      ...previous,
                      caseId: event.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-slate-900 outline-none focus:ring-2 focus:ring-teal-200"
                >
                  <option value="">
                    Select a case
                  </option>

                  {(cases ?? []).map(
                    (caseItem: any) => {
                      const caseId =
                        getCaseId(caseItem);

                      return (
                        <option
                          key={caseId}
                          value={caseId}
                        >
                          {caseId}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-900/70 mb-2">
                  Follow-Up Date
                </label>

                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(event) =>
                    setScheduleForm((previous) => ({
                      ...previous,
                      date: event.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-slate-900 outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-slate-900/70 mb-2">
                  Follow-Up Type
                </label>

                <select
                  value={
                    scheduleForm.followUpType
                  }
                  onChange={(event) =>
                    setScheduleForm((previous) => ({
                      ...previous,
                      followUpType:
                        event.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-slate-900 outline-none focus:ring-2 focus:ring-teal-200"
                >
                  <option value="Welfare Check">
                    Welfare Check
                  </option>

                  <option value="Safety Verification">
                    Safety Verification
                  </option>

                  <option value="Counselling Follow-Up">
                    Counselling Follow-Up
                  </option>

                  <option value="Case Progress Check">
                    Case Progress Check
                  </option>

                  <option value="SVI Review">
                    SVI Review
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-900/70 mb-2">
                  Notes
                </label>

                <textarea
                  value={scheduleForm.notes}
                  onChange={(event) =>
                    setScheduleForm((previous) => ({
                      ...previous,
                      notes: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Add follow-up notes..."
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-white text-slate-900 placeholder:text-muted outline-none resize-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line">

              <button
                onClick={() => setIsScheduling(false)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-line text-slate-900/70 font-semibold hover:bg-line/40 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSchedule}
                disabled={!scheduleForm.caseId}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Save Follow-Up
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default FollowUpsView;