import { useState, useEffect, useMemo } from 'react';
import { useAssignPermissions } from '@/features/roles/hooks/useRoles';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface FormErrors {
  role?: string;
  permissions?: string;
  network?: string;
  validation?: Record<string, string>;
}

interface UseAssignPermissionsFormProps {
  roles: any[];
  permissions: any[];
  onSuccess?: () => void;
}

export const useAssignPermissionsForm = ({
  roles,
  permissions,
  onSuccess,
}: UseAssignPermissionsFormProps) => {
  const {
    assignPermissions,
    loading: assignLoading,
    error: assignError,
    reset,
  } = useAssignPermissions();
  const { getUserProfile } = useAuth();

  // Form state
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Computed values
  const selectedRole = useMemo(() => {
    if (!selectedRoleId) return null;
    return roles.find((role) => role.id.toString() === selectedRoleId) || null;
  }, [selectedRoleId, roles]);

  const currentRolePermissions = useMemo(() => {
    if (!selectedRole?.permissions) return new Set<string>();
    return new Set(
      selectedRole.permissions.map((p: { name: string }) => p.name),
    );
  }, [selectedRole]);

  const availablePermissions = useMemo(() => {
    return permissions.filter(
      (permission) => !currentRolePermissions.has(permission.name),
    );
  }, [permissions, currentRolePermissions]);

  // Reset form when role changes
  useEffect(() => {
    setSelectedPermissions(new Set());
    setFormErrors({});
    setSuccessMessage('');
    reset();
  }, [selectedRoleId, reset]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(permissionName);
      } else {
        newSet.delete(permissionName);
      }
      return newSet;
    });

    // Clear validation error for permissions
    if (formErrors.permissions) {
      setFormErrors((prev) => ({ ...prev, permissions: '' }));
    }
  };

  const handleSelectAll = () => {
    const allAvailablePermissions = new Set(
      availablePermissions.map((p) => p.name),
    );
    setSelectedPermissions(allAvailablePermissions);
  };

  const handleClearAll = () => {
    setSelectedPermissions(new Set());
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!selectedRoleId) {
      errors.role = 'Please select a role';
    }

    if (selectedPermissions.size === 0) {
      errors.permissions = 'Please select at least one permission to assign';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await assignPermissions(
        parseInt(selectedRoleId),
        Array.from(selectedPermissions),
      );

      // Success
      setSuccessMessage(
        `Successfully assigned ${selectedPermissions.size} permission(s) to ${selectedRole?.name}`,
      );
      setSelectedPermissions(new Set());

      // Manual refresh of user profile to update permissions in real-time
      getUserProfile();

      // Call success callback
      onSuccess?.();
    } catch (err: any) {
      console.error('Failed to assign permissions:', err);

      // Enhanced error handling
      if (err.response?.status === 403) {
        setFormErrors({
          permissions: 'Insufficient permissions to assign these roles',
        });
      } else if (err.response?.status === 422) {
        setFormErrors({ validation: err.response.data.errors || {} });
      } else {
        setFormErrors({ network: 'Network error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    selectedRoleId,
    selectedPermissions,
    isSubmitting,
    formErrors,
    successMessage,

    // Computed values
    selectedRole,
    currentRolePermissions,
    availablePermissions,

    // Loading states
    assignLoading,
    assignError,

    // Handlers
    handleRoleChange,
    handlePermissionChange,
    handleSelectAll,
    handleClearAll,
    handleSubmit,
    validateForm,
  };
};
