// components/AssignmentConfirmationDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCheck, Loader2 } from 'lucide-react';
import type { AssignmentData } from '@/features/userRolesStoresAssignment/types';

interface AssignmentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentData: AssignmentData;
  canAssign: boolean;
  isAssigning: boolean;
  onConfirm: () => void;
}

export const AssignmentConfirmationDialog: React.FC<AssignmentConfirmationDialogProps> = ({
  open,
  onOpenChange,
  assignmentData,
  canAssign,
  isAssigning,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={!canAssign || isAssigning}
          className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isAssigning ? (
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          ) : (
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
          <span className="hidden sm:inline">
            {isAssigning ? 'Assigning...' : 'Assign Roles'}
          </span>
          <span className="sm:hidden">
            {isAssigning ? 'Assigning...' : 'Assign'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Role Assignment</DialogTitle>
          <DialogDescription>
            You are about to assign {assignmentData.selectedRoles.length} roles to{' '}
            {assignmentData.selectedUsers.length} users across{' '}
            {assignmentData.selectedStores.length} stores.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
