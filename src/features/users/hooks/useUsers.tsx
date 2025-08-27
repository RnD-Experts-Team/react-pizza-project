/**
 * Users Custom Hooks
 * 
 * This file contains custom React hooks that encapsulate business logic and state management
 * for users. These hooks provide a clean API for components to interact with the users domain,
 * abstracting away Redux complexity and providing consistent patterns across the application.
 * All utility functions are integrated for complete business logic encapsulation.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers,
  createUser as createUserAction,
  updateUser as updateUserAction,
  deleteUser as deleteUserAction,
  assignRolesToUser as assignRolesAction,
  givePermissionsToUser as givePermissionsAction,
  searchUsers as searchUsersAction,
  fetchUserById,
  clearErrors,
  clearFetchError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearAssignRolesError,
  clearGivePermissionsError,
  resetUsersState,
  setSelectedUserId,
  setSearchTerm,
  setFilters,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPagination,
  selectCreateUserLoading,
  selectCreateUserError,
  selectUpdateUserLoading,
  selectUpdateUserError,
  selectDeleteUserLoading,
  selectDeleteUserError,
  selectAssignRolesLoading,
  selectAssignRolesError,
  selectGivePermissionsLoading,
  selectGivePermissionsError,
  selectSelectedUserId,
  selectSearchTerm,
  selectFilters,
  selectHasUsers,
  selectIsEmpty,
  selectTotalUsers,
  selectUserById,
  selectUsersWithCounts,
} from '../store/usersSlice';
import type { 
  User,
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersParams,
  UseUsersReturn,
  UseCreateUserReturn,
  UseUpdateUserReturn,
  UseDeleteUserReturn,
  UseAssignRolesReturn,
  UseGivePermissionsReturn,
  UserFormData,
  UserSortField,
  SortDirection,
  UserFilters
} from '../types';
import { 
  userValidation,
  userFormatting,
  userSorting,
  userFiltering,
  userTransformers,
  debounce,
  calculateUserStats,
  USER_CONSTANTS
} from '../utils';
import type { AppDispatch, RootState } from '../../../store';

/**
 * Enhanced users hook with sorting, filtering, and formatting
 */
export const useUsers = (
  autoFetch: boolean = true,
  initialParams?: GetUsersParams
): UseUsersReturn & {
  // Additional functionality using utilities
  sortedUsers: User[];
  setSortField: (field: UserSortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  sortField: UserSortField;
  sortDirection: SortDirection;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUsers: User[];
  selectOptions: Array<{ value: number; label: string; user: User }>;
  usersWithCounts: Array<User & { role_count: number; permission_count: number; store_count: number }>;
  userStats: ReturnType<typeof calculateUserStats>;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for sorting and filtering
  const [sortField, setSortField] = useState<UserSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const localSearchTerm = useSelector(selectSearchTerm);
  
  // Select state from Redux store
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectUsersPagination);
  const hasUsers = useSelector(selectHasUsers);
  const isEmpty = useSelector(selectIsEmpty);
  const totalUsers = useSelector(selectTotalUsers);
  const usersWithCounts = useSelector(selectUsersWithCounts);
  const filters = useSelector(selectFilters);

  // Apply client-side sorting using utilities
  const sortedUsers = useMemo(() => {
    let result = [...users];
    
    switch (sortField) {
      case 'name':
        result = userSorting.sortByName(result, sortDirection);
        break;
      case 'email':
        result = userSorting.sortByEmail(result, sortDirection);
        break;
      case 'created_at':
        result = userSorting.sortByCreatedAt(result, sortDirection);
        break;
      case 'role_count':
        result = userSorting.sortByRoleCount(result, sortDirection);
        break;
      case 'permission_count':
        result = userSorting.sortByPermissionCount(result, sortDirection);
        break;
      default:
        result = userSorting.sortByName(result, sortDirection);
    }
    
    return result;
  }, [users, sortField, sortDirection]);

  // Apply comprehensive filtering
  const filteredUsers = useMemo(() => {
    let result = sortedUsers;
    
    // Apply search filter
    if (localSearchTerm) {
      result = userFiltering.filterBySearch(result, localSearchTerm);
    }
    
    // Apply verification filter
    if (filters.emailVerified !== undefined) {
      result = userFiltering.filterByVerificationStatus(result, filters.emailVerified);
    }
    
    // Apply roles filter
    if (filters.roleNames && filters.roleNames.length > 0) {
      result = userFiltering.filterByRoles(result, filters.roleNames);
    }
    
    // Apply permissions filter
    if (filters.permissionNames && filters.permissionNames.length > 0) {
      result = userFiltering.filterByPermissions(result, filters.permissionNames);
    }
    
    // Apply store filter
    if (filters.storeIds && filters.storeIds.length > 0) {
      result = userFiltering.filterByStores(result, filters.storeIds);
    }
    
    // Apply has roles filter
    if (filters.hasRoles === true) {
      result = userFiltering.filterWithRoles(result);
    } else if (filters.hasRoles === false) {
      result = result.filter(user => !user.roles || user.roles.length === 0);
    }
    
    // Apply has permissions filter
    if (filters.hasPermissions === true) {
      result = userFiltering.filterWithPermissions(result);
    } else if (filters.hasPermissions === false) {
      result = result.filter(user => 
        (!user.permissions || user.permissions.length === 0) &&
        (!user.roles || !user.roles.some(role => 
          role.permissions && role.permissions.length > 0
        ))
      );
    }
    
    return result;
  }, [sortedUsers, localSearchTerm, filters]);

  // Transform to select options
  const selectOptions = useMemo(() => {
    return userTransformers.toSelectOptions(filteredUsers);
  }, [filteredUsers]);

  // Calculate statistics
  const userStats = useMemo(() => {
    return calculateUserStats(users);
  }, [users]);

  // Fetch function with error handling
  const fetchUsersCallback = useCallback(
    async (params?: GetUsersParams) => {
      try {
        await dispatch(fetchUsers(params)).unwrap();
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Refetch with current parameters
  const refetch = useCallback(async () => {
    await fetchUsersCallback(initialParams);
  }, [fetchUsersCallback, initialParams]);

  // Set search term with Redux dispatch
  const setSearchTermCallback = useCallback((term: string) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && !hasUsers && !loading) {
      fetchUsersCallback(initialParams);
    }
  }, [autoFetch, hasUsers, loading, fetchUsersCallback, initialParams]);

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
      users,
      loading,
      error,
      pagination,
      hasUsers,
      isEmpty,
      totalUsers,
      fetchUsers: fetchUsersCallback,
      refetch,
      // Enhanced functionality
      sortedUsers,
      setSortField,
      setSortDirection,
      sortField,
      sortDirection,
      searchTerm: localSearchTerm,
      setSearchTerm: setSearchTermCallback,
      filteredUsers,
      selectOptions,
      usersWithCounts,
      userStats,
    }),
    [
      users,
      loading,
      error,
      pagination,
      hasUsers,
      isEmpty,
      totalUsers,
      fetchUsersCallback,
      refetch,
      sortedUsers,
      setSortField,
      setSortDirection,
      sortField,
      sortDirection,
      localSearchTerm,
      setSearchTermCallback,
      filteredUsers,
      selectOptions,
      usersWithCounts,
      userStats,
    ]
  );
};

