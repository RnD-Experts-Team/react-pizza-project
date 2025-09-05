/**
 * Validate Hierarchy Page
 * 
 * Page for validating if a specific role hierarchy relationship exists for a store.
 * Users can select higher and lower roles to check if the hierarchy exists,
 * then create or remove it based on the validation result.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useStoreHierarchy, useHierarchyTree } from '@/features/storeHierarchy/hooks/UseRoleHierarchy';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { 
  RoleSelection,
  ValidationSection
} from '@/features/storeHierarchy/components/validateHierarchy';
import { ManageLayout } from '@/components/layouts/ManageLayout';

const ValidateHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const { roles, loading: rolesLoading } = useRoles();
  
  // Use hierarchy hooks for validation
  const { hierarchies, isLoading: hierarchiesLoading, error: hierarchiesError } = useStoreHierarchy(storeId);
  const { tree, utils: treeUtils, isLoading: treeLoading, error: treeError } = useHierarchyTree(storeId);
  
  // Form state
  const [formData, setFormData] = useState<{
    higher_role_id: string;
    lower_role_id: string;
  }>({
    higher_role_id: '',
    lower_role_id: ''
  });
  
  // Validation state
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    valid: boolean;
    errors: string[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Memoize combined loading state to prevent unnecessary re-renders
  const isLoading = useMemo(() => {
    return rolesLoading || hierarchiesLoading || treeLoading;
  }, [rolesLoading, hierarchiesLoading, treeLoading]);

  // Memoize hierarchy existence check to avoid recalculating on every render
  const hierarchyExists = useMemo(() => {
    if (!hierarchies || hierarchies.length === 0) return false;
    if (!formData.higher_role_id || !formData.lower_role_id) return false;
    
    const higherRoleId = parseInt(formData.higher_role_id);
    const lowerRoleId = parseInt(formData.lower_role_id);
    
    return hierarchies.some(hierarchy => 
      hierarchy.higher_role_id === higherRoleId && 
      hierarchy.lower_role_id === lowerRoleId
    );
  }, [hierarchies, formData.higher_role_id, formData.lower_role_id]);

  // Memoize validation capability to prevent recalculation
  const canValidate = useMemo(() => {
    return !!formData.higher_role_id && !!formData.lower_role_id;
  }, [formData.higher_role_id, formData.lower_role_id]);

  // Use useCallback for event handlers to prevent child re-renders
  const handleRoleChange = useCallback((field: 'higher_role_id' | 'lower_role_id', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear previous validation result when roles change
    if (validationResult) {
      setValidationResult(null);
    }
  }, [validationErrors, validationResult]);

  // Memoize form validation function
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.higher_role_id) {
      errors.higher_role_id = 'Please select a higher role';
    }
    
    if (!formData.lower_role_id) {
      errors.lower_role_id = 'Please select a lower role';
    }
    
    if (formData.higher_role_id === formData.lower_role_id && formData.higher_role_id) {
      errors.lower_role_id = 'Higher role and lower role cannot be the same';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.higher_role_id, formData.lower_role_id]);

  // Optimize validation handler with useCallback
  const handleValidate = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!storeId) {
      setValidationErrors({ general: 'Store ID is required' });
      return;
    }
    
    setIsValidating(true);
    
    try {
      const higherRoleId = parseInt(formData.higher_role_id);
      const lowerRoleId = parseInt(formData.lower_role_id);
      
      // Additional validation using tree utilities
      let additionalValidation: string[] = [];
      
      if (treeUtils && tree.length > 0) {
        // Check if the roles exist in the tree
        const higherRoleNode = treeUtils.findNodeByRoleId(higherRoleId);
        const lowerRoleNode = treeUtils.findNodeByRoleId(lowerRoleId);
        
        if (!higherRoleNode) {
          additionalValidation.push(`Higher role (ID: ${higherRoleId}) not found in hierarchy tree`);
        }
        
        if (!lowerRoleNode) {
          additionalValidation.push(`Lower role (ID: ${lowerRoleId}) not found in hierarchy tree`);
        }
        
        // Check if there's already a path between these roles
        if (higherRoleNode && lowerRoleNode) {
          const pathToLowerRole = treeUtils.getPathToRole(lowerRoleId);
          const isAlreadyConnected = pathToLowerRole.some(node => node.role.id === higherRoleId);
          
          if (isAlreadyConnected && !hierarchyExists) {
            additionalValidation.push('Roles are already connected through an indirect hierarchy path');
          }
        }
        
        // Validate overall hierarchy structure
        const hierarchyValidation = treeUtils.validateHierarchy();
        if (!hierarchyValidation.isValid) {
          additionalValidation.push(...hierarchyValidation.errors);
        }
      }
      
      if (hierarchyExists) {
        setValidationResult({
          success: true,
          valid: true,
          errors: ['This hierarchy relationship already exists', ...additionalValidation]
        });
      } else {
        setValidationResult({
          success: false,
          valid: false,
          errors: additionalValidation
        });
      }
    } catch (error) {
      console.error('Failed to validate hierarchy:', error);
      setValidationErrors({ general: 'Failed to validate hierarchy. Please try again.' });
    } finally {
      setIsValidating(false);
    }
  }, [formData.higher_role_id, formData.lower_role_id, storeId, treeUtils, tree, hierarchyExists, validateForm]);

  // Optimize navigation handlers with useCallback
  const handleCreateHierarchy = useCallback(() => {
    navigate(`/stores-hierarchy/create/${storeId}`, {
      state: {
        preselectedHigherRole: formData.higher_role_id,
        preselectedLowerRole: formData.lower_role_id
      }
    });
  }, [navigate, storeId, formData.higher_role_id, formData.lower_role_id]);

  const handleRemoveHierarchy = useCallback(() => {
    // Navigate to delete confirmation page with the validated hierarchy data
    navigate(`/stores-hierarchy/delete/${storeId}`, {
      state: {
        preselectedHigherRole: formData.higher_role_id,
        preselectedLowerRole: formData.lower_role_id,
        validatedHierarchy: {
          higher_role_id: parseInt(formData.higher_role_id),
          lower_role_id: parseInt(formData.lower_role_id),
          store_id: storeId
        }
      }
    });
  }, [navigate, storeId, formData.higher_role_id, formData.lower_role_id]);

  // Optimize the useEffect with proper dependency
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [formData, validationErrors]);

  if (!storeId) {
    return (
      <ManageLayout
        title="Validate Hierarchy"
        subtitle="Store ID is required to validate hierarchy"
        backButton={{
          show: true
        }}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Store ID is required to validate hierarchy.
          </AlertDescription>
        </Alert>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title="Validate Hierarchy"
      subtitle={`Check if a role hierarchy exists for store: ${storeId}${hierarchies.length > 0 ? ` (${hierarchies.length} existing hierarchies loaded)` : ''}`}
      backButton={{
        show: true,
      }}
    >
        {/* Error Alerts */}
        {validationErrors.general && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              {validationErrors.general}
            </AlertDescription>
          </Alert>
        )}
        
        {hierarchiesError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              Failed to load hierarchies: {hierarchiesError?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}
        
        {treeError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive text-sm sm:text-base">
              Failed to load hierarchy tree: {treeError?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {/* Role Selection Form */}
        <div className="space-y-6">
          {/* Higher Role Selection */}
          <RoleSelection
            title="Higher Role"
            description="Select the role that should be higher in the hierarchy (parent role)"
            icon="crown"
            roles={roles}
            selectedRoleId={formData.higher_role_id}
            disabledRoleId={formData.lower_role_id}
            isLoading={isLoading}
            validationError={validationErrors.higher_role_id}
            onRoleChange={(value) => handleRoleChange('higher_role_id', value)}
          />

          {/* Lower Role Selection */}
          <RoleSelection
            title="Lower Role"
            description="Select the role that should be lower in the hierarchy (child role)"
            icon="usercheck"
            roles={roles}
            selectedRoleId={formData.lower_role_id}
            disabledRoleId={formData.higher_role_id}
            isLoading={isLoading}
            validationError={validationErrors.lower_role_id}
            onRoleChange={(value) => handleRoleChange('lower_role_id', value)}
          />

          {/* Validation Section */}
          <ValidationSection
            isValidating={isValidating}
            isLoading={isLoading}
            canValidate={canValidate}
            validationResult={validationResult}
            hierarchiesCount={hierarchies.length}
            onValidate={handleValidate}
            onCreateHierarchy={handleCreateHierarchy}
            onRemoveHierarchy={handleRemoveHierarchy}
          />
        </div>
    </ManageLayout>
  );
};

export default ValidateHierarchyPage;
