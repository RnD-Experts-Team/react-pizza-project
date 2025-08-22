import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  RoleHierarchyState,
  CreateRoleHierarchyRequest,
} from '../../types/roleHierarchy';
import { roleHierarchyService } from '../../services/roleHierarchyService';
import type { ApiError } from '../../types/apiErrors';

const initialState: RoleHierarchyState = {
  hierarchies: [],
  hierarchyTree: [],
  loading: false,
  error: null,
  createLoading: false,
  treeLoading: false,
};

// Async Thunks
export const createRoleHierarchy = createAsyncThunk(
  'roleHierarchy/createRoleHierarchy',
  async (data: CreateRoleHierarchyRequest, { rejectWithValue }) => {
    try {
      const response = await roleHierarchyService.createRoleHierarchy(data);
      return response.data.hierarchy;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchStoreHierarchy = createAsyncThunk(
  'roleHierarchy/fetchStoreHierarchy',
  async (storeId: string, { rejectWithValue }) => {
    try {
      const response = await roleHierarchyService.getStoreHierarchy(storeId);
      return response.data.hierarchies;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const fetchStoreHierarchyTree = createAsyncThunk(
  'roleHierarchy/fetchStoreHierarchyTree',
  async (storeId: string, { rejectWithValue }) => {
    try {
      const response = await roleHierarchyService.getStoreHierarchyTree(storeId);
      return response.data.hierarchy_tree;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const roleHierarchySlice = createSlice({
  name: 'roleHierarchy',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearHierarchies: (state) => {
      state.hierarchies = [];
      state.hierarchyTree = [];
    },
    updateHierarchyStatus: (state, action: PayloadAction<{ id: number; is_active: boolean }>) => {
      const { id, is_active } = action.payload;
      const hierarchy = state.hierarchies.find(h => h.id === id);
      if (hierarchy) {
        hierarchy.is_active = is_active;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Role Hierarchy
      .addCase(createRoleHierarchy.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createRoleHierarchy.fulfilled, (state, action) => {
        state.createLoading = false;
        state.hierarchies.push(action.payload);
      })
      .addCase(createRoleHierarchy.rejected, (state, action) => {
        state.createLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to create role hierarchy';
      })
      
      // Fetch Store Hierarchy
      .addCase(fetchStoreHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.hierarchies = action.payload;
      })
      .addCase(fetchStoreHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch store hierarchy';
      })
      
      // Fetch Store Hierarchy Tree
      .addCase(fetchStoreHierarchyTree.pending, (state) => {
        state.treeLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreHierarchyTree.fulfilled, (state, action) => {
        state.treeLoading = false;
        state.hierarchyTree = action.payload;
      })
      .addCase(fetchStoreHierarchyTree.rejected, (state, action) => {
        state.treeLoading = false;
        state.error = (action.payload as ApiError)?.message || 'Failed to fetch hierarchy tree';
      });
  },
});

export const {
  clearError,
  clearHierarchies,
  updateHierarchyStatus,
} = roleHierarchySlice.actions;

export default roleHierarchySlice.reducer;