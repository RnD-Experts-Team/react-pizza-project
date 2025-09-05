/**
 * Create Hierarchy Page
 * 
 * Page for creating role hierarchies with radio group selection for higher and lower roles,
 * and optional metadata fields for created_by and reason.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCreateHierarchy } from '@/features/storeHierarchy/hooks/UseRoleHierarchy';
import { useRoles } from '@/features/roles/hooks/useRoles';
import type { CreateHierarchyRequest } from '../types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { CreateHierarchyForm } from '@/features/storeHierarchy/components/createHierarchy';

// Constants
const DEFAULT_CREATED_BY = 'system';
const DEFAULT_IS_ACTIVE = true;

interface PreselectedState {
  preselectedHigherRole?: string;
  preselectedLowerRole?: string;
}

interface FormData {
  higher_role_id: string;
  lower_role_id: string;
  created_by: string;
  reason: string;
}

// Error component for missing store ID
const StoreIdRequiredError: React.FC = () => (
  <ManageLayout
    title="Create Hierarchy"
    subtitle="Store ID is required to create hierarchy"
    backButton={{ show: true }}
  >
    <Alert variant="destructive" className="border-destructive/50 text-destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm sm:text-base">
        Store ID is required to create hierarchy.
      </AlertDescription>
    </Alert>
  </ManageLayout>
);

// Main component content with guaranteed storeId
const CreateHierarchyPageContent: React.FC<{ storeId: string }> = ({ storeId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createHierarchy, isLoading, error } = useCreateHierarchy();
  const { roles, loading: rolesLoading } = useRoles();
  
  // Get preselected roles from navigation state (from validate page)
  const preselectedState = location.state as PreselectedState | null;
  
  // Memoized initial form data to optimize re-renders
  const initialFormData = useMemo<FormData>(() => ({
    higher_role_id: preselectedState?.preselectedHigherRole || '',
    lower_role_id: preselectedState?.preselectedLowerRole || '',
    created_by: DEFAULT_CREATED_BY,
    reason: ''
  }), [preselectedState?.preselectedHigherRole, preselectedState?.preselectedLowerRole]);
  
  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // UI state - using Record<string, string> to match component props
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized handlers to prevent unnecessary re-renders
  const handleBack = useCallback(() => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  }, [navigate, storeId]);

  const clearFieldError = useCallback((fieldName: string) => {
    setValidationErrors(prev => {
      if (prev[fieldName]) {
        const { [fieldName]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    clearFieldError(name);
  }, [clearFieldError]);

  const handleRoleChange = useCallback((field: 'higher_role_id' | 'lower_role_id', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    clearFieldError(field);
  }, [clearFieldError]);

  // Enhanced validation with better error handling
  const validateForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Validate higher role selection
    if (!formData.higher_role_id.trim()) {
      errors.higher_role_id = 'Please select a higher role';
    }
    
    // Validate lower role selection
    if (!formData.lower_role_id.trim()) {
      errors.lower_role_id = 'Please select a lower role';
    }
    
    // Validate role IDs are valid numbers
    const higherRoleId = Number(formData.higher_role_id);
    const lowerRoleId = Number(formData.lower_role_id);
    
    if (formData.higher_role_id && (isNaN(higherRoleId) || higherRoleId <= 0)) {
      errors.higher_role_id = 'Please select a valid higher role';
    }
    
    if (formData.lower_role_id && (isNaN(lowerRoleId) || lowerRoleId <= 0)) {
      errors.lower_role_id = 'Please select a valid lower role';
    }
    
    // Validate roles are different
    if (
      formData.higher_role_id && 
      formData.lower_role_id && 
      formData.higher_role_id === formData.lower_role_id
    ) {
      errors.lower_role_id = 'Higher role and lower role cannot be the same';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [formData.higher_role_id, formData.lower_role_id]);

  // Enhanced submit handler with better error handling
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({}); // Clear any existing errors
    
    try {
      // Parse and validate role IDs
      const higherRoleId = Number(formData.higher_role_id);
      const lowerRoleId = Number(formData.lower_role_id);
      
      // Double-check parsing (shouldn't happen due to validation, but good defensive programming)
      if (isNaN(higherRoleId) || isNaN(lowerRoleId)) {
        throw new Error('Invalid role selection');
      }

      const hierarchyRequest: CreateHierarchyRequest = {
        higher_role_id: higherRoleId,
        lower_role_id: lowerRoleId,
        store_id: storeId,
        metadata: {
          created_by: formData.created_by.trim() || DEFAULT_CREATED_BY,
          reason: formData.reason.trim()
        },
        is_active: DEFAULT_IS_ACTIVE
      };
      
      await createHierarchy(hierarchyRequest);
      
      // Success - navigate back to store hierarchy detail page
      navigate(`/stores-hierarchy/view/${storeId}`);
    } catch (err) {
      console.error('Failed to create hierarchy:', err);
      
      // More specific error handling
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create hierarchy. Please try again.';
      
      setValidationErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, storeId, validateForm, createHierarchy, navigate]);

  // Compute combined loading state
  const isAnyLoading = isLoading || rolesLoading || isSubmitting;

  return (
    <ManageLayout
      title="Create Hierarchy"
      subtitle={`Create a new role hierarchy for store: ${storeId}`}
      backButton={{
        show: true,
      }}
    >
      {/* Error Alert */}
      {(error || validationErrors.general) && (
        <Alert variant="destructive" className="border-destructive/50 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            {error?.message || validationErrors.general}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <CreateHierarchyForm
        formData={formData}
        roles={roles}
        rolesLoading={rolesLoading}
        isSubmitting={isSubmitting}
        isLoading={isAnyLoading}
        validationErrors={validationErrors}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onRoleChange={handleRoleChange}
        onCancel={handleBack}
      />
    </ManageLayout>
  );
};

// Main component with proper parameter validation
const CreateHierarchyPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  
  // Early return for missing storeId with proper error handling
  if (!storeId) {
    return <StoreIdRequiredError />;
  }

  // Now TypeScript knows storeId is defined
  return <CreateHierarchyPageContent storeId={storeId} />;
};

export default CreateHierarchyPage;
