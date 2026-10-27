import type { AssessmentEvent } from '../services/assessmentService';

export type UserRole = 'victim' | 'officer' | 'supervisor';

export type PrimaryTab = 'live' | 'cases' | 'followups' | 'analytics';

export type AppRoute =
  | 'home'
  | 'victim-report'
  | 'victim-scenarios'
  | 'victim-status'
  | 'victim-help'
  | 'officer-dash'
  | 'officer-cases'
  | 'officer-case-detail'
  | 'officer-allocation'
  | 'officer-followups'
  | 'officer-analytics'
  | 'officer-audit-logs';

export type SVILevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type CasePriority =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'Immediate'
  | 'Urgent'
  | 'Review'
  | 'Normal';

export type CaseStatus =
  | 'NEW'
  | 'AWAITING_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'FOLLOW_UP'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'Pending'
  | 'Open'
  | 'Review'
  | 'Requires Human Review'
  | 'FollowUp';

export type LifecycleStage =
  | 'Received'
  | 'AI Assessment'
  | 'Officer Review'
  | 'Assigned'
  | 'Action'
  | 'Follow-up'
  | 'Reassessment'
  | 'Closure';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml';

export interface SVIIndicator {
  id: string;
  name: string;
  category:
    | 'threat'
    | 'fear'
    | 'safety'
    | 'isolation'
    | 'repetition'
    | 'urgency';
  confidence: number;
  contribution: number;
  evidence: string;
}

export interface TimelinePoint {
  time: string;
  svi: number;
  label?: string;
  stageName?: string;
}

export interface Message {
  id: string;
  sender: 'victim' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sviAfter?: number;
  highlightedTriggers?: string[];
  inputType?: 'text' | 'voice';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  caseId: string;
  aiRecommendation: string;
  humanDecision: string;
  reason?: string;
  details?: string;
}

export interface CaseFollowUp {
  id?: string;
  caseId?: string;
  day: number;
  date: string;
  svi: number;
  level: SVILevel;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Pending' | 'Overdue';
  followUpType?:
    | 'Call'
    | 'Field Visit'
    | 'Legal Counseling'
    | 'Safety Verification'
    | 'Psychological Support';
  officerName?: string;
}

export interface CaseData {
  id: string;
  complainantName: string;
  phone: string;
  language: string;

  location?: string;
  district?: string;
  state?: string;

  // ================================
  // CORE AI RISK DATA
  // ================================

  sviScore: number;
  sviLevel: SVILevel;
  confidence: number;

  confidenceLevel?: string;

  riskTrend?: string;
  riskEscalation?: boolean;

  requiresHumanReview?: boolean;

  adaptiveQuestion?: string;

  // ================================
  // CASE STATUS
  // ================================

  priority: SVILevel;
  status: CaseStatus;
  lifecycleStage: LifecycleStage;

  createdTime: string;
  lastUpdate: string;
  summary: string;

  // ================================
  // AI INDICATORS
  // ================================

  indicators: SVIIndicator[];

  emotionalIndicators?: string[];
  contextualIndicators?: string[];
  safetyIndicators?: string[];

  // ================================
  // EVIDENCE & REASONING
  // ================================

  keyEvidence?: string[];
  reasoning?: string;

  keyStatements: {
    phrase: string;
    context: string;
    severity: SVILevel;
  }[];

  // ================================
  // AI TIMELINE
  // ================================

  timeline: TimelinePoint[];

  // ================================
  // CONVERSATION
  // ================================

  messages: Message[];

  // ================================
  // AI RECOMMENDATION
  // ================================

  recommendedAction: string;

  // ================================
  // OFFICER DECISION
  // ================================

  officerDecision?:
    | 'accepted'
    | 'modified'
    | 'overridden'
    | 'escalated'
    | 'more_info';

  assignedOfficer?: string;
  assignedOfficerId?: string;

  overrideReason?: string;
  overrideNote?: string;

  // ================================
  // FOLLOW-UP
  // ================================

  followUpHistory: CaseFollowUp[];

  // ================================
  // TRAUMA SUPPORT
  // ================================

  traumaModeActive: boolean;

  traumaStrategy: {
    title: string;
    description: string;
    actionPlan: string;
  };

  // ================================
  // CATEGORY
  // ================================

  category?: string;

  // ================================
  // AI ASSESSMENT HISTORY
  // ================================

  assessmentEvents?: AssessmentEvent[];
}

export interface OfficerRecord {
  id: string;
  name: string;
  role: string;
  state: string;
  district: string;
  languages: string[];
  categories: string[];
  currentWorkload: number;
  criticalCasesCount: number;

  availability:
    | 'Available'
    | 'On Duty Call'
    | 'Off Duty';

  jurisdictionMatch?: boolean;
  languageMatch?: boolean;
  eligibilityMatch?: boolean;
  matchPercentage?: number;
}

export interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  initialMessage: string;
}

export interface NotificationItem {
  id: string;
  caseId: string;
  title: string;
  message: string;
  timestamp: string;

  type:
    | 'CRITICAL_CASE'
    | 'PRIORITY_ESCALATED'
    | 'FOLLOWUP_DUE'
    | 'CASE_REASSIGNED';

  isRead: boolean;

  fromLevel?: SVILevel;
  toLevel?: SVILevel;
}

export interface SystemStats {
  totalActive: number;
  criticalCases: number;
  highVulnerability: number;
  pendingFollowUps: number;
  escalatedToday: number;
  aiOverrideRate: number;
  humanReviewRate: number;
}