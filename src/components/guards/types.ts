import React from 'react';
import type { PermissionCheckType, RoleCheckType } from '../../features/auth/types';

/**
 * Base interface for all guard components
 */
export interface BaseGuardProps {
  /** Component to render when access is granted */
  children: React.ReactNode;
  /** Component to render when access is denied (optional) */
  fallback?: React.ReactNode;
  /** Whether to show error message when neither Redux nor localStorage has data */
  showErrorOnDataMissing?: boolean;
}

/**
 * Props for PermissionGuard component
 */
export interface PermissionGuardProps extends BaseGuardProps {
  /** Single permission name to check */
  permission?: string;
  /** Array of permission names to check */
  permissions?: string[];
  /** How to check multiple permissions: 'any' (default) or 'all' */
  checkType?: PermissionCheckType;
  /** Callback function called when permission check fails */
  onPermissionDenied?: () => void;
}

/**
 * Props for RoleGuard component
 */
export interface RoleGuardProps extends BaseGuardProps {
  /** Single role name to check */
  role?: string;
  /** Array of role names to check */
  roles?: string[];
  /** How to check multiple roles: 'any' (default) or 'all' */
  checkType?: RoleCheckType;
  /** Callback function called when role check fails */
  onRoleDenied?: () => void;
}

/**
 * Reasons why access might be denied
 */
export type AccessDeniedReason = 
  | 'unauthenticated' 
  | 'insufficient_permissions' 
  | 'insufficient_roles' 
  | 'data_missing'
  | 'error';

/**
 * Props for PermissionBasedRoute component
 */
export interface PermissionBasedRouteProps {
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
  onAccessDenied?: (reason: AccessDeniedReason) => void;
}

/**
 * Configuration for permission checking
 */
export interface PermissionCheckConfig {
  /** Single permission or array of permissions to check */
  permissions: string | string[];
  /** How to check multiple permissions */
  checkType?: PermissionCheckType;
}

/**
 * Configuration for role checking
 */
export interface RoleCheckConfig {
  /** Single role or array of roles to check */
  roles: string | string[];
  /** How to check multiple roles */
  checkType?: RoleCheckType;
}

/**
 * Result of a permission/role check
 */
export interface AccessCheckResult {
  /** Whether the user has the required access */
  hasAccess: boolean;
  /** Reason for denial if access is false */
  reason?: AccessDeniedReason;
  /** Source of the data used for checking */
  dataSource: 'redux' | 'localStorage' | 'none';
  /** Any error that occurred during checking */
  error?: Error;
}

/**
 * Hook return type for usePermissionCheck
 */
export interface UsePermissionCheckReturn {
  /** Whether the user has the required permissions */
  hasPermission: boolean;
  /** Whether the check is currently loading */
  isLoading: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Source of the permission data */
  dataSource: 'redux' | 'localStorage' | 'none';
  /** Function to manually recheck permissions */
  recheckPermissions: () => void;
}

/**
 * Hook return type for useRoleCheck
 */
export interface UseRoleCheckReturn {
  /** Whether the user has the required roles */
  hasRole: boolean;
  /** Whether the check is currently loading */
  isLoading: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Source of the role data */
  dataSource: 'redux' | 'localStorage' | 'none';
  /** Function to manually recheck roles */
  recheckRoles: () => void;
}

/**
 * Options for guard components
 */
export interface GuardOptions {
  /** Whether to show loading state while checking */
  showLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Whether to log access attempts */
  enableLogging?: boolean;
  /** Custom error handler */
  onError?: (error: Error, context: string) => void;
}

/**
 * Context value for GuardProvider
 */
export interface GuardContextValue {
  /** Global guard options */
  options: GuardOptions;
  /** Function to update global options */
  updateOptions: (options: Partial<GuardOptions>) => void;
}

/**
 * Props for GuardProvider component
 */
export interface GuardProviderProps {
  children: React.ReactNode;
  /** Default options for all guard components */
  defaultOptions?: GuardOptions;
}

/**
 * Type guard to check if a value is a valid permission check type
 */
export const isPermissionCheckType = (value: any): value is PermissionCheckType => {
  return value === 'any' || value === 'all';
};

/**
 * Type guard to check if a value is a valid role check type
 */
export const isRoleCheckType = (value: any): value is RoleCheckType => {
  return value === 'any' || value === 'all';
};

/**
 * Type guard to check if a value is a valid access denied reason
 */
export const isAccessDeniedReason = (value: any): value is AccessDeniedReason => {
  return [
    'unauthenticated',
    'insufficient_permissions',
    'insufficient_roles',
    'data_missing',
    'error'
  ].includes(value);
};