/**
 * Custom React Hooks for User Roles Store Assignment feature
 * 
 * This file provides typed custom hooks that encapsulate business logic
 * and provide clean APIs for components to interact with the Redux state.
 * 
 * @author Your Team
 * @version 1.0.0
 */

import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store'; // Adjust path to your store
import type {
  // Request types
  AssignUserRoleRequest,
  RemoveToggleUserRoleRequest,
  BulkAssignUserRolesRequest,
  GetStoreAssignmentsParams,
  GetUserAssignmentsParams,
  
  // Hook return types
  UseAssignmentOperations,
  UseAssignmentData,
  
  // State types
  Assignment,
  ErrorState,
} from '../types';

import {
  // Async thunks
  assignUserRole,
  removeUserRole,
  toggleUserRoleStatus,
  bulkAssignUserRole,
  fetchStoreAssignments,
  fetchUserAssignments,
  
  // Sync actions
  clearErrors,
  clearOperationError,
  clearAssignments,
  clearStoreAssignments,
  clearUserAssignments,
  resetState,
  
  // Selectors
  selectIsLoading,
  selectOperationLoading,
  selectOperationError,
  selectUserRolesStoresAssignmentState,
} from '../store/userRolesStoresAssignmentSlice';

// ==================== Type Definitions ====================

type OperationKey = 'assign' | 'remove' | 'toggle' | 'bulkAssign' | 'fetchStoreAssignments' | 'fetchUserAssignments';

// ==================== Operations Hook ====================

/**
 * Custom hook for assignment operations (create, update, delete)
 * Provides methods to perform actions and access their loading/error states
 */
export const useAssignmentOperations = (): UseAssignmentOperations => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors for loading states
  const isAssigning = useSelector(selectOperationLoading('assign')) === 'pending';
  const isRemoving = useSelector(selectOperationLoading('remove')) === 'pending';
  const isToggling = useSelector(selectOperationLoading('toggle')) === 'pending';
  const isBulkAssigning = useSelector(selectOperationLoading('bulkAssign')) === 'pending';
  
  // Selectors for error states
  const assignError = useSelector(selectOperationError('assign'));
  const removeError = useSelector(selectOperationError('remove'));
  const toggleError = useSelector(selectOperationError('toggle'));
  const bulkAssignError = useSelector(selectOperationError('bulkAssign'));
  
  // Action dispatchers with useCallback for performance
  const assignUserRoleAction = useCallback(
    (payload: AssignUserRoleRequest) => {
      return dispatch(assignUserRole(payload));
    },
    [dispatch]
  );
  
  const removeUserRoleAction = useCallback(
    (payload: RemoveToggleUserRoleRequest) => {
      return dispatch(removeUserRole(payload));
    },
    [dispatch]
  );
  
  const toggleUserRoleStatusAction = useCallback(
    (payload: RemoveToggleUserRoleRequest) => {
      return dispatch(toggleUserRoleStatus(payload));
    },
    [dispatch]
  );
  
  const bulkAssignUserRolesAction = useCallback(
    (payload: BulkAssignUserRolesRequest) => {
      return dispatch(bulkAssignUserRole(payload));
    },
    [dispatch]
  );
  
  return useMemo(
    () => ({
      // Action dispatchers
      assignUserRole: assignUserRoleAction,
      removeUserRole: removeUserRoleAction,
      toggleUserRoleStatus: toggleUserRoleStatusAction,
      bulkAssignUserRoles: bulkAssignUserRolesAction,
      
      // Loading states
      isAssigning,
      isRemoving,
      isToggling,
      isBulkAssigning,
      
      // Error states
      assignError,
      removeError,
      toggleError,
      bulkAssignError,
    }),
    [
      assignUserRoleAction,
      removeUserRoleAction,
      toggleUserRoleStatusAction,
      bulkAssignUserRolesAction,
      isAssigning,
      isRemoving,
      isToggling,
      isBulkAssigning,
      assignError,
      removeError,
      toggleError,
      bulkAssignError,
    ]
  );
};

// ==================== Data Hook ====================

/**
 * Custom hook for assignment data retrieval and management
 * Provides methods to fetch data and access cached results
 */
