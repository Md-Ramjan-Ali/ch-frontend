/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  GenerateListeningRequest,
  GenerateListeningResponse,
  EvaluateListeningRequest,
  EvaluateListeningResponse,
} from "./listeningAi.types";

export const listeningAiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       GENERATE LISTENING CONTENT
       POST /ai/admin/generate/listening-comprehension/
    ========================= */
    generateListeningContent: builder.mutation<
      GenerateListeningResponse,
      GenerateListeningRequest
    >({
      query: (body) => ({
        url: "/ai/admin/generate/listening-comprehension/",
        method: "POST",
        body,
      }),
    }),

    /* =========================
       EVALUATE LISTENING PERFORMANCE
       POST /ai/user/evaluate/listening-performance/
    ========================= */
    evaluateListeningPerformance: builder.mutation<
      EvaluateListeningResponse,
      EvaluateListeningRequest
    >({
      query: (body) => ({
        url: "/ai/user/evaluate/listening-performance/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGenerateListeningContentMutation,
  useEvaluateListeningPerformanceMutation,
} = listeningAiApi;
