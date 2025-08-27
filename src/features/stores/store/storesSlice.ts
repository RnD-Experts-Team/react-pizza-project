/**
 * Stores Redux Slice
 * Manages store state, async operations, and related business logic
 * using Redux Toolkit with createSlice and createAsyncThunk
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Store,
  StoreUser,
  StoreRole,
  StoresState,
  GetStoresParams,
  CreateStorePayload,
  UpdateStorePayload,
  PaginatedStores,
  ApiError,
  SerializedError,
} from '../types';
import  {  DEFAULT_PAGINATION} from '../types';
import { storeApiService } from '../services/api';

// ============================================================================
// Initial State
// ============================================================================

const initialAsyncState = {
  loading: false,
  error: null,
};

const initialState: StoresState = {
  // Data
  stores: null,
  currentStore: null,
  storeUsers: {},
  storeRoles: {},
  
  // Async states
  asyncStates: {
    fetchStores: { ...initialAsyncState },
    fetchStore: { ...initialAsyncState },
    createStore: { ...initialAsyncState },
    updateStore: { ...initialAsyncState },
    fetchStoreUsers: { ...initialAsyncState },
    fetchStoreRoles: { ...initialAsyncState },
  },
  
  // UI state
  selectedStoreId: null,
  searchQuery: '',
  currentPage: DEFAULT_PAGINATION.page,
  perPage: DEFAULT_PAGINATION.perPage,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch stores with pagination and search
 */
export const fetchStores = createAsyncThunk<
  PaginatedStores,
  GetStoresParams | undefined,
  {
    rejectValue: SerializedError;
  }
>(
  'stores/fetchStores',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await storeApiService.getStores(params);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Failed to fetch stores',
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Fetch a single store by ID
 */
export const fetchStoreById = createAsyncThunk<
  Store,
  string,
  {
    rejectValue: SerializedError;
  }
>(
  'stores/fetchStoreById',
  async (storeId, { rejectWithValue }) => {
    try {
      if (!storeId.trim()) {
        throw new Error('Store ID is required');
      }
      
      const store = await storeApiService.getStore(storeId);
      return store;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || `Failed to fetch store ${storeId}`,
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Create a new store
 */
export const createStore = createAsyncThunk<
  Store,
  CreateStorePayload,
  {
    rejectValue: SerializedError;
  }
>(
  'stores/createStore',
  async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
      // Validate payload
      if (!payload.id || !payload.name) {
        throw new Error('Store ID and name are required');
      }
      
      const newStore = await storeApiService.createStore(payload);
      
      // Refresh stores list after creation
      const state = getState() as { stores: StoresState };
      dispatch(fetchStores({
        page: state.stores.currentPage,
        per_page: state.stores.perPage,
        search: state.stores.searchQuery,
      }));
      
      return newStore;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Failed to create store',
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Update an existing store
 */
export const updateStore = createAsyncThunk<
  Store,
  { storeId: string; payload: UpdateStorePayload },
  {
    rejectValue: SerializedError;
  }
>(
  'stores/updateStore',
  async ({ storeId, payload }, { rejectWithValue, dispatch, getState }) => {
    try {
      if (!storeId.trim()) {
        throw new Error('Store ID is required');
      }
      
      const updatedStore = await storeApiService.updateStore(storeId, payload);
      
      // Refresh stores list after update
      const state = getState() as { stores: StoresState };
      dispatch(fetchStores({
        page: state.stores.currentPage,
        per_page: state.stores.perPage,
        search: state.stores.searchQuery,
      }));
      
      return updatedStore;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || `Failed to update store ${storeId}`,
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Fetch users for a specific store
 */
export const fetchStoreUsers = createAsyncThunk<
  { storeId: string; users: StoreUser[] },
  string,
  {
    rejectValue: SerializedError;
  }
>(
  'stores/fetchStoreUsers',
  async (storeId, { rejectWithValue }) => {
    try {
      if (!storeId.trim()) {
        throw new Error('Store ID is required');
      }
      
      const users = await storeApiService.getStoreUsers(storeId);
      return { storeId, users };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || `Failed to fetch users for store ${storeId}`,
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Fetch roles for a specific store
 */
export const fetchStoreRoles = createAsyncThunk<
  { storeId: string; roles: StoreRole[] },
  string,
  {
    rejectValue: SerializedError;
  }
>(
  'stores/fetchStoreRoles',
  async (storeId, { rejectWithValue }) => {
    try {
      if (!storeId.trim()) {
        throw new Error('Store ID is required');
      }
      
      const roles = await storeApiService.getStoreRoles(storeId);
      return { storeId, roles };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || `Failed to fetch roles for store ${storeId}`,
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Search stores with debounced effect
 */
export const searchStores = createAsyncThunk<
  PaginatedStores,
  { query: string; page?: number },
  {
    rejectValue: SerializedError;
  }
>(
  'stores/searchStores',
  async ({ query, page = 1 }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { stores: StoresState };
      
      const result = await storeApiService.searchStores(query, {
        page,
        per_page: state.stores.perPage,
      });
      
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Failed to search stores',
        status: apiError.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// ============================================================================
// Slice Definition
// ============================================================================

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    // ========================================================================
    // Synchronous Actions
    // ========================================================================
    
    /**
     * Clear all error states
     */
    clearErrors: (state) => {
      Object.keys(state.asyncStates).forEach(key => {
        const asyncState = state.asyncStates[key as keyof typeof state.asyncStates];
        asyncState.error = null;
      });
    },
    
    /**
     * Clear specific error by operation type
     */
    clearError: (state, action: PayloadAction<keyof StoresState['asyncStates']>) => {
      state.asyncStates[action.payload].error = null;
    },
    
    /**
     * Set selected store ID
     */
    setSelectedStoreId: (state, action: PayloadAction<string | null>) => {
      state.selectedStoreId = action.payload;
    },
    
    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /**
     * Set current page
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload);
    },
    
    /**
     * Set items per page
     */
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = Math.max(1, Math.min(100, action.payload)); // Limit between 1-100
      state.currentPage = 1; // Reset to first page when changing page size
    },
    
    /**
     * Reset stores state to initial values
     */
    resetStoresState: () => {
      return { ...initialState };
    },
    
    /**
     * Reset pagination to defaults
     */
    resetPagination: (state) => {
      state.currentPage = DEFAULT_PAGINATION.page;
      state.perPage = DEFAULT_PAGINATION.perPage;
      state.searchQuery = '';
    },
    
    /**
     * Clear current store
     */
    clearCurrentStore: (state) => {
      state.currentStore = null;
    },
    
    /**
     * Clear store users cache
     */
    clearStoreUsers: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        delete state.storeUsers[action.payload];
      } else {
        state.storeUsers = {};
      }
    },
    
    /**
     * Clear store roles cache
     */
    clearStoreRoles: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        delete state.storeRoles[action.payload];
      } else {
        state.storeRoles = {};
      }
    },
    
    /**
     * Update store in the stores list (optimistic update)
     */
    updateStoreInList: (state, action: PayloadAction<Store>) => {
      if (state.stores?.stores) {
        const index = state.stores.stores.findIndex(store => store.id === action.payload.id);
        if (index !== -1) {
          state.stores.stores[index] = action.payload;
        }
      }
    },
    
    /**
     * Remove store from list (for delete operations)
     */
    removeStoreFromList: (state, action: PayloadAction<string>) => {
      if (state.stores?.stores) {
        state.stores.stores = state.stores.stores.filter(store => store.id !== action.payload);
        
        // Update pagination total
        if (state.stores.pagination) {
          state.stores.pagination.total = Math.max(0, state.stores.pagination.total - 1);
        }
      }
    },
  },
  
  // ========================================================================
  // Extra Reducers for Async Thunks
  // ========================================================================
  extraReducers: (builder) => {
    // Fetch Stores
    builder
      .addCase(fetchStores.pending, (state) => {
        state.asyncStates.fetchStores.loading = true;
        state.asyncStates.fetchStores.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.asyncStates.fetchStores.loading = false;
        state.stores = action.payload;
        state.currentPage = action.payload.pagination.current_page;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.asyncStates.fetchStores.loading = false;
        state.asyncStates.fetchStores.error = action.payload?.message || 'Failed to fetch stores';
      });
    
    // Fetch Store by ID
    builder
      .addCase(fetchStoreById.pending, (state) => {
        state.asyncStates.fetchStore.loading = true;
        state.asyncStates.fetchStore.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.asyncStates.fetchStore.loading = false;
        state.currentStore = action.payload;
        state.selectedStoreId = action.payload.id;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.asyncStates.fetchStore.loading = false;
        state.asyncStates.fetchStore.error = action.payload?.message || 'Failed to fetch store';
        state.currentStore = null;
      });
    
    // Create Store
    builder
      .addCase(createStore.pending, (state) => {
        state.asyncStates.createStore.loading = true;
        state.asyncStates.createStore.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.asyncStates.createStore.loading = false;
        
        // Optimistically add to stores list if it exists
        if (state.stores?.stores) {
          state.stores.stores.unshift(action.payload);
          
          // Update pagination total
          if (state.stores.pagination) {
            state.stores.pagination.total += 1;
          }
        }
      })
      .addCase(createStore.rejected, (state, action) => {
        state.asyncStates.createStore.loading = false;
        state.asyncStates.createStore.error = action.payload?.message || 'Failed to create store';
      });
    
    // Update Store
    builder
      .addCase(updateStore.pending, (state) => {
        state.asyncStates.updateStore.loading = true;
        state.asyncStates.updateStore.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.asyncStates.updateStore.loading = false;
        
        // Update current store if it matches
        if (state.currentStore?.id === action.payload.id) {
          state.currentStore = action.payload;
        }
        
        // Update in stores list
        if (state.stores?.stores) {
          const index = state.stores.stores.findIndex(store => store.id === action.payload.id);
          if (index !== -1) {
            state.stores.stores[index] = action.payload;
          }
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.asyncStates.updateStore.loading = false;
        state.asyncStates.updateStore.error = action.payload?.message || 'Failed to update store';
      });
    
    // Fetch Store Users
    builder
      .addCase(fetchStoreUsers.pending, (state) => {
        state.asyncStates.fetchStoreUsers.loading = true;
        state.asyncStates.fetchStoreUsers.error = null;
      })
      .addCase(fetchStoreUsers.fulfilled, (state, action) => {
        state.asyncStates.fetchStoreUsers.loading = false;
        state.storeUsers[action.payload.storeId] = action.payload.users;
      })
      .addCase(fetchStoreUsers.rejected, (state, action) => {
        state.asyncStates.fetchStoreUsers.loading = false;
        state.asyncStates.fetchStoreUsers.error = action.payload?.message || 'Failed to fetch store users';
      });
    
    // Fetch Store Roles
    builder
      .addCase(fetchStoreRoles.pending, (state) => {
        state.asyncStates.fetchStoreRoles.loading = true;
        state.asyncStates.fetchStoreRoles.error = null;
      })
      .addCase(fetchStoreRoles.fulfilled, (state, action) => {
        state.asyncStates.fetchStoreRoles.loading = false;
        state.storeRoles[action.payload.storeId] = action.payload.roles;
      })
      .addCase(fetchStoreRoles.rejected, (state, action) => {
        state.asyncStates.fetchStoreRoles.loading = false;
        state.asyncStates.fetchStoreRoles.error = action.payload?.message || 'Failed to fetch store roles';
      });
    
    // Search Stores
    builder
      .addCase(searchStores.pending, (state) => {
        state.asyncStates.fetchStores.loading = true;
        state.asyncStates.fetchStores.error = null;
      })
      .addCase(searchStores.fulfilled, (state, action) => {
        state.asyncStates.fetchStores.loading = false;
        state.stores = action.payload;
        state.currentPage = action.payload.pagination.current_page;
      })
      .addCase(searchStores.rejected, (state, action) => {
        state.asyncStates.fetchStores.loading = false;
        state.asyncStates.fetchStores.error = action.payload?.message || 'Failed to search stores';
      });
  },
});

// ============================================================================
// Export Actions and Reducer
// ============================================================================

export const {
  clearErrors,
  clearError,
  setSelectedStoreId,
  setSearchQuery,
  setCurrentPage,
  setPerPage,
  resetStoresState,
  resetPagination,
  clearCurrentStore,
  clearStoreUsers,
  clearStoreRoles,
  updateStoreInList,
  removeStoreFromList,
} = storesSlice.actions;

export default storesSlice.reducer;

// ============================================================================
// Selector Helpers
// ============================================================================

/**
 * Memoized selectors for better performance
 */
export const selectStores = (state: { stores: StoresState }) => state.stores.stores?.stores || [];
export const selectStoresPagination = (state: { stores: StoresState }) => state.stores.stores?.pagination;
export const selectCurrentStore = (state: { stores: StoresState }) => state.stores.currentStore;
export const selectSelectedStoreId = (state: { stores: StoresState }) => state.stores.selectedStoreId;
export const selectSearchQuery = (state: { stores: StoresState }) => state.stores.searchQuery;
export const selectCurrentPage = (state: { stores: StoresState }) => state.stores.currentPage;
export const selectPerPage = (state: { stores: StoresState }) => state.stores.perPage;

/**
 * Select store users by store ID
 */
export const selectStoreUsers = (storeId: string) => 
  (state: { stores: StoresState }) => state.stores.storeUsers[storeId] || [];

/**
 * Select store roles by store ID
 */
export const selectStoreRoles = (storeId: string) => 
  (state: { stores: StoresState }) => state.stores.storeRoles[storeId] || [];

/**
 * Select loading states
 */
export const selectStoresLoading = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStores.loading;
export const selectStoreLoading = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStore.loading;
export const selectCreateStoreLoading = (state: { stores: StoresState }) => state.stores.asyncStates.createStore.loading;
export const selectUpdateStoreLoading = (state: { stores: StoresState }) => state.stores.asyncStates.updateStore.loading;
export const selectStoreUsersLoading = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStoreUsers.loading;
export const selectStoreRolesLoading = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStoreRoles.loading;

/**
 * Select error states
 */
export const selectStoresError = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStores.error;
export const selectStoreError = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStore.error;
export const selectCreateStoreError = (state: { stores: StoresState }) => state.stores.asyncStates.createStore.error;
export const selectUpdateStoreError = (state: { stores: StoresState }) => state.stores.asyncStates.updateStore.error;
export const selectStoreUsersError = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStoreUsers.error;
export const selectStoreRolesError = (state: { stores: StoresState }) => state.stores.asyncStates.fetchStoreRoles.error;

/**
 * Combined loading selector for any store operation
 */
export const selectAnyStoreLoading = (state: { stores: StoresState }) => {
  return Object.values(state.stores.asyncStates).some(asyncState => asyncState.loading);
};

/**
 * Get store by ID from current stores list
 */
export const selectStoreById = (storeId: string) => 
  (state: { stores: StoresState }) => {
    return state.stores.stores?.stores.find(store => store.id === storeId) || null;
  };
