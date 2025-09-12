// src/features/schedulePreferences/hooks/useSchedulePreferences.ts

/**
 * Schedule Preferences Custom Hook
 * 
 * Custom React hook that provides a clean, reusable interface for schedule preferences operations.
 * Wraps Redux state management and async operations with proper error handling, loading states,
 * and TypeScript safety.
 * 
 * Features:
 * - Type-safe Redux integration with useSelector and useDispatch
 * - Comprehensive CRUD operations with loading and error states
 * - Memoized functions to prevent unnecessary re-renders
 * - Automatic error handling and logging
 * - Clean abstraction over Redux complexity
 * - Production-ready with proper cleanup and optimization
 * 
 * @fileoverview Custom hook for schedule preferences management
 * @author Generated for schedule preferences API integration
 * @version 1.0.0
 */

import { useCallback, useEffect, useMemo } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  fetchAllSchedulePreferences,
  fetchSchedulePreferenceById,
  createSchedulePreference,
  updateSchedulePreference,
  deleteSchedulePreference,
  clearErrors,
  clearError,
  setCurrentSchedulePreference,
  clearCurrentSchedulePreference,
  resetSlice,
  selectAllSchedulePreferences,
  selectCurrentSchedulePreference,
  selectSchedulePreferencesTotalCount,
  selectSchedulePreferencesLoadingStates,
  selectSchedulePreferencesErrors,
  selectIsAnySchedulePreferenceLoading,
  selectSchedulePreferencesLastFetch,
} from '../store/schedulePreferencesSlice';
import {
  LoadingState,
  EmploymentType
} from '../types';
import type {
  SchedulePreference,
  CreateSchedulePreferenceRequest,
  UpdateSchedulePreferenceRequest,
  UseSchedulePreferencesReturn,
} from '../types';


// =============================================================================
// TYPED DISPATCH HOOK (you should create this in your store setup)
// =============================================================================

// Note: Import these from your store setup file instead of defining here
// This is just for reference - you should have these in your main store file:
// 
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import type { RootState, AppDispatch } from './store';
// 
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// For now, we'll assume you have the proper typed hooks available
// If not, you'll need to set them up as shown in the Redux Toolkit TypeScript guide

declare function useAppDispatch(): any; // Replace with your proper typed dispatch
declare function useAppSelector<T>(selector: (state: any) => T): T; // Replace with your proper typed selector

// =============================================================================
// TYPE DEFINITIONS FOR HOOK CONFIGURATION
// =============================================================================

/**
 * Configuration options for the useSchedulePreferences hook
 * @interface UseSchedulePreferencesOptions
 */
interface UseSchedulePreferencesOptions {
  /** Whether to automatically fetch all schedule preferences on mount */
  fetchOnMount?: boolean;
  /** Whether to refetch data when the component mounts and data is stale */
  refetchOnMount?: boolean;
  /** Time in milliseconds after which data is considered stale */
  staleTime?: number;
  /** Whether to enable detailed logging for debugging */
  enableLogging?: boolean;
  /** Callback function called when operations succeed */
  onSuccess?: (operation: string, data?: any) => void;
  /** Callback function called when operations fail */
  onError?: (operation: string, error: string) => void;
}

/**
 * Extended return type with additional utility functions
 * @interface ExtendedUseSchedulePreferencesReturn
 */
