import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../types/authTypes.ts';
import { authService } from '../services/authService.ts';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const user = await authService.getUserProfile();
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.login({ email, password });
      console.log('Login response:', response);

      // Handle successful login
      if (response.success && response.data?.token && response.data?.user) {
        setAuthState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        // Handle failed login (invalid credentials or other errors)
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          message: response.message || 'Login failed'
        };
      }
    } catch (error: any) {
      console.error('Login failed with exception:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        message: 'Login failed. Please try again.'
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Set loading state
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // Attempt to logout on server
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of server response
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<{ success: boolean; message?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { 
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        message: 'Registration failed. Please try again.'
      };
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await authService.getUserProfile();
      setAuthState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refreshing user fails, it might mean token is invalid
      // The interceptor will handle token refresh if needed
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
