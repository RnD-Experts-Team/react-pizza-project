import { memo, useMemo } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { permissionFormatting } from '@/features/permissions/utils';

interface Permission {
  id: string | number;
  name: string;
  guard_name: string;
  roles?: Array<{ id: string | number; name: string }>;
}

interface PermissionTableRowProps {
  permission: Permission;
}

const MAX_VISIBLE_ROLES = 4;

export const PermissionTableRow = memo<PermissionTableRowProps>(
  ({ permission }) => {
    // Memoize expensive computations
    const displayName = useMemo(
      () => permissionFormatting.formatDisplayName(permission.name),
      [permission.name],
    );

    const initial = useMemo(
      () => displayName.charAt(0).toUpperCase(),
      [displayName],
    );

    const rolesData = useMemo(() => {
      const rolesCount = permission.roles?.length || 0;
      const visibleRoles = permission.roles?.slice(0, MAX_VISIBLE_ROLES) || [];
      const extraCount = Math.max(0, rolesCount - MAX_VISIBLE_ROLES);

      return { rolesCount, visibleRoles, extraCount };
    }, [permission.roles]);

    return (
      <TableRow className="border-border bg-card hover:bg-muted/50">
        <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 text-foreground">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium bg-primary text-primary-foreground">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-xs sm:text-sm font-medium truncate text-foreground"
                title={displayName}
              >
                {displayName}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="p-2 sm:p-4">
          <div className="space-y-1 max-w-[10rem] lg:max-w-none">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {rolesData.rolesCount} roles
            </span>
            {rolesData.rolesCount > 0 && (
              <div className="flex flex-wrap gap-1">
                {rolesData.visibleRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="text-xs px-1 py-0.5 bg-accent text-accent-foreground border-border"
                  >
                    <span className="truncate max-w-[7rem]" title={role.name}>
                      {role.name}
                    </span>
                  </Badge>
                ))}
                {rolesData.extraCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{rolesData.extraCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  },
);

PermissionTableRow.displayName = 'PermissionTableRow';
