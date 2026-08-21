export type UserRole = 'student' | 'volunteer' | 'counsellor' | 'admin';

export type AppLanguage = 'en' | 'ta' | 'tanglish';

export type CompanionAvatarType = 'blob' | 'otter' | 'sprout' | 'owl';

export type CompanionTone = 'gentle' | 'upbeat' | 'straight-talking';

export type CompanionEmotion = 'neutral' | 'happy' | 'concerned' | 'celebrating' | 'listening' | 'sleepy' | 'breathing';

export interface CompanionConfig {
  name: string;
  avatar: CompanionAvatarType;
  tone: CompanionTone;
  voiceEnabled: boolean;
  voicePitch?: number;
}

export interface CheckinData {
  id: string;
  timestamp: string; // ISO string
  dateStr: string; // e.g. "2026-08-20"
  sleep: number; // 1-5
  stress: number; // 1-5 (1 = very calm, 5 = extremely high)
  energy: number; // 1-5
  social: number; // 1-5
  workload: number; // 1-5
  journalNote?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  isQuietPulse?: boolean;
  quietPulseMood?: 'calm' | 'stressed' | 'hanging-on' | 'exhausted';
  streakDay?: number;
}

export interface FutureMessage {
  id: string;
  title: string;
  content: string;
  audioBlobUrl?: string;
  triggerTag: 'hard-day' | 'exam-anxiety' | 'homesick' | 'lonely' | 'self-doubt' | 'general';
  createdAt: string;
  openedAt?: string;
  isOpened: boolean;
}

export interface PeerReply {
  id: string;
  authorPseudonym: string;
  isVolunteer: boolean;
  volunteerKarma?: number;
  content: string;
  createdAt: string;
  thanked: boolean;
}

export interface PeerPost {
  id: string;
  room: 'exams' | 'homesick' | 'relationships' | 'transitions' | 'research';
  authorPseudonym: string;
  isVolunteer: boolean;
  volunteerKarma?: number;
  title: string;
  content: string;
  upvotes: number;
  hasUpvoted?: boolean;
  helpfulCount: number;
  replies: PeerReply[];
  flaggedForReview: boolean;
  flagReason?: string;
  flaggedBy?: string;
  createdAt: string;
}

export interface CounsellorBooking {
  id: string;
  urgency: 'routine' | 'urgent';
  topic: string;
  slotTime: string;
  counsellorName: string;
  counsellorTitle: string;
  mode: 'in-person' | 'private-voice' | 'secure-chat';
  status: 'booked' | 'in-progress' | 'completed';
  createdAt: string;
  estimatedWaitMinutes: number;
  followUpSchedule: FollowUpItem[];
}

export interface FollowUpItem {
  id: string;
  weekNumber: number;
  scheduledDate: string;
  prompt: string;
  status: 'pending' | 'completed' | 'skipped';
  responseMood?: number;
  responseNote?: string;
}

export interface ParentMessageTemplate {
  message: string;
  tips: string[];
  suggestedTiming: string;
  translatedSummary?: string;
}

export interface DepartmentTrend {
  department: string;
  year: string;
  totalActiveStudents: number; // Must be >= 15 to show breakdown
  burnoutIndex: number; // 0-100%
  stressSpikeRatio: number; // vs baseline
  primaryStressors: string[];
  isSuppressed: boolean; // true if < 15 students (k-anonymity privacy guarantee)
}

export interface CrisisHelpline {
  name: string;
  number: string;
  available: string;
  languages: string;
  description: string;
  isGovernment?: boolean;
  isTollFree?: boolean;
}
