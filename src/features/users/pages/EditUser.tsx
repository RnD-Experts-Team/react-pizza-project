/**
 * Edit User Page - Complete unified component with paginated roles and permissions
 *
 * When a role is checked, all its permissions are automatically checked and locked
 * Fully responsive design with ManageLayout for consistent header and navigation
 * Features paginated role selection and permission selection with smooth navigation
 * FIXED: Maintains locked permissions across role pagination pages
 *
 * NEW: Uses React Hook Form with Zod validation, memoization, and performance optimizations
 * FIXED: TypeScript type errors with proper generic typing
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { useUpdateUser, useUser } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AlertCircle, Loader2 } from 'lucide-react';

// Import reusable components and utilities
import { BasicInfoSection } from '../components/CreateAndEditUser/BasicInfoSection';
import { RoleSelectionSection } from '../components/CreateAndEditUser/RoleSelectionSection';
import { PermissionSelectionSection } from '../components/CreateAndEditUser/PermissionSelectionSection';
import { useRolePermissionManager } from '../hooks/useRolePermissionManager';
import { usePagination } from '../hooks/usePagination';
import {
  editUserFormSchema,
  type EditUserFormType,
} from '../schemas/userFormSchemas';

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0', 10);

  // Fetch user data
  const { user, loading: userLoading, error: userError } = useUser(userId);
  const { updateUser, error: updateUserError } = useUpdateUser();

  // Form setup with React Hook Form
  const form = useForm<EditUserFormType>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      roles: [],
      permissions: [],
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Extract roles and permissions data from API hooks
  const rolesQuery = useRoles(true);
  const permissionsQuery = usePermissions(true);
  const roles = rolesQuery.roles || [];
  const permissions = permissionsQuery.permissions || [];
  const rolesLoading = rolesQuery.loading;
  const permissionsLoading = permissionsQuery.loading;

  // Role-permission management hook
  const rolePermissionManager = useRolePermissionManager({
    roles,
    permissions,
    initialSelectedRoles: [],
    initialSelectedPermissions: []
  });

  // Pagination hooks
  const rolePagination = usePagination({
    totalItems: roles.length,
    itemsPerPage: 8,
    initialPage: 1
  });
  const permissionPagination = usePagination({
    totalItems: permissions.length,
    itemsPerPage: 12,
    initialPage: 1
  });

  // UI state
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current page items from pagination hooks
  const currentRoles = rolePagination.getCurrentPageItems(roles);
  const currentPermissions = permissionPagination.getCurrentPageItems(permissions);

  // Sync form values with role-permission manager
  useEffect(() => {
    if (isInitialized) {
      setValue('roles', Array.from(rolePermissionManager.selectedRoles));
      setValue(
        'permissions',
        Array.from(rolePermissionManager.selectedPermissions),
      );
    }
  }, [
    rolePermissionManager.selectedRoles,
    rolePermissionManager.selectedPermissions,
    isInitialized,
    setValue,
  ]);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user && !isInitialized) {
      // Use React Hook Form's setValue to initialize form data
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('password', '');
      setValue('password_confirmation', '');

      // Initialize role-permission manager with user's current selections
      const userRoleNames = user.roles?.map((role) => role.name) || [];
      const userPermissionNames =
        user.permissions?.map((perm) => perm.name) || [];

      // Set initial selections in role-permission manager
      userRoleNames.forEach((roleName) => {
        rolePermissionManager.handleRoleChange(roleName, true);
      });

      // Set manual permissions (those not from roles)
      const rolePermissions = new Set<string>();
      user.roles?.forEach((role) => {
        role.permissions?.forEach((perm) => {
          rolePermissions.add(perm.name);
        });
      });

      userPermissionNames.forEach((permName) => {
        if (!rolePermissions.has(permName)) {
          rolePermissionManager.handlePermissionChange(permName, true);
        }
      });

      setIsInitialized(true);
    }
  }, [user, isInitialized, setValue, rolePermissionManager]);



  // Form submit handler using React Hook Form
  const onSubmit: SubmitHandler<EditUserFormType> = async (data) => {
    // Prepare update data - exclude password fields if empty
    const updateData: any = {
      name: data.name,
      email: data.email,
      roles: data.roles,
      permissions: data.permissions,
    };

    // Only include password if provided
    if (data.password && data.password.trim() !== '') {
      updateData.password = data.password;
      updateData.password_confirmation = data.password_confirmation;
    }

    try {
      await updateUser(userId, updateData);
      // Success - navigate back to users list
      navigate('/user-management');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <ManageLayout
        title="Edit User"
        subtitle="Update user information and permissions"
        backButton={{ show: true }}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3 text-muted-foreground" />
          <span className="text-lg text-muted-foreground">Loading user...</span>
        </div>
      </ManageLayout>
    );
  }

  // Show error if user not found or error occurred
  if (userError || !user) {
    return (
      <ManageLayout
        title="Edit User"
        subtitle="Update user information and permissions"
        backButton={{ show: true }}
      >
        <Alert className="mb-6 border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {userError || 'User not found'}
          </AlertDescription>
        </Alert>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title="Edit User"
      subtitle="Update user information and permissions"
      backButton={{
        show: true,
      }}
    >
      {/* Error Alert */}
      {updateUserError && (
        <Alert className="mb-6 border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {updateUserError}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8 max-w-full"
        >
        {/* Basic Information */}
        <BasicInfoSection
          form={form}
          isEditMode={true}
          showPasswordFields={true}
        />

        {/* Role Selection with Pagination */}
        <RoleSelectionSection
          roles={currentRoles}
          isLoading={rolesLoading}
          selectedRoles={rolePermissionManager.selectedRoles}
          onRoleChange={rolePermissionManager.handleRoleChange}
          paginationInfo={rolePagination.paginationInfo}
          onPageChange={rolePagination.handlePageChange}
        />

        {/* Permission Selection with Pagination */}
        <PermissionSelectionSection
          permissions={currentPermissions}
          isLoading={permissionsLoading}
          selectedPermissions={rolePermissionManager.selectedPermissions}
          roleBasedPermissions={rolePermissionManager.roleBasedPermissions}
          onPermissionChange={rolePermissionManager.handlePermissionChange}
          paginationInfo={permissionPagination.paginationInfo}
          onPageChange={permissionPagination.handlePageChange}
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 px-4 sm:px-2 lg:px-0 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/user-management')}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 border-border bg-background text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              rolesLoading ||
              permissionsLoading ||
              !isInitialized
            }
            className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg bg-primary text-primary-foreground border-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary-foreground" />
                <span className="text-sm sm:text-base">Updating...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base">Update User</span>
            )}
          </Button>
        </div>
        </form>
      </Form>
    </ManageLayout>
  );
};

export default EditUserPage;
