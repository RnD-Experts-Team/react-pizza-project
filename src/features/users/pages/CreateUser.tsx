/**
 * Create User Page - Complete unified component with paginated roles and permissions
 *
 * When a role is checked, all its permissions are automatically checked and locked
 * Fully responsive design with ManageLayout for consistent header and navigation
 * Features paginated role selection and permission selection with smooth navigation
 * FIXED: Maintains locked permissions across role pagination pages
 *
 * NEW: Uses React Hook Form with Zod validation, memoization, and performance optimizations
 * FIXED: TypeScript type errors with proper generic typing
 */
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { useCreateUser } from '@/features/users/hooks/useUsers';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import {
  BasicInfoSection,
  RoleSelectionSection,
  PermissionSelectionSection,
} from '../components/CreateAndEditUser';
import { useRolePermissionManager, usePagination } from '../hooks';
import { createUserFormSchema } from '../schemas/userFormSchemas';
import type {
  CreateUserFormType,
  Role,
  Permission,
} from '../schemas/userFormSchemas';

// Import roles and permissions hooks
import { useRoles } from '@/features/roles/hooks/useRoles';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';

const CreateUserPage: React.FC = () => {
    const navigate = useNavigate();
    const createUserMutation = useCreateUser();
    const {
      roles: rolesData,
      loading: rolesLoading,
    } = useRoles();
    const {
      permissions: permissionsData,
      loading: permissionsLoading,
    } = usePermissions();

  // Form setup with proper typing
  const form = useForm<CreateUserFormType>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      roles: [],
      permissions: [],
    },
  });

  // Extract roles and permissions from API data
    const roles: Role[] = rolesData || [];
    const permissions: Permission[] = permissionsData || [];

  // Role and permission management
  const {
    selectedRoles,
    selectedPermissions,
    handleRoleChange,
    handlePermissionChange,
    roleBasedPermissions,
  } = useRolePermissionManager({
    roles,
    permissions,
    initialSelectedRoles: form.watch('roles'),
    initialSelectedPermissions: form.watch('permissions'),
  });

  // Pagination for roles and permissions
  const itemsPerPage = 6;
  const rolePagination = usePagination({
    totalItems: roles.length,
    itemsPerPage,
    initialPage: 1,
  });

  const permissionPagination = usePagination({
    totalItems: permissions.length,
    itemsPerPage,
    initialPage: 1,
  });

  // Sync form values with role-permission manager
  React.useEffect(() => {
    form.setValue('roles', selectedRoles);
    form.setValue('permissions', selectedPermissions);
  }, [selectedRoles, selectedPermissions, form]);

  // Get current page items
  const currentRoles = rolePagination.getCurrentPageItems(roles);
  const currentPermissions =
    permissionPagination.getCurrentPageItems(permissions);

  // Form submission handler
  const onSubmit: SubmitHandler<CreateUserFormType> = useCallback(
    async (data) => {
      try {
        await createUserMutation.createUser({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          roles: data.roles,
          permissions: data.permissions,
        });
        navigate('/user-management');
      } catch (error) {
        console.error('Failed to create user:', error);
      }
    },
    [createUserMutation, navigate],
  );

  // Cancel handler
  const handleCancel = useCallback(() => {
    navigate('/user-management');
  }, [navigate]);

  return (
    <ManageLayout
      title="Create New User"
      subtitle="Add a new user to the system with roles and permissions"
      backButton={{
        show: true,
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8 max-w-full"
        >
          <BasicInfoSection
            form={form}
            isEditMode={false}
            showPasswordFields={true}
          />

          <RoleSelectionSection
            roles={currentRoles}
            selectedRoles={selectedRoles}
            onRoleChange={handleRoleChange}
            isLoading={rolesLoading}
            paginationInfo={rolePagination.paginationInfo}
            onPageChange={rolePagination.handlePageChange}
          />

          <PermissionSelectionSection
            permissions={currentPermissions}
            selectedPermissions={selectedPermissions}
            roleBasedPermissions={roleBasedPermissions}
            onPermissionChange={handlePermissionChange}
            isLoading={permissionsLoading}
            paginationInfo={permissionPagination.paginationInfo}
            onPageChange={permissionPagination.handlePageChange}
          />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 px-4 sm:px-2 lg:px-0 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={form.formState.isSubmitting}
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 border-border bg-background text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                rolesLoading ||
                permissionsLoading
              }
              className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg bg-primary text-primary-foreground border-primary"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary-foreground" />
                  <span className="text-sm sm:text-base">Creating...</span>
                </>
              ) : (
                <span className="text-sm sm:text-base">Create User</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ManageLayout>
  );
};

export default CreateUserPage;
