import type { OfficerRecord } from '../../types';

export const INITIAL_OFFICERS: OfficerRecord[] = [
  {
    id: 'OFF-884',
    name: 'Officer Rajesh Kumar',
    role: 'Senior Response Officer',
    state: 'Delhi NCR',
    district: 'Central Delhi',
    languages: ['Hindi', 'English'],
    categories: ['Threat & Intimidation', 'Physical Violence', 'Retaliation Warning'],
    currentWorkload: 3,
    criticalCasesCount: 1,
    availability: 'Available'
  },
  {
    id: 'OFF-912',
    name: 'Officer Meera Patel',
    role: 'Protection & Allocation Officer',
    state: 'Tamil Nadu',
    district: 'Chennai Central',
    languages: ['Tamil', 'English', 'Telugu'],
    categories: ['Threat & Intimidation', 'Domestic Violence', 'Stalking & Harassment', 'Family Safety'],
    currentWorkload: 2,
    criticalCasesCount: 1,
    availability: 'Available'
  },
  {
    id: 'OFF-740',
    name: 'Officer Vikram Singh',
    role: 'Field & Cyber Liaison Officer',
    state: 'Kerala',
    district: 'Ernakulam',
    languages: ['Malayalam', 'Hindi', 'English'],
    categories: ['Cyber Harassment', 'Extortion', 'Property Issue'],
    currentWorkload: 4,
    criticalCasesCount: 2,
    availability: 'On Duty Call'
  },
  {
    id: 'OFF-615',
    name: 'Officer Ananya Reddy',
    role: 'Crisis Intake Officer',
    state: 'Telangana',
    district: 'Hyderabad Central',
    languages: ['Telugu', 'Hindi', 'English'],
    categories: ['Social Exclusion', 'Retaliation Warning', 'Community Discrimination'],
    currentWorkload: 1,
    criticalCasesCount: 0,
    availability: 'Available'
  },
  {
    id: 'OFF-509',
    name: 'Officer Suresh Gowda',
    role: 'Welfare & Follow-up Specialist',
    state: 'Karnataka',
    district: 'Bengaluru Central',
    languages: ['Kannada', 'English'],
    categories: ['General Support', 'Workplace Discrimination'],
    currentWorkload: 2,
    criticalCasesCount: 0,
    availability: 'Available'
  },
  {
    id: 'OFF-402',
    name: 'Officer K. Sundaram',
    role: 'District Welfare Liaison',
    state: 'Tamil Nadu',
    district: 'Coimbatore Urban',
    languages: ['Tamil', 'English'],
    categories: ['Stalking & Harassment', 'Threat & Intimidation'],
    currentWorkload: 1,
    criticalCasesCount: 0,
    availability: 'Available'
  }
];
