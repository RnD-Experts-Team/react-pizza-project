/**
 * StoreUsersTableRow Component
 * Renders individual row for user assignment
 */
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, User } from 'lucide-react';
import type { ProcessedAssignment } from '@/features/stores/components/StoreUsersSecction/AssignmentsTable';

interface StoreUsersTableRowProps {
  assignment: ProcessedAssignment;
}

export const StoreUsersTableRow: React.FC<StoreUsersTableRowProps> = React.memo(({
  assignment
}) => {
  return (
    <TableRow>
      <TableCell className="py-2 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center bg-primary/10">
            <span className="text-xs sm:text-sm font-medium text-primary">
              {assignment.userInitials || <User className="h-3 w-3" />}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-xs sm:text-sm truncate">
              {assignment.user?.name || `User ID: ${assignment.user_id}`}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              ID: {assignment.user_id}
            </div>
            {/* Show email on mobile under name */}
            {assignment.user?.email && (
              <div className="sm:hidden text-xs text-muted-foreground truncate mt-1">
                {assignment.user.email}
                {assignment.user.email_verified_at && (
                  <span className="ml-2 text-xs text-green-500">
                    ✓ Verified
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell py-2 sm:py-4">
        {assignment.user?.email ? (
          <div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm truncate max-w-[150px] lg:max-w-none">
                {assignment.user.email}
              </span>
            </div>
            {assignment.user.email_verified_at && (
              <div className="text-xs mt-1 text-green-500">
                Verified
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            No email available
          </div>
        )}
      </TableCell>
      
      <TableCell className="py-2 sm:py-4">
        <Badge variant="outline" className="text-xs">
          {assignment.formattedRole}
        </Badge>
      </TableCell>
      
      <TableCell className="py-2 sm:py-4">
        <Badge 
          variant={assignment.is_active ? 'default' : 'secondary'}
          className={`text-xs ${
            assignment.is_active 
              ? 'bg-green-500 text-white hover:bg-green-600'
              : ''
          }`}
        >
          {assignment.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      
      <TableCell className="hidden md:table-cell py-2 sm:py-4">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="whitespace-nowrap">{assignment.formattedDate}</span>
        </div>
      </TableCell>
    </TableRow>
  );
});

StoreUsersTableRow.displayName = 'StoreUsersTableRow';
