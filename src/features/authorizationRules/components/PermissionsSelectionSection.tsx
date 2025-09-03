import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, X, Loader2 } from 'lucide-react';
import type { Permission } from '@/features/permissions/types';

interface PermissionsSelectionSectionProps {
  availablePermissions: Permission[];
  selectedPermissions: string[];
  permissionsLoading: boolean;
  authorizationType: 'any' | 'all';
  onTogglePermission: (permissionName: string) => void;
  onSelectAllPermissions: () => void;
  onClearAllPermissions: () => void;
  onAuthorizationTypeChange: (type: 'any' | 'all') => void;
}

export const PermissionsSelectionSection: React.FC<PermissionsSelectionSectionProps> = ({
  availablePermissions,
  selectedPermissions,
  permissionsLoading,
  authorizationType,
  onTogglePermission,
  onSelectAllPermissions,
  onClearAllPermissions,
  onAuthorizationTypeChange,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          <Label className="text-sm sm:text-base font-medium">Permissions</Label>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className={authorizationType === 'any' ? 'font-medium text-blue-600' : 'text-muted-foreground'}>
            ANY
          </span>
          <Switch
            checked={authorizationType === 'all'}
            onCheckedChange={(checked) => onAuthorizationTypeChange(checked ? 'all' : 'any')}
            className="data-[state=checked]:bg-green-600"
          />
          <span className={authorizationType === 'all' ? 'font-medium text-green-600' : 'text-muted-foreground'}>
            ALL
          </span>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-muted-foreground bg-blue-50 p-2 sm:p-3 rounded-md">
        <strong>{authorizationType === 'any' ? 'ANY' : 'ALL'} mode:</strong>{' '}
        {authorizationType === 'any'
          ? 'User needs at least ONE of the selected permissions'
          : 'User needs ALL of the selected permissions'
        }
      </div>

      {permissionsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading permissions...</span>
        </div>
      ) : availablePermissions && availablePermissions.length > 0 ? (
        <div className="space-y-3">
          {/* Bulk actions */}
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm flex-1 sm:flex-none"
              onClick={onSelectAllPermissions}
            >
              Select All
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="text-xs sm:text-sm flex-1 sm:flex-none"
              onClick={onClearAllPermissions}
            >
              Clear All
            </Button>
          </div>

          {/* Permissions grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-48 overflow-y-auto border rounded-md p-2 sm:p-3">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.name)}
                  onCheckedChange={() => onTogglePermission(permission.name)}
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`permission-${permission.id}`}
                    className="text-xs sm:text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                  >
                    {permission.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>

          {/* Selected permissions display */}
          {selectedPermissions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-muted-foreground">
                Selected Permissions ({selectedPermissions.length}) - {authorizationType.toUpperCase()} required
              </Label>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {selectedPermissions.map((permissionName) => (
                  <Badge 
                    key={permissionName} 
                    variant={authorizationType === 'any' ? 'default' : 'secondary'} 
                    className="flex items-center gap-1 text-xs"
                  >
                    <span className="truncate max-w-[8rem] sm:max-w-none">{permissionName}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500 flex-shrink-0"
                      onClick={() => onTogglePermission(permissionName)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No permissions available</p>
        </div>
      )}
    </div>
  );
};