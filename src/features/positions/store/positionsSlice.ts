/**
 * Position Redux Slice
 * 
 * This slice manages the position state using Redux Toolkit with createSlice
 * and createAsyncThunk for async operations. It provides comprehensive state
 * management for all CRUD operations with proper loading and error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type {
  Position,
  CreatePositionDto,
  UpdatePositionDto,
  PositionsState,
  PositionsQueryParams,
  ApiError,
  AsyncThunkConfig
} from '../types';
import { positionApiService } from '../services/api';

/**
 * Initial state for the positions slice
 * Provides default values for all state properties
 */
const initialState: PositionsState = {
  positions: [],
  selectedPosition: null,
  loading: {
    list: false,
    single: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    list: null,
    single: null,
    create: null,
    update: null,
    delete: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  },
  ui: {
    isCreateModalOpen: false,
    isEditModalOpen: false,
    deletingId: null,
  },
};

// ================================
// Async Thunk Actions
// ================================

/**
 * Async thunk to fetch all positions with optional query parameters
 * @param params - Query parameters for filtering and pagination
 */
export const fetchPositions = createAsyncThunk<
  Position[],
  PositionsQueryParams | undefined,
  AsyncThunkConfig
>(
  'positions/fetchPositions',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Starting fetchPositions with params:', params);
      
      const positions = await positionApiService.getAllPositions(params);
      
      console.log(`✅ Redux: Successfully fetched ${positions.length} positions`);
      return positions;
      
    } catch (error) {
      const apiError = error as ApiError;
      console.error('❌ Redux: fetchPositions failed:', apiError);
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk to fetch a single position by ID
 * @param id - Position ID to fetch
 */
export const fetchPositionById = createAsyncThunk<
  Position,
  number,
  AsyncThunkConfig
>(
  'positions/fetchPositionById',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Starting fetchPositionById for ID: ${id}`);
      
      const position = await positionApiService.getPositionById(id);
      
      console.log(`✅ Redux: Successfully fetched position: ${position.name}`);
      return position;
      
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`❌ Redux: fetchPositionById failed for ID ${id}:`, apiError);
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk to create a new position
 * @param positionData - Data for creating the position
 */
export const createPosition = createAsyncThunk<
  Position,
  CreatePositionDto,
  AsyncThunkConfig
>(
  'positions/createPosition',
  async (positionData, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Starting createPosition with data:', positionData);
      
      const newPosition = await positionApiService.createPosition(positionData);
      
      console.log(`✅ Redux: Successfully created position: ${newPosition.name} (ID: ${newPosition.id})`);
      return newPosition;
      
    } catch (error) {
      const apiError = error as ApiError;
      console.error('❌ Redux: createPosition failed:', apiError);
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk to update an existing position
 * @param payload - Object containing position ID and update data
 */
export const updatePosition = createAsyncThunk<
  Position,
  { id: number; data: UpdatePositionDto },
  AsyncThunkConfig
>(
  'positions/updatePosition',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Starting updatePosition for ID ${id} with data:`, data);
      
      const updatedPosition = await positionApiService.updatePosition(id, data);
      
      console.log(`✅ Redux: Successfully updated position: ${updatedPosition.name} (ID: ${updatedPosition.id})`);
      return updatedPosition;
      
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`❌ Redux: updatePosition failed for ID ${id}:`, apiError);
      return rejectWithValue(apiError);
    }
  }
);

/**
 * Async thunk to delete a position
 * @param id - Position ID to delete
 */
export const deletePosition = createAsyncThunk<
  number,
  number,
  AsyncThunkConfig
