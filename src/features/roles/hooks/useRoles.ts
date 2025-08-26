/**
 * Roles Custom Hooks
 * 
 * This file contains custom React hooks that encapsulate business logic and state management
 * for roles. These hooks provide a clean API for components to interact with the roles domain,
 * abstracting away Redux complexity and providing consistent patterns across the application.
 * All utility functions are integrated for complete business logic encapsulation.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRoles,
  createRole as createRoleAction,
  assignPermissionsToRole as assignPermissionsAction,
  searchRoles as searchRolesAction,
  fetchRoleById,
  clearErrors,
  clearFetchError,
  clearCreateError,
  clearAssignError,
  resetRolesState,
  addRoleOptimistic,
  removeRoleOptimistic,
  setSelectedRoleId,
  selectRoles,
  selectRolesLoading,
  selectRolesError,
  selectRolesPagination,
  selectCreateRoleLoading,
  selectCreateRoleError,
  selectAssignLoading,
  selectAssignError,
  selectSelectedRoleId,
  selectHasRoles,
  selectIsEmpty,
  selectTotalRoles,
  selectRoleById,
  selectRolesWithPermissionCount,
} from '../store/rolesSlice';
import type { 
  Role,
  CreateRoleRequest,
  GetRolesParams,
  UseRolesReturn,
  UseCreateRoleReturn,
  UseAssignPermissionsReturn,
  RoleFormData,
  RoleSortField,
  SortDirection
} from '../types';
import { 
  roleValidation,
  roleFormatting,
  roleSorting,
  roleFiltering,
  roleTransformers,
  debounce,
  ROLE_CONSTANTS
} from '../utils';
import type { AppDispatch, RootState } from '../../../store';

/**
 * Enhanced roles hook with sorting, filtering, and formatting
 */
export const useRoles = (
  autoFetch: boolean = true,
  initialParams?: GetRolesParams
): UseRolesReturn & {
  // Additional functionality using utilities
  sortedRoles: Role[];
  setSortField: (field: RoleSortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  sortField: RoleSortField;
  sortDirection: SortDirection;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredRoles: Role[];
  selectOptions: Array<{ value: number; label: string; role: Role }>;
  rolesWithCounts: Array<Role & { permission_count: number }>;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for sorting and filtering
  const [sortField, setSortField] = useState<RoleSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Select state from Redux store
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);
  const pagination = useSelector(selectRolesPagination);
  const hasRoles = useSelector(selectHasRoles);
  const isEmpty = useSelector(selectIsEmpty);
  const totalRoles = useSelector(selectTotalRoles);
  const rolesWithCounts = useSelector(selectRolesWithPermissionCount);

  // Apply client-side sorting using utilities
  const sortedRoles = useMemo(() => {
    let result = [...roles];
    
    switch (sortField) {
      case 'name':
        result = roleSorting.sortByName(result, sortDirection);
        break;
      case 'created_at':
        result = roleSorting.sortByCreatedAt(result, sortDirection);
        break;
      case 'permission_count':
        result = roleSorting.sortByPermissionCount(result, sortDirection);
        break;
      default:
        result = roleSorting.sortByName(result, sortDirection);
    }
    
    return result;
  }, [roles, sortField, sortDirection]);

  // Apply search filtering
  const filteredRoles = useMemo(() => {
    return roleFiltering.filterBySearch(sortedRoles, searchTerm);
  }, [sortedRoles, searchTerm]);

  // Transform to select options
  const selectOptions = useMemo(() => {
    return roleTransformers.toSelectOptions(filteredRoles);
  }, [filteredRoles]);

  // Fetch function with error handling
  const fetchRolesCallback = useCallback(
    async (params?: GetRolesParams) => {
      try {
        await dispatch(fetchRoles(params)).unwrap();
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Refetch with current parameters
  const refetch = useCallback(async () => {
    await fetchRolesCallback(initialParams);
  }, [fetchRolesCallback, initialParams]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && !hasRoles && !loading) {
      fetchRolesCallback(initialParams);
    }
  }, [autoFetch, hasRoles, loading, fetchRolesCallback, initialParams]);

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
      roles,
      loading,
      error,
      pagination,
      hasRoles,
      isEmpty,
      totalRoles,
      fetchRoles: fetchRolesCallback,
      refetch,
      // Enhanced functionality
      sortedRoles,
      setSortField,
      setSortDirection,
      sortField,
      sortDirection,
      searchTerm,
      setSearchTerm,
      filteredRoles,
      selectOptions,
      rolesWithCounts,
    }),
    [
      roles,
      loading,
      error,
      pagination,
      hasRoles,
      isEmpty,
      totalRoles,
      fetchRolesCallback,
      refetch,
      sortedRoles,
      setSortField,
      setSortDirection,
      sortField,
      sortDirection,
      searchTerm,
      setSearchTerm,
      filteredRoles,
      selectOptions,
      rolesWithCounts,
    ]
  );
};

