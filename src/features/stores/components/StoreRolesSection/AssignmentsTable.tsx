import React, { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Assignment } from '@/features/userRolesStoresAssignment/types/index'; // Import the existing type
import { AssignmentRow } from '@/features/stores/components/StoreRolesSection/AssignmentRow';

interface AssignmentsTableProps {
  assignments: Assignment[];
}

export const AssignmentsTable: React.FC<AssignmentsTableProps> = ({ assignments }) => {
  // Memoize the formatDate function
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Memoize the getRoleIcon function
  const getRoleIcon = useCallback((roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('admin') || name.includes('manager')) {
      return '👑';
    } else if (name.includes('user') || name.includes('member')) {
      return '👤';
    } else if (name.includes('viewer') || name.includes('read')) {
      return '👁️';
    }
    return '🔐';
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] sm:min-w-[250px]">Role</TableHead>
            <TableHead className="hidden md:table-cell min-w-[140px]">User</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="hidden lg:table-cell min-w-[120px]">Assigned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <AssignmentRow
              key={assignment.id || `${assignment.role_id}-${assignment.user_id}`}
              assignment={assignment}
              formatDate={formatDate}
              getRoleIcon={getRoleIcon}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
