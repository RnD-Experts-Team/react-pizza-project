/**
 * Create User Page - Updated with Role-Permission Linking
 * 
 * When a role is checked, all its permissions are automatically checked and locked
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
import type { UserFormData } from '../../features/users/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser, loading, error, validateForm } = useCreateUser();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="container mx-auto py-8 px-4">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
            <p className="text-muted-foreground">
              Add a new user to the system
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={validationErrors.password ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={validationErrors.password_confirmation ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password_confirmation && (
                    <p className="text-sm text-red-500">{validationErrors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select roles - their permissions will be automatically included
              </p>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading roles...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-start space-x-3 space-y-0">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={checkedRoles.has(role.name)}
                        onCheckedChange={(checked) => 
                          handleRoleChange(role.name, checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`role-${role.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.name}
                        </Label>
                        {role.permissions && role.permissions.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Includes {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.roles && (
                <p className="text-sm text-red-500 mt-2">{validationErrors.roles}</p>
              )}
            </CardContent>
          </Card>

          {/* Direct Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Grant extra permissions not covered by roles (optional)
              </p>
            </CardHeader>
            <CardContent>
              {permissionsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading permissions...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {permissions.map((permission) => {
                    const isLocked = isPermissionLocked(permission.name);
                    const isChecked = allCheckedPermissions.has(permission.name);
                    
                    return (
                      <div key={permission.id} className="flex items-start space-x-3 space-y-0">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={isChecked}
                          disabled={isLocked}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.name, checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className={`text-sm font-medium leading-none ${
                              isLocked 
                                ? 'text-muted-foreground cursor-not-allowed' 
                                : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {permission.name}
                              {isLocked && (
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </Label>
                          {isLocked && (
                            <p className="text-xs text-muted-foreground">
                              Included by selected role(s)
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {validationErrors.permissions && (
                <p className="text-sm text-red-500 mt-2">{validationErrors.permissions}</p>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
