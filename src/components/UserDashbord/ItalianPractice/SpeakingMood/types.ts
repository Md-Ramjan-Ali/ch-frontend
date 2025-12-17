// types.ts
export type ExerciseType = 'pronunciation' | 'conversation' | 'reading' | 'complete';
export type SubCategoryType = 'PRONUNCIATION_PRACTICE' | 'CONVERSATION_PRACTICE' | 'READING_ALOUD';

// API Response Interfaces
export interface PronunciationApiResponse {
  phrase: string;
  phonetic: string;
  translation: string;
}

export interface ConversationApiResponse {
  dialogue: Array<{
    english: string;
    italian: string;
    speaker: string;
    phonetic: string;
  }>;
}

export interface ReadingAloudApiResponse {
  title: string;
  italian_text: string;
  english_translation: string;
}

export interface QuestionSetData {
  id: number;
  lessonId: number;
  subCategoryType: SubCategoryType;
  prompt: string;
  content: PronunciationApiResponse | ConversationApiResponse | ReadingAloudApiResponse;
  createdAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: QuestionSetData;
}

// Component Props
export interface PronunciationPracticeProps {
  phrase: PronunciationApiResponse;
  isRecording: boolean;
  recordingScore: number | null;
  onMicClick: () => void;
  onContinue: () => void;
  onTryAgain: () => void;
  isLastPhrase?: boolean;
}

export interface ConversationPracticeProps {
  dialogue: Array<{
    english: string;
    italian: string;
    speaker: string;
    phonetic: string;
  }>;
  prompt: string;
  isRecording: boolean;
  recordingScore: number | null;
  onMicClick: () => void;
  onContinue: () => void;
  onTryAgain: () => void;
}

export interface ReadingPracticeProps {
  title: string;
  italianText: string;
  englishTranslation: string;
  prompt: string;
  isRecording: boolean;
  recordingScore: number | null;
  onMicClick: () => void;
  onContinue: () => void;
  onTryAgain: () => void;
}