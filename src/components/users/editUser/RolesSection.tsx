import React from 'react';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Loader2 } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  permissions?: Array<{ name: string }>;
}

interface RolesSectionProps {
  roles: Role[];
  rolesLoading: boolean;
  checkedRoles: Set<string>;
  validationErrors: Record<string, string>;
  onRoleChange: (roleName: string, checked: boolean) => void;
}

const RolesSection: React.FC<RolesSectionProps> = ({
  roles,
  rolesLoading,
  checkedRoles,
  validationErrors,
  onRoleChange,
}) => {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">
          Roles
        </CardTitle>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
          Select roles - their permissions will be automatically included
        </p>
      </CardHeader>
      <CardContent>
        {rolesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8 md:py-10">
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin mr-2 text-primary" />
            <span className="text-sm sm:text-base text-foreground">Loading roles...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {roles.map((role) => (
              <div key={role.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md border border-border bg-background hover:bg-accent transition-colors">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={checkedRoles.has(role.name)}
                  onCheckedChange={(checked) => 
                    onRoleChange(role.name, checked as boolean)
                  }
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                />
                <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-xs sm:text-sm md:text-base font-medium leading-none cursor-pointer text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {role.name}
                  </Label>
                  {role.permissions && role.permissions.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Includes {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {validationErrors.roles && (
          <p className="text-xs sm:text-sm text-destructive mt-2">{validationErrors.roles}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RolesSection;