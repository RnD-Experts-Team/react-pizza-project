import React, { memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Store, Shield, Trash2, Loader2, MoreHorizontal } from 'lucide-react';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';


interface AssignmentTableRowProps {
  assignment: Assignment;
  getRoleName: (roleId: number) => string;
  getStoreName: (storeId: string) => string;
  onToggleStatus: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  isUpdating: boolean;
  formatDate: (dateString: string) => string;
}


export const AssignmentTableRow: React.FC<AssignmentTableRowProps> = memo(({
  assignment,
  getRoleName,
  getStoreName,
  onToggleStatus,
  onDelete,
  isUpdating,
  formatDate,
}) => {
  // Memoize computed values to avoid recalculating on every render
  const roleName = useMemo(() => getRoleName(assignment.role_id), 
    [getRoleName, assignment.role_id]);
  
  const storeName = useMemo(() => getStoreName(assignment.store_id), 
    [getStoreName, assignment.store_id]);
  
  const createdDate = useMemo(() => formatDate(assignment.created_at), 
    [formatDate, assignment.created_at]);
  
  const updatedDate = useMemo(() => formatDate(assignment.updated_at), 
    [formatDate, assignment.updated_at]);

  // Memoize event handlers to prevent unnecessary re-renders of child components
  const handleToggleStatus = useCallback(() => {
    onToggleStatus(assignment);
  }, [onToggleStatus, assignment]);

  const handleDelete = useCallback(() => {
    onDelete(assignment);
  }, [onDelete, assignment]);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs sm:text-sm py-2 sm:py-4">
        <div className="truncate max-w-[80px] sm:max-w-none">
          {assignment.id}
        </div>
      </TableCell>
      <TableCell className="py-2 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-sm truncate">
            {roleName} {/* ✅ Using memoized value */}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-2 sm:py-4 hidden sm:table-cell">
        <div className="flex items-center gap-1 sm:gap-2">
          <Store className="h-3 w-3 sm:h-4 sm:w-4 text-chart-3 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-sm truncate">
            {storeName} {/* ✅ Using memoized value */}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-2 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Switch
            checked={assignment.is_active}
            onCheckedChange={handleToggleStatus} 
            disabled={!assignment.id || isUpdating}
            className="scale-75 sm:scale-100"
          />
          <Badge 
            variant={assignment.is_active ? 'default' : 'secondary'}
            className="text-xs px-1 sm:px-2 py-0.5"
          >
            <span className="hidden sm:inline">{assignment.is_active ? 'Active' : 'Inactive'}</span>
            <span className="sm:hidden">{assignment.is_active ? 'A' : 'I'}</span>
          </Badge>
          {assignment.id && isUpdating && (
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          )}
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm text-muted-foreground py-2 sm:py-4 hidden md:table-cell">
        <div className="truncate">
          {createdDate} {/* ✅ Using memoized value */}
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm text-muted-foreground py-2 sm:py-4 hidden lg:table-cell">
        <div className="truncate">
          {updatedDate} {/* ✅ Using memoized value */}
        </div>
      </TableCell>
      <TableCell className="text-right py-2 sm:py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive text-xs sm:text-sm"
            >
              <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Delete Assignment</span>
              <span className="sm:hidden">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

// Set display name for better debugging experience
AssignmentTableRow.displayName = 'AssignmentTableRow';

export default AssignmentTableRow;
