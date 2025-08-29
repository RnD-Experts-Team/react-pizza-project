/**
 * Store Management Custom Hooks - Updated with proper patterns
 * 
 * These hooks encapsulate all business logic, validation, and data transformation.
 * Components should only interact with these hooks and not directly with 
 * Redux actions, API services, or state selectors.
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  // Async thunks
  fetchStores,
  fetchStoreById,
  createStore as createStoreAction,
  updateStore as updateStoreAction,
  fetchStoreUsers,
  fetchStoreRoles,
  searchStores as searchStoresAction,
  
  // Actions
  setSelectedStoreId,
  setSearchQuery,
  clearErrors,
  clearError,
  resetPagination,
  clearCurrentStore,
  clearStoreUsers,
  clearStoreRoles,
  updateStoreInList,
  removeStoreFromList,
  
  // Selectors
  selectStores,
  selectStoresPagination,
  selectCurrentStore,
  selectSelectedStoreId,
  selectSearchQuery,
  selectCurrentPage,
  selectPerPage,
  selectStoreUsers,
  selectStoreRoles,
  selectStoresLoading,
  selectStoreLoading,
  selectCreateStoreLoading,
  selectUpdateStoreLoading,
  selectStoreUsersLoading,
  selectStoreRolesLoading,
  selectStoresError,
  selectStoreError,
  selectCreateStoreError,
  selectUpdateStoreError,
  selectStoreUsersError,
  selectStoreRolesError,
  selectStoreById,
} from '../store/storesSlice';
import type {
  Store,
  GetStoresParams,
  CreateStorePayload,
  UpdateStorePayload,
  UseStoresReturn,
  UseStoreReturn,
  UseStoreOperationsReturn,
  UseStoreUsersReturn,
  UseStoreRolesReturn,
} from '../types';
import type { AppDispatch, RootState } from '../../../store'; // Adjust path to your store types

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Debounce utility function
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ============================================================================
// Main Store Hooks
// ============================================================================

/**
 * Enhanced stores hook with pagination, search, and filtering
 */
export const useStores = (
  autoFetch: boolean = true,
  initialParams?: GetStoresParams
): UseStoresReturn & {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalStores: number;
  hasStores: boolean;
  isEmpty: boolean;
  currentPageData: {
    from: number;
    to: number;
    total: number;
  };
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stabilize initialParams to prevent unnecessary re-renders
  const initialParamsRef = useRef(initialParams);
  initialParamsRef.current = initialParams;
  
  // Select state from Redux store
  const stores = useSelector(selectStores);
  const loading = useSelector(selectStoresLoading);
  const error = useSelector(selectStoresError);
  const pagination = useSelector(selectStoresPagination);
  const currentPage = useSelector(selectCurrentPage);
  const perPage = useSelector(selectPerPage);
  const searchQuery = useSelector(selectSearchQuery);

  // Computed values
  const hasStores = stores.length > 0;
  const isEmpty = !loading && stores.length === 0;
  const totalStores = pagination?.total || 0;
  
  const currentPageData = useMemo(() => ({
    from: pagination?.from || 0,
    to: pagination?.to || 0,
    total: pagination?.total || 0,
  }), [pagination]);

  // Fetch function with error handling
  const fetchStoresCallback = useCallback(
    async (params?: GetStoresParams) => {
      try {
        const fetchParams = {
          page: params?.page || currentPage,
          per_page: params?.per_page || perPage,
          search: params?.search !== undefined ? params.search : searchQuery,
        };
        await dispatch(fetchStores(fetchParams)).unwrap();
      } catch (error) {
        console.error('Failed to fetch stores:', error);
        throw error;
      }
    },
    [dispatch, currentPage, perPage, searchQuery]
  );

 

  // Auto-fetch on mount if enabled (prevent fetching when there's an error)
  useEffect(() => {
    if (autoFetch && !hasStores && !loading && !error) {
      fetchStoresCallback(initialParamsRef.current);
    }
  }, [autoFetch, hasStores, loading, error, fetchStoresCallback]);

  // Cleanup errors on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError('fetchStores'));
      }
    };
  }, [dispatch, error]);

  return useMemo(
    () => ({
      stores,
      pagination: pagination || null, // Change from undefined to null
      loading,
      error,
      refetch: fetchStoresCallback,
      // Enhanced functionality
      searchTerm,
      setSearchTerm,
      totalStores,
      hasStores,
      isEmpty,
      currentPageData,
    }),
    [
      stores,
      pagination,
      loading,
      error,
      fetchStoresCallback,
      searchTerm,
      setSearchTerm,
      totalStores,
      hasStores,
      isEmpty,
      currentPageData,
    ]
  );
};

/**
 * Enhanced single store hook with caching
 */
export const useStore = (
  storeId: string | null,
  autoFetch: boolean = true
): UseStoreReturn & {
  exists: boolean;
  isSelected: boolean;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select state from Redux store
  const store = useSelector(selectCurrentStore);
  const loading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);
  const selectedStoreId = useSelector(selectSelectedStoreId);
  
  // Also try to get from stores list if available
  const storeFromList = useSelector((state: RootState) => 
    storeId ? selectStoreById(storeId)(state) : null
  );

  // Use current store if it matches, otherwise use from list
  const currentStore = useMemo(() => {
    if (store && store.id === storeId) return store;
    if (storeFromList && storeFromList.id === storeId) return storeFromList;
    return null;
  }, [store, storeFromList, storeId]);

  // Computed values
  const exists = !!currentStore;
  const isSelected = selectedStoreId === storeId;

  // Fetch function with error handling
  const fetchStoreCallback = useCallback(
    async (targetStoreId: string) => {
      try {
        if (!targetStoreId.trim()) {
          throw new Error('Store ID is required');
        }
        await dispatch(fetchStoreById(targetStoreId)).unwrap();
      } catch (error) {
        console.error(`Failed to fetch store ${targetStoreId}:`, error);
        throw error;
      }
    },
    [dispatch]
  );

  // Auto-fetch when storeId changes (prevent fetching when there's an error)
  useEffect(() => {
    if (autoFetch && storeId && storeId !== selectedStoreId && !loading && !error) {
      fetchStoreCallback(storeId);
    }
  }, [autoFetch, storeId, selectedStoreId, loading, error, fetchStoreCallback]);

  // Clear store when storeId becomes null
  useEffect(() => {
    if (!storeId) {
      dispatch(clearCurrentStore());
    }
  }, [storeId, dispatch]);

  // Cleanup errors on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError('fetchStore'));
      }
    };
  }, [dispatch, error]);

  return useMemo(
    () => ({
      store: currentStore,
      loading,
      error,
      refetch: fetchStoreCallback,
      exists,
      isSelected,
    }),
    [currentStore, loading, error, fetchStoreCallback, exists, isSelected]
  );
};

/**
 * Enhanced store operations hook with validation and optimistic updates
 */
export const useStoreOperations = (): UseStoreOperationsReturn & {
  validateStoreData: (data: CreateStorePayload | UpdateStorePayload) => { isValid: boolean; errors: Record<string, string> };
  reset: () => void;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Loading states
  const createLoading = useSelector(selectCreateStoreLoading);
  const updateLoading = useSelector(selectUpdateStoreLoading);
  
  // Error states
  const createError = useSelector(selectCreateStoreError);
  const updateError = useSelector(selectUpdateStoreError);

  // Validation function
  const validateStoreData = useCallback((data: CreateStorePayload | UpdateStorePayload) => {
    const errors: Record<string, string> = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Store name is required';
    }
    
    if (!data.metadata?.address || data.metadata.address.trim() === '') {
      errors.address = 'Store address is required';
    }
    
    if (!data.metadata?.phone || data.metadata.phone.trim() === '') {
      errors.phone = 'Store phone is required';
    }
    
    // Validate store ID for create operations
    if ('id' in data) {
      if (!data.id || data.id.trim() === '') {
        errors.id = 'Store ID is required';
      } else if (!/^STORE_\d{3}$/.test(data.id)) {
        errors.id = 'Store ID must follow format STORE_XXX (e.g., STORE_001)';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  // Create store operation with validation and optimistic update
  const handleCreateStore = useCallback(
    async (payload: CreateStorePayload) => {
      try {
        // Client-side validation
        const validation = validateStoreData(payload);
        if (!validation.isValid) {
          const firstError = Object.values(validation.errors)[0];
          throw new Error(firstError);
        }

        // Clear any previous errors
        dispatch(clearError('createStore'));

        // Create optimistic store
        const optimisticStore: Store = {
          id: payload.id,
          name: payload.name,
          metadata: payload.metadata,
          is_active: payload.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          // Add optimistic update
          dispatch(updateStoreInList(optimisticStore));

          // Make API call
          const result = await dispatch(createStoreAction(payload)).unwrap();

          return {
            success: true,
            message: 'Store created successfully',
            store: result,
          };
        } catch (error) {
          // Remove optimistic update on error
          dispatch(removeStoreFromList(payload.id));
          throw error;
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to create store',
        };
      }
    },
    [dispatch, validateStoreData]
  );

  // Update store operation with validation and optimistic update
  const handleUpdateStore = useCallback(
    async (storeId: string, payload: UpdateStorePayload) => {
      try {
        // Client-side validation
        const validation = validateStoreData(payload);
        if (!validation.isValid) {
          const firstError = Object.values(validation.errors)[0];
          throw new Error(firstError);
        }

        // Clear any previous errors
        dispatch(clearError('updateStore'));

        const result = await dispatch(updateStoreAction({ storeId, payload })).unwrap();

        return {
          success: true,
          message: 'Store updated successfully',
          store: result,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to update store',
        };
      }
    },
    [dispatch, validateStoreData]
  );

  // Delete operation placeholder (for future implementation)
  const handleDeleteStore = useCallback(async () => {
    console.warn('Delete store operation not yet implemented');
    return {
      success: false,
      message: 'Delete operation not implemented',
    };
  }, []);

  // Reset all errors
  const reset = useCallback(() => {
    dispatch(clearError('createStore'));
    dispatch(clearError('updateStore'));
  }, [dispatch]);

  return useMemo(
    () => ({
      createStore: handleCreateStore,
      updateStore: handleUpdateStore,
      deleteStore: handleDeleteStore,
      loading: {
        create: createLoading,
        update: updateLoading,
        delete: false, // Placeholder
      },
      errors: {
        create: createError,
        update: updateError,
        delete: null, // Placeholder
      },
      validateStoreData,
      reset,
    }),
    [
      handleCreateStore,
      handleUpdateStore,
      handleDeleteStore,
      createLoading,
      updateLoading,
      createError,
      updateError,
      validateStoreData,
      reset,
    ]
  );
};

/**
 * Enhanced store users hook with proper error handling
 */
export const useStoreUsers = (
  storeId: string | null,
  autoFetch: boolean = true
): UseStoreUsersReturn & {
  hasUsers: boolean;
  userCount: number;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select state from Redux store
  const users = useSelector((state: RootState) => 
    storeId ? selectStoreUsers(storeId)(state) : []
  );
  const loading = useSelector(selectStoreUsersLoading);
  const error = useSelector(selectStoreUsersError);

  // Computed values
  const hasUsers = users.length > 0;
  const userCount = users.length;

  // Fetch function with error handling
  const fetchStoreUsersCallback = useCallback(
    async (targetStoreId: string) => {
      try {
        if (!targetStoreId.trim()) {
          throw new Error('Store ID is required');
        }
        await dispatch(fetchStoreUsers(targetStoreId)).unwrap();
      } catch (error) {
        console.error(`Failed to fetch users for store ${targetStoreId}:`, error);
        throw error;
      }
    },
    [dispatch]
  );

  // Auto-fetch when storeId changes (prevent fetching when there's an error)
  useEffect(() => {
    if (autoFetch && storeId && !hasUsers && !loading && !error) {
      fetchStoreUsersCallback(storeId);
    }
  }, [autoFetch, storeId, hasUsers, loading, error, fetchStoreUsersCallback]);

  // Cleanup errors on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError('fetchStoreUsers'));
      }
    };
  }, [dispatch, error]);

  return useMemo(
    () => ({
      users,
      loading,
      error,
      refetch: fetchStoreUsersCallback,
      hasUsers,
      userCount,
    }),
    [users, loading, error, fetchStoreUsersCallback, hasUsers, userCount]
  );
};

/**
 * Enhanced store roles hook with proper error handling
 */
export const useStoreRoles = (
  storeId: string | null,
  autoFetch: boolean = true
): UseStoreRolesReturn & {
  hasRoles: boolean;
  roleCount: number;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select state from Redux store
  const roles = useSelector((state: RootState) => 
    storeId ? selectStoreRoles(storeId)(state) : []
  );
  const loading = useSelector(selectStoreRolesLoading);
  const error = useSelector(selectStoreRolesError);

  // Computed values
  const hasRoles = roles.length > 0;
  const roleCount = roles.length;

  // Fetch function with error handling
  const fetchStoreRolesCallback = useCallback(
    async (targetStoreId: string) => {
      try {
        if (!targetStoreId.trim()) {
          throw new Error('Store ID is required');
        }
        await dispatch(fetchStoreRoles(targetStoreId)).unwrap();
      } catch (error) {
        console.error(`Failed to fetch roles for store ${targetStoreId}:`, error);
        throw error;
      }
    },
    [dispatch]
  );

  // Auto-fetch when storeId changes (prevent fetching when there's an error)
  useEffect(() => {
    if (autoFetch && storeId && !hasRoles && !loading && !error) {
      fetchStoreRolesCallback(storeId);
    }
  }, [autoFetch, storeId, hasRoles, loading, error, fetchStoreRolesCallback]);

  // Cleanup errors on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError('fetchStoreRoles'));
      }
    };
  }, [dispatch, error]);

  return useMemo(
    () => ({
      roles,
      loading,
      error,
      refetch: fetchStoreRolesCallback,
      hasRoles,
      roleCount,
    }),
    [roles, loading, error, fetchStoreRolesCallback, hasRoles, roleCount]
  );
};

// ============================================================================
// Advanced Composite Hooks
// ============================================================================

/**
 * Enhanced search hook with debouncing
 */
export const useStoreSearch = (debounceMs: number = 500) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const stores = useSelector(selectStores);
  const loading = useSelector(selectStoresLoading);
  const error = useSelector(selectStoresError);
  const pagination = useSelector(selectStoresPagination);

  // Search function with error handling
  const searchStores = useCallback(
    async (searchTerm: string) => {
      try {
        await dispatch(searchStoresAction({ query: searchTerm, page: 1 })).unwrap();
      } catch (error) {
        console.error('Failed to search stores:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Debounced search
  const debouncedSearch = useMemo(() => {
    return debounce(searchStores, debounceMs);
  }, [searchStores, debounceMs]);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch(setSearchQuery(''));
    dispatch(fetchStores());
  }, [dispatch]);

  return useMemo(
    () => ({
      stores,
      pagination,
      loading,
      error,
      searchStores: debouncedSearch,
      clearSearch,
    }),
    [stores, pagination, loading, error, debouncedSearch, clearSearch]
  );
};

/**
 * Individual store hook with formatting (similar to your reference)
 */
export const useStoreDetails = (storeId: string | undefined) => {
  const store = useSelector((state: RootState) => 
    storeId ? selectStoreById(storeId)(state) : undefined
  );
  
  const loading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);

  // Formatted data
  const formattedData = useMemo(() => {
    if (!store) return null;
    
    return {
      displayName: store.name,
      address: store.metadata.address,
      phone: store.metadata.phone,
      status: store.is_active ? 'Active' : 'Inactive',
      createdAt: new Date(store.created_at).toLocaleDateString(),
      updatedAt: new Date(store.updated_at).toLocaleDateString(),
      relativeTime: getRelativeTime(store.created_at),
    };
  }, [store]);

  return useMemo(
    () => ({
      store,
      formattedData,
      loading,
      error,
      exists: !!store,
    }),
    [store, formattedData, loading, error]
  );
};

/**
 * Lifecycle management hook
 */
export const useStoresLifecycle = () => {
  const dispatch = useDispatch<AppDispatch>();

  const resetState = useCallback(() => {
    // Reset all store-related state
    dispatch(clearCurrentStore());
    dispatch(clearStoreUsers());
    dispatch(clearStoreRoles());
    dispatch(resetPagination());
    dispatch(setSearchQuery(''));
    dispatch(setSelectedStoreId(null));
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return useMemo(
    () => ({
      resetState,
      clearAllErrors,
    }),
    [resetState, clearAllErrors]
  );
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get relative time string
 */
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};
