import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  registerUser,
  verifyEmailOtp,
  resendVerificationOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  logoutUser,
  refreshToken,
  clearError,
  setRegistrationStep,
  setRegistrationEmail,
  resetRegistration,
  logout as logoutAction,
} from '../store/slices/authSlice';
import type {
  RegisterRequest,
  VerifyEmailOtpRequest,
  ResendVerificationOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types/authTypes';

/**
 * Custom hook that provides Redux-based authentication functionality
 * This replaces the need for useAuth hook and integrates with your existing authService
 */
export const useReduxAuth = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    registrationStep,
    registrationEmail,
  } = useAppSelector((state) => state.auth);

  // Initialize user profile if token exists but no user data
  useEffect(() => {
    if (token && !user && isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [token, user, isAuthenticated, dispatch]);

  // Auth actions
  const register = async (data: RegisterRequest) => {
    return dispatch(registerUser(data));
  };

  const verifyEmail = async (data: VerifyEmailOtpRequest) => {
    return dispatch(verifyEmailOtp(data));
  };

  const resendOtp = async (data: ResendVerificationOtpRequest) => {
    return dispatch(resendVerificationOtp(data));
  };

  const login = async (data: LoginRequest) => {
    return dispatch(loginUser(data));
  };

  const forgotPass = async (data: ForgotPasswordRequest) => {
    return dispatch(forgotPassword(data));
  };

  const resetPass = async (data: ResetPasswordRequest) => {
    return dispatch(resetPassword(data));
  };

  const getProfile = async () => {
    return dispatch(getUserProfile());
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const refresh = async () => {
    return dispatch(refreshToken());
  };

  // Utility actions
  const clearAuthError = () => {
    dispatch(clearError());
  };

  const setRegStep = (step: 'register' | 'verify' | 'completed') => {
    dispatch(setRegistrationStep(step));
  };

  const setRegEmail = (email: string | null) => {
    dispatch(setRegistrationEmail(email));
  };

  const resetReg = () => {
    dispatch(resetRegistration());
  };

  const logoutLocal = () => {
    dispatch(logoutAction());
  };

  return {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    registrationStep,
    registrationEmail,
    
    // Actions
    register,
    verifyEmail,
    resendOtp,
    login,
    forgotPassword: forgotPass,
    resetPassword: resetPass,
    getUserProfile: getProfile,
    logout,
    refreshToken: refresh,
    
    // Utility actions
    clearError: clearAuthError,
    setRegistrationStep: setRegStep,
    setRegistrationEmail: setRegEmail,
    resetRegistration: resetReg,
    logoutLocal,
  };
};