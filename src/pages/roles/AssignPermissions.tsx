/**
 * Assign Permissions Page - Role-based Permission Assignment
 * 
 * This page allows administrators to assign permissions to roles.
 * When permissions are assigned to a role, all users with that role automatically inherit those permissions.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles, useAssignPermissions } from '../../features/roles/hooks/useRoles';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
// ADDED: Import useAuth hook for manual profile refresh
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Loader2, AlertCircle, Shield, Lock } from 'lucide-react';
import { ManageLayout } from '../../components/layouts/ManageLayout';

interface FormErrors {
  role?: string;
  permissions?: string;
}

const AssignPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading: rolesLoading } = useRoles();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const { assignPermissions, loading: assignLoading, error: assignError, reset } = useAssignPermissions();
  // ADDED: Get getUserProfile function for manual profile refresh
  const { getUserProfile } = useAuth();
  
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
      
      // ADDED: Manual refresh of user profile to update permissions in real-time
      getUserProfile();
      
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
    <ManageLayout
      title="Assign Permissions"
      subtitle="Assign permissions to roles - users with these roles will inherit the permissions"
      backButton={{
        show: true,
      }}
    >
      {/* Success Alert */}
      {successMessage && (
        <Alert className="border-primary/20 bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {assignError && (
        <Alert variant="destructive" className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive-foreground">{assignError}</AlertDescription>
        </Alert>
      )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Role Selection */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-card-foreground">Select Role</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the role to assign permissions to
              </p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                  <span className="text-muted-foreground">Loading roles...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="role-select" className="text-sm font-medium text-foreground">Role *</Label>
                  <Select value={selectedRoleId} onValueChange={handleRoleChange}>
                    <SelectTrigger className={`bg-background border-input text-foreground ${
                      formErrors.role ? 'border-destructive focus:ring-destructive' : 'focus:ring-ring'
                    }`}>
                      <SelectValue placeholder="Select a role" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
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
                    <p className="text-sm text-destructive">{formErrors.role}</p>
                  )}
                </div>
              )}

              {/* Current Role Permissions */}
              {selectedRole && currentRolePermissions.size > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg border border-border">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Current Permissions ({currentRolePermissions.size})
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {Array.from(currentRolePermissions).map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border"
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
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-card-foreground">Available Permissions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Select permissions to assign to {selectedRole.name}
                    </p>
                  </div>
                  {availablePermissions.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={selectedPermissions.size === availablePermissions.length}
                        className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        disabled={selectedPermissions.size === 0}
                        className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {permissionsLoading ? (
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                    <span className="text-muted-foreground">Loading permissions...</span>
                  </div>
                ) : availablePermissions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm sm:text-base">All available permissions are already assigned to this role.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-60 sm:max-h-80 overflow-y-auto border border-border rounded-md p-3 sm:p-4 bg-background/50">
                    {availablePermissions.map((permission) => {
                      const isChecked = selectedPermissions.has(permission.name);
                      
                      return (
                        <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 space-y-0 p-2 rounded-md hover:bg-accent/50 transition-colors">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.name, checked as boolean)
                            }
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <div className="grid gap-1.5 leading-none flex-1">
                            <Label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm font-medium leading-none text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                  <p className="text-sm text-destructive mt-2">{formErrors.permissions}</p>
                )}
                
                {/* Selected Count */}
                {selectedPermissions.size > 0 && (
                  <div className="mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary font-medium">
                      {selectedPermissions.size} permission(s) selected for assignment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
              disabled={isSubmitting || assignLoading || !selectedRole || selectedPermissions.size === 0}
              className="w-full sm:w-auto min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring"
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
    </ManageLayout>
  );
};

export default AssignPermissionsPage;