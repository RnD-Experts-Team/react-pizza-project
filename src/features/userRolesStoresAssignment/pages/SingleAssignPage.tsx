/**
 * Single Assignment Page
 * 
 * A page for assigning a single role to a user for a specific store
 * with radio button selection for single choice interface.
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useStores } from '@/features/stores/hooks/useStores';
import { useAssignmentOperations } from '../hooks/UseUserRolesStoresAssignment';
import type { AssignUserRoleRequest } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Users, Shield, Store, Loader2, X, UserCheck } from 'lucide-react';

// Import layout and components
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { ProgressIndicator } from '@/features/userRolesStoresAssignment/components/singleAssignPage/ProgressIndicator';
import { AssignmentResult } from '@/features/userRolesStoresAssignment/components/singleAssignPage/AssignmentResult';
import { SelectionSummary } from '@/features/userRolesStoresAssignment/components/singleAssignPage/SelectionSummary';
import { UserSelectionTab } from '@/features/userRolesStoresAssignment/components/singleAssignPage/UserSelectionTab';
import { RoleSelectionTab } from '@/features/userRolesStoresAssignment/components/singleAssignPage/RoleSelectionTab';
import { StoreSelectionTab } from '@/features/userRolesStoresAssignment/components/singleAssignPage/StoreSelectionTab';

interface AssignmentData {
  selectedUser: number | null;
  selectedRole: number | null;
  selectedStore: string | null;
}

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const SingleAssignPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Get pre-selected values from URL params
  const preSelectedUserId = searchParams.get('userId');
  const preSelectedStoreId = searchParams.get('storeId');
  
  // State for assignment data
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    selectedUser: preSelectedUserId ? parseInt(preSelectedUserId) : null,
    selectedRole: null,
    selectedStore: preSelectedStoreId || null,
  });



  // State for assignment process
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch data using hooks (only needed for SelectionSummary component)
  const { users } = useUsers();
  const { roles } = useRoles();
  const { stores } = useStores();

  // Get assignment operations hook
  const { assignUserRole, assignError } = useAssignmentOperations();



  // Assignment steps for progress tracking
  const assignmentSteps: AssignmentStep[] = [
    {
      id: 'user',
      title: 'Select User',
      description: 'Choose a user to assign role to',
      completed: assignmentData.selectedUser !== null,
    },
    {
      id: 'role',
      title: 'Select Role',
      description: 'Choose a role to assign',
      completed: assignmentData.selectedRole !== null,
    },
    {
      id: 'store',
      title: 'Select Store',
      description: 'Choose a store for the assignment',
      completed: assignmentData.selectedStore !== null,
    },
  ];

  const completedSteps = assignmentSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / assignmentSteps.length) * 100;

  // Handler functions
  const handleUserSelect = (userId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUser: parseInt(userId),
    }));
  };

  const handleRoleSelect = (roleId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRole: parseInt(roleId),
    }));
  };

  const handleStoreSelect = (storeId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStore: storeId,
    }));
  };

  const handleClearSelection = () => {
    setAssignmentData({
      selectedUser: preSelectedUserId ? parseInt(preSelectedUserId) : null,
      selectedRole: null,
      selectedStore: preSelectedStoreId || null,
    });
    setAssignmentResult(null);
  };

  const handleAssignment = async () => {
    if (!assignmentData.selectedUser || !assignmentData.selectedRole || !assignmentData.selectedStore) {
      return;
    }

    setIsAssigning(true);
    setShowConfirmDialog(false);

    try {
      const assignmentRequest: AssignUserRoleRequest = {
        user_id: assignmentData.selectedUser,
        role_id: assignmentData.selectedRole,
        store_id: assignmentData.selectedStore,
        is_active: true,
        metadata: {
          start_date: new Date().toISOString(),
          notes: 'Single assignment via Assignment Page'
        }
      };

      await assignUserRole(assignmentRequest);
      
      setAssignmentResult({
        success: true,
        message: `Successfully assigned role to user for the selected store.`,
      });

      // Clear selection after successful assignment
      setTimeout(() => {
        handleClearSelection();
      }, 3000);
    } catch (error) {
      console.error('Assignment error:', error);
      setAssignmentResult({
        success: false,
        message: assignError?.message || 'Failed to assign role. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const canAssign = assignmentData.selectedUser !== null &&
                   assignmentData.selectedRole !== null &&
                   assignmentData.selectedStore !== null;



  return (
    <ManageLayout
      title="Single Role Assignment"
      subtitle="Assign a single role to a user for a specific store"
      backButton={{
        show: true,
      }}
    >
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
        <Button
          variant="outline"
          onClick={handleClearSelection}
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
              <Button onClick={handleAssignment}>
                Confirm Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ProgressIndicator
        assignmentSteps={assignmentSteps}
        completedSteps={completedSteps}
        progressPercentage={progressPercentage}
      />

      {assignmentResult && (
        <AssignmentResult result={assignmentResult} />
      )}

      {(assignmentData.selectedUser || assignmentData.selectedRole || assignmentData.selectedStore) && (
        <SelectionSummary
          assignmentData={assignmentData}
          users={users}
          roles={roles}
          stores={stores}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-[var(--muted)] p-1 rounded-lg">
          <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Users</span>
            <span className="sm:hidden">U</span>
            {assignmentData.selectedUser && <span className="hidden lg:inline text-[var(--primary)]">(1 selected)</span>}
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Roles</span>
            <span className="sm:hidden">R</span>
            {assignmentData.selectedRole && <span className="hidden lg:inline text-[var(--primary)]">(1 selected)</span>}
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm">
            <Store className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Stores</span>
            <span className="sm:hidden">S</span>
            {assignmentData.selectedStore && <span className="hidden lg:inline text-[var(--primary)]">(1 selected)</span>}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          <UserSelectionTab
            selectedUserId={assignmentData.selectedUser}
            onUserSelect={handleUserSelect}
          />
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4 sm:space-y-6">
          <RoleSelectionTab
            selectedRoleId={assignmentData.selectedRole}
            onRoleSelect={handleRoleSelect}
          />
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" className="space-y-4 sm:space-y-6">
          <StoreSelectionTab
            selectedStoreId={assignmentData.selectedStore}
            onStoreSelect={handleStoreSelect}
          />
        </TabsContent>
      </Tabs>
    </ManageLayout>
  );
};

export default SingleAssignPage;