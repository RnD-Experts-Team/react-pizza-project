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
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Lock, Save } from 'lucide-react';

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
    return (
      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 lg:py-10 xl:py-12">
        <div className="flex items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16">
          <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 animate-spin text-primary" />
          <span className="ml-2 text-sm sm:text-base md:text-lg text-foreground">Loading user...</span>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 lg:py-10 xl:py-12">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" onClick={handleBack} className="p-1.5 sm:p-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Edit User</h1>
            </div>
          </div>
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {userError || 'User not found'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 lg:py-10 xl:py-12">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-1.5 sm:p-2 self-start">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Edit User
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">
              Update {user.name}'s information
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Basic Information */}
          <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base font-medium text-foreground">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring ${
                      validationErrors.name ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-xs sm:text-sm text-destructive">{validationErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base font-medium text-foreground">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring ${
                      validationErrors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-xs sm:text-sm text-destructive">{validationErrors.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">Password</CardTitle>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                Leave blank to keep current password
              </p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  id="includePassword"
                  checked={includePassword}
                  onCheckedChange={(checked) => {
                    setIncludePassword(checked as boolean);
                    if (!checked) {
                      setFormData(prev => ({
                        ...prev,
                        password: '',
                        password_confirmation: '',
                      }));
                    }
                  }}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="includePassword" className="text-sm sm:text-base font-medium text-foreground cursor-pointer">
                  Change password
                </Label>
              </div>

              {includePassword && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base font-medium text-foreground">New Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring pr-10 ${
                          validationErrors.password ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-xs sm:text-sm text-destructive">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-sm sm:text-base font-medium text-foreground">Confirm New Password *</Label>
                    <div className="relative">
                      <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className={`h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring pr-10 ${
                          validationErrors.password_confirmation ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                    {validationErrors.password_confirmation && (
                      <p className="text-xs sm:text-sm text-destructive">{validationErrors.password_confirmation}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roles - Updated with linking logic */}
          <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">Roles</CardTitle>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                Select roles - their permissions will be automatically included
              </p>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8 md:py-10">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin mr-2 text-primary" />
                  <span className="text-sm sm:text-base text-foreground">Loading roles...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md border border-border bg-background hover:bg-accent transition-colors">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={checkedRoles.has(role.name)}
                        onCheckedChange={(checked) => 
                          handleRoleChange(role.name, checked as boolean)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                      />
                      <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                        <Label
                          htmlFor={`role-${role.id}`}
                          className="text-xs sm:text-sm md:text-base font-medium leading-none cursor-pointer text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                <p className="text-xs sm:text-sm text-destructive mt-2">{validationErrors.roles}</p>
              )}
            </CardContent>
          </Card>

          {/* Direct Permissions - Updated with locking logic */}
          <Card className="border-border bg-card shadow-[var(--shadow-realistic)]">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-card-foreground">Additional Permissions</CardTitle>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                Grant extra permissions not covered by roles (optional)
              </p>
            </CardHeader>
            <CardContent>
              {permissionsLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8 md:py-10">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin mr-2 text-primary" />
                  <span className="text-sm sm:text-base text-foreground">Loading permissions...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto">
                  {permissions.map((permission) => {
                    const isLocked = isPermissionLocked(permission.name);
                    const isChecked = allCheckedPermissions.has(permission.name);
                    
                    return (
                      <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md border border-border bg-background hover:bg-accent transition-colors">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={isChecked}
                          disabled={isLocked}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.name, checked as boolean)
                          }
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-50 mt-0.5"
                        />
                        <div className="grid gap-1 sm:gap-1.5 leading-none flex-1">
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className={`text-xs sm:text-sm md:text-base font-medium leading-none cursor-pointer ${
                              isLocked 
                                ? 'text-muted-foreground cursor-not-allowed' 
                                : 'text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            }`}
                          >
                            <div className="flex items-center gap-1 sm:gap-2">
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
                <p className="text-xs sm:text-sm text-destructive mt-2">{validationErrors.permissions}</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Updating User...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Update User</span>
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 sm:flex-none h-10 sm:h-11 md:h-12 text-sm sm:text-base border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Cancel</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
