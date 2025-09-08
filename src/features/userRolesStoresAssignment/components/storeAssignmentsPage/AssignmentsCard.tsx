import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Store, Plus } from 'lucide-react';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';
import { LoadingState } from '@/features/userRolesStoresAssignment/components/storeAssignmentsPage/LoadingState';
import { ErrorState } from '@/features/userRolesStoresAssignment/components/storeAssignmentsPage/ErrorState';
import { EmptyState } from '@/features/userRolesStoresAssignment/components/storeAssignmentsPage/EmptyState';
import { AssignmentTableRow } from '@/features/userRolesStoresAssignment/components/storeAssignmentsPage/AssignmentTableRow';

interface AssignmentsCardProps {
  assignments: Assignment[];
  loading: boolean;
  error: { message?: string } | null;
  getUserName: (userId: number) => string;
  getRoleName: (roleId: number) => string;
  formatDate: (dateString: string) => string;
  onToggleStatus: (assignment: Assignment) => void;
  onDeleteClick: (assignment: Assignment) => void;
  onAssignRole: () => void;
  updatingAssignments: Set<number>;
}

export const AssignmentsCard: React.FC<AssignmentsCardProps> = React.memo(({
  assignments,
  loading,
  error,
  getUserName,
  getRoleName,
  formatDate,
  onToggleStatus,
  onDeleteClick,
  onAssignRole,
  updatingAssignments,
}) => {
  // Memoize the table rows to prevent unnecessary re-renders
  const memoizedTableRows = useMemo(() => {
    if (assignments.length === 0) {
      return <EmptyState />;
    }

    return assignments.map((assignment) => (
      <AssignmentTableRow
        key={assignment.id}
        assignment={assignment}
        getUserName={getUserName}
        getRoleName={getRoleName}
        formatDate={formatDate}
        onToggleStatus={onToggleStatus}
        onDeleteClick={onDeleteClick}
        isUpdating={assignment.id ? updatingAssignments.has(assignment.id) : false}
      />
    ));
  }, [
    assignments,
    getUserName,
    getRoleName,
    formatDate,
    onToggleStatus,
    onDeleteClick,
    updatingAssignments,
  ]);

  // Memoize the table content to avoid re-rendering when props haven't changed
  const tableContent = useMemo(() => {
    if (error) {
      return <ErrorState error={error} />;
    }

    if (loading) {
      return <LoadingState />;
    }

    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm min-w-[100px]">Assignment ID</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[120px]">User</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[100px]">Role</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[120px]">Status</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[120px] hidden md:table-cell">Assigned Date</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[120px] hidden lg:table-cell">Updated Date</TableHead>
              <TableHead className="text-xs sm:text-sm text-right min-w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memoizedTableRows}
          </TableBody>
        </Table>
      </div>
    );
  }, [error, loading, memoizedTableRows]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-lg sm:text-xl">Role Assignments</CardTitle>
          </div>
          <Button
            onClick={onAssignRole}
            className="flex items-center gap-2 w-full sm:w-auto"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Assign Role</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {tableContent}
      </CardContent>
    </Card>
  );
});

// Add display name for better debugging
AssignmentsCard.displayName = 'AssignmentsCard';

export default AssignmentsCard;
