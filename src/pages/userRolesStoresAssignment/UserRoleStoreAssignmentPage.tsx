/**
 * User Role Store Assignment Page
 * 
 * This page displays tables of users and stores with search functionality
 * and assign roles buttons for managing user role store assignments.
 * Fully responsive design with CSS variables for light/dark mode compatibility.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useStores } from '../../features/stores/hooks/useStores';
import { Button } from '../../components/ui/button';
import { Users, ShoppingBag } from 'lucide-react';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import {
  UsersTable,
  StoresTable,
} from '../../components/userRolesStoresAssignment/userRoleStoreAssignmentPage';

export const UserRoleStoreAssignmentPage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch users and stores data
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { stores, loading: storesLoading, error: storesError } = useStores();

  const handleAssignUserRole = (userId: number) => {
    navigate(`/user-role-store-assignment/assign?userId=${userId}`);
  };

  const handleAssignStoreRole = (storeId: string) => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  };

  const handleAssignRoles = () => {
    // TODO: Implement assign roles functionality
    navigate(`/user-role-store-assignment/assign`);
  };

  const handleBulkAssign = () => {
    // TODO: Implement bulk assign functionality
    navigate(`/user-role-store-assignment/bulk`);
  };

  const handleViewUserAssignments = (userId: number) => {
    navigate(`/user-role-store-assignment/view/user/${userId}`);
  };

  const handleViewStoreAssignments = (storeId: string) => {
    navigate(`/user-role-store-assignment/view/store/${storeId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const mainButtons = (
    <Button 
      onClick={handleAssignRoles} 
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
    >
      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
      Assign Roles
    </Button>
  );

  const subButtons = (
    <Button 
      onClick={handleBulkAssign} 
      variant="outline" 
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
    >
      <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
      Bulk Assign
    </Button>
  );

  return (
    <ManageLayout
      title="User Role Store Assignment"
      subtitle="Manage user role assignments across different stores. Search and assign roles to users and stores."
      mainButtons={mainButtons}
      subButtons={subButtons}
    >

      <UsersTable
         users={users}
         loading={usersLoading}
         error={usersError}
         onAssignRole={handleAssignUserRole}
         onViewAssignments={handleViewUserAssignments}
       />

      <StoresTable
        stores={stores}
        loading={storesLoading}
        error={storesError}
        onAssignRole={handleAssignStoreRole}
        onViewAssignments={handleViewStoreAssignments}
        formatDate={formatDate}
      />
    </ManageLayout>
  );
};

export default UserRoleStoreAssignmentPage;