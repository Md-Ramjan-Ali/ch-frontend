/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  Lesson,
  LessonCreateRequest,
  LessonUpdateStatusRequest,
  LessonListResponse,
  ApiResponse,
} from "./lessonContent.types";

export const lessonContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE LESSON
    createLesson: builder.mutation<ApiResponse<Lesson>, LessonCreateRequest>({
      query: (body) => ({
        url: "/admin/lessons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lessons"],
    }),

    // GET ALL LESSONS WITH SEARCH, FILTER, PAGINATION
    getAllLessons: builder.query<
      ApiResponse<LessonListResponse>,
      { page?: number; limit?: number; search?: string; type?: string; level?: string }
    >({
      query: ({ page = 1, limit = 20, search, type, level }) => ({
        url: "/admin/lessons",
        method: "GET",
        params: { page, limit, search, type, level },
      }),
      providesTags: ["Lessons"],
    }),

    // GET LESSON BY ID
    getLessonById: builder.query<ApiResponse<Lesson>, number>({
      query: (id) => ({
        url: `/admin/lessons/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Lesson", id }],
    }),

    // DELETE LESSON
    deleteLesson: builder.mutation<ApiResponse<any>, number>({
      query: (id) => ({
        url: `/admin/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lessons"],
    }),

    // PATCH LESSON STATUS (publish/unpublish)
    updateLessonStatus: builder.mutation<
      ApiResponse<Lesson>,
      { id: number; data: LessonUpdateStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/lessons/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Lesson", id },
        "Lessons",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateLessonMutation,
  useGetAllLessonsQuery,
  useGetLessonByIdQuery,
  useDeleteLessonMutation,
  useUpdateLessonStatusMutation,
} = lessonContentApi;
