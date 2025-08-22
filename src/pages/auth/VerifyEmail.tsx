import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { Mail, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import type { ApiError } from '../../types/apiErrors';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [formData, setFormData] = useState({
    email: email,
    otp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redux hooks
  const { 
    verifyEmail, 
    resendOtp, 
    isLoading, 
    error, 
    clearError,
    registrationEmail 
  } = useReduxAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailValue = formData.email || registrationEmail || '';
    if (!emailValue) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSuccessMessage('');
    clearError();
    setErrors({});

    try {
      await verifyEmail({
        email: formData.email || registrationEmail || '',
        otp: formData.otp,
      });

      setSuccessMessage('Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const e = err as ApiError;
      const fieldErrs: Record<string, string> = {};
      if (e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([field, msg]) => {
          fieldErrs[field] = Array.isArray(msg) ? msg[0] : (msg as string);
        });
      }
      setErrors({
        ...fieldErrs,
        general: e.message || 'Verification failed. Please try again.',
      });
    }
  };

  const handleResendOtp = async () => {
    // Use the email from Redux state if available, otherwise use form data
    const emailToUse = registrationEmail || formData.email;
    
    if (!emailToUse) {
      setErrors({ email: 'Email is required to resend OTP' });
      return;
    }

    setIsResending(true);
    setSuccessMessage('');
    setErrors({});
    clearError();

    try {
      await resendOtp({ email: emailToUse });
      setSuccessMessage('OTP sent successfully! Please check your email.');
    } catch (err) {
      const e = err as ApiError;
      const fieldErrs: Record<string, string> = {};
      if (e.fieldErrors?.email) {
        fieldErrs.email = Array.isArray(e.fieldErrors.email)
          ? e.fieldErrors.email[0]
          : e.fieldErrors.email;
      }
      setErrors({
        ...fieldErrs,
        general: e.message || 'Failed to resend OTP. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const effectiveEmail = formData.email || registrationEmail || '';

  return (
    <div>
      <Card className="border shadow-lg">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">
              Verify Email
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the 6-digit code sent to your email address
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

            {successMessage && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

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
                value={effectiveEmail}
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
                htmlFor="otp"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-primary" />
                Verification Code
              </Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                placeholder="123456"
                maxLength={6}
                className={`h-12 text-center text-lg tracking-widest font-mono ${
                  errors.otp ? 'border-destructive' : ''
                }`}
              />
              {errors.otp && (
                <p className="text-destructive text-sm">{errors.otp}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Verify Email'
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

            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={handleResendOtp}
                disabled={isResending}
                className="w-full h-12"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend OTP
                  </>
                )}
              </Button>

              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
