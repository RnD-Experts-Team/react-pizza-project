import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface VerifyEmailFormData {
  email: string;
  otp: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
}

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    verifyEmailOTP, 
    resendVerificationOTP, 
    isLoading, 
    error, 
    isAuthenticated, 
    clearError 
  } = useAuth();

  // ✅ FIXED: Use a single ref for the OTP input
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Get email and message from navigation state (from register page)
  const locationState = location.state as { email?: string; message?: string } | null;
  const initialEmail = locationState?.email || '';
  const successMessage = locationState?.message || '';

  // Form state
  const [formData, setFormData] = useState<VerifyEmailFormData>({
    email: initialEmail,
    otp: '',
  });

  const [localErrors, setLocalErrors] = useState<FormErrors>({});
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
    if (resendSuccess || showSuccessAnimation) {
      const timer = setTimeout(() => {
        setResendSuccess(false);
        setShowSuccessAnimation(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [resendSuccess, showSuccessAnimation]);

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
    if (showSuccessAnimation) {
      setShowSuccessAnimation(false);
    }
  };

  // Handle OTP input with auto-focus and formatting
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
      setLocalErrors(prev => ({
        ...prev,
        otp: undefined,
      }));
    }

    if (error) {
      clearError();
    }

    if (resendSuccess) {
      setResendSuccess(false);
    }
    if (showSuccessAnimation) {
      setShowSuccessAnimation(false);
    }
  };

  // Handle key events for better UX
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && formData.otp.length > 0) {
      const newOtp = formData.otp.slice(0, -1);
      setFormData(prev => ({ ...prev, otp: newOtp }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.otp.trim()) {
      errors.otp = 'Verification code is required';
    } else if (formData.otp.length !== 6) {
      errors.otp = 'Verification code must be 6 digits';
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
    setShowSuccessAnimation(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await verifyEmailOTP({
        email: formData.email.trim(),
        otp: formData.otp,
      });

      // Check if verification was successful
      if (result.meta.requestStatus === 'fulfilled') {
        // Navigate to login page with success message
        navigate('/login', { 
          state: { 
            message: 'Email verified successfully! Please login to continue.',
            email: formData.email.trim()
          }
        });
      }
    } catch (err) {
      console.error('Email verification error:', err);
    }
  };

  // ✅ ENHANCED: Handle resend OTP with better UX
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !formData.email.trim()) return;

    setResendLoading(true);
    clearError();
    setResendSuccess(false);
    setShowSuccessAnimation(false);

    try {
      const result = await resendVerificationOTP({
        email: formData.email.trim(),
      });

      if (result.meta.requestStatus === 'fulfilled') {
        // ✅ ENHANCED UX: Show success animation and focus input
        setShowSuccessAnimation(true);
        setResendSuccess(true);
        setResendCooldown(60); // 60 second cooldown
        
        // Clear OTP field for new code
        setFormData(prev => ({ ...prev, otp: '' }));
        
        // ✅ FIXED: Focus the OTP input after successful resend
        setTimeout(() => {
          if (otpInputRef.current) {
            otpInputRef.current.focus();
          }
        }, 100); // Small delay to ensure state updates
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  // Format OTP display (add spaces for readability)
  const formatOtpDisplay = (otp: string) => {
    return otp.replace(/(.{3})/g, '$1 ').trim();
  };

  // Handle navigation link clicks
  const handleLinkClick = () => {
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success message from registration */}
          {successMessage && (
            <Alert className="mb-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* ✅ ENHANCED: Better success message with animation */}
          {(resendSuccess || showSuccessAnimation) && (
            <Alert className={`mb-4 transition-all duration-300 ${showSuccessAnimation ? 'animate-pulse' : ''}`}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Verification code sent successfully! Please check your email.
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

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
                  disabled={isLoading || resendLoading}
                  autoComplete="email"
                />
              </div>
              {localErrors.email && (
                <p className="text-sm text-destructive">{localErrors.email}</p>
              )}
            </div>

            {/* ✅ FIXED: OTP Field with proper ref */}
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
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
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code sent to {formData.email || 'your email'}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || resendLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          {/* ✅ ENHANCED: Resend OTP Section with better styling */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={resendLoading || resendCooldown > 0 || !formData.email.trim()}
              className={`w-full transition-all duration-200 ${
                resendLoading ? 'animate-pulse' : ''
              }`}
            >
              {resendLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend code in ${resendCooldown}s`
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend verification code
                </>
              )}
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 flex flex-col space-y-2 text-center text-sm">
            <Link
              to="/login"
              className="text-primary hover:underline flex items-center justify-center"
              onClick={handleLinkClick}
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Login
            </Link>
            <div>
              Need to use a different email?{' '}
              <Link
                to="/register"
                className="text-primary hover:underline"
                onClick={handleLinkClick}
              >
                Register again
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
