import React from 'react';
import { AuditLogTable } from '../supervisor/AuditLogTable';
import { FileCheck, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">

      {/* HEADER */}
      <section className="soft-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-teal-700" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Audit Trail
                </h1>

                <span className="px-2 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[9px] font-black text-teal-700 uppercase">
                  Accountability
                </span>
              </div>

              <p className="text-xs text-muted mt-1 max-w-2xl">
                Record of AI assessments, officer decisions, assignments,
                escalations, and follow-up actions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-line">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <div>
              <span className="block text-[9px] font-black uppercase tracking-wider text-muted">
                Audit status
              </span>
              <span className="text-xs font-bold text-slate-900">
                Live
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* AUDIT LOG TABLE */}
      <section className="soft-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-line bg-slate-50/60">
          <h2 className="text-sm font-black text-slate-900">
            System Activity
          </h2>
          <p className="text-[10px] text-muted mt-1">
            Each recorded action retains who, what, when, and decision context.
          </p>
        </div>

        <AuditLogTable />
      </section>

    </div>
  );
};
