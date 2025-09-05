import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, UserPlus } from 'lucide-react';
import { userFormatting } from '@/features/users/utils';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: Array<{ id: number; name: string }>;
  stores?: Array<{ store: { id: string; name: string } }>;
}

interface UsersTableRowProps {
  user: User;
  onView: (userId: number) => void;
  onAssign: (userId: number) => void;
}

export const UsersTableRow: React.FC<UsersTableRowProps> = ({
  user,
  onView,
  onAssign,
}) => {
  return (
    <TableRow
      className="border-border bg-card hover:bg-muted/50"
    >
      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 text-foreground">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-primary-foreground"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {userFormatting.formatInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-xs sm:text-sm font-medium truncate text-foreground"
              title={userFormatting.formatDisplayName(user.name)}
            >
              {userFormatting.formatDisplayName(user.name)}
            </div>
            {/* Mobile: Show roles and stores inline */}
            <div className="sm:hidden mt-1 space-y-1">
              {user.roles && user.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {user.roles.slice(0, 2).map((role) => (
                    <Badge
                      key={role.id}
                      variant="outline"
                      className="text-xs px-1 py-0.5 bg-secondary text-secondary-foreground border-border"
                    >
                      {role.name}
                    </Badge>
                  ))}
                  {user.roles.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{user.roles.length - 2}
                    </span>
                  )}
                </div>
              )}
              {user.stores && user.stores.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {user.stores.slice(0, 2).map((userStore) => (
                    <Badge
                      key={userStore.store.id}
                      variant="secondary"
                      className="text-xs px-1 py-0.5 bg-accent text-accent-foreground border-border"
                    >
                      {userStore.store.name}
                    </Badge>
                  ))}
                  {user.stores.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{user.stores.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
        <div className="space-y-1 max-w-[20rem] lg:max-w-none">
          {user.roles && user.roles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {user.roles.slice(0, 4).map((role) => (
                <Badge
                  key={role.id}
                  variant="outline"
                  className="text-xs px-1 py-0.5 bg-secondary text-secondary-foreground border-border"
                >
                  <span
                    className="truncate max-w-[8rem]"
                    title={role.name}
                  >
                    {role.name}
                  </span>
                </Badge>
              ))}
              {user.roles.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{user.roles.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground">
              No roles
            </span>
          )}
        </div>
      </TableCell>
      
      <TableCell className="p-2 sm:p-4 hidden md:table-cell">
        <div className="space-y-1 max-w-[20rem] lg:max-w-none">
          {user.stores && user.stores.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {user.stores.slice(0, 4).map((userStore) => (
                <Badge
                  key={userStore.store.id}
                  variant="secondary"
                  className="text-xs px-1 py-0.5 bg-accent text-accent-foreground border-border"
                >
                  <span
                    className="truncate max-w-[7rem]"
                    title={userStore.store.name}
                  >
                    {userStore.store.name}
                  </span>
                </Badge>
              ))}
              {user.stores.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{user.stores.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground">
              No stores
            </span>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-right p-2 sm:p-4">
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssign(user.id)}
            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto bg-secondary text-secondary-foreground border-border"
          >
            <UserPlus className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Assign</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(user.id)}
            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto text-muted-foreground bg-transparent"
          >
            <Eye className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
