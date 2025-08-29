import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  loadPermissionsAndRoles,
} from '../../features/auth/utils/permissionAndRolesStorage';
import type { PermissionCheckType, RoleCheckType } from '../../features/auth/types';

interface PermissionBasedRouteProps {
  /** Component to render when user has required permissions/roles */
  children: React.ReactNode;
  
  // Permission-based access control
  /** Single permission name to check */
  permission?: string;
  /** Array of permission names to check */
  permissions?: string[];
  /** How to check multiple permissions: 'any' (default) or 'all' */
  permissionCheckType?: PermissionCheckType;
  
  // Role-based access control
  /** Single role name to check */
  role?: string;
  /** Array of role names to check */
  roles?: string[];
  /** How to check multiple roles: 'any' (default) or 'all' */
  roleCheckType?: RoleCheckType;
  
  // Route behavior
  /** Path to redirect to when access is denied (default: '/unauthorized') */
  redirectTo?: string;
  /** Whether to replace the current history entry (default: true) */
  replace?: boolean;
  
  // Error handling
  /** Component to render when there's an error checking permissions/roles */
  errorFallback?: React.ReactNode;
  /** Whether to show error message when neither Redux nor localStorage has data */
  showErrorOnDataMissing?: boolean;
  
  // Callbacks
  /** Callback function called when access is denied */
  onAccessDenied?: (reason: 'unauthenticated' | 'insufficient_permissions' | 'insufficient_roles' | 'data_missing') => void;
}

/**
 * PermissionBasedRoute component that protects routes based on user permissions and/or roles.
 * 
 * Priority order for checking permissions/roles:
 * 1. Redux store (auth.permissions, auth.roles)
 * 2. localStorage fallback
 * 3. Error handling if neither source has data
 * 
 * @example
 * // Single permission check
 * <PermissionBasedRoute permission="users.view">
 *   <UsersPage />
 * </PermissionBasedRoute>
 * 
 * @example
 * // Multiple permissions with role check
 * <PermissionBasedRoute 
 *   permissions={["users.create", "users.edit"]} 
 *   permissionCheckType="any"
 *   role="admin"
 *   redirectTo="/dashboard"
 * >
 *   <AdminUsersPage />
 * </PermissionBasedRoute>
 * 
 * @example
 * // Complex access control with error handling
 * <PermissionBasedRoute 
 *   permissions={["stores.manage", "inventory.manage"]} 
 *   permissionCheckType="all"
 *   roles={["store-manager", "admin"]}
 *   roleCheckType="any"
 *   redirectTo="/access-denied"
 *   showErrorOnDataMissing={true}
 *   onAccessDenied={(reason) => console.log('Access denied:', reason)}
 * >
 *   <StoreManagementPage />
 * </PermissionBasedRoute>
 */
