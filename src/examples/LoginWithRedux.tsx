import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useReduxAuth } from '../hooks/useReduxAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

/**
 * Example Login component using Redux instead of useAuth hook
 * This demonstrates how to migrate from the old useAuth to the new Redux-based authentication
 */
const LoginWithRedux: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Using Redux auth instead of useAuth
  const { 
    login, 
    isLoading, 
    error, 
    isAuthenticated, 
    clearError 
  } = useReduxAuth();
  
  const navigate = useNavigate();

  // Clear Redux error when component mounts or when user starts typing
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear local validation errors
    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Clear Redux error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Redux action returns a promise
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      
      // Check if login was successful
      if (result.type === 'auth/login/fulfilled') {
        navigate('/dashboard');
      }
      // Error handling is done automatically by Redux slice
    } catch (err) {
      // Additional error handling if needed
      console.error('Login error:', err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Redux error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 ${
                  localErrors.email ? 'border-destructive' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {localErrors.email && (
              <p className="text-sm text-destructive">{localErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 ${
                  localErrors.password ? 'border-destructive' : ''
                }`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {localErrors.password && (
              <p className="text-sm text-destructive">{localErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginWithRedux;