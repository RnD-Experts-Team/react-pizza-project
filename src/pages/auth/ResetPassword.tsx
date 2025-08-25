import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ResetPasswordFormData {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
  password_confirmation?: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    resetPassword,
    forgotPassword,
    isLoading, 
    error, 
    isAuthenticated, 
    clearError 
  } = useAuth();

  // Get email and message from navigation state (from forgot password page)
  const locationState = location.state as { email?: string; message?: string } | null;
  const initialEmail = locationState?.email || '';
  const successMessage = locationState?.message || '';

  // Refs for better UX
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: initialEmail,
    otp: '',
    password: '',
    password_confirmation: '',
  });

  const [localErrors, setLocalErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirect to forgot password if no email provided
  useEffect(() => {
    if (!initialEmail) {
      navigate('/forgot-password', { replace: true });
    }
  }, [initialEmail, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (resendSuccess) {
      const timer = setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [resendSuccess]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear local error when user starts typing
    if (localErrors[name as keyof FormErrors]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }

    // Clear success messages when user starts typing
    if (resendSuccess) {
      setResendSuccess(false);
    }
  };

  // Handle OTP input with formatting
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Only allow digits
    
    // Limit to 6 digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    setFormData(prev => ({
      ...prev,
      otp: value,
    }));

    // Clear errors and messages
    if (localErrors.otp) {
      setLocalErrors(prev => ({ ...prev, otp: undefined }));
    }
    if (error) clearError();
    if (resendSuccess) setResendSuccess(false);
  };

  // Handle OTP key events
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && formData.otp.length > 0) {
      const newOtp = formData.otp.slice(0, -1);
      setFormData(prev => ({ ...prev, otp: newOtp }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // OTP validation
    if (!formData.otp.trim()) {
      errors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      errors.otp = 'OTP must be 6 digits';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Password confirmation validation
    if (!formData.password_confirmation.trim()) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setLocalErrors({});
    clearError();
    setResendSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await resetPassword({
        email: formData.email.trim(),
        otp: formData.otp,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      // Check if reset was successful
      if (result.meta.requestStatus === 'fulfilled') {
        // Navigate to login page with success message
        navigate('/login', {
          state: {
            message: 'Password reset successfully! Please login with your new password.',
            email: formData.email.trim()
          }
        });
      }
    } catch (err) {
      console.error('Reset password error:', err);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !formData.email.trim()) return;

    setResendLoading(true);
    clearError();

    try {
      const result = await forgotPassword({
        email: formData.email.trim(),
      });

      if (result.meta.requestStatus === 'fulfilled') {
        setResendSuccess(true);
        setResendCooldown(60); // 60 second cooldown
        
        // Clear OTP field for new code
        setFormData(prev => ({ ...prev, otp: '' }));
        
        // Focus the OTP input
        setTimeout(() => {
          if (otpInputRef.current) {
            otpInputRef.current.focus();
          }
        }, 100);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  // Format OTP display
  const formatOtpDisplay = (otp: string) => {
    return otp.replace(/(.{3})/g, '$1 ').trim();
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  // Handle navigation link clicks
  const handleLinkClick = () => {
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter the OTP and your new password to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success message from forgot password */}
          {successMessage && (
            <Alert className="mb-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Resend success message */}
          {resendSuccess && (
            <Alert className="mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  New OTP sent successfully! Please check your email.
                </AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Redux error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Field (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="pl-10 bg-muted cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                OTP has been sent to this email address
              </p>
            </div>

            {/* OTP Field */}
            <div className="space-y-2">
              <Label htmlFor="otp">Reset Code</Label>
              <Input
                ref={otpInputRef}
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={formatOtpDisplay(formData.otp)}
                onChange={handleOtpChange}
                onKeyDown={handleOtpKeyDown}
                className={`text-center text-lg tracking-widest ${
                  localErrors.otp ? 'border-destructive' : ''
                }`}
                disabled={isLoading || resendLoading}
                maxLength={7} // 6 digits + 1 space
                autoComplete="one-time-code"
              />
              {localErrors.otp && (
                <p className="text-sm text-destructive">{localErrors.otp}</p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${
                    localErrors.password ? 'border-destructive' : ''
                  }`}
                  disabled={isLoading || resendLoading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading || resendLoading}
                  tabIndex={-1}
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

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${
                    localErrors.password_confirmation ? 'border-destructive' : ''
                  }`}
                  disabled={isLoading || resendLoading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordConfirmationVisibility}
                  disabled={isLoading || resendLoading}
                  tabIndex={-1}
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {localErrors.password_confirmation && (
                <p className="text-sm text-destructive">{localErrors.password_confirmation}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || resendLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={resendLoading || resendCooldown > 0}
              className="w-full"
            >
              {resendLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend OTP in ${resendCooldown}s`
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend OTP
                </>
              )}
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 flex flex-col space-y-2 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline flex items-center justify-center"
              onClick={handleLinkClick}
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Forgot Password
            </Link>
            <div>
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline"
                onClick={handleLinkClick}
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
