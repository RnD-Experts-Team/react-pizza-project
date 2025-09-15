/**
 * @fileoverview Custom hooks for Employment Information management
 * @description Wraps Redux actions and selectors for easy component integration
 * Provides CRUD operations, loading states, and error handling in reusable hooks
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store'; // Adjust path as needed
import {
  fetchAllEmploymentInformation,
  fetchEmploymentInformationById,
  createEmploymentInformation,
  updateEmploymentInformation,
  deleteEmploymentInformation,
  clearErrors,
  clearCurrentItem,
  setCurrentItem,
  clearError,
  resetState,
  selectAllEmploymentInformation,
  selectCurrentEmploymentInformation,
  selectEmploymentInformationLoading,
  selectEmploymentInformationErrors,
  selectEmploymentInformationById,
  selectEmploymentInformationByEmpId,
  selectEmploymentInformationStats,
  selectIsAnyLoading,
  selectHasAnyError,
} from '../store/employmentInformationSlice';
import type {
  EmploymentInformation,
  CreateEmploymentInformationRequest,
  UpdateEmploymentInformationRequest,
  UseEmploymentInformationsReturn,
} from '../types';

// ============================================================================
// Main Hook - Complete Employment Information Management
// ============================================================================

/**
 * Main hook for Employment Information management
 * @description Provides complete CRUD functionality, state management, and error handling
 * @returns Object containing data, loading states, errors, and action methods
 */
export const useEmploymentInformations = (): UseEmploymentInformationsReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // ========================================================================
  // Selectors
  // ========================================================================
  const employmentInformations = useSelector(selectAllEmploymentInformation);
  const currentEmploymentInformation = useSelector(selectCurrentEmploymentInformation);
  const loading = useSelector(selectEmploymentInformationLoading);
  const errors = useSelector(selectEmploymentInformationErrors);
  const stats = useSelector(selectEmploymentInformationStats);

  // ========================================================================
  // Memoized Actions
  // ========================================================================

  /**
   * Fetches all employment information records
   * @description Dispatches fetchAll action with error handling and logging
   */
  const fetchAll = useCallback(async (): Promise<void> => {
    try {
      console.log('[useEmploymentInformations] Initiating fetchAll');
      await dispatch(fetchAllEmploymentInformation()).unwrap();
      console.log('[useEmploymentInformations] fetchAll completed successfully');
    } catch (error) {
      console.error('[useEmploymentInformations] fetchAll failed:', error);
      // Error is already handled by the slice, no need to rethrow
    }
  }, [dispatch]);

  /**
   * Fetches employment information by ID
   * @param id - The employment information ID to fetch
   * @description Dispatches fetchById action with validation and error handling
   */
  const fetchById = useCallback(async (id: number): Promise<void> => {
    if (!id || id <= 0) {
      console.warn('[useEmploymentInformations] fetchById: Invalid ID provided:', id);
      return;
    }

    try {
      console.log(`[useEmploymentInformations] Fetching employment info with ID: ${id}`);
      await dispatch(fetchEmploymentInformationById(id)).unwrap();
      console.log(`[useEmploymentInformations] fetchById(${id}) completed successfully`);
    } catch (error) {
      console.error(`[useEmploymentInformations] fetchById(${id}) failed:`, error);
      // Error is already handled by the slice, no need to rethrow
    }
  }, [dispatch]);

  /**
   * Creates new employment information
   * @param data - The employment information data to create
   * @returns Promise resolving to created employment information or null if failed
   */
  const create = useCallback(async (
    data: CreateEmploymentInformationRequest
  ): Promise<EmploymentInformation | null> => {
    if (!data) {
      console.warn('[useEmploymentInformations] create: No data provided');
      return null;
    }

    try {
      console.log('[useEmploymentInformations] Creating new employment information');
      const result = await dispatch(createEmploymentInformation(data)).unwrap();
      console.log('[useEmploymentInformations] create completed successfully:', result.id);
      return result as unknown as EmploymentInformation;
    } catch (error) {
      console.error('[useEmploymentInformations] create failed:', error);
      return null;
    }
  }, [dispatch]);

  /**
   * Updates existing employment information
   * @param id - The employment information ID to update
   * @param data - The updated employment information data
   * @returns Promise resolving to updated employment information or null if failed
   */
  const update = useCallback(async (
    id: number,
    data: UpdateEmploymentInformationRequest
  ): Promise<EmploymentInformation | null> => {
    if (!id || id <= 0) {
      console.warn('[useEmploymentInformations] update: Invalid ID provided:', id);
      return null;
    }

    if (!data) {
      console.warn('[useEmploymentInformations] update: No data provided');
      return null;
    }

    try {
      console.log(`[useEmploymentInformations] Updating employment info with ID: ${id}`);
      const result = await dispatch(updateEmploymentInformation({ id, data })).unwrap();
      console.log(`[useEmploymentInformations] update(${id}) completed successfully`);
      return result as unknown as EmploymentInformation;
    } catch (error) {
      console.error(`[useEmploymentInformations] update(${id}) failed:`, error);
      return null;
    }
  }, [dispatch]);

  /**
   * Deletes employment information by ID
   * @param id - The employment information ID to delete
   * @returns Promise resolving to success boolean
   */
  const deleteById = useCallback(async (id: number): Promise<boolean> => {
    if (!id || id <= 0) {
      console.warn('[useEmploymentInformations] delete: Invalid ID provided:', id);
      return false;
    }

    try {
      console.log(`[useEmploymentInformations] Deleting employment info with ID: ${id}`);
      await dispatch(deleteEmploymentInformation(id)).unwrap();
      console.log(`[useEmploymentInformations] delete(${id}) completed successfully`);
      return true;
    } catch (error) {
      console.error(`[useEmploymentInformations] delete(${id}) failed:`, error);
      return false;
    }
  }, [dispatch]);

  /**
   * Clears all errors
   * @description Dispatches clearErrors action
   */
  const clearAllErrors = useCallback((): void => {
    console.log('[useEmploymentInformations] Clearing all errors');
    dispatch(clearErrors());
  }, [dispatch]);

  /**
   * Clears the currently selected employment information
   * @description Dispatches clearCurrentItem action
   */
  const clearCurrent = useCallback((): void => {
    console.log('[useEmploymentInformations] Clearing current item');
    dispatch(clearCurrentItem());
  }, [dispatch]);

  /**
   * Sets the currently selected employment information
   * @param item - The employment information to set as current
   */
  const setCurrent = useCallback((item: EmploymentInformation): void => {
    console.log(`[useEmploymentInformations] Setting current item: ${item.id}`);
    dispatch(setCurrentItem(item));
  }, [dispatch]);

  /**
   * Clears specific error type
   * @param errorType - The type of error to clear
   */
  const clearSpecificError = useCallback((
    errorType: 'list' | 'item' | 'create' | 'update' | 'delete'
  ): void => {
    console.log(`[useEmploymentInformations] Clearing ${errorType} error`);
    dispatch(clearError(errorType));
  }, [dispatch]);

  /**
   * Resets the entire employment information state
   * @description Dispatches resetState action
   */
  const reset = useCallback((): void => {
    console.log('[useEmploymentInformations] Resetting state');
    dispatch(resetState());
  }, [dispatch]);

  // ========================================================================
  // Memoized Actions Object
  // ========================================================================
  const actions = useMemo(() => ({
    fetchAll,
    fetchById,
    create,
    update,
    delete: deleteById,
    clearErrors: clearAllErrors,
    clearCurrent,
    setCurrent,
    clearSpecificError,
    reset,
  }), [
    fetchAll,
    fetchById,
    create,
    update,
    deleteById,
    clearAllErrors,
    clearCurrent,
    setCurrent,
    clearSpecificError,
    reset,
  ]);

  // ========================================================================
  // Auto-fetch on Mount (Optional)
  // ========================================================================
  useEffect(() => {
    // Only auto-fetch if we don't have data and we're not currently loading
    if (employmentInformations.length === 0 && !loading.list && !stats.lastFetch) {
      console.log('[useEmploymentInformations] Auto-fetching data on mount');
      fetchAll();
    }
  }, []); // Empty dependency array for mount-only effect

  // ========================================================================
  // Return Hook Interface
  // ========================================================================
  return {
    employmentInformations,
    currentEmploymentInformation,
    loading,
    errors,
    actions,
  };
};

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for fetching and managing a single employment information record
 * @param id - The employment information ID to manage
 * @returns Object containing the specific employment information and related actions
 */
export const useEmploymentInformation = (id: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectEmploymentInformationLoading);
  const errors = useSelector(selectEmploymentInformationErrors);
  
  // Get specific employment information by ID using proper TypeScript pattern
  const employmentInformation = useSelector((state: RootState) => 
    id ? selectEmploymentInformationById(id)(state) : null
  );

  /**
   * Fetches the employment information if ID is provided and data doesn't exist
   */
  const fetchIfNeeded = useCallback(async (): Promise<void> => {
    if (id && !employmentInformation && !loading.item) {
      try {
        console.log(`[useEmploymentInformation] Fetching employment info: ${id}`);
        await dispatch(fetchEmploymentInformationById(id)).unwrap();
      } catch (error) {
        console.error(`[useEmploymentInformation] Fetch failed for ID ${id}:`, error);
      }
    }
  }, [id, employmentInformation, loading.item, dispatch]);

  // Auto-fetch when ID changes
  useEffect(() => {
    fetchIfNeeded();
  }, [fetchIfNeeded]);

  return {
    employmentInformation,
    loading: loading.item,
    error: errors.item,
    fetchIfNeeded,
  };
};

/**
 * Hook for managing employment information by employee ID
 * @param empInfoId - The employee info ID to filter by
 * @returns Object containing filtered employment information records
 */
