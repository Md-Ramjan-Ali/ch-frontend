/* eslint-disable @typescript-eslint/no-explicit-any */
// types/userManagement.ts
export interface ApiStudent {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  currentLevel: string;
  currentStreak: number;
  dailyGoalMinutes: number;
  emailVerified: boolean;
  hasUsedTrial: boolean;
  isActive: boolean;
  lastPracticeDate: string | null;
  lessonsCompleted: number;
  longestStreak: number;
  nativeLang: string;
  role: string;
  stripeCustomerId: string | null;
  subscriptionPlan: 'FREE' | 'PRO';
  subscriptions: any[];
  targetLang: string;
  timezone: string | null;
  totalMinutesStudied: number;
  trialAvailable: boolean;
  updatedAt: string;
  wordsLearned: number;
  xp: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserMetadata {
  totalUsers: number;
  activeUsers: number;
  proSubscribers: number;
  monthlyRevenue: number;
}