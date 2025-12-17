/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";

/* =======================
   Types
======================= */

export interface TtsRequest {
  text: string;
}

export interface TtsResponse {
  audioUrl?: string;
  audioBase64?: string;
}

export interface SttResponse {
  text: string;
}

/* play-for-testing */
export interface PlayForTestingRequest {
  text: string;
}

export type PlayForTestingResponse = any; 
// backend usually returns audio stream / blob / json – keep flexible

/* =======================
   API
======================= */

export const audioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // POST: /audio/tts
    textToSpeech: builder.mutation<TtsResponse, TtsRequest>({
      query: (body) => ({
        url: "/audio/tts",
        method: "POST",
        body,
      }),
    }),

    // POST: /audio/stt/
    speechToText: builder.mutation<SttResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("recordedfile", file);

        return {
          url: "/audio/stt/",
          method: "POST",
          body: formData,
        };
      },
    }),

    // GET: /audio/play-for-testing?text=...
    playForTesting: builder.query<
      PlayForTestingResponse,
      PlayForTestingRequest
    >({
      query: ({ text }) => ({
        url: "/audio/play-for-testing",
        method: "GET",
        params: { text },
      }),
    }),

  }),
});

/* =======================
   Hooks
======================= */

export const {
  useTextToSpeechMutation,
  useSpeechToTextMutation,
  usePlayForTestingQuery,
  useLazyPlayForTestingQuery,
} = audioApi;
