/**
 * User Management Page
 *
 * This page displays three main sections:
 * 1. Users table with actions (view, update, delete) and create button
 * 2. Roles table with actions (assign permissions) and create button
 * 3. Permissions table (display only)
 *
 * Each section is a separate component for maintainability.
 *
 * Features:
 * - Fully responsive design with mobile-first approach
 * - Uses ManageLayout for consistent header and navigation
 * - Supports light/dark mode seamlessly
 * - Optimized layouts for small, medium, and large screens
 */

import React from 'react';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { UsersTable } from '@/features/users/components/UsersTable/UsersTable';
import { RolesTable } from '@/features/roles/components/RoleTable/RolesTable';
import { PermissionsTable } from '@/features/permissions/components/PermissionsTable/PermissionsTable';

const UserManagementPage: React.FC = () => {
  return (
    <ManageLayout
      title="User Management"
      subtitle="Manage users, roles, and permissions for your application."
    >
      {/* Content Grid - Responsive Layout */}
      <div className="grid gap-6 sm:gap-8 lg:gap-10">
        {/* Users Section */}
        <UsersTable />

        {/* Roles Section */}
        <RolesTable />

        {/* Permissions Section */}
        <PermissionsTable />
      </div>
    </ManageLayout>
  );
};

export default UserManagementPage;
