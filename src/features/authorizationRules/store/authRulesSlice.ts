/**
 * Redux Toolkit Slice for Authorization Rules Management
 * 
 * This slice manages the complete state for auth rules feature:
 * - Async thunks for all 5 API operations
 * - Loading states per operation type
 * - Comprehensive error handling and state updates
 * - Optimistic updates for better UX
 * - Memoized selectors to prevent unnecessary re-renders
 * - Follows RTK best practices with extraReducers
 */

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import { authRulesService } from '../services/api';
import type {
  AuthRulesState,
  AuthRule,
  FetchAuthRulesParams,
  CreateAuthRuleRequest,
  TestAuthRuleRequest,
  StandardizedError,
  FetchAuthRulesResponse,
  CreateAuthRuleResponse,
  TestAuthRuleResponse,
  ToggleAuthRuleStatusResponse,
} from '../types';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthRulesState = {
  // Data
  rules: [],
  pagination: null,
  testResult: null,
  
  // UI State
  loading: {
    fetching: false,
    creating: false,
    testing: false,
    toggling: {},
  },
  error: null,
  successMessage: null,
  
  // Filters & Search
  filters: {
    service: '',
    search: '',
    currentPage: 1,
    perPage: 15,
  },
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch authorization rules with optional filtering and pagination
 * Handles search, service filtering, and pagination state updates
 */
export const fetchAuthRules = createAsyncThunk<
  FetchAuthRulesResponse,
  FetchAuthRulesParams | undefined,
  { rejectValue: StandardizedError }
>(
  'authRules/fetchAuthRules',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await authRulesService.fetchAuthRules(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as StandardizedError);
    }
  }
);

/**
 * Create a new authorization rule
 * Shows success message and refreshes the rules list on success
 */
export const createAuthRule = createAsyncThunk<
  CreateAuthRuleResponse,
  CreateAuthRuleRequest,
  { rejectValue: StandardizedError }
>(
  'authRules/createAuthRule',
  async (ruleData, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await authRulesService.createAuthRule(ruleData);
      
      // Refresh the rules list after successful creation
      // Get current filters from state to maintain search/filter state
      const state = getState() as { authRules: AuthRulesState };
      const { filters } = state.authRules;
      
      dispatch(fetchAuthRules({
        service: filters.service,
        search: filters.search,
        page: filters.currentPage,
        per_page: filters.perPage,
      }));
      
      return response;
    } catch (error) {
      return rejectWithValue(error as StandardizedError);
    }
  }
);

/**
 * Test authorization rule path DSL matching
 * Used for validating path patterns before rule creation
 */
export const testAuthRule = createAsyncThunk<
  TestAuthRuleResponse,
  TestAuthRuleRequest,
  { rejectValue: StandardizedError }
>(
  'authRules/testAuthRule',
  async (testData, { rejectWithValue }) => {
    try {
      const response = await authRulesService.testAuthRule(testData);
      return response;
    } catch (error) {
      return rejectWithValue(error as StandardizedError);
    }
  }
);

/**
 * Toggle authorization rule active status
 * Uses optimistic updates for better UX - updates UI immediately, reverts on error
 */
export const toggleAuthRuleStatus = createAsyncThunk<
  ToggleAuthRuleStatusResponse,
  number,
  { rejectValue: StandardizedError & { ruleId: number } }
>(
  'authRules/toggleAuthRuleStatus',
  async (ruleId, { rejectWithValue }) => {
    try {
      const response = await authRulesService.toggleAuthRuleStatus(ruleId);
      return response;
    } catch (error) {
      // Include ruleId in error for reverting optimistic update
      return rejectWithValue({
        ...(error as StandardizedError),
        ruleId,
      });
    }
  }
);

/**
 * Batch toggle multiple rules (utility thunk for bulk operations)
 */
export const batchToggleAuthRules = createAsyncThunk<
  void,
  number[],
  { rejectValue: StandardizedError }
>(
  'authRules/batchToggleAuthRules',
  async (ruleIds, { dispatch, rejectWithValue }) => {
    try {
      // Execute all toggle operations in parallel
      const togglePromises = ruleIds.map(ruleId => 
        dispatch(toggleAuthRuleStatus(ruleId))
      );
      
      await Promise.all(togglePromises);
    } catch (error) {
      return rejectWithValue(error as StandardizedError);
    }
  }
);

// ============================================================================
// SLICE DEFINITION
// ============================================================================

const authRulesSlice = createSlice({
  name: 'authRules',
  initialState,
  reducers: {
    // ========================================================================
    // SYNCHRONOUS ACTIONS
    // ========================================================================

    /**
     * Clear any error state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear success message
     */
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    /**
     * Clear test result
     */
    clearTestResult: (state) => {
      state.testResult = null;
    },

    /**
     * Update search and filter parameters
     */
    updateFilters: (state, action: PayloadAction<Partial<AuthRulesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Clear error when filters change
      state.error = null;
    },

    /**
     * Reset filters to initial state
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    /**
     * Reset entire state to initial (useful for cleanup)
     */
    resetState: () => initialState,

    /**
     * Optimistically update a rule in the list (used before API call)
     */
    optimisticallyUpdateRule: (state, action: PayloadAction<Partial<AuthRule> & { id: number }>) => {
      const { id, ...updates } = action.payload;
      const ruleIndex = state.rules.findIndex(rule => rule.id === id);
      if (ruleIndex !== -1) {
        state.rules[ruleIndex] = { ...state.rules[ruleIndex], ...updates };
      }
    },
  },

  // ========================================================================
  // ASYNC THUNK HANDLING
  // ========================================================================
  extraReducers: (builder) => {
    builder
      // ====================================================================
      // FETCH AUTH RULES
      // ====================================================================
      .addCase(fetchAuthRules.pending, (state) => {
        state.loading.fetching = true;
        state.error = null;
      })
      .addCase(fetchAuthRules.fulfilled, (state, action) => {
        state.loading.fetching = false;
        state.rules = action.payload.data.data;
        state.pagination = {
          current_page: action.payload.data.current_page,
          first_page_url: action.payload.data.first_page_url,
          from: action.payload.data.from,
          last_page: action.payload.data.last_page,
          last_page_url: action.payload.data.last_page_url,
          links: action.payload.data.links,
          next_page_url: action.payload.data.next_page_url,
          path: action.payload.data.path,
          per_page: action.payload.data.per_page,
          prev_page_url: action.payload.data.prev_page_url,
          to: action.payload.data.to,
          total: action.payload.data.total,
        };
        state.filters.currentPage = action.payload.data.current_page;
      })
      .addCase(fetchAuthRules.rejected, (state, action) => {
        state.loading.fetching = false;
        state.error = action.payload || null;
      })

      // ====================================================================
      // CREATE AUTH RULE
      // ====================================================================
      .addCase(createAuthRule.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAuthRule.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.successMessage = action.payload.message || 'Authorization rule created successfully';
        // Note: Rules list is refreshed by the thunk itself
      })
      .addCase(createAuthRule.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.payload || null;
      })

      // ====================================================================
      // TEST AUTH RULE
      // ====================================================================
      .addCase(testAuthRule.pending, (state) => {
        state.loading.testing = true;
        state.error = null;
        state.testResult = null;
      })
      .addCase(testAuthRule.fulfilled, (state, action) => {
        state.loading.testing = false;
        state.testResult = action.payload.data;
      })
      .addCase(testAuthRule.rejected, (state, action) => {
        state.loading.testing = false;
        state.error = action.payload || null;
        state.testResult = null;
      })

      // ====================================================================
      // TOGGLE AUTH RULE STATUS
      // ====================================================================
      .addCase(toggleAuthRuleStatus.pending, (state, action) => {
        const ruleId = action.meta.arg;
        state.loading.toggling[ruleId] = true;
        state.error = null;
        
        // Optimistic update - immediately toggle the UI
        const ruleIndex = state.rules.findIndex(rule => rule.id === ruleId);
        if (ruleIndex !== -1) {
          state.rules[ruleIndex].is_active = !state.rules[ruleIndex].is_active;
        }
      })
      .addCase(toggleAuthRuleStatus.fulfilled, (state, action) => {
        const ruleId = action.payload.data.rule.id;
        delete state.loading.toggling[ruleId];
        
        // Update with server response (should match optimistic update)
        const ruleIndex = state.rules.findIndex(rule => rule.id === ruleId);
        if (ruleIndex !== -1) {
          state.rules[ruleIndex] = action.payload.data.rule;
        }
        
        state.successMessage = action.payload.message || 'Rule status updated successfully';
      })
      .addCase(toggleAuthRuleStatus.rejected, (state, action) => {
        const ruleId = action.payload?.ruleId || action.meta.arg;
        delete state.loading.toggling[ruleId];
        state.error = action.payload || null;
        
        // Revert optimistic update on error
        const ruleIndex = state.rules.findIndex(rule => rule.id === ruleId);
        if (ruleIndex !== -1) {
          state.rules[ruleIndex].is_active = !state.rules[ruleIndex].is_active;
        }
      })

      // ====================================================================
      // BATCH TOGGLE AUTH RULES
      // ====================================================================
      .addCase(batchToggleAuthRules.pending, (state) => {
        state.error = null;
      })
      .addCase(batchToggleAuthRules.fulfilled, (state) => {
        state.successMessage = 'Selected rules updated successfully';
      })
      .addCase(batchToggleAuthRules.rejected, (state, action) => {
        state.error = action.payload || null;
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

// Export actions
export const {
  clearError,
  clearSuccessMessage,
  clearTestResult,
  updateFilters,
  resetFilters,
  resetState,
  optimisticallyUpdateRule,
} = authRulesSlice.actions;

// Export reducer
export default authRulesSlice.reducer;

// ============================================================================
// MEMOIZED SELECTORS
// ============================================================================

// Base selector
const selectAuthRulesState = (state: { authRules: AuthRulesState }) => state.authRules;

// Basic selectors
export const selectRules = (state: { authRules: AuthRulesState }) => state.authRules.rules;
export const selectPagination = (state: { authRules: AuthRulesState }) => state.authRules.pagination;
export const selectTestResult = (state: { authRules: AuthRulesState }) => state.authRules.testResult;
export const selectFilters = (state: { authRules: AuthRulesState }) => state.authRules.filters;
export const selectError = (state: { authRules: AuthRulesState }) => state.authRules.error;
export const selectSuccessMessage = (state: { authRules: AuthRulesState }) => state.authRules.successMessage;

// Loading selectors
export const selectIsLoading = (state: { authRules: AuthRulesState }) => state.authRules.loading;
export const selectIsFetching = (state: { authRules: AuthRulesState }) => state.authRules.loading.fetching;
export const selectIsCreating = (state: { authRules: AuthRulesState }) => state.authRules.loading.creating;
export const selectIsTesting = (state: { authRules: AuthRulesState }) => state.authRules.loading.testing;
export const selectTogglingStates = (state: { authRules: AuthRulesState }) => state.authRules.loading.toggling;

// Memoized derived selectors - these prevent unnecessary re-renders
export const selectActiveRules = createSelector(
  [selectAuthRulesState],
  (authRulesState) => authRulesState.rules.filter(rule => rule.is_active)
);

export const selectInactiveRules = createSelector(
  [selectAuthRulesState],
  (authRulesState) => authRulesState.rules.filter(rule => !rule.is_active)
);

export const selectHasRules = createSelector(
  [selectAuthRulesState],
  (authRulesState) => authRulesState.rules.length > 0
);

export const selectTotalRules = createSelector(
  [selectAuthRulesState],
  (authRulesState) => authRulesState.pagination?.total || 0
);

export const selectCurrentPage = createSelector(
  [selectAuthRulesState],
  (authRulesState) => authRulesState.filters.currentPage
);

// Factory selector for rules by service
export const makeSelectRulesByService = () => createSelector(
  [selectRules, (_: any, service: string) => service],
  (rules, service) => rules.filter(rule => rule.service === service)
);

/**
 * Complete selectors object for easy access
 */
export const authRulesSelectors = {
  // Data selectors
  selectRules,
  selectPagination,
  selectTestResult,
  
  // Loading selectors
  selectIsLoading,
  selectIsFetching,
  selectIsCreating,
  selectIsTesting,
  selectTogglingStates,
  selectIsToggling: (ruleId: number) => (state: { authRules: AuthRulesState }) => 
    state.authRules.loading.toggling[ruleId] || false,
  
  // Error and message selectors
  selectError,
  selectSuccessMessage,
  
  // Filter selectors
  selectFilters,
  
  // Memoized derived selectors
  selectActiveRules,
  selectInactiveRules,
  selectHasRules,
  selectTotalRules,
  selectCurrentPage,
  
  // Factory selectors
  makeSelectRulesByService,
};

// Export types for use in components
export type { AuthRulesState };
