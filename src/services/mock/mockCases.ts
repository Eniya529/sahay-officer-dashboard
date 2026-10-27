import type { CaseData, AuditLogEntry } from '../../types';

export const INITIAL_CASES: CaseData[] = [
  {
    id: 'SH-1042',
    complainantName: 'Sunita Sharma (Anonymized)',
    phone: '+91 98******12',
    language: 'Tamil / English',
    location: 'Chennai · Tamil Nadu',
    district: 'Chennai Central',
    state: 'Tamil Nadu',
    sviScore: 91,
    sviLevel: 'CRITICAL',
    confidence: 87,
    priority: 'CRITICAL',
    status: 'AWAITING_REVIEW',
    lifecycleStage: 'Officer Review',
    createdTime: '08 Sep 2026 10:40 AM',
    lastUpdate: '2 min ago',
    summary: 'Complainant reports direct threats to family members, physical intimidation at residence, and fear of retaliation if complaint is filed.',
    emotionalIndicators: ['Fear', 'Distress', 'Acute Anxiety'],
    contextualIndicators: ['Threat', 'Retaliation', 'Social Intimidation'],
    safetyIndicators: ['Family safety concern', 'Home environment unsafe'],
    keyEvidence: ['They threatened my family.', 'Some people in my area have been threatening me.'],
    reasoning: 'The victim interaction contains escalating threat indicators, family safety concerns, and acute fear of retaliation.',
    indicators: [
      { id: 'ind-1', name: 'Direct Threat to Family', category: 'threat', confidence: 94, contribution: 35, evidence: '"They said they would hurt my family if I contacted authorities."' },
      { id: 'ind-2', name: 'Fear & Acute Anxiety', category: 'fear', confidence: 89, contribution: 25, evidence: '"I am afraid to go home. Yesterday they came to my house."' },
      { id: 'ind-3', name: 'Immediate Safety Vulnerability', category: 'safety', confidence: 91, contribution: 22, evidence: '"Perpetrators seen near residential entrance."' },
      { id: 'ind-4', name: 'Retaliation Warning', category: 'threat', confidence: 88, contribution: 18, evidence: '"They told me not to complain to anyone."' }
    ],
    timeline: [
      { time: '10:40 AM', svi: 42, label: 'Initial Interaction' },
      { time: '10:42 AM', svi: 67, label: 'Threat Indicator Detected' },
      { time: '10:44 AM', svi: 91, label: 'Family Safety Concern' }
    ],
    keyStatements: [
      { phrase: 'They threatened my family', context: 'High severity threat trigger', severity: 'CRITICAL' },
      { phrase: 'They told me not to complain to anyone', context: 'Retaliation warning', severity: 'HIGH' },
      { phrase: 'Yesterday they came to my house', context: 'Home encroachment pattern', severity: 'CRITICAL' }
    ],
    messages: [
      { id: 'm1', sender: 'victim', text: 'Some people in my area have been threatening me.', timestamp: '10:40 AM', inputType: 'text', sviAfter: 42 },
      { id: 'm2', sender: 'assistant', text: 'Namaste. You are connected with SAHAY. Are you in a safe place right now?', timestamp: '10:41 AM', inputType: 'text' },
      { id: 'm3', sender: 'victim', text: 'They told me not to complain to anyone.', timestamp: '10:42 AM', inputType: 'text', sviAfter: 67 },
      { id: 'm4', sender: 'assistant', text: 'We take your safety very seriously. Can you tell us if you are currently alone?', timestamp: '10:43 AM', inputType: 'text' },
      { id: 'm5', sender: 'victim', text: 'Yesterday they came to my house and threatened my family.', timestamp: '10:44 AM', inputType: 'voice', sviAfter: 91 }
    ],
    recommendedAction: 'Priority human review recommended. Immediate officer dispatch + temporary shelter connection.',
    followUpHistory: [
      { id: 'fu-1', caseId: 'SH-1042', day: 1, date: '08 Sep 2026', svi: 91, level: 'CRITICAL', notes: 'Immediate officer intake and safety verification scheduled.', status: 'Pending', followUpType: 'Safety Verification' }
    ],
    traumaModeActive: true,
    traumaStrategy: {
      title: 'CRITICAL SAFETY FOCUS MODE',
      description: 'High distress & active threat detected. Prioritizing physical location safety.',
      actionPlan: 'Direct connection to senior response officer.'
    },
    category: 'Threat & Intimidation',
    assessmentEvents: [
      { id: 'evt-1', timestamp: '10:40 AM', messageText: 'Some people in my area have been threatening me.', svi: 42, level: 'MODERATE', confidence: 0.82, reasoning: 'Initial harassment report', keyEvidence: ['threatening me'], adaptiveQuestion: 'Where did this happen?', recommendedAction: 'Standard logging' },
      { id: 'evt-2', timestamp: '10:42 AM', messageText: 'They told me not to complain to anyone.', svi: 67, level: 'HIGH', confidence: 0.85, reasoning: 'Retaliation warning detected', keyEvidence: ['not to complain'], adaptiveQuestion: 'Are you safe right now?', recommendedAction: 'Officer review' },
      { id: 'evt-3', timestamp: '10:44 AM', messageText: 'Yesterday they came to my house and threatened my family.', svi: 91, level: 'CRITICAL', confidence: 0.89, reasoning: 'Escalation to direct family threats', keyEvidence: ['threatened my family'], adaptiveQuestion: 'Do you need immediate dispatch?', recommendedAction: 'Priority human review recommended.' }
    ]
  },
  {
    id: 'SH-1038',
    complainantName: 'Priya R. (Anonymized)',
    phone: '+91 97******44',
    language: 'Tamil / English',
    location: 'Coimbatore · Tamil Nadu',
    district: 'Coimbatore Urban',
    state: 'Tamil Nadu',
    sviScore: 78,
    sviLevel: 'HIGH',
    confidence: 84,
    priority: 'HIGH',
    status: 'AWAITING_REVIEW',
    lifecycleStage: 'Officer Review',
    createdTime: '08 Sep 2026 10:34 AM',
    lastUpdate: '8 min ago',
    summary: 'Complainant reports persistent stalking on commute and workplace harassment. Elevated distress indicators observed.',
    emotionalIndicators: ['Fear', 'Apprehension'],
    contextualIndicators: ['Stalking', 'Retaliation concern'],
    safetyIndicators: ['Commute safety concern'],
    keyEvidence: ['Following me to office every morning.', 'They threatened retaliation if I speak to HR.'],
    reasoning: 'Repeated stalking pattern combined with workplace retaliation warning.',
    indicators: [
      { id: 'ind-21', name: 'Persistent Stalking', category: 'threat', confidence: 88, contribution: 40, evidence: '"Following me to office every morning."' },
      { id: 'ind-22', name: 'Retaliation Warning', category: 'fear', confidence: 82, contribution: 30, evidence: '"Threatened retaliation if I speak to HR."' }
    ],
    timeline: [
      { time: '10:30 AM', svi: 48 },
      { time: '10:34 AM', svi: 78, label: 'Threat & Retaliation Flagged' }
    ],
    keyStatements: [
      { phrase: 'Following me to office every morning', context: 'Stalking escalation', severity: 'HIGH' },
      { phrase: 'Threatened retaliation if I speak to HR', context: 'Workplace harassment', severity: 'HIGH' }
    ],
    messages: [
      { id: 'm20', sender: 'victim', text: 'Someone has been following me to work every morning and calling from unknown numbers.', timestamp: '10:30 AM', inputType: 'text', sviAfter: 78 }
    ],
    recommendedAction: 'Assign Case Officer + Legal Protection Order Advice.',
    followUpHistory: [
      { id: 'fu-2', caseId: 'SH-1038', day: 1, date: '08 Sep 2026', svi: 78, level: 'HIGH', notes: 'Initial intake complete.', status: 'Pending', followUpType: 'Call' }
    ],
    traumaModeActive: true,
    traumaStrategy: {
      title: 'HIGH TRAUMA SENSITIVE MODE',
      description: 'Reducing repetitive questioning regarding historic incidents.',
      actionPlan: 'Schedule priority officer callback.'
    },
    category: 'Stalking & Harassment'
  },
  {
    id: 'SH-1035',
    complainantName: 'Kavitha M. (Anonymized)',
    phone: '+91 94******88',
    language: 'Telugu / English',
    location: 'Madurai · Tamil Nadu',
    district: 'Madurai South',
    state: 'Tamil Nadu',
    sviScore: 84,
    sviLevel: 'HIGH',
    confidence: 86,
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedOfficer: 'Officer Meera Patel',
    assignedOfficerId: 'OFF-912',
    lifecycleStage: 'Assigned',
    createdTime: '08 Sep 2026 09:15 AM',
    lastUpdate: '25 min ago',
    summary: 'Domestic violence threat and financial coercion. Protection order requested by victim.',
    emotionalIndicators: ['Fear', 'Helplessness'],
    contextualIndicators: ['Domestic Coercion', 'Financial Deprivation'],
    safetyIndicators: ['Residential safety concern'],
    keyEvidence: ['Locked out of house yesterday and threatened.'],
    reasoning: 'Active residential coercion and loss of physical housing security.',
    indicators: [
      { id: 'ind-31', name: 'Domestic Coercion', category: 'threat', confidence: 89, contribution: 50, evidence: '"Locked out of house yesterday."' }
    ],
    timeline: [
      { time: '09:15 AM', svi: 55 },
      { time: '09:25 AM', svi: 84 }
    ],
    keyStatements: [
      { phrase: 'Locked out of house yesterday', context: 'Residential safety concern', severity: 'HIGH' }
    ],
    messages: [],
    recommendedAction: 'Immediate Case Officer Callback + Local Welfare Protection Connect.',
    followUpHistory: [
      { id: 'fu-3', caseId: 'SH-1035', day: 1, date: '08 Sep 2026', svi: 84, level: 'HIGH', notes: 'Officer Meera assigned.', status: 'Completed', followUpType: 'Field Visit' }
    ],
    traumaModeActive: true,
    traumaStrategy: {
      title: 'PROTECTION MODE',
      description: 'Prioritizing legal shelter access.',
      actionPlan: 'Dispatch local liaison.'
    },
    category: 'Domestic Violence'
  },
  {
    id: 'SH-1029',
    complainantName: 'Ananya V. (Anonymized)',
    phone: '+91 91******01',
    language: 'Hindi / English',
    location: 'Central Delhi · Delhi NCR',
    district: 'Central Delhi',
    state: 'Delhi',
    sviScore: 54,
    sviLevel: 'MODERATE',
    confidence: 81,
    priority: 'MODERATE',
    status: 'IN_PROGRESS',
    assignedOfficer: 'Officer Rajesh Kumar',
    assignedOfficerId: 'OFF-884',
    lifecycleStage: 'Action',
    createdTime: '08 Sep 2026 08:30 AM',
    lastUpdate: '1 hour ago',
    summary: 'Workplace discrimination and wage withholding grievance.',
    emotionalIndicators: ['Distress', 'Frustration'],
    contextualIndicators: ['Workplace Discrimination'],
    safetyIndicators: ['Standard Monitoring'],
    keyEvidence: ['Supervisor refusing to disburse approved wages for two months.'],
    reasoning: 'Economic harassment without immediate physical safety risk.',
    indicators: [
      { id: 'ind-41', name: 'Workplace Discrimination', category: 'urgency', confidence: 80, contribution: 100, evidence: '"Wage withholding for two months."' }
    ],
    timeline: [{ time: '08:30 AM', svi: 54 }],
    keyStatements: [
      { phrase: 'Wage withholding for two months', context: 'Workplace grievance', severity: 'MODERATE' }
    ],
    messages: [],
    recommendedAction: 'Labor Welfare Mediation Callback.',
    followUpHistory: [],
    traumaModeActive: false,
    traumaStrategy: {
      title: 'ASSISTIVE MODE',
      description: 'Informational documentation gathering.',
      actionPlan: 'Collect employer details.'
    },
    category: 'Workplace Discrimination'
  },
  {
    id: 'SH-1021',
    complainantName: 'Ramesh K. (Anonymized)',
    phone: '+91 93******55',
    language: 'Kannada / English',
    location: 'Bengaluru · Karnataka',
    district: 'Bengaluru Central',
    state: 'Karnataka',
    sviScore: 32,
    sviLevel: 'LOW',
    confidence: 91,
    priority: 'LOW',
    status: 'RESOLVED',
    assignedOfficer: 'Officer Suresh Gowda',
    assignedOfficerId: 'OFF-509',
    lifecycleStage: 'Closure',
    createdTime: '07 Sep 2026 04:15 PM',
    lastUpdate: '3 hours ago',
    summary: 'Informational inquiry regarding government legal aid support brochure.',
    emotionalIndicators: ['Neutral'],
    contextualIndicators: ['General Inquiry'],
    safetyIndicators: ['No Immediate Threat'],
    keyEvidence: ['Seeking information on legal counsel entitlement.'],
    reasoning: 'Informational query processed and brochure dispatched.',
    indicators: [
      { id: 'ind-51', name: 'Information Seeking', category: 'urgency', confidence: 92, contribution: 100, evidence: '"Seeking legal aid information."' }
    ],
    timeline: [{ time: '04:15 PM', svi: 32 }],
    keyStatements: [
      { phrase: 'Seeking legal aid information', context: 'Public scheme inquiry', severity: 'LOW' }
    ],
    messages: [],
    recommendedAction: 'Automated Brochure Sent. Case Closed.',
    followUpHistory: [],
    traumaModeActive: false,
    traumaStrategy: {
      title: 'INFORMATIONAL MODE',
      description: 'Standard fast questionnaire.',
      actionPlan: 'Auto-reply sent.'
    },
    category: 'General Support'
  },
  {
    id: 'SH-1018',
    complainantName: 'Deepa S. (Anonymized)',
    phone: '+91 96******22',
    language: 'Malayalam / English',
    location: 'Kochi · Kerala',
    district: 'Ernakulam',
    state: 'Kerala',
    sviScore: 89,
    sviLevel: 'CRITICAL',
    confidence: 88,
    priority: 'CRITICAL',
    status: 'ESCALATED',
    assignedOfficer: 'Officer Vikram Singh',
    assignedOfficerId: 'OFF-740',
    lifecycleStage: 'Officer Review',
    createdTime: '08 Sep 2026 07:45 AM',
    lastUpdate: '15 min ago',
    summary: 'Cyber harassment with explicit extortion threats and photo tampering.',
    emotionalIndicators: ['Panic', 'Extreme Fear'],
    contextualIndicators: ['Cyber Blackmail', 'Extortion'],
    safetyIndicators: ['Severe Psychological Harm'],
    keyEvidence: ['Threatening to upload altered photos to social media unless money paid.'],
    reasoning: 'Active cyber extortion with immediate harm to victim reputation and psychological safety.',
    indicators: [
      { id: 'ind-61', name: 'Cyber Blackmail', category: 'threat', confidence: 95, contribution: 60, evidence: '"Demanding extortion payment via online channel."' }
    ],
    timeline: [{ time: '07:45 AM', svi: 89 }],
    keyStatements: [{ phrase: 'Demanding extortion payment', context: 'Cyber crime escalation', severity: 'CRITICAL' }],
    messages: [],
    recommendedAction: 'Immediate Cyber Cell Escalation + Content Takedown Request.',
    followUpHistory: [],
    traumaModeActive: true,
    traumaStrategy: {
      title: 'CYBER EMERGENCY PROTOCOL',
      description: 'High threat of public release.',
      actionPlan: 'Connect to Cyber Response Cell.'
    },
    category: 'Cyber Harassment'
  },
  {
    id: 'SH-1015',
    complainantName: 'Lakshmi N. (Anonymized)',
    phone: '+91 95******99',
    language: 'Telugu / English',
    location: 'Hyderabad · Telangana',
    district: 'Hyderabad Central',
    state: 'Telangana',
    sviScore: 68,
    sviLevel: 'HIGH',
    confidence: 83,
    priority: 'HIGH',
    status: 'FOLLOW_UP',
    assignedOfficer: 'Officer Ananya Reddy',
    assignedOfficerId: 'OFF-615',
    lifecycleStage: 'Follow-up',
    createdTime: '06 Sep 2026 11:20 AM',
    lastUpdate: '1 hour ago',
    summary: 'Social boycott and denial of access to local village water facility.',
    emotionalIndicators: ['Isolation', 'Distress'],
    contextualIndicators: ['Social Boycott', 'Community Bias'],
    safetyIndicators: ['Essential Access Denied'],
    keyEvidence: ['Local elements blocking water access for family.'],
    reasoning: 'Community exclusion violating basic public rights.',
    indicators: [
      { id: 'ind-71', name: 'Social Boycott', category: 'isolation', confidence: 85, contribution: 50, evidence: '"Water facility blocked."' }
    ],
    timeline: [{ time: '11:20 AM', svi: 68 }],
    keyStatements: [{ phrase: 'Water facility blocked', context: 'Community discrimination', severity: 'HIGH' }],
    messages: [],
    recommendedAction: 'District Magistrate Administrative Intervention.',
    followUpHistory: [
      { id: 'fu-4', caseId: 'SH-1015', day: 2, date: '08 Sep 2026', svi: 68, level: 'HIGH', notes: 'Check ground access to water point.', status: 'Pending', followUpType: 'Field Visit' }
    ],
    traumaModeActive: false,
    traumaStrategy: {
      title: 'COMMUNITY PROTECTION',
      description: 'Liaison with local authority.',
      actionPlan: 'Notify District Administration.'
    },
    category: 'Social Exclusion'
  },
  {
    id: 'SH-1012',
    complainantName: 'Bhavna T. (Anonymized)',
    phone: '+91 92******33',
    language: 'Hindi / English',
    location: 'Lucknow · Uttar Pradesh',
    district: 'Lucknow Central',
    state: 'Uttar Pradesh',
    sviScore: 45,
    sviLevel: 'MODERATE',
    confidence: 79,
    priority: 'MODERATE',
    status: 'AWAITING_REVIEW',
    lifecycleStage: 'AI Assessment',
    createdTime: '08 Sep 2026 11:00 AM',
    lastUpdate: '30 min ago',
    summary: 'Property boundary dispute with neighbor using verbal threats.',
    emotionalIndicators: ['Anxiety'],
    contextualIndicators: ['Land Encroachment'],
    safetyIndicators: ['Precautionary Monitoring'],
    keyEvidence: ['Boundary fence damaged during argument.'],
    reasoning: 'Civil property dispute with low physical safety threat.',
    indicators: [{ id: 'ind-81', name: 'Property Dispute', category: 'urgency', confidence: 80, contribution: 40, evidence: '"Boundary fence damaged."' }],
    timeline: [{ time: '11:00 AM', svi: 45 }],
    keyStatements: [{ phrase: 'Boundary fence damaged', context: 'Property dispute', severity: 'MODERATE' }],
    messages: [],
    recommendedAction: 'Civil Mediation Desk Referral.',
    followUpHistory: [],
    traumaModeActive: false,
    traumaStrategy: { title: 'STANDARD MODE', description: 'Informational gathering', actionPlan: 'Refer to local desk' },
    category: 'Property Issue'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-104',
    timestamp: '2026-09-08 10:47:12',
    user: 'Officer Rajesh Kumar (NHAA-884)',
    role: 'Response Officer',
    action: 'Priority Modified: HIGH → CRITICAL',
    caseId: 'SH-1042',
    aiRecommendation: 'AI Proposed Priority: HIGH (SVI: 91)',
    humanDecision: 'MODIFIED to CRITICAL',
    reason: 'Direct threat to family residence verified via telephone callback.',
    details: 'Officer assigned case to Officer Meera Patel.'
  },
  {
    id: 'audit-103',
    timestamp: '2026-09-08 10:44:00',
    user: 'SAHAY AI Engine',
    role: 'Automated AI',
    action: 'AI Risk Re-assessment',
    caseId: 'SH-1042',
    aiRecommendation: 'CRITICAL (SVI: 91)',
    humanDecision: 'System Auto-Queue',
    reason: 'Escalation to direct family safety threat.'
  },
  {
    id: 'audit-102',
    timestamp: '2026-09-08 09:30:15',
    user: 'Supervisor Meera Patel',
    role: 'Desk Officer',
    action: 'Officer Assigned',
    caseId: 'SH-1035',
    aiRecommendation: 'Smart Allocation Matched Officer Meera Patel (94% match)',
    humanDecision: 'Accepted Assignment',
    reason: 'Matched by Jurisdiction (Madurai) & Language (Tamil).'
  },
  {
    id: 'audit-101',
    timestamp: '2026-09-07 16:30:00',
    user: 'Officer Suresh Gowda',
    role: 'Response Officer',
    action: 'Case Resolved & Closed',
    caseId: 'SH-1021',
    aiRecommendation: 'Informational Query Handling',
    humanDecision: 'Closed',
    reason: 'Scheme brochure provided to applicant.'
  }
];
