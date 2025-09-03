/**
 * Create Authorization Rule Form Component - Refactored Version
 * 
 * Features:
 * - Pure React state management (no external form libraries)
 * - Handles both path_dsl and route_name types
 * - Uses roles and permissions from dedicated hooks as checkbox lists
 * - Manages permissions (any vs all) and roles selection
 * - Manual validation like your user form
 * - Better UI separation between roles and permissions
 * - Refactored into smaller, reusable subcomponents
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { useAuthRulesForm } from '@/features/authorizationRules/hooks/useAuthRules';
import { useRoles } from '@/features/authorizationRules/../roles/hooks/useRoles';
import { usePermissions } from '@/features/authorizationRules/../permissions/hooks/usePermissions';
import { useAuthRuleFormValidation } from '@/features/authorizationRules/hooks/useAuthRuleFormValidation';
import { useAuthRuleAuthorization } from '@/features/authorizationRules/hooks/useAuthRuleAuthorization';
import { AuthRuleTestDialog } from '@/features/authorizationRules/components/AuthRuleTestDialog';
import { RolesSelectionSection } from '@/features/authorizationRules/components/CreateAuthRule/RolesSelectionSection';
import { PermissionsSelectionSection } from '@/features/authorizationRules/components/CreateAuthRule/PermissionsSelectionSection';
import { ErrorAlert } from '@/features/authorizationRules/components/CreateAuthRule/ErrorAlert';
import { BasicInformationSection } from '@/features/authorizationRules/components/CreateAuthRule/BasicInformationSection';
import { PathConfigurationSection } from '@/features/authorizationRules/components/CreateAuthRule/PathConfigurationSection';
import { StatusSection } from '@/features/authorizationRules/components/CreateAuthRule/StatusSection';
import { FormActionsSection } from '@/features/authorizationRules/components/CreateAuthRule/FormActionsSection';
import type { HttpMethod } from '@/features/authorizationRules/types';

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
  
  // Custom hooks for validation and authorization
  const {
    clearFieldError,
    clearAuthorizationError,
    validateForm,
    setErrors,
    getFieldError,
  } = useAuthRuleFormValidation();
  
  const {
    selectedRoles,
    selectedPermissionsAny,
    selectedPermissionsAll,
    toggleRoleSelection,
    selectAllRoles,
    clearAllRoles,
    togglePermissionAnySelection,
    selectAllPermissionsAny,
    clearAllPermissionsAny,
    togglePermissionAllSelection,
    selectAllPermissionsAll,
    clearAllPermissionsAll,
    getAuthorizationData,
  } = useAuthRuleAuthorization();
  
  // Form state
  const [service, setService] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [pathType, setPathType] = useState<'dsl' | 'route'>('dsl');
  const [pathDsl, setPathDsl] = useState('');
  const [routeName, setRouteName] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // UI state
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrapper functions to handle authorization actions with validation clearing
  const handleToggleRole = (roleName: string) => {
    toggleRoleSelection(roleName);
    clearAuthorizationError();
  };

  const handleTogglePermissionAny = (permissionName: string) => {
    togglePermissionAnySelection(permissionName);
    clearAuthorizationError();
  };

  const handleTogglePermissionAll = (permissionName: string) => {
    togglePermissionAllSelection(permissionName);
    clearAuthorizationError();
  };

  const handleSelectAllRoles = () => {
    selectAllRoles(availableRoles);
    clearAuthorizationError();
  };

  const handleSelectAllPermissionsAny = () => {
    selectAllPermissionsAny(availablePermissions);
    clearAuthorizationError();
  };

  const handleSelectAllPermissionsAll = () => {
    selectAllPermissionsAll(availablePermissions);
    clearAuthorizationError();
  };

  // Handle input changes and clear validation errors
  const handleInputChange = (field: string, value: string | number | boolean) => {
    // Clear validation error for this field
    clearFieldError(field);

    // Update the respective state
    switch (field) {
      case 'service': setService(value as string); break;
      case 'method': setMethod(value as HttpMethod); break;
      case 'pathDsl': setPathDsl(value as string); break;
      case 'routeName': setRouteName(value as string); break;
      case 'isActive': setIsActive(value as boolean); break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare form data for validation
    const formData = {
      service,
      method,
      pathType,
      pathDsl,
      routeName,
      isActive,
    };
    
    const authorizationData = getAuthorizationData();
    
    // Validate form
    const errors = validateForm(formData, authorizationData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Build request payload
      const ruleData = {
        service: service.trim(),
        method,
        is_active: isActive,
        ...(pathType === 'dsl' ? { path_dsl: pathDsl.trim() } : { route_name: routeName.trim() }),
        ...(authorizationData.selectedRoles.length > 0 && { roles_any: authorizationData.selectedRoles }),
        ...(authorizationData.selectedPermissionsAny.length > 0 && { permissions_any: authorizationData.selectedPermissionsAny }),
        ...(authorizationData.selectedPermissionsAll.length > 0 && { permissions_all: authorizationData.selectedPermissionsAll }),
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
        <ErrorAlert error={error} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Basic Information */}
          <BasicInformationSection
            service={service}
            method={method}
            onServiceChange={(value) => handleInputChange('service', value)}
            onMethodChange={(value) => handleInputChange('method', value)}
            getFieldError={getFieldError}
          />

          {/* Path Configuration and Status */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <PathConfigurationSection
                pathType={pathType}
                pathDsl={pathDsl}
                routeName={routeName}
                onPathTypeChange={(value) => setPathType(value as 'dsl' | 'route')}
                onPathDslChange={(value) => handleInputChange('pathDsl', value)}
                onRouteNameChange={(value) => handleInputChange('routeName', value)}
                onTestClick={() => setShowTestDialog(true)}
                getFieldError={getFieldError}
              />

              <StatusSection
                isActive={isActive}
                onActiveChange={(checked) => handleInputChange('isActive', checked)}
              />
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
              {getFieldError('authorization') && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{getFieldError('authorization')}</AlertDescription>
                </Alert>
              )}

              {/* Roles Section */}
              <RolesSelectionSection
                availableRoles={availableRoles}
                selectedRoles={selectedRoles}
                rolesLoading={rolesLoading}
                onToggleRole={handleToggleRole}
                onSelectAllRoles={handleSelectAllRoles}
                onClearAllRoles={clearAllRoles}
              />

              {/* Separator */}
              <Separator />

              {/* Permissions Section */}
              <PermissionsSelectionSection
                availablePermissions={availablePermissions}
                selectedPermissionsAny={selectedPermissionsAny}
                selectedPermissionsAll={selectedPermissionsAll}
                permissionsLoading={permissionsLoading}
                onTogglePermissionAny={handleTogglePermissionAny}
                onTogglePermissionAll={handleTogglePermissionAll}
                onSelectAllPermissionsAny={handleSelectAllPermissionsAny}
                onClearAllPermissionsAny={clearAllPermissionsAny}
                onSelectAllPermissionsAll={handleSelectAllPermissionsAll}
                onClearAllPermissionsAll={clearAllPermissionsAll}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <FormActionsSection
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            isCreating={isCreating}
          />
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
