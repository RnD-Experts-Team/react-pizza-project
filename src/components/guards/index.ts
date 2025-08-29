// Export all guard components
export { PermissionGuard } from './PermissionGuard';
export { RoleGuard } from './RoleGuard';
export { PermissionBasedRoute } from './PermissionBasedRoute';

// Re-export default exports for convenience
export { default as PermissionGuardDefault } from './PermissionGuard';
export { default as RoleGuardDefault } from './RoleGuard';
export { default as PermissionBasedRouteDefault } from './PermissionBasedRoute';

// Export types for external use
export type {
  PermissionCheckType,
  RoleCheckType,
} from '../../features/auth/types';