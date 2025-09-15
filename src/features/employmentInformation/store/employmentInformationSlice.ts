/**
 * @fileoverview Redux Toolkit slice for Employment Information management
 * @description Handles all CRUD operations with async thunks, loading states, and error handling
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../store'; // Adjust path as needed
import type {
  EmploymentInformation,
  EmploymentInformationState,
  CreateEmploymentInformationRequest,
  UpdateEmploymentInformationRequest,
  ApiError,
} from '../types';
import EmploymentInformationApiService from '../services/api';

// ============================================================================
// Initial State
// ============================================================================

/**
 * Initial state for Employment Information slice
 */
const initialState: EmploymentInformationState = {
  items: [],
  currentItem: null,
  listLoading: 'idle',
  itemLoading: 'idle',
  createLoading: 'idle',
  updateLoading: 'idle',
  deleteLoading: 'idle',
  listError: null,
  itemError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  lastFetch: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Async thunk for fetching all employment information records
 * @description Fetches all employment information with proper error handling
 */
export const fetchAllEmploymentInformation = createAsyncThunk(
  'employmentInformation/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const lastFetch = state.employmentInformation.lastFetch;
      const now = Date.now();
      
      // Optional: Skip fetch if data was recently fetched (cache for 5 minutes)
      if (lastFetch && (now - lastFetch) < 5 * 60 * 1000) {
        console.log('[EmploymentInformationSlice] Using cached data, skipping fetch');
        return null; // This will be handled in the fulfilled case
      }

      console.log('[EmploymentInformationSlice] Fetching all employment information records');
      const data = await EmploymentInformationApiService.getAll();
      console.log(`[EmploymentInformationSlice] Successfully fetched ${data.length} records`);
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('[EmploymentInformationSlice] fetchAll failed:', apiError);
      return rejectWithValue({
        message: apiError.message || 'Failed to fetch employment information',
        code: apiError.code,
        errors: apiError.errors,
      });
    }
  }
);

/**
 * Async thunk for fetching employment information by ID
 * @param id - The employment information ID to fetch
 */
export const fetchEmploymentInformationById = createAsyncThunk(
  'employmentInformation/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid employment information ID is required');
      }

      console.log(`[EmploymentInformationSlice] Fetching employment information with ID: ${id}`);
      const data = await EmploymentInformationApiService.getById(id);
      console.log(`[EmploymentInformationSlice] Successfully fetched employment information: ${id}`);
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`[EmploymentInformationSlice] fetchById(${id}) failed:`, apiError);
      return rejectWithValue({
        message: apiError.message || 'Failed to fetch employment information',
        code: apiError.code,
        errors: apiError.errors,
      });
    }
  }
);

/**
 * Async thunk for creating new employment information
 * @param data - The employment information data to create
 */
export const createEmploymentInformation = createAsyncThunk(
  'employmentInformation/create',
  async (data: CreateEmploymentInformationRequest, { rejectWithValue, dispatch }) => {
    try {
      // Client-side validation
      const validationErrors = EmploymentInformationApiService.validateEmploymentData(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      console.log('[EmploymentInformationSlice] Creating new employment information');
      const response = await EmploymentInformationApiService.create(data);
      console.log(`[EmploymentInformationSlice] Successfully created employment information with ID: ${response.id}`);
      
      // Optionally refresh the list after creation
      dispatch(fetchAllEmploymentInformation());
      
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('[EmploymentInformationSlice] create failed:', apiError);
      return rejectWithValue({
        message: apiError.message || 'Failed to create employment information',
        code: apiError.code,
        errors: apiError.errors,
      });
    }
  }
);

/**
 * Async thunk for updating employment information
 * @param params - Object containing id and updated data
 */
export const updateEmploymentInformation = createAsyncThunk(
  'employmentInformation/update',
  async (
    params: { id: number; data: UpdateEmploymentInformationRequest },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { id, data } = params;

      if (!id || id <= 0) {
        throw new Error('Valid employment information ID is required');
      }

      // Client-side validation
      const validationErrors = EmploymentInformationApiService.validateEmploymentData(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      console.log(`[EmploymentInformationSlice] Updating employment information with ID: ${id}`);
      const response = await EmploymentInformationApiService.update(id, data);
      console.log(`[EmploymentInformationSlice] Successfully updated employment information: ${id}`);
      
      // Optionally refresh the list after update
      dispatch(fetchAllEmploymentInformation());
      
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`[EmploymentInformationSlice] update(${params.id}) failed:`, apiError);
      return rejectWithValue({
        message: apiError.message || 'Failed to update employment information',
        code: apiError.code,
        errors: apiError.errors,
      });
    }
  }
);

/**
 * Async thunk for deleting employment information
 * @param id - The employment information ID to delete
 */
export const deleteEmploymentInformation = createAsyncThunk(
  'employmentInformation/delete',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid employment information ID is required');
      }

      console.log(`[EmploymentInformationSlice] Deleting employment information with ID: ${id}`);
      await EmploymentInformationApiService.delete(id);
      console.log(`[EmploymentInformationSlice] Successfully deleted employment information: ${id}`);
      
      // Refresh the list after deletion
      dispatch(fetchAllEmploymentInformation());
      
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`[EmploymentInformationSlice] delete(${id}) failed:`, apiError);
      return rejectWithValue({
        message: apiError.message || 'Failed to delete employment information',
        code: apiError.code,
        errors: apiError.errors,
      });
    }
  }
);

// ============================================================================
// Slice Definition
// ============================================================================

/**
 * Employment Information slice with reducers and extra reducers
 */
export const employmentInformationSlice = createSlice({
  name: 'employmentInformation',
  initialState,
  reducers: {
    /**
     * Clears all error states
     */
    clearErrors: (state) => {
      state.listError = null;
      state.itemError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },

    /**
     * Clears the current selected item
     */
    clearCurrentItem: (state) => {
      state.currentItem = null;
      state.itemError = null;
    },

    /**
     * Sets the current selected item
     * @param action - Payload containing the employment information to set as current
     */
    setCurrentItem: (state, action: PayloadAction<EmploymentInformation>) => {
      state.currentItem = action.payload;
      state.itemError = null;
    },

    /**
     * Clears specific error by type
     * @param action - Payload containing the error type to clear
     */
    clearError: (
      state,
      action: PayloadAction<'list' | 'item' | 'create' | 'update' | 'delete'>
    ) => {
      const errorType = action.payload;
      switch (errorType) {
        case 'list':
          state.listError = null;
          break;
        case 'item':
          state.itemError = null;
          break;
        case 'create':
          state.createError = null;
          break;
        case 'update':
          state.updateError = null;
          break;
        case 'delete':
          state.deleteError = null;
          break;
      }
    },

    /**
     * Manually updates an item in the list (for optimistic updates)
     * @param action - Payload containing the updated employment information
     */
    updateItemInList: (state, action: PayloadAction<EmploymentInformation>) => {
      const updatedItem = action.payload;
      const index = state.items.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.items[index] = updatedItem;
        if (state.currentItem && state.currentItem.id === updatedItem.id) {
          state.currentItem = updatedItem;
        }
      }
    },

    /**
     * Manually removes an item from the list (for optimistic updates)
     * @param action - Payload containing the ID of the item to remove
     */
    removeItemFromList: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      if (state.currentItem && state.currentItem.id === itemId) {
        state.currentItem = null;
      }
    },

    /**
     * Resets the entire slice to initial state
     */
    resetState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================================
    // Fetch All Employment Information
    // ========================================================================
    builder
      .addCase(fetchAllEmploymentInformation.pending, (state) => {
        state.listLoading = 'pending';
        state.listError = null;
      })
      .addCase(fetchAllEmploymentInformation.fulfilled, (state, action) => {
        state.listLoading = 'succeeded';
        state.listError = null;
        
        // Handle cached data case
        if (action.payload !== null) {
          state.items = action.payload;
          state.lastFetch = Date.now();
        }
      })
      .addCase(fetchAllEmploymentInformation.rejected, (state, action) => {
        state.listLoading = 'failed';
        const error = action.payload as ApiError;
        state.listError = error?.message || 'Failed to fetch employment information';
        console.error('[EmploymentInformationSlice] fetchAll rejected:', error);
      })

    // ========================================================================
    // Fetch Employment Information By ID
    // ========================================================================
      .addCase(fetchEmploymentInformationById.pending, (state) => {
        state.itemLoading = 'pending';
        state.itemError = null;
      })
      .addCase(fetchEmploymentInformationById.fulfilled, (state, action) => {
        state.itemLoading = 'succeeded';
        state.itemError = null;
        state.currentItem = action.payload;
      })
      .addCase(fetchEmploymentInformationById.rejected, (state, action) => {
        state.itemLoading = 'failed';
        const error = action.payload as ApiError;
        state.itemError = error?.message || 'Failed to fetch employment information';
        state.currentItem = null;
        console.error('[EmploymentInformationSlice] fetchById rejected:', error);
      })

    // ========================================================================
    // Create Employment Information
    // ========================================================================
      .addCase(createEmploymentInformation.pending, (state) => {
        state.createLoading = 'pending';
        state.createError = null;
      })
      .addCase(createEmploymentInformation.fulfilled, (state) => {
        state.createLoading = 'succeeded';
        state.createError = null;
        // Note: Items are refreshed via fetchAll dispatch in the thunk
      })
      .addCase(createEmploymentInformation.rejected, (state, action) => {
        state.createLoading = 'failed';
        const error = action.payload as ApiError;
        state.createError = error?.message || 'Failed to create employment information';
        console.error('[EmploymentInformationSlice] create rejected:', error);
      })

    // ========================================================================
    // Update Employment Information
    // ========================================================================
      .addCase(updateEmploymentInformation.pending, (state) => {
        state.updateLoading = 'pending';
        state.updateError = null;
      })
      .addCase(updateEmploymentInformation.fulfilled, (state) => {
        state.updateLoading = 'succeeded';
        state.updateError = null;
        // Note: Items are refreshed via fetchAll dispatch in the thunk
      })
      .addCase(updateEmploymentInformation.rejected, (state, action) => {
        state.updateLoading = 'failed';
        const error = action.payload as ApiError;
        state.updateError = error?.message || 'Failed to update employment information';
        console.error('[EmploymentInformationSlice] update rejected:', error);
      })

    // ========================================================================
    // Delete Employment Information
    // ========================================================================
      .addCase(deleteEmploymentInformation.pending, (state) => {
        state.deleteLoading = 'pending';
        state.deleteError = null;
      })
      .addCase(deleteEmploymentInformation.fulfilled, (state) => {
        state.deleteLoading = 'succeeded';
        state.deleteError = null;
        // Note: Items are refreshed via fetchAll dispatch in the thunk
      })
      .addCase(deleteEmploymentInformation.rejected, (state, action) => {
        state.deleteLoading = 'failed';
        const error = action.payload as ApiError;
        state.deleteError = error?.message || 'Failed to delete employment information';
        console.error('[EmploymentInformationSlice] delete rejected:', error);
      });
  },
});

// ============================================================================
// Action Creators
// ============================================================================

export const {
  clearErrors,
  clearCurrentItem,
  setCurrentItem,
  clearError,
  updateItemInList,
  removeItemFromList,
  resetState,
} = employmentInformationSlice.actions;

// ============================================================================
// Selectors
// ============================================================================

/**
 * Select the entire employment information state
 */
export const selectEmploymentInformationState = (state: RootState) => 
  state.employmentInformation;

/**
 * Select all employment information items
 */
export const selectAllEmploymentInformation = (state: RootState) => 
  state.employmentInformation.items;

/**
 * Select the current employment information item
 */
export const selectCurrentEmploymentInformation = (state: RootState) => 
  state.employmentInformation.currentItem;

/**
 * Select loading states
 */
export const selectEmploymentInformationLoading = (state: RootState) => ({
  list: state.employmentInformation.listLoading === 'pending',
  item: state.employmentInformation.itemLoading === 'pending',
  create: state.employmentInformation.createLoading === 'pending',
  update: state.employmentInformation.updateLoading === 'pending',
  delete: state.employmentInformation.deleteLoading === 'pending',
});

/**
 * Select error states
 */
export const selectEmploymentInformationErrors = (state: RootState) => ({
  list: state.employmentInformation.listError,
  item: state.employmentInformation.itemError,
  create: state.employmentInformation.createError,
  update: state.employmentInformation.updateError,
  delete: state.employmentInformation.deleteError,
});

/**
 * Select employment information by ID
 * @param id - The ID to search for
 */
export const selectEmploymentInformationById = (id: number) => (state: RootState) =>
  state.employmentInformation.items.find(item => item.id === id);

/**
 * Select employment information by employee ID
 * @param empInfoId - The employee info ID to search for
 */
export const selectEmploymentInformationByEmpId = (empInfoId: number) => (state: RootState) =>
  state.employmentInformation.items.filter(item => item.emp_info_id === empInfoId);

/**
 * Select employment information statistics
 */
export const selectEmploymentInformationStats = (state: RootState) => {
  const items = state.employmentInformation.items;
  return {
    total: items.length,
    w2Count: items.filter(item => item.employment_type === 'W2').length,
    contractorCount: items.filter(item => item.employment_type === '1099').length,
    withUniformCount: items.filter(item => item.has_uniform).length,
    hasData: items.length > 0,
    lastFetch: state.employmentInformation.lastFetch,
  };
};

/**
 * Check if any operation is currently loading
 */
export const selectIsAnyLoading = (state: RootState) => {
  const { listLoading, itemLoading, createLoading, updateLoading, deleteLoading } = 
    state.employmentInformation;
  return [listLoading, itemLoading, createLoading, updateLoading, deleteLoading]
    .some(loading => loading === 'pending');
};

/**
 * Check if there are any errors
 */
export const selectHasAnyError = (state: RootState) => {
  const { listError, itemError, createError, updateError, deleteError } = 
    state.employmentInformation;
  return Boolean(listError || itemError || createError || updateError || deleteError);
};

// ============================================================================
// Default Export
// ============================================================================

export default employmentInformationSlice.reducer;

// ============================================================================
// Type Exports for External Use
// ============================================================================

export type { EmploymentInformationState };
