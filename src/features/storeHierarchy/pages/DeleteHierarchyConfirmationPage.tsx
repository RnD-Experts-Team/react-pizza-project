/**
 * Delete Hierarchy Confirmation Page
 * 
 * Displays the complete hierarchy structure for a store and allows selective deletion
 * of hierarchy relationships. Shows each hierarchy item with individual remove options.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStoreHierarchy, useRemoveHierarchy } from '@/features/storeHierarchy/hooks/UseRoleHierarchy';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { RoleHierarchy, RemoveHierarchyRequest } from '@/features/storeHierarchy/types';
import { ManageLayout } from '@/components/layouts/ManageLayout';
// Extracted components
import { SelectionControls } from '@/features/storeHierarchy/components/deleteHierarchyConfirmationPage/SelectionControls';
import { HierarchyList } from '@/features/storeHierarchy/components/deleteHierarchyConfirmationPage/HierarchyList';
import { DeleteConfirmationDialog } from '@/features/storeHierarchy/components/deleteHierarchyConfirmationPage/DeleteConfirmationDialog';

// Utility function for finding matching hierarchy
const findMatchingHierarchy = (
  hierarchies: RoleHierarchy[], 
  higherRoleId: number, 
  lowerRoleId: number
): RoleHierarchy | undefined => {
  return hierarchies.find(h => 
    h.higher_role?.id === higherRoleId && h.lower_role?.id === lowerRoleId
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
  const preselectedState = useMemo(() => 
    location.state as {
      preselectedHigherRole?: string;
      preselectedLowerRole?: string;
      validatedHierarchy?: {
        higher_role_id: number;
        lower_role_id: number;
        store_id: string;
      };
    } | null, 
    [location.state]
  );

  const {
    hierarchies,
    isLoading: loading,
    error,
    refetch
  } = useStoreHierarchy(storeId!);

  const { removeHierarchy, isLoading: isDeleting } = useRemoveHierarchy();

  // Memoized derived state
  const selectedHierarchyItems = useMemo(() => 
    hierarchies.filter(h => selectedHierarchies.has(h.id)), 
    [hierarchies, selectedHierarchies]
  );

  const allSelected = useMemo(() => 
    hierarchies.length > 0 && selectedHierarchies.size === hierarchies.length,
    [hierarchies.length, selectedHierarchies.size]
  );

  const someSelected = useMemo(() => 
    selectedHierarchies.size > 0 && selectedHierarchies.size < hierarchies.length,
    [selectedHierarchies.size, hierarchies.length]
  );

  // Memoized callbacks
  const handleSelectHierarchy = useCallback((hierarchy: RoleHierarchy, selected: boolean) => {
    setSelectedHierarchies(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(hierarchy.id);
      } else {
        newSet.delete(hierarchy.id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedHierarchies(new Set(hierarchies.map(h => h.id)));
    } else {
      setSelectedHierarchies(new Set());
    }
  }, [hierarchies]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedHierarchies.size > 0) {
      setShowConfirmDialog(true);
    }
  }, [selectedHierarchies.size]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedHierarchyItems.length === 0) return;

    try {
      setDeletingIds(new Set(selectedHierarchies));
      
      // Parallel deletion with Promise.allSettled for better performance
      const deletePromises = selectedHierarchyItems.map(hierarchy => {
        const request: RemoveHierarchyRequest = {
          higher_role_id: hierarchy.higher_role?.id!,
          lower_role_id: hierarchy.lower_role?.id!,
          store_id: storeId!
        };
        return removeHierarchy(request);
      });

      const results = await Promise.allSettled(deletePromises);
      
      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.error('Some deletions failed:', failures);
        // Could show partial success message to user
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
  }, [selectedHierarchyItems, selectedHierarchies, storeId, removeHierarchy, refetch]);

  const handleBack = useCallback(() => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  }, [navigate, storeId]);

  const handleCancelDialog = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  // Auto-select hierarchy if coming from validate page
  useEffect(() => {
    if (preselectedState?.validatedHierarchy && hierarchies.length > 0) {
      const { higher_role_id, lower_role_id } = preselectedState.validatedHierarchy;
      
      // Use the extracted utility function
      const matchingHierarchy = findMatchingHierarchy(hierarchies, higher_role_id, lower_role_id);
      
      if (matchingHierarchy) {
        setSelectedHierarchies(new Set([matchingHierarchy.id]));
      }
    }
  }, [hierarchies, preselectedState]);

  if (!storeId) {
    return (
      <ManageLayout
        title="Delete Store Hierarchy"
        subtitle="Manage role hierarchies for your store"
        backButton={{
          show: true,
        }}
      >
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive text-sm sm:text-base">
            Store ID is required to view hierarchy.
          </AlertDescription>
        </Alert>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title={`Delete Store Hierarchy - Store ${storeId}`}
      subtitle="Select and remove role hierarchies from your store"
      backButton={{
        show: true,
      }}
    >
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
      <SelectionControls
        totalCount={hierarchies.length}
        selectedCount={selectedHierarchies.size}
        allSelected={allSelected}
        someSelected={someSelected}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        isDeleting={isDeleting}
      />

      {/* Hierarchies List */}
      <HierarchyList
        hierarchies={hierarchies}
        loading={loading}
        selectedHierarchies={selectedHierarchies}
        deletingIds={deletingIds}
        onSelectHierarchy={handleSelectHierarchy}
        onBack={handleBack}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        selectedHierarchies={selectedHierarchyItems}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDialog}
        isDeleting={isDeleting}
        open={showConfirmDialog}
      />
    </ManageLayout>
  );
};

export default DeleteHierarchyConfirmationPage;
