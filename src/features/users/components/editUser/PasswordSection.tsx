import React from 'react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import type { UserFormData } from '../../types';

interface PasswordSectionProps {
  formData: UserFormData;
  includePassword: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  validationErrors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncludePasswordChange: (checked: boolean) => void;
  onShowPasswordToggle: () => void;
  onShowConfirmPasswordToggle: () => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  formData,
  includePassword,
  showPassword,
  showConfirmPassword,
  validationErrors,
  onInputChange,
  onIncludePasswordChange,
  onShowPasswordToggle,
  onShowConfirmPasswordToggle,
}) => {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">
          Password
        </CardTitle>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
          Leave blank to keep current password
        </p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Checkbox
            id="includePassword"
            checked={includePassword}
            onCheckedChange={onIncludePasswordChange}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="includePassword" className="text-sm sm:text-base font-medium text-foreground cursor-pointer">
            Change password
          </Label>
        </div>

        {includePassword && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base font-medium text-foreground">
                New Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={onInputChange}
                  placeholder="Enter new password"
                  className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring pr-10 ${
                    validationErrors.password ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                  onClick={onShowPasswordToggle}
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
              {validationErrors.password && (
                <p className="text-xs sm:text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-sm sm:text-base font-medium text-foreground">
                Confirm New Password *
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={onInputChange}
                  placeholder="Confirm new password"
                  className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring pr-10 ${
                    validationErrors.password_confirmation ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                  onClick={onShowConfirmPasswordToggle}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
              {validationErrors.password_confirmation && (
                <p className="text-xs sm:text-sm text-destructive">{validationErrors.password_confirmation}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordSection;