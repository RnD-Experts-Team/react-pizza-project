/**
 * Enhanced Assignment Page
 * 
 * A comprehensive page for assigning roles to users across different stores
 * with an intuitive multi-select interface and advanced filtering capabilities.
 */

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { useStores } from '../../features/stores/hooks/useStores';
import { useAssignmentOperations } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import type { BulkAssignUserRolesRequest, BulkAssignmentItem } from '../../features/userRolesStoresAssignment/types';
import { BulkPageHeader } from '../../components/userRolesStoresAssignment/assignPage/BulkPageHeader';
import { BulkProgressIndicator } from '../../components/userRolesStoresAssignment/assignPage/BulkProgressIndicator';
import { BulkSelectionSummary } from '../../components/userRolesStoresAssignment/assignPage/BulkSelectionSummary';
import { BulkUserSelectionTab } from '../../components/userRolesStoresAssignment/assignPage/BulkUserSelectionTab';
import { BulkRoleSelectionTab } from '../../components/userRolesStoresAssignment/assignPage/BulkRoleSelectionTab';
import { BulkStoreSelectionTab } from '../../components/userRolesStoresAssignment/assignPage/BulkStoreSelectionTab';
import { BulkAssignmentResult } from '../../components/userRolesStoresAssignment/assignPage/BulkAssignmentResult';
import {
  Users,
  Shield,
  Store,
} from 'lucide-react';

interface AssignmentData {
  selectedUsers: number[];
  selectedRoles: number[];
  selectedStores: string[];
}

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const AssignPage: React.FC = () => {
  // State for assignment data
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    selectedUsers: [],
    selectedRoles: [],
    selectedStores: [],
  });

  // State for search terms
  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');

  // State for filters
  const [userFilter, setUserFilter] = useState<'all' | 'with-roles' | 'without-roles'>('all');

  // State for assignment process
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch data using hooks
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsers();

  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
  } = useRoles();

  const {
    stores,
    loading: storesLoading,
    error: storesError,
  } = useStores();

  // Filter users based on local filters
  const displayUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    switch (userFilter) {
      case 'with-roles':
        filtered = filtered.filter(user => user.roles && user.roles.length > 0);
        break;
      case 'without-roles':
        filtered = filtered.filter(user => !user.roles || user.roles.length === 0);
        break;
    }

    return filtered;
  }, [users, userSearch, userFilter]);

  // Filter roles based on search
  const displayRoles = useMemo(() => {
    return roles.filter(role =>
      role.name.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [roles, roleSearch]);

  // Filter stores based on search
  const displayStores = useMemo(() => {
    return stores.filter(store =>
      store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      store.id.toLowerCase().includes(storeSearch.toLowerCase())
    );
  }, [stores, storeSearch]);



  // Assignment steps for progress tracking
  const assignmentSteps: AssignmentStep[] = [
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
  ];

  const completedSteps = assignmentSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / assignmentSteps.length) * 100;

  // Handler functions
  const handleUserToggle = (userId: number) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  const handleRoleToggle = (roleId: number) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId],
    }));
  };

  const handleStoreToggle = (storeId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.includes(storeId)
        ? prev.selectedStores.filter(id => id !== storeId)
        : [...prev.selectedStores, storeId],
    }));
  };

  const handleSelectAllUsers = () => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.length === displayUsers.length
        ? []
        : displayUsers.map(user => user.id),
    }));
  };

  const handleSelectAllRoles = () => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.length === displayRoles.length
        ? []
        : displayRoles.map(role => role.id),
    }));
  };

  const handleSelectAllStores = () => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.length === displayStores.length
        ? []
        : displayStores.map(store => store.id),
    }));
  };

  const handleClearSelection = () => {
    setAssignmentData({
      selectedUsers: [],
      selectedRoles: [],
      selectedStores: [],
    });
    setAssignmentResult(null);
  };

  // Get assignment operations hook
  const { bulkAssignUserRoles, isBulkAssigning, bulkAssignError } = useAssignmentOperations();

  const handleAssignment = async () => {
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
  };

  const canAssign = assignmentData.selectedUsers.length > 0 &&
                   assignmentData.selectedRoles.length > 0 &&
                   assignmentData.selectedStores.length > 0;

  // Use the hook's loading state for better consistency
  const isActuallyAssigning = isAssigning || isBulkAssigning;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Page Header */}
      <BulkPageHeader
        selectedUsersCount={assignmentData.selectedUsers.length}
        selectedRolesCount={assignmentData.selectedRoles.length}
        selectedStoresCount={assignmentData.selectedStores.length}
        canAssign={canAssign}
        isAssigning={isActuallyAssigning}
        showConfirmDialog={showConfirmDialog}
        onClearSelection={handleClearSelection}
        onConfirmAssignment={handleAssignment}
        setShowConfirmDialog={setShowConfirmDialog}
      />

      {/* Progress Indicator */}
      <BulkProgressIndicator
        assignmentSteps={assignmentSteps}
        completedSteps={completedSteps}
        progressPercentage={progressPercentage}
      />

      {/* Assignment Result */}
      {assignmentResult && (
        <BulkAssignmentResult result={assignmentResult} />
      )}

      {/* Selection Summary */}
      {(assignmentData.selectedUsers.length > 0 || assignmentData.selectedRoles.length > 0 || assignmentData.selectedStores.length > 0) && (
        <BulkSelectionSummary
          assignmentData={assignmentData}
          users={users}
          roles={roles}
          stores={stores}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-md">
          <TabsTrigger 
            value="users" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Users ({assignmentData.selectedUsers.length})</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Roles ({assignmentData.selectedRoles.length})</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stores" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Store className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Stores ({assignmentData.selectedStores.length})</span>
            <span className="sm:hidden">Stores</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <BulkUserSelectionTab
            users={users}
            displayUsers={displayUsers}
            selectedUserIds={assignmentData.selectedUsers}
            userSearch={userSearch}
            userFilter={userFilter}
            usersLoading={usersLoading}
            usersError={usersError}
            onUserToggle={handleUserToggle}
            onUserSearchChange={setUserSearch}
            onUserFilterChange={setUserFilter}
            onSelectAllUsers={handleSelectAllUsers}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <BulkRoleSelectionTab
            displayRoles={displayRoles}
            selectedRoleIds={assignmentData.selectedRoles}
            roleSearch={roleSearch}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            onRoleToggle={handleRoleToggle}
            onRoleSearchChange={setRoleSearch}
            onSelectAllRoles={handleSelectAllRoles}
            formatDate={formatDate}
          />
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <BulkStoreSelectionTab
            displayStores={displayStores}
            selectedStoreIds={assignmentData.selectedStores}
            storeSearch={storeSearch}
            storesLoading={storesLoading}
            storesError={storesError}
            onStoreToggle={(storeId: string) => handleStoreToggle(storeId)}
            onStoreSearchChange={setStoreSearch}
            onSelectAllStores={handleSelectAllStores}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignPage;