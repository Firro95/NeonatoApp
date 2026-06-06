export interface BabyProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'male' | 'female';
  birthWeight: number; // in kg
  birthHeight: number; // in cm
  birthHeadCirc: number; // in cm
}

export interface GrowthLog {
  id: string;
  date: string; // YYYY-MM-DD
  monthsAge: number; // age in decimal months when logged
  weight: number; // kg
  height: number; // cm
  headCirc: number; // cm
  notes?: string;
}

export type MilestoneCategory = 'motor' | 'cognitive' | 'language' | 'social';

export interface Milestone {
  id: string;
  monthRange: string; // e.g. "0-2", "3-4", "5-6", "7-9", "10-12"
  startMonth: number;
  endMonth: number;
  category: MilestoneCategory;
  title: string;
  description: string;
  tips: string[];
}

export interface Achievement {
  milestoneId: string;
  achievedAt: string; // YYYY-MM-DD
}

export interface PediatricVisit {
  id: string;
  title: string; // e.g., "1° Bilancio de Salute"
  recommendedAgeRange: string; // e.g., "15-30 giorni"
  ageMonths: number; // typical month to schedule
  description: string;
  checks: string[]; // Standard pediatric checks (reflexes, heart rate, etc.)
  vaccines?: string[]; // Vaccinations recommended at this age
  parentQuestions: string[]; // Suggested questions to ask the pediatrician
  done: boolean;
  scheduledDate?: string; // YYYY-MM-DD
  actualDate?: string; // YYYY-MM-DD
  weightGained?: number; // from this visit
  heightGained?: number;
  headCircGained?: number;
  pediatricianNotes?: string;
  customQuestions?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AppState {
  profile: BabyProfile | null;
  growthLogs: GrowthLog[];
  achievements: Achievement[];
  visits: PediatricVisit[];
  chatHistory: ChatMessage[];
}
