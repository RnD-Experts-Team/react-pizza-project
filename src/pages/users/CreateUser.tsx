/**
 * Create User Page - Updated with Role-Permission Linking
 * 
 * When a role is checked, all its permissions are automatically checked and locked
 * Fully responsive design with CSS variables for light/dark mode compatibility
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
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6 max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
      <div className="mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="p-2 self-start sm:self-auto"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-foreground)'
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight" style={{ color: 'var(--foreground)' }}>
              Create New User
            </h1>
            <p className="text-sm sm:text-base md:text-lg" style={{ color: 'var(--muted-foreground)' }}>
              Add a new user to the system with roles and permissions
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            variant="destructive"
            className="mx-2 sm:mx-0"
            style={{
              backgroundColor: 'var(--destructive)',
              borderColor: 'var(--destructive)',
              color: 'var(--destructive-foreground)'
            }}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription style={{ color: 'var(--destructive-foreground)' }}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Basic Information */}
          <Card 
            className="mx-2 sm:mx-0 shadow-md sm:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 pb-3 sm:pb-4" style={{ borderBottomColor: 'var(--border)' }}>
              <CardTitle 
                className="text-lg sm:text-xl md:text-2xl font-semibold"
                style={{ color: 'var(--card-foreground)' }}
              >
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-4 sm:pt-6 space-y-4 sm:space-y-5 md:space-y-6" style={{ backgroundColor: 'var(--card)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="name"
                    className="text-xs sm:text-sm md:text-base font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                    className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base ${validationErrors.name ? '' : ''}`}
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: validationErrors.name ? 'var(--destructive)' : 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  {validationErrors.name && (
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="email"
                    className="text-xs sm:text-sm md:text-base font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                    className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base ${validationErrors.email ? '' : ''}`}
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: validationErrors.email ? 'var(--destructive)' : 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  {validationErrors.email && (
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="password"
                    className="text-xs sm:text-sm md:text-base font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base pr-10 ${validationErrors.password ? '' : ''}`}
                      style={{
                        backgroundColor: 'var(--input)',
                        borderColor: validationErrors.password ? 'var(--destructive)' : 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="password_confirmation"
                    className="text-xs sm:text-sm md:text-base font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base pr-10 ${validationErrors.password_confirmation ? '' : ''}`}
                      style={{
                        backgroundColor: 'var(--input)',
                        borderColor: validationErrors.password_confirmation ? 'var(--destructive)' : 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password_confirmation && (
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--destructive)' }}>
                      {validationErrors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card 
            className="mx-2 sm:mx-0 shadow-md sm:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 pb-3 sm:pb-4" style={{ borderBottomColor: 'var(--border)' }}>
              <CardTitle 
                className="text-lg sm:text-xl md:text-2xl font-semibold"
                style={{ color: 'var(--card-foreground)' }}
              >
                Roles
              </CardTitle>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Select roles - their permissions will be automatically included
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-4 sm:pt-6 space-y-4" style={{ backgroundColor: 'var(--card)' }}>
              {rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Loading roles...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-md" style={{ backgroundColor: checkedRoles.has(role.name) ? 'var(--accent)' : 'var(--muted)', borderColor: checkedRoles.has(role.name) ? 'var(--primary)' : 'var(--border)' }}>
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={checkedRoles.has(role.name)}
                        onCheckedChange={(checked) => 
                          handleRoleChange(role.name, checked as boolean)
                        }
                        className="mt-0.5 sm:mt-1"
                        style={{
                          borderColor: checkedRoles.has(role.name) ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: checkedRoles.has(role.name) ? 'var(--primary)' : 'var(--background)'
                        }}
                      />
                      <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                        <Label
                          htmlFor={`role-${role.id}`}
                          className="text-xs sm:text-sm md:text-base font-medium leading-tight cursor-pointer transition-colors duration-200"
                          style={{ color: checkedRoles.has(role.name) ? 'var(--accent-foreground)' : 'var(--foreground)' }}
                        >
                          {role.name}
                        </Label>
                        {role.permissions && role.permissions.length > 0 && (
                          <p className="text-xs sm:text-sm leading-tight" style={{ color: 'var(--muted-foreground)' }}>
                            Includes {role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.roles && (
                <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--destructive)' }}>
                  {validationErrors.roles}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Direct Permissions */}
          <Card 
            className="mx-2 sm:mx-0 shadow-md sm:shadow-lg"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 pb-3 sm:pb-4" style={{ borderBottomColor: 'var(--border)' }}>
              <CardTitle 
                className="text-lg sm:text-xl md:text-2xl font-semibold"
                style={{ color: 'var(--card-foreground)' }}
              >
                Additional Permissions
              </CardTitle>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Select additional permissions not covered by roles
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-4 sm:pt-6 space-y-3" style={{ backgroundColor: 'var(--card)' }}>
              {permissionsLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Loading permissions...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) var(--background)' }}>
                  {permissions.map((permission) => {
                    const isLocked = isPermissionLocked(permission.name);
                    const isChecked = allCheckedPermissions.has(permission.name);
                    
                    return (
                      <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border transition-all duration-200" style={{ backgroundColor: isLocked ? 'var(--muted)' : (isChecked ? 'var(--accent)' : 'var(--background)'), borderColor: isLocked ? 'var(--muted-foreground)' : (isChecked ? 'var(--primary)' : 'var(--border)'), opacity: isLocked ? 0.7 : 1 }}>
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={isChecked}
                          disabled={isLocked}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.name, checked as boolean)
                          }
                          className="mt-0.5 sm:mt-1"
                          style={{
                            borderColor: isLocked ? 'var(--muted-foreground)' : (isChecked ? 'var(--primary)' : 'var(--border)'),
                            backgroundColor: isChecked ? 'var(--primary)' : 'var(--background)'
                          }}
                        />
                        <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className={`text-xs sm:text-sm md:text-base font-medium leading-tight transition-colors duration-200 ${
                              isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            style={{
                              color: isLocked ? 'var(--muted-foreground)' : (isChecked ? 'var(--accent-foreground)' : 'var(--foreground)')
                            }}
                          >
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="break-words">{permission.name}</span>
                              {isLocked && (
                                <Lock className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                              )}
                            </div>
                          </Label>
                          {isLocked && (
                            <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>
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
                <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--destructive)' }}>
                  {validationErrors.permissions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 px-4 sm:px-2 lg:px-0 border-t" style={{ borderTopColor: 'var(--border)' }}>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)'
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" style={{ color: 'var(--primary-foreground)' }} />
                  <span className="text-sm sm:text-base">Creating...</span>
                </>
              ) : (
                <span className="text-sm sm:text-base">Create User</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
