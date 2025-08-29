import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  loadPermissionsAndRoles,
} from '../../features/auth/utils/permissionAndRolesStorage';
import type { RoleCheckType } from '../../features/auth/types';

interface RoleGuardProps {
  /** Single role name to check */
  role?: string;
  /** Array of role names to check */
  roles?: string[];
  /** How to check multiple roles: 'any' (default) or 'all' */
  checkType?: RoleCheckType;
  /** Component to render when user has required roles */
  children: React.ReactNode;
  /** Component to render when user lacks roles (optional) */
  fallback?: React.ReactNode;
  /** Callback function called when role check fails */
  onRoleDenied?: () => void;
  /** Whether to show error message when neither Redux nor localStorage has data */
  showErrorOnDataMissing?: boolean;
}

/**
 * RoleGuard component that conditionally renders children based on user roles.
 * 
 * Priority order for checking roles:
 * 1. Redux store (auth.roles)
 * 2. localStorage fallback
 * 3. Error handling if neither source has data
 * 
 * @example
 * // Single role check
 * <RoleGuard role="admin">
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * @example
 * // Multiple roles with 'any' check (default)
 * <RoleGuard roles={["admin", "manager"]}>
 *   <ManagementTools />
 * </RoleGuard>
 * 
 * @example
 * // Multiple roles with 'all' check
 * <RoleGuard 
 *   roles={["admin", "super-admin"]} 
 *   checkType="all"
 *   fallback={<div>Insufficient privileges</div>}
 * >
 *   <SuperAdminPanel />
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  role,
  roles,
  checkType = 'any',
  children,
  fallback = null,
  onRoleDenied,
  showErrorOnDataMissing = false,
}) => {
  // Get roles from Redux store
  const reduxRoles = useSelector((state: RootState) => state.auth.roles);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  // If auth is not initialized yet, don't render anything
  if (!isInitialized) {
    return null;
  }

  // If user is not authenticated, deny access
  if (!isAuthenticated) {
    onRoleDenied?.();
    return <>{fallback}</>;
  }

  // Validate input props
  if (!role && (!roles || roles.length === 0)) {
    console.error('RoleGuard: Either "role" or "roles" prop must be provided');
    return showErrorOnDataMissing ? (
      <div className="text-red-500 text-sm">
        Error: No roles specified for RoleGuard
      </div>
    ) : <>{fallback}</>;
  }

  // Determine which roles to check
  const rolesToCheck = role ? [role] : roles!;

  let hasRequiredRoles = false;

  try {
    // First, try to get roles from Redux store
    if (reduxRoles && reduxRoles.length > 0) {
      if (checkType === 'all') {
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
        if (rolesToCheck.length === 1) {
          hasRequiredRoles = hasRole(rolesToCheck[0]);
        } else if (checkType === 'all') {
          hasRequiredRoles = hasAllRoles(rolesToCheck);
        } else {
          hasRequiredRoles = hasAnyRole(rolesToCheck);
        }
      } else {
        // Neither Redux nor localStorage has roles data
        console.warn('RoleGuard: No roles data found in Redux store or localStorage');
        
        if (showErrorOnDataMissing) {
          return (
            <div className="text-yellow-600 text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
              Warning: Unable to verify roles. Please refresh the page or contact support.
            </div>
          );
        }
        
        // Default to denying access when no data is available
        hasRequiredRoles = false;
      }
    }
  } catch (error) {
    console.error('RoleGuard: Error checking roles:', error);
    
    if (showErrorOnDataMissing) {
      return (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
          Error: Failed to check roles. Please try again.
        </div>
      );
    }
    
    // Default to denying access on error
    hasRequiredRoles = false;
  }

  // Handle role denied
  if (!hasRequiredRoles) {
    onRoleDenied?.();
    return <>{fallback}</>;
  }

  // User has required roles, render children
  return <>{children}</>;
};

export default RoleGuard;