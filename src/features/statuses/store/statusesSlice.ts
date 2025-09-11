// src/features/statuses/store/statusesSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store'; // Adjust path based on your store location
import { StatusApiService } from '../services/api';
import {
  type Status,
  type StatusesState,
  type CreateStatusRequest,
  type UpdateStatusParams,
  type DeleteStatusParams,
  type StatusApiError
} from '../types';

/**
 * Initial state for the statuses slice
 * Uses normalized state structure for efficient lookups and updates
 */
const initialState: StatusesState = {
  // Normalized data storage - entities stored by ID for O(1) lookups
  entities: {},
  // Array of IDs to maintain order and enable easy iteration  
  ids: [],
  
  // Loading states for different operations to enable granular UI feedback
  loading: {
    fetchAll: false,
    fetchById: false,
    create: false,
    update: false,
    delete: false,
  },
  
  // Error states for different operations to display specific error messages
  errors: {
    fetchAll: null,
    fetchById: null,
    create: null,
    update: null,
    delete: null,
  },
  
  // Metadata for caching and optimization
  lastFetched: null,
  total: 0,
};

/**
 * Async thunk for fetching all statuses
 * Handles the complete lifecycle: pending -> fulfilled/rejected
 */
export const fetchAllStatuses = createAsyncThunk<
  Status[], // Return type
  void, // Argument type (no arguments needed)
  { rejectValue: StatusApiError } // ThunkAPI config
>(
  'statuses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const statuses = await StatusApiService.getAllStatuses();
      return statuses;
    } catch (error) {
      // Cast error to our standardized error type
      const apiError = error as StatusApiError;
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk for fetching a single status by ID
 * Useful for viewing detailed status information
 */
export const fetchStatusById = createAsyncThunk<
  Status, // Return type
  number, // Argument type (status ID)
  { rejectValue: StatusApiError }
>(
  'statuses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const status = await StatusApiService.getStatusById(id);
      return status;
    } catch (error) {
      const apiError = error as StatusApiError;
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk for creating a new status
 * Automatically adds the new status to the normalized state on success
 */
export const createStatus = createAsyncThunk<
  Status, // Return type (created status with ID)
  CreateStatusRequest, // Argument type
  { rejectValue: StatusApiError }
>(
  'statuses/create',
  async (statusData, { rejectWithValue }) => {
    try {
      const newStatus = await StatusApiService.createStatus(statusData);
      return newStatus;
    } catch (error) {
      const apiError = error as StatusApiError;
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk for updating an existing status
 * Optimistically updates the state and reverts on failure
 */
export const updateStatus = createAsyncThunk<
  Status, // Return type (updated status)
  UpdateStatusParams, // Argument type
  { rejectValue: StatusApiError }
>(
  'statuses/update',
  async (params, { rejectWithValue }) => {
    try {
      const updatedStatus = await StatusApiService.updateStatus(params);
      return updatedStatus;
    } catch (error) {
      const apiError = error as StatusApiError;
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk for deleting a status
 * Removes the status from normalized state on success
 */
export const deleteStatus = createAsyncThunk<
  number, // Return type (ID of deleted status)
  DeleteStatusParams, // Argument type
  { rejectValue: StatusApiError }
>(
  'statuses/delete',
  async (params, { rejectWithValue }) => {
    try {
      await StatusApiService.deleteStatus(params);
      // Return the ID for removal from state
      return params.id;
    } catch (error) {
      const apiError = error as StatusApiError;
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Helper function to normalize status array into entities and ids
 * Converts array of statuses into normalized state structure
 */
const normalizeStatuses = (statuses: Status[]) => {
  const entities: Record<number, Status> = {};
  const ids: number[] = [];
  
  statuses.forEach((status) => {
    entities[status.id] = status;
    ids.push(status.id);
  });
  
  return { entities, ids };
};

/**
 * Helper function to add a single status to normalized state
 * Prevents duplicates and maintains sorted order
 */
const addStatusToState = (state: StatusesState, status: Status) => {
  state.entities[status.id] = status;
  if (!state.ids.includes(status.id)) {
    state.ids.push(status.id);
    // Keep IDs sorted for consistent ordering
    state.ids.sort((a, b) => b - a); // Newest first
  }
  state.total = state.ids.length;
};

/**
 * Helper function to remove a status from normalized state
 */
const removeStatusFromState = (state: StatusesState, id: number) => {
  delete state.entities[id];
  state.ids = state.ids.filter((statusId: number) => statusId !== id);
  state.total = state.ids.length;
};

/**
 * Main statuses slice using Redux Toolkit
 * Handles all CRUD operations with normalized state and comprehensive error handling
 */
const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    /**
     * Clear all errors - useful for dismissing error messages in UI
     */
    clearErrors: (state) => {
      state.errors = {
        fetchAll: null,
        fetchById: null,
        create: null,
        update: null,
        delete: null,
      };
    },
    
    /**
     * Clear specific operation error
     */
    clearError: (state, action: PayloadAction<keyof StatusesState['errors']>) => {
      state.errors[action.payload] = null;
    },
    
    /**
     * Reset the entire statuses state to initial state
     * Useful for logout or full data refresh scenarios
     */
    resetStatusesState: () => initialState,
    
    /**
     * Optimistically update a status in state (for immediate UI feedback)
     * Will be reverted if the API call fails
     */
    optimisticUpdateStatus: (state, action: PayloadAction<Status>) => {
      const status = action.payload;
      state.entities[status.id] = status;
    },
  },
  
  /**
   * Extra reducers handle the async thunk lifecycle actions
   * Each thunk generates pending, fulfilled, and rejected actions automatically
   */
  extraReducers: (builder) => {
    // Fetch All Statuses
    builder
      .addCase(fetchAllStatuses.pending, (state) => {
        state.loading.fetchAll = true;
        state.errors.fetchAll = null;
      })
      .addCase(fetchAllStatuses.fulfilled, (state, action) => {
        state.loading.fetchAll = false;
        const { entities, ids } = normalizeStatuses(action.payload);
        state.entities = entities;
        state.ids = ids;
        state.total = ids.length;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchAllStatuses.rejected, (state, action) => {
        state.loading.fetchAll = false;
        state.errors.fetchAll = action.payload?.message || 'Failed to fetch statuses';
      })
      
      // Fetch Status By ID
      .addCase(fetchStatusById.pending, (state) => {
        state.loading.fetchById = true;
        state.errors.fetchById = null;
      })
      .addCase(fetchStatusById.fulfilled, (state, action) => {
        state.loading.fetchById = false;
        addStatusToState(state, action.payload);
      })
      .addCase(fetchStatusById.rejected, (state, action) => {
        state.loading.fetchById = false;
        state.errors.fetchById = action.payload?.message || 'Failed to fetch status';
      })
      
      // Create Status
      .addCase(createStatus.pending, (state) => {
        state.loading.create = true;
        state.errors.create = null;
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.loading.create = false;
        addStatusToState(state, action.payload);
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.loading.create = false;
        state.errors.create = action.payload?.message || 'Failed to create status';
      })
      
      // Update Status
      .addCase(updateStatus.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading.update = false;
        // Update existing status in normalized state
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload?.message || 'Failed to update status';
      })
      
      // Delete Status
      .addCase(deleteStatus.pending, (state) => {
        state.loading.delete = true;
        state.errors.delete = null;
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.loading.delete = false;
        removeStatusFromState(state, action.payload);
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.delete = action.payload?.message || 'Failed to delete status';
      });
  },
});

// Export synchronous action creators
export const { 
  clearErrors, 
  clearError, 
  resetStatusesState, 
  optimisticUpdateStatus 
} = statusesSlice.actions;

// Memoized selectors for efficient state access
// These selectors will only recompute when their input data changes

/**
 * Select the entire statuses state
 */
export const selectStatusesState = (state: RootState) => state.statuses;

/**
 * Select all statuses as an array (denormalized for easy rendering)
 */
export const selectAllStatuses = (state: RootState): Status[] => {
  const { entities, ids } = state.statuses;
  return ids.map((id: number) => entities[id]);
};

/**
 * Select a specific status by ID
 */
export const selectStatusById = (state: RootState, id: number): Status | undefined => {
  return state.statuses.entities[id];
};

/**
 * Select loading states
 */
export const selectStatusesLoading = (state: RootState) => state.statuses.loading;

/**
 * Select error states  
 */
export const selectStatusesErrors = (state: RootState) => state.statuses.errors;

/**
 * Select metadata
 */
export const selectStatusesMetadata = (state: RootState) => ({
  total: state.statuses.total,
  lastFetched: state.statuses.lastFetched,
});

/**
 * Select whether any status operation is currently loading
 */
export const selectIsAnyStatusLoading = (state: RootState): boolean => {
  const loading = state.statuses.loading;
  return Object.values(loading).some((isLoading: boolean) => isLoading);
};

/**
 * Select whether there are any status errors
 */
export const selectHasStatusErrors = (state: RootState): boolean => {
  const errors = state.statuses.errors;
  return Object.values(errors).some((error: string | null) => error !== null);
};

/**
 * Export the reducer as default export
 */
export default statusesSlice.reducer;

/**
 * Export the slice for potential advanced usage (accessing action types, etc.)
 */
export { statusesSlice };
