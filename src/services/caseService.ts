import type {
  CaseData,
  AuditLogEntry,
  CaseFollowUp,
  SVILevel,
  CaseStatus,
  Message,
} from '../types';

import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from './firebase';


// ============================================================
// HELPERS
// ============================================================

function normalizeConfidence(value: unknown): number {
  if (typeof value !== 'number') {
    return 0;
  }

  return value <= 1
    ? Math.round(value * 100)
    : Math.round(value);
}


function normalizeDate(value: unknown): string {
  if (!value) {
    return 'Recently';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    ).toDate().toLocaleString();
  }

  return 'Recently';
}


// ============================================================
// GET ALL ASSESSMENTS
// ============================================================

export async function getAssessmentHistoryFromFirebase(
  caseId: string
): Promise<any[]> {

  const assessmentsRef = collection(
    db,
    'cases',
    caseId,
    'assessments'
  );

  try {

    const q = query(
      assessmentsRef,
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((assessmentDoc) => ({
        id: assessmentDoc.id,
        ...assessmentDoc.data(),
      }))
      .sort((a: any, b: any) => {
        const timeA =
          a.timestamp?.toDate?.()?.getTime?.() ??
          (typeof a.timestamp === 'number'
            ? a.timestamp
            : 0);

        const timeB =
          b.timestamp?.toDate?.()?.getTime?.() ??
          (typeof b.timestamp === 'number'
            ? b.timestamp
            : 0);

        return timeA - timeB;
      });

  } catch (error) {

    console.warn(
      `Could not load assessment history for ${caseId}:`,
      error
    );

    return [];
  }
}


// ============================================================
// GET LATEST ASSESSMENT
// ============================================================

export async function getLatestAssessment(
  caseId: string
): Promise<any | null> {

  const assessments =
    await getAssessmentHistoryFromFirebase(caseId);

  if (assessments.length === 0) {
    return null;
  }

  return assessments[assessments.length - 1];
}


// ============================================================
// GET ALL VICTIM MESSAGES
// ============================================================
//
// Supports:
//
// 1. cases/{caseId}.messages
// 2. cases/{caseId}/messages/{messageId}
// ============================================================

export async function getCaseMessages(
  caseId: string
): Promise<Message[]> {

  const caseRef = doc(
    db,
    'cases',
    caseId
  );

  const caseSnapshot = await getDoc(caseRef);

  if (!caseSnapshot.exists()) {
    return [];
  }

  const caseData = caseSnapshot.data();


  // ----------------------------------------------------------
  // OPTION 1
  // Messages stored directly inside case document
  // ----------------------------------------------------------

  if (Array.isArray(caseData.messages)) {

    return caseData.messages.map(
      (message: any, index: number) => ({
        id:
          message.id ||
          `message-${index}`,

        sender:
          message.sender ||
          'victim',

        text:
          message.text ||
          '',

        timestamp:
          normalizeDate(message.timestamp),

        sviAfter:
          typeof message.sviAfter === 'number'
            ? message.sviAfter
            : undefined,

      } as Message)
    );
  }


  // ----------------------------------------------------------
  // OPTION 2
  // Messages stored as subcollection
  // ----------------------------------------------------------

  try {

    const messagesRef = collection(
      db,
      'cases',
      caseId,
      'messages'
    );

    let snapshot;

    try {

      const q = query(
        messagesRef,
        orderBy('timestamp', 'asc')
      );

      snapshot = await getDocs(q);

    } catch {

      // Fallback if timestamp field is missing
      snapshot = await getDocs(messagesRef);
    }


    const messages = snapshot.docs.map(
      (messageDoc) => {

        const data = messageDoc.data();

        return {
          id:
            data.id ||
            messageDoc.id,

          sender:
            data.sender ||
            'victim',

          text:
            data.text ||
            '',

          timestamp:
            normalizeDate(
              data.timestamp
            ),

          sviAfter:
            typeof data.sviAfter === 'number'
              ? data.sviAfter
              : undefined,

        } as Message;
      }
    );


    return messages;

  } catch (error) {

    console.warn(
      `Could not load messages for ${caseId}:`,
      error
    );

    return [];
  }
}


// ============================================================
// ATTACH ASSESSMENT RESULTS TO MESSAGES
// ============================================================

function attachAssessmentResultsToMessages(
  messages: Message[],
  assessments: any[]
): Message[] {

  if (!messages.length) {
    return [];
  }

  return messages.map(
    (message) => {

      const assessment =
        assessments.find(
          (item) =>
            item.messageId === message.id
        );

      if (!assessment) {
        return message;
      }

      return {
        ...message,

        sviAfter:
          typeof assessment.svi === 'number'
            ? assessment.svi
            : message.sviAfter,

      } as Message;
    }
  );
}


// ============================================================
// CONVERT FIREBASE CASE → APP CASE
// ============================================================

function mapCase(
  caseDocId: string,
  data: any,
  latestAssessment: any = null,
  messages: Message[] = [],
  allAssessments: any[] = []
): CaseData {

  // ----------------------------------------------------------
  // SVI
  // ----------------------------------------------------------

  const sviScore =
    typeof data.latestSvi === 'number'
      ? data.latestSvi
      : typeof data.sviScore === 'number'
        ? data.sviScore
        : typeof latestAssessment?.svi === 'number'
          ? latestAssessment.svi
          : 0;


  // ----------------------------------------------------------
  // RISK LEVEL
  // ----------------------------------------------------------

  const sviLevel = (
    data.latestRiskLevel ||
    data.sviLevel ||
    data.riskLevel ||
    latestAssessment?.riskLevel ||
    latestAssessment?.level ||
    'LOW'
  ) as SVILevel;


  // ----------------------------------------------------------
  // CONFIDENCE
  // ----------------------------------------------------------

  const rawConfidence =
    latestAssessment?.confidence ??
    data.confidence ??
    0;

  const confidence =
    normalizeConfidence(rawConfidence);


  // ----------------------------------------------------------
  // FINAL MESSAGES
  // ----------------------------------------------------------

  const finalMessages =
    attachAssessmentResultsToMessages(
      messages,
      allAssessments
    );


  // ----------------------------------------------------------
  // ASSESSMENT EVENTS
  // ----------------------------------------------------------

  const assessmentEvents: any[] =
    allAssessments.length > 0
      ? allAssessments
      : Array.isArray(data.assessmentEvents)
        ? data.assessmentEvents
        : [];


  // ----------------------------------------------------------
  // TIMELINE
  // ----------------------------------------------------------

  const generatedTimeline =
    allAssessments.map(
      (assessment: any) => ({
        time:
          normalizeDate(
            assessment.timestamp ||
            assessment.createdAt
          ),

        svi:
          typeof assessment.svi === 'number'
            ? assessment.svi
            : 0,

        label:
          assessment.level ||
          assessment.riskLevel ||
          'LOW',
      })
    );


  // ----------------------------------------------------------
  // KEY STATEMENTS
  // ----------------------------------------------------------

  const generatedKeyStatements =
    Array.isArray(latestAssessment?.keyEvidence)
      ? latestAssessment.keyEvidence.map(
          (evidence: string) => ({
            phrase: evidence,

            context:
              'AI identified evidence from victim conversation.',

            severity:
              latestAssessment?.level ||
              latestAssessment?.riskLevel ||
              sviLevel,
          })
        )
      : [];


  // ----------------------------------------------------------
  // TRAUMA STRATEGY
  // ----------------------------------------------------------

  const traumaStrategy =
    data.traumaStrategy ||
    {
      title:
        'Trauma-Aware Support',

      description:
        latestAssessment?.reasoning ||
        'Human-centered safety support is active.',

      actionPlan:
        latestAssessment?.recommendedAction ||
        'Review case and determine appropriate next action.',
    };


  // ----------------------------------------------------------
  // RETURN COMPLETE CASE
  // ----------------------------------------------------------

  return {

    id:
      data.caseId ||
      caseDocId,


    complainantName:
      data.complainantName ||
      data.victimName ||
      data.name ||
      'Victim / Complainant',


    phone:
      data.phone ||
      data.mobile ||
      'Not provided',


    language:
      data.language ||
      'EN',


    location:
      data.location ||
      '',


    district:
      data.district ||
      '',


    state:
      data.state ||
      '',


    // --------------------------------------------------------
    // ML RESULT
    // --------------------------------------------------------

    sviScore,

    sviLevel,

    confidence,

    priority:
      data.priority ||
      sviLevel,


    // --------------------------------------------------------
    // CASE STATUS
    // --------------------------------------------------------

    status:
      (
        data.status ||
        (
          latestAssessment?.requiresHumanReview
            ? 'AWAITING_REVIEW'
            : 'NEW'
        )
      ) as CaseStatus,


    lifecycleStage:
      data.lifecycleStage ||
      (
        latestAssessment
          ? 'AI Assessment'
          : 'Received'
      ),


    // --------------------------------------------------------
    // TIME
    // --------------------------------------------------------

    createdTime:
      normalizeDate(
        data.createdTime ||
        data.createdAt ||
        data.lastUpdated
      ),


    lastUpdate:
      normalizeDate(
        data.lastUpdate ||
        data.lastUpdated ||
        data.updatedAt ||
        data.createdAt
      ),


    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    summary:
      data.summary ||
      latestAssessment?.reasoning ||
      'Case received and awaiting assessment.',


    // --------------------------------------------------------
    // ML INDICATORS
    // --------------------------------------------------------

    indicators:
      Array.isArray(data.indicators)
        ? data.indicators
        : Array.isArray(latestAssessment?.indicators)
          ? latestAssessment.indicators
          : [],


    // --------------------------------------------------------
    // SVI TIMELINE
    // --------------------------------------------------------

    timeline:
      Array.isArray(data.timeline) &&
      data.timeline.length > 0
        ? data.timeline
        : generatedTimeline,


    // --------------------------------------------------------
    // KEY STATEMENTS
    // --------------------------------------------------------

    keyStatements:
      Array.isArray(data.keyStatements) &&
      data.keyStatements.length > 0
        ? data.keyStatements
        : generatedKeyStatements,


    // --------------------------------------------------------
    // ALL VICTIM MESSAGES
    // --------------------------------------------------------

    messages:
      finalMessages.length > 0
        ? finalMessages
        : Array.isArray(data.messages)
          ? data.messages
          : [],


    // --------------------------------------------------------
    // ML RECOMMENDATION
    // --------------------------------------------------------

    recommendedAction:
      data.recommendedAction ||
      latestAssessment?.recommendedAction ||
      'Human review recommended.',


    // --------------------------------------------------------
    // ML REASONING
    // --------------------------------------------------------

    reasoning:
      data.reasoning ||
      latestAssessment?.reasoning ||
      '',


    // --------------------------------------------------------
    // EMOTIONAL INDICATORS
    // --------------------------------------------------------

    emotionalIndicators:
      Array.isArray(data.emotionalIndicators)
        ? data.emotionalIndicators
        : Array.isArray(
            latestAssessment?.emotionalIndicators
          )
          ? latestAssessment.emotionalIndicators
          : [],


    // --------------------------------------------------------
    // CONTEXTUAL INDICATORS
    // --------------------------------------------------------

    contextualIndicators:
      Array.isArray(data.contextualIndicators)
        ? data.contextualIndicators
        : Array.isArray(
            latestAssessment?.contextualIndicators
          )
          ? latestAssessment.contextualIndicators
          : [],


    // --------------------------------------------------------
    // SAFETY INDICATORS
    // --------------------------------------------------------

    safetyIndicators:
      Array.isArray(data.safetyIndicators)
        ? data.safetyIndicators
        : Array.isArray(
            latestAssessment?.safetyIndicators
          )
          ? latestAssessment.safetyIndicators
          : [],


    // --------------------------------------------------------
    // KEY EVIDENCE
    // --------------------------------------------------------

    keyEvidence:
      Array.isArray(data.keyEvidence)
        ? data.keyEvidence
        : Array.isArray(latestAssessment?.keyEvidence)
          ? latestAssessment.keyEvidence
          : [],


    // --------------------------------------------------------
    // OFFICER INFORMATION
    // --------------------------------------------------------

    officerDecision:
      data.officerDecision,

    assignedOfficer:
      data.assignedOfficer,

    assignedOfficerId:
      data.assignedOfficerId,

    overrideReason:
      data.overrideReason,

    overrideNote:
      data.overrideNote,


    // --------------------------------------------------------
    // FOLLOW-UP
    // --------------------------------------------------------

    followUpHistory:
      Array.isArray(data.followUpHistory)
        ? data.followUpHistory
        : [],


    // --------------------------------------------------------
    // TRAUMA MODE
    // --------------------------------------------------------

    traumaModeActive:
      data.traumaModeActive ??
      sviScore >= 70,


    traumaStrategy,


    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    category:
      data.category,


    // --------------------------------------------------------
    // COMPLETE ML HISTORY
    // --------------------------------------------------------

    assessmentEvents:
      assessmentEvents,

  } as CaseData;
}


// ============================================================
// GET ALL CASES FROM FIRESTORE
// ============================================================

export async function getCases(): Promise<CaseData[]> {

  console.log(
    '🔥 Reading all cases from Firestore...'
  );

  try {

    const snapshot =
      await getDocs(
        collection(db, 'cases')
      );


    console.log(
      `📁 Firebase returned ${snapshot.size} case(s)`
    );


    const cases =
      await Promise.all(

        snapshot.docs.map(
          async (caseDoc) => {

            const caseId =
              caseDoc.id;

            const data =
              caseDoc.data();


            // ------------------------------------------------
            // LOAD ALL ASSESSMENTS
            // ------------------------------------------------

            const assessments =
              await getAssessmentHistoryFromFirebase(
                caseId
              );


            const latestAssessment =
              assessments.length > 0
                ? assessments[
                    assessments.length - 1
                  ]
                : null;


            // ------------------------------------------------
            // LOAD ALL MESSAGES
            // ------------------------------------------------

            const messages =
              await getCaseMessages(
                caseId
              );


            // ------------------------------------------------
            // MAP EVERYTHING
            // ------------------------------------------------

            const mappedCase =
              mapCase(
                caseId,
                data,
                latestAssessment,
                messages,
                assessments
              );


            console.log(
              `✅ Case ${caseId}:`,
              {
                messages:
                  mappedCase.messages?.length ?? 0,

                assessments:
                  mappedCase.assessmentEvents?.length ?? 0,

                svi:
                  mappedCase.sviScore,

                level:
                  mappedCase.sviLevel,

                confidence:
                  mappedCase.confidence,
              }
            );


            return mappedCase;

          }
        )

      );


    return cases;

  } catch (error) {

    console.error(
      '❌ Failed to load cases from Firebase:',
      error
    );

    return [];
  }
}


// ============================================================
// GET SINGLE CASE
// ============================================================

export async function getCaseById(
  caseId: string
): Promise<CaseData | null> {

  try {

    const caseRef =
      doc(
        db,
        'cases',
        caseId
      );


    const snapshot =
      await getDoc(caseRef);


    if (!snapshot.exists()) {
      return null;
    }


    const assessments =
      await getAssessmentHistoryFromFirebase(
        caseId
      );


    const latestAssessment =
      assessments.length > 0
        ? assessments[
            assessments.length - 1
          ]
        : null;


    const messages =
      await getCaseMessages(
        caseId
      );


    return mapCase(
      snapshot.id,
      snapshot.data(),
      latestAssessment,
      messages,
      assessments
    );

  } catch (error) {

    console.error(
      `❌ Failed to load case ${caseId}:`,
      error
    );

    return null;
  }
}


// ============================================================
// SAVE / CREATE CASE
// ============================================================

export async function saveCase(
  newCase: CaseData
): Promise<CaseData> {

  const caseRef =
    doc(
      db,
      'cases',
      newCase.id
    );


  await setDoc(
    caseRef,
    {

      ...newCase,

      caseId:
        newCase.id,

      latestSvi:
        newCase.sviScore,

      latestRiskLevel:
        newCase.sviLevel,

      updatedAt:
        new Date(),

    },
    {
      merge: true,
    }
  );


  return newCase;
}


// ============================================================
// UPDATE CASE
// ============================================================

export async function updateCase(
  caseId: string,
  updates: Partial<CaseData>
): Promise<CaseData | null> {

  const caseRef =
    doc(
      db,
      'cases',
      caseId
    );


  const existing =
    await getCaseById(
      caseId
    );


  if (!existing) {
    return null;
  }


  const updatedCase: CaseData = {

    ...existing,

    ...updates,

    lastUpdate:
      'Just now',
  };


  await setDoc(
    caseRef,
    {

      ...updates,

      caseId,

      latestSvi:
        updatedCase.sviScore,

      latestRiskLevel:
        updatedCase.sviLevel,

      lastUpdate:
        'Just now',

      updatedAt:
        new Date(),

    },

    {
      merge: true,
    }
  );


  return updatedCase;
}


// ============================================================
// SAVE ML ASSESSMENT
// ============================================================

export async function saveAssessment(
  caseId: string,
  assessment: {
    assessmentId?: string;
    caseId: string;
    messageId: string;
    svi: number;
    level: SVILevel;
    confidence: number;
    emotionalIndicators: string[];
    contextualIndicators: string[];
    safetyIndicators: string[];
    keyEvidence: string[];
    reasoning: string;
    adaptiveQuestion: string;
    recommendedAction: string;
    requiresHumanReview: boolean;
  }
): Promise<void> {

  const assessmentId =
    assessment.assessmentId ||
    `ASM-${Date.now()}`;


  const assessmentRef =
    doc(
      db,
      'cases',
      caseId,
      'assessments',
      assessmentId
    );


  await setDoc(
    assessmentRef,
    {

      assessmentId,

      caseId,

      messageId:
        assessment.messageId,

      svi:
        assessment.svi,

      riskLevel:
        assessment.level,

      level:
        assessment.level,

      confidence:
        assessment.confidence,

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

      adaptiveQuestion:
        assessment.adaptiveQuestion,

      recommendedAction:
        assessment.recommendedAction,

      requiresHumanReview:
        assessment.requiresHumanReview,

      timestamp:
        new Date(),

    }
  );


  // ----------------------------------------------------------
  // UPDATE PARENT CASE WITH LATEST ML RESULT
  // ----------------------------------------------------------

  await updateDoc(
    doc(
      db,
      'cases',
      caseId
    ),
    {

      latestSvi:
        assessment.svi,

      latestRiskLevel:
        assessment.level,

      confidence:
        assessment.confidence,

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

      status:
        assessment.requiresHumanReview
          ? 'AWAITING_REVIEW'
          : 'NEW',

      lifecycleStage:
        'AI Assessment',

      updatedAt:
        new Date(),

    }
  );
}


// ============================================================
// OFFICER ACTION
// ============================================================

export async function saveOfficerAction(
  caseId: string,
  action:
    | 'accepted'
    | 'modified'
    | 'overridden'
    | 'escalated'
    | 'more_info',
  newPriority?: SVILevel,
  reason?: string,
  note?: string,
  officerName: string =
    'Officer Rajesh Kumar (NHAA-884)'
): Promise<{
  auditEntry: AuditLogEntry;
  updatedCase: CaseData | null;
}> {

  const target =
    await getCaseById(
      caseId
    );


  const oldPriority =
    target?.priority ||
    'MODERATE';


  const effectivePriority =
    newPriority ||
    oldPriority;


  const actionText =
    action === 'accepted'
      ? 'Accepted AI Recommendation'
      : action === 'modified'
        ? `Modified Priority: ${oldPriority} → ${effectivePriority}`
        : action === 'escalated'
          ? 'Escalated Case to Senior Command'
          : action === 'more_info'
            ? 'Requested Additional Victim Information'
            : 'Overrode AI Recommendation';


  const auditEntry: AuditLogEntry = {

    id:
      `audit-${Date.now()}`,

    timestamp:
      new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19),

    user:
      officerName,

    role:
      'Response Officer',

    action:
      actionText,

    caseId,

    aiRecommendation:
      `AI Level: ${
        target?.sviLevel ||
        'HIGH'
      } (SVI: ${
        target?.sviScore ||
        0
      })`,

    humanDecision:
      `${action.toUpperCase()}${
        newPriority
          ? ` [Priority: ${newPriority}]`
          : ''
      }`,

    reason:
      note ||
      reason ||
      'Officer Judgment Applied',

    details:
      reason,

  };


  await setDoc(
    doc(
      db,
      'auditLogs',
      auditEntry.id
    ),
    auditEntry
  );


  const statusMap:
    Record<string, CaseStatus> = {

    accepted:
      'ASSIGNED',

    modified:
      'AWAITING_REVIEW',

    overridden:
      'IN_PROGRESS',

    escalated:
      'ESCALATED',

    more_info:
      'AWAITING_REVIEW',

  };


  const updatedCase =
    await updateCase(
      caseId,
      {

        officerDecision:
          action,

        priority:
          effectivePriority,

        overrideReason:
          reason,

        overrideNote:
          note,

        status:
          statusMap[action],

        lifecycleStage:
          action === 'accepted'
            ? 'Assigned'
            : 'Officer Review',

      }
    );


  return {
    auditEntry,
    updatedCase,
  };
}


// ============================================================
// FOLLOW-UP
// ============================================================

export async function saveFollowUp(
  caseId: string,
  followUp: CaseFollowUp
): Promise<CaseData | null> {

  const target =
    await getCaseById(
      caseId
    );


  if (!target) {
    return null;
  }


  const updatedHistory = [
    ...(target.followUpHistory || []),
    followUp,
  ];


  return updateCase(
    caseId,
    {

      status:
        'FOLLOW_UP',

      followUpHistory:
        updatedHistory,

      lifecycleStage:
        'Follow-up',

    }
  );
}


// ============================================================
// AUDIT LOGS
// ============================================================

export async function getAuditLogs(): Promise<
  AuditLogEntry[]
> {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          'auditLogs'
        )
      );


    return snapshot.docs.map(
      (item) =>
        item.data() as AuditLogEntry
    );

  } catch (error) {

    console.warn(
      'Could not load audit logs:',
      error
    );

    return [];
  }
}