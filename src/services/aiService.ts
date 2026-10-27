import { GoogleGenAI } from '@google/genai';

export interface KeyEvidenceItem {
  quote: string;
  indicator: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface SviAnalysisResult {
  svi: number; // 0 to 100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number; // 0.0 to 1.0 (or 0-100%)
  emotionalIndicators: string[];
  contextualIndicators: string[];
  safetyIndicators: string[];
  keyEvidence: KeyEvidenceItem[];
  reasoning: string;
  adaptiveQuestion: string;
  recommendedAction: string;
  requiresHumanReview: boolean;
}

export interface ChatTurn {
  sender: 'victim' | 'assistant' | 'system';
  text: string;
}

const SYSTEM_PROMPT = `
You are the AI Risk & Vulnerability Analysis Engine for SAHAY (SIH PS26093 - NHAA 14566 Helpline Support System).
Your task is to analyze conversational messages from victims/complainants reporting harassment, threats, or domestic abuse in real time.

STRICT SAFETY AND ETHICAL BOUNDARIES:
1. You MUST NOT under any circumstances diagnose PTSD, depression, anxiety disorders, or any psychiatric/clinical mental health conditions.
2. You MUST NOT determine legal guilt, legal evidence admissibility, or decide whether a complaint is genuine or false.
3. You MUST NOT make autonomous medical or law enforcement decisions. You are a decision-support system for human officers.
4. You MUST identify conversational indicators of: distress, fear, intimidation, threat, hopelessness, social isolation, safety concerns, and extreme vulnerability. Treat these strictly as conversational indicators.
5. All evidence quotes in keyEvidence MUST be actual verbatim short excerpts extracted directly from the victim's input text. DO NOT invent or fabricate quotes.

OUTPUT SCORING GUIDE (Stress Vulnerability Index - SVI: 0 to 100):
- LOW (0-40): Factual statements, informational reporting, neutral tone ("I only want to report what happened").
- MODERATE (41-65): Worry, stalking, non-immediate harassment, financial control ("I am worried about what happens next").
- HIGH (66-84): Explicit threats, fear of going home, stalking, escalation ("I am scared because they threatened me again").
- CRITICAL (85-100): Direct threats of severe physical harm, threats to family/children, weapon mention, immediate danger ("They said they will hurt my family if I complain").

TRAUMA-AWARE ADAPTIVE QUESTIONING:
- For High/Critical distress (SVI >= 70): Minimize repetitive questioning. Prioritize physical safety (e.g., "Are you currently in a safe place right now?", "Would you like us to connect you with an officer immediately?").
- For Low/Moderate distress: Ask for relevant incident timeline and details safely.

Analyze the entire conversation history, paying primary attention to the latest victim message.
Return strictly valid JSON matching this schema:
{
  "svi": number (0-100),
  "level": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "confidence": number (0.0 to 1.0),
  "emotionalIndicators": string[],
  "contextualIndicators": string[],
  "safetyIndicators": string[],
  "keyEvidence": [
    { "quote": string, "indicator": string, "severity": "LOW" | "MODERATE" | "HIGH" | "CRITICAL" }
  ],
  "reasoning": string,
  "adaptiveQuestion": string,
  "recommendedAction": string,
  "requiresHumanReview": boolean
}
`;

/**
 * Main service method to analyze victim input via Gemini API or intelligent dynamic fallback
 */
export async function analyzeVictimMessage(
  conversationHistory: ChatTurn[],
  language: string = 'en'
): Promise<SviAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  const latestMessage = conversationHistory[conversationHistory.length - 1]?.text || '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Language context: ${language}\nConversation History:\n${conversationHistory
        .map((c) => `${c.sender.toUpperCase()}: ${c.text}`)
        .join('\n')}\n\nAnalyze the latest message in context and return the structured JSON assessment.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }, { text: prompt }] }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as SviAnalysisResult;
        if (parsed.confidence > 1) {
          parsed.confidence = Math.min(1, parsed.confidence / 100);
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using dynamic context evaluator fallback:', err);
    }
  }

  // Fallback Dynamic Context Evaluator (Runs locally when API key is missing or offline)
  return fallbackContextEvaluator(conversationHistory, latestMessage);
}

/**
 * Robust Local Context Evaluator
 * Dynamically computes SVI, indicators, evidence quotes, adaptive question, and officer recommendations
 * directly based on the user's actual text and conversation history.
 */
function fallbackContextEvaluator(history: ChatTurn[], latestText: string): SviAnalysisResult {
  const fullText = history.map(h => h.text).join(' ').toLowerCase();

  // Pattern detection
  const criticalThreat = /(hurt my family|kill|murder|weapon|gun|knife|stab|die|dead|blood|physical attack|lock me in)/i;
  const highThreat = /(threaten|scared|afraid|terrified|stalk|following me|fear|break in|force|abuse|harm)/i;
  const moderateConcern = /(worried|anxious|worry|money|financial|harass|bother|uncomfortable|follow|again|yesterday)/i;

  let svi = 32;
  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  const keyEvidence: KeyEvidenceItem[] = [];
  const emotionalIndicators: string[] = [];
  const contextualIndicators: string[] = [];
  const safetyIndicators: string[] = [];

  // Extract actual verbatim excerpts from user's message
  const extractQuote = (str: string, word: string) => {
    const idx = str.toLowerCase().indexOf(word.toLowerCase());
    if (idx === -1) return str.slice(0, 45);
    const start = Math.max(0, idx - 15);
    const end = Math.min(str.length, idx + word.length + 25);
    return (start > 0 ? '...' : '') + str.slice(start, end).trim() + (end < str.length ? '...' : '');
  };

  // Evaluate text
  if (criticalThreat.test(fullText)) {
    svi = 88;
    level = 'CRITICAL';
    safetyIndicators.push('Direct Violence Threat', 'Family Safety Concern');
    emotionalIndicators.push('Extreme Fear', 'Acute Distress');
    contextualIndicators.push('Escalating Intimidation');
    
    const match = fullText.match(criticalThreat)?.[0] || 'threat';
    keyEvidence.push({
      quote: `"${extractQuote(latestText || history[history.length - 1].text, match)}"`,
      indicator: 'Severe Violence Threat',
      severity: 'CRITICAL'
    });
  } else if (highThreat.test(fullText)) {
    svi = 72;
    level = 'HIGH';
    safetyIndicators.push('Safety Concern', 'Potential Relocation Need');
    emotionalIndicators.push('High Fear', 'Distress');
    contextualIndicators.push('Repeated Intimidation');

    const match = fullText.match(highThreat)?.[0] || 'threatened';
    keyEvidence.push({
      quote: `"${extractQuote(latestText || history[history.length - 1].text, match)}"`,
      indicator: 'Threat & Fear Indicator',
      severity: 'HIGH'
    });
  } else if (moderateConcern.test(fullText)) {
    svi = 52;
    level = 'MODERATE';
    safetyIndicators.push('Precautionary Monitoring');
    emotionalIndicators.push('Apprehension', 'Uncertainty');
    contextualIndicators.push('Persistent Stalking / Pattern');

    const match = fullText.match(moderateConcern)?.[0] || 'worried';
    keyEvidence.push({
      quote: `"${extractQuote(latestText || history[history.length - 1].text, match)}"`,
      indicator: 'Persistent Harassment / Worry',
      severity: 'MODERATE'
    });
  } else {
    svi = 32;
    level = 'LOW';
    safetyIndicators.push('Standard Incident Logging');
    emotionalIndicators.push('Neutral / Informational');
    contextualIndicators.push('Initial Report');

    keyEvidence.push({
      quote: `"${latestText.slice(0, 50)}"`,
      indicator: 'Informational Statement',
      severity: 'LOW'
    });
  }

  // Adjust for length of multi-turn conversation
  if (history.length >= 3 && svi < 80) {
    svi = Math.min(95, svi + 8);
    if (svi >= 70 && level === 'MODERATE') level = 'HIGH';
  }

  // Handle low confidence case if input is extremely brief or ambiguous
  let confidence = 0.84;
  if (latestText.trim().split(/\s+/).length <= 2 && svi < 60) {
    confidence = 0.44; // Trigger low confidence state
  }

  // Adaptive Question
  let adaptiveQuestion = 'Can you share what time or where this incident took place?';
  if (svi >= 85) {
    adaptiveQuestion = 'Are you currently in a safe place, or would you prefer to speak with a human responder?';
  } else if (svi >= 70) {
    adaptiveQuestion = 'Are you currently in a safe place right now?';
  } else if (svi >= 50) {
    adaptiveQuestion = 'How long has this behavior been taking place?';
  }

  // Recommendation
  let recommendedAction = 'Standard case recording. Follow-up within 48 hours.';
  if (svi >= 85) {
    recommendedAction = 'CRITICAL ESCALATION: Immediate human officer dispatch and emergency shelter activation.';
  } else if (svi >= 70) {
    recommendedAction = 'Prioritize human officer review and verify current safety status.';
  } else if (svi >= 50) {
    recommendedAction = 'MODERATE MONITORING: Assign to local desk officer for secondary review.';
  }

  return {
    svi,
    level,
    confidence,
    emotionalIndicators,
    contextualIndicators,
    safetyIndicators,
    keyEvidence,
    reasoning: `Victim reports: "${latestText}". Analysis detects ${level} vulnerability indicators (${emotionalIndicators.join(', ') || 'Informational'}).`,
    adaptiveQuestion,
    recommendedAction,
    requiresHumanReview: svi >= 50
  };
}
