import { useReduxAuth } from '../hooks/useReduxAuth';

interface RoleGuardProps {
  roles: string | string[];
  requireAll?: boolean; // true: require ALL roles, false: require ANY role
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user roles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { getCachedRoles } = useReduxAuth();
  
  const userRoles = getCachedRoles();
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  const hasRole = requireAll
    ? requiredRoles.every(role => 
        userRoles.some(userRole => userRole.name === role)
      )
    : requiredRoles.some(role => 
        userRoles.some(userRole => userRole.name === role)
      );

  return hasRole ? <>{children}</> : <>{fallback}</>;
};
