/**
 * Create Role Page
 * 
 * Complete form for creating a new role with permissions using React Hook Form
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRole } from '@/features/roles/hooks/useRoles';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';
import { GUARD_NAMES } from '@/features/roles/types';
import type { CreateRoleRequest } from '@/features/roles/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { PermissionsSection } from '@/features/roles/components/CreateRole/PermissionsSection';

// Validation schema
const createRoleSchema = z.object({
  name: z.string()
    .min(1, 'Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Role name can only contain letters, numbers, spaces, hyphens, and underscores'),
  guard_name: z.nativeEnum(GUARD_NAMES),
  permissions: z.array(z.string()).min(1, 'At least one permission must be selected'),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

const CreateRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { createRole, loading, error } = useCreateRole();
  const { permissions, loading: permissionsLoading } = usePermissions();
  
  // Form setup with React Hook Form
  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isSubmitting },
 
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      guard_name: GUARD_NAMES.WEB,
      permissions: [],
    },
    mode: 'onChange', // Validate on change for better UX
  });


  const handleBack = () => {
    navigate('/user-management');
  };

  const onSubmit = async (data: CreateRoleFormData) => {
    try {
      const roleData: CreateRoleRequest = {
        name: data.name.trim(),
        guard_name: data.guard_name,
        permissions: data.permissions,
      };

      await createRole(roleData);
      
      // Success - navigate back to users page
      navigate('/user-management');
    } catch (err) {
      console.error('Failed to create role:', err);
      // Error is handled by the useCreateRole hook
    }
  };

  return (
    <ManageLayout
      title="Create Role"
      subtitle="Add a new role to the system"
      backButton={{
        show: true,
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Role Name *</Label>
                <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Enter role name (e.g., Manager, Editor)"
                  className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${
                    errors.name ? 'border-destructive focus:ring-destructive' : 'focus:ring-ring'
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Section */}
        <Controller
          name="permissions"
          control={control}
          render={({ field: { value, onChange } }) => (
            <PermissionsSection
              permissions={permissions}
              selectedPermissions={value}
              onPermissionChange={onChange}
              loading={permissionsLoading}
              validationError={errors.permissions?.message}
            />
          )}
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full sm:w-auto min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Role'
            )}
          </Button>
        </div>
      </form>
    </ManageLayout>
  );
};

export default CreateRolePage;
