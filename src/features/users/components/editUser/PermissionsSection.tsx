import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
}

interface PermissionsSectionProps {
  permissions: Permission[];
  permissionsLoading: boolean;
  allCheckedPermissions: Set<string>;
  validationErrors: Record<string, string>;
  onPermissionChange: (permissionName: string, checked: boolean) => void;
  isPermissionLocked: (permissionName: string) => boolean;
}

const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissions,
  permissionsLoading,
  allCheckedPermissions,
  validationErrors,
  onPermissionChange,
  isPermissionLocked,
}) => {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">
          Additional Permissions
        </CardTitle>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
          Select additional permissions beyond those included in roles
        </p>
      </CardHeader>
      <CardContent>
        {permissionsLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8 md:py-10">
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin mr-2 text-primary" />
            <span className="text-sm sm:text-base text-foreground">Loading permissions...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto">
            {permissions.map((permission) => {
              const isLocked = isPermissionLocked(permission.name);
              const isChecked = allCheckedPermissions.has(permission.name);
              
              return (
                <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md border border-border bg-background hover:bg-accent transition-colors">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={isChecked}
                    disabled={isLocked}
                    onCheckedChange={(checked) => 
                      onPermissionChange(permission.name, checked as boolean)
                    }
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-50 mt-0.5"
                  />
                  <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className={`text-xs sm:text-sm md:text-base font-medium leading-none cursor-pointer ${
                       isLocked 
                         ? 'text-muted-foreground cursor-not-allowed' 
                         : 'text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                     }`}
                   >
                     <div className="flex items-center gap-1 sm:gap-2">
                       {permission.name}
                       {isLocked && (
                         <Lock className="h-3 w-3 text-muted-foreground" />
                       )}
                     </div>
                   </Label>
                    {isLocked && (
                      <p className="text-xs text-muted-foreground">
                        Included by selected role(s)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {validationErrors.permissions && (
          <p className="text-xs sm:text-sm text-destructive mt-2">{validationErrors.permissions}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionsSection;