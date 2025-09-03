import React from 'react';
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

export const DeleteAssignmentDialog: React.FC<DeleteAssignmentDialogProps> = ({
  open,
  onOpenChange,
  assignment,
  onConfirm,
  getRoleName,
  getStoreName,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="mx-4 sm:mx-auto max-w-sm sm:max-w-lg">
        <AlertDialogHeader className="space-y-2 sm:space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            This action cannot be undone. This will permanently delete the role assignment
            {assignment && (
              <span className="font-medium">
                {' '}for {getRoleName(assignment.role_id)} in {getStoreName(assignment.store_id)}
              </span>
            )}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <span className="hidden sm:inline">Delete Assignment</span>
            <span className="sm:hidden">Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAssignmentDialog;