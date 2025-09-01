import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Loader2, Lock } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
}

interface PermissionSelectionProps {
  permissions: Permission[];
  loading: boolean;
  checkedPermissions: Set<string>;
  isPermissionLocked: (permissionName: string) => boolean;
  onPermissionChange: (permissionName: string, checked: boolean) => void;
}

const PermissionSelection: React.FC<PermissionSelectionProps> = ({
  permissions,
  loading,
  checkedPermissions,
  isPermissionLocked,
  onPermissionChange
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
          Additional Permissions
        </CardTitle>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Select additional permissions not covered by roles
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-4 sm:pt-6 space-y-3" style={{ backgroundColor: 'var(--card)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2" style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Loading permissions...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) var(--background)' }}>
            {permissions.map((permission) => {
              const isLocked = isPermissionLocked(permission.name);
              const isChecked = checkedPermissions.has(permission.name);
              
              return (
                <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border transition-all duration-200" style={{ backgroundColor: isLocked ? 'var(--muted)' : (isChecked ? 'var(--accent)' : 'var(--background)'), borderColor: isLocked ? 'var(--muted-foreground)' : (isChecked ? 'var(--primary)' : 'var(--border)'), opacity: isLocked ? 0.7 : 1 }}>
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={isChecked}
                    disabled={isLocked}
                    onCheckedChange={(checked) => 
                      onPermissionChange(permission.name, checked as boolean)
                    }
                    className="mt-0.5 sm:mt-1"
                    style={{
                      borderColor: isLocked ? 'var(--muted-foreground)' : (isChecked ? 'var(--primary)' : 'var(--border)'),
                      backgroundColor: isChecked ? 'var(--primary)' : 'var(--background)'
                    }}
                  />
                  <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className={`text-xs sm:text-sm md:text-base font-medium leading-tight transition-colors duration-200 ${
                        isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={{
                        color: isLocked ? 'var(--muted-foreground)' : (isChecked ? 'var(--accent-foreground)' : 'var(--foreground)')
                      }}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="break-words">{permission.name}</span>
                        {isLocked && (
                          <Lock className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                        )}
                      </div>
                    </Label>
                    {isLocked && (
                      <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>
                        Included by selected role(s)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default PermissionSelection;