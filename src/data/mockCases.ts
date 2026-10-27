import type { CaseData, AuditLogEntry } from '../types';

export const INITIAL_CASES: CaseData[] = [
  {
    id: 'NHAA-1024',
    complainantName: 'Sunita Sharma (Anonymized)',
    phone: '+91 98******12',
    language: 'Hindi / English',
    sviScore: 91,
    sviLevel: 'CRITICAL',
    confidence: 88,
    priority: 'CRITICAL',
    status: 'AWAITING_REVIEW',
    lifecycleStage: 'AI Assessment',
    createdTime: '10 mins ago (09:40 AM)',
    lastUpdate: 'Just now',
    summary: 'Complainant reports repeated threats and physical intimidation. Strong fear indicators, persistent anxiety, and immediate safety concerns were detected. SVI spiked after discussion of direct threats to family.',
    indicators: [
      {
        id: 'ind-1',
        name: 'Direct Threat to Family',
        category: 'threat',
        confidence: 94,
        contribution: 35,
        evidence: '"They said they would hurt my family if I contacted authorities."'
      },
      {
        id: 'ind-2',
        name: 'Fear & Acute Anxiety',
        category: 'fear',
        confidence: 89,
        contribution: 25,
        evidence: '"I am afraid to go home. I don\'t know where else to go."'
      },
      {
        id: 'ind-3',
        name: 'Immediate Safety Vulnerability',
        category: 'safety',
        confidence: 91,
        contribution: 22,
        evidence: '"Currently standing outside local bus stop, perpetrator seen nearby."'
      },
      {
        id: 'ind-4',
        name: 'Social Isolation Signal',
        category: 'isolation',
        confidence: 76,
        contribution: 18,
        evidence: '"No local family contacts available in city."'
      }
    ],
    timeline: [
      { time: '0:05', svi: 32, label: 'Session Initiated' },
      { time: '0:45', svi: 58, label: 'Threat statement detected' },
      { time: '1:20', svi: 76, label: 'Fear & relocation anxiety' },
      { time: '2:10', svi: 89, label: 'Immediate safety concern detected' },
      { time: '2:40', svi: 91, label: 'Trauma mode active & escalated' }
    ],
    keyStatements: [
      { phrase: 'They said they would hurt my family', context: 'High severity threat trigger', severity: 'CRITICAL' },
      { phrase: 'I am scared to go back home', context: 'Unsafe residential condition', severity: 'HIGH' },
      { phrase: 'They threatened me again yesterday', context: 'Pattern of continuous escalation', severity: 'HIGH' }
    ],
    messages: [
      { id: 'm1', sender: 'assistant', text: 'Namaste. Welcome to NHAA 14566 Support Assistant. I am here to support you. You can talk to me in Hindi, English, Tamil, Telugu or Malayalam.', timestamp: '09:40 AM' },
      { id: 'm2', sender: 'victim', text: 'They threatened me again yesterday. I am scared to go back home.', timestamp: '09:41 AM', sviAfter: 58, highlightedTriggers: ['threatened me again', 'scared to go back home'] },
      { id: 'm3', sender: 'assistant', text: 'I understand. You do not need to repeat information you have already provided. Are you currently in a safe location?', timestamp: '09:41 AM' },
      { id: 'm4', sender: 'victim', text: 'They said they would hurt my family if I tell anyone.', timestamp: '09:42 AM', sviAfter: 91, highlightedTriggers: ['hurt my family'] },
      { id: 'm5', sender: 'assistant', text: 'Your safety is our priority. I am escalating this immediately to a senior NHAA officer with emergency response options.', timestamp: '09:42 AM' }
    ],
    recommendedAction: 'Immediate Human Officer Dispatch + Emergency Shelter Allocation + Local Police Unit Notification',
    followUpHistory: [
      { day: 1, date: 'Today', svi: 91, level: 'CRITICAL', notes: 'Initial intake via SAHAY portal. High risk detected.', status: 'Pending' },
      { day: 3, date: 'Scheduled Day 3', svi: 77, level: 'HIGH', notes: 'Safety check-in post officer review.', status: 'Scheduled' },
      { day: 7, date: 'Scheduled Day 7', svi: 63, level: 'MODERATE', notes: 'Long-term trauma recovery evaluation.', status: 'Scheduled' }
    ],
    traumaModeActive: true,
    traumaStrategy: {
      title: 'CRITICAL SAFETY FOCUS MODE',
      description: 'High distress & active threat detected. Bypassing non-essential form fields to prioritize immediate physical location safety.',
      actionPlan: 'Direct connection to senior NHAA emergency dispatch officer.'
    }
  },
  {
    id: 'NHAA-1025',
    complainantName: 'Priya R. (Anonymized)',
    phone: '+91 97******44',
    language: 'Tamil / English',
    sviScore: 82,
    sviLevel: 'HIGH',
    confidence: 84,
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedOfficer: 'Officer Rajesh Kumar',
    lifecycleStage: 'Officer Review',
    createdTime: '35 mins ago',
    lastUpdate: '10 mins ago',
    summary: 'Complainant reports economic deprivation, verbal abuse, and stalking behavior. Repeated distress indicators observed over 3 separate interactions.',
    indicators: [
      { id: 'ind-21', name: 'Persistent Stalking & Harassment', category: 'threat', confidence: 88, contribution: 40, evidence: '"Following me to office location every morning."' },
      { id: 'ind-22', name: 'Financial Control', category: 'isolation', confidence: 80, contribution: 30, evidence: '"Bank accounts locked without permission."' },
      { id: 'ind-23', name: 'Emotional Distress', category: 'fear', confidence: 84, contribution: 30, evidence: '"Uncontrolled crying during voice interaction."' }
    ],
    timeline: [
      { time: '0:10', svi: 45 },
      { time: '1:00', svi: 62 },
      { time: '2:15', svi: 82, label: 'Stalking report verified' }
    ],
    keyStatements: [
      { phrase: 'Following me to office location every morning', context: 'Stalking escalation', severity: 'HIGH' }
    ],
    messages: [
      { id: 'm20', sender: 'victim', text: 'Someone has been following me to work every morning and calling from unknown numbers.', timestamp: '09:15 AM', sviAfter: 82 }
    ],
    recommendedAction: 'Assign Case Officer + Legal Counseling Connect + Protection Order Support',
    followUpHistory: [
      { day: 1, date: 'Today', svi: 82, level: 'HIGH', notes: 'Intake complete. Assigned to Officer Rajesh.', status: 'Completed' }
    ],
    traumaModeActive: true,
    traumaStrategy: {
      title: 'HIGH TRAUMA SENSITIVE MODE',
      description: 'Reducing repetitive questioning regarding historic incidents. Focus on protective measures.',
      actionPlan: 'Schedule priority officer callback within 15 minutes.'
    }
  },
  {
    id: 'NHAA-1026',
    complainantName: 'Ananya V. (Anonymized)',
    phone: '+91 94******88',
    language: 'Telugu / English',
    sviScore: 64,
    sviLevel: 'MODERATE',
    confidence: 81,
    priority: 'MODERATE',
    status: 'ASSIGNED',
    assignedOfficer: 'Officer Meera Patel',
    lifecycleStage: 'Action',
    createdTime: '2 hours ago',
    lastUpdate: '45 mins ago',
    summary: 'Workplace harassment and grievance submission. Moderate psychological stress detected without immediate physical safety risk.',
    indicators: [
      { id: 'ind-31', name: 'Workplace Distress', category: 'fear', confidence: 78, contribution: 50, evidence: '"Hostile work environment in department."' },
      { id: 'ind-32', name: 'Anxiety Symptoms', category: 'urgency', confidence: 75, contribution: 50, evidence: '"Loss of sleep for last 2 weeks."' }
    ],
    timeline: [
      { time: '0:05', svi: 35 },
      { time: '1:10', svi: 64 }
    ],
    keyStatements: [
      { phrase: 'Hostile work environment in department', context: 'Grievance description', severity: 'MODERATE' }
    ],
    messages: [],
    recommendedAction: 'Grievance Officer Callback + HR Mediation Guidance',
    followUpHistory: [],
    traumaModeActive: false,
    traumaStrategy: {
      title: 'STANDARD ASSISTIVE MODE',
      description: 'Structured info gathering with empathetic feedback.',
      actionPlan: 'Collect department documentation.'
    }
  },
  {
    id: 'NHAA-1027',
    complainantName: 'Kavita M. (Anonymized)',
    phone: '+91 91******01',
    language: 'English',
    sviScore: 31,
    sviLevel: 'LOW',
    confidence: 90,
    priority: 'LOW',
    status: 'NEW',
    assignedOfficer: 'Officer Vikram Singh',
    lifecycleStage: 'Received',
    createdTime: '4 hours ago',
    lastUpdate: '3 hours ago',
    summary: 'General query regarding NHAA scheme documentation and financial legal aid eligibility.',
    indicators: [
      { id: 'ind-41', name: 'Information Seeking', category: 'urgency', confidence: 92, contribution: 100, evidence: '"Query regarding scholarship aid criteria."' }
    ],
    timeline: [
      { time: '0:05', svi: 31 }
    ],
    keyStatements: [
      { phrase: 'Query regarding scholarship aid criteria', context: 'Informational query', severity: 'LOW' }
    ],
    messages: [],
    recommendedAction: 'Provide Automated Scheme Brochure & FAQ Link',
    followUpHistory: [],
    traumaModeActive: false,
    traumaStrategy: {
      title: 'INFORMATIONAL MODE',
      description: 'Standard fast questionnaire.',
      actionPlan: 'Auto-reply sent.'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-101',
    timestamp: '2026-09-06 09:42:15',
    user: 'SAHAY AI Core Engine',
    role: 'Automated AI',
    action: 'Dynamic Vulnerability Escalation',
    caseId: 'NHAA-1024',
    aiRecommendation: 'Immediate Human Officer Intervention (SVI: 91)',
    humanDecision: 'System Auto-Queue',
    reason: 'SVI Threshold > 85 Triggered'
  },
  {
    id: 'audit-100',
    timestamp: '2026-09-06 09:25:04',
    user: 'Officer Rajesh Kumar',
    role: 'NHAA Officer',
    action: 'Override AI Recommendation',
    caseId: 'NHAA-1025',
    aiRecommendation: 'Critical Emergency Response',
    humanDecision: 'Modified to High Priority Urgent',
    reason: 'Additional phone consultation revealed victim is currently in safe community center.'
  },
  {
    id: 'audit-99',
    timestamp: '2026-09-06 08:50:11',
    user: 'Officer Meera Patel',
    role: 'NHAA Officer',
    action: 'Accepted AI Recommendation',
    caseId: 'NHAA-1026',
    aiRecommendation: 'Moderate Priority Callback',
    humanDecision: 'Accepted',
    reason: 'Confirmed workplace grievance alignment.'
  }
];
