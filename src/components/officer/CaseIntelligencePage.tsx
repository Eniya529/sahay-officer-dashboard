import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { LifecycleStage, SVILevel } from '../../types';
import { DynamicTimelineChart } from '../victim/DynamicTimelineChart';

import {
  ShieldCheck,
  CheckCircle2,
  Edit3,
  ArrowLeft,
  Info,
  Layers,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mic,
  AlertOctagon,
  Brain,
  FileText,
  Volume2,
  Target,
  RefreshCw,
  UserCheck,
  ArrowUpRight,
  Activity,
  ClipboardCheck,
} from 'lucide-react';

export const CaseIntelligencePage: React.FC<{
  onBackToDashboard?: () => void;
}> = ({ onBackToDashboard }) => {
  const {
    selectedCase,
    overrideCaseDecision,
    updateCaseLifecycle,
    scheduleFollowUp,
    setCurrentRoute,
    auditLogs,
    assignOfficerToCase,
    officers,
  } = useApp();

  /* =========================================================
     UI STATE
  ========================================================= */

  const [isWhyPanelOpen, setIsWhyPanelOpen] = useState(true);

  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [targetPriority, setTargetPriority] =
    useState<SVILevel>(selectedCase?.sviLevel || 'CRITICAL');
  const [modifyReason, setModifyReason] = useState('');

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // Escalation Modal
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState(
    'Immediate safety concern'
  );
  const [escalationNote, setEscalationNote] = useState('');
  const [escalationTarget, setEscalationTarget] = useState('Supervisor');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');

  const [followUpDate, setFollowUpDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  });

  const [followUpNotes, setFollowUpNotes] = useState(
    'Conduct safety and location check-in.'
  );

  const [followUpType, setFollowUpType] =
    useState('Safety Verification');

  /* =========================================================
     RESET STATE WHEN CASE CHANGES
  ========================================================= */

  useEffect(() => {
    if (!selectedCase) return;

    setTargetPriority(selectedCase.sviLevel);
    setModifyReason('');
    setOverrideReason('');
    setEscalationReason('Immediate safety concern');
    setEscalationNote('');
    setEscalationTarget('Supervisor');

    setSelectedOfficerId(
      selectedCase.assignedOfficerId ||
        officers[0]?.id ||
        ''
    );
  }, [
    selectedCase?.id,
    selectedCase?.sviLevel,
    selectedCase?.assignedOfficerId,
    officers,
  ]);

  /* =========================================================
     EMPTY STATE
  ========================================================= */


  /* =========================================================
     LIFECYCLE
  ========================================================= */

  const lifecycleStages: LifecycleStage[] = [
    'Received',
    'AI Assessment',
    'Officer Review',
    'Assigned',
    'Follow-up',
    'Reassessment',
    'Closure',
  ];

  const currentStageIndex =
    lifecycleStages.indexOf(
      selectedCase?.lifecycleStage as LifecycleStage
    ) !== -1
      ? lifecycleStages.indexOf(
          selectedCase?.lifecycleStage as LifecycleStage
        )
      : 2;

  /* =========================================================
     LATEST ASSESSMENT
  ========================================================= */

  const latestAssessment = useMemo(() => {
    const events = selectedCase?.assessmentEvents || [];

    if (events.length === 0) return null;

    return events[events.length - 1];
  }, [selectedCase?.assessmentEvents]);

  /* =========================================================
     CONFIDENCE
  ========================================================= */

  const confidencePercent = useMemo(() => {
    const value = Number(
      latestAssessment?.confidence ??
        selectedCase?.confidence ??
        0
    );

    if (value <= 1) {
      return Math.round(value * 100);
    }

    return Math.round(value);
  }, [
    latestAssessment?.confidence,
    selectedCase?.confidence,
  ]);

  /* =========================================================
     SAFE INDICATOR FORMATTER
  ========================================================= */

  const formatIndicator = (value: unknown): string => {
    if (typeof value === 'string') {
      return value;
    }

    if (value && typeof value === 'object') {
      const item = value as Record<string, unknown>;

      return String(
        item.label ??
          item.name ??
          item.indicator ??
          item.description ??
          ''
      );
    }

    return String(value ?? '');
  };

  /* =========================================================
     INDICATORS
  ========================================================= */

  const emotionalIndicators = (selectedCase?.emotionalIndicators ?? [])
    .map(formatIndicator)
    .filter(Boolean);

  const contextualIndicators = (selectedCase?.contextualIndicators ?? [])
    .map(formatIndicator)
    .filter(Boolean);

  const safetyIndicators = (selectedCase?.safetyIndicators ?? [])
    .map(formatIndicator)
    .filter(Boolean);

  /* =========================================================
     KEY EVIDENCE
  ========================================================= */

  const keyEvidence = useMemo(() => {
    if (
      latestAssessment?.keyEvidence &&
      latestAssessment.keyEvidence.length > 0
    ) {
      return latestAssessment.keyEvidence
        .map(formatIndicator)
        .filter(Boolean);
    }

    return (selectedCase?.keyEvidence ?? [])
      .map(formatIndicator)
      .filter(Boolean);
  }, [
    latestAssessment?.keyEvidence,
    selectedCase?.keyEvidence,
  ]);

  /* =========================================================
     CURRENT AI EXPLANATION
  ========================================================= */

  const assessmentReasoning =
    latestAssessment?.reasoning ||
    selectedCase?.reasoning ||
    '';

  const adaptiveQuestion =
    selectedCase?.adaptiveQuestion ||
    latestAssessment?.adaptiveQuestion ||
    'No adaptive question recorded for this assessment.';

  const recommendedAction =
    latestAssessment?.recommendedAction ||
    selectedCase?.recommendedAction ||
    'No recommended response recorded.';

  /* =========================================================
     AI CONTROL SIGNALS
  ========================================================= */

  const confidenceLevel =
    selectedCase?.confidenceLevel || 'NOT CLASSIFIED';

  const riskTrend =
    selectedCase?.riskTrend || 'STABLE';

  const riskEscalation =
    Boolean(selectedCase?.riskEscalation);

  const requiresHumanReview =
    Boolean(selectedCase?.requiresHumanReview);

  const hasAdaptiveQuestion =
    Boolean(
      selectedCase?.adaptiveQuestion ||
      latestAssessment?.adaptiveQuestion
    );

  /* =========================================================
     CASE AUDIT
  ========================================================= */

  const caseAuditTrail = auditLogs
    .filter((log) => log.caseId === selectedCase?.id)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );

  /* =========================================================
     VOICE INPUT
  ========================================================= */

  const hasVoiceInput = selectedCase?.messages?.some(
    (message) =>
      message.sender === 'victim' &&
      message.inputType === 'voice'
  );

  /* =========================================================
     OFFICER MATCHING
  ========================================================= */

  const rankedOfficers = useMemo(() => {
    return [...officers]
      .map((officer) => {
        let score = Number(
          officer.matchPercentage ?? 0
        );

        if (!score) {
          if (officer.jurisdictionMatch) score += 30;
          if (officer.languageMatch) score += 25;
          if (officer.eligibilityMatch) score += 25;
          if (officer.availability === 'Available') {
            score += 20;
          }
        }

        return {
          ...officer,
          calculatedMatch: Math.min(
            100,
            Math.round(score)
          ),
        };
      })
      .sort(
        (a, b) =>
          b.calculatedMatch -
          a.calculatedMatch
      );
  }, [officers]);

  const recommendedOfficer =
    rankedOfficers[0] || null;

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!selectedCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="soft-card p-8 rounded-2xl text-center">
          <AlertOctagon className="w-10 h-10 text-muted mx-auto mb-3" />

          <h2 className="text-slate-900 font-bold text-lg">
            No case selected
          </h2>

          <p className="text-muted text-sm mt-1">
            Select a case from the Cases Workspace.
          </p>

          <button
            onClick={() => setCurrentRoute('officer-cases')}
            className="mt-5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
          >
            Open Cases Workspace
          </button>
        </div>
      </div>
    );
  }


  /* =========================================================
     PRIORITY COLORS
  ========================================================= */

  const getPriorityClasses = (level: SVILevel) => {
    switch (level) {
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
  };

  /* =========================================================
     DECISION HANDLERS
  ========================================================= */

  const handleConfirm = () => {
    overrideCaseDecision(
      selectedCase.id,
      'accepted',
      'Officer confirmed AI-assisted assessment.',
      'Assessment plan confirmed by authorized officer.'
    );
  };

  const handleEscalate = (event: React.FormEvent) => {
    event.preventDefault();

    if (!escalationReason.trim() || !escalationNote.trim()) {
      return;
    }

    overrideCaseDecision(
      selectedCase.id,
      'escalated',
      escalationReason,
      `Escalated to ${escalationTarget}. ${escalationNote}`
    );

    setIsEscalateModalOpen(false);
    setEscalationNote('');
  };

  

  const handleSaveModifyPriority = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!modifyReason.trim()) return;

    overrideCaseDecision(
      selectedCase.id,
      'modified',
      modifyReason,
      `Officer changed priority to ${targetPriority}.`
    );

    setIsModifyModalOpen(false);
  };

  const handleOverride = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!overrideReason.trim()) return;

    overrideCaseDecision(
      selectedCase.id,
      'overridden',
      overrideReason,
      'Officer overrode the AI-assisted assessment.'
    );

    setIsOverrideModalOpen(false);
    setOverrideReason('');
  };

  /* =========================================================
     ASSIGNMENT
  ========================================================= */

  const handleConfirmAssignment = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!selectedOfficerId) return;

    assignOfficerToCase(
      selectedCase.id,
      selectedOfficerId
    );

    setIsAssignModalOpen(false);
  };

  /* =========================================================
     FOLLOW-UP
  ========================================================= */

  const handleScheduleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    scheduleFollowUp(
      selectedCase.id,
      followUpDate,
      `${followUpType}: ${followUpNotes}`
    );

    setCurrentRoute('officer-followups');
  };

  /* =========================================================
     FOLLOW-UP STATUS
  ========================================================= */

  const latestFollowUp =
    selectedCase.followUpHistory?.[
      selectedCase.followUpHistory.length - 1
    ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">

      {/* =====================================================
          CASE WORKSPACE HEADER
      ===================================================== */}

      <section data-severity={selectedCase.sviLevel} className="command-card rounded-2xl overflow-hidden">

        <div className="p-5 sm:p-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-start gap-3">

              <button
                onClick={() => {
                  if (onBackToDashboard) {
                    onBackToDashboard();
                  }

                  setCurrentRoute(
                    'officer-cases'
                  );
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-muted hover:text-slate-900 border border-line transition"
                title="Back to Cases"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    Case Workspace
                  </span>

                  <span className="text-line">
                    /
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    Officer Review
                  </span>

                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1">

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {selectedCase.id}
                  </h1>

                  <span
                    className={`px-3 py-1 rounded-lg border text-[11px] font-black ${getPriorityClasses(
                      selectedCase.sviLevel
                    )}`}
                  >
                    {selectedCase.sviLevel}
                  </span>

                </div>

                <p className="text-xs text-muted mt-1">
                  {selectedCase.location ||
                    selectedCase.district ||
                    'Location not recorded'}
                  {' · '}
                  {selectedCase.language ||
                    'Language not recorded'}
                  {' · '}
                  Updated {selectedCase.lastUpdate}
                </p>

              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-line">

                <span className="block text-[9px] font-bold uppercase tracking-wider text-muted">
                  SVI
                </span>

                <span className={`text-lg font-black ${
                  selectedCase.sviLevel === 'CRITICAL'
                    ? 'text-red-700'
                    : selectedCase.sviLevel === 'HIGH'
                    ? 'text-orange-700'
                    : selectedCase.sviLevel === 'MODERATE'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}>
                  {selectedCase.sviScore}
                  <span className="text-xs text-muted">/100</span>
                </span>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <div className="px-3 py-2 rounded-xl bg-teal-50 border border-teal-200">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-teal-700">
                    AI Confidence
                  </span>
                  <span className="text-sm font-black text-teal-800">
                    {confidencePercent}%
                  </span>
                </div>

                {riskEscalation && (
                  <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-300">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-red-700">
                      Escalation
                    </span>
                    <span className="text-[11px] font-black text-red-800">
                      RISING RISK
                    </span>
                  </div>
                )}

              </div>

              {selectedCase.officerDecision && (
                <div className="px-3 py-2 rounded-xl bg-sage-50 border border-sage-300">

                  <div className="flex items-center gap-1.5 text-sage-700">

                    <CheckCircle2 className="w-4 h-4" />

                    <span className="text-[10px] font-black uppercase">
                      Human Decision
                    </span>

                  </div>

                  <span className="text-[11px] font-bold text-sage-700">
                    {selectedCase.officerDecision}
                  </span>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* PRIMARY DECISION ACTIONS */}

        <div className="border-t border-line bg-slate-50/60 px-5 py-3 flex flex-wrap items-center justify-between gap-3">

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Officer control
            </span>

            <p className="text-xs text-slate-900/70">
              Review the AI-assisted assessment before taking action.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={handleConfirm}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm
            </button>

            <button
              onClick={() =>
                setIsModifyModalOpen(true)
              }
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Modify
            </button>

            <button
              onClick={() =>
                setIsOverrideModalOpen(true)
              }
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-line text-slate-900/80 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Override
            </button>

            <button
              onClick={() => setIsEscalateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emergency-50 hover:bg-emergency-100 border border-emergency-300 text-emergency-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Escalate
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          CASE LIFECYCLE
      ===================================================== */}

      <section className="soft-card rounded-2xl p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">

          <div>
            <div className="flex items-center gap-2">

              <Layers className="w-4 h-4 text-teal-600" />

              <h2 className="text-sm font-black text-slate-900">
                Case Lifecycle
              </h2>

            </div>

            <p className="text-[11px] text-muted mt-1">
              Track the case from intake to closure.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[10px] font-bold text-teal-700">
            Current: {selectedCase.lifecycleStage}
          </span>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">

          {lifecycleStages.map(
            (stage, index) => {

              const isPassed =
                index < currentStageIndex;

              const isCurrent =
                index === currentStageIndex;

              return (
                <button
                  key={stage}
                  onClick={() =>
                    updateCaseLifecycle(
                      selectedCase.id,
                      stage
                    )
                  }
                  className={`relative p-3 rounded-xl border transition text-left ${
                    isCurrent
                      ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                      : isPassed
                      ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                      : 'bg-white border-line text-muted hover:bg-slate-50'
                  }`}
                >

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-[9px] font-bold uppercase">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-line" />
                    )}

                  </div>

                  <span className="text-[10px] font-bold leading-tight">
                    {stage}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          SITUATION + AI ASSESSMENT
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ===================================================
            SITUATION & EVIDENCE
        =================================================== */}

        <section className="xl:col-span-7 soft-card rounded-2xl p-5 space-y-5">

          <div className="flex items-center justify-between border-b border-line pb-3">

            <div>

              <div className="flex items-center gap-2">

                <MessageSquare className="w-4 h-4 text-teal-600" />

                <h2 className="text-sm font-black text-slate-900">
                  Situation & Evidence
                </h2>

              </div>

              <p className="text-[11px] text-muted mt-1">
                Conversation and information supporting the assessment.
              </p>

            </div>

            <span className="text-[10px] font-bold text-muted">
              {selectedCase.messages?.length || 0} messages
            </span>

          </div>

          {/* CONVERSATION */}

          <div>

            <div className="flex items-center justify-between mb-2">

              <span className="text-[10px] uppercase tracking-wider font-bold text-muted">
                Victim Conversation
              </span>

              <span className="text-[10px] text-muted">
                {selectedCase.language || 'Language not recorded'}
              </span>

            </div>

            <div className="space-y-2 max-h-90 overflow-y-auto pr-1">

              {selectedCase.messages?.length ? (

                selectedCase.messages.map(
                  (message) => (

                    <div
                      key={message.id}
                      className={`p-3.5 rounded-xl border ${
                        message.sender ===
                        'victim'
                          ? 'bg-teal-50/60 border-teal-200'
                          : 'bg-white border-line'
                      }`}
                    >

                      <div className="flex items-center justify-between gap-3 mb-1.5">

                        <div className="flex items-center gap-2">

                          <span
                            className={`text-[10px] font-bold ${
                              message.sender ===
                              'victim'
                                ? 'text-teal-700'
                                : 'text-muted'
                            }`}
                          >
                            {message.sender ===
                            'victim'
                              ? 'Victim'
                              : message.sender ===
                                'assistant'
                              ? 'SAHAY Assistant'
                              : 'System'}
                          </span>

                          {message.inputType ===
                            'voice' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emergency-50 border border-emergency-200 text-emergency-700 text-[9px] font-bold flex items-center gap-1">
                              <Mic className="w-3 h-3" />
                              Voice
                            </span>
                          )}

                        </div>

                        <span className="text-[9px] text-muted font-mono">
                          {message.timestamp}
                        </span>

                      </div>

                      <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                        {message.text}
                      </p>

                    </div>
                  )
                )

              ) : (

                <div className="p-5 rounded-xl bg-slate-50 border border-line text-center">

                  <MessageSquare className="w-7 h-7 text-line mx-auto mb-2" />

                  <p className="text-xs text-muted">
                    No conversation messages are available.
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* KEY EVIDENCE */}

          <div className="border-t border-line pt-4">

            <div className="flex items-center gap-2 mb-3">

              <FileText className="w-4 h-4 text-amber-600" />

              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Key Evidence
              </h3>

            </div>

            {keyEvidence.length > 0 ? (

              <div className="space-y-2">

                {keyEvidence.map(
                  (evidence, index) => (

                    <div
                      key={`${evidence}-${index}`}
                      className="p-3 rounded-xl bg-amber-50 border border-amber-200"
                    >

                      <div className="flex items-start gap-2">

                        <span className="w-5 h-5 shrink-0 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-black">
                          {index + 1}
                        </span>

                        <p className="text-xs text-amber-900 font-medium leading-relaxed">
                          “{evidence}”
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="p-3 rounded-xl bg-slate-50 border border-line text-xs text-muted">
                No evidence excerpts recorded.
              </div>

            )}

          </div>

          {/* VOICE */}

          <div className="border-t border-line pt-4">

            <div className="flex items-center gap-2 mb-3">

              <Volume2 className="w-4 h-4 text-teal-600" />

              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Voice / Speech Input
              </h3>

            </div>

            {hasVoiceInput ? (

              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">

                <div className="flex items-center gap-2">

                  <Mic className="w-4 h-4 text-teal-700" />

                  <span className="text-xs font-bold text-teal-800">
                    Voice transcript detected
                  </span>

                </div>

                <p className="text-[11px] text-teal-700 mt-1.5">
                  Voice input has been converted into conversation text
                  and included in the assessment context.
                </p>

                <p className="text-[10px] text-teal-600 mt-2 italic">
                  Supporting conversational signal only.
                </p>

              </div>

            ) : (

              <div className="p-3.5 rounded-xl bg-slate-50 border border-line">

                <span className="text-xs text-muted">
                  No voice input recorded for this case.
                </span>

              </div>

            )}

          </div>

        </section>

        {/* ===================================================
            SAHAY ASSESSMENT
        =================================================== */}

        <section className="xl:col-span-5 rounded-2xl p-5 bg-white border border-teal-200 shadow-sm space-y-5">

          <div className="flex items-center justify-between border-b border-line pb-3">

            <div>

              <div className="flex items-center gap-2">

                <Brain className="w-4 h-4 text-teal-600" />

                <h2 className="text-sm font-black text-slate-900">
                  SAHAY Assessment
                </h2>

              </div>

              <p className="text-[11px] text-muted mt-1">
                AI-assisted vulnerability assessment
              </p>

            </div>

            <span className="px-2 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[9px] font-bold text-teal-700">
              AI-ASSISTED
            </span>

          </div>

          {/* SVI */}

          <div className="p-4 rounded-2xl bg-slate-50 border border-line">

            <div className="flex items-end justify-between gap-4">

              <div>

                <span className="text-[9px] uppercase tracking-wider font-bold text-muted">
                  Stress Vulnerability Index
                </span>

                <div className="text-4xl font-black text-slate-900 mt-1">
                  {selectedCase.sviScore}
                  <span className="text-sm text-muted font-semibold">
                    {' '}
                    / 100
                  </span>
                </div>

              </div>

              <span
                className={`px-3 py-1.5 rounded-xl border text-xs font-black ${getPriorityClasses(
                  selectedCase.sviLevel
                )}`}
              >
                {selectedCase.sviLevel}
              </span>

            </div>

            <div className="mt-4">

              <div className="flex justify-between text-[9px] font-bold text-muted mb-1">

                <span>
                  Assessment confidence
                </span>

                <span>
                  {confidencePercent}%
                </span>

              </div>

              <div className="h-2 bg-line/60 rounded-full overflow-hidden">

                <div
                  className="h-full bg-teal-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      confidencePercent
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* AI SIGNAL SUMMARY */}

          <div className="grid grid-cols-2 gap-2">

            <div className="p-3 rounded-xl bg-slate-50 border border-line">
              <span className="text-[9px] uppercase tracking-wider font-black text-muted block">
                Confidence Level
              </span>
              <span className="text-xs font-black text-slate-900 mt-1 block">
                {confidenceLevel.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-line">
              <span className="text-[9px] uppercase tracking-wider font-black text-muted block">
                Risk Trend
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Activity className={`w-3.5 h-3.5 ${
                  riskTrend === 'RISING'
                    ? 'text-red-600'
                    : riskTrend === 'FALLING'
                    ? 'text-emerald-600'
                    : 'text-slate-500'
                }`} />
                <span className={`text-xs font-black ${
                  riskTrend === 'RISING'
                    ? 'text-red-700'
                    : riskTrend === 'FALLING'
                    ? 'text-emerald-700'
                    : 'text-slate-700'
                }`}>
                  {riskTrend}
                </span>
              </div>
            </div>

          </div>

          {riskEscalation && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-black text-red-700 block">
                  Risk Escalation Detected
                </span>
                <p className="text-[11px] text-red-800 mt-1 leading-relaxed">
                  The latest ML assessment indicates that vulnerability is escalating.
                </p>
              </div>
            </div>
          )}

          {requiresHumanReview && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-black text-amber-700 block">
                  Human Review Required
                </span>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  SAHAY has flagged this case for authorized officer review before further action.
                </p>
              </div>
            </div>
          )}

          {/* INDICATORS */}

          <div className="grid grid-cols-1 gap-2">

            <IndicatorCard
              title="Emotional"
              values={emotionalIndicators}
              tone="emergency"
            />

            <IndicatorCard
              title="Contextual"
              values={contextualIndicators}
              tone="amber"
            />

            <IndicatorCard
              title="Safety"
              values={safetyIndicators}
              tone="teal"
            />

          </div>

          {/* ASSESSMENT BASIS */}

          <div>

            <button
              onClick={() =>
                setIsWhyPanelOpen(
                  !isWhyPanelOpen
                )
              }
              className="w-full flex items-center justify-between"
            >

              <div className="flex items-center gap-2">

                <Info className="w-4 h-4 text-teal-600" />

                <span className="text-xs font-black text-slate-900">
                  Why AI Flagged This Case
                </span>

              </div>

              {isWhyPanelOpen ? (
                <ChevronUp className="w-4 h-4 text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted" />
              )}

            </button>

            {isWhyPanelOpen && (

              <div className="mt-3 space-y-3">

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-line">
                    <span className="text-[9px] uppercase tracking-wider font-black text-muted block">
                      AI Confidence
                    </span>
                    <span className="text-sm font-black text-slate-900 mt-1 block">
                      {confidencePercent}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-line">
                    <span className="text-[9px] uppercase tracking-wider font-black text-muted block">
                      Assessment Status
                    </span>
                    <span className={`text-[11px] font-black mt-1 block ${
                      requiresHumanReview
                        ? 'text-amber-700'
                        : 'text-teal-700'
                    }`}>
                      {requiresHumanReview
                        ? 'HUMAN REVIEW REQUIRED'
                        : 'AI-ASSISTED'}
                    </span>
                  </div>
                </div>

                {assessmentReasoning ? (

                  <div className="p-3 rounded-xl bg-slate-50 border border-line">

                    <p className="text-[11px] text-slate-900/80 leading-relaxed">
                      {assessmentReasoning}
                    </p>

                  </div>

                ) : (

                  <div className="p-3 rounded-xl bg-slate-50 border border-line text-xs text-muted">
                    No assessment explanation recorded.
                  </div>

                )}

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">

                  <p className="text-[10px] text-teal-800 leading-relaxed">

                    This assessment provides AI-generated
                    vulnerability indicators for officer
                    decision support. It is not a clinical
                    diagnosis or legal credibility determination.

                  </p>

                </div>

              </div>

            )}

          </div>

        </section>

      </div>

      {/* =====================================================
          ASSESSMENT JOURNEY
      ===================================================== */}

      <section className="soft-card rounded-2xl p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">

          <div>

            <div className="flex items-center gap-2">

              <Activity className="w-4 h-4 text-teal-600" />

              <h2 className="text-sm font-black text-slate-900">
                Assessment Journey
              </h2>

            </div>

            <p className="text-[11px] text-muted mt-1">
              How the vulnerability assessment evolved as information was received.
            </p>

          </div>

          <span className="text-[10px] font-bold text-muted">
            {selectedCase.assessmentEvents?.length || 0} assessments
          </span>

        </div>

        {/* EXISTING CHART */}

        <div className="mb-5">

          <DynamicTimelineChart />

        </div>

        {/* HISTORY CARDS */}

        {selectedCase.assessmentEvents &&
        selectedCase.assessmentEvents.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {selectedCase.assessmentEvents.map(
              (event, index) => (

                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-slate-50 border border-line"
                >

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-[9px] font-black uppercase tracking-wider text-muted">
                      Assessment {index + 1}
                    </span>

                    <span className="text-[9px] text-muted font-mono">
                      {event.timestamp}
                    </span>

                  </div>

                  <div className="flex items-end justify-between">

                    <div>

                      <span className="text-[9px] uppercase font-bold text-muted">
                        SVI
                      </span>

                      <div className="text-2xl font-black text-slate-900">
                        {event.svi}
                      </div>

                    </div>

                    <span
                      className={`px-2 py-1 rounded-lg border text-[9px] font-black ${getPriorityClasses(
                        event.level
                      )}`}
                    >
                      {event.level}
                    </span>

                  </div>

                  {event.messageText && (

                    <p className="text-[10px] text-muted mt-3 line-clamp-2">
                      “{event.messageText}”
                    </p>

                  )}

                  {index === selectedCase.assessmentEvents!.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line">
                      <span className="px-2 py-1 rounded-md bg-slate-100 border border-line text-[8px] font-black text-slate-600 uppercase">
                        Confidence {confidencePercent}%
                      </span>

                      <span className={`px-2 py-1 rounded-md border text-[8px] font-black uppercase ${
                        riskTrend === 'RISING'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : riskTrend === 'FALLING'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-600 border-line'
                      }`}>
                        Trend: {riskTrend}
                      </span>

                      {riskEscalation && (
                        <span className="px-2 py-1 rounded-md bg-red-50 border border-red-200 text-[8px] font-black text-red-700 uppercase">
                          Escalation
                        </span>
                      )}
                    </div>
                  )}

                </div>

              )
            )}

          </div>

        ) : (

          <div className="p-4 rounded-xl bg-slate-50 border border-line text-xs text-muted">
            No reassessment history has been recorded yet.
          </div>

        )}

      </section>

      {/* =====================================================
          ADAPTIVE QUESTION + RECOMMENDED RESPONSE
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ADAPTIVE QUESTION */}

        <section className="soft-card rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">

            <Target className="w-4 h-4 text-teal-600" />

            <div>

              <h2 className="text-sm font-black text-slate-900">
                Adaptive Question
              </h2>

              <p className="text-[10px] text-muted">
                Next question generated according to the current assessment.
              </p>

            </div>

          </div>

          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">

            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] uppercase tracking-wider font-black text-teal-700">
                Suggested Follow-up Question
              </span>

              {hasAdaptiveQuestion && (
                <span className="px-2 py-0.5 rounded-md bg-white/70 border border-teal-200 text-[8px] font-black text-teal-700 uppercase">
                  AI Generated
                </span>
              )}
            </div>

            <p className="text-base font-bold text-teal-950 leading-relaxed mt-2">
              “{adaptiveQuestion}”
            </p>

          </div>

          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted">

            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />

            <span>
              Question generated from the current conversational assessment.
            </span>

          </div>

        </section>

        {/* RECOMMENDED RESPONSE */}

        <section className="soft-card rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">

            <Sparkles className="w-4 h-4 text-teal-600" />

            <div>

              <h2 className="text-sm font-black text-slate-900">
                Recommended Response
              </h2>

              <p className="text-[10px] text-muted">
                AI-assisted recommendation for officer review.
              </p>

            </div>

          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-line">

            <span className="text-[9px] uppercase tracking-wider font-black text-muted">
              AI recommendation
            </span>

            <p className="text-sm font-bold text-slate-900 leading-relaxed mt-2">
              {recommendedAction}
            </p>

          </div>

          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">

            <p className="text-[10px] text-amber-800">
              <strong>AI recommends. Officer decides.</strong>{' '}
              Final response remains under authorized human control.
            </p>

          </div>

        </section>

      </div>

      {/* =====================================================
          OFFICER DECISION + SMART ALLOCATION
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* OFFICER DECISION */}

        <section className="xl:col-span-5 rounded-2xl p-5 bg-teal-50/50 border border-teal-200">

          <div className="flex items-center gap-2 mb-2">

            <ShieldCheck className="w-5 h-5 text-teal-600" />

            <h2 className="text-sm font-black text-slate-900">
              Officer Decision
            </h2>

          </div>

          <p className="text-[11px] text-muted mb-4">
            Review the AI assessment and record the authorized officer's decision.
          </p>

          {requiresHumanReview && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-[10px] font-black text-amber-800 uppercase">
                Human Review Required
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={handleConfirm}
              className="py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition"
            >
              ✓ Confirm
            </button>

            <button
              onClick={() =>
                setIsModifyModalOpen(true)
              }
              className="py-3 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-700 text-xs font-black transition"
            >
              Modify
            </button>

            <button
              onClick={() =>
                setIsOverrideModalOpen(true)
              }
              className="py-3 rounded-xl bg-white hover:bg-slate-50 border border-line text-slate-900/80 text-xs font-black transition"
            >
              Override
            </button>

            <button
              onClick={() => setIsEscalateModalOpen(true)}
              className="py-3 rounded-xl bg-emergency-50 hover:bg-emergency-100 border border-emergency-300 text-emergency-700 text-xs font-black transition"
            >
              Escalate
            </button>

          </div>

          {selectedCase.officerDecision && (

            <div className="mt-4 p-3 rounded-xl bg-sage-50 border border-sage-200">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 text-sage-600" />

                <span className="text-xs font-bold text-sage-700">
                  Recorded decision:{' '}
                  {selectedCase.officerDecision}
                </span>

              </div>

            </div>

          )}

        </section>

        {/* SMART ALLOCATION */}

        <section className="xl:col-span-7 soft-card rounded-2xl p-5">

          <div className="flex items-center justify-between gap-3 mb-4">

            <div className="flex items-center gap-2">

              <UserCheck className="w-5 h-5 text-teal-600" />

              <div>

                <h2 className="text-sm font-black text-slate-900">
                  Smart Officer Allocation
                </h2>

                <p className="text-[10px] text-muted">
                  Matching considers available officer attributes already present in the system.
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setIsAssignModalOpen(true)
              }
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold"
            >
              Manual Assign
            </button>

          </div>

          {recommendedOfficer ? (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">

                <div className="flex items-start justify-between">

                  <div>

                    <span className="text-[9px] uppercase font-black text-teal-700">
                      Recommended match
                    </span>

                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {recommendedOfficer.name}
                    </h3>

                    <p className="text-[10px] text-muted">
                      {recommendedOfficer.role}
                    </p>

                  </div>

                  <span className="px-2 py-1 rounded-lg bg-white border border-teal-200 text-teal-700 text-[10px] font-black">
                    {recommendedOfficer.calculatedMatch}% match
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">

                  <MatchItem
                    label="Jurisdiction"
                    matched={
                      recommendedOfficer.jurisdictionMatch
                    }
                  />

                  <MatchItem
                    label="Language"
                    matched={
                      recommendedOfficer.languageMatch
                    }
                  />

                  <MatchItem
                    label="Eligibility"
                    matched={
                      recommendedOfficer.eligibilityMatch
                    }
                  />

                  <MatchItem
                    label="Availability"
                    matched={
                      recommendedOfficer.availability ===
                      'Available'
                    }
                  />

                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-teal-200">

                  <div>

                    <span className="text-[9px] text-muted block">
                      Current workload
                    </span>

                    <span className="text-xs font-bold text-slate-900">
                      {recommendedOfficer.currentWorkload}
                    </span>

                  </div>

                  <div>

                    <span className="text-[9px] text-muted block">
                      Critical cases
                    </span>

                    <span className="text-xs font-bold text-slate-900">
                      {recommendedOfficer.criticalCasesCount}
                    </span>

                  </div>

                  <button
                    onClick={() => {
                      setSelectedOfficerId(
                        recommendedOfficer.id
                      );
                      setIsAssignModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    Assign
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                </div>

              </div>

              {/* CURRENT ASSIGNMENT */}

              <div className="p-4 rounded-2xl bg-slate-50 border border-line">

                <span className="text-[9px] uppercase font-black text-muted">
                  Current assignment
                </span>

                <div className="mt-2">

                  {selectedCase.assignedOfficer ? (

                    <>

                      <h3 className="text-sm font-black text-slate-900">
                        {selectedCase.assignedOfficer}
                      </h3>

                      <p className="text-[10px] text-muted mt-1">
                        Assigned officer
                      </p>

                    </>

                  ) : (

                    <>

                      <h3 className="text-sm font-black text-amber-700">
                        Unassigned
                      </h3>

                      <p className="text-[10px] text-muted mt-1">
                        This case requires officer allocation.
                      </p>

                    </>

                  )}

                </div>

              </div>

            </div>

          ) : (

            <div className="p-4 rounded-xl bg-slate-50 border border-line text-xs text-muted">
              No officer records are available for allocation.
            </div>

          )}

        </section>

      </div>

      {/* =====================================================
          FOLLOW-UP + REASSESSMENT
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FOLLOW-UP */}

        <section className="soft-card rounded-2xl p-5">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">

              <Calendar className="w-4 h-4 text-teal-600" />

              <div>

                <h2 className="text-sm font-black text-slate-900">
                  Follow-up Tracking
                </h2>

                <p className="text-[10px] text-muted">
                  Schedule and monitor welfare check-ins.
                </p>

              </div>

            </div>

            {latestFollowUp && (

              <span className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold">
                {latestFollowUp.status}
              </span>

            )}

          </div>

          {latestFollowUp ? (

            <div className="p-4 rounded-xl bg-slate-50 border border-line">

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <span className="text-[9px] uppercase font-bold text-muted">
                    Next / Latest
                  </span>

                  <p className="text-sm font-black text-slate-900 mt-1">
                    {latestFollowUp.date}
                  </p>

                </div>

                <div>

                  <span className="text-[9px] uppercase font-bold text-muted">
                    Type
                  </span>

                  <p className="text-sm font-black text-slate-900 mt-1">
                    {latestFollowUp.followUpType ||
                      'Check-in'}
                  </p>

                </div>

              </div>

              <p className="text-[10px] text-muted mt-3">
                {latestFollowUp.notes}
              </p>

            </div>

          ) : (

            <div className="p-4 rounded-xl bg-slate-50 border border-line text-xs text-muted">
              No follow-up has been scheduled yet.
            </div>

          )}

          <button
            onClick={() =>
              setCurrentRoute(
                'officer-followups'
              )
            }
            className="mt-3 w-full py-2.5 rounded-xl bg-white hover:bg-teal-50 border border-line text-teal-700 text-xs font-bold transition"
          >
            Open Follow-up Workspace
          </button>

        </section>

        {/* REASSESSMENT */}

        <section className="soft-card rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">

            <RefreshCw className="w-4 h-4 text-teal-600" />

            <div>

              <h2 className="text-sm font-black text-slate-900">
                Reassessment History
              </h2>

              <p className="text-[10px] text-muted">
                Previous AI-assisted assessment states.
              </p>

            </div>

          </div>

          {selectedCase.assessmentEvents?.length ? (

            <div className="space-y-2">

              {selectedCase.assessmentEvents
                .slice(-4)
                .map((event, index) => (

                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-line"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">

                        <span className="text-[9px] font-black text-teal-700">
                          {index + 1}
                        </span>

                      </div>

                      <div>

                        <span className="text-[10px] font-bold text-muted block">
                          {event.timestamp}
                        </span>

                        <span className="text-xs font-bold text-slate-900">
                          SVI {event.svi}
                        </span>

                      </div>

                    </div>

                    <span
                      className={`px-2 py-1 rounded-lg border text-[9px] font-black ${getPriorityClasses(
                        event.level
                      )}`}
                    >
                      {event.level}
                    </span>

                  </div>

                ))}

            </div>

          ) : (

            <div className="p-4 rounded-xl bg-slate-50 border border-line text-xs text-muted">
              No reassessment events recorded.
            </div>

          )}

        </section>

      </div>

      {/* =====================================================
          AUDIT TRAIL
      ===================================================== */}

      <section className="soft-card rounded-2xl p-5">

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">

            <ClipboardCheck className="w-4 h-4 text-teal-600" />

            <div>

              <h2 className="text-sm font-black text-slate-900">
                Activity & Audit Trail
              </h2>

              <p className="text-[10px] text-muted">
                Record of case decisions, assignments and actions.
              </p>

            </div>

          </div>

          <span className="text-[10px] font-bold text-muted">
            {caseAuditTrail.length} events
          </span>

        </div>

        {caseAuditTrail.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

            {caseAuditTrail.map((log) => (

              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-line"
              >

                <div className="flex items-center justify-between gap-3">

                  <span className="text-[10px] font-bold text-teal-700">
                    {log.action}
                  </span>

                  <span className="text-[9px] text-muted font-mono">
                    {log.timestamp}
                  </span>

                </div>

                <p className="text-[10px] text-muted mt-1">
                  {log.user} · {log.role}
                </p>

                {log.humanDecision && (

                  <p className="text-[11px] text-slate-900/80 mt-2">
                    {log.humanDecision}
                  </p>

                )}

                {log.reason && (

                  <p className="text-[10px] text-muted mt-1">
                    Reason: {log.reason}
                  </p>

                )}

              </div>

            ))}

          </div>

        ) : (

          <div className="p-4 rounded-xl bg-slate-50 border border-line text-xs text-muted">
            Initial assessment recorded. No officer actions have been logged yet.
          </div>

        )}

      </section>

      {/* =====================================================
          FOLLOW-UP QUICK SCHEDULE
      ===================================================== */}

      <section className="soft-card rounded-2xl p-5">

        <div className="flex items-center gap-2 mb-4">

          <Calendar className="w-4 h-4 text-teal-600" />

          <div>

            <h2 className="text-sm font-black text-slate-900">
              Schedule Follow-up
            </h2>

            <p className="text-[10px] text-muted">
              Create the next welfare or safety check-in directly from the case.
            </p>

          </div>

        </div>

        <form
          onSubmit={handleScheduleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >

          <div>

            <label className="block text-[10px] font-bold text-muted mb-1">
              Date
            </label>

            <input
              type="date"
              value={followUpDate}
              onChange={(e) =>
                setFollowUpDate(e.target.value)
              }
              className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900"
            />

          </div>

          <div>

            <label className="block text-[10px] font-bold text-muted mb-1">
              Follow-up Type
            </label>

            <select
              value={followUpType}
              onChange={(e) =>
                setFollowUpType(e.target.value)
              }
              className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900"
            >
              <option value="Safety Verification">
                Safety Verification
              </option>

              <option value="Field Visit">
                Field Visit
              </option>

              <option value="Call Check-in">
                Call Check-in
              </option>

              <option value="Legal Counseling">
                Legal Counseling
              </option>

              <option value="Psychological Support">
                Psychological Support
              </option>
            </select>

          </div>

          <div className="md:col-span-2">

            <label className="block text-[10px] font-bold text-muted mb-1">
              Check-in Notes
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={followUpNotes}
                onChange={(e) =>
                  setFollowUpNotes(e.target.value)
                }
                className="flex-1 bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900"
              />

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold whitespace-nowrap"
              >
                Schedule
              </button>

            </div>

          </div>

        </form>

      </section>

      {/* =====================================================
          MODIFY PRIORITY MODAL
      ===================================================== */}

      {isModifyModalOpen && (

        <ModalShell
          title="Modify Case Priority"
          onClose={() =>
            setIsModifyModalOpen(false)
          }
        >

          <div className="p-3 rounded-xl bg-slate-50 border border-line">

            <span className="text-[9px] uppercase font-bold text-muted block">
              AI assessment
            </span>

            <span className="text-sm font-black text-slate-900">
              {selectedCase.sviLevel} · SVI{' '}
              {selectedCase.sviScore}
            </span>

          </div>

          <form
            onSubmit={handleSaveModifyPriority}
            className="space-y-4"
          >

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-2">
                Officer Decision Priority
              </label>

              <div className="grid grid-cols-2 gap-2">

                {(
                  [
                    'LOW',
                    'MODERATE',
                    'HIGH',
                    'CRITICAL',
                  ] as SVILevel[]
                ).map((level) => (

                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setTargetPriority(level)
                    }
                    className={`py-2.5 rounded-xl border text-xs font-bold ${
                      targetPriority === level
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white border-line text-muted hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>

                ))}

              </div>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-1">
                Officer Justification
              </label>

              <textarea
                required
                rows={4}
                value={modifyReason}
                onChange={(e) =>
                  setModifyReason(
                    e.target.value
                  )
                }
                placeholder="Explain why the priority is being modified..."
                className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900"
              />

            </div>

            <ModalActions
              onCancel={() =>
                setIsModifyModalOpen(false)
              }
              submitLabel="Save Modification"
            />

          </form>

        </ModalShell>

      )}

      {/* =====================================================
          OVERRIDE MODAL
      ===================================================== */}

      {isOverrideModalOpen && (

        <ModalShell
          title="Override AI Assessment"
          onClose={() =>
            setIsOverrideModalOpen(false)
          }
        >

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">

            <p className="text-[10px] text-amber-800 leading-relaxed">

              Override should be used only when the
              authorized officer has a documented reason
              to depart from the AI-assisted assessment.

            </p>

          </div>

          <form
            onSubmit={handleOverride}
            className="space-y-4"
          >

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-1">
                Override Justification
              </label>

              <textarea
                required
                rows={5}
                value={overrideReason}
                onChange={(e) =>
                  setOverrideReason(
                    e.target.value
                  )
                }
                placeholder="Enter the officer's documented reason..."
                className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900"
              />

            </div>

            <ModalActions
              onCancel={() =>
                setIsOverrideModalOpen(
                  false
                )
              }
              submitLabel="Record Override"
            />

          </form>

        </ModalShell>

      )}

      {/* =====================================================
          ASSIGN OFFICER MODAL
      ===================================================== */}

      {isAssignModalOpen && (

        <ModalShell
          title="Assign Response Officer"
          onClose={() =>
            setIsAssignModalOpen(false)
          }
        >

          {rankedOfficers.length > 0 ? (

            <form
              onSubmit={handleConfirmAssignment}
              className="space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-slate-900/80 mb-2">
                  Officer
                </label>

                <select
                  value={selectedOfficerId}
                  onChange={(e) =>
                    setSelectedOfficerId(
                      e.target.value
                    )
                  }
                  className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900"
                >

                  {rankedOfficers.map(
                    (officer) => (

                      <option
                        key={officer.id}
                        value={officer.id}
                      >
                        {officer.name} ·{' '}
                        {officer.calculatedMatch}%
                        match ·{' '}
                        {officer.availability}
                      </option>

                    )
                  )}

                </select>

              </div>

              {selectedOfficerId && (

                <div className="p-4 rounded-xl bg-slate-50 border border-line">

                  {(() => {

                    const officer =
                      rankedOfficers.find(
                        (item) =>
                          item.id ===
                          selectedOfficerId
                      );

                    if (!officer) return null;

                    return (
                      <>

                        <div className="flex items-center justify-between">

                          <div>

                            <span className="text-[9px] uppercase font-bold text-muted">
                              Selected Officer
                            </span>

                            <h3 className="text-sm font-black text-slate-900">
                              {officer.name}
                            </h3>

                          </div>

                          <span className="px-2 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-black">
                            {officer.calculatedMatch}%
                          </span>

                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3">

                          <MatchItem
                            label="Jurisdiction"
                            matched={
                              officer.jurisdictionMatch
                            }
                          />

                          <MatchItem
                            label="Language"
                            matched={
                              officer.languageMatch
                            }
                          />

                          <MatchItem
                            label="Eligibility"
                            matched={
                              officer.eligibilityMatch
                            }
                          />

                          <MatchItem
                            label="Available"
                            matched={
                              officer.availability ===
                              'Available'
                            }
                          />

                        </div>

                      </>
                    );

                  })()}

                </div>

              )}

              <ModalActions
                onCancel={() =>
                  setIsAssignModalOpen(
                    false
                  )
                }
                submitLabel="Confirm Assignment"
              />

            </form>

          ) : (

            <div className="p-4 rounded-xl bg-slate-50 border border-line text-xs text-muted">
              No officer records are currently available.
            </div>

          )}

        </ModalShell>

      )}

      {/* =====================================================
          ESCALATION MODAL
      ===================================================== */}

      {isEscalateModalOpen && (

        <ModalShell
          title="Escalate Case"
          onClose={() => {
            setIsEscalateModalOpen(false);
            setEscalationNote('');
          }}
        >

          <div className="p-3 rounded-xl bg-emergency-50 border border-emergency-200">

            <div className="flex items-start gap-2.5">

              <AlertOctagon className="w-4 h-4 text-emergency-700 mt-0.5 shrink-0" />

              <div>
                <p className="text-xs font-black text-emergency-800">
                  Senior officer intervention
                </p>

                <p className="text-[10px] text-emergency-700 mt-1 leading-relaxed">
                  Provide the reason and officer note before escalating this case.
                  The action will be recorded in the audit trail.
                </p>
              </div>

            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-line">

            <div className="flex items-center justify-between gap-3">

              <div>
                <span className="text-[9px] uppercase font-bold text-muted block">
                  Case
                </span>

                <span className="text-sm font-black text-slate-900">
                  {selectedCase.id}
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${getPriorityClasses(
                  selectedCase.sviLevel
                )}`}
              >
                {selectedCase.sviLevel} · SVI {selectedCase.sviScore}
              </span>

            </div>

          </div>

          <form onSubmit={handleEscalate} className="space-y-4">

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-1.5">
                Escalation Reason
              </label>

              <select
                value={escalationReason}
                onChange={(event) =>
                  setEscalationReason(event.target.value)
                }
                className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value="Immediate safety concern">
                  Immediate safety concern
                </option>
                <option value="Increasing vulnerability">
                  Increasing vulnerability
                </option>
                <option value="Repeated risk indicators">
                  Repeated risk indicators
                </option>
                <option value="Additional senior review required">
                  Additional senior review required
                </option>
                <option value="Officer capacity or resource concern">
                  Officer capacity or resource concern
                </option>
                <option value="Other">
                  Other
                </option>
              </select>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-1.5">
                Escalate To
              </label>

              <select
                value={escalationTarget}
                onChange={(event) =>
                  setEscalationTarget(event.target.value)
                }
                className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value="Supervisor">
                  Supervisor
                </option>
                <option value="Senior Response Command">
                  Senior Response Command
                </option>
              </select>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-1.5">
                Current Priority
              </label>

              <div
                className={`px-3 py-2.5 rounded-xl border text-xs font-black ${getPriorityClasses(
                  selectedCase.sviLevel
                )}`}
              >
                {selectedCase.sviLevel}
              </div>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-900/80 mb-1.5">
                Officer Note
              </label>

              <textarea
                required
                rows={4}
                value={escalationNote}
                onChange={(event) =>
                  setEscalationNote(event.target.value)
                }
                placeholder="Explain why senior intervention is required..."
                className="w-full bg-white border border-line rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-teal-200"
              />

            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-[10px] text-amber-800 leading-relaxed">
                Escalation will be recorded with the selected reason, target,
                officer note, and timestamp in the case audit trail.
              </p>
            </div>

            <ModalActions
              onCancel={() => {
                setIsEscalateModalOpen(false);
                setEscalationNote('');
              }}
              submitLabel="Escalate Case"
            />

          </form>

        </ModalShell>

      )}

    </div>
  );
};

/* =========================================================
   INDICATOR CARD
========================================================= */

const IndicatorCard: React.FC<{
  title: string;
  values: string[];
  tone: 'emergency' | 'amber' | 'teal';
}> = ({
  title,
  values,
  tone,
}) => {

  const toneClasses = {
    emergency:
      'bg-emergency-50 border-emergency-200 text-emergency-700',
    amber:
      'bg-amber-50 border-amber-200 text-amber-700',
    teal:
      'bg-teal-50 border-teal-200 text-teal-700',
  };

  return (
    <div
      className={`p-3 rounded-xl border ${toneClasses[tone]}`}
    >

      <span className="text-[9px] uppercase tracking-wider font-black block mb-1">
        {title} indicators
      </span>

      {values.length > 0 ? (

        <div className="flex flex-wrap gap-1.5">

          {values.map((value, index) => (

            <span
              key={`${value}-${index}`}
              className="px-2 py-1 rounded-lg bg-white/70 border border-current/10 text-[10px] font-bold"
            >
              {value}
            </span>

          ))}

        </div>

      ) : (

        <span className="text-[10px] opacity-70">
          No indicators recorded
        </span>

      )}

    </div>
  );
};

/* =========================================================
   MATCH ITEM
========================================================= */

const MatchItem: React.FC<{
  label: string;
  matched?: boolean;
}> = ({
  label,
  matched,
}) => {

  return (
    <div className="flex items-center gap-1.5 text-[10px]">

      <CheckCircle2
        className={`w-3.5 h-3.5 ${
          matched
            ? 'text-teal-600'
            : 'text-line'
        }`}
      />

      <span
        className={
          matched
            ? 'text-teal-700 font-semibold'
            : 'text-muted'
        }
      >
        {label}
      </span>

    </div>
  );
};

/* =========================================================
   MODAL SHELL
========================================================= */

const ModalShell: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({
  title,
  onClose,
  children,
}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">

      <div className="bg-white max-w-md w-full rounded-2xl border border-line shadow-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-line flex items-center justify-between">

          <h3 className="text-base font-black text-slate-900">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-line/40 text-muted"
          >
            ×
          </button>

        </div>

        <div className="p-5 space-y-4">
          {children}
        </div>

      </div>

    </div>
  );
};

/* =========================================================
   MODAL ACTIONS
========================================================= */

const ModalActions: React.FC<{
  onCancel: () => void;
  submitLabel: string;
}> = ({
  onCancel,
  submitLabel,
}) => {

  return (
    <div className="flex justify-end gap-2 pt-2">

      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-line/40 text-slate-900/70 text-xs font-bold"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
      >
        {submitLabel}
      </button>

    </div>
  );
};