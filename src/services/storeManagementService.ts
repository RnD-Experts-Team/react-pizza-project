import type {
  StoresResponse,
  StoreResponse,
  StoreUsersResponse,
  StoreRolesResponse,
  CreateStoreForm,
  UpdateStoreForm,
  StoresQueryParams,
  ErrorResponse
} from '../types/storeManagement';

import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = 'https://auth.pnepizza.com/api/v1';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = tokenStorage.getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Helper function to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const storeManagementService = {
  // 1. Get All Stores
  async getAllStores(params: StoresQueryParams = {}): Promise<StoresResponse> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}/stores${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<StoresResponse>(response);
  },

  // 2. Create Store
  async createStore(storeData: CreateStoreForm): Promise<StoreResponse> {
    const response = await fetch(`${API_BASE_URL}/stores`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData)
    });
    
    return handleResponse<StoreResponse>(response);
  },

  // 3. Get Store by ID
  async getStoreById(storeId: string): Promise<StoreResponse> {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<StoreResponse>(response);
  },

  // 4. Update Store
  async updateStore(storeId: string, storeData: UpdateStoreForm): Promise<StoreResponse> {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData)
    });
    
    return handleResponse<StoreResponse>(response);
  },

  // 5. Get Store Users
  async getStoreUsers(storeId: string): Promise<StoreUsersResponse> {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<StoreUsersResponse>(response);
  },

  // 6. Get Store Roles
  async getStoreRoles(storeId: string): Promise<StoreRolesResponse> {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/roles`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<StoreRolesResponse>(response);
  }
};

export default storeManagementService;