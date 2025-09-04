import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Shield } from 'lucide-react';

interface PermissionsListProps {
  selectedRole: any;
  availablePermissions: any[];
  selectedPermissions: Set<string>;
  permissionsLoading: boolean;
  formErrors: { permissions?: string };
  onPermissionChange: (permissionName: string, checked: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const PermissionsList: React.FC<PermissionsListProps> = ({
  selectedRole,
  availablePermissions,
  selectedPermissions,
  permissionsLoading,
  formErrors,
  onPermissionChange,
  onSelectAll,
  onClearAll,
}) => {
  if (!selectedRole) return null;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl text-card-foreground">
              Available Permissions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select permissions to assign to {selectedRole.name}
            </p>
          </div>
          {availablePermissions.length > 0 && (
            <PermissionActions
              selectedPermissions={selectedPermissions}
              availablePermissions={availablePermissions}
              onSelectAll={onSelectAll}
              onClearAll={onClearAll}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {permissionsLoading ? (
          <LoadingState />
        ) : availablePermissions.length === 0 ? (
          <EmptyState />
        ) : (
          <PermissionGrid
            availablePermissions={availablePermissions}
            selectedPermissions={selectedPermissions}
            onPermissionChange={onPermissionChange}
          />
        )}

        {formErrors.permissions && (
          <p className="text-sm text-destructive mt-2">
            {formErrors.permissions}
          </p>
        )}

        <SelectedPermissionsCount count={selectedPermissions.size} />
      </CardContent>
    </Card>
  );
};

interface PermissionActionsProps {
  selectedPermissions: Set<string>;
  availablePermissions: any[];
  onSelectAll: () => void;
  onClearAll: () => void;
}

const PermissionActions: React.FC<PermissionActionsProps> = ({
  selectedPermissions,
  availablePermissions,
  onSelectAll,
  onClearAll,
}) => (
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onSelectAll}
      disabled={selectedPermissions.size === availablePermissions.length}
      className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
    >
      Select All
    </Button>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClearAll}
      disabled={selectedPermissions.size === 0}
      className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
    >
      Clear All
    </Button>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-6 sm:py-8">
    <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
    <span className="text-muted-foreground">Loading permissions...</span>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-8 sm:py-12 text-muted-foreground">
    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
    <p className="text-sm sm:text-base">
      All available permissions are already assigned to this role.
    </p>
  </div>
);

interface PermissionGridProps {
  availablePermissions: any[];
  selectedPermissions: Set<string>;
  onPermissionChange: (permissionName: string, checked: boolean) => void;
}

const PermissionGrid: React.FC<PermissionGridProps> = ({
  availablePermissions,
  selectedPermissions,
  onPermissionChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-60 sm:max-h-80 overflow-y-auto border border-border rounded-md p-3 sm:p-4 bg-background/50">
    {availablePermissions.map((permission) => {
      const isChecked = selectedPermissions.has(permission.name);

      return (
        <div
          key={permission.id}
          className="flex items-start space-x-2 sm:space-x-3 space-y-0 p-2 rounded-md hover:bg-accent/50 transition-colors"
        >
          <Checkbox
            id={`permission-${permission.id}`}
            checked={isChecked}
            onCheckedChange={(checked) =>
              onPermissionChange(permission.name, checked as boolean)
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
            <p className="text-xs text-muted-foreground">
              Guard: {permission.guard_name}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

interface SelectedPermissionsCountProps {
  count: number;
}

const SelectedPermissionsCount: React.FC<SelectedPermissionsCountProps> = ({
  count,
}) => {
  if (count === 0) return null;

  return (
    <div className="mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg border border-primary/20">
      <p className="text-sm text-primary font-medium">
        {count} permission(s) selected for assignment
      </p>
    </div>
  );
};
