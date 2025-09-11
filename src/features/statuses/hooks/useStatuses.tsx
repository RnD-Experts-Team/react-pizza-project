// src/features/statuses/hooks/useStatuses.tsx

import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import {
  fetchAllStatuses,
  fetchStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
  clearErrors,
  clearError,
  resetStatusesState,
  optimisticUpdateStatus,
  selectAllStatuses,
  selectStatusById,
  selectStatusesLoading,
  selectStatusesErrors,
  selectStatusesMetadata,
  selectIsAnyStatusLoading,
  selectHasStatusErrors,
} from '../store/statusesSlice';
import {
  type Status,
  type CreateStatusRequest,
  type UpdateStatusRequest,
} from '../types';

/**
 * Configuration options for the useStatuses hook
 */
interface UseStatusesOptions {
  /** Whether to automatically fetch statuses on mount */
  autoFetch?: boolean;
  /** Refetch interval in milliseconds (0 to disable) */
  refetchInterval?: number;
}

/**
 * Error types for status operations
 */
type StatusErrorType = 'fetchAll' | 'fetchById' | 'create' | 'update' | 'delete';

/**
 * Return type for the main useStatuses hook
 * Provides comprehensive status management functionality
 */
interface UseStatusesReturn {
  // Data
  statuses: Status[];
  statusCount: number;
  lastFetched: string | null;
  
