import React, { useMemo ,useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, X, Loader2 } from 'lucide-react';
import type { Role } from '@/features/roles/types';

interface RolesSelectionSectionProps {
  availableRoles: Role[];
  selectedRoles: string[];
  rolesLoading: boolean;
  onToggleRole: (roleName: string) => void;
  onSelectAllRoles: () => void;
  onClearAllRoles: () => void;
}

export const RolesSelectionSection: React.FC<RolesSelectionSectionProps> = ({
  availableRoles,
  selectedRoles,
  rolesLoading,
  onToggleRole,
  onSelectAllRoles,
  onClearAllRoles,
}) => {
  const selectedRolesSet = useMemo(() => new Set(selectedRoles), [selectedRoles]);
  const handleToggleRole = useCallback((roleName: string) => {
  return () => onToggleRole(roleName);
}, [onToggleRole]);
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <Label className="text-sm sm:text-base font-medium">Roles</Label>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">(User must have ANY of these roles)</span>
      </div>

      {rolesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading roles...</span>
        </div>
      ) : availableRoles && availableRoles.length > 0 ? (
        <div className="space-y-3">
          {/* Bulk actions */}
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm flex-1 sm:flex-none"
              onClick={onSelectAllRoles}
            >
              Select All
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="text-xs sm:text-sm flex-1 sm:flex-none"
              onClick={onClearAllRoles}
            >
              Clear All
            </Button>
          </div>

          {/* Roles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-48 overflow-y-auto border rounded-md p-2 sm:p-3">
            {availableRoles.map((role) => (
              <div key={role.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRolesSet.has(role.name)}
                  onCheckedChange={() => onToggleRole(role.name)}
                />
                <Label
                  htmlFor={`role-${role.id}`}
                  className="text-xs sm:text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.name}
                </Label>
              </div>
            ))}
          </div>

          {/* Selected roles display */}
          {selectedRoles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm text-muted-foreground">
                Selected Roles ({selectedRoles.length})
              </Label>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {selectedRoles.map((roleName) => (
                  <Badge key={roleName} variant="secondary" className="flex items-center gap-1 text-xs">
                    <span className="truncate max-w-[8rem] sm:max-w-none">{roleName}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500 flex-shrink-0"
                      onClick={handleToggleRole(roleName)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No roles available</p>
        </div>
      )}
    </div>
  );
};