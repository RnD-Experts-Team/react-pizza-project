import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthRule,
  CreateAuthRulePathDSLRequest,
  CreateAuthRuleRouteNameRequest,
  TestAuthRuleRequest,
  TestAuthRuleResponse,
  AuthRulesFilters,
  AuthRuleFormData,
} from '../../types/authRules';
import authRulesService from '../../services/authRulesService';

interface AuthRulesState {
  authRules: AuthRule[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
  testResult: TestAuthRuleResponse['data'] | null;
  currentFilters: AuthRulesFilters;
}

const initialState: AuthRulesState = {
  authRules: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  },
  testResult: null,
  currentFilters: {},
};

// Async thunks
export const fetchAuthRules = createAsyncThunk(
  'authRules/fetchAuthRules',
  async (filters: AuthRulesFilters = {}, { rejectWithValue }) => {
    try {
      const response = await authRulesService.getAllAuthRules(filters);
      if (response.success) {
        return { response, filters };
      } else {
        return rejectWithValue('Failed to fetch auth rules');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while fetching auth rules');
    }
  }
);

export const createAuthRule = createAsyncThunk(
  'authRules/createAuthRule',
  async (data: AuthRuleFormData, { dispatch, getState, rejectWithValue }) => {
    try {
      let response;
      if (data.rule_type === 'path_dsl') {
        const requestData: CreateAuthRulePathDSLRequest = {
          service: data.service,
          method: data.method,
          path_dsl: data.path_dsl!,
          permissions_any: data.permissions_any.length > 0 ? data.permissions_any : undefined,
          permissions_all: data.permissions_all.length > 0 ? data.permissions_all : undefined,
          roles_any: data.roles_any.length > 0 ? data.roles_any : undefined,
          priority: data.priority,
          is_active: data.is_active,
        };
        response = await authRulesService.createAuthRulePathDSL(requestData);
      } else {
        const requestData: CreateAuthRuleRouteNameRequest = {
          service: data.service,
          method: data.method,
          route_name: data.route_name!,
          permissions_any: data.permissions_any.length > 0 ? data.permissions_any : undefined,
          permissions_all: data.permissions_all.length > 0 ? data.permissions_all : undefined,
          roles_any: data.roles_any.length > 0 ? data.roles_any : undefined,
          priority: data.priority,
          is_active: data.is_active,
        };
        response = await authRulesService.createAuthRuleRouteName(requestData);
      }

      if (response.success) {
        // Refresh the rules list with current filters
        const state = getState() as { authRules: AuthRulesState };
        await dispatch(fetchAuthRules(state.authRules.currentFilters));
        return response;
      } else {
        return rejectWithValue('Failed to create auth rule');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while creating auth rule');
    }
  }
);

export const testAuthRule = createAsyncThunk(
  'authRules/testAuthRule',
  async (data: TestAuthRuleRequest, { rejectWithValue }) => {
    try {
      const response = await authRulesService.testAuthRule(data);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue('Failed to test auth rule');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while testing auth rule');
    }
  }
);

export const toggleRuleStatus = createAsyncThunk(
  'authRules/toggleRuleStatus',
  async (ruleId: number, { rejectWithValue }) => {
    try {
      const response = await authRulesService.toggleAuthRuleStatus(ruleId);
      if (response.success) {
        return response.data.rule;
      } else {
        return rejectWithValue('Failed to toggle rule status');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while toggling rule status');
    }
  }
);

const authRulesSlice = createSlice({
  name: 'authRules',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTestResult: (state) => {
      state.testResult = null;
    },
    setCurrentFilters: (state, action: PayloadAction<AuthRulesFilters>) => {
      state.currentFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAuthRules
      .addCase(fetchAuthRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthRules.fulfilled, (state, action) => {
        state.loading = false;
        state.authRules = action.payload.response.data.data;
        state.pagination = {
          currentPage: action.payload.response.data.current_page,
          lastPage: action.payload.response.data.last_page,
          total: action.payload.response.data.total,
          perPage: action.payload.response.data.per_page,
        };
        state.currentFilters = action.payload.filters;
      })
      .addCase(fetchAuthRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createAuthRule
      .addCase(createAuthRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthRule.fulfilled, (state) => {
        state.loading = false;
        // Rules are refreshed via fetchAuthRules in the thunk
      })
      .addCase(createAuthRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // testAuthRule
      .addCase(testAuthRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testAuthRule.fulfilled, (state, action) => {
        state.loading = false;
        state.testResult = action.payload;
      })
      .addCase(testAuthRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // toggleRuleStatus
      .addCase(toggleRuleStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleRuleStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the rule in the current list
        state.authRules = state.authRules.map(rule =>
          rule.id === action.payload.id
            ? { ...rule, is_active: action.payload.is_active }
            : rule
        );
      })
      .addCase(toggleRuleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearTestResult, setCurrentFilters } = authRulesSlice.actions;
export default authRulesSlice.reducer;
