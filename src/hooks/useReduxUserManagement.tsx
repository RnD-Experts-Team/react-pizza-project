import { useCallback } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import type {
  UserManagementState,
  UsersQueryParams,
  User,
  CreateUserForm,
  UpdateUserForm,
  CreateRoleForm,
  CreatePermissionForm,
  AssignRolesForm,
  AssignPermissionsForm
} from '../types/userManagement';
import userManagementService from '../services/userManagementService';
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  fetchRoles,
  createRole,
  fetchPermissions,
  createPermission,
  clearError
} from '../store/slices/userManagementSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.userManagement);

  // User actions
  const fetchUsersCb = useCallback(async (params?: UsersQueryParams) => {
    await dispatch(fetchUsers(params || {}));
  }, [dispatch]);

  const fetchUserByIdCb = useCallback(async (id: number): Promise<User | null> => {
    const resultAction = await dispatch(fetchUserById(id));
    if (fetchUserById.fulfilled.match(resultAction)) {
      return resultAction.payload.data?.user || null;
    }
    return null;
  }, [dispatch]);

  const createUserCb = useCallback(async (userData: CreateUserForm): Promise<boolean> => {
    const resultAction = await dispatch(createUser(userData));
    return createUser.fulfilled.match(resultAction);
  }, [dispatch]);

  const updateUserCb = useCallback(async (id: number, userData: UpdateUserForm): Promise<boolean> => {
    const resultAction = await dispatch(updateUser({ id, userData }));
    return updateUser.fulfilled.match(resultAction);
  }, [dispatch]);

  const deleteUserCb = useCallback(async (id: number): Promise<boolean> => {
    const resultAction = await dispatch(deleteUser(id));
    return deleteUser.fulfilled.match(resultAction);
  }, [dispatch]);

  // These actions call the service directly and refresh the list after success
  const assignRolesToUserCb = useCallback(async (id: number, roles: AssignRolesForm): Promise<boolean> => {
    try {
      const response = await userManagementService.assignRolesToUser(id, roles);
      if (response.success) {
        await dispatch(fetchUsers({}));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [dispatch]);

  const givePermissionsToUserCb = useCallback(async (id: number, permissions: AssignPermissionsForm): Promise<boolean> => {
    try {
      const response = await userManagementService.givePermissionsToUser(id, permissions);
      if (response.success) {
        await dispatch(fetchUsers({}));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Role actions
  const fetchRolesCb = useCallback(async () => {
    await dispatch(fetchRoles());
  }, [dispatch]);

  const createRoleCb = useCallback(async (roleData: CreateRoleForm): Promise<boolean> => {
    const resultAction = await dispatch(createRole(roleData));
    return createRole.fulfilled.match(resultAction);
  }, [dispatch]);

  const assignPermissionsToRoleCb = useCallback(async (roleId: number, permissions: AssignPermissionsForm): Promise<boolean> => {
    try {
      const response = await userManagementService.assignPermissionsToRole(roleId, permissions);
      if (response.success) {
        await dispatch(fetchRoles());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Permission actions
  const fetchPermissionsCb = useCallback(async () => {
    await dispatch(fetchPermissions());
  }, [dispatch]);

  const createPermissionCb = useCallback(async (permissionData: CreatePermissionForm): Promise<boolean> => {
    const resultAction = await dispatch(createPermission(permissionData));
    return createPermission.fulfilled.match(resultAction);
  }, [dispatch]);

  // Utility actions
  const clearErrorCb = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setLoadingCb = useCallback((loading: boolean) => {
    // For consistency with the original hook, we provide this but it's not needed
    // since Redux manages loading state automatically through async thunks
    console.warn('setLoading is not needed with Redux - loading state is managed automatically');
  }, []);

  return {
    state,
    actions: {
      // User actions
      fetchUsers: fetchUsersCb,
      fetchUserById: fetchUserByIdCb,
      createUser: createUserCb,
      updateUser: updateUserCb,
      deleteUser: deleteUserCb,
      assignRolesToUser: assignRolesToUserCb,
      givePermissionsToUser: givePermissionsToUserCb,
      
      // Role actions
      fetchRoles: fetchRolesCb,
      createRole: createRoleCb,
      assignPermissionsToRole: assignPermissionsToRoleCb,
      
      // Permission actions
      fetchPermissions: fetchPermissionsCb,
      createPermission: createPermissionCb,
      
      // Utility actions
      clearError: clearErrorCb,
      setLoading: setLoadingCb
    }
  };
};

export default useUserManagement;
