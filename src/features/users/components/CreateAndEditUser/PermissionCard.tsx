import React, { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Permission } from '@/features/users/schemas/userFormSchemas';

interface PermissionCardProps {
  permission: Permission;
  checked: boolean;
  onPermissionChange: (permissionName: string, checked: boolean) => void;
}

export const PermissionCard = React.memo<PermissionCardProps>(({ permission, checked, onPermissionChange }) => {
  const handleChange = useCallback((checkedValue: boolean) => {
    onPermissionChange(permission.name, checkedValue);
  }, [permission.name, onPermissionChange]);

  return (
    <div
      className={`flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        checked
          ? "bg-accent border-primary border-2"
          : "bg-muted border-border border"
      }`}
    >
      <Checkbox
        id={`permission-${permission.id}`}
        checked={checked}
        onCheckedChange={handleChange}
        className={`mt-0.5 sm:mt-1 ${
          checked
            ? "border-primary bg-primary"
            : "border-border bg-background"
        }`}
      />
      <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
        <Label
          htmlFor={`permission-${permission.id}`}
          className={`text-xs sm:text-sm md:text-base font-medium leading-tight cursor-pointer transition-colors duration-200 ${
            checked
              ? "text-accent-foreground"
              : "text-foreground"
          }`}
        >
          {permission.name}
        </Label>
      </div>
    </div>
  );
});

PermissionCard.displayName = 'PermissionCard';