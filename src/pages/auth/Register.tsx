// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useReduxAuth } from '../../hooks/useReduxAuth';
import { User as UserIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import type { ApiError } from '../../types/apiErrors';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Redux auth hook
  const { register, isLoading, error, clearError, setRegistrationEmail } = useReduxAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  // const validateForm = (): boolean => {
  //   const newErrors: Record<string, string> = {};

  //   if (!formData.name) {
  //     newErrors.name = 'Name is required';
  //   } else if (formData.name.length < 2) {
  //     newErrors.name = 'Name must be at least 2 characters';
  //   }

  //   if (!formData.email) {
  //     newErrors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //     newErrors.email = 'Email is invalid';
  //   }

  //   if (!formData.password) {
  //     newErrors.password = 'Password is required';
  //   } else if (formData.password.length < 6) {
  //     newErrors.password = 'Password must be at least 6 characters';
  //   }

  //   if (!formData.password_confirmation) {
  //     newErrors.password_confirmation = 'Password confirmation is required';
  //   } else if (formData.password !== formData.password_confirmation) {
  //     newErrors.password_confirmation = 'Passwords do not match';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!validateForm()) return;

    clearError();
    setErrors({}); // clear local

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }); // important

      // success
      setRegistrationEmail(formData.email);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const e = err as ApiError;
      // Global message
      setErrors(prev => ({ ...prev, general: e.message || 'Registration failed. Please try again.' }));

      // Field-level messages (e.g., { email: ["Already taken"] })
      if (e.fieldErrors) {
        const fieldErrs: Record<string, string> = {};
        Object.entries(e.fieldErrors).forEach(([field, msg]) => {
          fieldErrs[field] = Array.isArray(msg) ? (msg[0] as string) : (msg as string);
        });
        setErrors(prev => ({ ...prev, ...fieldErrs }));
      }
    }
  };

  return (
    <div>
      <Card className="border shadow-lg">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your information to create your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(errors.general || error) && (
              <Alert
                variant="destructive"
                className="border-red-500/50 bg-red-500/10"
              >
                <AlertDescription className="text-red-600">
                  {errors.general || error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`h-12 pr-12 ${errors.password ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-primary" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`h-12 pr-12 ${errors.password_confirmation ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password_confirmation && (
                <p className="text-destructive text-sm">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background rounded-sm px-4 text-muted-foreground font-medium tracking-wider">
                  Options
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3 text-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
