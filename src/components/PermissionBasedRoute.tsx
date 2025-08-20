import { Navigate } from 'react-router-dom';
import { useReduxAuth } from '../hooks/useReduxAuth';

interface PermissionBasedRouteProps {
  permissions: string | string[];
  requireAll?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Route component that requires specific permissions
 */
export const PermissionBasedRoute: React.FC<PermissionBasedRouteProps> = ({
  permissions,
  requireAll = false,
  redirectTo = '/dashboard',
  fallback,
  children,
}) => {
  const { getCachedAllPermissions, isAuthenticated } = useReduxAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const userPermissions = getCachedAllPermissions();
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  
  const hasPermission = requireAll
    ? requiredPermissions.every(permission => 
        userPermissions.some(userPerm => userPerm.name === permission)
      )
    : requiredPermissions.some(permission => 
        userPermissions.some(userPerm => userPerm.name === permission)
      );

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
