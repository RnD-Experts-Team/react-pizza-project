/**
 * User Management Page
 * 
 * This page displays three main sections:
 * 1. Users table with actions (view, update, delete) and create button
 * 2. Roles table with actions (assign permissions) and create button  
 * 3. Permissions table (display only)
 * 
 * Each section is a separate component for maintainability.
 */

import React from 'react';
import { UsersTable } from '../../components/users/UsersTable';
import { RolesTable } from '../../components/roles/RolesTable';
import { PermissionsTable } from '../../components/permissions/PermissionsTable';

const UserManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions for your application.
        </p>
      </div>

      {/* Users Section */}
      <div className="space-y-4">
        <UsersTable />
      </div>

      {/* Roles Section */}
      <div className="space-y-4">
        <RolesTable />
      </div>

      {/* Permissions Section */}
      <div className="space-y-4">
        <PermissionsTable />
      </div>
    </div>
  );
};

export default UserManagementPage;
