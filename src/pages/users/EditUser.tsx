/**
 * Edit User Page - Updated with Role-Permission Linking
 * 
 * When a role is checked, all its permissions are automatically checked and locked
 * Refactored for consistent color variables and comprehensive responsiveness
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, useUpdateUser } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
// ADDED: Import useAuth hook for manual profile refresh
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { UserFormData } from '../../features/users/types';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoadingState from '../../components/users/editUser/LoadingState';
import ErrorState from '../../components/users/editUser/ErrorState';
import PageHeader from '../../components/users/editUser/PageHeader';
import BasicInformationSection from '../../components/users/editUser/BasicInformationSection';
import PasswordSection from '../../components/users/editUser/PasswordSection';
import RolesSection from '../../components/users/editUser/RolesSection';
import PermissionsSection from '../../components/users/editUser/PermissionsSection';
import ActionButtons from '../../components/users/editUser/ActionButtons';

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : undefined;
  
  const { user, loading: userLoading, error: userError } = useUser(userId);
  const { updateUser, error, validateForm } = useUpdateUser();
  const { roles, loading: rolesLoading } = useRoles();
  const { permissions, loading: permissionsLoading } = usePermissions();
  // ADDED: Get getUserProfile function and current user for manual profile refresh
  const { getUserProfile, user: currentUser } = useAuth();
  
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includePassword, setIncludePassword] = useState(false);

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

  // Initialize form data when user loads
  useEffect(() => {
    if (user && roles.length > 0) {
      const userRoles = new Set(user.roles?.map(role => role.name) || []);
      const userDirectPermissions = new Set(user.permissions?.map(permission => permission.name) || []);
      
      // Calculate which permissions are manual (not from roles)
      const rolePermissions = new Set<string>();
      userRoles.forEach(roleName => {
        const role = roles.find(r => r.name === roleName);
        if (role?.permissions) {
          role.permissions.forEach(p => rolePermissions.add(p.name));
        }
      });
      
      const manualPerms = new Set<string>();
      userDirectPermissions.forEach(permName => {
        if (!rolePermissions.has(permName)) {
          manualPerms.add(permName);
        }
      });
      
      setCheckedRoles(userRoles);
      setManualPermissions(manualPerms);
      
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: Array.from(userRoles),
        permissions: Array.from(userDirectPermissions),
      });
    }
  }, [user, roles]);

  // Sync form data when checked states change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      roles: Array.from(checkedRoles),
      permissions: Array.from(allCheckedPermissions),
    }));
  }, [checkedRoles, allCheckedPermissions]);

  const handleBack = () => {
    navigate('/user-management');
  };

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
    
    if (!userId) return;

    // Client-side validation
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        roles: formData.roles,
        permissions: formData.permissions,
      };

      // Only include password if user wants to change it
      if (includePassword && formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      await updateUser(userId, updateData);
      
      // ADDED: Manual refresh of user profile to update permissions in real-time
      // Only refresh if the updated user is the current user
      if (currentUser && currentUser.id === userId) {
        getUserProfile();
      }
      
      // Success - navigate back to users list
      navigate('/user-management');
    } catch (err) {
      console.error('Failed to update user:', err);
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

  if (userLoading) {
    return <LoadingState />;
  }

  if (userError || !user) {
    return <ErrorState error={userError || 'User not found'} onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 lg:py-10 xl:py-12">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        <PageHeader userName={user.name} onBack={handleBack} />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <BasicInformationSection
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
          />

          <PasswordSection
            formData={formData}
            includePassword={includePassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
            onIncludePasswordChange={(checked) => {
              setIncludePassword(checked as boolean);
              if (!checked) {
                setFormData(prev => ({
                  ...prev,
                  password: '',
                  password_confirmation: '',
                }));
              }
            }}
            onShowPasswordToggle={() => setShowPassword(!showPassword)}
            onShowConfirmPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <RolesSection
            roles={roles}
            rolesLoading={rolesLoading}
            checkedRoles={checkedRoles}
            validationErrors={validationErrors}
            onRoleChange={handleRoleChange}
          />

          <PermissionsSection
            permissions={permissions}
            permissionsLoading={permissionsLoading}
            allCheckedPermissions={allCheckedPermissions}
            validationErrors={validationErrors}
            onPermissionChange={handlePermissionChange}
            isPermissionLocked={isPermissionLocked}
          />

          <ActionButtons
            isSubmitting={isSubmitting}
            onCancel={handleBack}
          />
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
