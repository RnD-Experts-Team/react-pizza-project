/**
 * Single Assignment Page
 * 
 * A page for assigning a single role to a user for a specific store
 * with radio button selection for single choice interface.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { useStores } from '../../features/stores/hooks/useStores';
import { useAssignmentOperations } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import type { AssignUserRoleRequest } from '../../features/userRolesStoresAssignment/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Users, Shield, Store } from 'lucide-react';

// Import extracted components
import { PageHeader } from '../../components/userRolesStoresAssignment/singleAssignPage/PageHeader';
import { ProgressIndicator } from '../../components/userRolesStoresAssignment/singleAssignPage/ProgressIndicator';
import { AssignmentResult } from '../../components/userRolesStoresAssignment/singleAssignPage/AssignmentResult';
import { SelectionSummary } from '../../components/userRolesStoresAssignment/singleAssignPage/SelectionSummary';
import { UserSelectionTab } from '../../components/userRolesStoresAssignment/singleAssignPage/UserSelectionTab';
import { RoleSelectionTab } from '../../components/userRolesStoresAssignment/singleAssignPage/RoleSelectionTab';
import { StoreSelectionTab } from '../../components/userRolesStoresAssignment/singleAssignPage/StoreSelectionTab';

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
  const navigate = useNavigate();
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

  // State for search terms
  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');

  // State for filters
  const [userFilter, setUserFilter] = useState<'all' | 'with-roles' | 'without-roles'>('all');
  const [storeFilter, setStoreFilter] = useState<'all' | 'active' | 'inactive'>('all');

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

  // Get assignment operations hook
  const { assignUserRole, assignError } = useAssignmentOperations();

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

  // Filter stores based on search and status
  const displayStores = useMemo(() => {
    let filtered = stores.filter(store =>
      store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      store.id.toLowerCase().includes(storeSearch.toLowerCase())
    );

    switch (storeFilter) {
      case 'active':
        filtered = filtered.filter(store => store.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter(store => !store.is_active);
        break;
    }

    return filtered;
  }, [stores, storeSearch, storeFilter]);

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

  // Use the hook's loading state for better consistency
  // const isActuallyAssigning = isAssigning || isAssigningHook;

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

  const handleGoBack = () => {
    navigate('/user-role-store-assignment');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <PageHeader
          onGoBack={handleGoBack}
          onClearSelection={handleClearSelection}
          onConfirmAssignment={handleAssignment}
          canAssign={canAssign}
          isAssigning={isAssigning}
          showConfirmDialog={showConfirmDialog}
          setShowConfirmDialog={setShowConfirmDialog}
        />

      <div className="flex flex-col space-y-4 sm:space-y-6">

        <ProgressIndicator
          assignmentSteps={assignmentSteps}
          completedSteps={completedSteps}
          progressPercentage={progressPercentage}
        />

        {assignmentResult && (
          <AssignmentResult result={assignmentResult} />
        )}
      </div>

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
            users={users}
            displayUsers={displayUsers}
            selectedUserId={assignmentData.selectedUser}
            userSearch={userSearch}
            userFilter={userFilter}
            usersLoading={usersLoading}
            usersError={usersError}
            onUserSelect={handleUserSelect}
            onUserSearchChange={setUserSearch}
            onUserFilterChange={setUserFilter}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4 sm:space-y-6">
          <RoleSelectionTab
            displayRoles={displayRoles}
            selectedRoleId={assignmentData.selectedRole}
            roleSearch={roleSearch}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            onRoleSelect={handleRoleSelect}
            onRoleSearchChange={setRoleSearch}
            formatDate={formatDate}
          />
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" className="space-y-4 sm:space-y-6">
          <StoreSelectionTab
            displayStores={displayStores}
            selectedStoreId={assignmentData.selectedStore}
            storeSearch={storeSearch}
            storeFilter={storeFilter}
            storesLoading={storesLoading}
            storesError={storesError}
            onStoreSelect={handleStoreSelect}
            onStoreSearchChange={setStoreSearch}
            onStoreFilterChange={setStoreFilter}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SingleAssignPage;