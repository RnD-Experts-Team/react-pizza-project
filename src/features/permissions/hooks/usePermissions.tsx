/**
 * Permissions Custom Hooks - Updated with utilities integration
 * 
 * These hooks encapsulate all business logic, validation, and data transformation
 * using the utility functions. Components should only interact with these hooks
 * and not directly with utilities, API services, or Redux actions.
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPermissions,
  createPermission as createPermissionAction,
  searchPermissions as searchPermissionsAction,
  clearErrors,
  clearFetchError,
  clearCreateError,
  resetPermissionsState,
  addPermissionOptimistic,
  removePermissionOptimistic,
  selectPermissions,
  selectPermissionsLoading,
  selectPermissionsError,
  selectPermissionsPagination,
  selectCreatePermissionLoading,
  selectCreatePermissionError,
  selectHasPermissions,
  selectIsEmpty,
  selectTotalPermissions,
  selectPermissionById,
} from '../store/permissionsSlice';
import type { 
  Permission,
  CreatePermissionRequest,
  GetPermissionsParams,
  UsePermissionsReturn,
  UseCreatePermissionReturn,
  PermissionFormData,
  PermissionSortField,
  SortDirection
} from '../types';
import { 
  permissionValidation,
  permissionFormatting,
  permissionSorting,
  permissionFiltering,
  permissionTransformers,
  debounce,
  PERMISSION_CONSTANTS
} from '../utils';
import type { AppDispatch, RootState } from '../../../store';

/**
 * Enhanced permissions hook with sorting, filtering, and formatting
 */
export const usePermissions = (
  autoFetch: boolean = true,
  initialParams?: GetPermissionsParams
): UsePermissionsReturn & {
  // Additional functionality using utilities
  sortedPermissions: Permission[];
  setSortField: (field: PermissionSortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  sortField: PermissionSortField;
  sortDirection: SortDirection;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredPermissions: Permission[];
  selectOptions: Array<{ value: number; label: string; permission: Permission }>;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for sorting and filtering
  const [sortField, setSortField] = useState<PermissionSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Select state from Redux store
  const permissions = useSelector(selectPermissions);
  const loading = useSelector(selectPermissionsLoading);
  const error = useSelector(selectPermissionsError);
  const pagination = useSelector(selectPermissionsPagination);
  const hasPermissions = useSelector(selectHasPermissions);
  const isEmpty = useSelector(selectIsEmpty);
  const totalPermissions = useSelector(selectTotalPermissions);

  // Apply client-side sorting and filtering using utilities
  const sortedPermissions = useMemo(() => {
    let result = [...permissions];
    
    switch (sortField) {
      case 'name':
        result = permissionSorting.sortByName(result, sortDirection);
        break;
      case 'created_at':
        result = permissionSorting.sortByCreatedAt(result, sortDirection);
        break;
      default:
        result = permissionSorting.sortByName(result, sortDirection);
    }
    
    return result;
  }, [permissions, sortField, sortDirection]);

  // Apply search filtering
  const filteredPermissions = useMemo(() => {
    return permissionFiltering.filterBySearch(sortedPermissions, searchTerm);
  }, [sortedPermissions, searchTerm]);

  // Transform to select options
  const selectOptions = useMemo(() => {
    return permissionTransformers.toSelectOptions(filteredPermissions);
  }, [filteredPermissions]);

  // Stable reference for initial params to prevent unnecessary re-renders
  const initialParamsRef = useRef(initialParams);
  initialParamsRef.current = initialParams;

  // Fetch function with error handling
  const fetchPermissionsCallback = useCallback(
    async (params?: GetPermissionsParams) => {
      try {
        await dispatch(fetchPermissions(params)).unwrap();
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Refetch with current parameters
  const refetch = useCallback(async () => {
    await fetchPermissionsCallback(initialParamsRef.current);
  }, [fetchPermissionsCallback]);

  // Auto-fetch on mount if enabled - prevent fetching when there's an error
  useEffect(() => {
    if (autoFetch && !hasPermissions && !loading && !error) {
      fetchPermissionsCallback(initialParamsRef.current);
    }
  }, [autoFetch, hasPermissions, loading, error, fetchPermissionsCallback]);

  // Cleanup errors on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearFetchError());
      }
    };
  }, [dispatch, error]);

  return useMemo(
    () => ({
      permissions,
      loading,
      error,
      pagination,
      hasPermissions,
      isEmpty,
      totalPermissions,
      fetchPermissions: fetchPermissionsCallback,
      refetch,
      // Enhanced functionality
      sortedPermissions,
      setSortField,
      setSortDirection,
      sortField,
      sortDirection,
      searchTerm,
      setSearchTerm,
      filteredPermissions,
      selectOptions,
    }),
    [
      permissions,
      loading,
      error,
      pagination,
      hasPermissions,
      isEmpty,
      totalPermissions,
      fetchPermissionsCallback,
      refetch,
      sortedPermissions,
      setSortField,
      setSortDirection,
      sortField,
      sortDirection,
      searchTerm,
      setSearchTerm,
      filteredPermissions,
      selectOptions,
    ]
  );
};

