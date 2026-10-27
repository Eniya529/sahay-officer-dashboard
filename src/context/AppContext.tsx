import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type {
  PrimaryTab,
  AppRoute,
  UserRole,
  CaseData,
  AuditLogEntry,
  LanguageCode,
  LifecycleStage,
  Message,
  TimelinePoint,
  OfficerRecord,
  ScenarioItem,
  SVILevel,
} from '../types';

import {
  analyzeVictimMessage as callAssessmentService,
  getAssessmentHistory,
  type StructuredAiAssessment,
  type AssessmentEvent,
} from '../services/assessmentService';

import {
  getAuditLogs,
  saveCase,
  saveAssessment,
  saveOfficerAction,
  saveFollowUp as saveFollowUpService,
  updateCase,
} from '../services/caseService';

import {
  getOfficers,
  incrementOfficerWorkload,
} from '../services/officerService';

import { db } from '../services/firebase';

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';


// ============================================================
// CONTEXT TYPES
// ============================================================

export interface OfficerNotificationAlert {
  caseId: string;
  fromLevel: SVILevel;
  toLevel: SVILevel;
  reason: string;
  timestamp: string;
}

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;

  primaryTab: PrimaryTab;
  setPrimaryTab: (tab: PrimaryTab) => void;

  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  cases: CaseData[];

  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;

  selectedCase: CaseData | undefined;

  auditLogs: AuditLogEntry[];

  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;

  officerNotification: OfficerNotificationAlert | null;
  dismissOfficerNotification: () => void;

  officers: OfficerRecord[];

  assignOfficerToCase: (
    caseId: string,
    officerId: string
  ) => void;

  activeVictimCaseId: string;
  sessionMessages: Message[];

  currentSvi: number;
  previousSvi: number;
  sviChange: number;

  latestAnalysis: StructuredAiAssessment | null;
  isAnalyzing: boolean;
  statusText: string;

  sessionTimeline: TimelinePoint[];
  assessmentHistoryTimeline: AssessmentEvent[];

  submitVictimMessage: (text: string) => Promise<void>;
  selectScenario: (scenario: ScenarioItem) => Promise<void>;
  clearSession: () => void;
  loadDemoScenario: () => void;

  overrideCaseDecision: (
    caseId: string,
    decision:
      | 'accepted'
      | 'modified'
      | 'overridden'
      | 'escalated'
      | 'more_info',
    reason?: string,
    note?: string
  ) => void;

  updateCaseLifecycle: (
    caseId: string,
    stage: LifecycleStage
  ) => void;

  scheduleFollowUp: (
    caseId: string,
    date: string,
    notes: string
  ) => void;

  isWhySahayOpen: boolean;
  setIsWhySahayOpen: (open: boolean) => void;

  isResponsibleAiOpen: boolean;
  setIsResponsibleAiOpen: (open: boolean) => void;
}


// ============================================================
// CONTEXT
// ============================================================

const AppContext =
  createContext<AppContextType | undefined>(undefined);


// ============================================================
// FIREBASE HELPERS
// ============================================================

const normalizeRiskLevel = (
  value: unknown
): SVILevel => {

  const level =
    String(value || 'LOW')
      .toUpperCase()
      .trim();

  if (level === 'CRITICAL') return 'CRITICAL';
  if (level === 'HIGH') return 'HIGH';
  if (level === 'MODERATE') return 'MODERATE';

  return 'LOW';
};


const normalizeConfidence = (
  value: unknown
): number => {

  const numberValue =
    Number(value ?? 0);

  if (!Number.isFinite(numberValue)) {
    return 0;
  }

  // Firebase ML normally stores confidence as 0–1.
  // Officer UI expects percentage 0–100.
  if (numberValue >= 0 && numberValue <= 1) {
    return Math.round(numberValue * 100);
  }

  return Math.round(
    Math.max(0, Math.min(100, numberValue))
  );
};


const normalizeArray = (
  value: unknown
): string[] => {

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item))
    .filter(Boolean);
};


const firebaseDateToString = (
  value: any
): string => {

  if (!value) {
    return '';
  }

  try {

    if (
      typeof value?.toDate === 'function'
    ) {
      return value.toDate().toISOString();
    }

    if (
      typeof value === 'string'
    ) {
      return value;
    }

    if (
      value instanceof Date
    ) {
      return value.toISOString();
    }

    return String(value);

  } catch {

    return String(value);
  }
};


const formatDisplayDate = (
  value: any
): string => {

  const raw =
    firebaseDateToString(value);

  if (!raw) {
    return '—';
  }

  const date =
    new Date(raw);

  if (
    Number.isNaN(date.getTime())
  ) {
    return raw;
  }

  return date.toLocaleString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
};


const getAssessmentTime = (
  assessment: any
): number => {

  const value =
    assessment?.createdAt ??
    assessment?.timestamp ??
    assessment?.updatedAt;

  if (
    value &&
    typeof value?.toDate === 'function'
  ) {
    return value.toDate().getTime();
  }

  const parsed =
    new Date(value || 0).getTime();

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};


