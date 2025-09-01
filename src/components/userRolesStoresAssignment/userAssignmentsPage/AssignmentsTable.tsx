import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { User, Loader2 } from 'lucide-react';
import { AssignmentTableRow } from './AssignmentTableRow';
import type { Assignment } from '../../../features/userRolesStoresAssignment/types';

interface AssignmentsTableProps {
  assignments: Assignment[];
  loading: boolean;
  error: any;
  getRoleName: (roleId: number) => string;
  getStoreName: (storeId: string) => string;
  onToggleStatus: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  updatingAssignments: Set<number>;
  formatDate: (dateString: string) => string;
}

export const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  loading,
  error,
  getRoleName,
  getStoreName,
  onToggleStatus,
  onDelete,
  updatingAssignments,
  formatDate,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
          <CardTitle className="text-lg sm:text-xl">Role Assignments</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {error ? (
          <div className="text-destructive text-center py-4 px-4 sm:px-0">
            Error loading assignments: {error.message || 'Unknown error'}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8 px-4 sm:px-0">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
            <span className="ml-2 text-sm sm:text-base">Loading assignments...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm font-medium">Assignment ID</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium">Role</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium hidden sm:table-cell">Store</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium hidden md:table-cell">Assigned Date</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium hidden lg:table-cell">Updated Date</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                      No role assignments found for this user
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <AssignmentTableRow
                      key={assignment.id}
                      assignment={assignment}
                      getRoleName={getRoleName}
                      getStoreName={getStoreName}
                      onToggleStatus={onToggleStatus}
                      onDelete={onDelete}
                      isUpdating={assignment.id ? updatingAssignments.has(assignment.id) : false}
                      formatDate={formatDate}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentsTable;