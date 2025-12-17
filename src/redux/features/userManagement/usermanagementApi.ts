/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";

export const usermanagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ---------------- Students ----------------

    getStudents: builder.query({
      query: (params) => ({
        url: "/users/students",
        method: "GET",
        params,
      }),
      providesTags: ["Students"],
    }),

    getSingleStudent: builder.query({
      query: (id: string) => ({
        url: `/users/students/${id}`,
        method: "GET",
      }),
      providesTags: ( id) => [{ type: "Students", id }],
    }),

    deleteStudent: builder.mutation({
      query: (id: string) => ({
        url: `/users/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),

    updateStudentStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/users/students/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Students"],
    }),

    // ---------------- User Metadata ----------------

    getUserMetadata: builder.query({
      query: () => ({
        url: "/users/metadata",
        method: "GET",
      }),
      providesTags: ["UserMeta"],
    }),

    // ---------------- Platform Users ----------------

    getPlatformUsers: builder.query({
      query: () => ({
        url: "/users/platform-users",
        method: "GET",
      }),
      providesTags: ["PlatformUsers"],
    }),

    createPlatformUser: builder.mutation({
      query: (data) => ({
        url: "/users/platform-users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PlatformUsers"],
    }),

    deletePlatformUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/platform-users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PlatformUsers"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetSingleStudentQuery,
  useDeleteStudentMutation,
  useUpdateStudentStatusMutation,
  useGetUserMetadataQuery,
  useGetPlatformUsersQuery,
  useCreatePlatformUserMutation,
  useDeletePlatformUserMutation,
} = usermanagementApi;

