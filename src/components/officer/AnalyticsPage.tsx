import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Clock,
  MapPin,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

type PriorityLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MODERATE'
  | 'LOW';

interface FollowUpItem {
  status?: string;
  date?: string;
  dueDate?: string;
  scheduledDate?: string;
  completedAt?: string;
  completedDate?: string;
  [key: string]: any;
}

/* =========================================================
   HELPERS
========================================================= */

const getDateValue = (value: any): number => {
  if (!value) {
    return 0;
  }

  try {
    if (
      typeof value === 'object' &&
      typeof value.toDate === 'function'
    ) {
      return value.toDate().getTime();
    }

    if (
      typeof value === 'object' &&
      typeof value.seconds === 'number'
    ) {
      return value.seconds * 1000;
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = new Date(value).getTime();

      return Number.isNaN(parsed)
        ? 0
        : parsed;
    }

    return 0;
  } catch {
    return 0;
  }
};

const normalizeStatus = (status: any): string => {
  return String(status ?? 'UNKNOWN')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
};

const normalizePriority = (
  level: any
): PriorityLevel => {
  const value = String(level ?? '')
    .trim()
    .toUpperCase();

  if (value === 'CRITICAL') {
    return 'CRITICAL';
  }

  if (value === 'HIGH') {
    return 'HIGH';
  }

  if (value === 'MODERATE') {
    return 'MODERATE';
  }

  return 'LOW';
};

const isCompletedFollowUp = (
  followUp: FollowUpItem
): boolean => {
  const status = normalizeStatus(
    followUp.status
  );

  return (
    status === 'COMPLETED' ||
    status === 'COMPLETE' ||
    status === 'DONE' ||
    status === 'CLOSED'
  );
};

const getFollowUpDate = (
  followUp: FollowUpItem
): number => {
  return getDateValue(
    followUp.completedAt ??
      followUp.completedDate ??
      followUp.date ??
      followUp.dueDate ??
      followUp.scheduledDate
  );
};

const formatPercentage = (
  value: number
): string => {
  if (!Number.isFinite(value)) {
    return '0%';
  }

  return `${value.toFixed(1)}%`;
};

/* =========================================================
   COMPONENT
========================================================= */

