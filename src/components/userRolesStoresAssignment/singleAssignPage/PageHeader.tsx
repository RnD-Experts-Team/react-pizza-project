import React from 'react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import {
  Loader2,
  X,
  UserCheck,
  ArrowLeft,
} from 'lucide-react';

interface PageHeaderProps {
  onGoBack: () => void;
  onClearSelection: () => void;
  onConfirmAssignment: () => void;
  canAssign: boolean;
  isAssigning: boolean;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  onGoBack,
  onClearSelection,
  onConfirmAssignment,
  canAssign,
  isAssigning,
  showConfirmDialog,
  setShowConfirmDialog,
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onGoBack}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Single Role Assignment
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
              Assign a single role to a user for a specific store
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClearSelection}
            disabled={!canAssign}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Selection
          </Button>
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button
                disabled={!canAssign || isAssigning}
                className="flex items-center gap-2"
              >
                {isAssigning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}
                {isAssigning ? 'Assigning...' : 'Assign Role'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Role Assignment</DialogTitle>
                <DialogDescription>
                  You are about to assign a role to the selected user for the selected store.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={onConfirmAssignment}>
                  Confirm Assignment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};