/**
 * Redux Toolkit Slice for User Roles Store Assignment feature
 * 
 * This file contains Redux state management with createAsyncThunk functions
 * for each API endpoint, proper error handling, and optimized state updates.
 * 
 * @author Your Team
 * @version 1.0.0
 */

import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type {
  // State types
  UserRolesStoresAssignmentState,
  ErrorState,
  OperationState,
  
  // Request types
  AssignUserRoleRequest,
  RemoveToggleUserRoleRequest,
  BulkAssignUserRolesRequest,
  GetStoreAssignmentsParams,
  GetUserAssignmentsParams,
  
  // Response types
  AssignUserRoleResponse,
  RemoveToggleUserRoleResponse,
  BulkAssignUserRolesResponse,
  GetAssignmentsResponse,
} from '../types';

import {
  assignUserRoleToStore,
  removeUserRoleFromStore,
  toggleUserRoleStoreStatus,
  bulkAssignUserRoles,
  getStoreAssignments,
  getUserAssignments,
} from '../services/api';

// ==================== Initial State ====================

/**
 * Initial operation state template
 */
const createInitialOperationState = (): OperationState => ({
  loading: 'idle',
  error: null,
});

/**
 * Initial state for the user roles stores assignment slice
 */
const initialState: UserRolesStoresAssignmentState = {
  assignments: [],
  storeAssignments: {},
  userAssignments: {},
  operations: {
    assign: createInitialOperationState(),
    remove: createInitialOperationState(),
    toggle: createInitialOperationState(),
    bulkAssign: createInitialOperationState(),
    fetchStoreAssignments: createInitialOperationState(),
    fetchUserAssignments: createInitialOperationState(),
  },
  isLoading: false,
  lastUpdated: {
    assignments: null,
    storeAssignments: {},
    userAssignments: {},
  },
};

// ==================== Async Thunks ====================

/**
 * Async thunk for assigning a user role to a store
 */
export const assignUserRole = createAsyncThunk<
  AssignUserRoleResponse,
  AssignUserRoleRequest,
  { rejectValue: ErrorState }
>(
  'userRolesStoresAssignment/assignUserRole',
  async (payload, { rejectWithValue }) => {
    const result = await assignUserRoleToStore(payload);
    
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    
    return result.data;
  }
);

/**
 * Async thunk for removing a user role from a store
 */
export const removeUserRole = createAsyncThunk<
  RemoveToggleUserRoleResponse,
  RemoveToggleUserRoleRequest,
  { rejectValue: ErrorState }
>(
  'userRolesStoresAssignment/removeUserRole',
  async (payload, { rejectWithValue }) => {
    const result = await removeUserRoleFromStore(payload);
    
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    
    return result.data;
  }
);

/**
 * Async thunk for toggling user role status in a store
 */
export const toggleUserRoleStatus = createAsyncThunk<
  RemoveToggleUserRoleResponse,
  RemoveToggleUserRoleRequest,
  { rejectValue: ErrorState }
>(
  'userRolesStoresAssignment/toggleUserRoleStatus',
  async (payload, { rejectWithValue }) => {
    const result = await toggleUserRoleStoreStatus(payload);
    
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    
    return result.data;
  }
);

/**
 * Async thunk for bulk assigning user roles
 */
export const bulkAssignUserRole = createAsyncThunk<
  BulkAssignUserRolesResponse,
  BulkAssignUserRolesRequest,
  { rejectValue: ErrorState }
>(
  'userRolesStoresAssignment/bulkAssignUserRole',
  async (payload, { rejectWithValue }) => {
    const result = await bulkAssignUserRoles(payload);
    
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    
    return result.data;
  }
);

/**
 * Async thunk for fetching store assignments
 */
export const fetchStoreAssignments = createAsyncThunk<
  GetAssignmentsResponse,
  GetStoreAssignmentsParams,
  { rejectValue: ErrorState }
>(
  'userRolesStoresAssignment/fetchStoreAssignments',
  async (payload, { rejectWithValue }) => {
    const result = await getStoreAssignments(payload);
    
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    
    return result.data;
  }
);

/**
 * Async thunk for fetching user assignments
 */
export const fetchUserAssignments = createAsyncThunk<
  GetAssignmentsResponse,
  GetUserAssignmentsParams,
  { rejectValue: ErrorState }
>(
  'userRolesStoresAssignment/fetchUserAssignments',
  async (payload, { rejectWithValue }) => {
    const result = await getUserAssignments(payload);
    
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    
    return result.data;
  }
);

// ==================== Slice Definition ====================

/**
 * User Roles Store Assignment slice
 */
const userRolesStoresAssignmentSlice = createSlice({
  name: 'userRolesStoresAssignment',
  initialState,
  reducers: {
    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      Object.keys(state.operations).forEach((key) => {
        const operationKey = key as keyof typeof state.operations;
        state.operations[operationKey].error = null;
      });
    },

    /**
     * Clear specific operation error
     */
    clearOperationError: (state, action: PayloadAction<keyof typeof initialState.operations>) => {
      state.operations[action.payload].error = null;
    },

    /**
     * Clear all assignments data
     */
    clearAssignments: (state) => {
      state.assignments = [];
      state.storeAssignments = {};
      state.userAssignments = {};
      state.lastUpdated = {
        assignments: null,
        storeAssignments: {},
        userAssignments: {},
      };
    },

    /**
     * Clear store assignments for a specific store
     */
    clearStoreAssignments: (state, action: PayloadAction<string>) => {
      const storeId = action.payload;
      delete state.storeAssignments[storeId];
      delete state.lastUpdated.storeAssignments[storeId];
    },

    /**
     * Clear user assignments for a specific user
     */
    clearUserAssignments: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      delete state.userAssignments[userId];
      delete state.lastUpdated.userAssignments[userId];
    },

    /**
     * Reset entire state to initial values
     */
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // ==================== Assign User Role ====================
    builder
      .addCase(assignUserRole.pending, (state) => {
        state.operations.assign.loading = 'pending';
        state.operations.assign.error = null;
        state.isLoading = true;
      })
      .addCase(assignUserRole.fulfilled, (state, action) => {
        state.operations.assign.loading = 'fulfilled';
        state.operations.assign.error = null;
        state.isLoading = false;
        
        // Add new assignment to relevant collections
        const newAssignment = action.payload.data.assignment;
        state.assignments.push(newAssignment);
        
        // Update store assignments
        const storeId = newAssignment.store_id;
        if (!state.storeAssignments[storeId]) {
          state.storeAssignments[storeId] = [];
        }
        state.storeAssignments[storeId].push(newAssignment);
        
        // Update user assignments
        const userId = newAssignment.user_id;
        if (!state.userAssignments[userId]) {
          state.userAssignments[userId] = [];
        }
        state.userAssignments[userId].push(newAssignment);
        
        // Update timestamps
        const now = new Date().toISOString();
        state.lastUpdated.assignments = now;
        state.lastUpdated.storeAssignments[storeId] = now;
        state.lastUpdated.userAssignments[userId] = now;
      })
      .addCase(assignUserRole.rejected, (state, action) => {
        state.operations.assign.loading = 'rejected';
        state.operations.assign.error = action.payload || {
          message: 'Failed to assign user role',
          timestamp: new Date().toISOString(),
        };
        state.isLoading = false;
      });

    // ==================== Remove User Role ====================
    builder
      .addCase(removeUserRole.pending, (state) => {
        state.operations.remove.loading = 'pending';
        state.operations.remove.error = null;
        state.isLoading = true;
      })
      .addCase(removeUserRole.fulfilled, (state) => {
        state.operations.remove.loading = 'fulfilled';
        state.operations.remove.error = null;
        state.isLoading = false;
        
        // Note: API doesn't return the assignment details for removal
        // We'll need to refetch or remove optimistically based on the request payload
        // For now, we'll mark as needing refresh
        state.lastUpdated.assignments = null;
      })
      .addCase(removeUserRole.rejected, (state, action) => {
        state.operations.remove.loading = 'rejected';
        state.operations.remove.error = action.payload || {
          message: 'Failed to remove user role',
          timestamp: new Date().toISOString(),
        };
        state.isLoading = false;
      });

    // ==================== Toggle User Role Status ====================
    builder
      .addCase(toggleUserRoleStatus.pending, (state) => {
        state.operations.toggle.loading = 'pending';
        state.operations.toggle.error = null;
        state.isLoading = true;
      })
      .addCase(toggleUserRoleStatus.fulfilled, (state) => {
        state.operations.toggle.loading = 'fulfilled';
        state.operations.toggle.error = null;
        state.isLoading = false;
        
        // Mark as needing refresh since API doesn't return updated assignment
        state.lastUpdated.assignments = null;
      })
      .addCase(toggleUserRoleStatus.rejected, (state, action) => {
        state.operations.toggle.loading = 'rejected';
        state.operations.toggle.error = action.payload || {
          message: 'Failed to toggle user role status',
          timestamp: new Date().toISOString(),
        };
        state.isLoading = false;
      });

    // ==================== Bulk Assign User Roles ====================
    builder
      .addCase(bulkAssignUserRole.pending, (state) => {
        state.operations.bulkAssign.loading = 'pending';
        state.operations.bulkAssign.error = null;
        state.isLoading = true;
      })
      .addCase(bulkAssignUserRole.fulfilled, (state, action) => {
        state.operations.bulkAssign.loading = 'fulfilled';
        state.operations.bulkAssign.error = null;
        state.isLoading = false;
        
        // Add new assignments to relevant collections
        const newAssignments = action.payload.data.assignments;
        state.assignments.push(...newAssignments);
        
        const now = new Date().toISOString();
        state.lastUpdated.assignments = now;
        
        // Update store and user assignments
        newAssignments.forEach((assignment) => {
          const storeId = assignment.store_id;
          const userId = assignment.user_id;
          
          // Update store assignments
          if (!state.storeAssignments[storeId]) {
            state.storeAssignments[storeId] = [];
          }
          state.storeAssignments[storeId].push(assignment);
          state.lastUpdated.storeAssignments[storeId] = now;
          
          // Update user assignments
          if (!state.userAssignments[userId]) {
            state.userAssignments[userId] = [];
          }
          state.userAssignments[userId].push(assignment);
          state.lastUpdated.userAssignments[userId] = now;
        });
      })
      .addCase(bulkAssignUserRole.rejected, (state, action) => {
        state.operations.bulkAssign.loading = 'rejected';
        state.operations.bulkAssign.error = action.payload || {
          message: 'Failed to bulk assign user roles',
          timestamp: new Date().toISOString(),
        };
        state.isLoading = false;
      });

    // ==================== Fetch Store Assignments ====================
    builder
      .addCase(fetchStoreAssignments.pending, (state) => {
        state.operations.fetchStoreAssignments.loading = 'pending';
        state.operations.fetchStoreAssignments.error = null;
        state.isLoading = true;
      })
      .addCase(fetchStoreAssignments.fulfilled, (state, action) => {
        state.operations.fetchStoreAssignments.loading = 'fulfilled';
        state.operations.fetchStoreAssignments.error = null;
        state.isLoading = false;
        
        const assignments = action.payload.data.assignments;
        
        // Assuming we can derive store_id from the assignments or action meta
        // Since the API requires store_id as parameter, we should have it
        if (assignments.length > 0) {
          const storeId = assignments[0].store_id;
          state.storeAssignments[storeId] = assignments;
          state.lastUpdated.storeAssignments[storeId] = new Date().toISOString();
        }
      })
      .addCase(fetchStoreAssignments.rejected, (state, action) => {
        state.operations.fetchStoreAssignments.loading = 'rejected';
        state.operations.fetchStoreAssignments.error = action.payload || {
          message: 'Failed to fetch store assignments',
          timestamp: new Date().toISOString(),
        };
        state.isLoading = false;
      });

    // ==================== Fetch User Assignments ====================
    builder
      .addCase(fetchUserAssignments.pending, (state) => {
        state.operations.fetchUserAssignments.loading = 'pending';
        state.operations.fetchUserAssignments.error = null;
        state.isLoading = true;
      })
      .addCase(fetchUserAssignments.fulfilled, (state, action) => {
        state.operations.fetchUserAssignments.loading = 'fulfilled';
        state.operations.fetchUserAssignments.error = null;
        state.isLoading = false;
        
        const assignments = action.payload.data.assignments;
        
        // Derive user_id from assignments
        if (assignments.length > 0) {
          const userId = assignments[0].user_id;
          state.userAssignments[userId] = assignments;
          state.lastUpdated.userAssignments[userId] = new Date().toISOString();
        }
      })
      .addCase(fetchUserAssignments.rejected, (state, action) => {
        state.operations.fetchUserAssignments.loading = 'rejected';
        state.operations.fetchUserAssignments.error = action.payload || {
          message: 'Failed to fetch user assignments',
          timestamp: new Date().toISOString(),
        };
        state.isLoading = false;
      });
  },
});

