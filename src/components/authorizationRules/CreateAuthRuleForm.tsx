/**
 * Create Authorization Rule Form Component - Simple Version
 * 
 * Features:
 * - Pure React state management (no external form libraries)
 * - Handles both path_dsl and route_name types
 * - Uses roles and permissions from dedicated hooks as checkbox lists
 * - Manages permissions (any vs all) and roles selection
 * - Manual validation like your user form
 * - Better UI separation between roles and permissions
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {  X, AlertCircle, Loader2, Users, Shield } from 'lucide-react';
import { useAuthRulesForm } from '../../features/authorizationRules/hooks/useAuthRules';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
import { AuthRuleTestDialog } from './AuthRuleTestDialog';
import type { HttpMethod } from '../../features/authorizationRules/types';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

interface CreateAuthRuleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateAuthRuleForm: React.FC<CreateAuthRuleFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createRule, isCreating, error } = useAuthRulesForm();
  
  // Get available roles and permissions from dedicated hooks
  const { roles: availableRoles, loading: rolesLoading } = useRoles(true);
  const { permissions: availablePermissions, loading: permissionsLoading } = usePermissions(true);
  
  // Form state
  const [service, setService] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [pathType, setPathType] = useState<'dsl' | 'route'>('dsl');
  const [pathDsl, setPathDsl] = useState('');
  const [routeName, setRouteName] = useState('');
  const [priority, setPriority] = useState(100);
  const [isActive, setIsActive] = useState(true);
  
  // Authorization state - using checkbox selection
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [authorizationType, setAuthorizationType] = useState<'any' | 'all'>('any');
  
  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle role selection
  const toggleRoleSelection = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
    
    // Clear validation error
    if (validationErrors.authorization) {
      setValidationErrors(prev => ({ ...prev, authorization: '' }));
    }
  };

  // Toggle permission selection
  const togglePermissionSelection = (permissionName: string) => {
    if (selectedPermissions.includes(permissionName)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionName));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionName]);
    }
    
    // Clear validation error
    if (validationErrors.authorization) {
      setValidationErrors(prev => ({ ...prev, authorization: '' }));
    }
  };

  // Select all roles
  const selectAllRoles = () => {
    const roleNames = availableRoles.map(role => role.name);
    setSelectedRoles(roleNames);
    if (validationErrors.authorization) {
      setValidationErrors(prev => ({ ...prev, authorization: '' }));
    }
  };

  // Clear all roles
  const clearAllRoles = () => {
    setSelectedRoles([]);
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const permissionNames = availablePermissions.map(permission => permission.name);
    setSelectedPermissions(permissionNames);
    if (validationErrors.authorization) {
      setValidationErrors(prev => ({ ...prev, authorization: '' }));
    }
  };

  // Clear all permissions
  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  // Handle input changes and clear validation errors
  const handleInputChange = (field: string, value: string | number | boolean) => {
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update the respective state
    switch (field) {
      case 'service': setService(value as string); break;
      case 'method': setMethod(value as HttpMethod); break;
      case 'pathDsl': setPathDsl(value as string); break;
      case 'routeName': setRouteName(value as string); break;
      case 'priority': setPriority(value as number); break;
      case 'isActive': setIsActive(value as boolean); break;
    }
  };

  // Validate form
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!service.trim()) {
      errors.service = 'Service is required';
    }

    if (!method) {
      errors.method = 'HTTP method is required';
    }

    // Path validation
    if (pathType === 'dsl' && !pathDsl.trim()) {
      errors.pathDsl = 'Path DSL is required when using DSL type';
    }

    if (pathType === 'route' && !routeName.trim()) {
      errors.routeName = 'Route name is required when using route type';
    }

    // Authorization validation
    if (selectedRoles.length === 0 && selectedPermissions.length === 0) {
      errors.authorization = 'At least one role or permission is required';
    }

    // Priority validation
    if (priority < 1 || priority > 1000) {
      errors.priority = 'Priority must be between 1 and 1000';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Build request payload
      const ruleData = {
        service: service.trim(),
        method,
        priority,
        is_active: isActive,
        ...(pathType === 'dsl' ? { path_dsl: pathDsl.trim() } : { route_name: routeName.trim() }),
        ...(selectedRoles.length > 0 && { roles_any: selectedRoles }),
        ...(selectedPermissions.length > 0 && authorizationType === 'any' 
          ? { permissions_any: selectedPermissions }
          : { permissions_all: selectedPermissions }
        ),
      };

      const success = await createRule(ruleData);
      if (success) {
        onSuccess?.();
      }
    } catch (err) {
      console.error('Failed to create auth rule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mx-auto space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error?.message || 'An error occurred'}</AlertDescription>
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
                  <Label htmlFor="service">Service *</Label>
                  <Input
                    id="service"
                    value={service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    placeholder="e.g., data, auth, api"
                    className={validationErrors.service ? 'border-red-500' : ''}
                  />
                  {validationErrors.service && (
                    <p className="text-sm text-red-500">{validationErrors.service}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">HTTP Method *</Label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => handleInputChange('method', e.target.value as HttpMethod)}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${
                      validationErrors.method ? 'border-red-500' : ''
                    }`}
                  >
                    {HTTP_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {validationErrors.method && (
                    <p className="text-sm text-red-500">{validationErrors.method}</p>
                  )}
                </div>
              </div>

              {/* Path Configuration */}
              <div className="space-y-4">
                <Label>Path Configuration *</Label>
                <Tabs value={pathType} onValueChange={(value) => setPathType(value as 'dsl' | 'route')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dsl">Path DSL</TabsTrigger>
                    <TabsTrigger value="route">Route Name</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dsl" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="pathDsl">Path DSL Pattern</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="pathDsl"
                          value={pathDsl}
                          onChange={(e) => handleInputChange('pathDsl', e.target.value)}
                          placeholder="/api/users/{id}/posts/*"
                          className={validationErrors.pathDsl ? 'border-red-500' : ''}
                        />
                        {pathDsl.trim() && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowTestDialog(true)}
                          >
                            Test
                          </Button>
                        )}
                      </div>
                      {validationErrors.pathDsl && (
                        <p className="text-sm text-red-500">{validationErrors.pathDsl}</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="route" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="routeName">Route Name</Label>
                      <Input
                        id="routeName"
                        value={routeName}
                        onChange={(e) => handleInputChange('routeName', e.target.value)}
                        placeholder="users.posts.index"
                        className={validationErrors.routeName ? 'border-red-500' : ''}
                      />
                      {validationErrors.routeName && (
                        <p className="text-sm text-red-500">{validationErrors.routeName}</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-1000) *</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="1000"
                    value={priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                    className={validationErrors.priority ? 'border-red-500' : ''}
                  />
                  {validationErrors.priority && (
                    <p className="text-sm text-red-500">{validationErrors.priority}</p>
                  )}
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label>Active Rule</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable this rule immediately
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Authorization Requirements</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select roles and permissions required to access this endpoint
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authorization Error */}
              {validationErrors.authorization && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.authorization}</AlertDescription>
                </Alert>
              )}

              {/* Roles Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <Label className="text-base font-medium">Roles</Label>
                  <span className="text-sm text-muted-foreground">(User must have ANY of these roles)</span>
                </div>

                {rolesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Loading roles...</span>
                  </div>
                ) : availableRoles && availableRoles.length > 0 ? (
                  <div className="space-y-3">
                    {/* Bulk actions */}
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={selectAllRoles}
                      >
                        Select All
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={clearAllRoles}
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Roles grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
                      {availableRoles.map((role) => (
                        <div key={role.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={selectedRoles.includes(role.name)}
                            onCheckedChange={() => toggleRoleSelection(role.name)}
                          />
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Selected roles display */}
                    {selectedRoles.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Selected Roles ({selectedRoles.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedRoles.map((roleName) => (
                            <Badge key={roleName} variant="secondary" className="flex items-center gap-1">
                              {roleName}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => toggleRoleSelection(roleName)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md bg-gray-50">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No roles available</p>
                  </div>
                )}
              </div>

              {/* Separator */}
              <Separator />

              {/* Permissions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <Label className="text-base font-medium">Permissions</Label>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={authorizationType === 'any' ? 'font-medium text-blue-600' : 'text-muted-foreground'}>
                      Any
                    </span>
                    <Switch
                      checked={authorizationType === 'all'}
                      onCheckedChange={(checked) => setAuthorizationType(checked ? 'all' : 'any')}
                    />
                    <span className={authorizationType === 'all' ? 'font-medium text-blue-600' : 'text-muted-foreground'}>
                      All
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {authorizationType === 'any' 
                    ? 'User needs ANY of these permissions'
                    : 'User needs ALL of these permissions'
                  }
                </p>

                {permissionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Loading permissions...</span>
                  </div>
                ) : availablePermissions && availablePermissions.length > 0 ? (
                  <div className="space-y-3">
                    {/* Bulk actions */}
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={selectAllPermissions}
                      >
                        Select All
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={clearAllPermissions}
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Permissions grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.name)}
                            onCheckedChange={() => togglePermissionSelection(permission.name)}
                          />
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Selected permissions display */}
                    {selectedPermissions.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Selected Permissions ({selectedPermissions.length}) - {authorizationType.toUpperCase()}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedPermissions.map((permissionName) => (
                            <Badge
                              key={permissionName}
                              variant={authorizationType === 'all' ? 'default' : 'outline'}
                              className="flex items-center gap-1"
                            >
                              {permissionName}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => togglePermissionSelection(permissionName)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md bg-gray-50">
                    <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No permissions available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isCreating}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Rule'
              )}
            </Button>
          </div>
        </form>

        {/* Test Dialog */}
        {showTestDialog && pathDsl && (
          <AuthRuleTestDialog
            pathDsl={pathDsl}
            onClose={() => setShowTestDialog(false)}
          />
        )}
      </div>
    </div>
  );
};
