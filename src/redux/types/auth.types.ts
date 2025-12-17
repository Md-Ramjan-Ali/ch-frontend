// =========================
// USER TYPE
// =========================
export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  createdAt?: string;

  // Newly added backend fields:
  dailyGoalMinutes?: number;
  xp?: number;
  hasUsedTrial?: boolean;
  nativeLang?: string;
  targetLang?: string;
  currentLevel?: string;
}



// =========================
// AUTH TOKENS
// =========================
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}



// =========================
// AUTH STATE (Redux Slice Shape)
// =========================
export interface AuthState {
  user: User | null |string;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}



// =========================
// REQUEST TYPES (API Payloads)
// =========================
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  dailyGoalMinutes: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}



// =========================
// RESPONSE TYPES (API Response Shape)
// =========================

export interface ApiResponseBase {
  message: string;
}

export interface RegisterResponse extends ApiResponseBase {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResponse extends ApiResponseBase {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}
