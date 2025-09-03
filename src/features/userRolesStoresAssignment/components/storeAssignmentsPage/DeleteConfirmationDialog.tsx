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
import { Trash2 } from 'lucide-react';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentToDelete: Assignment | null;
  getUserName: (userId: number) => string;
  getRoleName: (roleId: number) => string;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  assignmentToDelete,
  getUserName,
  getRoleName,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base leading-relaxed">
            This action cannot be undone. This will permanently delete the role assignment
            {assignmentToDelete && (
              <span className="font-medium block mt-2 p-2 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                User: {getUserName(assignmentToDelete.user_id)}<br />
                Role: {getRoleName(assignmentToDelete.role_id)}
              </span>
            )}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto order-1 sm:order-2"
            style={{ 
              backgroundColor: 'var(--destructive)', 
              color: 'var(--destructive-foreground)'
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Assignment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;