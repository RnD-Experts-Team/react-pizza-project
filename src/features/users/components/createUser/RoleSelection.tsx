import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  permissions?: { name: string }[];
}

interface RoleSelectionProps {
  roles: Role[];
  loading: boolean;
  checkedRoles: Set<string>;
  validationErrors: Record<string, string>;
  onRoleChange: (roleName: string, checked: boolean) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  roles,
  loading,
  checkedRoles,
  validationErrors,
  onRoleChange
}) => {
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
          Roles
        </CardTitle>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Select roles - their permissions will be automatically included
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-4 sm:pt-6 space-y-4" style={{ backgroundColor: 'var(--card)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2" style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Loading roles...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-md" style={{ backgroundColor: checkedRoles.has(role.name) ? 'var(--accent)' : 'var(--muted)', borderColor: checkedRoles.has(role.name) ? 'var(--primary)' : 'var(--border)' }}>
                <Checkbox
                  id={`role-${role.id}`}
                  checked={checkedRoles.has(role.name)}
                  onCheckedChange={(checked) => 
                    onRoleChange(role.name, checked as boolean)
                  }
                  className="mt-0.5 sm:mt-1"
                  style={{
                    borderColor: checkedRoles.has(role.name) ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: checkedRoles.has(role.name) ? 'var(--primary)' : 'var(--background)'
                  }}
                />
                <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-xs sm:text-sm md:text-base font-medium leading-tight cursor-pointer transition-colors duration-200"
                    style={{ color: checkedRoles.has(role.name) ? 'var(--accent-foreground)' : 'var(--foreground)' }}
                  >
                    {role.name}
                  </Label>
                  {role.permissions && role.permissions.length > 0 && (
                    <p className="text-xs sm:text-sm leading-tight" style={{ color: 'var(--muted-foreground)' }}>
                      Includes {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {validationErrors.roles && (
          <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--destructive)' }}>
            {validationErrors.roles}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleSelection;