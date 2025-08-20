import { useReduxAuth } from '../hooks/useReduxAuth';

interface PermissionGuardProps {
  permissions: string | string[];
  requireAll?: boolean; // true: require ALL permissions, false: require ANY permission
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { getCachedAllPermissions } = useReduxAuth();
  
  const userPermissions = getCachedAllPermissions();
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  
  const hasPermission = requireAll
    ? requiredPermissions.every(permission => 
        userPermissions.some(userPerm => userPerm.name === permission)
      )
    : requiredPermissions.some(permission => 
        userPermissions.some(userPerm => userPerm.name === permission)
      );

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
