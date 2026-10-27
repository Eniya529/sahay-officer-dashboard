import type { ScenarioItem, OfficerRecord } from '../types';

export const SCENARIO_ITEMS: ScenarioItem[] = [
  {
    id: 'sc-1',
    title: 'Repeated Intimidation & Threat',
    description: 'Individuals threatening physical harm if complaints are lodged.',
    category: 'Threat or intimidation',
    iconName: 'ShieldAlert',
    initialMessage: 'They have been threatening me repeatedly. I am scared to go home and I don\'t know what will happen.'
  },
  {
    id: 'sc-2',
    title: 'Domestic Harassment & Violence',
    description: 'Physical safety concerns within the home or family circle.',
    category: 'Physical violence',
    iconName: 'AlertTriangle',
    initialMessage: 'I am experiencing physical threats at home. I need assistance regarding safe shelter options.'
  },
  {
    id: 'sc-3',
    title: 'Social Boycott & Exclusion',
    description: 'Denial of access to local community amenities, water, or social gathering.',
    category: 'Social exclusion or boycott',
    iconName: 'Users',
    initialMessage: 'Our family is facing a social boycott in our village. We are not allowed to access the community water source.'
  },
  {
    id: 'sc-4',
    title: 'Workplace Discrimination & Denial',
    description: 'Harassment or denial of wages/promotion based on identity.',
    category: 'Workplace discrimination',
    iconName: 'Briefcase',
    initialMessage: 'I am facing continuous hostile behavior and wage withholding at my workplace due to my background.'
  },
  {
    id: 'sc-5',
    title: 'Community Caste-Based Bias',
    description: 'Discriminatory practices or verbal abuse in public spaces.',
    category: 'Community discrimination',
    iconName: 'Building',
    initialMessage: 'Local group members are using derogatory caste-based remarks and preventing us from opening our shop.'
  },
  {
    id: 'sc-6',
    title: 'Property & Land Coercion',
    description: 'Forced encroachment or destruction of agricultural/residential property.',
    category: 'Property-related issue',
    iconName: 'Home',
    initialMessage: 'They damaged our boundary fence yesterday and threatened to forcefully take over our land plot.'
  },
  {
    id: 'sc-7',
    title: 'Fear of Retaliation for Reporting',
    description: 'Hesitation to visit police station due to fear of local backlash.',
    category: 'Retaliation or fear of reporting',
    iconName: 'Eye',
    initialMessage: 'I want to report what happened, but they warned me that if I go to the police station they will hurt my family.'
  },
  {
    id: 'sc-8',
    title: 'Online Stalking & Cyber Harassment',
    description: 'Persistent unwanted messages, photo tampering, or digital blackmail.',
    category: 'Threat or intimidation',
    iconName: 'Globe',
    initialMessage: 'Someone has been sending threatening messages on social media and sharing modified photos to intimidate me.'
  },
  {
    id: 'sc-9',
    title: 'Gender-Based Harassment',
    description: 'Unsafe public transit or public space harassment.',
    category: 'Sexual violence',
    iconName: 'UserX',
    initialMessage: 'I am being followed every day on my way back from college by two individuals on a scooter.'
  },
  {
    id: 'sc-10',
    title: 'Family Property Deprivation',
    description: 'Elderly or vulnerable relative financial exploitation.',
    category: 'Family-related threat',
    iconName: 'HeartHandshake',
    initialMessage: 'My relatives forcefully took away my pension cards and are refusing to give me access to food and medicine.'
  },
  {
    id: 'sc-11',
    title: 'Public Amenities Blockade',
    description: 'Preventing access to healthcare clinics or schools.',
    category: 'Social exclusion or boycott',
    iconName: 'Ban',
    initialMessage: 'Certain local elements are blocking our children from entering the local government school.'
  },
  {
    id: 'sc-12',
    title: 'General Support & Guidance',
    description: 'Uncertain about category but seeking immediate protection advice.',
    category: 'Other concern',
    iconName: 'HelpCircle',
    initialMessage: 'I am not sure how to legally handle this situation, but I am feeling unsafe and need guidance.'
  }
];

export const INITIAL_OFFICERS: OfficerRecord[] = [
  {
    id: 'OFF-884',
    name: 'Officer Rajesh Kumar',
    role: 'Senior NHAA Response Officer',
    state: 'Delhi NCR',
    district: 'Central Delhi',
    languages: ['Hindi', 'English'],
    categories: ['Threat or intimidation', 'Physical violence', 'Retaliation or fear of reporting'],
    currentWorkload: 3,
    criticalCasesCount: 1,
    availability: 'Available'
  },
  {
    id: 'OFF-912',
    name: 'Officer Meera Patel',
    role: 'NHAA Legal & Protection Officer',
    state: 'Tamil Nadu',
    district: 'Chennai North',
    languages: ['Tamil', 'English'],
    categories: ['Social exclusion or boycott', 'Workplace discrimination', 'Family-related threat'],
    currentWorkload: 2,
    criticalCasesCount: 0,
    availability: 'Available'
  },
  {
    id: 'OFF-740',
    name: 'Officer Vikram Singh',
    role: 'NHAA Field Liaison Officer',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    languages: ['Hindi', 'English'],
    categories: ['Property-related issue', 'Community discrimination'],
    currentWorkload: 4,
    criticalCasesCount: 1,
    availability: 'On Duty Call'
  },
  {
    id: 'OFF-615',
    name: 'Officer Ananya Reddy',
    role: 'NHAA Crisis Intake Officer',
    state: 'Telangana',
    district: 'Hyderabad Central',
    languages: ['Telugu', 'Hindi', 'English'],
    categories: ['Threat or intimidation', 'Sexual violence', 'Retaliation or fear of reporting'],
    currentWorkload: 1,
    criticalCasesCount: 0,
    availability: 'Available'
  },
  {
    id: 'OFF-509',
    name: 'Officer Suresh Gowda',
    role: 'NHAA Welfare & Follow-up Specialist',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    languages: ['Kannada', 'English'],
    categories: ['Social exclusion or boycott', 'Family-related threat', 'Other concern'],
    currentWorkload: 2,
    criticalCasesCount: 0,
    availability: 'Available'
  }
];
