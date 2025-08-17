import type {
  UsersResponse,
  RolesResponse,
  PermissionsResponse,
  UserResponse,
  RoleResponse,
  PermissionResponse,
  CreateUserForm,
  UpdateUserForm,
  CreateRoleForm,
  CreatePermissionForm,
  AssignRolesForm,
  AssignPermissionsForm,
  UsersQueryParams,
  ErrorResponse
} from '../types/userManagement';

const API_BASE_URL = 'https://auth.pnepizza.com/api/v1';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
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

export const userManagementService = {
  // User APIs
  async getAllUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<UsersResponse>(response);
  },

  async getUserById(id: number): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<UserResponse>(response);
  },

  async createUser(userData: CreateUserForm): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    return handleResponse<UserResponse>(response);
  },

  async updateUser(id: number, userData: UpdateUserForm): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    return handleResponse<UserResponse>(response);
  },

  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; message: string }>(response);
  },

  async assignRolesToUser(id: number, roles: AssignRolesForm): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roles)
    });
    
    return handleResponse<UserResponse>(response);
  },

  async givePermissionsToUser(id: number, permissions: AssignPermissionsForm): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/permissions/give`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(permissions)
    });
    
    return handleResponse<UserResponse>(response);
  },

  // Role APIs
  async getAllRoles(): Promise<RolesResponse> {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<RolesResponse>(response);
  },

  async createRole(roleData: CreateRoleForm): Promise<RoleResponse> {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData)
    });
    
    return handleResponse<RoleResponse>(response);
  },

  async assignPermissionsToRole(roleId: number, permissions: AssignPermissionsForm): Promise<RoleResponse> {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}/permissions/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(permissions)
    });
    
    return handleResponse<RoleResponse>(response);
  },

  // Permission APIs
  async getAllPermissions(): Promise<PermissionsResponse> {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse<PermissionsResponse>(response);
  },

  async createPermission(permissionData: CreatePermissionForm): Promise<PermissionResponse> {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(permissionData)
    });
    
    return handleResponse<PermissionResponse>(response);
  }
};

export default userManagementService;