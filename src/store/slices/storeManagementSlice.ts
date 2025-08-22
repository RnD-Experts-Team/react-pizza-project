import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StoreManagementState,
  StoresQueryParams,
  StoreResponse,
  StoresResponse,
  StoreUsersResponse,
  StoreRolesResponse,
  CreateStoreForm,
  UpdateStoreForm
} from '../../types/storeManagement';
import storeManagementService from '../../services/storeManagementService';

// Async Thunks

// Fetch all stores with optional query params
export const fetchStores = createAsyncThunk(
  'storeManagement/fetchStores',
  async (params: StoresQueryParams, { rejectWithValue }) => {
    try {
      return await storeManagementService.getAllStores(params);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch single store by id
export const fetchStoreById = createAsyncThunk(
  'storeManagement/fetchStoreById',
  async (storeId: string, { rejectWithValue }) => {
    try {
      return await storeManagementService.getStoreById(storeId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create store
export const createStore = createAsyncThunk(
  'storeManagement/createStore',
  async (storeData: CreateStoreForm, { rejectWithValue }) => {
    try {
      return await storeManagementService.createStore(storeData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Update store
export const updateStore = createAsyncThunk(
  'storeManagement/updateStore',
  async (params: { storeId: string; storeData: UpdateStoreForm }, { rejectWithValue }) => {
    try {
      return await storeManagementService.updateStore(params.storeId, params.storeData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch store users
export const fetchStoreUsers = createAsyncThunk(
  'storeManagement/fetchStoreUsers',
  async (storeId: string, { rejectWithValue }) => {
    try {
      return await storeManagementService.getStoreUsers(storeId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch store roles
export const fetchStoreRoles = createAsyncThunk(
  'storeManagement/fetchStoreRoles',
  async (storeId: string, { rejectWithValue }) => {
    try {
      return await storeManagementService.getStoreRoles(storeId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Initial state
const initialState: StoreManagementState = {
  stores: [],
  currentStore: null,
  storeUsers: [],
  storeRoles: [],
  loading: false,
  error: null,
  pagination: null
};

const storeManagementSlice = createSlice({
  name: 'storeManagement',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setCurrentStore(state, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.currentStore = state.stores.find(store => store.id === action.payload) || null;
      } else {
        state.currentStore = null;
      }
    },
    clearStoreUsers(state) {
      state.storeUsers = [];
    },
    clearStoreRoles(state) {
      state.storeRoles = [];
    }
  },
  extraReducers: (builder) => {
    // Fetch stores
    builder.addCase(fetchStores.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStores.fulfilled, (state, action: PayloadAction<StoresResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.stores = action.payload.data.data;
        state.pagination = action.payload.data;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch stores';
      }
    });
    builder.addCase(fetchStores.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch stores';
    });

    // Fetch store by ID
    builder.addCase(fetchStoreById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStoreById.fulfilled, (state, action: PayloadAction<StoreResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.currentStore = action.payload.data.store;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch store';
      }
    });
    builder.addCase(fetchStoreById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch store';
    });

    // Create store
    builder.addCase(createStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createStore.fulfilled, (state, action: PayloadAction<StoreResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.stores.unshift(action.payload.data.store);
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to create store';
      }
    });
    builder.addCase(createStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to create store';
    });

    // Update store
    builder.addCase(updateStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateStore.fulfilled, (state, action: PayloadAction<StoreResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        const index = state.stores.findIndex(store => store.id === action.payload.data!.store.id);
        if (index !== -1) {
          state.stores[index] = action.payload.data.store;
        }
        if (state.currentStore && state.currentStore.id === action.payload.data.store.id) {
          state.currentStore = action.payload.data.store;
        }
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to update store';
      }
    });
    builder.addCase(updateStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to update store';
    });

    // Fetch store users
    builder.addCase(fetchStoreUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStoreUsers.fulfilled, (state, action: PayloadAction<StoreUsersResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.storeUsers = action.payload.data.users;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch store users';
      }
    });
    builder.addCase(fetchStoreUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch store users';
    });

    // Fetch store roles
    builder.addCase(fetchStoreRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStoreRoles.fulfilled, (state, action: PayloadAction<StoreRolesResponse>) => {
      state.loading = false;
      if (action.payload.success && action.payload.data) {
        state.storeRoles = action.payload.data.roles;
        state.error = null;
      } else {
        state.error = action.payload.message || 'Failed to fetch store roles';
      }
    });
    builder.addCase(fetchStoreRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch store roles';
    });
  }
});

export const { clearError, setCurrentStore, clearStoreUsers, clearStoreRoles } = storeManagementSlice.actions;

export default storeManagementSlice.reducer;