/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";
import type {
 
  PlatformSettingsResponse,
  UpdatePlatformSettingsRequest,
} from "./platformSettings.types.ts";

export const platformSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET: /platform-settings
    getPlatformSettings: builder.query<PlatformSettingsResponse, void>({
      query: () => ({
        url: "/platform-settings",
        method: "GET",
      }),
      providesTags: ["PlatformSettings"],
    }),

    // PUT: /platform-settings
    updatePlatformSettings: builder.mutation<
      PlatformSettingsResponse,
      UpdatePlatformSettingsRequest
    >({
      query: (data) => ({
        url: "/platform-settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),

  }),
});

export const {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} = platformSettingsApi;