export const AnalyticsPage: React.FC = () => {
  const { cases } = useApp();

  /* =====================================================
     TOTAL / PRIORITY METRICS
  ===================================================== */

  const metrics = useMemo(() => {
    const total = cases.length;

    const critical = cases.filter(
      (caseItem) =>
        normalizePriority(
          caseItem.sviLevel
        ) === 'CRITICAL'
    ).length;

    const high = cases.filter(
      (caseItem) =>
        normalizePriority(
          caseItem.sviLevel
        ) === 'HIGH'
    ).length;

    const moderate = cases.filter(
      (caseItem) =>
        normalizePriority(
          caseItem.sviLevel
        ) === 'MODERATE'
    ).length;

    const low = cases.filter(
      (caseItem) =>
        normalizePriority(
          caseItem.sviLevel
        ) === 'LOW'
    ).length;

    return {
      total,
      critical,
      high,
      moderate,
      low,
    };
  }, [cases]);

  /* =====================================================
     PRIORITY CHART
  ===================================================== */

  const priorityData = useMemo(
    () => [
      {
        name: 'CRITICAL',
        count: metrics.critical,
        color: '#f43f5e',
      },
      {
        name: 'HIGH',
        count: metrics.high,
        color: '#f59e0b',
      },
      {
        name: 'MODERATE',
        count: metrics.moderate,
        color: '#eab308',
      },
      {
        name: 'LOW',
        count: metrics.low,
        color: '#10b981',
      },
    ],
    [metrics]
  );

  /* =====================================================
     STATUS DISTRIBUTION
  ===================================================== */

  const statusData = useMemo(() => {
    const statusCounts =
      new Map<string, number>();

    cases.forEach((caseItem) => {
      const rawStatus = String(
        caseItem.status ?? 'UNKNOWN'
      ).trim();

      const displayStatus = rawStatus
        .replace(/_/g, ' ')
        .replace(
          /\b\w/g,
          (char) => char.toUpperCase()
        );

      statusCounts.set(
        displayStatus,
        (statusCounts.get(displayStatus) ?? 0) + 1
      );
    });

    const statusColors = [
      '#14b8a6',
      '#0d9488',
      '#f59e0b',
      '#a855f7',
      '#10b981',
      '#f43f5e',
      '#6366f1',
      '#0891b2',
    ];

    return Array.from(
      statusCounts.entries()
    )
      .map(([name, value], index) => ({
        name,
        value,
        color:
          statusColors[
            index % statusColors.length
          ],
      }))
      .sort(
        (a, b) => b.value - a.value
      );
  }, [cases]);

  /* =====================================================
     LOCATION DISTRIBUTION
  ===================================================== */

  const locationData = useMemo(() => {
    const locationCounts =
      new Map<string, number>();

    cases.forEach((caseItem) => {
      const location = String(
        caseItem.location ??
          caseItem.district ??
          'Not Available'
      ).trim();

      const finalLocation =
        location || 'Not Available';

      locationCounts.set(
        finalLocation,
        (locationCounts.get(finalLocation) ?? 0) + 1
      );
    });

    return Array.from(
      locationCounts.entries()
    )
      .map(([location, count]) => ({
        location,
        count,
      }))
      .sort(
        (a, b) => b.count - a.count
      )
      .slice(0, 10);
  }, [cases]);

  /* =====================================================
     FOLLOW-UP ANALYTICS
  ===================================================== */

  const followUpMetrics = useMemo(() => {
    const allFollowUps: FollowUpItem[] = [];

    cases.forEach((caseItem) => {
      const history =
        Array.isArray(
          caseItem.followUpHistory
        )
          ? caseItem.followUpHistory
          : [];

      history.forEach((followUp) => {
        allFollowUps.push(
          followUp as FollowUpItem
        );
      });
    });

    const total = allFollowUps.length;

    const completed =
      allFollowUps.filter(
        isCompletedFollowUp
      ).length;

    const pending =
      allFollowUps.filter(
        (followUp) => {
          const status =
            normalizeStatus(
              followUp.status
            );

          return (
            status === 'PENDING' ||
            status === 'SCHEDULED' ||
            status === 'UPCOMING'
          );
        }
      ).length;

    const completionRate =
      total > 0
        ? (completed / total) * 100
        : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
    };
  }, [cases]);

  /* =====================================================
     FOLLOW-UP STATUS DISTRIBUTION
  ===================================================== */

  const followUpStatusSummary =
    useMemo(() => {
      let overdue = 0;
      let scheduled = 0;
      let completed = 0;

      const now = Date.now();

      cases.forEach((caseItem) => {
        const history =
          Array.isArray(
            caseItem.followUpHistory
          )
            ? caseItem.followUpHistory
            : [];

        history.forEach((item) => {
          const followUp =
            item as FollowUpItem;

          if (
            isCompletedFollowUp(
              followUp
            )
          ) {
            completed++;
            return;
          }

          const date =
            getFollowUpDate(
              followUp
            );

          if (
            date > 0 &&
            date < now
          ) {
            overdue++;
          } else {
            scheduled++;
          }
        });
      });

      return {
        overdue,
        scheduled,
        completed,
      };
    }, [cases]);

  /* =====================================================
     PRIORITY TREND — PAST 7 DAYS
  ===================================================== */

  const trendData = useMemo(() => {
    const now = new Date();

    const days: Array<{
      dateKey: string;
      day: string;
      critical: number;
      high: number;
      moderate: number;
    }> = [];

    for (
      let i = 6;
      i >= 0;
      i--
    ) {
      const date = new Date(now);

      date.setHours(
        0,
        0,
        0,
        0
      );

      date.setDate(
        date.getDate() - i
      );

      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, '0');

      const dayNumber =
        String(
          date.getDate()
        ).padStart(2, '0');

      days.push({
        dateKey:
          `${year}-${month}-${dayNumber}`,

        day:
          date.toLocaleDateString(
            undefined,
            {
              weekday: 'short',
            }
          ),

        critical: 0,
        high: 0,
        moderate: 0,
      });
    }

    cases.forEach((caseItem) => {
      const rawCase =
        caseItem as any;

      const dateValue =
        getDateValue(
          rawCase?.createdAt ??
            rawCase?.createdTime ??
            rawCase?.lastUpdated ??
            rawCase?.updatedAt ??
            rawCase?.lastUpdate
        );

      if (!dateValue) {
        return;
      }

      const caseDate =
        new Date(dateValue);

      const year =
        caseDate.getFullYear();

      const month =
        String(
          caseDate.getMonth() + 1
        ).padStart(2, '0');

      const dayNumber =
        String(
          caseDate.getDate()
        ).padStart(2, '0');

      const dateKey =
        `${year}-${month}-${dayNumber}`;

      const target =
        days.find(
          (item) =>
            item.dateKey ===
            dateKey
        );

      if (!target) {
        return;
      }

      const priority =
        normalizePriority(
          caseItem.sviLevel
        );

      if (
        priority === 'CRITICAL'
      ) {
        target.critical++;
      }

      if (
        priority === 'HIGH'
      ) {
        target.high++;
      }

      if (
        priority === 'MODERATE'
      ) {
        target.moderate++;
      }
    });

    return days;
  }, [cases]);

  /* =====================================================
     RESPONSE TIME
  ===================================================== */

  const averageResponseTime =
    useMemo(() => {
      const responseTimes: number[] = [];

      cases.forEach((caseItem) => {
        const rawCase =
          caseItem as any;

        const created =
          getDateValue(
            rawCase?.createdAt ??
              rawCase?.createdTime
          );

        const reviewed =
          getDateValue(
            rawCase?.reviewedAt ??
              rawCase?.humanReviewedAt ??
              rawCase?.firstOfficerActionAt
          );

        if (
          created > 0 &&
          reviewed > created
        ) {
          const minutes =
            (reviewed - created) /
            (1000 * 60);

          if (
            Number.isFinite(minutes) &&
            minutes >= 0
          ) {
            responseTimes.push(
              minutes
            );
          }
        }
      });

      if (
        responseTimes.length === 0
      ) {
        return null;
      }

      const average =
        responseTimes.reduce(
          (
            totalTime,
            current
          ) =>
            totalTime + current,
          0
        ) /
        responseTimes.length;

      return average;
    }, [cases]);

  /* =====================================================
     HUMAN REVIEW RATE
  ===================================================== */

  const humanReviewRate =
    useMemo(() => {
      if (
        metrics.critical === 0
      ) {
        return 0;
      }

      const reviewed =
        cases.filter(
          (caseItem) => {
            const rawCase =
              caseItem as any;

            return (
              normalizePriority(
                caseItem.sviLevel
              ) === 'CRITICAL' &&
              Boolean(
                rawCase?.humanReviewedAt ??
                  rawCase?.reviewedAt ??
                  rawCase?.humanDecision ??
                  rawCase?.reviewStatus
              )
            );
          }
        ).length;

      return (
        (reviewed /
          metrics.critical) *
        100
      );
    }, [
      cases,
      metrics.critical,
    ]);

  /* =====================================================
     TOOLTIP STYLE
  ===================================================== */

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#0f172a',
  };

  const axisStroke = '#64748b';
  const gridStroke = '#e2e8f0';

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Operational Intelligence & Analytics
          </h2>

          <p className="text-xs text-muted">
            Public response intelligence analytics,
            vulnerability distribution, response speed,
            and follow-up completion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-2 rounded-xl bg-white border border-line text-xs font-semibold text-slate-900/80 shadow-sm">
            Average Response Time:{' '}
            <strong className="text-teal-700 font-mono">
              {averageResponseTime === null
                ? '—'
                : `${averageResponseTime.toFixed(1)} Minutes`}
            </strong>
          </span>

          <span className="px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[10px] font-black uppercase tracking-wider text-teal-700">
            Live Intelligence
          </span>
        </div>
      </div>

      {/* KPI METRICS */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="soft-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted block">
            Total Cases
          </span>

          <div className="text-2xl font-black text-slate-900 font-mono">
            {metrics.total}
          </div>

          <span className="text-[10px] text-teal-600 font-medium">
            Live Firebase dataset
          </span>
        </div>

        <div className="soft-card p-4 rounded-2xl border border-emergency-300 bg-emergency-50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emergency-700 block">
            Critical Cases
          </span>

          <div className="text-2xl font-black text-emergency-700 font-mono">
            {metrics.critical}
          </div>

          <span className="text-[10px] text-muted block">
            SVI Critical classification
          </span>
        </div>

        <div className="soft-card p-4 rounded-2xl border border-teal-300 bg-teal-50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">
            Human Decision Speed
          </span>

          <div className="text-2xl font-black text-teal-700 font-mono">
            {averageResponseTime === null
              ? '—'
              : `${averageResponseTime.toFixed(1)} min`}
          </div>

          <span className="text-[10px] text-muted block">
            Based on available review timestamps
          </span>
        </div>

        <div className="soft-card p-4 rounded-2xl border border-teal-300 bg-teal-50 space-y-1">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">
            Follow-Up Completion
          </span>

          <div className="text-2xl font-black text-teal-700 font-mono">
            {formatPercentage(
              followUpMetrics.completionRate
            )}
          </div>

          <span className="text-[10px] text-muted block">
            {followUpMetrics.completed} completed /{' '}
            {followUpMetrics.total} total
          </span>
        </div>

      </div>

      {/* PRIORITY + STATUS */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* PRIORITY */}

        <div className="lg:col-span-6 soft-card p-5 rounded-2xl space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900/70 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emergency-600" />
              Cases by Priority Level
            </h3>

            <span className="text-[10px] text-muted">
              SVI Classification
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={priorityData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridStroke}
                />

                <XAxis
                  dataKey="name"
                  stroke={axisStroke}
                  fontSize={11}
                />

                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Bar
                  dataKey="count"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                >
                  {priorityData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={`priority-cell-${index}`}
                        fill={
                          entry.color
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATUS */}

        <div className="lg:col-span-6 soft-card p-5 rounded-2xl space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900/70 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Cases by Operational Status
            </h3>

            <span className="text-[10px] text-muted">
              Firebase Lifecycle
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">

            {statusData.length === 0 ? (
              <div className="text-xs text-muted">
                No case status data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`status-cell-${index}`}
                          fill={
                            entry.color
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={
                      tooltipStyle
                    }
                  />

                </PieChart>
              </ResponsiveContainer>
            )}

          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] pt-1">

            {statusData.map(
              (status) => (
                <div
                  key={status.name}
                  className="flex items-center space-x-1.5 text-slate-900/80"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        status.color,
                    }}
                  />

                  <span>
                    {status.name}:{' '}
                    <strong>
                      {status.value}
                    </strong>
                  </span>
                </div>
              )
            )}

          </div>

        </div>

      </div>

      {/* LOCATION + TREND */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LOCATION */}

        <div className="lg:col-span-6 soft-card p-5 rounded-2xl space-y-4">

          <div className="flex items-center justify-between">

            <h3 className="text-xs font-bold text-slate-900/70 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Geographic Case Distribution
            </h3>

            <span className="text-[10px] text-muted">
              Top Firebase locations
            </span>

          </div>

          <div className="h-60 w-full">

            {locationData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted">
                No location data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={locationData}
                  layout="vertical"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridStroke}
                  />

                  <XAxis
                    type="number"
                    stroke={axisStroke}
                    fontSize={11}
                    allowDecimals={false}
                  />

                  <YAxis
                    dataKey="location"
                    type="category"
                    stroke={axisStroke}
                    fontSize={11}
                    width={100}
                  />

                  <Tooltip
                    contentStyle={
                      tooltipStyle
                    }
                  />

                  <Bar
                    dataKey="count"
                    fill="#0d9488"
                    radius={[
                      0,
                      8,
                      8,
                      0,
                    ]}
                  />

                </BarChart>
              </ResponsiveContainer>
            )}

          </div>

        </div>

        {/* TREND */}

        <div className="lg:col-span-6 soft-card p-5 rounded-2xl space-y-4">

          <div className="flex items-center justify-between">

            <h3 className="text-xs font-bold text-slate-900/70 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Priority Trends Over Time
            </h3>

            <span className="text-[10px] text-muted">
              Past 7 Days
            </span>

          </div>

          <div className="h-60 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={trendData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridStroke}
                />

                <XAxis
                  dataKey="day"
                  stroke={axisStroke}
                  fontSize={11}
                />

                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize: '10px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="critical"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  name="Critical"
                  dot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="High"
                  dot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="moderate"
                  stroke="#eab308"
                  strokeWidth={2}
                  name="Moderate"
                  dot={{ r: 3 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* FOLLOW-UP INTELLIGENCE SUMMARY */}

      <div className="soft-card p-5 rounded-2xl shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3 className="text-xs font-bold text-muted uppercase tracking-wider font-mono">
              Follow-Up Intelligence
            </h3>

            <p className="text-[10px] text-muted mt-1">
              Derived from case follow-up history stored in Firebase.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="rounded-xl bg-slate-50 border border-line p-4">

            <span className="text-[10px] uppercase font-bold text-muted">
              Total Follow-Ups
            </span>

            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {followUpMetrics.total}
            </div>

          </div>

          <div className="rounded-xl bg-sage-50 border border-sage-300 p-4">

            <span className="text-[10px] uppercase font-bold text-sage-700">
              Completed
            </span>

            <div className="text-xl font-black text-sage-700 font-mono mt-1">
              {followUpStatusSummary.completed}
            </div>

          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">

            <span className="text-[10px] uppercase font-bold text-amber-700">
              Scheduled
            </span>

            <div className="text-xl font-black text-amber-700 font-mono mt-1">
              {followUpStatusSummary.scheduled}
            </div>

          </div>

          <div className="rounded-xl bg-emergency-50 border border-emergency-300 p-4">

            <span className="text-[10px] uppercase font-bold text-emergency-700">
              Overdue
            </span>

            <div className="text-xl font-black text-emergency-700 font-mono mt-1">
              {followUpStatusSummary.overdue}
            </div>

          </div>

        </div>

      </div>

      {/* DATA SOURCE FOOTER */}

      <div className="flex flex-wrap items-center justify-between gap-3 px-1">

        <span className="text-[10px] text-muted">
          DATA SOURCE: FIREBASE / CASE MANAGEMENT
        </span>

        <span className="text-[10px] text-muted">
          {metrics.total} case
          {metrics.total === 1
            ? ''
            : 's'} currently loaded
        </span>

      </div>

    </div>
  );
};