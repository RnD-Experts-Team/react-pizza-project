/**
 * StoreUsersTable Component
 * Renders the table structure for user assignments
 */
import React from 'react';
import type { Assignment } from '@/features/userRolesStoresAssignment/types/index';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StoreUsersTableRow } from '@/features/stores/components/StoreUsersSecction/AssignmentsRow';

export interface ProcessedAssignment extends Assignment {
  formattedDate: string;
  formattedRole: string;
  userInitials: string | null;
  uniqueKey: string | number;
}

interface StoreUsersTableProps {
  assignments: ProcessedAssignment[];
}

export const StoreUsersTable: React.FC<StoreUsersTableProps> = React.memo(({
  assignments
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] sm:min-w-[250px]">User</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[100px]">Role</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="hidden md:table-cell min-w-[120px]">Assigned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <StoreUsersTableRow 
              key={assignment.uniqueKey} 
              assignment={assignment} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

StoreUsersTable.displayName = 'StoreUsersTable';
