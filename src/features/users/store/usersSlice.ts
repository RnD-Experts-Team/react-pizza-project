/**
 * Users Redux Slice
 * 
 * This slice manages the users state using Redux Toolkit with createSlice and createAsyncThunk.
 * It handles loading states, error management, role/permission assignment, and optimistic updates
 * for a smooth user experience. All async operations are properly typed and include
 * comprehensive error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  User, 
  UsersState, 
  CreateUserRequest, 
  UpdateUserRequest,
  GetUsersParams,
  UserErrorDetails,
  UserFilters
} from '../types';
import { usersApi } from '../services/api';
import type { RootState } from '../../../store';

// Initial state with proper typing
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  pagination: null,
  perPage: 10, // Default per_page value
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  assignRolesLoading: false,
  assignRolesError: null,
  givePermissionsLoading: false,
  givePermissionsError: null,
  selectedUserId: null,
  searchTerm: '',
  filters: {},
};

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk<
  { users: User[]; pagination: UsersState['pagination'] },
  GetUsersParams | undefined,
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUsers(params);
      
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
        users: response.data.data,
        pagination,
      };
    } catch (error) {
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to fetch users. Please try again.');
    }
  }
);

// Async thunk for creating a user
export const createUser = createAsyncThunk<
  User,
  CreateUserRequest,
  { rejectValue: string }
>(
  'users/createUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const newUser = await usersApi.createUser(userData);
      
      // Optionally refetch users to ensure consistency
      dispatch(fetchUsers({ per_page: 5 }));
      
      return newUser;
    } catch (error) {
      // Handle different error types
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to create user. Please try again.');
    }
  }
);

// Async thunk for updating a user
export const updateUser = createAsyncThunk<
  User,
  { userId: number; data: UpdateUserRequest },
  { rejectValue: string }
>(
  'users/updateUser',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const updatedUser = await usersApi.updateUser(userId, data);
      return updatedUser;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to update user. Please try again.');
    }
  }
);

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk<
  number, // Return the deleted user ID
  number,
  { rejectValue: string }
>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(userId);
      return userId; // Return the ID for state updates
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to delete user. Please try again.');
    }
  }
);

// Async thunk for assigning roles to a user
export const assignRolesToUser = createAsyncThunk<
  User,
  { userId: number; roles: string[] },
  { rejectValue: string }
>(
  'users/assignRolesToUser',
  async ({ userId, roles }, { rejectWithValue }) => {
    try {
      const updatedUser = await usersApi.assignRolesToUser(userId, roles);
      return updatedUser;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to assign roles to user. Please try again.');
    }
  }
);

// Async thunk for giving permissions to a user
export const givePermissionsToUser = createAsyncThunk<
  User,
  { userId: number; permissions: string[] },
  { rejectValue: string }
>(
  'users/givePermissionsToUser',
  async ({ userId, permissions }, { rejectWithValue }) => {
    try {
      const updatedUser = await usersApi.givePermissionsToUser(userId, permissions);
      return updatedUser;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to give permissions to user. Please try again.');
    }
  }
);

// Async thunk for searching users
export const searchUsers = createAsyncThunk<
  User[],
  string,
  { rejectValue: string }
>(
  'users/searchUsers',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const users = await usersApi.searchUsers(searchTerm);
      return users;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to search users. Please try again.');
    }
  }
);

// Async thunk for fetching user by ID
export const fetchUserById = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const user = await usersApi.getUserById(userId);
      return user;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const userError = error as UserErrorDetails;
        return rejectWithValue(userError.message);
      }
      
      return rejectWithValue('Failed to fetch user. Please try again.');
    }
  }
);

// Create the users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.assignRolesError = null;
      state.givePermissionsError = null;
    },
    
    // Clear specific errors
    clearFetchError: (state) => {
      state.error = null;
    },
    
    clearCreateError: (state) => {
      state.createError = null;
    },
    
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    
    clearAssignRolesError: (state) => {
      state.assignRolesError = null;
    },
    
    clearGivePermissionsError: (state) => {
      state.givePermissionsError = null;
    },
    
    // Reset the entire users state
    resetUsersState: () => initialState,
    
    // Set selected user ID for UI operations
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
    
    // Set search term
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
    },
    
    // Set per page
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    },
    
    // Update a specific user in the state
    updateUserInState: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        user => user.id === action.payload.id
      );
      
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    
    // Remove user from state (for optimistic deletes)
    removeUserFromState: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(
        user => user.id !== action.payload
      );
      
      // Update pagination total if available
      if (state.pagination) {
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }
    },
    
    // Set loading states manually
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setCreateLoading: (state, action: PayloadAction<boolean>) => {
      state.createLoading = action.payload;
    },
    
    setUpdateLoading: (state, action: PayloadAction<boolean>) => {
      state.updateLoading = action.payload;
    },
    
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUsers lifecycle
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
        // Don't clear users on error - keep existing data
      });

    // Handle createUser lifecycle
    builder
      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        
        // Add the new user if it's not already in the list
        const existingIndex = state.users.findIndex(
          u => u.id === action.payload.id
        );
        
        if (existingIndex === -1) {
          state.users.unshift(action.payload);
          
          // Update pagination if available
          if (state.pagination) {
            state.pagination.total += 1;
          }
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create user';
      });

    // Handle updateUser lifecycle
    builder
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        
        // Update the user in the list
        const userIndex = state.users.findIndex(
          user => user.id === action.payload.id
        );
        
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update user';
      });

    // Handle deleteUser lifecycle
    builder
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        
        // Remove the user from the list
        state.users = state.users.filter(
          user => user.id !== action.payload
        );
        
        // Update pagination if available
        if (state.pagination) {
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
        
        // Clear selection if this user was selected
        if (state.selectedUserId === action.payload) {
          state.selectedUserId = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'Failed to delete user';
      });

    // Handle assignRolesToUser lifecycle
    builder
      .addCase(assignRolesToUser.pending, (state) => {
        state.assignRolesLoading = true;
        state.assignRolesError = null;
      })
      .addCase(assignRolesToUser.fulfilled, (state, action) => {
        state.assignRolesLoading = false;
        state.assignRolesError = null;
        
        // Update the user in the list
        const userIndex = state.users.findIndex(
          user => user.id === action.payload.id
        );
        
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(assignRolesToUser.rejected, (state, action) => {
        state.assignRolesLoading = false;
        state.assignRolesError = action.payload || 'Failed to assign roles to user';
      });

    // Handle givePermissionsToUser lifecycle
    builder
      .addCase(givePermissionsToUser.pending, (state) => {
        state.givePermissionsLoading = true;
        state.givePermissionsError = null;
      })
      .addCase(givePermissionsToUser.fulfilled, (state, action) => {
        state.givePermissionsLoading = false;
        state.givePermissionsError = null;
        
        // Update the user in the list
        const userIndex = state.users.findIndex(
          user => user.id === action.payload.id
        );
        
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(givePermissionsToUser.rejected, (state, action) => {
        state.givePermissionsLoading = false;
        state.givePermissionsError = action.payload || 'Failed to give permissions to user';
      });

    // Handle searchUsers lifecycle
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload;
        // Clear pagination when searching (search results don't use pagination)
        state.pagination = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search users';
      });

    // Handle fetchUserById lifecycle
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Update or add the user to the list
        const existingIndex = state.users.findIndex(
          user => user.id === action.payload.id
        );
        
        if (existingIndex !== -1) {
          state.users[existingIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearFetchError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearAssignRolesError,
  clearGivePermissionsError,
  resetUsersState,
  setSelectedUserId,
  setSearchTerm,
  setFilters,
  setPerPage,
  updateUserInState,
  removeUserFromState,
  setLoading,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
} = usersSlice.actions;

// Export the reducer
export default usersSlice.reducer;

// Selectors for easy state access
export const selectUsers = (state: RootState) => state.users.users;

export const selectUsersLoading = (state: RootState) => state.users.loading;

export const selectUsersError = (state: RootState) => state.users.error;

export const selectUsersPagination = (state: RootState) => state.users.pagination;

export const selectCreateUserLoading = (state: RootState) => state.users.createLoading;

export const selectCreateUserError = (state: RootState) => state.users.createError;

export const selectUpdateUserLoading = (state: RootState) => state.users.updateLoading;

export const selectUpdateUserError = (state: RootState) => state.users.updateError;

export const selectDeleteUserLoading = (state: RootState) => state.users.deleteLoading;

export const selectDeleteUserError = (state: RootState) => state.users.deleteError;

export const selectAssignRolesLoading = (state: RootState) => state.users.assignRolesLoading;

export const selectAssignRolesError = (state: RootState) => state.users.assignRolesError;

export const selectGivePermissionsLoading = (state: RootState) => state.users.givePermissionsLoading;

export const selectGivePermissionsError = (state: RootState) => state.users.givePermissionsError;

export const selectSelectedUserId = (state: RootState) => state.users.selectedUserId;

export const selectSearchTerm = (state: RootState) => state.users.searchTerm;

export const selectFilters = (state: RootState) => state.users.filters;

export const selectPerPage = (state: RootState) => state.users.perPage;

// Memoized selectors for performance
export const selectUserById = (state: RootState, id: number) =>
  state.users.users.find(user => user.id === id);

export const selectUsersByName = (state: RootState, searchTerm: string) =>
  state.users.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

export const selectUsersWithRoles = (state: RootState) =>
  state.users.users.filter(user => user.roles && user.roles.length > 0);

export const selectUsersWithPermissions = (state: RootState) =>
  state.users.users.filter(user => user.permissions && user.permissions.length > 0);

export const selectUsersWithCounts = (state: RootState) =>
  state.users.users.map(user => ({
    ...user,
    role_count: user.roles?.length || 0,
    permission_count: user.permissions?.length || 0,
    store_count: user.stores?.length || 0,
  }));

// Computed selectors
export const selectHasUsers = (state: RootState) => 
  state.users.users.length > 0;

export const selectIsEmpty = (state: RootState) => 
  !state.users.loading && state.users.users.length === 0;

export const selectTotalUsers = (state: RootState) => 
  state.users.pagination?.total ?? state.users.users.length;

export const selectSelectedUser = (state: RootState) => 
  state.users.selectedUserId 
    ? selectUserById(state, state.users.selectedUserId)
    : null;
