/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  ApiResponse,
  FlashcardCategory,
  Flashcard,
  CreateCategoryRequest,
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
  StartSessionRequest,
  GradeCardRequest,
  PauseSessionRequest,
} from "./flashcards.types";

export const flashcardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // CATEGORY ENDPOINTS (ADMIN)
    // ===========================

    // GET ALL CATEGORIES
    getAllCategories: builder.query<ApiResponse<FlashcardCategory[]>, void>({
      query: () => ({
        url: "/flashcards/category/all",
        method: "GET",
      }),
      providesTags: ["FlashcardCategories"],
    }),

    // GET CATEGORY WITH CARDS
    getCategoryWithCards: builder.query<
      ApiResponse<FlashcardCategory>,
      number
    >({
      query: (categoryId) => ({
        url: `/flashcards/category/get?categoryId=${categoryId}`,
        method: "GET",
      }),
      providesTags: (_, __, categoryId) => [
        { type: "FlashcardCategory", id: categoryId },
      ],
    }),

    // CREATE CATEGORY
    createCategory: builder.mutation<
      ApiResponse<FlashcardCategory>,
      CreateCategoryRequest
    >({
      query: (body) => ({
        url: "/flashcards/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FlashcardCategories"],
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation<
      ApiResponse<void>,
      number
    >({
      query: (id) => ({
        url: `/flashcards/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FlashcardCategories"],
    }),

    // ===========================
    // FLASHCARDS (ADMIN)
    // ===========================

    // CREATE CARD
    createFlashcard: builder.mutation<
      ApiResponse<Flashcard>,
      CreateFlashcardRequest
    >({
      query: (body) => ({
        url: "/flashcards/card",
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [
        "FlashcardCategories",
        { type: "FlashcardCategory", id: result?.data?.categoryId },
      ],
    }),

    // UPDATE CARD
    updateFlashcard: builder.mutation<
      ApiResponse<Flashcard>,
      { id: number; data: UpdateFlashcardRequest }
    >({
      query: ({ id, data }) => ({
        url: `/flashcards/card/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: "FlashcardCategory", id: result?.data?.categoryId },
      ],
    }),

    // DELETE CARD
    deleteFlashcard: builder.mutation<
      ApiResponse<void>,
      number
    >({
      query: (id) => ({
        url: `/flashcards/card/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FlashcardCategories"],
    }),

    // BULK UPLOAD CSV
    bulkUploadCsv: builder.mutation<
      ApiResponse<any>,
      { file: File; categoryId: number }
    >({
      query: ({ file, categoryId }) => {
        const formData = new FormData();
        formData.append("categoryId", String(categoryId));
        formData.append("file", file);

        return {
          url: "/flashcards/card/bulk-upload-csv",
          method: "POST",
          body: formData,
          
        };
      },
      invalidatesTags: ["FlashcardCategories"],
    }),

    // ===========================
    // USER ENDPOINTS
    // ===========================

    // GET USER FLASHCARD OVERVIEW
    getFlashcardOverview: builder.query<
      ApiResponse<any>,
      void
    >({
      query: () => ({
        url: "/flashcards/overview",
        method: "GET",
      }),
      providesTags: ["FlashcardOverview"],
    }),

    // START A SESSION
    startSession: builder.mutation<
      ApiResponse<any>,
      StartSessionRequest
    >({
      query: (body) => ({
        url: "/flashcards/session/start",
        method: "POST",
        body,
      }),
    }),

    // GRADE CURRENT CARD
    gradeFlashcard: builder.mutation<
      ApiResponse<any>,
      GradeCardRequest
    >({
      query: (body) => ({
        url: "/flashcards/session/grade",
        method: "POST",
        body,
      }),
    }),

    // PAUSE SESSION
    pauseSession: builder.mutation<
      ApiResponse<any>,
      PauseSessionRequest
    >({
      query: (body) => ({
        url: "/flashcards/session/pause",
        method: "PATCH",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryWithCardsQuery,

  useCreateCategoryMutation,
  useDeleteCategoryMutation,

  useCreateFlashcardMutation,
  useUpdateFlashcardMutation,
  useDeleteFlashcardMutation,
  useBulkUploadCsvMutation,

  useGetFlashcardOverviewQuery,
  useStartSessionMutation,
  useGradeFlashcardMutation,
  usePauseSessionMutation,
} = flashcardsApi;








// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { baseApi } from "@/redux/hooks/baseApi";
// import type {
//   ApiResponse,
//   FlashcardCategory,
//   Flashcard,
//   CreateCategoryRequest,
//   CreateFlashcardRequest,
//   UpdateFlashcardRequest,
//   StartSessionRequest,
//   GradeCardRequest,
//   PauseSessionRequest,
// } from "./flashcards.types.ts";
 
// export const flashcardsApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({

//     // ===========================
//     // CATEGORY ENDPOINTS
//     // ===========================

//     // GET ALL CATEGORIES
//     getAllCategories: builder.query ({
//       query: () => ({
//         url: "/flashcards/category/all",
//         method: "GET",
//       }),
//       providesTags: ["FlashcardCategories"],
//     }),

//     // GET CATEGORY WITH CARDS ?categoryId=1
//     getCategoryWithCards: builder.query<
//       ApiResponse<FlashcardCategory>,
//       number
//     >({
//       query: (categoryId) => ({
//         url: `/flashcards/category/get?categoryId=${categoryId}`,
//         method: "GET",
//       }),
//       providesTags: (_, __,categoryId) => [
//            { type: "FlashcardCategory", id: categoryId },
//         ],
//     }),

//     // CREATE CATEGORY
//     createCategory: builder.mutation<
//       ApiResponse<FlashcardCategory>,
//       CreateCategoryRequest
//     >({
//       query: (body) => ({
//         url: "/flashcards/category",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["FlashcardCategories"],
//     }),

//     // DELETE CATEGORY
//     deleteCategory: builder.mutation ({
//       query: (id) => ({
//         url: `/flashcards/category/delete/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["FlashcardCategories"],
//     }),

//     // ===========================
//     // FLASHCARDS
//     // ===========================

//     // CREATE CARD
//     createFlashcard: builder.mutation<
//       ApiResponse<Flashcard>,
//       CreateFlashcardRequest
//     >({
//       query: (body) => ({
//         url: "/flashcards/card",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["FlashcardCategories"],
//     }),

//     // UPDATE CARD
//     updateFlashcard: builder.mutation<
//       ApiResponse<Flashcard>,
//       { id: number; data: UpdateFlashcardRequest }
//     >({
//       query: ({ id, data }) => ({
//         url: `/flashcards/card/update/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["FlashcardCategories"],
//     }),

//     // DELETE CARD
//     deleteFlashcard: builder.mutation ({
//       query: (id) => ({
//         url: `/flashcards/card/delete/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["FlashcardCategories"],
//     }),

//     // BULK UPLOAD CSV
//     bulkUploadCsv: builder.mutation<
//       ApiResponse<any>,
//       { file: File; categoryId: number }
//     >({
//       query: ({ file, categoryId }) => {
//         const formData = new FormData();
//         formData.append("categoryId", String(categoryId));
//         formData.append("file", file);

//         return {
//           url: "/flashcards/card/bulk-upload-csv",
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["FlashcardCategories"],
//     }),

//     // ===========================
//     // USER SIDE
//     // ===========================

//     // GET USER FLASHCARD OVERVIEW
//     getFlashcardOverview: builder.query ({
//       query: () => ({
//         url: "/flashcards/overview",
//         method: "GET",
//       }),
//       providesTags: ["FlashcardOverview"],
//     }),

//     // START A SESSION
//     startSession: builder.mutation<
//       ApiResponse<any>,
//       StartSessionRequest
//     >({
//       query: (body) => ({
//         url: "/flashcards/session/start",
//         method: "POST",
//         body,
//       }),
//     }),

//     // GRADE CURRENT CARD
//     gradeFlashcard: builder.mutation<
//       ApiResponse<any>,
//       GradeCardRequest
//     >({
//       query: (body) => ({
//         url: "/flashcards/session/grade",
//         method: "POST",
//         body,
//       }),
//     }),

//     // PAUSE SESSION
//     pauseSession: builder.mutation<
//       ApiResponse<any>,
//       PauseSessionRequest
//     >({
//       query: (body) => ({
//         url: "/flashcards/session/pause",
//         method: "PATCH",
//         body,
//       }),
//     }),
//   }),

//   overrideExisting: false,
// });

// export const {
//   useGetAllCategoriesQuery,
//   useGetCategoryWithCardsQuery,

//   useCreateCategoryMutation,
//   useDeleteCategoryMutation,

//   useCreateFlashcardMutation,
//   useUpdateFlashcardMutation,
//   useDeleteFlashcardMutation,
//   useBulkUploadCsvMutation,

//   useGetFlashcardOverviewQuery,
//   useStartSessionMutation,
//   useGradeFlashcardMutation,
//   usePauseSessionMutation,
// } = flashcardsApi;
