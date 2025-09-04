/**
 * Permissions Section Component
 * 
 * Handles permission selection for role creation/editing
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Permission } from '@/features/permissions/types';

interface PermissionsSectionProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionChange: (permissions: string[]) => void;
  loading: boolean;
  validationError?: string;
}

export const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissions,
  selectedPermissions,
  onPermissionChange,
  loading,
  validationError
}) => {
  const handlePermissionToggle = (permissionName: string, checked: boolean) => {
    const updatedPermissions = checked 
      ? [...selectedPermissions, permissionName]
      : selectedPermissions.filter(p => p !== permissionName);
    
    onPermissionChange(updatedPermissions);
  };

  const handleSelectAll = () => {
    const allPermissionNames = permissions.map(p => p.name);
    onPermissionChange(allPermissionNames);
  };

  const handleDeselectAll = () => {
    onPermissionChange([]);
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl text-card-foreground">Permissions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select permissions for this role
            </p>
          </div>
          {!loading && permissions.length > 0 && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                className="text-xs"
              >
                Deselect All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
            <span className="text-muted-foreground">Loading permissions...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-60 sm:max-h-80 overflow-y-auto border border-border rounded-md p-3 sm:p-4 bg-background/50">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 space-y-0 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.name)}
                  onCheckedChange={(checked) => 
                    handlePermissionToggle(permission.name, checked as boolean)
                  }
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="grid gap-1.5 leading-none flex-1">
                  <Label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm font-medium leading-none text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {validationError && (
          <p className="text-sm text-destructive mt-2">{validationError}</p>
        )}
        
        {selectedPermissions.length > 0 && (
          <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm font-medium mb-2 text-muted-foreground">
              Selected permissions ({selectedPermissions.length}):
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {selectedPermissions.map((permissionName) => (
                <span 
                  key={permissionName} 
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                >
                  {permissionName}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
