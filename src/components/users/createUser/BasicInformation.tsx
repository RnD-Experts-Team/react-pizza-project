import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Eye, EyeOff } from 'lucide-react';
import type { UserFormData } from '../../../features/users/types';

interface BasicInformationProps {
  formData: UserFormData;
  validationErrors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  validationErrors,
  onInputChange
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card 
      className="mx-2 sm:mx-0 shadow-md sm:shadow-lg"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 pb-3 sm:pb-4" style={{ borderBottomColor: 'var(--border)' }}>
        <CardTitle 
          className="text-lg sm:text-xl md:text-2xl font-semibold"
          style={{ color: 'var(--card-foreground)' }}
        >
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-4 sm:pt-6 space-y-4 sm:space-y-5 md:space-y-6" style={{ backgroundColor: 'var(--card)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div className="space-y-2">
            <Label 
              htmlFor="name"
              className="text-xs sm:text-sm md:text-base font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter full name"
              required
              className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base ${validationErrors.name ? '' : ''}`}
              style={{
                backgroundColor: 'var(--input)',
                borderColor: validationErrors.name ? 'var(--destructive)' : 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
            {validationErrors.name && (
              <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="email"
              className="text-xs sm:text-sm md:text-base font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="Enter email address"
              required
              className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base ${validationErrors.email ? '' : ''}`}
              style={{
                backgroundColor: 'var(--input)',
                borderColor: validationErrors.email ? 'var(--destructive)' : 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
            {validationErrors.email && (
              <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                {validationErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div className="space-y-2">
            <Label 
              htmlFor="password"
              className="text-xs sm:text-sm md:text-base font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={onInputChange}
                placeholder="Enter password"
                className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base pr-10 ${validationErrors.password ? '' : ''}`}
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: validationErrors.password ? 'var(--destructive)' : 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center hover:opacity-80 transition-opacity"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                {validationErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="password_confirmation"
              className="text-xs sm:text-sm md:text-base font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              Confirm Password *
            </Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.password_confirmation}
                onChange={onInputChange}
                placeholder="Confirm password"
                className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base pr-10 ${validationErrors.password_confirmation ? '' : ''}`}
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: validationErrors.password_confirmation ? 'var(--destructive)' : 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center hover:opacity-80 transition-opacity"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>
            {validationErrors.password_confirmation && (
              <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                {validationErrors.password_confirmation}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;