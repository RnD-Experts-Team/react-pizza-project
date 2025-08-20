import { useEffect, useRef } from 'react';
import { useReduxAuth } from '../hooks/useReduxAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that initializes auth state before rendering children
 * Use this to wrap your app or routes that need auth
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { 
    isInitialized, 
    isLoading, 
    isAuthenticated, 
    user, 
    token,
    fetchUserProfile 
  } = useReduxAuth();
  
  const hasFetchedProfile = useRef(false);

  // FIXED: Only fetch user profile once if we have token but no user data
  useEffect(() => {
    if (isInitialized && 
        isAuthenticated && 
        token && 
        !user && 
        !hasFetchedProfile.current && 
        !isLoading) {
      hasFetchedProfile.current = true;
      fetchUserProfile();
    }
  }, [isInitialized, isAuthenticated, token, user, isLoading, fetchUserProfile]);

  if (!isInitialized || isLoading) {
    // You can customize this loading component
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
