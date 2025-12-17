/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  CheckoutRequest,
  CheckoutResponse,
  SubscriptionInfoResponse,
  ApiResponse,
  PlansResponse,
  Plan,
  PlanUpdateRequest,
  ApiSuccessResponse,
} from "./subscriptions.types";

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /plans - Public: Get all active subscription plans
    getActivePlans: builder.query<PlansResponse, void>({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),

    // PATCH /plans/{alias} - ADMIN: Update plan
    updatePlan: builder.mutation<
      ApiResponse<Plan>,
      { alias: string; data: PlanUpdateRequest }
    >({
      query: ({ alias, data }) => ({
        url: `/plans/${alias}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Plans"],
    }),

    // POST /subscriptions/checkout - Create Stripe checkout session
    createCheckoutSession: builder.mutation<
      ApiResponse<CheckoutResponse>,
      CheckoutRequest
    >({
      query: (body) => ({
        url: "/subscriptions/checkout",
        method: "POST",
        body,
      }),
    }),

    // POST /subscriptions/cancel - Cancel subscription
    cancelSubscription: builder.mutation<ApiSuccessResponse, void>({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      invalidatesTags: ["SubscriptionInfo"],
    }),

    // POST /subscriptions/webhook - Stripe webhook (usually backend-only)
    sendWebhook: builder.mutation<ApiSuccessResponse, any>({
      query: (body) => ({
        url: "/subscriptions/webhook",
        method: "POST",
        body,
      }),
    }),

    // GET /subscriptions/me - Get current user subscription
    getMySubscription: builder.query<SubscriptionInfoResponse, void>({
      query: () => ({
        url: "/subscriptions/me",
        method: "GET",
      }),
      providesTags: ["SubscriptionInfo"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetActivePlansQuery,
  useUpdatePlanMutation,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
  useSendWebhookMutation,
  useGetMySubscriptionQuery,
} = subscriptionsApi;