/**
 * Enhanced create permission hook with validation
 */
export const useCreatePermission = (): UseCreatePermissionReturn & {
  validateForm: (data: PermissionFormData) => { isValid: boolean; errors: Record<string, string> };
  formatForApi: (data: PermissionFormData) => CreatePermissionRequest;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectCreatePermissionLoading);
  const error = useSelector(selectCreatePermissionError);

  // Validation using utilities
  const validateForm = useCallback((data: PermissionFormData) => {
    return permissionValidation.validatePermissionForm(data);
  }, []);

  // Format data for API using utilities
  const formatForApi = useCallback((data: PermissionFormData): CreatePermissionRequest => {
    return {
      name: permissionFormatting.formatApiName(data.name),
      guard_name: data.guard_name,
    };
  }, []);

  // Create permission with validation and formatting
  const createPermission = useCallback(
    async (data: CreatePermissionRequest): Promise<Permission> => {
      // Client-side validation before API call
      const formData: PermissionFormData = {
        name: data.name,
        guard_name: data.guard_name,
      };
      
      const validation = validateForm(formData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        throw new Error(firstError);
      }

      // Format data for API
      const apiData = formatForApi(formData);

      // Generate temporary ID for optimistic update
      const tempId = Date.now();
      const optimisticPermission: Permission = {
        id: tempId,
        name: apiData.name,
        guard_name: apiData.guard_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: [],
      };

      try {
        // Add optimistic permission
        dispatch(addPermissionOptimistic(optimisticPermission));

        // Make API call
        const newPermission = await dispatch(createPermissionAction(apiData)).unwrap();

        // Remove optimistic permission
        dispatch(removePermissionOptimistic(tempId));

        return newPermission;
      } catch (error) {
        // Remove optimistic permission on error
        dispatch(removePermissionOptimistic(tempId));
        throw error;
      }
    },
    [dispatch, validateForm, formatForApi]
  );

  // Reset error state
  const reset = useCallback(() => {
    dispatch(clearCreateError());
  }, [dispatch]);

  return useMemo(
    () => ({
      createPermission,
      loading,
      error,
      reset,
      validateForm,
      formatForApi,
    }),
    [createPermission, loading, error, reset, validateForm, formatForApi]
  );
};

/**
 * Enhanced search hook with debouncing and formatting
 */
export const usePermissionSearch = (
  debounceMs: number = PERMISSION_CONSTANTS.SEARCH_DEBOUNCE_MS
) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const permissions = useSelector(selectPermissions);
  const loading = useSelector(selectPermissionsLoading);
  const error = useSelector(selectPermissionsError);

  // Search with utilities
  const searchPermissions = useCallback(
    async (searchTerm: string) => {
      try {
        await dispatch(searchPermissionsAction(searchTerm)).unwrap();
      } catch (error) {
        console.error('Failed to search permissions:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Debounced search using utility
  const debouncedSearch = useMemo(() => {
    return debounce(searchPermissions, debounceMs);
  }, [searchPermissions, debounceMs]);

  // Transform search results using utilities
  const searchResults = useMemo(() => {
    return permissions.map(permissionTransformers.toSearchResult);
  }, [permissions]);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  return useMemo(
    () => ({
      permissions,
      searchResults,
      loading,
      error,
      searchPermissions: debouncedSearch,
      clearSearch,
    }),
    [permissions, searchResults, loading, error, debouncedSearch, clearSearch]
  );
};

/**
 * Enhanced individual permission hook with formatting
 */
export const usePermission = (id: number | undefined) => {
  const permission = useSelector((state: RootState) => 
    id ? selectPermissionById(state, id) : undefined
  );
  
  const loading = useSelector(selectPermissionsLoading);
  const error = useSelector(selectPermissionsError);

  // Formatted data using utilities
  const formattedData = useMemo(() => {
    if (!permission) return null;
    
    return {
      displayName: permissionFormatting.formatDisplayName(permission.name),
      createdAt: permissionFormatting.formatCreatedAt(permission.created_at),
      updatedAt: permissionFormatting.formatCreatedAt(permission.updated_at),
      relativeTime: permissionFormatting.formatRelativeTime(permission.created_at),
      roleCount: permission.roles?.length || 0,
    };
  }, [permission]);

  return useMemo(
    () => ({
      permission,
      formattedData,
      loading,
      error,
      exists: !!permission,
    }),
    [permission, formattedData, loading, error]
  );
};

/**
 * Lifecycle management hook
 */
export const usePermissionsLifecycle = () => {
  const dispatch = useDispatch<AppDispatch>();

  const resetState = useCallback(() => {
    dispatch(resetPermissionsState());
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
