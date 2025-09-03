/**
 * User Role Store Assignment Page
 * 
 * This page displays tables of users and stores with search functionality
 * and assign roles buttons for managing user role store assignments.
 * Fully responsive design with CSS variables for light/dark mode compatibility.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, ShoppingBag } from 'lucide-react';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import {
  UsersTable,
  StoresTable,
} from '@/features/userRolesStoresAssignment/components/userRoleStoreAssignmentPage';

export const UserRoleStoreAssignmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAssignRoles = () => {
    navigate(`/user-role-store-assignment/assign`);
  };

  const handleBulkAssign = () => {
    navigate(`/user-role-store-assignment/bulk`);
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
      <UsersTable />
      <StoresTable />
    </ManageLayout>
  );
};

export default UserRoleStoreAssignmentPage;
