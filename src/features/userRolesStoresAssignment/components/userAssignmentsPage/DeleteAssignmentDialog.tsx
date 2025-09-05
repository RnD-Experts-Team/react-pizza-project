import React, { memo, useMemo, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';


interface DeleteAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment | null;
  onConfirm: () => void;
  getRoleName: (roleId: number) => string;
  getStoreName: (storeId: string) => string;
}


export const DeleteAssignmentDialog: React.FC<DeleteAssignmentDialogProps> = memo(({
  open,
  onOpenChange,
  assignment,
  onConfirm,
  getRoleName,
  getStoreName,
}) => {
  // Memoize computed values to avoid recalculating on every render
  const roleName = useMemo(() => {
    return assignment ? getRoleName(assignment.role_id) : '';
  }, [assignment, getRoleName]);

  const storeName = useMemo(() => {
    return assignment ? getStoreName(assignment.store_id) : '';
  }, [assignment, getStoreName]);

  // Memoize the assignment details to avoid recalculating the display text
  const assignmentDetails = useMemo(() => {
    if (!assignment) return null;
    return (
      <span className="font-medium">
        {' '}for {roleName} in {storeName}
      </span>
    );
  }, [assignment, roleName, storeName]);

  // Memoize event handlers
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleOpenChange = useCallback((open: boolean) => {
    onOpenChange(open);
  }, [onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="mx-4 sm:mx-auto max-w-sm sm:max-w-lg">
        <AlertDialogHeader className="space-y-2 sm:space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            This action cannot be undone. This will permanently delete the role assignment
            {assignmentDetails}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <span className="hidden sm:inline">Delete Assignment</span>
            <span className="sm:hidden">Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

// Set display name for better debugging experience
DeleteAssignmentDialog.displayName = 'DeleteAssignmentDialog';

export default DeleteAssignmentDialog;
