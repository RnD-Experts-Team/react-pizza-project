import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import type { Assignment } from '@/features/userRolesStoresAssignment/types/index'; // Import the existing type

interface AssignmentRowProps {
  assignment: Assignment;
  formatDate: (dateString: string) => string;
  getRoleIcon: (roleName: string) => string;
}

export const AssignmentRow: React.FC<AssignmentRowProps> = React.memo(({
  assignment,
  formatDate,
  getRoleIcon,
}) => {
  return (
    <TableRow>
      <TableCell className="py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-primary/10 flex items-center justify-center mx-auto sm:mx-0 flex-shrink-0">
            <span className="text-sm sm:text-lg">
              {getRoleIcon(assignment.role?.name || 'Role')}
            </span>
          </div>
          <div className="text-center sm:text-left min-w-0">
            <div className="font-medium text-sm sm:text-base truncate">
              {assignment.role?.name || `Role ID: ${assignment.role_id}`}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Role ID: {assignment.role_id}
            </div>
            {/* Show user info on mobile */}
            <div className="md:hidden mt-1 space-y-1">
              <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{assignment.user?.name || `User ID: ${assignment.user_id}`}</span>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell py-3 sm:py-4">
        <div className="flex items-center space-x-2">
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm truncate">
            {assignment.user?.name || `User ID: ${assignment.user_id}`}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-3 sm:py-4">
        <div className="flex justify-center sm:justify-start">
          <Badge 
            variant={assignment.is_active ? 'default' : 'secondary'}
            className={`text-xs sm:text-sm ${
              assignment.is_active ? 'bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#10b981]' : ''
            }`}
          >
            {assignment.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {/* Show assigned date on mobile */}
        <div className="lg:hidden mt-1 flex items-center justify-center sm:justify-start space-x-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(assignment.created_at)}</span>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell py-3 sm:py-4">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>{formatDate(assignment.created_at)}</span>
        </div>
      </TableCell>
    </TableRow>
  );
});

AssignmentRow.displayName = 'AssignmentRow';