interface ExtendedUseSchedulePreferencesReturn extends UseSchedulePreferencesReturn {
  /** Selectors for filtered data */
  selectors: {
    getById: (id: number) => SchedulePreference | undefined;
    getByEmploymentType: (type: EmploymentType) => SchedulePreference[];
    getByEmployeeId: (empInfoId: number) => SchedulePreference[];
  };
  /** Utility functions */
  utils: {
    isDataStale: () => boolean;
    getLastFetchTime: () => string | null;
    getTotalCount: () => number;
    resetAll: () => void;
    clearAllErrors: () => void;
  };
  /** Loading state helpers */
  loadingStates: {
    fetchAll: LoadingState;
    fetchById: LoadingState;
    create: LoadingState;
    update: LoadingState;
    delete: LoadingState;
    isAnyLoading: boolean;
  };
  /** Error state helpers */
  errorStates: {
    fetchAll: string | null;
    fetchById: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
    hasAnyError: boolean;
  };
  /** Additional state management functions */
  setCurrent: (preference: SchedulePreference | null) => void;
  clearCurrent: () => void;
  clearErrorByType: (operation: 'fetchAll' | 'fetchById' | 'create' | 'update' | 'delete') => void;
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

/**
 * Custom hook for managing schedule preferences with Redux integration
 * 
 * Provides a comprehensive interface for CRUD operations on schedule preferences
 * with proper loading states, error handling, and TypeScript safety.
 * 
 * @param {UseSchedulePreferencesOptions} options - Configuration options
 * @returns {ExtendedUseSchedulePreferencesReturn} Hook interface with all operations and state
 * 
 * @example
 * ```
 * // Basic usage
 * const { schedulePreferences, loading, error, fetchAll, create } = useSchedulePreferences();
 * 
 * // With options
 * const schedulePreferencesHook = useSchedulePreferences({
 *   fetchOnMount: true,
 *   staleTime: 5 * 60 * 1000, // 5 minutes
 *   onSuccess: (operation, data) => console.log(`${operation} succeeded:`, data),
 *   onError: (operation, error) => console.error(`${operation} failed:`, error)
 * });
 * 
 * // Using selectors
 * const fullTimePreferences = schedulePreferencesHook.selectors.getByEmploymentType('FT');
 * 
 * // Using utilities
 * const isStale = schedulePreferencesHook.utils.isDataStale();
 * ```
 */
export const useSchedulePreferences = (
  options: UseSchedulePreferencesOptions = {}
): ExtendedUseSchedulePreferencesReturn => {
  const {
    fetchOnMount = false,
    refetchOnMount = false,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    enableLogging = process.env.NODE_ENV === 'development',
    onSuccess,
    onError
  } = options;

  // ==========================================================================
  // REDUX INTEGRATION WITH TYPED HOOKS
  // ==========================================================================

  // Use the properly typed dispatch hook
  const dispatch = useAppDispatch();

  // State selectors using the typed selector hook
  const schedulePreferences = useAppSelector(selectAllSchedulePreferences);
  const currentSchedulePreference = useAppSelector(selectCurrentSchedulePreference);
  const totalCount = useAppSelector(selectSchedulePreferencesTotalCount);
  const loadingStates = useAppSelector(selectSchedulePreferencesLoadingStates);
  const errorStates = useAppSelector(selectSchedulePreferencesErrors);
  const isAnyLoading = useAppSelector(selectIsAnySchedulePreferenceLoading);
  const lastFetch = useAppSelector(selectSchedulePreferencesLastFetch);

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  /**
   * Logs operation details if logging is enabled
   * @param {string} operation - Operation name
   * @param {string} level - Log level
   * @param {any} details - Additional details to log
   */
  const log = useCallback((operation: string, level: 'info' | 'warn' | 'error' = 'info', details?: any) => {
    if (enableLogging) {
      const logFn = console[level] || console.log;
      logFn(`[useSchedulePreferences] ${operation}`, details || '');
    }
  }, [enableLogging]);

  /**
   * Checks if data is stale based on the configured stale time
   * @returns {boolean} Whether data is considered stale
   */
  const isDataStale = useCallback((): boolean => {
    if (!lastFetch) return true;
    const lastFetchTime = new Date(lastFetch).getTime();
    const now = Date.now();
    return (now - lastFetchTime) > staleTime;
  }, [lastFetch, staleTime]);

  /**
   * Handles successful operations with optional callback
   * @param {string} operation - Operation name
   * @param {any} data - Operation result data
   */
  const handleSuccess = useCallback((operation: string, data?: any) => {
    log(operation, 'info', `Operation succeeded`);
    onSuccess?.(operation, data);
  }, [log, onSuccess]);

  /**
   * Handles failed operations with optional callback
   * @param {string} operation - Operation name
   * @param {string} error - Error message
   */
  const handleError = useCallback((operation: string, error: string) => {
    log(operation, 'error', `Operation failed: ${error}`);
    onError?.(operation, error);
  }, [log, onError]);

  // ==========================================================================
  // ASYNC OPERATIONS WITH PROPER TYPING
  // ==========================================================================

  /**
   * Fetches all schedule preferences
   * @returns {Promise<void>} Promise that resolves when fetch completes
   */
  const fetchAll = useCallback(async (): Promise<void> => {
    try {
      log('fetchAll', 'info', 'Starting fetch all operation');
      const resultAction = await dispatch(fetchAllSchedulePreferences());
      const result = unwrapResult(resultAction);
      handleSuccess('fetchAll', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      handleError('fetchAll', errorMessage);
      throw error;
    }
  }, [dispatch, log, handleSuccess, handleError]);

  /**
   * Fetches a schedule preference by ID
   * @param {number} id - Schedule preference ID
   * @returns {Promise<void>} Promise that resolves when fetch completes
   */
  const fetchById = useCallback(async (id: number): Promise<void> => {
    try {
      log('fetchById', 'info', `Starting fetch by ID operation for ID: ${id}`);
      const resultAction = await dispatch(fetchSchedulePreferenceById({ id }));
      const result = unwrapResult(resultAction);
      handleSuccess('fetchById', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      handleError('fetchById', errorMessage);
      throw error;
    }
  }, [dispatch, log, handleSuccess, handleError]);

  /**
   * Creates a new schedule preference
   * @param {CreateSchedulePreferenceRequest} data - Schedule preference data
   * @returns {Promise<void>} Promise that resolves when creation completes
   */
  const create = useCallback(async (data: CreateSchedulePreferenceRequest): Promise<void> => {
    try {
      log('create', 'info', 'Starting create operation');
      const resultAction = await dispatch(createSchedulePreference(data));
      const result = unwrapResult(resultAction);
      handleSuccess('create', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      handleError('create', errorMessage);
      throw error;
    }
  }, [dispatch, log, handleSuccess, handleError]);

  /**
   * Updates an existing schedule preference
   * @param {number} id - Schedule preference ID
   * @param {UpdateSchedulePreferenceRequest} data - Updated schedule preference data
   * @returns {Promise<void>} Promise that resolves when update completes
   */
  const update = useCallback(async (id: number, data: UpdateSchedulePreferenceRequest): Promise<void> => {
    try {
      log('update', 'info', `Starting update operation for ID: ${id}`);
      const resultAction = await dispatch(updateSchedulePreference({ id, data }));
      const result = unwrapResult(resultAction);
      handleSuccess('update', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      handleError('update', errorMessage);
      throw error;
    }
  }, [dispatch, log, handleSuccess, handleError]);

  /**
   * Deletes a schedule preference
   * @param {number} id - Schedule preference ID
   * @returns {Promise<void>} Promise that resolves when deletion completes
   */
  const remove = useCallback(async (id: number): Promise<void> => {
    try {
      log('delete', 'info', `Starting delete operation for ID: ${id}`);
      const resultAction = await dispatch(deleteSchedulePreference({ id }));
      const result = unwrapResult(resultAction);
      handleSuccess('delete', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      handleError('delete', errorMessage);
      throw error;
    }
  }, [dispatch, log, handleSuccess, handleError]);

  // ==========================================================================
  // STATE MANAGEMENT FUNCTIONS
  // ==========================================================================

  /**
   * Clears specific error by operation type
   * @param {string} operation - Operation type to clear error for
   */
  const clearErrorByType = useCallback((operation: 'fetchAll' | 'fetchById' | 'create' | 'update' | 'delete') => {
    log('clearError', 'info', `Clearing error for: ${operation}`);
    dispatch(clearError(operation));
  }, [dispatch, log]);

  /**
   * Generic clear error function (clears all errors)
   */
  const clearErrorGeneric = useCallback(() => {
    log('clearErrors', 'info', 'Clearing all errors');
    dispatch(clearErrors());
  }, [dispatch, log]);

  /**
   * Sets the current schedule preference
   * @param {SchedulePreference | null} preference - Schedule preference to set as current
   */
  const setCurrent = useCallback((preference: SchedulePreference | null) => {
    log('setCurrent', 'info', `Setting current schedule preference: ${preference?.id || 'null'}`);
    dispatch(setCurrentSchedulePreference(preference));
  }, [dispatch, log]);

  /**
   * Clears the current schedule preference
   */
  const clearCurrent = useCallback(() => {
    log('clearCurrent', 'info', 'Clearing current schedule preference');
    dispatch(clearCurrentSchedulePreference());
  }, [dispatch, log]);

  // ==========================================================================
  // SELECTORS AND UTILITIES
  // ==========================================================================

  
  /**
   * Memoized selector functions for filtered data access
   */
  const selectors = useMemo(() => ({
    getById: (id: number) => schedulePreferences.find(preference => preference.id === id),
    getByEmploymentType: (type: EmploymentType) => schedulePreferences.filter(preference => preference.employment_type === type),
    getByEmployeeId: (empInfoId: number) => schedulePreferences.filter(preference => preference.emp_info_id === empInfoId)
  }), [schedulePreferences]);

  /**
   * Memoized utility functions
   */
  const utils = useMemo(() => ({
    isDataStale,
    getLastFetchTime: () => lastFetch,
    getTotalCount: () => totalCount,
    resetAll: () => {
      log('resetAll', 'info', 'Resetting all state');
      dispatch(resetSlice());
    },
    clearAllErrors: () => {
      log('clearAllErrors', 'info', 'Clearing all errors');
      dispatch(clearErrors());
    }
  }), [isDataStale, lastFetch, totalCount, dispatch, log]);

  /**
   * Memoized error state helpers
   */
  const errorStatesHelper = useMemo(() => ({
    ...errorStates,
    hasAnyError: Object.values(errorStates).some(error => error !== null)
  }), [errorStates]);

  /**
   * Memoized loading state helpers
   */
  const loadingStatesHelper = useMemo(() => ({
    ...loadingStates,
    isAnyLoading
  }), [loadingStates, isAnyLoading]);

  // ==========================================================================
  // SIDE EFFECTS
  // ==========================================================================

  /**
   * Effect for automatic data fetching on mount
   */
  useEffect(() => {
    const shouldFetch = fetchOnMount || (refetchOnMount && isDataStale());
    
    if (shouldFetch) {
      log('useEffect', 'info', 'Auto-fetching data on mount');
      fetchAll().catch(error => {
        log('useEffect', 'error', `Auto-fetch failed: ${error.message}`);
      });
    }
  }, [fetchOnMount, refetchOnMount, isDataStale, fetchAll, log]);

  // ==========================================================================
  // RETURN HOOK INTERFACE
  // ==========================================================================

  return {
    // Core data
    schedulePreferences,
    currentSchedulePreference,
    
    // Legacy compatibility (maps to first error found or generic loading state)
    loading: isAnyLoading,
    error: errorStatesHelper.hasAnyError 
      ? Object.values(errorStates).find(error => error !== null) || null 
      : null,
    
    // CRUD operations
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    
    // State management
    clearError: clearErrorGeneric,
    setCurrent,
    clearCurrent,
    clearErrorByType,
    
    // Enhanced features
    selectors,
    utils,
    loadingStates: loadingStatesHelper,
    errorStates: errorStatesHelper
  };
};

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

/**
 * Specialized hook for auto-fetching schedule preferences on mount
 * @param {number} staleTime - Time in ms after which data is considered stale
 * @returns {ExtendedUseSchedulePreferencesReturn} Hook interface with auto-fetch enabled
 */
export const useSchedulePreferencesWithAutoFetch = (staleTime = 5 * 60 * 1000) => {
  return useSchedulePreferences({
    fetchOnMount: true,
    refetchOnMount: true,
    staleTime,
    enableLogging: true
  });
};

/**
 * Specialized hook for a specific schedule preference by ID
 * Automatically fetches the preference if not already loaded
 * @param {number} id - Schedule preference ID
 * @returns {object} Hook interface focused on single preference
 */
export const useSchedulePreference = (id: number) => {
  const hook = useSchedulePreferences();
  const preference = hook.selectors.getById(id);
  
  useEffect(() => {
    if (!preference && hook.loadingStates.fetchById !== LoadingState.LOADING) {
      hook.fetchById(id).catch(error => {
        console.error(`Failed to fetch schedule preference ${id}:`, error);
      });
    }
  }, [id, preference, hook]);
  
  return {
    preference,
    loading: hook.loadingStates.fetchById === LoadingState.LOADING,
    error: hook.errorStates.fetchById,
    refetch: () => hook.fetchById(id),
    update: (data: UpdateSchedulePreferenceRequest) => hook.update(id, data),
    remove: () => hook.remove(id),
    clearError: () => hook.clearErrorByType('fetchById')
  };
};

/**
 * Specialized hook for schedule preferences filtered by employment type
 * @param {EmploymentType} employmentType - Employment type to filter by
 * @returns {object} Hook interface with filtered data
 */
export const useSchedulePreferencesByEmploymentType = (employmentType: EmploymentType) => {
  const hook = useSchedulePreferencesWithAutoFetch();
  const filteredPreferences = hook.selectors.getByEmploymentType(employmentType);
  
  return {
    schedulePreferences: filteredPreferences,
    loading: hook.loadingStates.fetchAll === LoadingState.LOADING,
    error: hook.errorStates.fetchAll,
    refetch: hook.fetchAll,
    totalCount: filteredPreferences.length,
    clearError: () => hook.clearErrorByType('fetchAll')
  };
};

/**
 * Export default hook for convenience
 */
export default useSchedulePreferences;
