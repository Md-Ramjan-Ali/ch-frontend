export interface Question {
  id: number;
  text: string;
}

export interface QuestionSetContent {
  dialogue?: string;
  questions: Question[];
}

export interface LessonQuestionSetResponse {
  id: number;
  lessonId: number;
  subCategoryType: string;
  prompt: string;
  content: QuestionSetContent;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertLessonQuestionSetRequest {
  lessonId: number;
  subCategoryType: string;
  prompt: string;
  content: QuestionSetContent;
}

export interface GetLessonQuestionSetRequest {
  lessonId: number;
  subCategoryType: string;
}
