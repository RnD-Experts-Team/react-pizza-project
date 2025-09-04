import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Lock } from 'lucide-react';

interface RoleSelectorProps {
  roles: any[];
  selectedRoleId: string;
  selectedRole: any;
  currentRolePermissions: Set<string>;
  rolesLoading: boolean;
  formErrors: { role?: string };
  onRoleChange: (roleId: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  selectedRoleId,
  selectedRole,
  currentRolePermissions,
  rolesLoading,
  formErrors,
  onRoleChange,
}) => {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl text-card-foreground">
          Select Role
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the role to assign permissions to
        </p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {rolesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
            <span className="text-muted-foreground">Loading roles...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Label
              htmlFor="role-select"
              className="text-sm font-medium text-foreground"
            >
              Role *
            </Label>
            <Select value={selectedRoleId} onValueChange={onRoleChange}>
              <SelectTrigger
                className={`bg-background border-input text-foreground ${
                  formErrors.role
                    ? 'border-destructive focus:ring-destructive'
                    : 'focus:ring-ring'
                }`}
              >
                <SelectValue
                  placeholder="Select a role"
                  className="text-muted-foreground"
                />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {roles.map((role) => (
                  <SelectItem
                    key={role.id}
                    value={role.id.toString()}
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{role.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {role.permissions?.length || 0} permissions
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.role && (
              <p className="text-sm text-destructive">{formErrors.role}</p>
            )}
          </div>
        )}

        {/* Current Role Permissions */}
        {selectedRole && currentRolePermissions.size > 0 && (
          <CurrentRolePermissions
            roleName={selectedRole.name}
            permissions={currentRolePermissions}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface CurrentRolePermissionsProps {
  roleName: string;
  permissions: Set<string>;
}

const CurrentRolePermissions: React.FC<CurrentRolePermissionsProps> = ({
  permissions,
}) => {
  return (
    <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg border border-border">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
        <Lock className="h-4 w-4" />
        Current Permissions ({permissions.size})
      </h4>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {Array.from(permissions).map((permission) => (
          <span
            key={permission}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border"
          >
            {permission}
          </span>
        ))}
      </div>
    </div>
  );
};
