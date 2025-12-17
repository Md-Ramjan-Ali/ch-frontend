/* eslint-disable @typescript-eslint/no-explicit-any */
export type LessonType = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

export interface Lesson {
  id: number;
  title: string;
  type: LessonType;
  difficulty?: string;
  provider?: string;
  isPublished: boolean;
  createdAt: string;
  questionSets?: any[]; // Can be typed further if needed
}

export interface LessonCreateRequest {
  title: string;
  type: LessonType;
  provider: string;
}

export interface LessonUpdateStatusRequest {
  isPublished: boolean;
}

export interface LessonListResponse {
  data: Lesson[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
