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
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="container mx-auto py-8 px-4">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Role</h1>
            <p className="text-muted-foreground">
              Add a new role to the system
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
              <CardTitle>Role Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter role name (e.g., Manager, Editor)"
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guard_name">Guard Type *</Label>
                  <Select value={formData.guard_name} onValueChange={handleGuardChange}>
                    <SelectTrigger className={validationErrors.guard_name ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select guard type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GUARD_NAMES.WEB}>Web</SelectItem>
                      <SelectItem value={GUARD_NAMES.API}>API</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.guard_name && (
                    <p className="text-sm text-red-500">{validationErrors.guard_name}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select permissions for this role
              </p>
            </CardHeader>
            <CardContent>
              {permissionsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading permissions...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3 space-y-0">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={formData.permissions.includes(permission.name)}
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.permissions && (
                <p className="text-sm text-red-500 mt-2">{validationErrors.permissions}</p>
              )}
              {formData.permissions.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Selected permissions ({formData.permissions.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.permissions.map((permissionName) => (
                      <span key={permissionName} className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                        {permissionName}
                      </span>
                    ))}
                  </div>
                </div>
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
                'Create Role'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRolePage;
