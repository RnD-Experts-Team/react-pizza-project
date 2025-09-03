/**
 * Custom React Hook for Authorization Rules Management
 * 
 * This hook provides a clean interface for components to interact with auth rules:
 * - Combines Redux selectors and actions
 * - Handles Sonner toast notifications for errors and success
 * - Provides helper methods for form validation and error display
 * - Manages common UI patterns (loading, error states, etc.)
 * - Encapsulates business logic away from components
 * 
 * Design decisions:
 * - Uses Sonner instead of deprecated shadcn/ui toast
 * - Uses memoized selectors to prevent unnecessary re-renders
 * - Auto-clears success/error messages after toast display
 * - Provides form validation helpers for better UX
 * - Debounced search to avoid excessive API calls
 * - Memoized callbacks to prevent unnecessary re-renders
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner'; // Sonner toast function
import type { AppDispatch } from '@/store'; // Adjust paths to your store types
import { 
  fetchAuthRules,
  createAuthRule,
  testAuthRule,
  toggleAuthRuleStatus,
  batchToggleAuthRules,
  clearError,
  clearSuccessMessage,
  clearTestResult,
  updateFilters,
  resetFilters,
  resetState,
  authRulesSelectors
} from '../store/authRulesSlice';
import {
  getDisplayErrorMessage,
  getValidationErrorsForField,
  isErrorType
} from '../services/api';
import type {
  FetchAuthRulesParams,
  CreateAuthRuleRequest,
  TestAuthRuleRequest,
  StandardizedError,
  ValidationError,
  AuthRule,
  AuthRuleFormData,
} from '../types';

// ============================================================================
// HOOK INTERFACE
// ============================================================================

/**
 * Return type for useAuthRules hook
 * Provides a comprehensive interface for auth rules management
 */
interface UseAuthRulesReturn {
  // Data
  rules: AuthRule[];
  pagination: any; // From your pagination type
  testResult: any; // From your test result type
  filters: {
    service: string;
    search: string;
    currentPage: number;
    perPage: number;
  };

  // Loading states
  loading: {
    fetching: boolean;
    creating: boolean;
    testing: boolean;
    isToggling: (ruleId: number) => boolean;
  };

  // Error state
  error: StandardizedError | null;
  successMessage: string | null;

  // Actions
  actions: {
    // Data fetching
    fetchRules: (params?: FetchAuthRulesParams) => Promise<void>;
    refreshRules: () => Promise<void>;
    
    // CRUD operations
    createRule: (ruleData: CreateAuthRuleRequest) => Promise<boolean>;
    testRule: (testData: TestAuthRuleRequest) => Promise<boolean>;
    toggleRuleStatus: (ruleId: number) => Promise<boolean>;
    batchToggleRules: (ruleIds: number[]) => Promise<boolean>;
    
    // State management
    clearError: () => void;
    clearSuccessMessage: () => void;
    clearTestResult: () => void;
    updateFilters: (filters: Partial<{ service: string; search: string; currentPage: number; perPage: number }>) => void;
    resetFilters: () => void;
    resetState: () => void;
  };

  // Helper methods
  helpers: {
    // Error handling
    getDisplayErrorMessage: () => string;
    getValidationErrors: (fieldName: string) => string[];
    isValidationError: () => boolean;
    isUnauthorizedError: () => boolean;
    isNetworkError: () => boolean;
    
    // UI helpers
    hasRules: boolean;
    totalRules: number;
    activeRulesCount: number;
    inactiveRulesCount: number;
    
    // Form validation
    validateRuleForm: (formData: AuthRuleFormData) => ValidationError[];
    
    // Data filtering
    getActiveRules: () => AuthRule[];
    getInactiveRules: () => AuthRule[];
    getRulesByService: (service: string) => AuthRule[];
  };
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Custom hook for authorization rules management
 * 
 * @param options Configuration options for the hook
 * @returns Complete interface for auth rules operations
 */
export const useAuthRules = (options: {
  autoFetch?: boolean; // Auto-fetch rules on mount
  showToasts?: boolean; // Show success/error toasts
  debounceMs?: number; // Debounce delay for search
} = {}): UseAuthRulesReturn => {
  const {
    autoFetch = true,
    showToasts = true,
    debounceMs = 300
  } = options;

  const dispatch = useDispatch<AppDispatch>();

  // ========================================================================
  // SELECTORS (Fixed - no conditional hooks)
  // ========================================================================

  const rules = useSelector(authRulesSelectors.selectRules);
  const pagination = useSelector(authRulesSelectors.selectPagination);
  const testResult = useSelector(authRulesSelectors.selectTestResult);
  const filters = useSelector(authRulesSelectors.selectFilters);
  
  // Get toggle states once to avoid conditional hook usage
  const toggleStates = useSelector(authRulesSelectors.selectTogglingStates);
  
  const loading = {
    fetching: useSelector(authRulesSelectors.selectIsFetching),
    creating: useSelector(authRulesSelectors.selectIsCreating),
    testing: useSelector(authRulesSelectors.selectIsTesting),
    // Fixed: use the toggle states directly instead of conditional useSelector
    isToggling: useCallback((ruleId: number) => toggleStates[ruleId] || false, [toggleStates])
  };

  const error = useSelector(authRulesSelectors.selectError);
  const successMessage = useSelector(authRulesSelectors.selectSuccessMessage);

  // Derived state (now using memoized selectors)
  const hasRules = useSelector(authRulesSelectors.selectHasRules);
  const totalRules = useSelector(authRulesSelectors.selectTotalRules);
  const activeRules = useSelector(authRulesSelectors.selectActiveRules);
  const inactiveRules = useSelector(authRulesSelectors.selectInactiveRules);

  // ========================================================================
  // SONNER TOAST EFFECTS
  // ========================================================================

  /**
   * Show error toasts using Sonner and auto-clear error state
   */
  useEffect(() => {
    if (error && showToasts) {
      // Use Sonner's error toast with appropriate styling
      toast.error(getDisplayErrorMessage(error), {
        description: error.type === 'validation' ? 
          'Please fix the highlighted errors and try again.' : 
          error.details,
        duration: 5000, // Show error toasts longer
        action: error.type === 'unauthorized' ? {
          label: 'Login',
          onClick: () => {
            // Navigate to login - adjust based on your routing
            window.location.href = '/login';
          },
        } : undefined,
      });
      
      // Auto-clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [error, showToasts, dispatch]);

  /**
   * Show success toasts using Sonner and auto-clear success message
   */
  useEffect(() => {
    if (successMessage && showToasts) {
      // Use Sonner's success toast with appropriate styling
      toast.success(successMessage, {
        duration: 3000, // Success toasts can be shorter
      });
      
      // Auto-clear success message after showing toast
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, showToasts, dispatch]);

  // ========================================================================
  // AUTO-FETCH EFFECT (Fixed to prevent multiple calls)
  // ========================================================================

  /**
   * Auto-fetch rules on mount if enabled (prevent multiple calls)
   */
  useEffect(() => {
    if (autoFetch && !loading.fetching && rules.length === 0) {
      dispatch(fetchAuthRules({
        service: filters.service,
        search: filters.search,
        page: filters.currentPage,
        per_page: filters.perPage,
      }));
    }
  }, [autoFetch, dispatch, filters]); // Only run on mount

  // ========================================================================
  // ACTION HANDLERS
  // ========================================================================

  /**
   * Fetch rules with current or provided parameters
   */
  const fetchRules = useCallback(async (params?: FetchAuthRulesParams): Promise<void> => {
    const fetchParams = params || {
      service: filters.service,
      search: filters.search,
      page: filters.currentPage,
      per_page: filters.perPage,
    };
    
    await dispatch(fetchAuthRules(fetchParams)).unwrap();
  }, [dispatch, filters]);

  /**
   * Refresh rules with current filters
   */
  const refreshRules = useCallback(async (): Promise<void> => {
    await fetchRules();
  }, [fetchRules]);

  /**
   * Create a new authorization rule with loading toast
   */
  const createRule = useCallback(async (ruleData: CreateAuthRuleRequest): Promise<boolean> => {
    // Show loading toast
    const loadingToastId = showToasts ? toast.loading('Creating authorization rule...') : null;
    
    try {
      await dispatch(createAuthRule(ruleData)).unwrap();
      
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      return true;
    } catch (error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      console.error('Failed to create auth rule:', error);
      return false;
    }
  }, [dispatch, showToasts]);

  /**
   * Test authorization rule path matching with loading feedback
   */
  const testRule = useCallback(async (testData: TestAuthRuleRequest): Promise<boolean> => {
    // Show loading toast
    const loadingToastId = showToasts ? toast.loading('Testing path pattern...') : null;
    
    try {
      await dispatch(testAuthRule(testData)).unwrap();
      
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      return true;
    } catch (error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      console.error('Failed to test auth rule:', error);
      return false;
    }
  }, [dispatch, showToasts]);

  /**
   * Toggle rule status with optimistic updates and immediate feedback
   */
  const toggleRuleStatus = useCallback(async (ruleId: number): Promise<boolean> => {
    try {
      await dispatch(toggleAuthRuleStatus(ruleId)).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to toggle rule status:', error);
      return false;
    }
  }, [dispatch]);

  /**
   * Batch toggle multiple rules with progress feedback
   */
  const batchToggleRules = useCallback(async (ruleIds: number[]): Promise<boolean> => {
    // Show loading toast for batch operation
    const loadingToastId = showToasts ? 
      toast.loading(`Updating ${ruleIds.length} rule${ruleIds.length > 1 ? 's' : ''}...`) : null;
    
    try {
      await dispatch(batchToggleAuthRules(ruleIds)).unwrap();
      
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      return true;
    } catch (error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      console.error('Failed to batch toggle rules:', error);
      return false;
    }
  }, [dispatch, showToasts]);

  /**
   * Update search and filter parameters with debouncing
   */
  const updateFiltersAction = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(updateFilters(newFilters));
    
    // If page change, fetch immediately (no debounce)
    if (newFilters.currentPage !== undefined) {
      dispatch(fetchAuthRules({
        service: newFilters.service ?? filters.service,
        search: newFilters.search ?? filters.search,
        page: newFilters.currentPage,
        per_page: newFilters.perPage ?? filters.perPage,
      }));
      return;
    }
    
    // If perPage change, fetch immediately (no debounce) and reset to page 1
    if (newFilters.perPage !== undefined) {
      dispatch(fetchAuthRules({
        service: newFilters.service ?? filters.service,
        search: newFilters.search ?? filters.search,
        page: 1, // Reset to first page when changing perPage
        per_page: newFilters.perPage,
      }));
      return;
    }
    
    // Auto-fetch with new filters after debounce for search/service
    if (newFilters.search !== undefined || newFilters.service !== undefined) {
      const timer = setTimeout(() => {
        dispatch(fetchAuthRules({
          service: newFilters.service ?? filters.service,
          search: newFilters.search ?? filters.search,
          page: 1, // Reset to first page on new search/filter
          per_page: filters.perPage,
        }));
      }, debounceMs);
      
      return () => clearTimeout(timer);
    }
  }, [dispatch, filters, debounceMs]);

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  /**
   * Form validation helper
   */
  const validateRuleForm = useCallback((formData: AuthRuleFormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Required field validation
    if (!formData.service.trim()) {
      errors.push({ field: 'service', messages: ['Service is required'] });
    }

    if (!formData.method) {
      errors.push({ field: 'method', messages: ['HTTP method is required'] });
    }

    // Path validation - either path_dsl or route_name required
    if (formData.pathType === 'dsl' && !formData.path_dsl?.trim()) {
      errors.push({ field: 'path_dsl', messages: ['Path DSL is required when using DSL type'] });
    }

    if (formData.pathType === 'route' && !formData.route_name?.trim()) {
      errors.push({ field: 'route_name', messages: ['Route name is required when using route type'] });
    }

    // Authorization validation - at least one required
    const hasRoles = formData.roles.length > 0;
    const hasPermissionsAny = formData.permissions_any.length > 0;
    const hasPermissionsAll = formData.permissions_all.length > 0;

    if (!hasRoles && !hasPermissionsAny && !hasPermissionsAll) {
      errors.push({ 
        field: 'authorization', 
        messages: ['At least one role, permissions_any, or permissions_all is required'] 
      });
    }

    // Priority validation
    if (formData.priority < 1 || formData.priority > 1000) {
      errors.push({ field: 'priority', messages: ['Priority must be between 1 and 1000'] });
    }

    return errors;
  }, []);

  /**
   * Get filtered rules by service
   */
  const getRulesByService = useCallback((service: string): AuthRule[] => {
    return rules.filter(rule => rule.service === service);
  }, [rules]);

  // ========================================================================
  // MEMOIZED RETURN OBJECT
  // ========================================================================

  return useMemo(() => ({
    // Data
    rules,
    pagination,
    testResult,
    filters,

    // Loading states
    loading,

    // Error state
    error,
    successMessage,

    // Actions
    actions: {
      fetchRules,
      refreshRules,
      createRule,
      testRule,
      toggleRuleStatus,
      batchToggleRules,
      clearError: () => dispatch(clearError()),
      clearSuccessMessage: () => dispatch(clearSuccessMessage()),
      clearTestResult: () => dispatch(clearTestResult()),
      updateFilters: updateFiltersAction,
      resetFilters: () => dispatch(resetFilters()),
      resetState: () => dispatch(resetState()),
    },

    // Helper methods
    helpers: {
      // Error handling
      getDisplayErrorMessage: () => getDisplayErrorMessage(error),
      getValidationErrors: (fieldName: string) => getValidationErrorsForField(error, fieldName),
      isValidationError: () => isErrorType(error, 'validation'),
      isUnauthorizedError: () => isErrorType(error, 'unauthorized'),
      isNetworkError: () => isErrorType(error, 'network_error'),
      
      // UI helpers
      hasRules,
      totalRules,
      activeRulesCount: activeRules.length,
      inactiveRulesCount: inactiveRules.length,
      
      // Form validation
      validateRuleForm,
      
      // Data filtering
      getActiveRules: () => activeRules,
      getInactiveRules: () => inactiveRules,
      getRulesByService,
    },
  }), [
    rules,
    pagination,
    testResult,
    filters,
    loading,
    error,
    successMessage,
    fetchRules,
    refreshRules,
    createRule,
    testRule,
    toggleRuleStatus,
    batchToggleRules,
    updateFiltersAction,
    hasRules,
    totalRules,
    activeRules,
    inactiveRules,
    validateRuleForm,
    getRulesByService,
    dispatch
  ]);
};

// ============================================================================
// ADDITIONAL UTILITY HOOKS
// ============================================================================

/**
 * Lightweight hook for just reading auth rules data (no actions)
 * Useful for components that only display data
 */
export const useAuthRulesData = () => {
  const rules = useSelector(authRulesSelectors.selectRules);
  const pagination = useSelector(authRulesSelectors.selectPagination);
  const loading = useSelector(authRulesSelectors.selectIsFetching);
  const totalRules = useSelector(authRulesSelectors.selectTotalRules);

  return {
    rules,
    pagination,
    loading,
    totalRules,
    hasRules: rules.length > 0,
  };
};

/**
 * Hook specifically for form components
 * Provides form-focused functionality
 */
export const useAuthRulesForm = () => {
  const { actions, helpers, loading, error } = useAuthRules({ showToasts: false });

  return {
    createRule: actions.createRule,
    testRule: actions.testRule,
    clearTestResult: actions.clearTestResult,
    validateForm: helpers.validateRuleForm,
    getValidationErrors: helpers.getValidationErrors,
    isValidationError: helpers.isValidationError,
    testResult: useSelector(authRulesSelectors.selectTestResult),
    isCreating: loading.creating,
    isTesting: loading.testing,
    error,
  };
};

// Export types for consumers
export type { UseAuthRulesReturn };