/**
 * Enhanced create role hook with validation
 */
export const useCreateRole = (): UseCreateRoleReturn & {
  validateForm: (data: RoleFormData) => { isValid: boolean; errors: Record<string, string> };
  formatForApi: (data: RoleFormData) => CreateRoleRequest;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectCreateRoleLoading);
  const error = useSelector(selectCreateRoleError);

  // Validation using utilities
  const validateForm = useCallback((data: RoleFormData) => {
    return roleValidation.validateRoleForm(data);
  }, []);

  // Format data for API using utilities
  const formatForApi = useCallback((data: RoleFormData): CreateRoleRequest => {
    return {
      name: roleFormatting.formatApiName(data.name),
      guard_name: data.guard_name,
      permissions: data.permissions,
    };
  }, []);

  // Create role with validation and formatting
  const createRole = useCallback(
    async (data: CreateRoleRequest): Promise<Role> => {
      // Client-side validation before API call
      const formData: RoleFormData = {
        name: data.name,
        guard_name: data.guard_name,
        permissions: data.permissions,
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
      const optimisticRole: Role = {
        id: tempId,
        name: apiData.name,
        guard_name: apiData.guard_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        permissions: [],
      };

      try {
        // Add optimistic role
        dispatch(addRoleOptimistic(optimisticRole));

        // Make API call
        const newRole = await dispatch(createRoleAction(apiData)).unwrap();

        // Remove optimistic role
        dispatch(removeRoleOptimistic(tempId));

        return newRole;
      } catch (error) {
        // Remove optimistic role on error
        dispatch(removeRoleOptimistic(tempId));
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
      createRole,
      loading,
      error,
      reset,
      validateForm,
      formatForApi,
    }),
    [createRole, loading, error, reset, validateForm, formatForApi]
  );
};

/**
 * Enhanced assign permissions hook with validation
 */
export const useAssignPermissions = (): UseAssignPermissionsReturn & {
  validatePermissions: (permissions: string[]) => { isValid: boolean; error?: string };
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectAssignLoading);
  const error = useSelector(selectAssignError);

  // Validation using utilities
  const validatePermissions = useCallback((permissions: string[]) => {
    return roleValidation.validatePermissions(permissions);
  }, []);

  // Assign permissions with validation
  const assignPermissions = useCallback(
    async (roleId: number, permissions: string[]): Promise<Role> => {
      // Client-side validation
      const validation = validatePermissions(permissions);
      if (!validation.isValid && validation.error) {
        throw new Error(validation.error);
      }

      try {
        return await dispatch(assignPermissionsAction({ roleId, permissions })).unwrap();
      } catch (error) {
        console.error('Failed to assign permissions:', error);
        throw error;
      }
    },
    [dispatch, validatePermissions]
  );

  // Reset error state
  const reset = useCallback(() => {
    dispatch(clearAssignError());
  }, [dispatch]);

  return useMemo(
    () => ({
      assignPermissions,
      loading,
      error,
      reset,
      validatePermissions,
    }),
    [assignPermissions, loading, error, reset, validatePermissions]
  );
};

/**
 * Enhanced search hook with debouncing and formatting
 */