/**
 * Enhanced create user hook with validation
 */
export const useCreateUser = (): UseCreateUserReturn & {
  validateForm: (data: UserFormData) => { isValid: boolean; errors: Record<string, string> };
  formatForApi: (data: UserFormData) => CreateUserRequest;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectCreateUserLoading);
  const error = useSelector(selectCreateUserError);

  // Validation using utilities
  const validateForm = useCallback((data: UserFormData) => {
    return userValidation.validateUserForm(data, false);
  }, []);

  // Format data for API using utilities
  const formatForApi = useCallback((data: UserFormData): CreateUserRequest => {
    return {
      name: userFormatting.formatDisplayName(data.name),
      email: userFormatting.formatEmail(data.email),
      password: data.password!,
      password_confirmation: data.password_confirmation!,
      roles: data.roles,
      permissions: data.permissions,
    };
  }, []);

  // Create user with validation and formatting
  const createUser = useCallback(
    async (data: CreateUserRequest): Promise<User> => {
      // Client-side validation before API call
      const formData: UserFormData = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        roles: data.roles,
        permissions: data.permissions,
      };
      
      const validation = validateForm(formData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        throw new Error(firstError);
      }

      // Format data for API
      const apiData = formatForApi(formData);

      try {
        return await dispatch(createUserAction(apiData)).unwrap();
      } catch (error) {
        console.error('Failed to create user:', error);
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
      createUser,
      loading,
      error,
      reset,
      validateForm,
      formatForApi,
    }),
    [createUser, loading, error, reset, validateForm, formatForApi]
  );
};

/**
 * Enhanced update user hook with validation
 */
export const useUpdateUser = (): UseUpdateUserReturn & {
  validateForm: (data: UserFormData) => { isValid: boolean; errors: Record<string, string> };
  formatForApi: (data: UserFormData) => UpdateUserRequest;
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectUpdateUserLoading);
  const error = useSelector(selectUpdateUserError);

  // Validation using utilities (edit mode)
  const validateForm = useCallback((data: UserFormData) => {
    return userValidation.validateUserForm(data, true);
  }, []);

  // Format data for API using utilities
  const formatForApi = useCallback((data: UserFormData): UpdateUserRequest => {
    const apiData: UpdateUserRequest = {
      name: userFormatting.formatDisplayName(data.name),
      email: userFormatting.formatEmail(data.email),
      roles: data.roles,
      permissions: data.permissions,
    };

    // Only include password if provided
    if (data.password) {
      apiData.password = data.password;
      apiData.password_confirmation = data.password_confirmation;
    }

    return apiData;
  }, []);

  // Update user with validation and formatting
  const updateUser = useCallback(
    async (userId: number, data: UpdateUserRequest): Promise<User> => {
      // Client-side validation before API call
      const formData: UserFormData = {
        name: data.name || '',
        email: data.email || '',
        password: data.password,
        password_confirmation: data.password_confirmation,
        roles: data.roles || [],
        permissions: data.permissions || [],
      };
      
      const validation = validateForm(formData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        throw new Error(firstError);
      }

      try {
        return await dispatch(updateUserAction({ userId, data })).unwrap();
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    },
    [dispatch, validateForm]
  );

  // Reset error state
  const reset = useCallback(() => {
    dispatch(clearUpdateError());
  }, [dispatch]);

  return useMemo(
    () => ({
      updateUser,
      loading,
      error,
      reset,
      validateForm,
      formatForApi,
    }),
    [updateUser, loading, error, reset, validateForm, formatForApi]
  );
};

/**
 * Delete user hook
 */
export const useDeleteUser = (): UseDeleteUserReturn => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectDeleteUserLoading);
  const error = useSelector(selectDeleteUserError);

  // Delete user
  const deleteUser = useCallback(
    async (userId: number): Promise<void> => {
      try {
        await dispatch(deleteUserAction(userId)).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Reset error state
  const reset = useCallback(() => {
    dispatch(clearDeleteError());
  }, [dispatch]);

  return useMemo(
    () => ({
      deleteUser,
      loading,
      error,
      reset,
    }),
    [deleteUser, loading, error, reset]
  );
};

/**
 * Enhanced assign roles hook with validation
 */
export const useAssignRoles = (): UseAssignRolesReturn & {
  validateRoles: (roles: string[]) => { isValid: boolean; error?: string };
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectAssignRolesLoading);
  const error = useSelector(selectAssignRolesError);

  // Validation using utilities
  const validateRoles = useCallback((roles: string[]) => {
    return userValidation.validateRoles(roles);
  }, []);

  // Assign roles with validation
  const assignRoles = useCallback(
    async (userId: number, roles: string[]): Promise<User> => {
      // Client-side validation
      const validation = validateRoles(roles);
      if (!validation.isValid && validation.error) {
        throw new Error(validation.error);
      }

      try {
        return await dispatch(assignRolesAction({ userId, roles })).unwrap();
      } catch (error) {
        console.error('Failed to assign roles:', error);
        throw error;
      }
    },
    [dispatch, validateRoles]
  );

  // Reset error state
  const reset = useCallback(() => {
    dispatch(clearAssignRolesError());
  }, [dispatch]);

  return useMemo(
    () => ({
      assignRoles,
      loading,
      error,
      reset,
      validateRoles,
    }),
    [assignRoles, loading, error, reset, validateRoles]
  );
};

/**
 * Enhanced give permissions hook with validation
 */
export const useGivePermissions = (): UseGivePermissionsReturn & {
  validatePermissions: (permissions: string[]) => { isValid: boolean; error?: string };
} => {
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector(selectGivePermissionsLoading);
  const error = useSelector(selectGivePermissionsError);

  // Validation using utilities
  const validatePermissions = useCallback((permissions: string[]) => {
    return userValidation.validatePermissions(permissions);
  }, []);

  // Give permissions with validation
  const givePermissions = useCallback(
    async (userId: number, permissions: string[]): Promise<User> => {
      // Client-side validation
      const validation = validatePermissions(permissions);
      if (!validation.isValid && validation.error) {
        throw new Error(validation.error);
      }

      try {
        return await dispatch(givePermissionsAction({ userId, permissions })).unwrap();
      } catch (error) {
        console.error('Failed to give permissions:', error);
        throw error;
      }
    },
    [dispatch, validatePermissions]
  );

  // Reset error state
  const reset = useCallback(() => {
    dispatch(clearGivePermissionsError());
  }, [dispatch]);

  return useMemo(
    () => ({
      givePermissions,
      loading,
      error,
      reset,
      validatePermissions,
    }),
    [givePermissions, loading, error, reset, validatePermissions]
  );
};

/**
 * Enhanced search hook with debouncing and formatting
 */
export const useUserSearch = (
  debounceMs: number = USER_CONSTANTS.SEARCH_DEBOUNCE_MS
) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  // Search with utilities
  const searchUsers = useCallback(
    async (searchTerm: string) => {
      try {
        await dispatch(searchUsersAction(searchTerm)).unwrap();
      } catch (error) {
        console.error('Failed to search users:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Debounced search using utility
  const debouncedSearch = useMemo(() => {
    return debounce(searchUsers, debounceMs);
  }, [searchUsers, debounceMs]);

  // Transform search results using utilities
  const searchResults = useMemo(() => {
    return users.map(userTransformers.toSearchResult);
  }, [users]);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return useMemo(
    () => ({
      users,
      searchResults,
      loading,
      error,
      searchUsers: debouncedSearch,
      clearSearch,
    }),
    [users, searchResults, loading, error, debouncedSearch, clearSearch]
  );
};

/**
 * Enhanced individual user hook with formatting
 */
export const useUser = (id: number | undefined) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const user = useSelector((state: RootState) => 
    id ? selectUserById(state, id) : undefined
  );
  
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  // Fetch user by ID if not in state
  useEffect(() => {
    if (id && !user && !loading) {
      dispatch(fetchUserById(id));
    }
  }, [id, user, loading, dispatch]);

  // Formatted data using utilities
  const formattedData = useMemo(() => {
    if (!user) return null;
    
    return {
      displayName: userFormatting.formatDisplayName(user.name),
      formattedEmail: userFormatting.formatEmail(user.email),
      createdAt: userFormatting.formatCreatedAt(user.created_at),
      updatedAt: userFormatting.formatCreatedAt(user.updated_at),
      relativeTime: userFormatting.formatRelativeTime(user.created_at),
      verificationStatus: userFormatting.formatEmailVerificationStatus(user.email_verified_at),
      roleCount: user.roles?.length || 0,
      permissionCount: user.permissions?.length || 0,
      storeCount: user.stores?.length || 0,
      roleNames: user.roles?.map(r => r.name).join(', ') || 'No roles',
      permissionNames: user.permissions?.map(p => p.name).join(', ') || 'No permissions',
      initials: userFormatting.formatInitials(user.name),
    };
  }, [user]);

  return useMemo(
    () => ({
      user,
      formattedData,
      loading,
      error,
      exists: !!user,
    }),
    [user, formattedData, loading, error]
  );
};

/**
 * User selection hook for UI management
 */
export const useUserSelection = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const selectedUserId = useSelector(selectSelectedUserId);
  const selectedUser = useSelector((state: RootState) => 
    selectedUserId ? selectUserById(state, selectedUserId) : null
  );

  const selectUser = useCallback((userId: number | null) => {
    dispatch(setSelectedUserId(userId));
  }, [dispatch]);

  const clearSelection = useCallback(() => {
    dispatch(setSelectedUserId(null));
  }, [dispatch]);

  return useMemo(
    () => ({
      selectedUserId,
      selectedUser,
      selectUser,
      clearSelection,
    }),
    [selectedUserId, selectedUser, selectUser, clearSelection]
  );
};

/**
 * User filters hook for advanced filtering
 */
export const useUserFilters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);

  const setFiltersCallback = useCallback((newFilters: UserFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(setFilters({}));
  }, [dispatch]);

  return useMemo(
    () => ({
      filters,
      setFilters: setFiltersCallback,
      clearFilters,
    }),
    [filters, setFiltersCallback, clearFilters]
  );
};

/**
 * User options hook for select components
 */
export const useUserOptions = (autoFetch: boolean = true) => {
  const { users, loading, error, fetchUsers } = useUsers(autoFetch);

  // Transform users to select options
  const options = useMemo(
    () => userTransformers.toSelectOptions(users),
    [users]
  );

  return useMemo(
    () => ({
      options,
      loading,
      error,
      refresh: fetchUsers,
    }),
    [options, loading, error, fetchUsers]
  );
};

/**
 * Lifecycle management hook
 */
export const useUsersLifecycle = () => {
  const dispatch = useDispatch<AppDispatch>();

  const resetState = useCallback(() => {
    dispatch(resetUsersState());
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

/**
 * Composite hook that combines multiple user operations
 */
export const useUsersComplete = (
  initialParams?: GetUsersParams
) => {
  const users = useUsers(true, initialParams);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const assignRoles = useAssignRoles();
  const givePermissions = useGivePermissions();
  const search = useUserSearch();
  const selection = useUserSelection();
  const filters = useUserFilters();
  const lifecycle = useUsersLifecycle();

  return useMemo(
    () => ({
      ...users,
      createUser,
      updateUser,
      deleteUser,
      assignRoles,
      givePermissions,
      search,
      selection,
      filters,
      lifecycle,
    }),
    [users, createUser, updateUser, deleteUser, assignRoles, givePermissions, search, selection, filters, lifecycle]
  );
};

// Export individual hook utilities for flexibility
export * from '../store/usersSlice';
