import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  initializeAuth,
  registerUser,
  verifyEmailOtp,
  resendVerificationOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  logoutUser,
  refreshToken,
  refreshCacheData,
  fetchUserProfile, // New import
  clearError,
  setRegistrationStep,
  setRegistrationEmail,
  resetRegistration,
  logout as logoutAction,
  setToken,
  clearToken,
  extendCacheExpiry,
  clearCache,
  updateCacheValidity,
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
 * with encrypted token storage, cached user data, and automatic initialization
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
    isInitialized,
    userCache,
    isCacheValid,
    cacheExpiry,
  } = useAppSelector((state) => state.auth);

  // Initialize auth state from encrypted storage on first load
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  // REMOVED: The problematic cache validity checking effect

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

  // FIXED: New action for fetching user profile during initialization
  const fetchProfile = async () => {
    return dispatch(fetchUserProfile());
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const refresh = async () => {
    return dispatch(refreshToken());
  };

  // Cache-related actions
  const refreshCache = async () => {
    return dispatch(refreshCacheData());
  };

  const extendCache = () => {
    dispatch(extendCacheExpiry());
  };

  const clearCacheData = () => {
    dispatch(clearCache());
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

  const updateToken = (newToken: string) => {
    dispatch(setToken(newToken));
  };

  const removeToken = () => {
    dispatch(clearToken());
  };

  // Helper functions to access cached data
  const getCachedRoles = () => {
    return userCache?.global_roles || user?.global_roles || [];
  };

  const getCachedRolesPermissions = () => {
    return userCache?.roles_permissions || [];
  };

  const getCachedGlobalPermissions = () => {
    return userCache?.global_permissions || user?.global_permissions || [];
  };

  const getCachedAllPermissions = () => {
    return userCache?.all_permissions || user?.all_permissions || [];
  };

  const getCachedStores = () => {
    return userCache?.stores || user?.stores || [];
  };

  const getCachedSummary = () => {
    return userCache?.summary || user?.summary || {
      total_stores: 0,
      total_roles: 0,
      total_permissions: 0,
      manageable_users_count: 0,
    };
  };

  // Permission checking helpers
  const hasPermission = (permission: string): boolean => {
    const allPermissions = getCachedAllPermissions();
    return allPermissions.some(perm => perm.name === permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    const allPermissions = getCachedAllPermissions();
    return permissions.some(permission => 
      allPermissions.some(perm => perm.name === permission)
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    const allPermissions = getCachedAllPermissions();
    return permissions.every(permission => 
      allPermissions.some(perm => perm.name === permission)
    );
  };

  // Role checking helpers
  const hasRole = (roleName: string): boolean => {
    const roles = getCachedRoles();
    return roles.some(role => role.name === roleName);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    const roles = getCachedRoles();
    return roleNames.some(roleName => 
      roles.some(role => role.name === roleName)
    );
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    const roles = getCachedRoles();
    return roleNames.every(roleName => 
      roles.some(role => role.name === roleName)
    );
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
    isInitialized,
    
    // Cache state
    userCache,
    isCacheValid,
    cacheExpiry,
    
    // Actions
    register,
    verifyEmail,
    resendOtp,
    login,
    forgotPassword: forgotPass,
    resetPassword: resetPass,
    getUserProfile: getProfile,
    fetchUserProfile: fetchProfile, // New action
    logout,
    refreshToken: refresh,
    refreshCache,
    
    // Utility actions
    clearError: clearAuthError,
    setRegistrationStep: setRegStep,
    setRegistrationEmail: setRegEmail,
    resetRegistration: resetReg,
    logoutLocal,
    updateToken,
    removeToken,
    extendCacheExpiry: extendCache,
    clearCache: clearCacheData,
    
    // Helper functions for cached data
    getCachedRoles,
    getCachedRolesPermissions,
    getCachedGlobalPermissions,
    getCachedAllPermissions,
    getCachedStores,
    getCachedSummary,
    
    // Permission helpers
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role helpers
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
};
