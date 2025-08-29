import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  loadPermissionsAndRoles,
} from '../../features/auth/utils/permissionAndRolesStorage';
import type { PermissionCheckType } from '../../features/auth/types';

interface PermissionGuardProps {
  /** Single permission name to check */
  permission?: string;
  /** Array of permission names to check */
  permissions?: string[];
  /** How to check multiple permissions: 'any' (default) or 'all' */
  checkType?: PermissionCheckType;
  /** Component to render when user has required permissions */
  children: React.ReactNode;
  /** Component to render when user lacks permissions (optional) */
  fallback?: React.ReactNode;
  /** Callback function called when permission check fails */
  onPermissionDenied?: () => void;
  /** Whether to show error message when neither Redux nor localStorage has data */
  showErrorOnDataMissing?: boolean;
}

/**
 * PermissionGuard component that conditionally renders children based on user permissions.
 * 
 * Priority order for checking permissions:
 * 1. Redux store (auth.permissions)
 * 2. localStorage fallback
 * 3. Error handling if neither source has data
 * 
 * @example
 * // Single permission check
 * <PermissionGuard permission="users.create">
 *   <CreateUserButton />
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions with 'any' check (default)
 * <PermissionGuard permissions={["users.create", "users.edit"]}>
 *   <UserManagementPanel />
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions with 'all' check
 * <PermissionGuard 
 *   permissions={["users.create", "users.delete"]} 
 *   checkType="all"
 *   fallback={<div>Insufficient permissions</div>}
 * >
 *   <AdminPanel />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  checkType = 'any',
  children,
  fallback = null,
  onPermissionDenied,
  showErrorOnDataMissing = false,
}) => {
  // Get permissions from Redux store
  const reduxPermissions = useSelector((state: RootState) => state.auth.permissions);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  // If auth is not initialized yet, don't render anything
  if (!isInitialized) {
    return null;
  }

  // If user is not authenticated, deny access
  if (!isAuthenticated) {
    onPermissionDenied?.();
    return <>{fallback}</>;
  }

  // Validate input props
  if (!permission && (!permissions || permissions.length === 0)) {
    console.error('PermissionGuard: Either "permission" or "permissions" prop must be provided');
    return showErrorOnDataMissing ? (
      <div className="text-red-500 text-sm">
        Error: No permissions specified for PermissionGuard
      </div>
    ) : <>{fallback}</>;
  }

  // Determine which permissions to check
  const permissionsToCheck = permission ? [permission] : permissions!;

  let hasRequiredPermissions = false;

  try {
    // First, try to get permissions from Redux store
    if (reduxPermissions && reduxPermissions.length > 0) {
      if (checkType === 'all') {
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
        if (permissionsToCheck.length === 1) {
          hasRequiredPermissions = hasPermission(permissionsToCheck[0]);
        } else if (checkType === 'all') {
          hasRequiredPermissions = hasAllPermissions(permissionsToCheck);
        } else {
          hasRequiredPermissions = hasAnyPermission(permissionsToCheck);
        }
      } else {
        // Neither Redux nor localStorage has permissions data
        console.warn('PermissionGuard: No permissions data found in Redux store or localStorage');
        
        if (showErrorOnDataMissing) {
          return (
            <div className="text-yellow-600 text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
              Warning: Unable to verify permissions. Please refresh the page or contact support.
            </div>
          );
        }
        
        // Default to denying access when no data is available
        hasRequiredPermissions = false;
      }
    }
  } catch (error) {
    console.error('PermissionGuard: Error checking permissions:', error);
    
    if (showErrorOnDataMissing) {
      return (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
          Error: Failed to check permissions. Please try again.
        </div>
      );
    }
    
    // Default to denying access on error
    hasRequiredPermissions = false;
  }

  // Handle permission denied
  if (!hasRequiredPermissions) {
    onPermissionDenied?.();
    return <>{fallback}</>;
  }

  // User has required permissions, render children
  return <>{children}</>;
};

export default PermissionGuard;