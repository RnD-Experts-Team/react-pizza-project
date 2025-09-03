import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, User, Shield, Trash2, MoreHorizontal } from 'lucide-react';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';

interface AssignmentTableRowProps {
  assignment: Assignment;
  getUserName: (userId: number) => string;
  getRoleName: (roleId: number) => string;
  formatDate: (dateString: string) => string;
  onToggleStatus: (assignment: Assignment) => void;
  onDeleteClick: (assignment: Assignment) => void;
  isUpdating: boolean;
}

export const AssignmentTableRow: React.FC<AssignmentTableRowProps> = ({
  assignment,
  getUserName,
  getRoleName,
  formatDate,
  onToggleStatus,
  onDeleteClick,
  isUpdating,
}) => {
  return (
    <TableRow key={assignment.id}>
      <TableCell className="font-mono text-xs sm:text-sm py-3">
        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
          {assignment.id}
        </span>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: 'var(--chart-4)' }} />
          <span className="font-medium text-xs sm:text-sm truncate">
            {getUserName(assignment.user_id)}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: 'var(--chart-3)' }} />
          <span className="font-medium text-xs sm:text-sm truncate">
            {getRoleName(assignment.role_id)}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <Switch
            checked={assignment.is_active}
            onCheckedChange={() => onToggleStatus(assignment)}
            disabled={!assignment.id || isUpdating}
            className="scale-75 sm:scale-100"
          />
          <Badge 
            variant={assignment.is_active ? 'default' : 'secondary'}
            className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1"
          >
            <span className="hidden sm:inline">{assignment.is_active ? 'Active' : 'Inactive'}</span>
            <span className="sm:hidden">{assignment.is_active ? 'On' : 'Off'}</span>
          </Badge>
          {isUpdating && (
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" style={{ color: 'var(--primary)' }} />
          )}
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm py-3 hidden md:table-cell" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex flex-col">
          <span>{formatDate(assignment.created_at)}</span>
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm py-3 hidden lg:table-cell" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex flex-col">
          <span>{formatDate(assignment.updated_at)}</span>
        </div>
      </TableCell>
      <TableCell className="text-right py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0 sm:h-8 sm:w-8" size="sm">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onDeleteClick(assignment)}
              className="text-xs sm:text-sm"
              style={{ color: 'var(--destructive)' }}
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