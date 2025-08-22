import type {
  AssignUserRoleToStoreRequest,
  AssignUserRoleToStoreResponse,
  ToggleUserRoleStoreStatusRequest,
  ToggleUserRoleStoreStatusResponse,
  GetStoreAssignmentsResponse,
  GetUserAssignmentsResponse,
  BulkAssignUserRolesRequest,
  BulkAssignUserRolesResponse,
  RemoveUserRoleStoreRequest,
  RemoveUserRoleStoreResponse,
} from '../types/userRoleStoreAssignment';
import { tokenStorage } from '../utils/tokenStorage';
import { toApiError } from '../utils/toApiErrors';

const BASE_URL = 'https://auth.pnepizza.com/api/v1/user-role-store';

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

export const userRoleStoreAssignmentService = {
  /**
   * Assign a user role to a store
   */
  async assignUserRoleToStore(
    data: AssignUserRoleToStoreRequest
  ): Promise<AssignUserRoleToStoreResponse> {
    const response = await fetch(`${BASE_URL}/assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AssignUserRoleToStoreResponse>(response);
  },

  /**
   * Toggle user role store status (activate/deactivate)
   */
  async toggleUserRoleStoreStatus(
    data: ToggleUserRoleStoreStatusRequest
  ): Promise<ToggleUserRoleStoreStatusResponse> {
    const response = await fetch(`${BASE_URL}/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ToggleUserRoleStoreStatusResponse>(response);
  },

  /**
   * Get all assignments for a specific store
   */
  async getStoreAssignments(
    storeId: string
  ): Promise<GetStoreAssignmentsResponse> {
    const response = await fetch(
      `${BASE_URL}/store-assignments?store_id=${encodeURIComponent(storeId)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
        },
      }
    );
    return handleResponse<GetStoreAssignmentsResponse>(response);
  },

  /**
   * Get all assignments for a specific user
   */
  async getUserAssignments(
    userId: number
  ): Promise<GetUserAssignmentsResponse> {
    const response = await fetch(
      `${BASE_URL}/user-assignments?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenStorage.getToken()}`,
        },
      }
    );
    return handleResponse<GetUserAssignmentsResponse>(response);
  },

  /**
   * Bulk assign user roles to multiple stores
   */
  async bulkAssignUserRoles(
    data: BulkAssignUserRolesRequest
  ): Promise<BulkAssignUserRolesResponse> {
    const response = await fetch(`${BASE_URL}/bulk-assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<BulkAssignUserRolesResponse>(response);
  },

  /**
   * Remove a user role from a store
   */
  async removeUserRoleStore(
    data: RemoveUserRoleStoreRequest
  ): Promise<RemoveUserRoleStoreResponse> {
    const response = await fetch(`${BASE_URL}/remove`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RemoveUserRoleStoreResponse>(response);
  },
};

export default userRoleStoreAssignmentService;