const getMessageTime = (
  message: any
): number => {

  const value =
    message?.timestamp ??
    message?.createdAt ??
    message?.updatedAt;

  if (
    value &&
    typeof value?.toDate === 'function'
  ) {
    return value.toDate().getTime();
  }

  const parsed =
    new Date(value || 0).getTime();

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};


// ============================================================
// CONVERT FIREBASE MESSAGE → UI MESSAGE
// ============================================================

const mapFirebaseMessage = (
  raw: any,
  documentId: string
): Message => {

  const senderValue =
    String(
      raw?.sender || 'victim'
    ).toLowerCase();

  const sender =
    senderValue === 'assistant'
      ? 'assistant'
      : 'victim';

  return {
    id:
      String(
        raw?.messageId ||
        raw?.id ||
        documentId
      ),

    sender,

    text:
      String(
        raw?.text ||
        raw?.message ||
        ''
      ),

    timestamp:
      formatDisplayDate(
        raw?.timestamp ||
        raw?.createdAt
      ),

    ...(raw?.sviAfter !== undefined
      ? {
          sviAfter:
            Number(raw.sviAfter),
        }
      : {}),
  };
};


// ============================================================
// CONVERT FIREBASE ASSESSMENT → UI ASSESSMENT
// ============================================================

const mapFirebaseAssessment = (
  raw: any,
  documentId: string
): any => {

  const level =
    normalizeRiskLevel(
      raw?.riskLevel ??
      raw?.level
    );

  const svi =
    Number(
      raw?.svi ??
      raw?.latestSvi ??
      0
    );

  const confidence =
    Number(
      raw?.confidence ?? 0
    );

  return {

    id:
      String(
        raw?.assessmentId ||
        raw?.id ||
        documentId
      ),

    assessmentId:
      String(
        raw?.assessmentId ||
        raw?.id ||
        documentId
      ),

    caseId:
      String(
        raw?.caseId || ''
      ),

    messageId:
      String(
        raw?.messageId || ''
      ),

    svi,

    level,

    riskLevel:
      level,

    confidence,

    confidenceLevel:
      String(
        raw?.confidenceLevel || ''
      ),

    riskTrend:
      String(
        raw?.riskTrend || ''
      ),

    riskEscalation:
      Boolean(
        raw?.riskEscalation
      ),

    emotionalIndicators:
      normalizeArray(
        raw?.emotionalIndicators
      ),

    contextualIndicators:
      normalizeArray(
        raw?.contextualIndicators
      ),

    safetyIndicators:
      normalizeArray(
        raw?.safetyIndicators
      ),

    keyEvidence:
      normalizeArray(
        raw?.keyEvidence
      ),

    reasoning:
      String(
        raw?.reasoning || ''
      ),

    adaptiveQuestion:
      String(
        raw?.adaptiveQuestion || ''
      ),

    recommendedAction:
      String(
        raw?.recommendedAction || ''
      ),

    requiresHumanReview:
      Boolean(
        raw?.requiresHumanReview
      ),

    createdAt:
      firebaseDateToString(
        raw?.createdAt ||
        raw?.timestamp
      ),
  };
};


// ============================================================
// BUILD ONE COMPLETE CASE FROM FIREBASE
// ============================================================

const loadCompleteCase = async (
  caseId: string,
  parentData: any
): Promise<CaseData> => {

  // ----------------------------------------------------------
  // MESSAGES
  // ----------------------------------------------------------

  let messages: Message[] = [];

  try {

    const messagesRef =
      collection(
        db,
        'cases',
        caseId,
        'messages'
      );

    const messagesQuery =
      query(
        messagesRef,
        orderBy('timestamp', 'asc')
      );

    const snapshot =
      await getDocs(
        messagesQuery
      );

    messages =
      snapshot.docs
        .map((doc) =>
          mapFirebaseMessage(
            doc.data(),
            doc.id
          )
        )
        .filter(
          (message) =>
            message.text.trim().length > 0
        );

  } catch (error) {

    console.warn(
      `⚠️ Could not load messages for ${caseId}. Trying without ordering...`,
      error
    );

    try {

      const messagesRef =
        collection(
          db,
          'cases',
          caseId,
          'messages'
        );

      const snapshot =
        await getDocs(
          messagesRef
        );

      messages =
        snapshot.docs
          .map((doc) =>
            mapFirebaseMessage(
              doc.data(),
              doc.id
            )
          )
          .filter(
            (message) =>
              message.text.trim().length > 0
          );

      messages.sort(
        (a, b) =>
          getMessageTime(a) -
          getMessageTime(b)
      );

    } catch (fallbackError) {

      console.error(
        `❌ Messages failed for ${caseId}:`,
        fallbackError
      );

      messages = [];
    }
  }


  // ----------------------------------------------------------
  // ASSESSMENTS
  // ----------------------------------------------------------

  let assessments: any[] = [];

  try {

    const assessmentsRef =
      collection(
        db,
        'cases',
        caseId,
        'assessments'
      );

    const assessmentsQuery =
      query(
        assessmentsRef,
        orderBy('createdAt', 'asc')
      );

    const snapshot =
      await getDocs(
        assessmentsQuery
      );

    assessments =
      snapshot.docs
        .map((doc) =>
          mapFirebaseAssessment(
            {
              ...doc.data(),
              caseId,
            },
            doc.id
          )
        );

  } catch (error) {

    console.warn(
      `⚠️ Could not load ordered assessments for ${caseId}.`,
      error
    );

    try {

      const assessmentsRef =
        collection(
          db,
          'cases',
          caseId,
          'assessments'
        );

      const snapshot =
        await getDocs(
          assessmentsRef
        );

      assessments =
        snapshot.docs
          .map((doc) =>
            mapFirebaseAssessment(
              {
                ...doc.data(),
                caseId,
              },
              doc.id
            )
          );

    } catch (fallbackError) {

      console.error(
        `❌ Assessments failed for ${caseId}:`,
        fallbackError
      );

      assessments = [];
    }
  }


  // Sort assessment history safely.
  assessments.sort(
    (a, b) =>
      getAssessmentTime(a) -
      getAssessmentTime(b)
  );


  // ----------------------------------------------------------
  // LATEST ASSESSMENT
  // ----------------------------------------------------------

  const latestAssessment =
    assessments.length > 0
      ? assessments[
          assessments.length - 1
        ]
      : null;


  // ----------------------------------------------------------
  // CURRENT ML VALUES
  // ----------------------------------------------------------

  const latestSvi =
    latestAssessment
      ? Number(
          latestAssessment.svi
        )
      : Number(
          parentData?.latestSvi ??
          parentData?.svi ??
          0
        );


  const latestLevel =
    latestAssessment
      ? normalizeRiskLevel(
          latestAssessment.level ??
          latestAssessment.riskLevel
        )
      : normalizeRiskLevel(
          parentData?.latestRiskLevel ??
          parentData?.riskLevel ??
          parentData?.sviLevel
        );


  const latestConfidence =
    latestAssessment
      ? normalizeConfidence(
          latestAssessment.confidence
        )
      : normalizeConfidence(
          parentData?.confidence
        );


  // ----------------------------------------------------------
  // INDICATORS
  // ----------------------------------------------------------

  const emotionalIndicators =
    latestAssessment
      ?.emotionalIndicators ||
    normalizeArray(
      parentData?.emotionalIndicators
    );


  const contextualIndicators =
    latestAssessment
      ?.contextualIndicators ||
    normalizeArray(
      parentData?.contextualIndicators
    );


  const safetyIndicators =
    latestAssessment
      ?.safetyIndicators ||
    normalizeArray(
      parentData?.safetyIndicators
    );


  const keyEvidence =
    latestAssessment
      ?.keyEvidence ||
    normalizeArray(
      parentData?.keyEvidence
    );


  const reasoning =
    latestAssessment?.reasoning ||
    String(
      parentData?.reasoning || ''
    );


  const recommendedAction =
    latestAssessment?.recommendedAction ||
    String(
      parentData?.recommendedAction || ''
    );


  // ----------------------------------------------------------
  // INDICATORS FOR EXISTING UI
  // ----------------------------------------------------------

  const allIndicatorData = [
    ...emotionalIndicators.map(
      (item: string, index: number) => ({
        id:
          `emotional-${caseId}-${index}`,

        name:
          item,

        category:
          'fear' as const,

        confidence:
          latestConfidence,

        contribution:
          0,

        evidence:
          keyEvidence[index] ||
          '',
      })
    ),

    ...contextualIndicators.map(
      (item: string, index: number) => ({
        id:
          `context-${caseId}-${index}`,

        name:
          item,

        category:
          'threat' as const,

        confidence:
          latestConfidence,

        contribution:
          0,

        evidence:
          keyEvidence[index] ||
          '',
      })
    ),

    ...safetyIndicators.map(
      (item: string, index: number) => ({
        id:
          `safety-${caseId}-${index}`,

        name:
          item,

        category:
          'safety' as const,

        confidence:
          latestConfidence,

        contribution:
          0,

        evidence:
          keyEvidence[index] ||
          '',
      })
    ),
  ];


  // ----------------------------------------------------------
  // SVI TIMELINE
  // ----------------------------------------------------------

  const timeline: TimelinePoint[] =
    assessments.map(
      (assessment: any, index: number) => ({
        time:
          assessment.createdAt
            ? formatDisplayDate(
                assessment.createdAt
              )
            : `Assessment ${index + 1}`,

        svi:
          Number(
            assessment.svi || 0
          ),

        label:
          normalizeRiskLevel(
            assessment.level
          ),
      })
    );


  // ----------------------------------------------------------
  // ASSESSMENT EVENTS
  // ----------------------------------------------------------

  const assessmentEvents: any[] =
    assessments.map(
      (assessment: any) => ({
        id:
          assessment.assessmentId,

        assessmentId:
          assessment.assessmentId,

        caseId,

        messageId:
          assessment.messageId,

        svi:
          assessment.svi,

        level:
          assessment.level,

        confidence:
          assessment.confidence,

        confidenceLevel:
          assessment.confidenceLevel,

        riskTrend:
          assessment.riskTrend,

        riskEscalation:
          assessment.riskEscalation,

        adaptiveQuestion:
          assessment.adaptiveQuestion,

        timestamp:
          assessment.createdAt,

        createdAt:
          assessment.createdAt,

        emotionalIndicators:
          assessment.emotionalIndicators,

        contextualIndicators:
          assessment.contextualIndicators,

        safetyIndicators:
          assessment.safetyIndicators,

        keyEvidence:
          assessment.keyEvidence,

        reasoning:
          assessment.reasoning,

        recommendedAction:
          assessment.recommendedAction,

        requiresHumanReview:
          assessment.requiresHumanReview,
      })
    );


  // ----------------------------------------------------------
  // KEY STATEMENTS
  // ----------------------------------------------------------

  const keyStatements =
    keyEvidence.map(
      (evidence: string) => ({
        phrase:
          evidence,

        context:
          'Evidence extracted from victim conversation',

        severity:
          latestLevel,
      })
    );


  // ----------------------------------------------------------
  // FOLLOW-UP HISTORY
  // ----------------------------------------------------------

  const followUpHistory =
    Array.isArray(
      parentData?.followUpHistory
    )
      ? parentData.followUpHistory
      : [];


  // ----------------------------------------------------------
  // CASE DATA
  // ----------------------------------------------------------

  const completeCase =
    {
      // Preserve any fields already returned by the
      // existing service/type.
      ...parentData,

      id:
        String(
          parentData?.caseId ||
          parentData?.id ||
          caseId
        ),

      complainantName:
        String(
          parentData?.complainantName ||
          parentData?.victimName ||
          parentData?.name ||
          'Victim / Complainant'
        ),

      phone:
        String(
          parentData?.phone ||
          parentData?.phoneNumber ||
          ''
        ),

      language:
        String(
          parentData?.language ||
          'en'
        ).toUpperCase(),

      sviScore:
        latestSvi,

      sviLevel:
        latestLevel,

      confidence:
        latestConfidence,

      confidenceLevel:
        latestAssessment?.confidenceLevel ||
        parentData?.confidenceLevel ||
        '',

      riskTrend:
        latestAssessment?.riskTrend ||
        parentData?.riskTrend ||
        '',

      riskEscalation:
        Boolean(
          latestAssessment?.riskEscalation ??
          parentData?.riskEscalation ??
          false
        ),

      requiresHumanReview:
        Boolean(
          latestAssessment?.requiresHumanReview ??
          parentData?.requiresHumanReview ??
          false
        ),

      adaptiveQuestion:
        latestAssessment?.adaptiveQuestion ||
        parentData?.adaptiveQuestion ||
        '',

      priority:
        latestLevel,

      status:
        parentData?.status ||
        (
          latestAssessment?.requiresHumanReview
            ? 'AWAITING_REVIEW'
            : 'NEW'
        ),

      lifecycleStage:
        parentData?.lifecycleStage ||
        'AI Assessment',

      createdTime:
        parentData?.createdTime ||
        formatDisplayDate(
          parentData?.createdAt
        ),

      lastUpdate:
        formatDisplayDate(
          parentData?.updatedAt ||
          parentData?.createdAt
        ),

      summary:
        parentData?.summary ||
        parentData?.initialConcern ||
        reasoning ||
        'Assessment information available.',

      location:
        parentData?.location ||
        parentData?.district ||
        '',

      assignedOfficer:
        parentData?.assignedOfficer ||
        '',

      assignedOfficerId:
        parentData?.assignedOfficerId ||
        '',

      messages,

      assessmentEvents,

      indicators:
        allIndicatorData,

      timeline,

      keyStatements,

      emotionalIndicators,

      contextualIndicators,

      safetyIndicators,

      keyEvidence,

      reasoning,

      recommendedAction,

      followUpHistory,

      traumaModeActive:
        latestSvi >= 70,

      traumaStrategy:
        latestSvi >= 70
          ? {
              title:
                'Trauma-Aware Safety Protocol Active',

              description:
                reasoning,

              actionPlan:
                recommendedAction,
            }
          : parentData?.traumaStrategy,
    } as CaseData;


  return completeCase;
};


