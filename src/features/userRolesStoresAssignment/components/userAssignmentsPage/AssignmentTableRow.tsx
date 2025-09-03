import React from 'react';
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

export const AssignmentTableRow: React.FC<AssignmentTableRowProps> = ({
  assignment,
  getRoleName,
  getStoreName,
  onToggleStatus,
  onDelete,
  isUpdating,
  formatDate,
}) => {
  return (
    <TableRow key={assignment.id}>
      <TableCell className="font-mono text-xs sm:text-sm py-2 sm:py-4">
        <div className="truncate max-w-[80px] sm:max-w-none">
          {assignment.id}
        </div>
      </TableCell>
      <TableCell className="py-2 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-sm truncate">
            {getRoleName(assignment.role_id)}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-2 sm:py-4 hidden sm:table-cell">
        <div className="flex items-center gap-1 sm:gap-2">
          <Store className="h-3 w-3 sm:h-4 sm:w-4 text-chart-3 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-sm truncate">
            {getStoreName(assignment.store_id)}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-2 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Switch
            checked={assignment.is_active}
            onCheckedChange={() => onToggleStatus(assignment)}
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
          {formatDate(assignment.created_at)}
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm text-muted-foreground py-2 sm:py-4 hidden lg:table-cell">
        <div className="truncate">
          {formatDate(assignment.updated_at)}
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
              onClick={() => onDelete(assignment)}
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
};

export default AssignmentTableRow;