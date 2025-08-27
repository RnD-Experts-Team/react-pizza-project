// src/features/serviceClients/store/serviceClientsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ServiceClient,
  ServiceClientsState,
  CreateServiceClientRequest,
  CreateServiceClientSuccessPayload,
  RotateTokenRequest,
  RotateTokenSuccessPayload,
  ToggleStatusSuccessPayload,
  GetServiceClientsParams,
  PaginatedServiceClients,
  ErrorResponse,
  ValidationErrorResponse,
  ApiErrorResponse,
} from '../types';
import * as serviceClientApi from '../services/api';

/**
 * Initial state for the service clients slice
 */
const initialState: ServiceClientsState = {
  clients: [],
  pagination: null,
  loading: {
    fetching: false,
    creating: false,
    rotating: false,
    toggling: false,
  },
  errors: {
    fetch: null,
    create: null,
    rotate: null,
    toggle: null,
  },
  selectedClient: null,
  lastCreatedToken: null,
};

/**
 * Helper function to extract error message from API response
 */
const extractErrorMessage = (error: any): string => {
  if (error?.response?.data) {
    const errorData = error.response.data as ErrorResponse;
    
    // Handle validation errors (422)
    if ('errors' in errorData && errorData.errors) {
      const validationError = errorData as ValidationErrorResponse;
      const firstErrorField = Object.keys(validationError.errors)[0];
      const firstErrorMessage = validationError.errors[firstErrorField]?.[0];
      return firstErrorMessage || validationError.message || 'Validation error occurred';
    }
    
    // Handle general API errors
    if ('success' in errorData && !errorData.success) {
      const apiError = errorData as ApiErrorResponse;
      return apiError.message || 'An error occurred';
    }
    
    // Handle standard error message
    if ('message' in errorData) {
      return errorData.message;
    }
  }
  
  // Fallback error messages
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Async thunk for fetching service clients with pagination and search
 * Fixed parameter ordering: required parameters first, then optional
 */
export const fetchServiceClients = createAsyncThunk(
  'serviceClients/fetchClients',
  async (params: GetServiceClientsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await serviceClientApi.getServiceClients(params);
      return response.data.data; // Return the PaginatedServiceClients data
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for creating a new service client
 */
export const createServiceClient = createAsyncThunk(
  'serviceClients/createClient',
  async (clientData: CreateServiceClientRequest, { rejectWithValue }) => {
    try {
      const response = await serviceClientApi.createServiceClient(clientData);
      return {
        client: response.data.data.service,
        token: response.data.data.token,
      } as CreateServiceClientSuccessPayload;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for rotating a service client token
 */
export const rotateServiceToken = createAsyncThunk(
  'serviceClients/rotateToken',
  async (
    { clientId, data }: { clientId: number; data?: RotateTokenRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await serviceClientApi.rotateServiceToken(clientId, data);
      return {
        client: response.data.data.service,
        token: response.data.data.token,
      } as RotateTokenSuccessPayload;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for toggling service client status
 */
export const toggleServiceStatus = createAsyncThunk(
  'serviceClients/toggleStatus',
  async (clientId: number, { rejectWithValue }) => {
    try {
      const response = await serviceClientApi.toggleServiceStatus(clientId);
      return {
        client: response.data.data.service,
      } as ToggleStatusSuccessPayload;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Service clients Redux slice
 */
const serviceClientsSlice = createSlice({
  name: 'serviceClients',
  initialState,
  reducers: {
    /**
     * Select a service client for detailed view or operations
     */
    selectClient: (state, action: PayloadAction<ServiceClient | null>) => {
      state.selectedClient = action.payload;
    },

    /**
     * Clear all error states
     */
    clearErrors: (state) => {
      state.errors = {
        fetch: null,
        create: null,
        rotate: null,
        toggle: null,
      };
    },

    /**
     * Clear specific error by type
     */
    clearError: (state, action: PayloadAction<keyof typeof state.errors>) => {
      state.errors[action.payload] = null;
    },

    /**
     * Clear the last created token (for security purposes)
     */
    clearLastCreatedToken: (state) => {
      state.lastCreatedToken = null;
    },

    /**
     * Update a specific client in the list (useful for optimistic updates)
     */
    updateClient: (state, action: PayloadAction<ServiceClient>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
      // Update selected client if it's the same one
      if (state.selectedClient?.id === action.payload.id) {
        state.selectedClient = action.payload;
      }
    },

    /**
     * Remove a client from the list (for delete operations if implemented later)
     */
    removeClient: (state, action: PayloadAction<number>) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
      // Clear selected client if it's the removed one
      if (state.selectedClient?.id === action.payload) {
        state.selectedClient = null;
      }
    },

    /**
     * Reset the entire state to initial values
     */
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch service clients
    builder
      .addCase(fetchServiceClients.pending, (state) => {
        state.loading.fetching = true;
        state.errors.fetch = null;
      })
      .addCase(fetchServiceClients.fulfilled, (state, action: PayloadAction<PaginatedServiceClients>) => {
        state.loading.fetching = false;
        state.clients = action.payload.data;
        // Extract pagination metadata from the response
        const { data, ...pagination } = action.payload;
        state.pagination = pagination;
        state.errors.fetch = null;
      })
      .addCase(fetchServiceClients.rejected, (state, action) => {
        state.loading.fetching = false;
        state.errors.fetch = action.payload as string;
      });

    // Create service client
    builder
      .addCase(createServiceClient.pending, (state) => {
        state.loading.creating = true;
        state.errors.create = null;
        state.lastCreatedToken = null;
      })
      .addCase(createServiceClient.fulfilled, (state, action: PayloadAction<CreateServiceClientSuccessPayload>) => {
        state.loading.creating = false;
        // Add the new client to the beginning of the list
        state.clients.unshift(action.payload.client);
        // Store the token temporarily for the user to copy
        state.lastCreatedToken = action.payload.token;
        // Update pagination total if we have pagination data
        if (state.pagination) {
          state.pagination.total += 1;
        }
        state.errors.create = null;
      })
      .addCase(createServiceClient.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.create = action.payload as string;
      });

    // Rotate service token
    builder
      .addCase(rotateServiceToken.pending, (state) => {
        state.loading.rotating = true;
        state.errors.rotate = null;
      })
      .addCase(rotateServiceToken.fulfilled, (state, action: PayloadAction<RotateTokenSuccessPayload>) => {
        state.loading.rotating = false;
        const clientIndex = state.clients.findIndex(
          client => client.id === action.payload.client.id
        );
        
        if (clientIndex !== -1) {
          // Update the client in the list
          state.clients[clientIndex] = action.payload.client;
        }
        
        // Update selected client if it's the same one
        if (state.selectedClient?.id === action.payload.client.id) {
          state.selectedClient = action.payload.client;
        }
        
        // Store the new token temporarily
        state.lastCreatedToken = action.payload.token;
        state.errors.rotate = null;
      })
      .addCase(rotateServiceToken.rejected, (state, action) => {
        state.loading.rotating = false;
        state.errors.rotate = action.payload as string;
      });

    // Toggle service status
    builder
      .addCase(toggleServiceStatus.pending, (state) => {
        state.loading.toggling = true;
        state.errors.toggle = null;
      })
      .addCase(toggleServiceStatus.fulfilled, (state, action: PayloadAction<ToggleStatusSuccessPayload>) => {
        state.loading.toggling = false;
        const clientIndex = state.clients.findIndex(
          client => client.id === action.payload.client.id
        );
        
        if (clientIndex !== -1) {
          // Update the client in the list
          state.clients[clientIndex] = action.payload.client;
        }
        
        // Update selected client if it's the same one
        if (state.selectedClient?.id === action.payload.client.id) {
          state.selectedClient = action.payload.client;
        }
        
        state.errors.toggle = null;
      })
      .addCase(toggleServiceStatus.rejected, (state, action) => {
        state.loading.toggling = false;
        state.errors.toggle = action.payload as string;
      });
  },
});

// Export actions
export const {
  selectClient,
  clearErrors,
  clearError,
  clearLastCreatedToken,
  updateClient,
  removeClient,
  resetState,
} = serviceClientsSlice.actions;

// Export selectors for easy state access
export const selectServiceClients = (state: { serviceClients: ServiceClientsState }) => 
  state.serviceClients.clients;

export const selectPagination = (state: { serviceClients: ServiceClientsState }) => 
  state.serviceClients.pagination;

export const selectLoadingStates = (state: { serviceClients: ServiceClientsState }) => 
  state.serviceClients.loading;

export const selectErrorStates = (state: { serviceClients: ServiceClientsState }) => 
  state.serviceClients.errors;

export const selectSelectedClient = (state: { serviceClients: ServiceClientsState }) => 
  state.serviceClients.selectedClient;

export const selectLastCreatedToken = (state: { serviceClients: ServiceClientsState }) => 
  state.serviceClients.lastCreatedToken;

// Computed selectors
export const selectIsAnyLoading = (state: { serviceClients: ServiceClientsState }) => {
  const loading = state.serviceClients.loading;
  return loading.fetching || loading.creating || loading.rotating || loading.toggling;
};

export const selectHasAnyError = (state: { serviceClients: ServiceClientsState }) => {
  const errors = state.serviceClients.errors;
  return !!(errors.fetch || errors.create || errors.rotate || errors.toggle);
};

export const selectClientById = (state: { serviceClients: ServiceClientsState }, clientId: number) => 
  state.serviceClients.clients.find(client => client.id === clientId);

// Export the reducer as default
export default serviceClientsSlice.reducer;