// ============================================================
// PROVIDER
// ============================================================

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // ----------------------------------------------------------
  // APP STATE
  // ----------------------------------------------------------

  const [currentRoute, setCurrentRoute] =
    useState<AppRoute>(
      'officer-dash'
    );

  const [primaryTab, setPrimaryTab] =
    useState<PrimaryTab>(
      'live'
    );

  const [userRole, setUserRole] =
    useState<UserRole>(
      'victim'
    );


  // ----------------------------------------------------------
  // FIREBASE DATA
  // ----------------------------------------------------------

  const [cases, setCases] =
    useState<CaseData[]>([]);

  const [auditLogs, setAuditLogs] =
    useState<AuditLogEntry[]>([]);

  const [officers, setOfficers] =
    useState<OfficerRecord[]>([]);


  // IMPORTANT:
  // No SH-1042 hardcode.
  const [selectedCaseId, setSelectedCaseId] =
    useState<string>('');


  const [language, setLanguage] =
    useState<LanguageCode>('en');


  // ----------------------------------------------------------
  // REAL-TIME FIREBASE LOADING
  // ----------------------------------------------------------

  useEffect(() => {

    let isMounted = true;

    console.log(
      '🔥 Starting SAHAY Firestore realtime listener...'
    );


    const casesRef =
      collection(
        db,
        'cases'
      );


    const unsubscribe =
      onSnapshot(
        casesRef,

        async (snapshot) => {

          try {

            console.log(
              `🔥 Firebase cases changed: ${snapshot.docs.length} case(s)`
            );


            const loadedCases =
              await Promise.all(
                snapshot.docs.map(
                  async (caseDoc) => {

                    const rawData =
                      caseDoc.data();

                    return loadCompleteCase(
                      caseDoc.id,
                      rawData
                    );
                  }
                )
              );


            if (!isMounted) {
              return;
            }


            // Newest/most recently updated first.
            loadedCases.sort(
              (a: any, b: any) => {

                const aTime =
                  new Date(
                    String(
                      a.lastUpdate || ''
                    )
                  ).getTime();

                const bTime =
                  new Date(
                    String(
                      b.lastUpdate || ''
                    )
                  ).getTime();

                return (
                  (Number.isFinite(bTime)
                    ? bTime
                    : 0) -
                  (Number.isFinite(aTime)
                    ? aTime
                    : 0)
                );
              }
            );


            setCases(
              loadedCases
            );


            // If currently selected case disappeared,
            // select the first real Firebase case.
            setSelectedCaseId(
              (currentSelected) => {

                const stillExists =
                  loadedCases.some(
                    (c) =>
                      c.id ===
                      currentSelected
                  );


                if (
                  stillExists
                ) {
                  return currentSelected;
                }


                return (
                  loadedCases[0]?.id ||
                  ''
                );
              }
            );


            console.log(
              '✅ Complete Firebase cases loaded:',
              loadedCases
            );

          } catch (error) {

            console.error(
              '❌ Failed to build Firebase cases:',
              error
            );

          }

        },

        (error) => {

          console.error(
            '❌ Firestore realtime listener error:',
            error
          );

        }
      );


    // --------------------------------------------------------
    // LOAD AUDIT LOGS + OFFICERS
    // --------------------------------------------------------

    const loadSupportingData =
      async () => {

        try {

          const [
            firebaseLogs,
            firebaseOfficers,
          ] =
            await Promise.all([
              getAuditLogs(),
              getOfficers(),
            ]);


          if (!isMounted) {
            return;
          }


          setAuditLogs(
            firebaseLogs
          );

          setOfficers(
            firebaseOfficers
          );


          console.log(
            '✅ Firebase officers loaded:',
            firebaseOfficers
          );

          console.log(
            '✅ Firebase audit logs loaded:',
            firebaseLogs
          );

        } catch (error) {

          console.error(
            '❌ Failed to load supporting Firebase data:',
            error
          );

        }
      };


    loadSupportingData();


    return () => {

      isMounted = false;

      unsubscribe();

      console.log(
        '🛑 SAHAY Firestore listener stopped'
      );

    };

  }, []);


  // ----------------------------------------------------------
  // OFFICER NOTIFICATION
  // ----------------------------------------------------------

  const [
    officerNotification,
    setOfficerNotification,
  ] =
    useState<OfficerNotificationAlert | null>(
      null
    );


  // ----------------------------------------------------------
  // MODALS
  // ----------------------------------------------------------

  const [
    isWhySahayOpen,
    setIsWhySahayOpen,
  ] = useState(false);


  const [
    isResponsibleAiOpen,
    setIsResponsibleAiOpen,
  ] = useState(false);


  // ----------------------------------------------------------
  // ACTIVE VICTIM SESSION
  // ----------------------------------------------------------

  const [
    activeVictimCaseId,
    setActiveVictimCaseId,
  ] =
    useState<string>('');


  const [
    sessionMessages,
    setSessionMessages,
  ] =
    useState<Message[]>([
      {
        id: 'init-1',

        sender: 'assistant',

        text:
          'Namaste. Welcome to SAHAY support assistant. You can speak or type what happened in your own words.',

        timestamp:
          'Just now',
      },
    ]);


  const [currentSvi, setCurrentSvi] =
    useState<number>(0);


  const [previousSvi, setPreviousSvi] =
    useState<number>(0);


  const [sviChange, setSviChange] =
    useState<number>(0);


  const [latestAnalysis, setLatestAnalysis] =
    useState<StructuredAiAssessment | null>(
      null
    );


  const [isAnalyzing, setIsAnalyzing] =
    useState<boolean>(false);


  const [statusText, setStatusText] =
    useState<string>(
      'Ready for input'
    );


  const [sessionTimeline, setSessionTimeline] =
    useState<TimelinePoint[]>([
      {
        time: 'Start',
        svi: 0,
        label: 'Session Ready',
      },
    ]);


  // ----------------------------------------------------------
  // SELECTED CASE
  // ----------------------------------------------------------

  const selectedCase =
    cases.find(
      (c) =>
        c.id ===
        selectedCaseId
    ) ||
    cases[0];


  // ----------------------------------------------------------
  // ASSESSMENT HISTORY
  // ----------------------------------------------------------

  const assessmentHistoryTimeline =
    selectedCase?.assessmentEvents ||
    (
      activeVictimCaseId
        ? getAssessmentHistory(
            activeVictimCaseId
          )
        : []
    );


  // ----------------------------------------------------------
  // DISMISS NOTIFICATION
  // ----------------------------------------------------------

  const dismissOfficerNotification =
    () =>
      setOfficerNotification(
        null
      );


  // ==========================================================
  // VICTIM MESSAGE → AI → FIREBASE
  // ==========================================================

  const submitVictimMessage = async (
    text: string
  ) => {

    if (
      !text.trim() ||
      isAnalyzing
    ) {
      return;
    }


    setIsAnalyzing(true);

    setStatusText(
      'Understanding your message...'
    );


    const timestamp =
      new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      );


    const userMsgId =
      `MSG-${Date.now()}`;


    const newVictimMsg: Message = {
      id:
        userMsgId,

      sender:
        'victim',

      text,

      timestamp,
    };


    const updatedMessages = [
      ...sessionMessages,
      newVictimMsg,
    ];


    setSessionMessages(
      updatedMessages
    );


    const turns =
      updatedMessages.map(
        (m) => ({
          sender:
            m.sender,

          text:
            m.text,
        })
      );


    setTimeout(() => {

      setStatusText(
        'Evaluating context & safety indicators...'
      );

    }, 300);


    try {

      const structuredResult =
        await callAssessmentService(
          activeVictimCaseId,
          userMsgId,
          turns,
          language
        );


      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            400
          )
      );


      setStatusText(
        'Assessment updated'
      );


      const prevScore =
        currentSvi;


      const nextScore =
        structuredResult.svi;


      const delta =
        nextScore -
        prevScore;


      const prevLevel =
        latestAnalysis?.level ||
        'LOW';


      const nextLevel =
        structuredResult.level;


      setPreviousSvi(
        prevScore
      );

      setCurrentSvi(
        nextScore
      );

      setSviChange(
        delta
      );

      setLatestAnalysis(
        structuredResult
      );


      const msgNum =
        updatedMessages.filter(
          (m) =>
            m.sender ===
            'victim'
        ).length;


      const newTimelinePoint:
        TimelinePoint = {

        time:
          `Msg ${msgNum}`,

        svi:
          nextScore,

        label:
          `${nextLevel} (${
            delta >= 0
              ? `+${delta}`
              : delta
          })`,
      };


      const updatedTimeline = [
        ...sessionTimeline,
        newTimelinePoint,
      ];


      setSessionTimeline(
        updatedTimeline
      );


      const assistantMsg:
        Message = {

        id:
          `ast-${Date.now()}`,

        sender:
          'assistant',

        text:
          structuredResult.adaptiveQuestion,

        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          ),

        sviAfter:
          nextScore,
      };


      const finalSessionMsgs = [
        ...updatedMessages,
        assistantMsg,
      ];


      setSessionMessages(
        finalSessionMsgs
      );


      const levelRank:
        Record<SVILevel, number> = {

        LOW: 1,

        MODERATE: 2,

        HIGH: 3,

        CRITICAL: 4,
      };


      if (
        levelRank[nextLevel] >
        levelRank[prevLevel]
      ) {

        setOfficerNotification({

          caseId:
            activeVictimCaseId,

          fromLevel:
            prevLevel,

          toLevel:
            nextLevel,

          reason:
            structuredResult.reasoning ||
            'Additional safety-related information identified.',

          timestamp:
            new Date().toLocaleTimeString(
              [],
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
        });

      }


      const mappedIndicators =
        structuredResult.keyEvidence.map(
          (ev, idx) => ({
            id:
              `ind-live-${Date.now()}-${idx}`,

            name:
              `Distress Excerpt ${idx + 1}`,

            category:
              nextLevel === 'CRITICAL'
                ? ('threat' as const)
                : nextLevel === 'HIGH'
                  ? ('fear' as const)
                  : ('safety' as const),

            confidence:
              Math.round(
                structuredResult.confidence *
                100
              ),

            contribution:
              40,

            evidence:
              ev,
          })
        );


      const caseEvents =
        getAssessmentHistory(
          activeVictimCaseId
        );


      const updatedCase:
        CaseData = {

        id:
          activeVictimCaseId,

        complainantName:
          'Victim / Complainant (Active Channel)',

        phone:
          '+91 98******10',

        language:
          language.toUpperCase(),

        sviScore:
          nextScore,

        sviLevel:
          nextLevel,

        confidence:
          Math.round(
            structuredResult.confidence *
            100
          ),

        confidenceLevel:
          '',

        riskTrend:
          '',

        riskEscalation:
          false,

        requiresHumanReview:
          structuredResult.requiresHumanReview,

        adaptiveQuestion:
          structuredResult.adaptiveQuestion,

        priority:
          nextLevel,

        status:
          'Requires Human Review' as any,

        lifecycleStage:
          'AI Assessment',

        createdTime:
          'Just now',

        lastUpdate:
          'Just now',

        summary:
          structuredResult.reasoning,

        indicators:
          mappedIndicators,

        timeline:
          updatedTimeline,

        keyStatements:
          structuredResult.keyEvidence.map(
            (ev) => ({
              phrase:
                ev,

              context:
                'Conversation quote excerpt',

              severity:
                nextLevel,
            })
          ),

        messages:
          finalSessionMsgs,

        recommendedAction:
          structuredResult.recommendedAction,

        reasoning:
          structuredResult.reasoning,

        emotionalIndicators:
          structuredResult.emotionalIndicators,

        contextualIndicators:
          structuredResult.contextualIndicators,

        safetyIndicators:
          structuredResult.safetyIndicators,

        keyEvidence:
          structuredResult.keyEvidence,

        followUpHistory:
          [],

        traumaModeActive:
          nextScore >= 70,

        traumaStrategy:
          {
            title:
              'Trauma-Aware Safety Protocol Active',

            description:
              structuredResult.reasoning,

            actionPlan:
              structuredResult.recommendedAction,
          },

        assessmentEvents:
          caseEvents,
      };


      setCases(
        (prev) => {

          const exists =
            prev.some(
              (c) =>
                c.id ===
                activeVictimCaseId
            );


          if (exists) {

            return prev.map(
              (c) =>
                c.id ===
                activeVictimCaseId
                  ? updatedCase
                  : c
            );

          }


          return [
            updatedCase,
            ...prev,
          ];
        }
      );


      setSelectedCaseId(
        activeVictimCaseId
      );


      try {

        await saveCase(
          updatedCase
        );


        await saveAssessment(
          activeVictimCaseId,
          {
            assessmentId:
              `ASM-${Date.now()}`,

            caseId:
              activeVictimCaseId,

            messageId:
              userMsgId,

            svi:
              structuredResult.svi,

            level:
              structuredResult.level,

            confidence:
              structuredResult.confidence,

            emotionalIndicators:
              structuredResult.emotionalIndicators,

            contextualIndicators:
              structuredResult.contextualIndicators,

            safetyIndicators:
              structuredResult.safetyIndicators,

            keyEvidence:
              structuredResult.keyEvidence,

            reasoning:
              structuredResult.reasoning,

            adaptiveQuestion:
              structuredResult.adaptiveQuestion,

            recommendedAction:
              structuredResult.recommendedAction,

            requiresHumanReview:
              structuredResult.requiresHumanReview,
          }
        );


        console.log(
          '✅ Case + ML assessment saved to Firebase'
        );

      } catch (firebaseError) {

        console.error(
          '❌ Failed to save case/assessment:',
          firebaseError
        );

      }


      setStatusText(
        'Information received safely'
      );

    } catch (err) {

      console.error(
        '❌ Error during victim message analysis:',
        err
      );

      setStatusText(
        'Information recorded'
      );

    } finally {

      setIsAnalyzing(
        false
      );

    }

  };


  // ==========================================================
  // SCENARIO
  // ==========================================================

  const selectScenario = async (
    scenario: ScenarioItem
  ) => {

    clearSession();

    setCurrentRoute(
      'victim-report'
    );

    await submitVictimMessage(
      scenario.initialMessage
    );

  };


  // ==========================================================
  // CLEAR SESSION
  // ==========================================================

  const clearSession = () => {

    const newCaseId =
      `SH-${Math.floor(
        1000 +
        Math.random() *
        9000
      )}`;


    setActiveVictimCaseId(
      newCaseId
    );


    setSessionMessages([
      {
        id:
          `init-${Date.now()}`,

        sender:
          'assistant',

        text:
          'Namaste. New conversation started. Tell us what happened in your own words.',

        timestamp:
          'Just now',
      },
    ]);


    setCurrentSvi(0);

    setPreviousSvi(0);

    setSviChange(0);

    setLatestAnalysis(
      null
    );

    setSessionTimeline([
      {
        time:
          'Start',

        svi:
          0,

        label:
          'Session Ready',
      },
    ]);

    setStatusText(
      'Ready for input'
    );

  };


  // ==========================================================
  // DEMO SCENARIO
  // ==========================================================

  const loadDemoScenario =
    async () => {

      clearSession();

      setIsAnalyzing(
        true
      );

      setStatusText(
        'Loading concern context...'
      );

      await submitVictimMessage(
        'They threatened me yesterday and I am afraid to go home.'
      );

    };


  // ==========================================================
  // OFFICER ASSIGNMENT
  // ==========================================================

  const assignOfficerToCase =
    async (
      caseId: string,
      officerId: string
    ) => {

      try {

        const officer =
          officers.find(
            (o) =>
              o.id ===
              officerId
          );


        if (!officer) {
          return;
        }


        const updatedCase =
          await updateCase(
            caseId,
            {
              assignedOfficer:
                officer.name,

              assignedOfficerId:
                officer.id,

              status:
                'ASSIGNED',

              lifecycleStage:
                'Assigned',
            }
          );


        if (updatedCase) {

          setCases(
            (prev) =>
              prev.map(
                (c) =>
                  c.id ===
                  caseId
                    ? {
                        ...c,
                        ...updatedCase,
                      }
                    : c
              )
          );

        }


        const updatedOfficer =
          await incrementOfficerWorkload(
            officerId
          );


        if (updatedOfficer) {

          setOfficers(
            (prev) =>
              prev.map(
                (o) =>
                  o.id ===
                  officerId
                    ? updatedOfficer
                    : o
              )
          );

        }


        const auditEntry:
          AuditLogEntry = {

          id:
            `audit-${Date.now()}`,

          timestamp:
            new Date()
              .toISOString()
              .replace(
                'T',
                ' '
              )
              .substring(
                0,
                19
              ),

          user:
            'Supervisor System',

          role:
            'System Administrator',

          action:
            'Officer Assigned',

          caseId,

          aiRecommendation:
            'Smart Allocation Matched Officer',

          humanDecision:
            `Assigned to ${officer.name} (${officer.id})`,

          reason:
            `Matched by District: ${officer.district}, Languages: ${officer.languages.join(', ')}`,
        };


        setAuditLogs(
          (prev) => [
            auditEntry,
            ...prev,
          ]
        );


        console.log(
          '✅ Officer assigned and workload updated'
        );

      } catch (error) {

        console.error(
          '❌ Officer assignment failed:',
          error
        );

      }

    };


  // ==========================================================
  // OFFICER OVERRIDE
  // ==========================================================

  const overrideCaseDecision =
    async (
      caseId: string,
      decision:
        | 'accepted'
        | 'modified'
        | 'overridden'
        | 'escalated'
        | 'more_info',
      reason?: string,
      note?: string
    ) => {

      try {

        const {
          auditEntry,
          updatedCase,
        } =
          await saveOfficerAction(
            caseId,
            decision,
            undefined,
            reason,
            note
          );


        setAuditLogs(
          (prev) => [
            auditEntry,
            ...prev,
          ]
        );


        if (updatedCase) {

          setCases(
            (prev) =>
              prev.map(
                (c) =>
                  c.id ===
                  caseId
                    ? {
                        ...c,
                        ...updatedCase,
                      }
                    : c
              )
          );

        }

      } catch (error) {

        console.error(
          '❌ Officer decision failed:',
          error
        );

      }

    };


  // ==========================================================
  // CASE LIFECYCLE
  // ==========================================================

  const updateCaseLifecycle =
    async (
      caseId: string,
      stage: LifecycleStage
    ) => {

      try {

        const updatedCase =
          await updateCase(
            caseId,
            {
              lifecycleStage:
                stage,

              lastUpdate:
                'Just now',
            }
          );


        if (updatedCase) {

          setCases(
            (prev) =>
              prev.map(
                (c) =>
                  c.id ===
                  caseId
                    ? {
                        ...c,
                        ...updatedCase,
                      }
                    : c
              )
          );

        }

      } catch (error) {

        console.error(
          '❌ Failed to update case lifecycle:',
          error
        );

      }

    };


  // ==========================================================
  // FOLLOW-UP
  // ==========================================================

  const scheduleFollowUp =
    async (
      caseId: string,
      date: string,
      notes: string
    ) => {

      const targetCase =
        cases.find(
          (c) =>
            c.id ===
            caseId
        );


      if (!targetCase) {
        return;
      }


      const nextDay =
        targetCase.followUpHistory.length +
        2;


      const newFollowUp = {

        day:
          nextDay,

        date,

        svi:
          Math.max(
            25,
            targetCase.sviScore -
            18
          ),

        level:
          targetCase.sviScore -
            18 >
          65
            ? ('HIGH' as const)
            : ('MODERATE' as const),

        notes,

        status:
          'Scheduled' as const,
      };


      try {

        const updatedCase =
          await saveFollowUpService(
            caseId,
            newFollowUp
          );


        if (updatedCase) {

          setCases(
            (prev) =>
              prev.map(
                (c) =>
                  c.id ===
                  caseId
                    ? {
                        ...c,
                        ...updatedCase,
                      }
                    : c
              )
          );

        }

      } catch (error) {

        console.error(
          '❌ Failed to schedule follow-up:',
          error
        );

      }

    };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AppContext.Provider
      value={{

        currentRoute,
        setCurrentRoute,

        primaryTab,
        setPrimaryTab,

        userRole,
        setUserRole,

        cases,

        selectedCaseId,
        setSelectedCaseId,

        selectedCase,

        auditLogs,

        officerNotification,
        dismissOfficerNotification,

        officers,
        assignOfficerToCase,

        language,
        setLanguage,

        activeVictimCaseId,

        sessionMessages,

        currentSvi,

        previousSvi,

        sviChange,

        latestAnalysis,

        isAnalyzing,

        statusText,

        sessionTimeline,

        assessmentHistoryTimeline,

        submitVictimMessage,

        selectScenario,

        clearSession,

        loadDemoScenario,

        overrideCaseDecision,

        updateCaseLifecycle,

        scheduleFollowUp,

        isWhySahayOpen,
        setIsWhySahayOpen,

        isResponsibleAiOpen,
        setIsResponsibleAiOpen,

      }}
    >
      {children}
    </AppContext.Provider>
  );
};


// ============================================================
// USE APP
// ============================================================

export const useApp = () => {

  const context =
    useContext(
      AppContext
    );


  if (!context) {

    throw new Error(
      'useApp must be used within AppProvider'
    );

  }


  return context;
};