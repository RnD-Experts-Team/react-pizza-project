import React from 'react';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { ScrollArea } from '../../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import type { RoleHierarchy } from '../../../features/storeHierarchy/types';

interface DeleteConfirmationDialogProps {
  selectedHierarchies: RoleHierarchy[];
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  open: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  selectedHierarchies,
  onConfirm,
  onCancel,
  isDeleting,
  open
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <span>Confirm Deletion</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              You are about to delete {selectedHierarchies.length} hierarchy relationship{selectedHierarchies.length > 1 ? 's' : ''}. 
              This action cannot be undone.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm sm:text-base">Hierarchies to be deleted:</h4>
            <ScrollArea className="h-32 border rounded-md p-2">
              <div className="space-y-2">
                {selectedHierarchies.map((hierarchy) => (
                  <div key={hierarchy.id} className="text-xs sm:text-sm p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800/30">
                    <span className="font-medium text-foreground">{hierarchy.higher_role?.name}</span>
                    <span className="mx-2 text-muted-foreground">→</span>
                    <span className="font-medium text-foreground">{hierarchy.lower_role?.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto text-sm sm:text-base hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Deleting...</span>
                <span className="sm:hidden">Deleting</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Delete {selectedHierarchies.length} Item{selectedHierarchies.length > 1 ? 's' : ''}</span>
                <span className="sm:hidden">Delete ({selectedHierarchies.length})</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;