  // Loading states
  loading: {
    fetchAll: boolean;
    fetchById: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  isAnyLoading: boolean;
  
  // Error states
  errors: {
    fetchAll: string | null;
    fetchById: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
  hasErrors: boolean;
  
  // Actions
  fetchStatuses: () => Promise<void>;
  createNewStatus: (statusData: CreateStatusRequest) => Promise<Status | null>;
  updateExistingStatus: (id: number, statusData: UpdateStatusRequest) => Promise<Status | null>;
  deleteExistingStatus: (id: number) => Promise<boolean>;
  
  // Utility actions
  clearAllErrors: () => void;
  clearSpecificError: (errorType: StatusErrorType) => void;
  resetState: () => void;
  refetch: () => Promise<void>;
}

/**
 * Main custom hook for status management
 * Encapsulates all status CRUD operations and state management
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing status data, loading states, errors, and actions
 */
export const useStatuses = (options: UseStatusesOptions = {}): UseStatusesReturn => {
  const { autoFetch = true, refetchInterval = 0 } = options;
  
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors - efficiently select data from Redux store
  const statuses = useSelector(selectAllStatuses);
  const loading = useSelector(selectStatusesLoading);
  const errors = useSelector(selectStatusesErrors);
  const metadata = useSelector(selectStatusesMetadata);
  const isAnyLoading = useSelector(selectIsAnyStatusLoading);
  const hasErrors = useSelector(selectHasStatusErrors);

  /**
   * Fetch all statuses from the API
   * Memoized to prevent unnecessary re-renders
   */
  const fetchStatuses = useCallback(async (): Promise<void> => {
    try {
      await dispatch(fetchAllStatuses()).unwrap();
    } catch (error) {
      // Error is already handled by the Redux slice
      console.error('Failed to fetch statuses:', error);
    }
  }, [dispatch]);

  /**
   * Create a new status
   * Returns the created status on success, null on failure
   */
  const createNewStatus = useCallback(async (
    statusData: CreateStatusRequest
  ): Promise<Status | null> => {
    try {
      const result = await dispatch(createStatus(statusData)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create status:', error);
      return null;
    }
  }, [dispatch]);

  /**
   * Update an existing status
   * Supports optimistic updates for better UX
   */
  const updateExistingStatus = useCallback(async (
    id: number, 
    statusData: UpdateStatusRequest
  ): Promise<Status | null> => {
    try {
      // Optimistic update for immediate UI feedback
      const optimisticStatus: Status = {
        id,
        description: statusData.description,
        slug: statusData.slug || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      dispatch(optimisticUpdateStatus(optimisticStatus));
      
      // Perform actual API call
      const result = await dispatch(updateStatus({ id, data: statusData })).unwrap();
      return result;
    } catch (error) {
      // Optimistic update will be automatically reverted by Redux slice
      console.error('Failed to update status:', error);
      return null;
    }
  }, [dispatch]);

  /**
   * Delete a status by ID
   * Returns true on success, false on failure
   */
  const deleteExistingStatus = useCallback(async (id: number): Promise<boolean> => {
    try {
      await dispatch(deleteStatus({ id })).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete status:', error);
      return false;
    }
  }, [dispatch]);

  /**
   * Clear all error states
   */
  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  /**
   * Clear a specific error state
   */
  const clearSpecificError = useCallback((errorType: StatusErrorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  /**
   * Reset the entire statuses state
   */
  const resetState = useCallback(() => {
    dispatch(resetStatusesState());
  }, [dispatch]);

  /**
   * Refetch statuses - alias for fetchStatuses for better API naming
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchStatuses();
  }, [fetchStatuses]);

  // Auto-fetch on component mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchStatuses();
    }
  }, [autoFetch, fetchStatuses]);

  // Set up periodic refetch if interval is specified
  useEffect(() => {
    if (refetchInterval > 0) {
      const intervalId = setInterval(() => {
        fetchStatuses();
      }, refetchInterval);

      return () => clearInterval(intervalId);
    }
  }, [refetchInterval, fetchStatuses]);

  return {
    // Data
    statuses,
    statusCount: metadata.total,
    lastFetched: metadata.lastFetched,
    
    // Loading states
    loading,
    isAnyLoading,
    
    // Error states
    errors,
    hasErrors,
    
    // Actions
    fetchStatuses,
    createNewStatus,
    updateExistingStatus,
    deleteExistingStatus,
    
    // Utility actions
    clearAllErrors,
    clearSpecificError,
    resetState,
    refetch,
  };
};

/**
 * Hook for fetching and managing a single status by ID
 * Useful for status detail views or forms
 * 
 * @param id - The ID of the status to fetch
 * @param autoFetch - Whether to automatically fetch the status on mount
 */
export const useStatus = (id: number, autoFetch: boolean = true) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select the specific status from the store
  const status = useSelector((state: RootState) => selectStatusById(state, id));
  const loading = useSelector(selectStatusesLoading);
  const errors = useSelector(selectStatusesErrors);

  /**
   * Fetch the specific status by ID
   */
  const fetchStatus = useCallback(async (): Promise<Status | null> => {
    try {
      const result = await dispatch(fetchStatusById(id)).unwrap();
      return result;
    } catch (error) {
      console.error(`Failed to fetch status with ID ${id}:`, error);
      return null;
    }
  }, [dispatch, id]);

  /**
   * Update this specific status
   */
  const updateStatusById = useCallback(async (
    statusData: UpdateStatusRequest
  ): Promise<Status | null> => {
    try {
      const result = await dispatch(updateStatus({ id, data: statusData })).unwrap();
      return result;
    } catch (error) {
      console.error(`Failed to update status with ID ${id}:`, error);
      return null;
    }
  }, [dispatch, id]);

  /**
   * Delete this specific status
   */
  const deleteStatusById = useCallback(async (): Promise<boolean> => {
    try {
      await dispatch(deleteStatus({ id })).unwrap();
      return true;
    } catch (error) {
      console.error(`Failed to delete status with ID ${id}:`, error);
      return false;
    }
  }, [dispatch, id]);

  // Auto-fetch on component mount or when ID changes
  useEffect(() => {
    if (autoFetch && id) {
      fetchStatus();
    }
  }, [autoFetch, id, fetchStatus]);

  return {
    // Data
    status,
    exists: !!status,
    
    // Loading states
    isLoading: loading.fetchById,
    isUpdating: loading.update,
    isDeleting: loading.delete,
    
    // Error states
    fetchError: errors.fetchById,
    updateError: errors.update,
    deleteError: errors.delete,
    
    // Actions
    fetchStatus,
    updateStatus: updateStatusById,
    deleteStatus: deleteStatusById,
    refetch: fetchStatus,
  };
};

/**
 * Hook for creating new statuses
 * Provides optimized state and handlers for status creation forms
 */
export const useCreateStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.statuses.loading.create);
  const error = useSelector((state: RootState) => state.statuses.errors.create);

  /**
   * Create a new status
   */
  const createNewStatus = useCallback(async (
    statusData: CreateStatusRequest
  ): Promise<Status | null> => {
    try {
      const result = await dispatch(createStatus(statusData)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create status:', error);
      return null;
    }
  }, [dispatch]);

  /**
   * Clear creation error
   */
  const clearCreateError = useCallback(() => {
    dispatch(clearError('create'));
  }, [dispatch]);

  return {
    // State
    isCreating: loading,
    createError: error,
    
    // Actions
    createStatus: createNewStatus,
    clearError: clearCreateError,
  };
};

/**
 * Hook for status-related utility functions
 * Provides helper functions and computed values
 */
export const useStatusUtils = () => {
  const statuses = useSelector(selectAllStatuses);
  
  /**
   * Find status by slug
   */
  const findBySlug = useCallback((slug: string): Status | undefined => {
    return statuses.find(status => status.slug === slug);
  }, [statuses]);

  /**
   * Check if a slug is already taken
   */
  const isSlugTaken = useCallback((slug: string, excludeId?: number): boolean => {
    return statuses.some(status => 
      status.slug === slug && status.id !== excludeId
    );
  }, [statuses]);

  /**
   * Get statuses sorted by creation date
   */
  const getStatusesSorted = useCallback((ascending: boolean = false): Status[] => {
    return [...statuses].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }, [statuses]);

  /**
   * Search statuses by description or slug
   */
  const searchStatuses = useCallback((query: string): Status[] => {
    const lowercaseQuery = query.toLowerCase();
    return statuses.filter(status => 
      status.description.toLowerCase().includes(lowercaseQuery) ||
      status.slug.toLowerCase().includes(lowercaseQuery)
    );
  }, [statuses]);

  return {
    findBySlug,
    isSlugTaken,
    getStatusesSorted,
    searchStatuses,
    totalCount: statuses.length,
  };
};

/**
 * Default export - main useStatuses hook
 */
export default useStatuses;
