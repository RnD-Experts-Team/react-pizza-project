import type {
  CreateRoleHierarchyRequest,
  CreateRoleHierarchyResponse,
  GetStoreHierarchyResponse,
  GetStoreHierarchyTreeResponse,
} from '../types/roleHierarchy';
import { tokenStorage } from '../utils/tokenStorage';
import { toApiError } from '../utils/toApiErrors';

const BASE_URL = 'https://auth.pnepizza.com/api/v1/role-hierarchy';

const getHeaders = () => {
  const token = tokenStorage.getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Network error occurred',
      errors: {},
    }));
    throw toApiError(errorData);
  }
  return response.json();
};

export const roleHierarchyService = {
  /**
   * Create a new role hierarchy
   */
  async createRoleHierarchy(
    data: CreateRoleHierarchyRequest
  ): Promise<CreateRoleHierarchyResponse> {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CreateRoleHierarchyResponse>(response);
  },

  /**
   * Get store hierarchy
   */
  async getStoreHierarchy(
    storeId: string
  ): Promise<GetStoreHierarchyResponse> {
    const response = await fetch(`${BASE_URL}/store?store_id=${storeId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<GetStoreHierarchyResponse>(response);
  },

  /**
   * Get store hierarchy tree
   */
  async getStoreHierarchyTree(
    storeId: string
  ): Promise<GetStoreHierarchyTreeResponse> {
    const response = await fetch(`${BASE_URL}/tree?store_id=${storeId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<GetStoreHierarchyTreeResponse>(response);
  },
};

export default roleHierarchyService;