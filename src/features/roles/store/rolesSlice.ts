/**
 * Roles Redux Slice
 * 
 * This slice manages the roles state using Redux Toolkit with createSlice and createAsyncThunk.
 * It handles loading states, error management, permission assignments, and optimistic updates
 * for a smooth user experience. All async operations are properly typed and include 
 * comprehensive error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type { 
  Role, 
  RolesState, 
  CreateRoleRequest, 
  GetRolesParams,
  RoleErrorDetails 
} from '../types';
import { rolesApi } from '../services/api';
import type { RootState } from '../../../store';

// Initial state with proper typing
const initialState: RolesState = {
  roles: [],
  loading: false,
  error: null,
  pagination: null,
  createLoading: false,
  createError: null,
  assignLoading: false,
  assignError: null,
  selectedRoleId: null,
};

// Async thunk for fetching roles
export const fetchRoles = createAsyncThunk<
  { roles: Role[]; pagination: RolesState['pagination'] },
  GetRolesParams | undefined,
  { rejectValue: string }
>(
  'roles/fetchRoles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await rolesApi.getRoles(params);
      
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
        roles: response.data.data,
        pagination,
      };
    } catch (error) {
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        const roleError = error as RoleErrorDetails;
        return rejectWithValue(roleError.message);
      }
      
      return rejectWithValue('Failed to fetch roles. Please try again.');
    }
  }
);

// Async thunk for creating a role
export const createRole = createAsyncThunk<
  Role,
  CreateRoleRequest,
  { rejectValue: string }
>(
  'roles/createRole',
  async (roleData, { rejectWithValue, dispatch }) => {
    try {
      const newRole = await rolesApi.createRole(roleData);
      
      // Optionally refetch roles to ensure consistency
      dispatch(fetchRoles({ per_page: 15 }));
      
      return newRole;
    } catch (error) {
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        const roleError = error as RoleErrorDetails;
        return rejectWithValue(roleError.message);
      }
      
      return rejectWithValue('Failed to create role. Please try again.');
    }
  }
);

// Async thunk for assigning permissions to a role
export const assignPermissionsToRole = createAsyncThunk<
  Role,
  { roleId: number; permissions: string[] },
  { rejectValue: string }
>(
  'roles/assignPermissionsToRole',
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      const updatedRole = await rolesApi.assignPermissionsToRole(roleId, permissions);
      return updatedRole;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const roleError = error as RoleErrorDetails;
        return rejectWithValue(roleError.message);
      }
      
      return rejectWithValue('Failed to assign permissions to role. Please try again.');
    }
  }
);

// Async thunk for searching roles
export const searchRoles = createAsyncThunk<
  Role[],
  string,
  { rejectValue: string }
>(
  'roles/searchRoles',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const roles = await rolesApi.searchRoles(searchTerm);
      return roles;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const roleError = error as RoleErrorDetails;
        return rejectWithValue(roleError.message);
      }
      
      return rejectWithValue('Failed to search roles. Please try again.');
    }
  }
);

// Async thunk for getting a single role by ID
export const fetchRoleById = createAsyncThunk<
  Role,
  number,
  { rejectValue: string }
>(
  'roles/fetchRoleById',
  async (roleId, { rejectWithValue }) => {
    try {
      const role = await rolesApi.getRoleById(roleId);
      return role;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const roleError = error as RoleErrorDetails;
        return rejectWithValue(roleError.message);
      }
      
      return rejectWithValue('Failed to fetch role. Please try again.');
    }
  }
);

// Create the roles slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.assignError = null;
    },
    
    // Clear only fetch errors
    clearFetchError: (state) => {
      state.error = null;
    },
    
    // Clear only create errors
    clearCreateError: (state) => {
      state.createError = null;
    },

    // Clear only assign errors
    clearAssignError: (state) => {
      state.assignError = null;
    },
    
    // Reset the entire roles state
    resetRolesState: () => initialState,
    
    // Set selected role ID for UI operations
    setSelectedRoleId: (state, action: PayloadAction<number | null>) => {
      state.selectedRoleId = action.payload;
    },
    
    // Optimistically add a role (for immediate UI feedback)
    addRoleOptimistic: (state, action: PayloadAction<Role>) => {
      // Add to the beginning of the array for immediate visibility
      state.roles.unshift(action.payload);
      
      // Update pagination total if available
      if (state.pagination) {
        state.pagination.total += 1;
      }
    },
    
    // Remove optimistic role (if creation fails)
    removeRoleOptimistic: (state, action: PayloadAction<number>) => {
      state.roles = state.roles.filter(
        role => role.id !== action.payload
      );
      
      // Update pagination total if available
      if (state.pagination) {
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }
    },
    
    // Update a specific role in the state
    updateRole: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(
        role => role.id === action.payload.id
      );
      
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },

    // Update role permissions (for optimistic updates during permission assignment)
    updateRolePermissions: (state, action: PayloadAction<{ roleId: number; permissions: string[] }>) => {
      const { roleId } = action.payload;
      const roleIndex = state.roles.findIndex(role => role.id === roleId);
      
      if (roleIndex !== -1) {
        // This is a simplified update - in real scenario, you'd need full permission objects
        // For now, we'll mark it as needing a refetch
        state.roles[roleIndex] = {
          ...state.roles[roleIndex],
          updated_at: new Date().toISOString(),
        };
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

    // Set assign loading state manually
    setAssignLoading: (state, action: PayloadAction<boolean>) => {
      state.assignLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchRoles lifecycle
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roles = action.payload.roles;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch roles';
        // Don't clear roles on error - keep existing data
      });

    // Handle createRole lifecycle
    builder
      .addCase(createRole.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        
        // Add the new role if it's not already in the list
        const existingIndex = state.roles.findIndex(
          r => r.id === action.payload.id
        );
        
        if (existingIndex === -1) {
          state.roles.unshift(action.payload);
          
          // Update pagination if available
          if (state.pagination) {
            state.pagination.total += 1;
          }
        }
      })
      .addCase(createRole.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create role';
      });

    // Handle assignPermissionsToRole lifecycle
    builder
      .addCase(assignPermissionsToRole.pending, (state) => {
        state.assignLoading = true;
        state.assignError = null;
      })
      .addCase(assignPermissionsToRole.fulfilled, (state, action) => {
        state.assignLoading = false;
        state.assignError = null;
        
        // Update the role in the list
        const roleIndex = state.roles.findIndex(
          role => role.id === action.payload.id
        );
        
        if (roleIndex !== -1) {
          state.roles[roleIndex] = action.payload;
        }
      })
      .addCase(assignPermissionsToRole.rejected, (state, action) => {
        state.assignLoading = false;
        state.assignError = action.payload || 'Failed to assign permissions to role';
      });

    // Handle searchRoles lifecycle
    builder
      .addCase(searchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roles = action.payload;
        // Clear pagination when searching (search results don't use pagination)
        state.pagination = null;
      })
      .addCase(searchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search roles';
      });

    // Handle fetchRoleById lifecycle
    builder
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Update or add the role to the list
        const existingIndex = state.roles.findIndex(
          role => role.id === action.payload.id
        );
        
        if (existingIndex !== -1) {
          state.roles[existingIndex] = action.payload;
        } else {
          state.roles.push(action.payload);
        }
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch role';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearFetchError,
  clearCreateError,
  clearAssignError,
  resetRolesState,
  setSelectedRoleId,
  addRoleOptimistic,
  removeRoleOptimistic,
  updateRole,
  updateRolePermissions,
  setLoading,
  setCreateLoading,
  setAssignLoading,
} = rolesSlice.actions;

// Export the reducer
export default rolesSlice.reducer;

// Selectors for easy state access
export const selectRoles = (state: RootState) => state.roles.roles;

export const selectRolesLoading = (state: RootState) => state.roles.loading;

export const selectRolesError = (state: RootState) => state.roles.error;

export const selectRolesPagination = (state: RootState) => state.roles.pagination;

export const selectCreateRoleLoading = (state: RootState) => state.roles.createLoading;

export const selectCreateRoleError = (state: RootState) => state.roles.createError;

export const selectAssignLoading = (state: RootState) => state.roles.assignLoading;

export const selectAssignError = (state: RootState) => state.roles.assignError;

export const selectSelectedRoleId = (state: RootState) => state.roles.selectedRoleId;

// Memoized selectors for performance
export const selectRoleById = (state: RootState, id: number) =>
  state.roles.roles.find(role => role.id === id);

export const selectRolesByName = (state: RootState, searchTerm: string) =>
  state.roles.roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

export const selectRolesWithPermissionCount = (state: RootState) =>
  state.roles.roles.map(role => ({
    ...role,
    permission_count: role.permissions?.length || 0,
  }));

// Computed selectors
export const selectHasRoles = (state: RootState) => 
  state.roles.roles.length > 0;

export const selectIsEmpty = (state: RootState) => 
  !state.roles.loading && state.roles.roles.length === 0;

export const selectTotalRoles = (state: RootState) => 
  state.roles.pagination?.total ?? state.roles.roles.length;

export const selectSelectedRole = (state: RootState) => 
  state.roles.selectedRoleId 
    ? selectRoleById(state, state.roles.selectedRoleId)
    : null;
