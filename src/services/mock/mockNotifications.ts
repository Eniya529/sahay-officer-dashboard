import type { NotificationItem } from '../../types';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    caseId: 'SH-1042',
    title: '🔴 New Critical Case Requires Review',
    message: 'Case SH-1042 flagged CRITICAL (SVI: 91). Family safety concern in Chennai.',
    timestamp: '2 min ago',
    type: 'CRITICAL_CASE',
    isRead: false,
    fromLevel: 'HIGH',
    toLevel: 'CRITICAL'
  },
  {
    id: 'notif-2',
    caseId: 'SH-1038',
    title: '↑ Priority Escalated',
    message: 'SH-1038 priority increased: MODERATE → HIGH (SVI: 78). Stalking & retaliation reported.',
    timestamp: '8 min ago',
    type: 'PRIORITY_ESCALATED',
    isRead: false,
    fromLevel: 'MODERATE',
    toLevel: 'HIGH'
  },
  {
    id: 'notif-3',
    caseId: 'SH-1015',
    title: '📅 Follow-up Due Today',
    message: 'Field visit check-in due for case SH-1015 (Water facility access verification).',
    timestamp: '25 min ago',
    type: 'FOLLOWUP_DUE',
    isRead: false
  },
  {
    id: 'notif-4',
    caseId: 'SH-1035',
    title: '👤 Case Assigned',
    message: 'Case SH-1035 assigned to Officer Meera Patel (Madurai Urban).',
    timestamp: '45 min ago',
    type: 'CASE_REASSIGNED',
    isRead: true
  }
];