export const useEmploymentInformationByEmployee = (empInfoId: number | null) => {
  const employmentInformations = useSelector((state: RootState) =>
    empInfoId ? selectEmploymentInformationByEmpId(empInfoId)(state) : []
  );

  const stats = useMemo(() => {
    if (!empInfoId || employmentInformations.length === 0) {
      return {
        total: 0,
        w2Count: 0,
        contractorCount: 0,
        withUniformCount: 0,
      };
    }

    return {
      total: employmentInformations.length,
      w2Count: employmentInformations.filter(emp => emp.employment_type === 'W2').length,
      contractorCount: employmentInformations.filter(emp => emp.employment_type === '1099').length,
      withUniformCount: employmentInformations.filter(emp => emp.has_uniform).length,
    };
  }, [employmentInformations, empInfoId]);

  return {
    employmentInformations,
    stats,
    hasEmploymentRecords: employmentInformations.length > 0,
  };
};

/**
 * Hook for employment information statistics and overview
 * @returns Object containing computed statistics and overview data
 */
export const useEmploymentInformationStats = () => {
  const stats = useSelector(selectEmploymentInformationStats);
  const isAnyLoading = useSelector(selectIsAnyLoading);
  const hasAnyError = useSelector(selectHasAnyError);

  const overview = useMemo(() => ({
    ...stats,
    isLoading: isAnyLoading,
    hasErrors: hasAnyError,
    employmentTypeDistribution: {
      w2Percentage: stats.total > 0 ? Math.round((stats.w2Count / stats.total) * 100) : 0,
      contractorPercentage: stats.total > 0 ? Math.round((stats.contractorCount / stats.total) * 100) : 0,
    },
    uniformDistribution: {
      withUniformPercentage: stats.total > 0 ? Math.round((stats.withUniformCount / stats.total) * 100) : 0,
      withoutUniformPercentage: stats.total > 0 ? Math.round(((stats.total - stats.withUniformCount) / stats.total) * 100) : 0,
    },
  }), [stats, isAnyLoading, hasAnyError]);

  return overview;
};

/**
 * Hook for form management with employment information
 * @param initialData - Initial form data (for edit mode)
 * @returns Object containing form state and submission handlers
 */
export const useEmploymentInformationForm = (
  initialData?: Partial<CreateEmploymentInformationRequest>
) => {
  const { create, update } = useEmploymentInformations().actions;
  const loading = useSelector(selectEmploymentInformationLoading);
  const errors = useSelector(selectEmploymentInformationErrors);

  /**
   * Handles form submission for create or update
   * @param data - Form data to submit
   * @param editId - ID for update mode (null for create mode)
   * @returns Promise resolving to success boolean
   */
  const handleSubmit = useCallback(async (
    data: CreateEmploymentInformationRequest,
    editId?: number
  ): Promise<boolean> => {
    try {
      let result: EmploymentInformation | null;
      
      if (editId) {
        console.log(`[useEmploymentInformationForm] Updating record: ${editId}`);
        result = await update(editId, data);
      } else {
        console.log('[useEmploymentInformationForm] Creating new record');
        result = await create(data);
      }

      if (result) {
        console.log('[useEmploymentInformationForm] Submission successful');
        return true;
      } else {
        console.warn('[useEmploymentInformationForm] Submission failed - no result returned');
        return false;
      }
    } catch (error) {
      console.error('[useEmploymentInformationForm] Submission error:', error);
      return false;
    }
  }, [create, update]);

  return {
    handleSubmit,
    isSubmitting: loading.create || loading.update,
    submitError: errors.create || errors.update,
    initialData,
  };
};

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook for checking employment information loading states
 * @returns Object containing boolean loading states for each operation
 */
export const useEmploymentInformationLoadingStates = () => {
  const loading = useSelector(selectEmploymentInformationLoading);
  const isAnyLoading = useSelector(selectIsAnyLoading);

  return {
    ...loading,
    isAnyLoading,
  };
};

/**
 * Hook for checking employment information error states
 * @returns Object containing error messages for each operation
 */
export const useEmploymentInformationErrors = () => {
  const errors = useSelector(selectEmploymentInformationErrors);
  const hasAnyError = useSelector(selectHasAnyError);

  return {
    ...errors,
    hasAnyError,
  };
};

/**
 * Hook for optimistic updates (advanced usage)
 * @description Provides methods for optimistic UI updates before API confirmation
 * @returns Object containing optimistic update methods
 */
export const useOptimisticEmploymentInformation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const optimisticUpdate = useCallback((
    id: number,
    updates: Partial<EmploymentInformation>
  ): void => {
    // This would require additional slice actions for optimistic updates
    console.log(`[useOptimisticEmploymentInformation] Optimistic update for ID: ${id}`, updates);
    // Implementation would depend on specific optimistic update slice actions
  }, [dispatch]);

  const revertOptimisticUpdate = useCallback((id: number): void => {
    console.log(`[useOptimisticEmploymentInformation] Reverting optimistic update for ID: ${id}`);
    // Implementation would depend on specific revert slice actions
  }, [dispatch]);

  return {
    optimisticUpdate,
    revertOptimisticUpdate,
  };
};

// ============================================================================
// Default Export
// ============================================================================

export default useEmploymentInformations;
