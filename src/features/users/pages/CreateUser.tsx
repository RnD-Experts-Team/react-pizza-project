/**
 * Create User Page - Refactored with smaller components
 * 
 * When a role is checked, all its permissions are automatically checked and locked
 * Fully responsive design with ManageLayout for consistent header and navigation
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { useCreateUser } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';
import type { UserFormData } from '@/features/users/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  BasicInformation,
  RoleSelection,
  PermissionSelection,
  FormActions
} from '@/features/users/components/createUser';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser, error, validateForm } = useCreateUser();
  const { roles, loading: rolesLoading } = useRoles();
  const { permissions, loading: permissionsLoading } = usePermissions();
  
  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
    permissions: [],
  });
  
  // Role-Permission linking state
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [manualPermissions, setManualPermissions] = useState<Set<string>>(new Set());
  
  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Calculate all permissions that should be checked (from roles + manual)
  const allCheckedPermissions = useMemo(() => {
    const rolePermissions = new Set<string>();
    
    // Add permissions from checked roles
    checkedRoles.forEach(roleName => {
      const role = roles.find(r => r.name === roleName);
      if (role?.permissions) {
        role.permissions.forEach(p => rolePermissions.add(p.name));
      }
    });
    
    // Add manual permissions
    manualPermissions.forEach(p => rolePermissions.add(p));
    
    return rolePermissions;
  }, [checkedRoles, manualPermissions, roles]);

  // Check if a permission is locked by a role
  const isPermissionLocked = (permissionName: string): boolean => {
    return Array.from(checkedRoles).some(roleName => {
      const role = roles.find(r => r.name === roleName);
      return role?.permissions?.some(p => p.name === permissionName) || false;
    });
  };

  // Sync form data when checked states change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      roles: Array.from(checkedRoles),
      permissions: Array.from(allCheckedPermissions),
    }));
  }, [checkedRoles, allCheckedPermissions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (roleName: string, checked: boolean) => {
    setCheckedRoles(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(roleName);
      } else {
        newSet.delete(roleName);
        
        // Remove permissions that were only from this role
        const role = roles.find(r => r.name === roleName);
        if (role?.permissions) {
          setManualPermissions(prevManual => {
            const newManual = new Set(prevManual);
            role.permissions!.forEach(p => {
              // Only remove if it's not controlled by another checked role
              const stillControlledByOtherRole = Array.from(newSet).some(otherRoleName => {
                const otherRole = roles.find(r => r.name === otherRoleName);
                return otherRole?.permissions?.some(op => op.name === p.name) || false;
              });
              if (!stillControlledByOtherRole) {
                newManual.delete(p.name);
              }
            });
            return newManual;
          });
        }
      }
      return newSet;
    });
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    // Don't allow unchecking if permission is locked by a role
    if (isPermissionLocked(permissionName) && !checked) {
      return;
    }
    
    // Don't allow manual checking if already controlled by a role
    if (isPermissionLocked(permissionName) && checked) {
      return;
    }

    setManualPermissions(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(permissionName);
      } else {
        newSet.delete(permissionName);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password!,
        password_confirmation: formData.password_confirmation!,
        roles: formData.roles,
        permissions: formData.permissions,
      });
      
      // Success - navigate back to users list
      navigate('/user-management');
    } catch (err) {
      console.error('Failed to create user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear validation errors when form data changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [formData]);

  return (
    <ManageLayout
      title="Create New User"
      subtitle="Add a new user to the system with roles and permissions"
      backButton={{
        show: true,
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert className="mb-6" style={{ borderColor: 'var(--destructive)', backgroundColor: 'var(--destructive/10)' }}>
          <AlertCircle className="h-4 w-4" style={{ color: 'var(--destructive)' }} />
          <AlertDescription style={{ color: 'var(--destructive)' }}>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-full  ">
          <BasicInformation
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
          />

          <RoleSelection
            roles={roles}
            loading={rolesLoading}
            checkedRoles={checkedRoles}
            onRoleChange={handleRoleChange}
            validationErrors={validationErrors}
          />

          <PermissionSelection
            permissions={permissions}
            loading={permissionsLoading}
            checkedPermissions={allCheckedPermissions}
            isPermissionLocked={isPermissionLocked}
            onPermissionChange={handlePermissionChange}
          />

          <FormActions
            isSubmitting={isSubmitting}
            loading={rolesLoading || permissionsLoading}
            onCancel={() => navigate('/user-management')}
          />
      </form>
    </ManageLayout>
  );
};

export default CreateUserPage;