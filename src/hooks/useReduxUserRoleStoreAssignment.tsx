import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  assignUserRoleToStore,
  toggleUserRoleStoreStatus,
  fetchStoreAssignments,
  fetchUserAssignments,
  bulkAssignUserRoles,
  removeUserRoleStore,
  clearError,
  clearAssignments,
  updateAssignmentStatus,
  removeAssignmentFromState,
} from '../store/slices/userRoleStoreAssignmentSlice';
import type {
  AssignUserRoleToStoreRequest,
  ToggleUserRoleStoreStatusRequest,
  BulkAssignUserRolesRequest,
  RemoveUserRoleStoreRequest,
  UserRoleStoreAssignment,
  UserRoleStoreAssignmentFilters,
} from '../types/userRoleStoreAssignment';
import type { RootState } from '../store';

export const useReduxUserRoleStoreAssignment = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const {
    assignments,
    storeAssignments,
    userAssignments,
    loading,
    error,
    assignmentLoading,
    toggleLoading,
    bulkAssignLoading,
    removeLoading,
  } = useAppSelector((state: RootState) => state.userRoleStoreAssignment);

  // Actions
  const handleAssignUserRoleToStore = useCallback(
    async (data: AssignUserRoleToStoreRequest) => {
      try {
        const result = await dispatch(assignUserRoleToStore(data)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to assign user role to store' };
      }
    },
    [dispatch]
  );

  const handleToggleUserRoleStoreStatus = useCallback(
    async (data: ToggleUserRoleStoreStatusRequest) => {
      try {
        await dispatch(toggleUserRoleStoreStatus(data)).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to toggle assignment status' };
      }
    },
    [dispatch]
  );

  const handleFetchStoreAssignments = useCallback(
    async (storeId: string) => {
      try {
        const result = await dispatch(fetchStoreAssignments(storeId)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to fetch store assignments' };
      }
    },
    [dispatch]
  );

  const handleFetchUserAssignments = useCallback(
    async (userId: number) => {
      try {
        const result = await dispatch(fetchUserAssignments(userId)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to fetch user assignments' };
      }
    },
    [dispatch]
  );

  const handleBulkAssignUserRoles = useCallback(
    async (data: BulkAssignUserRolesRequest) => {
      try {
        const result = await dispatch(bulkAssignUserRoles(data)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to bulk assign user roles' };
      }
    },
    [dispatch]
  );

  const handleRemoveUserRoleStore = useCallback(
    async (data: RemoveUserRoleStoreRequest) => {
      try {
        await dispatch(removeUserRoleStore(data)).unwrap();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to remove user role assignment' };
      }
    },
    [dispatch]
  );



  // Utility functions
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearAssignments = useCallback(() => {
    dispatch(clearAssignments());
  }, [dispatch]);

  const handleUpdateAssignmentStatus = useCallback(
    (data: { user_id: number; role_id: number; store_id: string; is_active: boolean }) => {
      dispatch(updateAssignmentStatus(data));
    },
    [dispatch]
  );

  const handleRemoveAssignmentFromState = useCallback(
    (data: { user_id: number; role_id: number; store_id: string }) => {
      dispatch(removeAssignmentFromState(data));
    },
    [dispatch]
  );

  // Filter and search functions
  const filterAssignments = useCallback(
    (assignments: UserRoleStoreAssignment[], filters: UserRoleStoreAssignmentFilters) => {
      return assignments.filter((assignment) => {
        if (filters.user_id && assignment.user_id !== filters.user_id) return false;
        if (filters.role_id && assignment.role_id !== filters.role_id) return false;
        if (filters.store_id && assignment.store_id !== filters.store_id) return false;
        if (filters.is_active !== undefined && assignment.is_active !== filters.is_active) return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const userName = assignment.user?.name?.toLowerCase() || '';
          const userEmail = assignment.user?.email?.toLowerCase() || '';
          const roleName = assignment.role?.name?.toLowerCase() || '';
          const storeName = assignment.store?.name?.toLowerCase() || '';
          
          if (
            !userName.includes(searchLower) &&
            !userEmail.includes(searchLower) &&
            !roleName.includes(searchLower) &&
            !storeName.includes(searchLower) &&
            !assignment.store_id.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }
        return true;
      });
    },
    []
  );

  // Get assignment by identifiers
  const getAssignment = useCallback(
    (user_id: number, role_id: number, store_id: string) => {
      return assignments.find(
        (assignment) =>
          assignment.user_id === user_id &&
          assignment.role_id === role_id &&
          assignment.store_id === store_id
      );
    },
    [assignments]
  );

  // Check if user has role in store
  const hasUserRoleInStore = useCallback(
    (user_id: number, role_id: number, store_id: string) => {
      const assignment = getAssignment(user_id, role_id, store_id);
      return assignment ? assignment.is_active : false;
    },
    [getAssignment]
  );

  // Get user's roles in a specific store
  const getUserRolesInStore = useCallback(
    (user_id: number, store_id: string) => {
      return assignments.filter(
        (assignment) =>
          assignment.user_id === user_id &&
          assignment.store_id === store_id &&
          assignment.is_active
      );
    },
    [assignments]
  );

  // Get users with a specific role in a store
  const getUsersWithRoleInStore = useCallback(
    (role_id: number, store_id: string) => {
      return assignments.filter(
        (assignment) =>
          assignment.role_id === role_id &&
          assignment.store_id === store_id &&
          assignment.is_active
      );
    },
    [assignments]
  );

  return {
    // State
    assignments,
    storeAssignments,
    userAssignments,
    loading,
    error,
    assignmentLoading,
    toggleLoading,
    bulkAssignLoading,
    removeLoading,

    // Actions
    assignUserRoleToStore: handleAssignUserRoleToStore,
    toggleUserRoleStoreStatus: handleToggleUserRoleStoreStatus,
    fetchStoreAssignments: handleFetchStoreAssignments,
    fetchUserAssignments: handleFetchUserAssignments,
    bulkAssignUserRoles: handleBulkAssignUserRoles,
    removeUserRoleStore: handleRemoveUserRoleStore,

    // Utility functions
    clearError: handleClearError,
    clearAssignments: handleClearAssignments,
    updateAssignmentStatus: handleUpdateAssignmentStatus,
    removeAssignmentFromState: handleRemoveAssignmentFromState,

    // Helper functions
    filterAssignments,
    getAssignment,
    hasUserRoleInStore,
    getUserRolesInStore,
    getUsersWithRoleInStore,
  };
};

export default useReduxUserRoleStoreAssignment;