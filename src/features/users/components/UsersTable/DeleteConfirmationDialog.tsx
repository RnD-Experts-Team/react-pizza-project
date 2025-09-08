// components/UsersTable/DeleteConfirmationDialog.tsx
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
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: { id: number; name: string } | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  userToDelete,
  onConfirm,
  loading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90vw] max-w-md mx-auto">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base leading-relaxed">
            This action cannot be undone. This will permanently delete the user{' '}
            <span className="font-semibold text-foreground">{userToDelete?.name}</span> 
            {' '}and remove all their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
