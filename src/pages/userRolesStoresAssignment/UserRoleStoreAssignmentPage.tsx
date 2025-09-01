/**
 * User Role Store Assignment Page
 * 
 * This page displays tables of users and stores with search functionality
 * and assign roles buttons for managing user role store assignments.
 * Fully responsive design with CSS variables for light/dark mode compatibility.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useStores } from '../../features/stores/hooks/useStores';
import { Separator } from '../../components/ui/separator';
import {
  PageHeader,
  ActionButtons,
  UsersTable,
  StoresTable,
} from '../../components/userRolesStoresAssignment/userRoleStoreAssignmentPage';

export const UserRoleStoreAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Local state for search terms
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [storeSearchTerm, setStoreSearchTerm] = useState('');

  // Fetch users and stores data
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { stores, loading: storesLoading, error: storesError } = useStores();

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Filter stores based on search term
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
    store.id.toLowerCase().includes(storeSearchTerm.toLowerCase())
  );

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <PageHeader />
      
      <ActionButtons 
        onAssignRoles={handleAssignRoles}
        onBulkAssign={handleBulkAssign}
      />

      <Separator />

      <UsersTable
         users={filteredUsers}
         loading={usersLoading}
         error={usersError}
         userSearchTerm={userSearchTerm}
         onSearchChange={setUserSearchTerm}
         onAssignRole={handleAssignUserRole}
         onViewAssignments={handleViewUserAssignments}
         formatDate={formatDate}
       />

      <StoresTable
        stores={filteredStores}
        loading={storesLoading}
        error={storesError}
        searchTerm={storeSearchTerm}
        onSearchChange={setStoreSearchTerm}
        onAssignRole={handleAssignStoreRole}
        onViewAssignments={handleViewStoreAssignments}
        formatDate={formatDate}
      />
    </div>
  );
};

export default UserRoleStoreAssignmentPage;