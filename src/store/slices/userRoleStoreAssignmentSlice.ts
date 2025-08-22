import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  UserRoleStoreAssignmentState,
  AssignUserRoleToStoreRequest,
  ToggleUserRoleStoreStatusRequest,
  BulkAssignUserRolesRequest,
  RemoveUserRoleStoreRequest,
} from '../../types/userRoleStoreAssignment';
import { userRoleStoreAssignmentService } from '../../services/userRoleStoreAssignmentService';
import type { ApiError } from '../../types/apiErrors';

const initialState: UserRoleStoreAssignmentState = {
  assignments: [],
  storeAssignments: [],
  userAssignments: [],
  loading: false,
  error: null,
  assignmentLoading: false,
  toggleLoading: false,
  bulkAssignLoading: false,
  removeLoading: false,
};

// Async Thunks
export const assignUserRoleToStore = createAsyncThunk(
  'userRoleStoreAssignment/assignUserRoleToStore',
  async (data: AssignUserRoleToStoreRequest, { rejectWithValue }) => {
    try {
      const response = await userRoleStoreAssignmentService.assignUserRoleToStore(data);
      return response.data.assignment;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const toggleUserRoleStoreStatus = createAsyncThunk(
  'userRoleStoreAssignment/toggleUserRoleStoreStatus',
  async (data: ToggleUserRoleStoreStatusRequest, { rejectWithValue }) => {
    try {
      await userRoleStoreAssignmentService.toggleUserRoleStoreStatus(data);
      return data;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchStoreAssignments = createAsyncThunk(
  'userRoleStoreAssignment/fetchStoreAssignments',
  async (storeId: string, { rejectWithValue }) => {
    try {
      const response = await userRoleStoreAssignmentService.getStoreAssignments(storeId);
      return response.data.assignments;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchUserAssignments = createAsyncThunk(
  'userRoleStoreAssignment/fetchUserAssignments',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await userRoleStoreAssignmentService.getUserAssignments(userId);
      return response.data.assignments;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const bulkAssignUserRoles = createAsyncThunk(
  'userRoleStoreAssignment/bulkAssignUserRoles',
  async (data: BulkAssignUserRolesRequest, { rejectWithValue }) => {
    try {
      const response = await userRoleStoreAssignmentService.bulkAssignUserRoles(data);
      return response.data.assignments;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const removeUserRoleStore = createAsyncThunk(
  'userRoleStoreAssignment/removeUserRoleStore',
  async (data: RemoveUserRoleStoreRequest, { rejectWithValue }) => {
    try {
      await userRoleStoreAssignmentService.removeUserRoleStore(data);
      return data;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);



const userRoleStoreAssignmentSlice = createSlice({
  name: 'userRoleStoreAssignment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAssignments: (state) => {
      state.assignments = [];
      state.storeAssignments = [];
      state.userAssignments = [];
    },
    updateAssignmentStatus: (state, action: PayloadAction<{ user_id: number; role_id: number; store_id: string; is_active: boolean }>) => {
      const { user_id, role_id, store_id, is_active } = action.payload;
      
      // Update in all assignments arrays
      [state.assignments, state.storeAssignments, state.userAssignments].forEach(assignments => {
        const assignment = assignments.find(
          a => a.user_id === user_id && a.role_id === role_id && a.store_id === store_id
        );
        if (assignment) {
          assignment.is_active = is_active;
        }
      });
    },
    removeAssignmentFromState: (state, action: PayloadAction<{ user_id: number; role_id: number; store_id: string }>) => {
      const { user_id, role_id, store_id } = action.payload;
      
      // Remove from all assignments arrays
      state.assignments = state.assignments.filter(
        a => !(a.user_id === user_id && a.role_id === role_id && a.store_id === store_id)
      );
      state.storeAssignments = state.storeAssignments.filter(
        a => !(a.user_id === user_id && a.role_id === role_id && a.store_id === store_id)
      );
      state.userAssignments = state.userAssignments.filter(
        a => !(a.user_id === user_id && a.role_id === role_id && a.store_id === store_id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Assign User Role to Store
      .addCase(assignUserRoleToStore.pending, (state) => {
        state.assignmentLoading = true;
        state.error = null;
      })
      .addCase(assignUserRoleToStore.fulfilled, (state, action) => {
        state.assignmentLoading = false;
        state.assignments.push(action.payload);
      })
      .addCase(assignUserRoleToStore.rejected, (state, action) => {
        state.assignmentLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to assign user role to store';
      })
      
      // Toggle User Role Store Status
      .addCase(toggleUserRoleStoreStatus.pending, (state) => {
        state.toggleLoading = true;
        state.error = null;
      })
      .addCase(toggleUserRoleStoreStatus.fulfilled, (state, action) => {
        state.toggleLoading = false;
        const { user_id, role_id, store_id } = action.payload;
        
        // Find and toggle the assignment status
        [state.assignments, state.storeAssignments, state.userAssignments].forEach(assignments => {
          const assignment = assignments.find(
            a => a.user_id === user_id && a.role_id === role_id && a.store_id === store_id
          );
          if (assignment) {
            assignment.is_active = !assignment.is_active;
          }
        });
      })
      .addCase(toggleUserRoleStoreStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to toggle assignment status';
      })
      
      // Fetch Store Assignments
      .addCase(fetchStoreAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.storeAssignments = action.payload;
      })
      .addCase(fetchStoreAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch store assignments';
      })
      
      // Fetch User Assignments
      .addCase(fetchUserAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.userAssignments = action.payload;
      })
      .addCase(fetchUserAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch user assignments';
      })
      
      // Bulk Assign User Roles
      .addCase(bulkAssignUserRoles.pending, (state) => {
        state.bulkAssignLoading = true;
        state.error = null;
      })
      .addCase(bulkAssignUserRoles.fulfilled, (state, action) => {
        state.bulkAssignLoading = false;
        state.assignments.push(...action.payload);
      })
      .addCase(bulkAssignUserRoles.rejected, (state, action) => {
        state.bulkAssignLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to bulk assign user roles';
      })
      
      // Remove User Role Store
      .addCase(removeUserRoleStore.pending, (state) => {
        state.removeLoading = true;
        state.error = null;
      })
      .addCase(removeUserRoleStore.fulfilled, (state, action) => {
        state.removeLoading = false;
        const { user_id, role_id, store_id } = action.payload;
        
        // Remove from all assignments arrays
        state.assignments = state.assignments.filter(
          a => !(a.user_id === user_id && a.role_id === role_id && a.store_id === store_id)
        );
        state.storeAssignments = state.storeAssignments.filter(
          a => !(a.user_id === user_id && a.role_id === role_id && a.store_id === store_id)
        );
        state.userAssignments = state.userAssignments.filter(
          a => !(a.user_id === user_id && a.role_id === role_id && a.store_id === store_id)
        );
      })
      .addCase(removeUserRoleStore.rejected, (state, action) => {
        state.removeLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to remove user role assignment';
      })
      ;
  },
});

export const {
  clearError,
  clearAssignments,
  updateAssignmentStatus,
  removeAssignmentFromState,
} = userRoleStoreAssignmentSlice.actions;

export default userRoleStoreAssignmentSlice.reducer;