export const useAssignmentData = (): UseAssignmentData => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector(selectUserRolesStoresAssignmentState);
  
  // Global loading state
  const isLoading = useSelector(selectIsLoading);
  
  // Fetch operation loading states
  const isLoadingStoreAssignmentsFetch = useSelector(selectOperationLoading('fetchStoreAssignments')) === 'pending';
  const isLoadingUserAssignmentsFetch = useSelector(selectOperationLoading('fetchUserAssignments')) === 'pending';
  
  // Fetch operation error states
  const fetchStoreAssignmentsError = useSelector(selectOperationError('fetchStoreAssignments'));
  const fetchUserAssignmentsError = useSelector(selectOperationError('fetchUserAssignments'));
  
  // Data getters with caching
  const getStoreAssignments = useCallback(
    (storeId: string): Assignment[] => {
      return state.storeAssignments[storeId] || [];
    },
    [state.storeAssignments]
  );
  
  const getUserAssignments = useCallback(
    (userId: number): Assignment[] => {
      return state.userAssignments[userId] || [];
    },
    [state.userAssignments]
  );
  
  const getAllAssignments = useCallback((): Assignment[] => {
    return state.assignments;
  }, [state.assignments]);
  
  // Data fetchers
  const fetchStoreAssignmentsAction = useCallback(
    (storeId: string) => {
      const params: GetStoreAssignmentsParams = { store_id: storeId };
      return dispatch(fetchStoreAssignments(params));
    },
    [dispatch]
  );
  
  const fetchUserAssignmentsAction = useCallback(
    (userId: number) => {
      const params: GetUserAssignmentsParams = { user_id: userId };
      return dispatch(fetchUserAssignments(params));
    },
    [dispatch]
  );
  
  // Loading state checkers
  const isLoadingStoreAssignments = useCallback(
    (): boolean => {
      return isLoadingStoreAssignmentsFetch;
    },
    [isLoadingStoreAssignmentsFetch]
  );
  
  const isLoadingUserAssignments = useCallback(
    (): boolean => {
      return isLoadingUserAssignmentsFetch;
    },
    [isLoadingUserAssignmentsFetch]
  );
  
  // Error state getters
  const getStoreAssignmentsError = useCallback(
    (): ErrorState | null => {
      return fetchStoreAssignmentsError;
    },
    [fetchStoreAssignmentsError]
  );
  
  const getUserAssignmentsError = useCallback(
    (): ErrorState | null => {
      return fetchUserAssignmentsError;
    },
    [fetchUserAssignmentsError]
  );
  
  return useMemo(
    () => ({
      // Data getters
      getStoreAssignments,
      getUserAssignments,
      getAllAssignments,
      
      // Data fetchers
      fetchStoreAssignments: fetchStoreAssignmentsAction,
      fetchUserAssignments: fetchUserAssignmentsAction,
      
      // Loading states
      isLoadingStoreAssignments,
      isLoadingUserAssignments,
      isLoading,
      
      // Error states
      getStoreAssignmentsError,
      getUserAssignmentsError,
    }),
    [
      getStoreAssignments,
      getUserAssignments,
      getAllAssignments,
      fetchStoreAssignmentsAction,
      fetchUserAssignmentsAction,
      isLoadingStoreAssignments,
      isLoadingUserAssignments,
      isLoading,
      getStoreAssignmentsError,
      getUserAssignmentsError,
    ]
  );
};

// ==================== Combined Hook ====================

/**
 * Combined hook that provides both operations and data functionality
 * Convenient for components that need both capabilities
 */
export const useUserRolesStoresAssignment = (): UseAssignmentOperations & UseAssignmentData => {
  const operations = useAssignmentOperations();
  const data = useAssignmentData();
  
  return useMemo(
    () => ({
      ...operations,
      ...data,
    }),
    [operations, data]
  );
};

// ==================== Utility Hooks ====================

/**
 * Hook for managing assignment state cleanup and error handling
 */
export const useAssignmentUtilities = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);
  
  const clearSpecificError = useCallback(
    (operation: OperationKey) => {
      dispatch(clearOperationError(operation));
    },
    [dispatch]
  );
  
  const clearAllAssignments = useCallback(() => {
    dispatch(clearAssignments());
  }, [dispatch]);
  
  const clearStoreAssignmentData = useCallback(
    (storeId: string) => {
      dispatch(clearStoreAssignments(storeId));
    },
    [dispatch]
  );
  
  const clearUserAssignmentData = useCallback(
    (userId: number) => {
      dispatch(clearUserAssignments(userId));
    },
    [dispatch]
  );
  
  const resetAllState = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);
  
  return useMemo(
    () => ({
      clearAllErrors,
      clearSpecificError,
      clearAllAssignments,
      clearStoreAssignmentData,
      clearUserAssignmentData,
      resetAllState,
    }),
    [
      clearAllErrors,
      clearSpecificError,
      clearAllAssignments,
      clearStoreAssignmentData,
      clearUserAssignmentData,
      resetAllState,
    ]
  );
};

// ==================== Specialized Hooks ====================

/**
 * Hook for checking assignment status and permissions
 */
export const useAssignmentStatus = () => {
  const { getAllAssignments } = useAssignmentData();
  
  const isUserAssignedToStore = useCallback(
    (userId: number, storeId: string): boolean => {
      const assignments = getAllAssignments();
      return assignments.some(
        (assignment) =>
          assignment.user_id === userId &&
          assignment.store_id === storeId &&
          assignment.is_active
      );
    },
    [getAllAssignments]
  );
  
  const getUserRolesInStore = useCallback(
    (userId: number, storeId: string): Assignment[] => {
      const assignments = getAllAssignments();
      return assignments.filter(
        (assignment) =>
          assignment.user_id === userId &&
          assignment.store_id === storeId &&
          assignment.is_active
      );
    },
    [getAllAssignments]
  );
  
  const getActiveAssignmentsCount = useCallback((): number => {
    const assignments = getAllAssignments();
    return assignments.filter((assignment) => assignment.is_active).length;
  }, [getAllAssignments]);
  
  const getAssignmentsByRole = useCallback(
    (roleId: number): Assignment[] => {
      const assignments = getAllAssignments();
      return assignments.filter(
        (assignment) => assignment.role_id === roleId && assignment.is_active
      );
    },
    [getAllAssignments]
  );
  
  return useMemo(
    () => ({
      isUserAssignedToStore,
      getUserRolesInStore,
      getActiveAssignmentsCount,
      getAssignmentsByRole,
    }),
    [
      isUserAssignedToStore,
      getUserRolesInStore,
      getActiveAssignmentsCount,
      getAssignmentsByRole,
    ]
  );
};

// ==================== Cache Management Hook ====================

/**
 * Hook for managing data freshness and cache invalidation
 */
export const useAssignmentCache = () => {
  const state = useSelector(selectUserRolesStoresAssignmentState);
  
  const isStoreDataFresh = useCallback(
    (storeId: string, maxAgeMinutes: number = 5): boolean => {
      const lastUpdated = state.lastUpdated.storeAssignments[storeId];
      if (!lastUpdated) return false;
      
      const now = new Date();
      const updatedTime = new Date(lastUpdated);
      const diffMinutes = (now.getTime() - updatedTime.getTime()) / (1000 * 60);
      
      return diffMinutes < maxAgeMinutes;
    },
    [state.lastUpdated.storeAssignments]
  );
  
  const isUserDataFresh = useCallback(
    (userId: number, maxAgeMinutes: number = 5): boolean => {
      const lastUpdated = state.lastUpdated.userAssignments[userId];
      if (!lastUpdated) return false;
      
      const now = new Date();
      const updatedTime = new Date(lastUpdated);
      const diffMinutes = (now.getTime() - updatedTime.getTime()) / (1000 * 60);
      
      return diffMinutes < maxAgeMinutes;
    },
    [state.lastUpdated.userAssignments]
  );
  
  const shouldRefreshStoreData = useCallback(
    (storeId: string, maxAgeMinutes: number = 5): boolean => {
      return !isStoreDataFresh(storeId, maxAgeMinutes);
    },
    [isStoreDataFresh]
  );
  
  const shouldRefreshUserData = useCallback(
    (userId: number, maxAgeMinutes: number = 5): boolean => {
      return !isUserDataFresh(userId, maxAgeMinutes);
    },
    [isUserDataFresh]
  );
  
  return useMemo(
    () => ({
      isStoreDataFresh,
      isUserDataFresh,
      shouldRefreshStoreData,
      shouldRefreshUserData,
    }),
    [
      isStoreDataFresh,
      isUserDataFresh,
      shouldRefreshStoreData,
      shouldRefreshUserData,
    ]
  );
};
