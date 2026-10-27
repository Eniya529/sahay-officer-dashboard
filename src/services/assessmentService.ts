import { analyzeVictimMessage as callAiEngine, type ChatTurn, type SviAnalysisResult } from './aiService';
import type { SVILevel } from '../types';

export interface StructuredAiAssessment {
  caseId: string;
  messageId: string;
  timestamp: string;
  svi: number; // 0-100
  level: SVILevel;
  confidence: number; // 0.0-1.0
  emotionalIndicators: string[];
  contextualIndicators: string[];
  safetyIndicators: string[];
  keyEvidence: string[];
  reasoning: string;
  adaptiveQuestion: string;
  recommendedAction: string;
  requiresHumanReview: boolean;
}

export interface AssessmentEvent {
  id: string;
  timestamp: string;
  messageText: string;
  svi: number;
  level: SVILevel;
  confidence: number;
  reasoning: string;
  keyEvidence: string[];
  adaptiveQuestion: string;
  recommendedAction: string;
}

// In-memory store for case assessment history timelines
const assessmentHistoryStore: Record<string, AssessmentEvent[]> = {};

/**
 * Main assessment service wrapper calling AI/ML engine and returning structured AI contract
 */
export async function analyzeVictimMessage(
  caseId: string,
  messageId: string,
  conversationHistory: ChatTurn[],
  language: string = 'en'
): Promise<StructuredAiAssessment> {
  const result: SviAnalysisResult = await callAiEngine(conversationHistory, language);
  const latestTurn = conversationHistory[conversationHistory.length - 1];
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const evidenceQuotes = result.keyEvidence.map(e => e.quote.replace(/^"|"$/g, ''));

  const structuredAssessment: StructuredAiAssessment = {
    caseId,
    messageId,
    timestamp,
    svi: result.svi,
    level: result.level,
    confidence: result.confidence,
    emotionalIndicators: result.emotionalIndicators,
    contextualIndicators: result.contextualIndicators,
    safetyIndicators: result.safetyIndicators,
    keyEvidence: evidenceQuotes.length > 0 ? evidenceQuotes : [latestTurn?.text || ''],
    reasoning: result.reasoning,
    adaptiveQuestion: result.adaptiveQuestion,
    recommendedAction: result.recommendedAction,
    requiresHumanReview: result.requiresHumanReview
  };

  // Save to assessment history timeline
  saveAssessment(caseId, structuredAssessment, latestTurn?.text || '');

  return structuredAssessment;
}

/**
 * Re-assess complete conversation context
 */
export async function reassessConversation(
  caseId: string,
  messageId: string,
  conversationHistory: ChatTurn[],
  language: string = 'en'
): Promise<StructuredAiAssessment> {
  return analyzeVictimMessage(caseId, messageId, conversationHistory, language);
}

/**
 * Save assessment event into timeline history without overwriting previous assessments
 */
export function saveAssessment(caseId: string, assessment: StructuredAiAssessment, messageText: string): AssessmentEvent {
  if (!assessmentHistoryStore[caseId]) {
    assessmentHistoryStore[caseId] = [];
  }

  const event: AssessmentEvent = {
    id: `evt-${Date.now()}`,
    timestamp: assessment.timestamp,
    messageText,
    svi: assessment.svi,
    level: assessment.level,
    confidence: assessment.confidence,
    reasoning: assessment.reasoning,
    keyEvidence: assessment.keyEvidence,
    adaptiveQuestion: assessment.adaptiveQuestion,
    recommendedAction: assessment.recommendedAction
  };

  assessmentHistoryStore[caseId].push(event);
  return event;
}

/**
 * Retrieve assessment history timeline for a given case ID
 */
export function getAssessmentHistory(caseId: string): AssessmentEvent[] {
  return assessmentHistoryStore[caseId] || [];
}

/**
 * Retrieve the latest assessment for a given case ID
 */
export function getCurrentAssessment(caseId: string): AssessmentEvent | null {
  const history = getAssessmentHistory(caseId);
  return history.length > 0 ? history[history.length - 1] : null;
}
