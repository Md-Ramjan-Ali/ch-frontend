export type LessonType = "READING" | "LISTENING" | "SPEAKING" | "WRITING";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  level: number;
  score?: number;
  // add other fields returned by your backend
}

export interface GetNextLessonRequest {
  type: LessonType;
}

export type GetNextLessonResponse = Lesson;
