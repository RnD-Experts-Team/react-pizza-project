import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Role } from '@/features/roles/types';
import { roleFormatting } from '@/features/roles/utils';

interface RoleRowProps {
  role: Role;
}

export const RoleRow: React.FC<RoleRowProps> = ({ role }) => {
  return (
    <TableRow className="hover:bg-muted/50 border-border bg-card"
      

    >
      <TableCell
        className="font-medium text-xs sm:text-sm p-2 sm:p-4 text-foreground"

      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="bg-primary text-primary-foreground h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium"
          >
            {roleFormatting.formatDisplayName(role.name).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-xs sm:text-sm font-medium truncate text-foreground"

              title={roleFormatting.formatDisplayName(role.name)}
            >
              {roleFormatting.formatDisplayName(role.name)}
            </div>
            
          </div>
        </div>
      </TableCell>

      

      <TableCell className="p-2 sm:p-4">
        <div className="space-y-1 max-w-[10rem] lg:max-w-none">
          <span
            className="text-xs sm:text-sm text-muted-foreground"

          >
            {roleFormatting.formatPermissionCount(role.permissions?.length || 0)}
          </span>
          {role.permissions && role.permissions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 4).map((permission) => (
                <Badge
                  key={permission.id}
                  variant="secondary"
                  className="text-xs px-1 py-0.5 bg-accent text-accent-foreground border-border"
                  
                >
                  <span
                    className="truncate max-w-[10rem]"
                    title={permission.name}
                  >
                    {permission.name}
                  </span>
                </Badge>
              ))}
              {role.permissions.length > 4 && (
                <span 
                  className="text-xs text-muted-foreground"

                >
                  +{role.permissions.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
