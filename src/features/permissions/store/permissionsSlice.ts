/**
 * Permissions Redux Slice
 * 
 * This slice manages the permissions state using Redux Toolkit with createSlice and createAsyncThunk.
 * It handles loading states, error management, and optimistic updates for a smooth user experience.
 * All async operations are properly typed and include comprehensive error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type { 
  Permission, 
  PermissionsState, 
  CreatePermissionRequest, 
  GetPermissionsParams,
  PermissionErrorDetails 
} from '../types';
import { permissionsApi } from '../services/api';
import type { RootState } from '../../../store';

// Initial state with proper typing
const initialState: PermissionsState = {
  permissions: [],
  loading: false,
  error: null,
  pagination: null,
  createLoading: false,
  createError: null,
};

// Async thunk for fetching permissions
export const fetchPermissions = createAsyncThunk<
  { permissions: Permission[]; pagination: PermissionsState['pagination'] },
  GetPermissionsParams | undefined,
  { rejectValue: string }
>(
  'permissions/fetchPermissions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await permissionsApi.getPermissions(params);
      
      // Transform API pagination data to our state format
      const pagination = {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      };

      return {
        permissions: response.data.data,
        pagination,
      };
    } catch (error) {
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        const permError = error as PermissionErrorDetails;
        return rejectWithValue(permError.message);
      }
      
      return rejectWithValue('Failed to fetch permissions. Please try again.');
    }
  }
);

// Async thunk for creating a permission
export const createPermission = createAsyncThunk<
  Permission,
  CreatePermissionRequest,
  { rejectValue: string }
>(
  'permissions/createPermission',
  async (permissionData, { rejectWithValue, dispatch }) => {
    try {
      const newPermission = await permissionsApi.createPermission(permissionData);
      
      // Optionally refetch permissions to ensure consistency
      // This can be commented out if you prefer optimistic updates only
      dispatch(fetchPermissions({ per_page: 15 }));
      
      return newPermission;
    } catch (error) {
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        const permError = error as PermissionErrorDetails;
        return rejectWithValue(permError.message);
      }
      
      return rejectWithValue('Failed to create permission. Please try again.');
    }
  }
);

// Async thunk for searching permissions
export const searchPermissions = createAsyncThunk<
  Permission[],
  string,
  { rejectValue: string }
>(
  'permissions/searchPermissions',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const permissions = await permissionsApi.searchPermissions(searchTerm);
      return permissions;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const permError = error as PermissionErrorDetails;
        return rejectWithValue(permError.message);
      }
      
      return rejectWithValue('Failed to search permissions. Please try again.');
    }
  }
);

// Create the permissions slice
const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
    },
    
    // Clear only fetch errors
    clearFetchError: (state) => {
      state.error = null;
    },
    
    // Clear only create errors
    clearCreateError: (state) => {
      state.createError = null;
    },
    
    // Reset the entire permissions state
    resetPermissionsState: () => initialState,
    
    // Optimistically add a permission (for immediate UI feedback)
    addPermissionOptimistic: (state, action: PayloadAction<Permission>) => {
      // Add to the beginning of the array for immediate visibility
      state.permissions.unshift(action.payload);
      
      // Update pagination total if available
      if (state.pagination) {
        state.pagination.total += 1;
      }
    },
    
    // Remove optimistic permission (if creation fails)
    removePermissionOptimistic: (state, action: PayloadAction<number>) => {
      state.permissions = state.permissions.filter(
        permission => permission.id !== action.payload
      );
      
      // Update pagination total if available
      if (state.pagination) {
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }
    },
    
    // Update a specific permission in the state
    updatePermission: (state, action: PayloadAction<Permission>) => {
      const index = state.permissions.findIndex(
        permission => permission.id === action.payload.id
      );
      
      if (index !== -1) {
        state.permissions[index] = action.payload;
      }
    },
    
    // Set loading state manually (useful for component-level loading)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set create loading state manually
    setCreateLoading: (state, action: PayloadAction<boolean>) => {
      state.createLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchPermissions lifecycle
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.permissions = action.payload.permissions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch permissions';
        // Don't clear permissions on error - keep existing data
      });

    // Handle createPermission lifecycle
    builder
      .addCase(createPermission.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        
        // Add the new permission if it's not already in the list
        // (handles case where fetchPermissions wasn't called)
        const existingIndex = state.permissions.findIndex(
          p => p.id === action.payload.id
        );
        
        if (existingIndex === -1) {
          state.permissions.unshift(action.payload);
          
          // Update pagination if available
          if (state.pagination) {
            state.pagination.total += 1;
          }
        }
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create permission';
      });

    // Handle searchPermissions lifecycle
    builder
      .addCase(searchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.permissions = action.payload;
        // Clear pagination when searching (search results don't use pagination)
        state.pagination = null;
      })
      .addCase(searchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search permissions';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearFetchError,
  clearCreateError,
  resetPermissionsState,
  addPermissionOptimistic,
  removePermissionOptimistic,
  updatePermission,
  setLoading,
  setCreateLoading,
} = permissionsSlice.actions;

// Export the reducer
export default permissionsSlice.reducer;

// Replace the existing selectors with these corrected ones:

// Selectors for easy state access - Updated to work with RootState
export const selectPermissions = (state: RootState) => 
  state.permissions.permissions;

export const selectPermissionsLoading = (state: RootState) => 
  state.permissions.loading;

export const selectPermissionsError = (state: RootState) => 
  state.permissions.error;

export const selectPermissionsPagination = (state: RootState) => 
  state.permissions.pagination;

export const selectCreatePermissionLoading = (state: RootState) => 
  state.permissions.createLoading;

export const selectCreatePermissionError = (state: RootState) => 
  state.permissions.createError;

// Memoized selectors for performance - Updated to work with RootState
export const selectPermissionById = (state: RootState, id: number) =>
  state.permissions.permissions.find(permission => permission.id === id);

export const selectPermissionsByName = (state: RootState, searchTerm: string) =>
  state.permissions.permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

// Computed selectors - Updated to work with RootState
export const selectHasPermissions = (state: RootState) => 
  state.permissions.permissions.length > 0;

export const selectIsEmpty = (state: RootState) => 
  !state.permissions.loading && state.permissions.permissions.length === 0;

export const selectTotalPermissions = (state: RootState) => 
  state.permissions.pagination?.total ?? state.permissions.permissions.length;

