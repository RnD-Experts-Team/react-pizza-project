/**
 * Assign Permissions Page - Role-based Permission Assignment
 *
 * This page allows administrators to assign permissions to roles.
 * When permissions are assigned to a role, all users with that role automatically inherit those permissions.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';
import { ManageLayout } from '@/components/layouts/ManageLayout';

// Custom hook
import { useAssignPermissionsForm } from '@/features/roles/hooks/useAssignPermissionsForm';

// Components
import {
  SuccessAlert,
  ErrorAlert,
} from '@/features/roles/components/AssignPermissions/AlertComponents';
import { RoleSelector } from '@/features/roles/components/AssignPermissions/RoleSelector';
import { PermissionsList } from '@/features/roles/components/AssignPermissions/PermissionsList';
import { FormActions } from '@/features/roles/components/AssignPermissions/FormActions';

const AssignPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading: rolesLoading } = useRoles();
  const { permissions, loading: permissionsLoading } = usePermissions();

  const form = useAssignPermissionsForm({
    roles,
    permissions,
    onSuccess: () => {
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);
    },
  });

  const handleBack = () => {
    navigate('/user-management');
  };

  return (
    <ManageLayout
      title="Assign Permissions"
      subtitle="Assign permissions to roles - users with these roles will inherit the permissions"
      backButton={{
        show: true,
      }}
    >
      <SuccessAlert message={form.successMessage} />
      <ErrorAlert error={form.assignError} />

      <form onSubmit={form.handleSubmit} className="space-y-4 sm:space-y-6">
        <RoleSelector
          roles={roles}
          selectedRoleId={form.selectedRoleId}
          selectedRole={form.selectedRole}
          currentRolePermissions={form.currentRolePermissions as Set<string>}
          rolesLoading={rolesLoading}
          formErrors={form.formErrors}
          onRoleChange={form.handleRoleChange}
        />

        <PermissionsList
          selectedRole={form.selectedRole}
          availablePermissions={form.availablePermissions}
          selectedPermissions={form.selectedPermissions}
          permissionsLoading={permissionsLoading}
          formErrors={form.formErrors}
          onPermissionChange={form.handlePermissionChange}
          onSelectAll={form.handleSelectAll}
          onClearAll={form.handleClearAll}
        />

        <FormActions
          isSubmitting={form.isSubmitting}
          assignLoading={form.assignLoading}
          selectedRole={form.selectedRole}
          selectedPermissionsCount={form.selectedPermissions.size}
          onCancel={handleBack}
        />
      </form>
    </ManageLayout>
  );
};

export default AssignPermissionsPage;
