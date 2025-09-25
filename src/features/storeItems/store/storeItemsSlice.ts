// store/slices/pizzaStoreItemsSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { pizzaStoreService } from '../services/api';
import {
  type PizzaStoreItemsState,
  type PizzaStoreItemsResponse,
  type FetchStoreItemsParams,
  ApiError,
  LOADING_STATES,
  isApiError,
} from '../types';

/**
 * Initial state for the pizza store items slice
 */
const initialState: PizzaStoreItemsState = {
  loadingState: LOADING_STATES.IDLE,
  itemsByStore: {},
  storeMetadata: {},
  error: null,
  currentStoreId: null,
};

/**
 * Async thunk to fetch store items
 * Handles the API call and error transformation
 */
export const fetchStoreItems = createAsyncThunk<
  PizzaStoreItemsResponse,
  FetchStoreItemsParams,
  {
    rejectValue: ApiError;
  }
>(
  'pizzaStoreItems/fetchStoreItems',
  async (params, { rejectWithValue }) => {
    try {
      const response = await pizzaStoreService.fetchStoreItems(
        params.storeId,
        params.forceRefresh
      );
      return response;
    } catch (error) {
      if (isApiError(error)) {
        return rejectWithValue(error);
      }
      return rejectWithValue(
        new ApiError('Failed to fetch store items', 500, 'FETCH_ERROR')
      );
    }
  }
);

/**
 * Async thunk to clear store cache
 * Clears both service cache and Redux state
 */
export const clearStoreCache = createAsyncThunk<
  string,
  string,
  {
    rejectValue: ApiError;
  }
>(
  'pizzaStoreItems/clearStoreCache',
  async (storeId, { rejectWithValue }) => {
    try {
      pizzaStoreService.clearStoreCache(storeId);
      return storeId;
    } catch (error) {
      return rejectWithValue(
        new ApiError('Failed to clear store cache', 500, 'CLEAR_CACHE_ERROR')
      );
    }
  }
);

/**
 * Pizza store items slice
 * Manages the state for pizza store menu items
 */
const pizzaStoreItemsSlice = createSlice({
  name: 'pizzaStoreItems',
  initialState,
  reducers: {
    /**
     * Set the current store ID
     */
    setCurrentStoreId: (state, action: PayloadAction<string | null>) => {
      state.currentStoreId = action.payload;
    },

    /**
     * Clear the current error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear items for a specific store
     */
    clearStoreItems: (state, action: PayloadAction<string>) => {
      const storeId = action.payload;
      delete state.itemsByStore[storeId];
      delete state.storeMetadata[storeId];
    },

    /**
     * Clear all cached items
     */
    clearAllItems: (state) => {
      state.itemsByStore = {};
      state.storeMetadata = {};
      state.currentStoreId = null;
      // Also clear service cache
      pizzaStoreService.clearCache();
    },

    /**
     * Reset loading state to idle
     */
    resetLoadingState: (state) => {
      state.loadingState = LOADING_STATES.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStoreItems pending
      .addCase(fetchStoreItems.pending, (state, action) => {
        state.loadingState = LOADING_STATES.PENDING;
        state.error = null;
        state.currentStoreId = action.meta.arg.storeId;
      })
      // Handle fetchStoreItems fulfilled
      .addCase(fetchStoreItems.fulfilled, (state, action) => {
        state.loadingState = LOADING_STATES.FULFILLED;
        state.error = null;
        
        const response = action.payload;
        const storeId = response.store;
        
        // Store the items
        state.itemsByStore[storeId] = response.items;
        
        // Store metadata
        state.storeMetadata[storeId] = {
          count: response.count,
          lastFetched: new Date().toISOString(),
          storeId,
        };
        
        state.currentStoreId = storeId;
      })
      // Handle fetchStoreItems rejected
      .addCase(fetchStoreItems.rejected, (state, action) => {
        state.loadingState = LOADING_STATES.REJECTED;
        state.error = action.payload || new ApiError('Unknown error occurred', 500, 'UNKNOWN_ERROR');
      })
      // Handle clearStoreCache fulfilled
      .addCase(clearStoreCache.fulfilled, (state, action) => {
        const storeId = action.payload;
        delete state.itemsByStore[storeId];
        delete state.storeMetadata[storeId];
        if (state.currentStoreId === storeId) {
          state.currentStoreId = null;
        }
      })
      // Handle clearStoreCache rejected
      .addCase(clearStoreCache.rejected, (state, action) => {
        state.error = action.payload || new ApiError('Failed to clear cache', 500, 'CLEAR_CACHE_ERROR');
      });
  },
});

// Export actions
export const {
  setCurrentStoreId,
  clearError,
  clearStoreItems,
  clearAllItems,
  resetLoadingState,
} = pizzaStoreItemsSlice.actions;

// Export selectors
export const selectPizzaStoreItems = (state: { storeItems: PizzaStoreItemsState }) =>
  state.storeItems;

export const selectItemsByStore = (storeId: string) =>
  (state: { storeItems: PizzaStoreItemsState }) =>
    state.storeItems.itemsByStore[storeId] || [];

export const selectCurrentItems = (state: { storeItems: PizzaStoreItemsState }) => {
  const { currentStoreId, itemsByStore } = state.storeItems;
  return currentStoreId ? itemsByStore[currentStoreId] || [] : [];
};

export const selectLoadingState = (state: { storeItems: PizzaStoreItemsState }) =>
  state.storeItems.loadingState;

export const selectIsLoading = (state: { storeItems: PizzaStoreItemsState }) =>
  state.storeItems.loadingState === LOADING_STATES.PENDING;

export const selectError = (state: { storeItems: PizzaStoreItemsState }) =>
  state.storeItems.error;

export const selectCurrentStoreId = (state: { storeItems: PizzaStoreItemsState }) =>
  state.storeItems.currentStoreId;

export const selectStoreMetadata = (storeId: string) =>
  (state: { storeItems: PizzaStoreItemsState }) =>
    state.storeItems.storeMetadata[storeId];

export const selectHasDataForStore = (storeId: string) =>
  (state: { storeItems: PizzaStoreItemsState }) =>
    Boolean(state.storeItems.itemsByStore[storeId]?.length);

export const selectAllStoreIds = (state: { storeItems: PizzaStoreItemsState }) =>
  Object.keys(state.storeItems.itemsByStore);

// Export reducer as default
export default pizzaStoreItemsSlice.reducer;
