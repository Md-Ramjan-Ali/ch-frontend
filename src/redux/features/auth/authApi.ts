/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  
} from "@/redux/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: {
          ...response.data,
          accessToken: response.data?.access_token,
          refreshToken: response.data?.refresh_token,
        },
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any): LoginResponse => ({
        ...response,
        data: {
          user: response.data.user,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        },
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation({
      query: (data) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => ({
        ...response,
        accessToken: response.data?.access_token,
        refreshToken: response.data?.refresh_token,
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    changePassword: builder.mutation<{ message: string }, { oldPassword: string; newPassword: string }>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/auth/request-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetCode: builder.mutation<{ message: string }, { email: string; code: string ,token:string|any }>({
      query: (data) => ({
        url: "/auth/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

   resetPassword: builder.mutation<
  { message: string },
  {
    email: string;
    token: string;
    newPassword: string;
  }
>({
  query: (data) => ({
    url: "/auth/reset-password",
    method: "POST",
    body: data,
  }),
}),

    deleteAccount: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/delete-account",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
} = authApi;











// /* eslint-disable @typescript-eslint/no-explicit-any */

// // src/redux/features/auth/authApi.ts
// import { baseApi } from "@/redux/hooks/baseApi";
// import type {
//   LoginRequest,
//   LoginResponse,
//   // RegisterRequest,
//   // RegisterResponse,
//   // ProfileResponse,
//   RefreshTokenResponse,
// } from "@/redux/types/auth.type";

// export const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     register: builder.mutation({
//       query: (userData) => ({
//         url: "/auth/register",
//         method: "POST",
         
//         body: userData,
//       }),
//     }),
//     verifyAccount: builder.mutation({
//       query: (data) => ({
//         url: "/auth/verified-account",
//         method: "POST",
//         body: data,
//         credentials: 'include',
//       }),
//     }),


//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       transformResponse: (response: any): LoginResponse => ({
//         ...response,
//         data: {
//           ...response.data,
//           accessToken: response.data.accessToken,
//         },
//       }),
//       invalidatesTags: ["User"],
//     }),

// deleteAccount: builder.mutation({
//   query: (data: { email: string }) => ({
//     url: "/auth/delete-account",
//     method: "DELETE",
//     body: data, // { email: "kayesuser@gmail.com" }
//     credentials: "include",
//   }),
//   invalidatesTags: ["User"],
// }),



//     refreshToken: builder.mutation<RefreshTokenResponse, { refreshToken: string }>({
//       query: (data) => ({
//         url: "/auth/refresh-token",
//         method: "POST",
//         body: data,
//       }),
//     }),
//     getMe: builder.query({
//       query: () => ({
//         url: "/auth/me",
//         method: "GET",
//       }),
//       providesTags: ["User"],
//     }),
//     changePassword: builder.mutation<{ message: string }, { oldPassword: string; newPassword: string }>({
//       query: (data) => ({
//         url: "/auth/change-password",
//         method: "PUT",
//         body: data,
//       }),
//     }),
//     forgotPassword: builder.mutation<{ message: string }, { email: string }>({
//       query: (data) => ({
//         url: "/auth/forgot-password",
//         method: "POST",
//         body: data,
//       }),
//     }),
//     resetPassword: builder.mutation<
//       { message: string },
//       { token: string; email: string; newPassword: string }
//     >({
//       query: (data) => ({
//         url: "/auth/reset-password",
//         method: "POST",
//         body: data,
//       }),
//     }),
//     newVerificationLink: builder.mutation<{ message: string }, { email: string }>({
//       query: (data) => ({
//         url: "/auth/new-verification-link",
//         method: "POST",
//         body: data,
//       }),
//     }),
//   }),
// });

// export const {
//   useRegisterMutation,
//   useVerifyAccountMutation,
//   useLoginMutation,
//   useRefreshTokenMutation,
//   useGetMeQuery,
//   useChangePasswordMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation,
//   useNewVerificationLinkMutation,
//   useDeleteAccountMutation
// } = authApi;











 