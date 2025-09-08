import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/features/users/components/CreateAndEditUser/PasswordInput';

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
  isEditMode?: boolean;
  showPasswordFields?: boolean;
}

export const BasicInfoSection = React.memo<BasicInfoSectionProps>(({ 
  form, 
  isEditMode = false, 
  showPasswordFields = true 
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          {isEditMode ? 'Edit User Information' : 'Basic Information'}
        </h3>
        <div className="grid gap-4 sm:gap-6">
          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Full Name *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter full name"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Fields */}
          {showPasswordFields && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Password {!isEditMode && '*'}
                      {isEditMode && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (Leave blank to keep current password)
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Confirm Password {!isEditMode && '*'}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder={isEditMode ? "Confirm new password" : "Confirm password"}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
});

BasicInfoSection.displayName = 'BasicInfoSection';