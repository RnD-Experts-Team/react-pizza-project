import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { UserFormData } from '../../../features/users/types';

interface BasicInformationSectionProps {
  formData: UserFormData;
  validationErrors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  validationErrors,
  onInputChange,
}) => {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium text-foreground">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter full name"
              className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring ${
                validationErrors.name ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
              }`}
            />
            {validationErrors.name && (
              <p className="text-xs sm:text-sm text-destructive">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base font-medium text-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="Enter email address"
              className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring ${
                validationErrors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
              }`}
            />
            {validationErrors.email && (
              <p className="text-xs sm:text-sm text-destructive">{validationErrors.email}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformationSection;