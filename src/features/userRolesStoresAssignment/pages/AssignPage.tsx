/**
 * Enhanced Assignment Page
 * 
 * A comprehensive page for assigning roles to users across different stores
 * with an intuitive multi-select interface and advanced filtering capabilities.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useAssignmentOperations } from '../hooks/UseUserRolesStoresAssignment';
import type { BulkAssignUserRolesRequest, BulkAssignmentItem } from '../types';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { AssignmentActionButtons } from '@/features/userRolesStoresAssignment/components/assignPage/AssignmentActionButtons';
import { AssignmentProgressAndResults } from '@/features/userRolesStoresAssignment/components/assignPage/AssignmentProgressAndResults';
import { AssignmentTabs } from '@/features/userRolesStoresAssignment/components/assignPage/AssignmentTabs';
import type { AssignmentData, AssignmentStep, AssignmentResult } from '@/features/userRolesStoresAssignment/types';

export const AssignPage: React.FC = () => {
  // State for assignment data
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    selectedUsers: [],
    selectedRoles: [],
    selectedStores: [],
  });

  // State for assignment process
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Memoized assignment steps for progress tracking
  const assignmentSteps = useMemo((): AssignmentStep[] => [
    {
      id: 'users',
      title: 'Select Users',
      description: 'Choose users to assign roles to',
      completed: assignmentData.selectedUsers.length > 0,
    },
    {
      id: 'roles',
      title: 'Select Roles',
      description: 'Choose roles to assign',
      completed: assignmentData.selectedRoles.length > 0,
    },
    {
      id: 'stores',
      title: 'Select Stores',
      description: 'Choose stores for the assignment',
      completed: assignmentData.selectedStores.length > 0,
    },
  ], [assignmentData.selectedUsers.length, assignmentData.selectedRoles.length, assignmentData.selectedStores.length]);

  // Memoized calculations
  const completedSteps = useMemo(() => 
    assignmentSteps.filter(step => step.completed).length, 
    [assignmentSteps]
  );

  const progressPercentage = useMemo(() => 
    (completedSteps / assignmentSteps.length) * 100, 
    [completedSteps, assignmentSteps.length]
  );

  // Memoized handler functions with useCallback
  const handleUserToggle = useCallback((userId: number) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  }, []);

  const handleRoleToggle = useCallback((roleId: number) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId],
    }));
  }, []);

  const handleStoreToggle = useCallback((storeId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.includes(storeId)
        ? prev.selectedStores.filter(id => id !== storeId)
        : [...prev.selectedStores, storeId],
    }));
  }, []);

  const handleSelectAllUsers = useCallback(() => {
    // This will be handled by the BulkUserSelectionTab component internally
    // The component will call onUserToggle for each user
  }, []);

  const handleSelectAllRoles = useCallback(() => {
    // This will be handled by the BulkRoleSelectionTab component internally
    // The component will call onRoleToggle for each role
  }, []);

  const handleSelectAllStores = useCallback(() => {
    // This will be handled by the BulkStoreSelectionTab component internally
    // The component will call onStoreToggle for each store
  }, []);

  const handleClearSelection = useCallback(() => {
    setAssignmentData({
      selectedUsers: [],
      selectedRoles: [],
      selectedStores: [],
    });
    setAssignmentResult(null);
  }, []);

  // Get assignment operations hook
  const { bulkAssignUserRoles, isBulkAssigning, bulkAssignError } = useAssignmentOperations();

  const handleAssignment = useCallback(async () => {
    setIsAssigning(true);
    setShowConfirmDialog(false);

    try {
      const assignmentPromises: Promise<any>[] = [];
      let totalAssignments = 0;

      // Create bulk assignment requests for each selected user
      for (const userId of assignmentData.selectedUsers) {
        // Create assignments array for this user (all combinations of roles and stores)
        const assignments: BulkAssignmentItem[] = [];
        
        for (const roleId of assignmentData.selectedRoles) {
          for (const storeId of assignmentData.selectedStores) {
            assignments.push({
              role_id: roleId,
              store_id: storeId,
              metadata: {
                start_date: new Date().toISOString(),
                notes: 'Bulk assignment via Assignment Page'
              }
            });
            totalAssignments++;
          }
        }

        // Create bulk assignment request for this user
        const bulkRequest: BulkAssignUserRolesRequest = {
          user_id: userId,
          assignments: assignments
        };

        // Add the promise to the array
        assignmentPromises.push(bulkAssignUserRoles(bulkRequest));
      }

      // Execute all bulk assignments in parallel
      const results = await Promise.allSettled(assignmentPromises);
      
      // Check results
      const successfulAssignments = results.filter(result => result.status === 'fulfilled').length;
      const failedAssignments = results.filter(result => result.status === 'rejected').length;

      if (failedAssignments === 0) {
        setAssignmentResult({
          success: true,
          message: `Successfully assigned ${assignmentData.selectedRoles.length} roles to ${assignmentData.selectedUsers.length} users across ${assignmentData.selectedStores.length} stores (${totalAssignments} total assignments).`,
        });

        // Clear selection after successful assignment
        setTimeout(() => {
          handleClearSelection();
        }, 3000);
      } else {
        setAssignmentResult({
          success: false,
          message: `Partial success: ${successfulAssignments} users assigned successfully, ${failedAssignments} failed. Please check the failed assignments and try again.`,
        });
      }
    } catch (error) {
      console.error('Assignment error:', error);
      setAssignmentResult({
        success: false,
        message: bulkAssignError?.message || 'Failed to assign roles. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  }, [assignmentData, bulkAssignUserRoles, bulkAssignError, handleClearSelection]);

  // Memoized validation
  const canAssign = useMemo(() => 
    assignmentData.selectedUsers.length > 0 &&
    assignmentData.selectedRoles.length > 0 &&
    assignmentData.selectedStores.length > 0, 
    [assignmentData]
  );

  // Memoized loading state
  const isActuallyAssigning = useMemo(() => 
    isAssigning || isBulkAssigning, 
    [isAssigning, isBulkAssigning]
  );

  return (
    <ManageLayout
      title="Role Assignment"
      subtitle="Assign roles to users across different stores with an intuitive interface"
      backButton={{ show: true }}
    >
      <AssignmentActionButtons
        assignmentData={assignmentData}
        canAssign={canAssign}
        isAssigning={isActuallyAssigning}
        showConfirmDialog={showConfirmDialog}
        onShowConfirmDialog={setShowConfirmDialog}
        onClearSelection={handleClearSelection}
        onConfirmAssignment={handleAssignment}
      />

      <AssignmentProgressAndResults
        assignmentSteps={assignmentSteps}
        completedSteps={completedSteps}
        progressPercentage={progressPercentage}
        assignmentResult={assignmentResult}
        assignmentData={assignmentData}
      />

      <AssignmentTabs
        assignmentData={assignmentData}
        onUserToggle={handleUserToggle}
        onRoleToggle={handleRoleToggle}
        onStoreToggle={handleStoreToggle}
        onSelectAllUsers={handleSelectAllUsers}
        onSelectAllRoles={handleSelectAllRoles}
        onSelectAllStores={handleSelectAllStores}
      />
    </ManageLayout>
  );
};

export default AssignPage;
