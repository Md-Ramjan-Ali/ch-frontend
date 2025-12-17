export interface CheckoutRequest {
  planAlias: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface Plan {
  id: string;
  alias: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string | null;
  isActive: boolean;
  features: string[];
  orderIndex: number;
  isPopular?: boolean;
}

export interface PlanUpdateRequest {
  stripePriceId?: string;
  price?: number;
  isActive?: boolean;
}

export interface SubscriptionInfo {
  status: 'none' | 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY' | string;
  isPro: boolean;
  hasUsedTrial: boolean;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionInfoResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SubscriptionInfo;
}

export interface PlansResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Plan[];
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ApiSuccessResponse {
  statusCode: number;
  success: boolean;
  message: string;
}