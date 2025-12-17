/* eslint-disable @typescript-eslint/no-explicit-any */
/* =========================
   GENERATE (ADMIN)
========================= */

export type AiProvider = "grok" | "openai";

export type ListeningGenerationType =
  | "audio-comprehension"
  | "dictation-exercise"
  | "dialog-sequencing";

export interface GenerateListeningRequest {
  provider: AiProvider;
  type: ListeningGenerationType;
  prompt: string;
}

export type GenerateListeningResponse = string;

/* =========================
   EVALUATE (USER)
========================= */

export interface ListeningLessonPayload {
  [key: string]: any;
}

export interface EvaluateListeningRequest {
  lesson: ListeningLessonPayload[];
}

export interface EvaluateListeningResponse {
  [key: string]: any;
}
