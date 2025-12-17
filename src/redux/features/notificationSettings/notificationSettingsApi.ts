/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  NotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
} from "./notificationSettings.types";

export const notificationSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET: /notification-settings
    getNotificationSettings: builder.query<
      NotificationSettingsResponse,
      void
    >({
      query: () => ({
        url: "/notification-settings",
        method: "GET",
      }),
      providesTags: ["NotificationSettings"],
    }),

    // PUT: /notification-settings
    updateNotificationSettings: builder.mutation<
      NotificationSettingsResponse,
      UpdateNotificationSettingsRequest
    >({
      query: (data) => ({
        url: "/notification-settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["NotificationSettings"],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationSettingsApi;
