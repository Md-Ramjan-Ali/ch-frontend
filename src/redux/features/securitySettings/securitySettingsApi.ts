/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  SecuritySettingsResponse,
  UpdateSecuritySettingsRequest,
} from "./securitySettings.types.ts";

export const securitySettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET: /settings/security
    getSecuritySettings: builder.query<SecuritySettingsResponse, void>({
      query: () => ({
        url: "/settings/security",
        method: "GET",
      }),
      providesTags: ["SecuritySettings"],
    }),

    // PATCH: /settings/security
    updateSecuritySettings: builder.mutation<
      SecuritySettingsResponse,
      UpdateSecuritySettingsRequest
    >({
      query: (data) => ({
        url: "/settings/security",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SecuritySettings"],
    }),

  }),
});

export const {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
} = securitySettingsApi;
