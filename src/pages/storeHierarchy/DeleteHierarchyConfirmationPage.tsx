/**
 * Delete Hierarchy Confirmation Page
 * 
 * Displays the complete hierarchy structure for a store and allows selective deletion
 * of hierarchy relationships. Shows each hierarchy item with individual remove options.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStoreHierarchy, useRemoveHierarchy } from '../../features/storeHierarchy/hooks/UseRoleHierarchy';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';

import { 
  ArrowLeft,
  Trash2,
  AlertTriangle,
  Building2,
  RefreshCw,
  AlertCircle,
  Crown,
  UserCheck,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { RoleHierarchy, RemoveHierarchyRequest } from '../../features/storeHierarchy/types';

interface HierarchyItemProps {
  hierarchy: RoleHierarchy;
  onSelect: (hierarchy: RoleHierarchy, selected: boolean) => void;
  isSelected: boolean;
  isDeleting: boolean;
}

const HierarchyItem: React.FC<HierarchyItemProps> = ({
  hierarchy,
  onSelect,
  isSelected,
  isDeleting
}) => {
  return (
    <div className={cn(
      "p-3 sm:p-4 border rounded-lg transition-all duration-200",
      isSelected ? "border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30" : "border-border hover:border-accent-foreground/20",
      isDeleting && "opacity-50 pointer-events-none"
    )}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(hierarchy, checked as boolean)}
          disabled={isDeleting}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-3">
          {/* Hierarchy Relationship */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            {/* Higher Role */}
            <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md w-full sm:w-auto">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs sm:text-sm text-blue-900 dark:text-blue-200 truncate">{hierarchy.higher_role?.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">Higher Role (ID: {hierarchy.higher_role?.id})</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center w-full sm:w-auto">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground rotate-180" />
            </div>
            
            {/* Lower Role */}
            <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md w-full sm:w-auto">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs sm:text-sm text-green-900 dark:text-green-200 truncate">{hierarchy.lower_role?.name}</p>
                <p className="text-xs text-green-600 dark:text-green-300">Lower Role (ID: {hierarchy.lower_role?.id})</p>
              </div>
            </div>
          </div>
          
          {/* Hierarchy Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Store ID</label>
              <p className="font-mono text-foreground text-xs sm:text-sm">{hierarchy.store_id}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hierarchy ID</label>
              <p className="font-mono text-foreground text-xs sm:text-sm">{hierarchy.id}</p>
            </div>
          </div>
          
          {/* Role Permissions Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Higher: {hierarchy.higher_role?.permissions?.length || 0} permissions</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Lower: {hierarchy.lower_role?.permissions?.length || 0} permissions</span>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex flex-col items-end space-y-2">
          <Badge variant="default" className="text-xs">
            Active
          </Badge>
          {isSelected && (
            <Badge variant="destructive" className="text-xs">
              <Trash2 className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">To Delete</span>
              <span className="sm:hidden">Delete</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

interface DeleteConfirmationDialogProps {
  selectedHierarchies: RoleHierarchy[];
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  open: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
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

export const DeleteHierarchyConfirmationPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedHierarchies, setSelectedHierarchies] = useState<Set<number>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  
  // Get preselected hierarchy from navigation state (from validate page)
  const preselectedState = location.state as {
    preselectedHigherRole?: string;
    preselectedLowerRole?: string;
    validatedHierarchy?: {
      higher_role_id: number;
      lower_role_id: number;
      store_id: string;
    };
  } | null;
  
  const {
    hierarchies,
    isLoading: loading,
    error,
    refetch
  } = useStoreHierarchy(storeId!);
  
  const { removeHierarchy, isLoading: isDeleting } = useRemoveHierarchy();

  const handleSelectHierarchy = (hierarchy: RoleHierarchy, selected: boolean) => {
    setSelectedHierarchies(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(hierarchy.id);
      } else {
        newSet.delete(hierarchy.id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedHierarchies(new Set(hierarchies.map(h => h.id)));
    } else {
      setSelectedHierarchies(new Set());
    }
  };

  const handleDeleteSelected = () => {
    if (selectedHierarchies.size > 0) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    const selectedHierarchyItems = hierarchies.filter(h => selectedHierarchies.has(h.id));
    
    try {
      setDeletingIds(new Set(selectedHierarchies));
      
      // Delete each selected hierarchy
      for (const hierarchy of selectedHierarchyItems) {
        const request: RemoveHierarchyRequest = {
          higher_role_id: hierarchy.higher_role?.id!,
          lower_role_id: hierarchy.lower_role?.id!,
          store_id: storeId!
        };
        
        await removeHierarchy(request);
      }
      
      // Refresh data and reset state
      await refetch(storeId!);
      setSelectedHierarchies(new Set());
      setShowConfirmDialog(false);
      setDeletingIds(new Set());
      
    } catch (error) {
      console.error('Failed to delete hierarchies:', error);
      setDeletingIds(new Set());
    }
  };

  const handleBack = () => {
    navigate(`/stores-hierarchy/${storeId}`);
  };

  // Auto-select hierarchy if coming from validate page
  useEffect(() => {
    if (preselectedState?.validatedHierarchy && hierarchies.length > 0) {
      const { higher_role_id, lower_role_id } = preselectedState.validatedHierarchy;
      
      // Find the hierarchy that matches the validated roles
      const matchingHierarchy = hierarchies.find(h => 
        h.higher_role?.id === higher_role_id && h.lower_role?.id === lower_role_id
      );
      
      if (matchingHierarchy) {
        setSelectedHierarchies(new Set([matchingHierarchy.id]));
      }
    }
  }, [hierarchies, preselectedState]);

  const selectedHierarchyItems = hierarchies.filter(h => selectedHierarchies.has(h.id));
  const allSelected = hierarchies.length > 0 && selectedHierarchies.size === hierarchies.length;
  const someSelected = selectedHierarchies.size > 0 && selectedHierarchies.size < hierarchies.length;

  if (!storeId) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive text-sm sm:text-base">
            Store ID is required to view hierarchy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button onClick={handleBack} variant="outline" size="sm" className="hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Hierarchy</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
              <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              <span>Delete Hierarchy Confirmation</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Select hierarchy relationships to delete for store: <span className="font-mono">{storeId}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => refetch(storeId!)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="hover:bg-accent text-sm sm:text-base"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive text-sm sm:text-base">
            {error?.message || 'An error occurred while loading the hierarchies.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Selection Controls */}
      {hierarchies.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as any).indeterminate = someSelected;
                  }}
                  onCheckedChange={handleSelectAll}
                />
                <div>
                  <h3 className="font-medium text-sm sm:text-base">Select Hierarchies</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {selectedHierarchies.size} of {hierarchies.length} selected
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleDeleteSelected}
                variant="destructive"
                size="sm"
                disabled={selectedHierarchies.size === 0 || isDeleting}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Delete Selected ({selectedHierarchies.size})</span>
                <span className="sm:hidden">Delete ({selectedHierarchies.size})</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Hierarchies List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-lg sm:text-xl">Store Hierarchy Relationships</span>
            </div>
            <Badge variant="outline" className="text-xs sm:text-sm">{hierarchies.length} items</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-12 w-32" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : hierarchies.length > 0 ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3 sm:space-y-4">
                {hierarchies.map((hierarchy) => (
                  <HierarchyItem
                    key={hierarchy.id}
                    hierarchy={hierarchy}
                    onSelect={handleSelectHierarchy}
                    isSelected={selectedHierarchies.has(hierarchy.id)}
                    isDeleting={deletingIds.has(hierarchy.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No hierarchies found</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                This store doesn't have any role hierarchy relationships configured.
              </p>
              <Button onClick={handleBack} variant="outline" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Go Back</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        selectedHierarchies={selectedHierarchyItems}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        isDeleting={isDeleting}
        open={showConfirmDialog}
      />
    </div>
  );
};

export default DeleteHierarchyConfirmationPage;