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
} from 'lucide-react';

interface BulkPageHeaderProps {
  onClearSelection: () => void;
  onConfirmAssignment: () => void;
  canAssign: boolean;
  isAssigning: boolean;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  selectedUsersCount: number;
  selectedRolesCount: number;
  selectedStoresCount: number;
}

export const BulkPageHeader: React.FC<BulkPageHeaderProps> = ({
  onClearSelection,
  onConfirmAssignment,
  canAssign,
  isAssigning,
  showConfirmDialog,
  setShowConfirmDialog,
  selectedUsersCount,
  selectedRolesCount,
  selectedStoresCount,
}) => {
  return (
    <div className="flex flex-col space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Role Assignment
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Assign roles to users across different stores with an intuitive interface
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
                  You are about to assign {selectedRolesCount} roles to{' '}
                  {selectedUsersCount} users across{' '}
                  {selectedStoresCount} stores.
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