// Role and Permission interfaces
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
}

export interface UserSummary {
  total_stores: number;
  total_roles: number;
  total_permissions: number;
  manageable_users_count: number;
}

export interface Store {
  // Add store properties as needed
  id: number;
  name: string;
  // Add other store properties based on your requirements
}

// New interface for cached user data
export interface UserCacheData {
  global_roles: Role[];
  roles_permissions: Permission[]; // flattened permissions from roles
  global_permissions: Permission[];
  all_permissions: Permission[];
  stores: Store[];
  summary: UserSummary;
  cached_at: string; // timestamp when cached
  expires_at: string; // expiry timestamp
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

export interface ResendVerificationOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    token_type?: string;
    user?: User;
    [key: string]: any;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  global_roles: Role[];
  global_permissions: Permission[];
  all_permissions: Permission[];
  stores: Store[];
  summary: UserSummary;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // New cache-related state
  userCache: UserCacheData | null;
  isCacheValid: boolean;
  cacheExpiry: string | null;
}
