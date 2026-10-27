import type { CaseFollowUp } from '../types';
import { INITIAL_FOLLOWUPS } from './mock/mockFollowups';

let localFollowupsStore: CaseFollowUp[] = [...INITIAL_FOLLOWUPS];

export async function getFollowups(): Promise<CaseFollowUp[]> {
  return [...localFollowupsStore];
}

export async function getFollowupsByCase(caseId: string): Promise<CaseFollowUp[]> {
  return localFollowupsStore.filter(f => f.caseId === caseId);
}

export async function saveFollowup(followup: CaseFollowUp): Promise<CaseFollowUp> {
  const existingIdx = localFollowupsStore.findIndex(f => f.id === followup.id);
  if (existingIdx >= 0) {
    localFollowupsStore[existingIdx] = { ...followup };
  } else {
    localFollowupsStore = [followup, ...localFollowupsStore];
  }
  return followup;
}

export async function updateFollowupStatus(followupId: string, status: CaseFollowUp['status'], notes?: string): Promise<CaseFollowUp | null> {
  const target = localFollowupsStore.find(f => f.id === followupId);
  if (!target) return null;

  const updated: CaseFollowUp = {
    ...target,
    status,
    notes: notes ? `${target.notes} | ${notes}` : target.notes
  };

  localFollowupsStore = localFollowupsStore.map(f => f.id === followupId ? updated : f);
  return updated;
}
