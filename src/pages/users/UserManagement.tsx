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
import { ManageLayout } from '../../components/layouts/ManageLayout';
import { UsersTable } from '../../components/users/UsersTable';
import { RolesTable } from '../../components/roles/RolesTable';
import { PermissionsTable } from '../../components/permissions/PermissionsTable';

const UserManagementPage: React.FC = () => {
  return (
    <ManageLayout
      title="User Management"
      subtitle="Manage users, roles, and permissions for your application."
    >
      {/* Content Grid - Responsive Layout */}
      <div className="grid gap-6 sm:gap-8 lg:gap-10">
          {/* Users Section */}
          <section 
            className="rounded-lg border p-4 sm:p-6 lg:p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="mb-4 sm:mb-6">
              <h2 
                className="font-semibold mb-2"
                style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                  color: 'var(--card-foreground)'
                }}
              >
                Users
              </h2>
              <p 
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: 'var(--muted-foreground)'
                }}
              >
                Manage user accounts and their basic information
              </p>
            </div>
            <UsersTable />
          </section>

          {/* Roles Section */}
          <section 
            className="rounded-lg border p-4 sm:p-6 lg:p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="mb-4 sm:mb-6">
              <h2 
                className="font-semibold mb-2"
                style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                  color: 'var(--card-foreground)'
                }}
              >
                Roles
              </h2>
              <p 
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: 'var(--muted-foreground)'
                }}
              >
                Define roles and assign permissions to control access
              </p>
            </div>
            <RolesTable />
          </section>

          {/* Permissions Section */}
          <section 
            className="rounded-lg border p-4 sm:p-6 lg:p-8"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="mb-4 sm:mb-6">
              <h2 
                className="font-semibold mb-2"
                style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                  color: 'var(--card-foreground)'
                }}
              >
                Permissions
              </h2>
              <p 
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: 'var(--muted-foreground)'
                }}
              >
                View all available permissions in the system
              </p>
            </div>
            <PermissionsTable />
          </section>
      </div>
    </ManageLayout>
  );
};

export default UserManagementPage;
