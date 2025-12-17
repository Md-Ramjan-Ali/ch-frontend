/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";
import { GetNextLessonRequest, GetNextLessonResponse } from "./lessonPractice.types";
 

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET: /lessons/next?type=READING
    getNextLesson: builder.query<
      GetNextLessonResponse,
      GetNextLessonRequest
    >({
      query: ({ type }) => ({
        url: "/lessons/next",
        method: "GET",
        params: { type },
      }),
      providesTags: ["Lesson"],
    }),

  }),
});

export const {
  useGetNextLessonQuery,
  useLazyGetNextLessonQuery,
} = lessonApi;
