import type { OfficerRecord, CaseData } from '../types';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

export async function getOfficers(): Promise<OfficerRecord[]> {
  const snapshot = await getDocs(collection(db, 'users'));

  return snapshot.docs
    .filter((item) => item.data().role === 'officer')
    .map((item) => {
      const data = item.data();

      return {
        id: item.id,
        name: data.name || 'Officer',
        role: data.role || 'officer',
        state: data.state || '',
        district: data.district || '',
        languages: data.languages || [],
        categories: data.categories || [],
        currentWorkload: data.currentWorkload || 0,
        criticalCasesCount: data.criticalCasesCount || 0,
        availability: data.availability || 'Available',
      };
    });
}

export async function getOfficerById(
  officerId: string
): Promise<OfficerRecord | null> {
  const officers = await getOfficers();
  return officers.find((o) => o.id === officerId) || null;
}

export function computeOfficerSmartMatch(
  targetCase: CaseData,
  officers: OfficerRecord[]
) {
  const scored = officers.map((off) => {
    let score = 50;
    const reasons: string[] = [];

    const caseLocation =
      `${targetCase.location || ''} ${targetCase.district || ''} ${targetCase.state || ''}`
        .toLowerCase();

    if (
      caseLocation.includes(off.district.toLowerCase()) ||
      caseLocation.includes(off.state.toLowerCase())
    ) {
      score += 20;
      reasons.push(`Jurisdiction match (${off.district})`);
    }

    if (
      targetCase.language &&
      off.languages.some((l) =>
        targetCase.language.toLowerCase().includes(l.toLowerCase())
      )
    ) {
      score += 15;
      reasons.push(`Language match (${off.languages.join(', ')})`);
    }

    if (off.availability === 'Available') {
      score += 10;
      reasons.push('Officer currently available');
    }

    if (off.currentWorkload <= 2) {
      score += 10;
      reasons.push(`Low active workload (${off.currentWorkload} cases)`);
    } else if (off.currentWorkload >= 4) {
      score -= 10;
    }

    if (
      targetCase.category &&
      off.categories.some((cat) =>
        cat.toLowerCase().includes(targetCase.category!.toLowerCase())
      )
    ) {
      score += 10;
      reasons.push(`Specialty match (${targetCase.category})`);
    }

    const matchPercentage = Math.min(98, Math.max(45, score));

    return {
      ...off,
      jurisdictionMatch: caseLocation.includes(off.district.toLowerCase()),
      languageMatch: true,
      eligibilityMatch: off.availability !== 'Off Duty',
      matchPercentage,
      reasons,
    };
  });

  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    recommended: scored[0],
    eligible: scored.slice(1),
  };
}

export async function incrementOfficerWorkload(
  officerId: string
): Promise<OfficerRecord | null> {
  const officerRef = doc(db, 'users', officerId);

  await updateDoc(officerRef, {
    currentWorkload: increment(1),
  });

  return getOfficerById(officerId);
}