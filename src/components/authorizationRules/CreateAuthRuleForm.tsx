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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuthRulesForm } from '../../features/authorizationRules/hooks/useAuthRules';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
import { AuthRuleTestDialog } from './AuthRuleTestDialog';
import { RolesSelectionSection } from './RolesSelectionSection';
import { PermissionsSelectionSection } from './PermissionsSelectionSection';
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
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6">
      <div className="mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error?.message || 'An error occurred'}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="service" className="text-sm sm:text-base font-medium">Service *</Label>
                  <Input
                    id="service"
                    value={service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    placeholder="e.g., data, auth, api"
                    className={`text-sm sm:text-base ${validationErrors.service ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.service && (
                    <p className="text-xs sm:text-sm text-red-500">{validationErrors.service}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="method" className="text-sm sm:text-base font-medium">HTTP Method *</Label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => handleInputChange('method', e.target.value as HttpMethod)}
                    className={`flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-sm ring-offset-background ${
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
                    <p className="text-xs sm:text-sm text-red-500">{validationErrors.method}</p>
                  )}
                </div>
              </div>

              {/* Path Configuration */}
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-sm sm:text-base font-medium">Path Configuration *</Label>
                <Tabs value={pathType} onValueChange={(value) => setPathType(value as 'dsl' | 'route')}>
                  <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
                    <TabsTrigger value="dsl" className="text-xs sm:text-sm">Path DSL</TabsTrigger>
                    <TabsTrigger value="route" className="text-xs sm:text-sm">Route Name</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dsl" className="mt-3 sm:mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="pathDsl" className="text-sm sm:text-base">Path DSL Pattern</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Textarea
                          id="pathDsl"
                          value={pathDsl}
                          onChange={(e) => handleInputChange('pathDsl', e.target.value)}
                          placeholder="/api/users/{id}/posts/*"
                          className={`text-sm font-mono min-h-[2.5rem] sm:min-h-[3rem] flex-1 ${validationErrors.pathDsl ? 'border-red-500' : ''}`}
                        />
                        {pathDsl.trim() && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto text-sm"
                            onClick={() => setShowTestDialog(true)}
                          >
                            Test
                          </Button>
                        )}
                      </div>
                      {validationErrors.pathDsl && (
                        <p className="text-xs sm:text-sm text-red-500">{validationErrors.pathDsl}</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="route" className="mt-3 sm:mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="routeName" className="text-sm sm:text-base">Route Name</Label>
                      <Input
                        id="routeName"
                        value={routeName}
                        onChange={(e) => handleInputChange('routeName', e.target.value)}
                        placeholder="users.posts.index"
                        className={`text-sm sm:text-base ${validationErrors.routeName ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.routeName && (
                        <p className="text-xs sm:text-sm text-red-500">{validationErrors.routeName}</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="priority" className="text-sm sm:text-base font-medium">Priority (1-1000) *</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="1000"
                    value={priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                    className={`text-sm sm:text-base ${validationErrors.priority ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.priority && (
                    <p className="text-xs sm:text-sm text-red-500">{validationErrors.priority}</p>
                  )}
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-2 sm:p-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm sm:text-base">Active Rule</Label>
                    <div className="text-xs sm:text-sm text-muted-foreground">
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
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Authorization Requirements</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select roles and permissions required to access this endpoint
              </p>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Authorization Error */}
              {validationErrors.authorization && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationErrors.authorization}</AlertDescription>
                </Alert>
              )}

              {/* Roles Section */}
              <RolesSelectionSection
                availableRoles={availableRoles}
                selectedRoles={selectedRoles}
                rolesLoading={rolesLoading}
                onToggleRole={toggleRoleSelection}
                onSelectAllRoles={selectAllRoles}
                onClearAllRoles={clearAllRoles}
              />

              {/* Separator */}
              <Separator />

              {/* Permissions Section */}
              <PermissionsSelectionSection
                availablePermissions={availablePermissions}
                selectedPermissions={selectedPermissions}
                permissionsLoading={permissionsLoading}
                authorizationType={authorizationType}
                onTogglePermission={togglePermissionSelection}
                onSelectAllPermissions={selectAllPermissions}
                onClearAllPermissions={clearAllPermissions}
                onAuthorizationTypeChange={setAuthorizationType}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isCreating}
              className="w-full sm:w-auto min-w-[120px]"
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