// ==================== Export Actions and Reducer ====================

export const {
  clearErrors,
  clearOperationError,
  clearAssignments,
  clearStoreAssignments,
  clearUserAssignments,
  resetState,
} = userRolesStoresAssignmentSlice.actions;

export default userRolesStoresAssignmentSlice.reducer;

// ==================== Selectors ====================

/**
 * Root state type (adjust according to your store structure)
 */
export interface RootState {
  userRolesStoresAssignment: UserRolesStoresAssignmentState;
}

/**
 * Base selector for the feature state
 */
export const selectUserRolesStoresAssignmentState = (state: RootState) =>
  state.userRolesStoresAssignment;

/**
 * Selector for all assignments
 */
export const selectAllAssignments = (state: RootState) =>
  state.userRolesStoresAssignment.assignments;

/**
 * Selector factory for store assignments
 */
export const selectStoreAssignments = (storeId: string) => (state: RootState) =>
  state.userRolesStoresAssignment.storeAssignments[storeId] || [];

/**
 * Selector factory for user assignments
 */
export const selectUserAssignments = (userId: number) => (state: RootState) =>
  state.userRolesStoresAssignment.userAssignments[userId] || [];

/**
 * Selector for global loading state
 */
export const selectIsLoading = (state: RootState) =>
  state.userRolesStoresAssignment.isLoading;

/**
 * Selector factory for operation loading state
 */
export const selectOperationLoading = (operation: keyof UserRolesStoresAssignmentState['operations']) =>
  (state: RootState) => state.userRolesStoresAssignment.operations[operation].loading;

/**
 * Selector factory for operation error state
 */
export const selectOperationError = (operation: keyof UserRolesStoresAssignmentState['operations']) =>
  (state: RootState) => state.userRolesStoresAssignment.operations[operation].error;
