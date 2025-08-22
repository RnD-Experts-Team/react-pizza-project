import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import type {
  ServiceClient,
  ServiceClientManagementState,
  ServiceClientsQueryParams,
  CreateServiceClientForm,
  RotateTokenForm,
  PaginationMeta,
  TokenDisplayData,
} from '../../types/serviceClient';
import { serviceClientService } from '../../services/serviceClientService';

// Initial state
const initialState: ServiceClientManagementState = {
  serviceClients: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchServiceClients = createAsyncThunk(
  'serviceClient/fetchServiceClients',
  async (params: ServiceClientsQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await serviceClientService.getServiceClients(params);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch service clients');
      }
    } catch (error: any) {
      console.error('Error fetching service clients:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service clients');
    }
  }
);

export const createServiceClient = createAsyncThunk(
  'serviceClient/createServiceClient',
  async (data: CreateServiceClientForm, { rejectWithValue }) => {
    try {
      const response = await serviceClientService.createServiceClient(data);
      
      if (response.success && response.data) {
        return {
          service: response.data.service,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || 'Failed to create service client');
      }
    } catch (error: any) {
      console.error('Error creating service client:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create service client');
    }
  }
);

export const rotateServiceToken = createAsyncThunk(
  'serviceClient/rotateServiceToken',
  async ({ id, data }: { id: number; data: RotateTokenForm }, { rejectWithValue }) => {
    try {
      const response = await serviceClientService.rotateServiceToken(id, data);
      
      if (response.success && response.data) {
        return {
          service: response.data.service,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || 'Failed to rotate service token');
      }
    } catch (error: any) {
      console.error('Error rotating service token:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to rotate service token');
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  'serviceClient/toggleServiceStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await serviceClientService.toggleServiceStatus(id);
      
      if (response.success && response.data) {
        return response.data.service;
      } else {
        return rejectWithValue(response.message || 'Failed to toggle service status');
      }
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle service status');
    }
  }
);

// Slice
const serviceClientSlice = createSlice({
  name: 'serviceClient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch service clients
      .addCase(fetchServiceClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceClients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { data: serviceClients, ...pagination } = action.payload;
        state.serviceClients = serviceClients;
        state.pagination = pagination;
      })
      .addCase(fetchServiceClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create service client
      .addCase(createServiceClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Add the new service client to the beginning of the list
        state.serviceClients.unshift(action.payload.service);
      })
      .addCase(createServiceClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Rotate service token
      .addCase(rotateServiceToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rotateServiceToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the service client in the list
        const index = state.serviceClients.findIndex(
          client => client.id === action.payload.service.id
        );
        if (index !== -1) {
          state.serviceClients[index] = action.payload.service;
        }
      })
      .addCase(rotateServiceToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle service status
      .addCase(toggleServiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the service client in the list
        const index = state.serviceClients.findIndex(
          client => client.id === action.payload.id
        );
        if (index !== -1) {
          state.serviceClients[index] = action.payload;
        }
      })
      .addCase(toggleServiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading, resetState } = serviceClientSlice.actions;
export default serviceClientSlice.reducer;