export const PermissionBasedRoute: React.FC<PermissionBasedRouteProps> = ({
  children,
  permission,
  permissions,
  permissionCheckType = 'any',
  role,
  roles,
  roleCheckType = 'any',
  redirectTo = '/unauthorized',
  replace = true,
  errorFallback,
  showErrorOnDataMissing = false,
  onAccessDenied,
}) => {
  const location = useLocation();
  
  // Get auth state from Redux store
  const reduxPermissions = useSelector((state: RootState) => state.auth.permissions);
  const reduxRoles = useSelector((state: RootState) => state.auth.roles);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  // If auth is not initialized yet, show loading or nothing
  if (!isInitialized) {
    return null;
  }

  // If user is not authenticated, redirect to login or specified path
  if (!isAuthenticated) {
    onAccessDenied?.('unauthenticated');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace={replace} 
      />
    );
  }

  // Validate that at least one access control method is specified
  const hasPermissionCheck = permission || (permissions && permissions.length > 0);
  const hasRoleCheck = role || (roles && roles.length > 0);
  
  if (!hasPermissionCheck && !hasRoleCheck) {
    console.error('PermissionBasedRoute: At least one of permission, permissions, role, or roles must be provided');
    
    if (showErrorOnDataMissing) {
      const errorComponent = errorFallback || (
        <div className="text-red-500 text-sm p-4 bg-red-50 border border-red-200 rounded">
          Error: No access control rules specified for this route
        </div>
      );
      return <>{errorComponent}</>;
    }
    
    // Default to denying access when no rules are specified
    onAccessDenied?.('insufficient_permissions');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace={replace} 
      />
    );
  }

  let hasRequiredPermissions = true;
  let hasRequiredRoles = true;
  let dataAvailable = false;

  try {
    // Check permissions if specified
    if (hasPermissionCheck) {
      const permissionsToCheck = permission ? [permission] : permissions!;
      
      // First, try Redux store
      if (reduxPermissions && reduxPermissions.length > 0) {
        dataAvailable = true;
        if (permissionCheckType === 'all') {
          hasRequiredPermissions = permissionsToCheck.every(perm => 
            reduxPermissions.includes(perm)
          );
        } else {
          hasRequiredPermissions = permissionsToCheck.some(perm => 
            reduxPermissions.includes(perm)
          );
        }
      } else {
        // Fallback to localStorage
        const permissionsData = loadPermissionsAndRoles();
        
        if (permissionsData) {
          dataAvailable = true;
          if (permissionsToCheck.length === 1) {
            hasRequiredPermissions = hasPermission(permissionsToCheck[0]);
          } else if (permissionCheckType === 'all') {
            hasRequiredPermissions = hasAllPermissions(permissionsToCheck);
          } else {
            hasRequiredPermissions = hasAnyPermission(permissionsToCheck);
          }
        }
      }
    }

    // Check roles if specified
    if (hasRoleCheck) {
      const rolesToCheck = role ? [role] : roles!;
      
      // First, try Redux store
      if (reduxRoles && reduxRoles.length > 0) {
        dataAvailable = true;
        if (roleCheckType === 'all') {
          hasRequiredRoles = rolesToCheck.every(roleToCheck => 
            reduxRoles.includes(roleToCheck)
          );
        } else {
          hasRequiredRoles = rolesToCheck.some(roleToCheck => 
            reduxRoles.includes(roleToCheck)
          );
        }
      } else {
        // Fallback to localStorage
        const permissionsData = loadPermissionsAndRoles();
        
        if (permissionsData) {
          dataAvailable = true;
          if (rolesToCheck.length === 1) {
            hasRequiredRoles = hasRole(rolesToCheck[0]);
          } else if (roleCheckType === 'all') {
            hasRequiredRoles = hasAllRoles(rolesToCheck);
          } else {
            hasRequiredRoles = hasAnyRole(rolesToCheck);
          }
        }
      }
    }

    // Handle case where no data is available
    if (!dataAvailable) {
      console.warn('PermissionBasedRoute: No permissions/roles data found in Redux store or localStorage');
      
      if (showErrorOnDataMissing) {
        const errorComponent = errorFallback || (
          <div className="text-yellow-600 text-sm p-4 bg-yellow-50 border border-yellow-200 rounded">
            Warning: Unable to verify access permissions. Please refresh the page or contact support.
          </div>
        );
        return <>{errorComponent}</>;
      }
      
      // Default to denying access when no data is available
      onAccessDenied?.('data_missing');
      return (
        <Navigate 
          to={redirectTo} 
          state={{ from: location }} 
          replace={replace} 
        />
      );
    }
  } catch (error) {
    console.error('PermissionBasedRoute: Error checking permissions/roles:', error);
    
    if (showErrorOnDataMissing) {
      const errorComponent = errorFallback || (
        <div className="text-red-500 text-sm p-4 bg-red-50 border border-red-200 rounded">
          Error: Failed to check access permissions. Please try again.
        </div>
      );
      return <>{errorComponent}</>;
    }
    
    // Default to denying access on error
    onAccessDenied?.('data_missing');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace={replace} 
      />
    );
  }

  // Check if user has required permissions and roles
  if (!hasRequiredPermissions) {
    onAccessDenied?.('insufficient_permissions');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace={replace} 
      />
    );
  }

  if (!hasRequiredRoles) {
    onAccessDenied?.('insufficient_roles');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace={replace} 
      />
    );
  }

  // User has required permissions and roles, render the protected component
  return <>{children}</>;
};

export default PermissionBasedRoute;