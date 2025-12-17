/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts

export interface UserData {
  id: number|string;
  fullName: string;
  email: string;
  joinDate: string;
  lastActive: string;
  phone: string;
  location: string;
  status: 'Active' | 'Suspended';
  memberType: 'Basic' | 'Pro Member';
  dayStreak: number;
  name: string;
  avatar: string;
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
 currentStreak: number;
 currentLevel: string;
  dailyGoalMinutes: number;
  createdAt: string;
  
  stats: {
    lessonsCompleted: number;
    lessonsRemaining: number;
    wordsLearned: number;
    wordsGrowth: number; // e.g., 23
    studyHours: number;
    studyMinutes: number;
  };
  
  learning: {
    currentLevel: string;
    flashcardsReviewed: number;
    achievements: number;
    progress: {
      lessonProgress: number; // Percentage
      vocabularyMastery: number;
      grammarSkills: number;
    };
  };

  subscription: {
    planName: 'Pro Plan' | 'Basic Plan';
    isActive: boolean;
    startDate: string;
    endDate: string;
    paymentMethod: string;
    autoRenewal: 'On' | 'Off';
    nextBilling: string;
    planFeatures: string[];
  };
}

// Mock data to use in the main component
// export const mockUserData: UserData = {
//   id: 1,
//   name: 'Maria Rossi',         // required
//   fullName: 'Maria Rossi',
//   email: 'maria.rossi@email.com',
//   avatar: '/avatars/maria.png', // required
//   emailVerified: true,          // required
//   hasUsedTrial: false,          // required
//   joinDate: '15/06/2023',
//   lastActive: '15/01/2024',
//   phone: '+39 345 123 4567',
//   location: 'Rome, Italy',
//   status: 'Suspended',
//   memberType: 'Pro Member',
//   dayStreak: 12,
//   stats: { lessonsCompleted: 32, lessonsRemaining: 13, wordsLearned: 850, wordsGrowth: 23, studyHours: 66, studyMinutes: 25 },
//   learning: { currentLevel: 'Intermediate', flashcardsReviewed: 1240, achievements: 8, progress: { lessonProgress: 72, vocabularyMastery: 68, grammarSkills: 75 } },
//   subscription: { planName: 'Pro Plan', isActive: true, startDate: '16/10/2023', endDate: '16/10/2024', paymentMethod: '**** 4532', autoRenewal: 'On', nextBilling: '15/06/2024', planFeatures: ['Unlimited lessons','Advanced analytics','Offline downloads','Priority support'] }
// };
 
