/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum Status {
  Published = 'Published',
  Drafted = 'Drafted',
}

export enum Category {
  Reading = 'Reading',
  Writing = 'Writing',
  Listening = 'Listening',
  Speaking = 'Speaking',
}

// SINGLE FLASHCARD
export interface Flashcard {
  id: number;
  frontText: string;
  backText: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

// CATEGORY WITH CARDS
export interface FlashcardCategory {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  cards?: Flashcard[];
  // Additional fields for UI
  description?: string;
  difficulty?: Difficulty;
  status?: Status;
  category?: Category;
  cardsCount?: number;
  lastModified?: string;
  avgRating?: number;
}

// API RESPONSES
export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// REQUEST TYPES
export interface CreateCategoryRequest {
  title: string;
}

export interface CreateFlashcardRequest {
  frontText: string;
  backText: string;
  categoryId: number;
}

export interface UpdateFlashcardRequest {
  frontText: string;
  backText: string;
}

export interface StartSessionRequest {
  categoryId?: number;
}

export interface GradeCardRequest {
  sessionId: string;
  cardId: number;
  grade: number;
  currentTimeSeconds?: number; // Add this field
}

export interface PauseSessionRequest {
  sessionId: string;
}

// UI TYPES
export interface FlashcardDeck {
  id: number;
  title: string;
  description: string;
  cards: number;
  difficulty: Difficulty;
  category: Category;
  status: Status;
  lastModified: string;
  avgRating: number;
}

export enum LessonSectionType {
  Vocabulary = 'Vocabulary',
  Grammar = 'Grammar',
  Exercise = 'Exercise',
  Media = 'Media',
}

export interface LessonSection {
  id: number;
  type: LessonSectionType;
  title: string;
  content: string;
  audioFile?: File | null;
  imageFile?: File | null;
}

export enum LessonAccess {
  Free = 'Free for all users',
  Premium = 'Premium users only',
}

export interface Lesson extends Omit<FlashcardDeck, 'description'> {
  estimatedDuration: string;
  description: string;
  content: LessonSection[];
  access: LessonAccess;
}

export interface PhraseOfTheDay {
  italian: string;
  englishTranslation: string;
  pronunciation: string;
  explanation: string;
}

export interface FlashcardOverview {
  totalDecks: number;
  publishedLessons: number;
  totalFlashcards: number;
  contentViews: number;
  dueCards: number;
  lifetimeStats: {
    totalReviews: number;
    totalTimeSpent: number;
    averageGrade: number;
  };
}



// flashcard.types.ts (update with user types)
// flashcard.types.ts
export interface UserFlashcardOverview {
  totalDecks: number;
  dueCards: number;
 
  lifetimeStats: {
    totalReviews: number;
    totalTimeSpent: number;
    averageGrade: number;
  };

  categories: Array<{
    id: number;
    title: string;
    totalCards: number;
    masteredCards: number;
    dueCards: number;
    isActiveSession: boolean; // ✅ FIXED
  }>;
}

export interface SessionData {
  sessionId: string;
  categoryId: number;
  categoryTitle: string;
  currentCard?: Flashcard;
  cardsRemaining: number;
  totalCards: number;
  startedAt: string;
  isActive: boolean;
}

export interface GradeResponse {
  nextCard?: Flashcard;
  sessionComplete: boolean;
  cardsRemaining: number;
  stats: {
    correct: number;
    incorrect: number;
    totalReviewed: number;
  };
}




// flashcards.types.ts

export interface Flashcard {
  cardId: number;
  frontText: string;
  backText: string;
  currentInterval: number;
  // For backward compatibility
 }

export interface SessionData {
  sessionId: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  cardsRemaining: number;
  scores: {
    correctCount: number;
    incorrectCount: number;
  };
  currentCard?: Flashcard;
  totalTimeSeconds: number;
  formattedTime: string;
 }

export interface GradeResponse {
  scores: {
    correctCount: number;
    incorrectCount: number;
  };
  sessionFinished: boolean;
  currentCard?: Flashcard;
  totalTimeSeconds: number;
  formattedTime: string;
}

export interface PauseResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    status: 'PAUSED';
    totalTimeSeconds: number;
  };
}

export interface FlashcardOverviewResponse {
  categories: Array<{
    categoryId: number;
    categoryTitle: string;
    total: number;
    due: number;
    mastered: number;
    isActiveSession: boolean;
  }>;
  lifetimeMetrics: {
    sessionsCompleted: number;
    totalCardsStudied: number;
    averageScorePercentage: number;
  };
}



export interface PauseSessionRequest {
  sessionId: string;
  currentTimeSeconds?: number; // Add this field
}




// flashcards.types.ts
export interface SessionState {
  sessionId: string;
  categoryId: number;
  categoryTitle: string;
  currentCard: Flashcard;
  scores: {
    correctCount: number;
    incorrectCount: number;
  };
  cardsRemaining: number;
  totalCards: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  totalTimeSeconds: number;
  formattedTime: string;
  startTime: number; // Timestamp when session started
  answeredCards: Array<{
    cardId: number;
    frontText: string;
    backText: string;
    grade: number;
    timestamp: number;
    wasCorrect: boolean;
  }>;
}

export interface SessionSummary {
  sessionId: string;
  categoryId: number;
  categoryTitle: string;
  totalCards: number;
  completedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalTimeSeconds: number;
  formattedTime: string;
  averageGrade: number;
  completedAt: number;
}









// // SINGLE FLASHCARD
// export interface Flashcard {
//   id: number;
//   frontText: string;
//   backText: string;
//   categoryId: number;
//   createdAt: string;
//   updatedAt: string;
// }

// // CATEGORY WITH CARDS
// export interface FlashcardCategory {
//   id: number;
//   title: string;
//   createdAt: string;
//   updatedAt: string;
//   cards?: Flashcard[];
// }

// // API RESPONSES
// export interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
// }

// // REQUEST TYPES
// export interface CreateCategoryRequest {
//   title: string;
// }

// export interface CreateFlashcardRequest {
//   frontText: string;
//   backText: string;
//   categoryId: number;
// }

// export interface UpdateFlashcardRequest {
//   frontText: string;
//   backText: string;
// }

// export interface StartSessionRequest {
//   categoryId?: number;
// }

// export interface GradeCardRequest {
//   sessionId: string;
//   cardId: number;
//   grade: number;
// }

// export interface PauseSessionRequest {
//   sessionId: string;
// }
