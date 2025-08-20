import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type {
  UserManagementState,
  UsersQueryParams,
  UserResponse,
  UsersResponse,
  RolesResponse,
  RoleResponse,
  PermissionsResponse,
  PermissionResponse,
  CreateUserForm,
  UpdateUserForm,
  CreateRoleForm,
  CreatePermissionForm,
  AssignRolesForm,
  AssignPermissionsForm
} from '../../types/userManagement';
import userManagementService from '../../services/userManagementService';

// Async Thunks

// Fetch all users with optional query params
export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (params: UsersQueryParams, { rejectWithValue }) => {
    try {
      return await userManagementService.getAllUsers(params);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch single user by id
export const fetchUserById = createAsyncThunk(
  'userManagement/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await userManagementService.getUserById(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  'userManagement/createUser',
  async (userData: CreateUserForm, { rejectWithValue }) => {
    try {
      return await userManagementService.createUser(userData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'userManagement/updateUser',
  async (params: { id: number; userData: UpdateUserForm }, { rejectWithValue }) => {
    try {
      return await userManagementService.updateUser(params.id, params.userData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'userManagement/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      return await userManagementService.deleteUser(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch all roles
export const fetchRoles = createAsyncThunk(
  'userManagement/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      return await userManagementService.getAllRoles();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create role
export const createRole = createAsyncThunk(
  'userManagement/createRole',
  async (roleData: CreateRoleForm, { rejectWithValue }) => {
    try {
      return await userManagementService.createRole(roleData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch all permissions
export const fetchPermissions = createAsyncThunk(
  'userManagement/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      return await userManagementService.getAllPermissions();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create permission
export const createPermission = createAsyncThunk(
  'userManagement/createPermission',
  async (permissionData: CreatePermissionForm, { rejectWithValue }) => {
    try {
      return await userManagementService.createPermission(permissionData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Initial state
const initialState: UserManagementState = {
  users: [],
  roles: [],
  permissions: [],
  loading: false,
  error: null,
  pagination: null
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.users = action.payload.data.data;
        state.pagination = action.payload.data;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch users';
      }
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch users';
    });

    // Fetch roles
    builder.addCase(fetchRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action: PayloadAction<RolesResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.roles = action.payload.data.data;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch roles';
      }
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch roles';
    });

    // Fetch permissions
    builder.addCase(fetchPermissions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPermissions.fulfilled, (state, action: PayloadAction<PermissionsResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.permissions = action.payload.data.data;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch permissions';
      }
    });
    builder.addCase(fetchPermissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch permissions';
    });

    // Create user
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.users.unshift(action.payload.data.user);
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to create user';
      }
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to create user';
    });

    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        const index = state.users.findIndex(u => u.id === action.payload.data?.user.id);
        if (index !== -1) {
          state.users[index] = action.payload.data.user;
        }
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to update user';
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to update user';
    });

    // Delete user
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.users = state.users.filter(u => u.id !== (action.meta.arg as number));
        state.error = null;
      } else {
        state.error = action.payload?.message || 'Failed to delete user';
      }
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to delete user';
    });
  }
});

export const { clearError } = userManagementSlice.actions;

export default userManagementSlice.reducer;
