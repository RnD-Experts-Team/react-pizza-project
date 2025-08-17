import { useState, useEffect, useCallback } from 'react';
import type {
  User,
  Role,
  Permission,
  UserManagementState,
  UsersQueryParams,
  CreateUserForm,
  UpdateUserForm,
  CreateRoleForm,
  CreatePermissionForm,
  AssignRolesForm,
  AssignPermissionsForm,
  PaginationMeta
} from '../types/userManagement';
import { userManagementService } from '../services/userManagementService';

interface UseUserManagementReturn {
  state: UserManagementState;
  actions: {
    // User actions
    fetchUsers: (params?: UsersQueryParams) => Promise<void>;
    fetchUserById: (id: number) => Promise<User | null>;
    createUser: (userData: CreateUserForm) => Promise<boolean>;
    updateUser: (id: number, userData: UpdateUserForm) => Promise<boolean>;
    deleteUser: (id: number) => Promise<boolean>;
    assignRolesToUser: (id: number, roles: AssignRolesForm) => Promise<boolean>;
    givePermissionsToUser: (id: number, permissions: AssignPermissionsForm) => Promise<boolean>;
    
    // Role actions
    fetchRoles: () => Promise<void>;
    createRole: (roleData: CreateRoleForm) => Promise<boolean>;
    assignPermissionsToRole: (roleId: number, permissions: AssignPermissionsForm) => Promise<boolean>;
    
    // Permission actions
    fetchPermissions: () => Promise<void>;
    createPermission: (permissionData: CreatePermissionForm) => Promise<boolean>;
    
    // Utility actions
    clearError: () => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [state, setState] = useState<UserManagementState>({
    users: [],
    roles: [],
    permissions: [],
    loading: false,
    error: null,
    pagination: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // User actions
  const fetchUsers = useCallback(async (params: UsersQueryParams = {}) => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.getAllUsers(params);
      
      if (response.success && response.data) {
        const { data: users, ...pagination } = response.data;
        setState(prev => ({
          ...prev,
          users,
          pagination,
          loading: false
        }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }, [setLoading, clearError, setError]);

  const fetchUserById = useCallback(async (id: number): Promise<User | null> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.getUserById(id);
      
      if (response.success && response.data) {
        setLoading(false);
        return response.data.user;
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user');
      return null;
    }
  }, [setLoading, clearError, setError]);

  const createUser = useCallback(async (userData: CreateUserForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.createUser(userData);
      
      if (response.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create user');
      return false;
    }
  }, [setLoading, clearError, setError, fetchUsers]);

  const updateUser = useCallback(async (id: number, userData: UpdateUserForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.updateUser(id, userData);
      
      if (response.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user');
      return false;
    }
  }, [setLoading, clearError, setError, fetchUsers]);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.deleteUser(id);
      
      if (response.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
      return false;
    }
  }, [setLoading, clearError, setError, fetchUsers]);

  const assignRolesToUser = useCallback(async (id: number, roles: AssignRolesForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.assignRolesToUser(id, roles);
      
      if (response.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign roles');
      return false;
    }
  }, [setLoading, clearError, setError, fetchUsers]);

  const givePermissionsToUser = useCallback(async (id: number, permissions: AssignPermissionsForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.givePermissionsToUser(id, permissions);
      
      if (response.success) {
        // Refresh users list
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign permissions');
      return false;
    }
  }, [setLoading, clearError, setError, fetchUsers]);

  // Role actions
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.getAllRoles();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          roles: response.data!.data,
          loading: false
        }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch roles');
    }
  }, [setLoading, clearError, setError]);

  const createRole = useCallback(async (roleData: CreateRoleForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.createRole(roleData);
      
      if (response.success) {
        // Refresh roles list
        await fetchRoles();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create role');
      return false;
    }
  }, [setLoading, clearError, setError, fetchRoles]);

  const assignPermissionsToRole = useCallback(async (roleId: number, permissions: AssignPermissionsForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.assignPermissionsToRole(roleId, permissions);
      
      if (response.success) {
        // Refresh roles list
        await fetchRoles();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign permissions to role');
      return false;
    }
  }, [setLoading, clearError, setError, fetchRoles]);

  // Permission actions
  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.getAllPermissions();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          permissions: response.data!.data,
          loading: false
        }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch permissions');
    }
  }, [setLoading, clearError, setError]);

  const createPermission = useCallback(async (permissionData: CreatePermissionForm): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await userManagementService.createPermission(permissionData);
      
      if (response.success) {
        // Refresh permissions list
        await fetchPermissions();
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create permission');
      return false;
    }
  }, [setLoading, clearError, setError, fetchPermissions]);

  return {
    state,
    actions: {
      // User actions
      fetchUsers,
      fetchUserById,
      createUser,
      updateUser,
      deleteUser,
      assignRolesToUser,
      givePermissionsToUser,
      
      // Role actions
      fetchRoles,
      createRole,
      assignPermissionsToRole,
      
      // Permission actions
      fetchPermissions,
      createPermission,
      
      // Utility actions
      clearError,
      setLoading
    }
  };
};

export default useUserManagement;