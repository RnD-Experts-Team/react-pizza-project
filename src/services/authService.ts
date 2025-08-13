import axios from 'axios';
import type {
  RegisterRequest,
  VerifyEmailOtpRequest,
  ResendVerificationOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
} from '../types/authTypes.ts';

// Base API URL - update to your actual domain
const API_BASE_URL = 'http://localhost:8000/api/auth';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token to requests if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401 responses
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await refreshToken();
        // Retry the original request
        return authApi.request(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await authApi.post('/register', data);
    return response.data;
  },

  // Verify email with OTP
  verifyEmailOtp: async (
    data: VerifyEmailOtpRequest,
  ): Promise<AuthResponse> => {
    const response = await authApi.post('/verify-email', data);
    return response.data;
  },

  // Resend verification OTP
  resendVerificationOtp: async (
    data: ResendVerificationOtpRequest,
  ): Promise<AuthResponse> => {
    const response = await authApi.post('/resend-verification-otp', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authApi.post('/login', data);

    // Save token from nested data structure
    if (
      response.data.success &&
      response.data.data &&
      response.data.data.token
    ) {
      localStorage.setItem('auth_token', response.data.data.token);
    }

    return response.data;
  },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<AuthResponse> => {
    const response = await authApi.post('/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<AuthResponse> => {
    const response = await authApi.post('/reset-password', data);
    return response.data;
  },

  // Get user profile
  getUserProfile: async (): Promise<User> => {
    const response = await authApi.get('/me');
    // Extract user from nested data structure
    return response.data.data.user;
  },

  // Logout user
  logout: async (): Promise<AuthResponse> => {
    const response = await authApi.post('/logout');
    localStorage.removeItem('auth_token');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await authApi.post('/refresh-token');

    // Save new token from nested data structure
    if (
      response.data.success &&
      response.data.data &&
      response.data.data.token
    ) {
      localStorage.setItem('auth_token', response.data.data.token);
    }

    return response.data;
  },
};

// Export the refresh function for use in interceptor
export const refreshToken = authService.refreshToken;
