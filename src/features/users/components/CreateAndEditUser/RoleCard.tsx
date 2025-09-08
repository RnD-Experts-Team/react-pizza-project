import React, { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Role } from '@/features/users/schemas/userFormSchemas';

interface RoleCardProps {
  role: Role;
  checked: boolean;
  onRoleChange: (roleName: string, checked: boolean) => void;
}

export const RoleCard = React.memo<RoleCardProps>(({ role, checked, onRoleChange }) => {
  const handleChange = useCallback((checkedValue: boolean) => {
    onRoleChange(role.name, checkedValue);
  }, [role.name, onRoleChange]);

  return (
    <div
      className={`flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        checked
          ? "bg-accent border-primary border-2"
          : "bg-muted border-border border"
      }`}
    >
      <Checkbox
        id={`role-${role.id}`}
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
          htmlFor={`role-${role.id}`}
          className={`text-xs sm:text-sm md:text-base font-medium leading-tight cursor-pointer transition-colors duration-200 ${
            checked
              ? "text-accent-foreground"
              : "text-foreground"
          }`}
        >
          {role.name}
        </Label>
        {role.permissions && role.permissions.length > 0 && (
          <p className="text-xs sm:text-sm leading-tight text-muted-foreground">
            {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
});

RoleCard.displayName = 'RoleCard';