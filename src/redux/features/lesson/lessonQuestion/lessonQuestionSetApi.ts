/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  LessonQuestionSetResponse,
  UpsertLessonQuestionSetRequest,
  GetLessonQuestionSetRequest,
} from "./lessonQuestionSet.types";

export const lessonQuestionSetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: /questionset/{lessonId}?subCategoryType=...
    getLessonQuestionSet: builder.query<
      LessonQuestionSetResponse,
      GetLessonQuestionSetRequest
    >({
      query: ({ lessonId, subCategoryType }) => ({
        url: `/questionset/${lessonId}`,
        method: "GET",
        params: { subCategoryType },
      }),
      providesTags: (_result, _error, arg) => [
        {
          type: "LessonQuestionSet",
          id: `${arg.lessonId}-${arg.subCategoryType}`,
        },
      ],
    }),

    // POST: /questionset (upsert)
   upsertLessonQuestionSet: builder.mutation<
  LessonQuestionSetResponse,
  UpsertLessonQuestionSetRequest
>({
  query: (data) => ({
    url: "/questionset",
    method: "POST",
    body: data,
  }),
  invalidatesTags: (_result, _error, arg) => [
    {
      type: "LessonQuestionSet",
      id: `${arg.lessonId}-${arg.subCategoryType}`,
    },
  ],
}),

  }),
});

export const {
  useGetLessonQuestionSetQuery,
  useUpsertLessonQuestionSetMutation,
  useLazyGetLessonQuestionSetQuery
} = lessonQuestionSetApi;
