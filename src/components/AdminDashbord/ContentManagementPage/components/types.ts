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