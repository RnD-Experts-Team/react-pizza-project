/**
 * Create Role Page
 * 
 * Complete form for creating a new role with permissions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRole } from '../../features/roles/hooks/useRoles';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
import {  GUARD_NAMES } from '../../features/roles/types';
import type { CreateRoleRequest } from '../../features/roles/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { ManageLayout } from '../../components/layouts/ManageLayout';

const CreateRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { createRole, loading, error, validateForm } = useCreateRole();
  const { permissions, loading: permissionsLoading } = usePermissions();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    guard_name: GUARD_NAMES.WEB,
    permissions: [] as string[],
  });
  
  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/user-management'); // Go back to user management page
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGuardChange = (value: string) => {
    setFormData(prev => ({ ...prev, guard_name: value as typeof GUARD_NAMES.WEB }));
    
    if (validationErrors.guard_name) {
      setValidationErrors(prev => ({ ...prev, guard_name: '' }));
    }
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionName]
        : prev.permissions.filter(p => p !== permissionName)
    }));
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
      const roleData: CreateRoleRequest = {
        name: formData.name,
        guard_name: formData.guard_name,
        permissions: formData.permissions,
      };

      await createRole(roleData);
      
      // Success - navigate back to users page
      navigate('/user-management');
    } catch (err) {
      console.error('Failed to create role:', err);
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
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter role name (e.g., Manager, Editor)"
                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${
                      validationErrors.name ? 'border-destructive focus:ring-destructive' : 'focus:ring-ring'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-destructive">{validationErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guard_name" className="text-sm font-medium text-foreground">Guard Type *</Label>
                  <Select value={formData.guard_name} onValueChange={handleGuardChange}>
                    <SelectTrigger className={`bg-background border-input text-foreground ${
                      validationErrors.guard_name ? 'border-destructive focus:ring-destructive' : 'focus:ring-ring'
                    }`}>
                      <SelectValue placeholder="Select guard type" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={GUARD_NAMES.WEB} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">Web</SelectItem>
                      <SelectItem value={GUARD_NAMES.API} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">API</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.guard_name && (
                    <p className="text-sm text-destructive">{validationErrors.guard_name}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-card-foreground">Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select permissions for this role
              </p>
            </CardHeader>
            <CardContent>
              {permissionsLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                  <span className="text-muted-foreground">Loading permissions...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-60 sm:max-h-80 overflow-y-auto border border-border rounded-md p-3 sm:p-4 bg-background/50">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2 sm:space-x-3 space-y-0 p-2 rounded-md hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={formData.permissions.includes(permission.name)}
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.permissions && (
                <p className="text-sm text-destructive mt-2">{validationErrors.permissions}</p>
              )}
              {formData.permissions.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Selected permissions ({formData.permissions.length}):</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {formData.permissions.map((permissionName) => (
                      <span key={permissionName} className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        {permissionName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
