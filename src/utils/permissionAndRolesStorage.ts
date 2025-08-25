import type { PermissionsAndRolesData } from '../types/authTypes';

// Storage key for permissions and roles data
const STORAGE_KEY = 'auth_permissions_and_roles';

/**
 * Save permissions and roles data unencrypted to localStorage
 * Stores data in the exact structure specified in requirements
 */
export const savePermissionsAndRoles = (data: PermissionsAndRolesData): void => {
  try {
    const dataString = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, dataString);
  } catch (error) {
    console.error('Failed to save permissions and roles:', error);
  }
};

/**
 * Load permissions and roles data from localStorage
 * Returns null if not found or parsing fails
 */
export const loadPermissionsAndRoles = (): PermissionsAndRolesData | null => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      return null;
    }
    
    const parsedData = JSON.parse(storedData) as PermissionsAndRolesData;
    
    // Validate the structure
    if (!parsedData || typeof parsedData !== 'object') {
      clearPermissionsAndRoles();
      return null;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Failed to load permissions and roles:', error);
    // Clear potentially corrupted data
    clearPermissionsAndRoles();
    return null;
  }
};

/**
 * Clear all stored permissions and roles data
 */
export const clearPermissionsAndRoles = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear permissions and roles:', error);
  }
};

/**
 * Check if permissions and roles data exists in storage
 */
export const hasPermissionsAndRoles = (): boolean => {
  return loadPermissionsAndRoles() !== null;
};

/**
 * Get all permission names as string array from cached data
 */
export const getAllPermissionNames = (): string[] => {
  const data = loadPermissionsAndRoles();
  if (!data || !data.all_permissions) return [];
  return data.all_permissions.map((permission) => permission.name);
};

/**
 * Get all role names as string array from cached data
 */
export const getAllRoleNames = (): string[] => {
  const data = loadPermissionsAndRoles();
  if (!data || !data.global_roles) return [];
  return data.global_roles.map((role) => role.name);
};

/**
 * Get all permissions with full details
 */
export const getAllPermissions = () => {
  const data = loadPermissionsAndRoles();
  return data?.all_permissions || [];
};

/**
 * Get all roles with full details
 */
export const getAllRoles = () => {
  const data = loadPermissionsAndRoles();
  return data?.global_roles || [];
};

/**
 * Get user summary data
 */
export const getUserSummary = () => {
  const data = loadPermissionsAndRoles();
  return data?.summary || null;
};

/**
 * Get stores data
 */
export const getStores = () => {
  const data = loadPermissionsAndRoles();
  return data?.stores || [];
};

/**
 * Check if a specific permission exists
 */
export const hasPermission = (permissionName: string): boolean => {
  if (!permissionName) return false;
  const permissions = getAllPermissionNames();
  return permissions.includes(permissionName);
};

/**
 * Check if a specific role exists
 */
export const hasRole = (roleName: string): boolean => {
  if (!roleName) return false;
  const roles = getAllRoleNames();
  return roles.includes(roleName);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (permissionsList: string[]): boolean => {
  if (!permissionsList || permissionsList.length === 0) return false;
  const userPermissions = getAllPermissionNames();
  return permissionsList.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (permissionsList: string[]): boolean => {
  if (!permissionsList || permissionsList.length === 0) return false;
  const userPermissions = getAllPermissionNames();
  return permissionsList.every((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (rolesList: string[]): boolean => {
  if (!rolesList || rolesList.length === 0) return false;
  const userRoles = getAllRoleNames();
  return rolesList.some((role) => userRoles.includes(role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (rolesList: string[]): boolean => {
  if (!rolesList || rolesList.length === 0) return false;
  const userRoles = getAllRoleNames();
  return rolesList.every((role) => userRoles.includes(role));
};

/**
 * Check if user is super admin (convenience function)
 */
export const isSuperAdmin = (): boolean => {
  return hasRole('super-admin');
};

/**
 * Get cached timestamp
 */
export const getCachedAt = (): string | null => {
  const data = loadPermissionsAndRoles();
  return data?.cached_at || null;
};

/**
 * Get expiration timestamp
 */
export const getExpiresAt = (): string | null => {
  const data = loadPermissionsAndRoles();
  return data?.expires_at || null;
};

/**
 * Check if cached data is expired
 */
export const isDataExpired = (): boolean => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return true;
  
  try {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get time until expiration in minutes
 */
export const getTimeUntilExpiration = (): number | null => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return null;
  
  try {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = expirationTime - currentTime;
    return Math.max(0, Math.floor(timeDiff / (1000 * 60))); // Convert to minutes
  } catch (error) {
    return null;
  }
};

/**
 * Refresh cached data expiration time (extend by 30 minutes)
 */
export const refreshCacheExpiration = (): void => {
  const data = loadPermissionsAndRoles();
  if (!data) return;
  
  const newExpirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  const updatedData = {
    ...data,
    expires_at: newExpirationTime.toISOString(),
  };
  
  savePermissionsAndRoles(updatedData);
};

// Default export with all functions
export default {
  savePermissionsAndRoles,
  loadPermissionsAndRoles,
  clearPermissionsAndRoles,
  hasPermissionsAndRoles,
  getAllPermissionNames,
  getAllRoleNames,
  getAllPermissions,
  getAllRoles,
  getUserSummary,
  getStores,
  hasPermission,
  hasRole,
  hasAnyPermission,
  hasAllPermissions,
  hasAnyRole,
  hasAllRoles,
  isSuperAdmin,
  getCachedAt,
  getExpiresAt,
  isDataExpired,
  getTimeUntilExpiration,
  refreshCacheExpiration,
};
