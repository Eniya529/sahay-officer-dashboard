import type { CaseFollowUp } from '../../types';

export const INITIAL_FOLLOWUPS: CaseFollowUp[] = [
  {
    id: 'fu-101',
    caseId: 'SH-1042',
    day: 1,
    date: '08 Sep 2026',
    svi: 91,
    level: 'CRITICAL',
    notes: 'Urgent physical location check and shelter coordination.',
    status: 'Pending',
    followUpType: 'Safety Verification',
    officerName: 'Officer Meera Patel'
  },
  {
    id: 'fu-102',
    caseId: 'SH-1038',
    day: 1,
    date: '08 Sep 2026',
    svi: 78,
    level: 'HIGH',
    notes: 'Verify commute route protection order compliance.',
    status: 'Pending',
    followUpType: 'Call',
    officerName: 'Officer K. Sundaram'
  },
  {
    id: 'fu-103',
    caseId: 'SH-1035',
    day: 2,
    date: '09 Sep 2026',
    svi: 65,
    level: 'HIGH',
    notes: 'Confirm victim access to legal protection housing.',
    status: 'Scheduled',
    followUpType: 'Field Visit',
    officerName: 'Officer Meera Patel'
  },
  {
    id: 'fu-104',
    caseId: 'SH-1015',
    day: 3,
    date: '08 Sep 2026',
    svi: 68,
    level: 'HIGH',
    notes: 'District Magistrate water facility access check.',
    status: 'Pending',
    followUpType: 'Field Visit',
    officerName: 'Officer Ananya Reddy'
  },
  {
    id: 'fu-105',
    caseId: 'SH-1029',
    day: 5,
    date: '10 Sep 2026',
    svi: 45,
    level: 'MODERATE',
    notes: 'Labor department mediation hearing check-in.',
    status: 'Scheduled',
    followUpType: 'Legal Counseling',
    officerName: 'Officer Rajesh Kumar'
  },
  {
    id: 'fu-106',
    caseId: 'SH-1018',
    day: 1,
    date: '07 Sep 2026',
    svi: 89,
    level: 'CRITICAL',
    notes: 'Cyber portal takedown notice verification.',
    status: 'Overdue',
    followUpType: 'Call',
    officerName: 'Officer Vikram Singh'
  },
  {
    id: 'fu-107',
    caseId: 'SH-1021',
    day: 7,
    date: '06 Sep 2026',
    svi: 32,
    level: 'LOW',
    notes: 'Brochure delivery confirmation.',
    status: 'Completed',
    followUpType: 'Call',
    officerName: 'Officer Suresh Gowda'
  }
];
