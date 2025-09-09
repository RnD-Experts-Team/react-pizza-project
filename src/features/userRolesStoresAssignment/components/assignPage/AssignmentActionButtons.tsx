// components/AssignmentActionButtons.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AssignmentConfirmationDialog } from './AssignmentConfirmationDialog';
import type { AssignmentData } from '@/features/userRolesStoresAssignment/types';

interface AssignmentActionButtonsProps {
  assignmentData: AssignmentData;
  canAssign: boolean;
  isAssigning: boolean;
  showConfirmDialog: boolean;
  onShowConfirmDialog: (show: boolean) => void;
  onClearSelection: () => void;
  onConfirmAssignment: () => void;
}

export const AssignmentActionButtons: React.FC<AssignmentActionButtonsProps> = ({
  assignmentData,
  canAssign,
  isAssigning,
  showConfirmDialog,
  onShowConfirmDialog,
  onClearSelection,
  onConfirmAssignment,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mb-4">
      <Button
        variant="outline"
        onClick={onClearSelection}
        disabled={!canAssign}
        className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2"
      >
        <X className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Clear Selection</span>
        <span className="sm:hidden">Clear</span>
      </Button>
      
      <AssignmentConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={onShowConfirmDialog}
        assignmentData={assignmentData}
        canAssign={canAssign}
        isAssigning={isAssigning}
        onConfirm={onConfirmAssignment}
      />
    </div>
  );
};