export const useRoleSearch = (
  debounceMs: number = ROLE_CONSTANTS.SEARCH_DEBOUNCE_MS
) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);

  // Search with utilities
  const searchRoles = useCallback(
    async (searchTerm: string) => {
      try {
        await dispatch(searchRolesAction(searchTerm)).unwrap();
      } catch (error) {
        console.error('Failed to search roles:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Debounced search using utility
  const debouncedSearch = useMemo(() => {
    return debounce(searchRoles, debounceMs);
  }, [searchRoles, debounceMs]);

  // Transform search results using utilities
  const searchResults = useMemo(() => {
    return roles.map(roleTransformers.toSearchResult);
  }, [roles]);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  return useMemo(
    () => ({
      roles,
      searchResults,
      loading,
      error,
      searchRoles: debouncedSearch,
      clearSearch,
    }),
    [roles, searchResults, loading, error, debouncedSearch, clearSearch]
  );
};

/**
 * Enhanced individual role hook with formatting
 */
export const useRole = (id: number | undefined) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const role = useSelector((state: RootState) => 
    id ? selectRoleById(state, id) : undefined
  );
  
  const loading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);

  // Fetch role by ID if not in state
  useEffect(() => {
    if (id && !role && !loading) {
      dispatch(fetchRoleById(id));
    }
  }, [id, role, loading, dispatch]);

  // Formatted data using utilities
  const formattedData = useMemo(() => {
    if (!role) return null;
    
    return {
      displayName: roleFormatting.formatDisplayName(role.name),
      createdAt: roleFormatting.formatCreatedAt(role.created_at),
      updatedAt: roleFormatting.formatCreatedAt(role.updated_at),
      relativeTime: roleFormatting.formatRelativeTime(role.created_at),
      permissionCount: role.permissions?.length || 0,
      permissionNames: role.permissions?.map(p => p.name).join(', ') || 'No permissions',
    };
  }, [role]);

  return useMemo(
    () => ({
      role,
      formattedData,
      loading,
      error,
      exists: !!role,
    }),
    [role, formattedData, loading, error]
  );
};

/**
 * Role selection hook for UI management
 */
export const useRoleSelection = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const selectedRoleId = useSelector(selectSelectedRoleId);
  const selectedRole = useSelector((state: RootState) => 
    selectedRoleId ? selectRoleById(state, selectedRoleId) : null
  );

  const selectRole = useCallback((roleId: number | null) => {
    dispatch(setSelectedRoleId(roleId));
  }, [dispatch]);

  const clearSelection = useCallback(() => {
    dispatch(setSelectedRoleId(null));
  }, [dispatch]);

  return useMemo(
    () => ({
      selectedRoleId,
      selectedRole,
      selectRole,
      clearSelection,
    }),
    [selectedRoleId, selectedRole, selectRole, clearSelection]
  );
};

/**
 * Role options hook for select components
 */
export const useRoleOptions = (autoFetch: boolean = true) => {
  const { roles, loading, error, fetchRoles } = useRoles(autoFetch);

  // Transform roles to select options
  const options = useMemo(
    () => roleTransformers.toSelectOptions(roles),
    [roles]
  );

  return useMemo(
    () => ({
      options,
      loading,
      error,
      refresh: fetchRoles,
    }),
    [options, loading, error, fetchRoles]
  );
};

/**
 * Lifecycle management hook
 */
export const useRolesLifecycle = () => {
  const dispatch = useDispatch<AppDispatch>();

  const resetState = useCallback(() => {
    dispatch(resetRolesState());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const clearFetchErrorOnly = useCallback(() => {
    dispatch(clearFetchError());
  }, [dispatch]);

  const clearCreateErrorOnly = useCallback(() => {
    dispatch(clearCreateError());
  }, [dispatch]);

  const clearAssignErrorOnly = useCallback(() => {
    dispatch(clearAssignError());
  }, [dispatch]);

  return useMemo(
    () => ({
      resetState,
      clearAllErrors,
      clearFetchError: clearFetchErrorOnly,
      clearCreateError: clearCreateErrorOnly,
      clearAssignError: clearAssignErrorOnly,
    }),
    [resetState, clearAllErrors, clearFetchErrorOnly, clearCreateErrorOnly, clearAssignErrorOnly]
  );
};

/**
 * Composite hook that combines multiple role operations
 */
export const useRolesComplete = (
  initialParams?: GetRolesParams
) => {
  const roles = useRoles(true, initialParams);
  const createRole = useCreateRole();
  const assignPermissions = useAssignPermissions();
  const search = useRoleSearch();
  const selection = useRoleSelection();
  const lifecycle = useRolesLifecycle();

  return useMemo(
    () => ({
      ...roles,
      ...createRole,
      assignPermissions,
      search,
      selection,
      lifecycle,
    }),
    [roles, createRole, assignPermissions, search, selection, lifecycle]
  );
};

// Export individual hook utilities for flexibility
export * from '../store/rolesSlice';
