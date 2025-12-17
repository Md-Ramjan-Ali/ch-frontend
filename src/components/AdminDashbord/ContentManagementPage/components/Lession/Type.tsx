export enum LessonType {
  READING = 'READING',
  WRITING = 'WRITING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING'
}

export enum AIProvider {
  OPEN_AI = 'OPENAI',
  GROK = 'GROK'
}

export enum SubCategoryType {
  MAIN_PASSAGE = 'MAIN_PASSAGE',
  DIALOGUE_SEQUENCING = 'DIALOGUE_SEQUENCING',
  DICTATION_EXERCISE = 'DICTATION_EXERCISE',
  AUDIO_COMPREHENSION = 'AUDIO_COMPREHENSION',
  GRAMMAR_PRACTICE = 'GRAMMAR_PRACTICE',
  COMPLETE_THE_SENTENCES = 'COMPLETE_THE_SENTENCES',
  SHORT_ESSAY = 'SHORT_ESSAY',
  READING_ALOUD = 'READING_ALOUD',
  CONVERSATION_PRACTICE = 'CONVERSATION_PRACTICE',
  PRONUNCIATION_PRACTICE = 'PRONUNCIATION_PRACTICE'
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  provider: AIProvider;
  status?: string;
  createdAt?: string;
}

export interface SubCategory {
  key: SubCategoryType;
  label: string;
  exercise: string;
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  lessonId: string | null;
  lessonTitle: string;
}

export interface ApiConfig {
  endpoint: string;
  fieldName: string;
}

export interface GeneratedContent {
  [key: string]: any;
}