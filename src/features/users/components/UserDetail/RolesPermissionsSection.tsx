import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface RolesPermissionsSectionProps {
  user: any; // Replace with your User type
  formattedData: any; // Replace with your FormattedData type
}

export const RolesPermissionsSection: React.FC<RolesPermissionsSectionProps> = ({
  user,
  formattedData,
}) => {
  const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set());

  // Optimized role expansion handler with useCallback
  const toggleRoleExpansion = useCallback((roleId: number) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  }, []);

  // Memoized role cards to prevent unnecessary re-renders
  const roleCards = useMemo(() => {
    if (!user?.roles || user.roles.length === 0) {
      return (
        <p className="text-xs sm:text-sm text-muted-foreground">
          No roles assigned
        </p>
      );
    }

    return user.roles.map((role: { id: number; name: string; permissions?: Array<{ id: number; name: string }> }) => (
      <div
        key={role.id}
        className="border border-border rounded-lg p-3 bg-muted/50"
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleRoleExpansion(role.id)}
        >
          <Badge
            variant="outline"
            className="text-xs sm:text-sm px-2 py-1"
          >
            {role.name}
          </Badge>
          {role.permissions && role.permissions.length > 0 && (
            <button className="text-muted-foreground hover:text-foreground">
              {expandedRoles.has(role.id) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {expandedRoles.has(role.id) && role.permissions && (
          <div className="mt-3 pt-3 border-t border-border">
            <label className="text-xs font-medium text-muted-foreground">
              Permissions ({role.permissions.length})
            </label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {role.permissions.map((permission) => (
                <Badge
                  key={permission.id}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {permission.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {!role.permissions || role.permissions.length === 0 ? (
          <p className="text-xs text-muted-foreground mt-2">
            No permissions assigned to this role
          </p>
        ) : null}
      </div>
    ));
  }, [user?.roles, expandedRoles, toggleRoleExpansion]);

  // Memoized direct permissions badges
  const directPermissionBadges = useMemo(() => {
    if (!user?.permissions || user.permissions.length === 0) {
      return (
        <p className="text-xs sm:text-sm text-muted-foreground">
          No direct permissions
        </p>
      );
    }

    return user.permissions.map((permission: { id: number; name: string }) => (
      <Badge
        key={permission.id}
        variant="secondary"
        className="text-xs sm:text-sm px-2 py-1"
      >
        {permission.name}
      </Badge>
    ));
  }, [user?.permissions]);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Roles & Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
        <div>
          <label className="text-xs sm:text-sm font-medium text-muted-foreground">
            Roles ({formattedData?.roleCount})
          </label>
          <div className="space-y-3 mt-2">
            {roleCards}
          </div>
        </div>
        <Separator className="bg-border" />
        <div>
          <label className="text-xs sm:text-sm font-medium text-muted-foreground">
            Direct Permissions ({formattedData?.permissionCount})
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
            {directPermissionBadges}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