>(
  'positions/deletePosition',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Starting deletePosition for ID: ${id}`);
      
      await positionApiService.deletePosition(id);
      
      console.log(`✅ Redux: Successfully deleted position with ID: ${id}`);
      return id;
      
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`❌ Redux: deletePosition failed for ID ${id}:`, apiError);
      return rejectWithValue(apiError);
    }
  }
);

// ================================
// Positions Slice
// ================================

/**
 * Positions slice with reducers and extra reducers for async actions
 * Provides state management for all position-related operations
 */
const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    /**
     * Sets the currently selected position
     * @param state - Current state
     * @param action - Action containing position to select
     */
    setSelectedPosition: (state, action: PayloadAction<Position | null>) => {
      state.selectedPosition = action.payload;
      // Clear single position errors when setting new selection
      state.error.single = null;
    },

    /**
     * Clears the currently selected position
     * @param state - Current state
     */
    clearSelectedPosition: (state) => {
      state.selectedPosition = null;
      state.error.single = null;
    },

    /**
     * Opens the create position modal
     * @param state - Current state
     */
    openCreateModal: (state) => {
      state.ui.isCreateModalOpen = true;
      state.error.create = null; // Clear any previous create errors
    },

    /**
     * Closes the create position modal
     * @param state - Current state
     */
    closeCreateModal: (state) => {
      state.ui.isCreateModalOpen = false;
      state.error.create = null;
    },

    /**
     * Opens the edit position modal
     * @param state - Current state
     */
    openEditModal: (state) => {
      state.ui.isEditModalOpen = true;
      state.error.update = null; // Clear any previous update errors
    },

    /**
     * Closes the edit position modal
     * @param state - Current state
     */
    closeEditModal: (state) => {
      state.ui.isEditModalOpen = false;
      state.error.update = null;
    },

    /**
     * Sets the position ID being deleted (for confirmation dialogs)
     * @param state - Current state
     * @param action - Action containing position ID to delete
     */
    setDeletingId: (state, action: PayloadAction<number | null>) => {
      state.ui.deletingId = action.payload;
      if (action.payload === null) {
        state.error.delete = null; // Clear delete errors when cancelling
      }
    },

    /**
     * Clears all error states
     * @param state - Current state
     */
    clearAllErrors: (state) => {
      state.error = {
        list: null,
        single: null,
        create: null,
        update: null,
        delete: null,
      };
    },

    /**
     * Clears specific error by operation type
     * @param state - Current state
     * @param action - Action containing error type to clear
     */
    clearError: (state, action: PayloadAction<keyof PositionsState['error']>) => {
      state.error[action.payload] = null;
    },

    /**
     * Updates pagination metadata
     * @param state - Current state
     * @param action - Action containing pagination data
     */
    updatePagination: (state, action: PayloadAction<Partial<PositionsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    /**
     * Resets the entire positions state to initial values
     * @param state - Current state
     */
    resetPositionsState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // ================================
    // Fetch Positions (List)
    // ================================
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.loading.list = false;
        state.positions = action.payload;
        state.error.list = null;
        
        // Update pagination if we have the data
        // Note: Since API returns simple array, we'll estimate pagination
        if (action.meta.arg?.per_page) {
          state.pagination.perPage = action.meta.arg.per_page;
        }
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload?.message || 'Failed to fetch positions';
        console.error('❌ Redux: fetchPositions rejected:', action.payload);
      });

    // ================================
    // Fetch Single Position
    // ================================
    builder
      .addCase(fetchPositionById.pending, (state) => {
        state.loading.single = true;
        state.error.single = null;
      })
      .addCase(fetchPositionById.fulfilled, (state, action) => {
        state.loading.single = false;
        state.selectedPosition = action.payload;
        state.error.single = null;
      })
      .addCase(fetchPositionById.rejected, (state, action) => {
        state.loading.single = false;
        state.selectedPosition = null;
        state.error.single = action.payload?.message || 'Failed to fetch position';
        console.error('❌ Redux: fetchPositionById rejected:', action.payload);
      });

    // ================================
    // Create Position
    // ================================
    builder
      .addCase(createPosition.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.loading.create = false;
        state.error.create = null;
        
        // Add new position to the list
        state.positions.unshift(action.payload);
        
        // Update pagination total
        state.pagination.total += 1;
        
        // Close create modal
        state.ui.isCreateModalOpen = false;
        
        // Set as selected position
        state.selectedPosition = action.payload;
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload?.message || 'Failed to create position';
        console.error('❌ Redux: createPosition rejected:', action.payload);
      });

    // ================================
    // Update Position
    // ================================
    builder
      .addCase(updatePosition.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.loading.update = false;
        state.error.update = null;
        
        // Update position in the list
        const index = state.positions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
        
        // Update selected position if it's the same one
        if (state.selectedPosition?.id === action.payload.id) {
          state.selectedPosition = action.payload;
        }
        
        // Close edit modal
        state.ui.isEditModalOpen = false;
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload?.message || 'Failed to update position';
        console.error('❌ Redux: updatePosition rejected:', action.payload);
      });

    // ================================
    // Delete Position
    // ================================
    builder
      .addCase(deletePosition.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.error.delete = null;
        
        const deletedId = action.payload;
        
        // Remove position from the list
        state.positions = state.positions.filter(p => p.id !== deletedId);
        
        // Clear selected position if it was the deleted one
        if (state.selectedPosition?.id === deletedId) {
          state.selectedPosition = null;
        }
        
        // Update pagination total
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        
        // Clear deleting ID
        state.ui.deletingId = null;
      })
      .addCase(deletePosition.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload?.message || 'Failed to delete position';
        state.ui.deletingId = null; // Clear deleting ID even on failure
        console.error('❌ Redux: deletePosition rejected:', action.payload);
      });
  },
});

// ================================
// Export Actions and Selectors
// ================================

/**
 * Synchronous action creators from the slice
 */
export const {
  setSelectedPosition,
  clearSelectedPosition,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setDeletingId,
  clearAllErrors,
  clearError,
  updatePagination,
  resetPositionsState,
} = positionsSlice.actions;

/**
 * Selector functions for accessing positions state
 * These provide typed access to specific parts of the state
 */
export const selectPositions = (state: { positions: PositionsState }) => state.positions.positions;
export const selectSelectedPosition = (state: { positions: PositionsState }) => state.positions.selectedPosition;
export const selectPositionsLoading = (state: { positions: PositionsState }) => state.positions.loading;
export const selectPositionsError = (state: { positions: PositionsState }) => state.positions.error;
export const selectPositionsPagination = (state: { positions: PositionsState }) => state.positions.pagination;
export const selectPositionsUI = (state: { positions: PositionsState }) => state.positions.ui;

/**
 * Memoized selector to check if any operation is loading
 */
export const selectIsAnyLoading = (state: { positions: PositionsState }) => {
  const { loading } = state.positions;
  return loading.list || loading.single || loading.create || loading.update || loading.delete;
};

/**
 * Memoized selector to get position by ID
 */
export const selectPositionById = (id: number) => (state: { positions: PositionsState }) =>
  state.positions.positions.find(position => position.id === id);

/**
 * Export the reducer as default
 */
export default positionsSlice.reducer;

/**
 * Type export for the positions state shape
 * Useful for typing components and hooks
 */
export type { PositionsState };
