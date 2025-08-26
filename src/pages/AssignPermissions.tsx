/**
 * Assign Permissions Page - Role-based Permission Assignment
 * 
 * This page allows administrators to assign permissions to roles.
 * When permissions are assigned to a role, all users with that role automatically inherit those permissions.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles, useAssignPermissions } from '../features/roles/hooks/useRoles';
import { usePermissions } from '../features/permissions/hooks/usePermissions';
import type { AssignPermissionsForm } from '../types/userManagement';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, Loader2, AlertCircle, Shield, Lock } from 'lucide-react';

interface FormErrors {
  role?: string;
  permissions?: string;
}

const AssignPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading: rolesLoading } = useRoles();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const { assignPermissions, loading: assignLoading, error: assignError, reset } = useAssignPermissions();
  
  // Form state
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Get selected role data
  const selectedRole = useMemo(() => {
    if (!selectedRoleId) return null;
    return roles.find(role => role.id.toString() === selectedRoleId) || null;
  }, [selectedRoleId, roles]);

  // Get current role permissions
  const currentRolePermissions = useMemo(() => {
    if (!selectedRole?.permissions) return new Set<string>();
    return new Set(selectedRole.permissions.map(p => p.name));
  }, [selectedRole]);

  // Get available permissions (not already assigned to role)
  const availablePermissions = useMemo(() => {
    return permissions.filter(permission => 
      !currentRolePermissions.has(permission.name)
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

  const handleBack = () => {
    navigate('/user-management');
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setSelectedPermissions(prev => {
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
      setFormErrors(prev => ({ ...prev, permissions: '' }));
    }
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
        Array.from(selectedPermissions)
      );
      
      // Success
      setSuccessMessage(`Successfully assigned ${selectedPermissions.size} permission(s) to ${selectedRole?.name}`);
      setSelectedPermissions(new Set());
      
      // Optionally navigate back after a delay
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);
    } catch (err) {
      console.error('Failed to assign permissions:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAll = () => {
    const allAvailablePermissions = new Set(availablePermissions.map(p => p.name));
    setSelectedPermissions(allAvailablePermissions);
  };

  const handleClearAll = () => {
    setSelectedPermissions(new Set());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assign Permissions</h1>
            <p className="text-muted-foreground">
              Assign permissions to roles - users with these roles will inherit the permissions
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {assignError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{assignError}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Role</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the role to assign permissions to
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {rolesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading roles...
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="role-select">Role *</Label>
                  <Select value={selectedRoleId} onValueChange={handleRoleChange}>
                    <SelectTrigger className={formErrors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{role.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {role.permissions?.length || 0} permissions
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-sm text-red-500">{formErrors.role}</p>
                  )}
                </div>
              )}

              {/* Current Role Permissions */}
              {selectedRole && currentRolePermissions.size > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Current Permissions ({currentRolePermissions.size})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(currentRolePermissions).map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permission Assignment */}
          {selectedRole && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Available Permissions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Select permissions to assign to {selectedRole.name}
                    </p>
                  </div>
                  {availablePermissions.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={selectedPermissions.size === availablePermissions.length}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        disabled={selectedPermissions.size === 0}
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {permissionsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading permissions...
                  </div>
                ) : availablePermissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>All available permissions are already assigned to this role.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {availablePermissions.map((permission) => {
                      const isChecked = selectedPermissions.has(permission.name);
                      
                      return (
                        <div key={permission.id} className="flex items-start space-x-3 space-y-0">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.name, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Guard: {permission.guard_name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {formErrors.permissions && (
                  <p className="text-sm text-red-500 mt-2">{formErrors.permissions}</p>
                )}
                
                {/* Selected Count */}
                {selectedPermissions.size > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {selectedPermissions.size} permission(s) selected for assignment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
              disabled={isSubmitting || assignLoading || !selectedRole || selectedPermissions.size === 0}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Permissions'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPermissionsPage;