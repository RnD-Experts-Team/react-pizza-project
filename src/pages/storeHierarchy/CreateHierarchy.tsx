/**
 * Create Hierarchy Page
 * 
 * Page for creating role hierarchies with radio group selection for higher and lower roles,
 * and optional metadata fields for created_by and reason.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCreateHierarchy } from '../../features/storeHierarchy/hooks/UseRoleHierarchy';
import { useRoles } from '../../features/roles/hooks/useRoles';
import type { CreateHierarchyRequest } from '../../features/storeHierarchy/types';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Header, CreateHierarchyForm } from '../../components/storeHierarchy/createHierarchy';

const CreateHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams<{ storeId: string }>();
  const { createHierarchy, isLoading, error } = useCreateHierarchy();
  const { roles, loading: rolesLoading } = useRoles();
  
  // Get preselected roles from navigation state (from validate page)
  const preselectedState = location.state as {
    preselectedHigherRole?: string;
    preselectedLowerRole?: string;
  } | null;
  
  // Form state
  const [formData, setFormData] = useState<{
    higher_role_id: string;
    lower_role_id: string;
    created_by: string;
    reason: string;
  }>({
    higher_role_id: preselectedState?.preselectedHigherRole || '',
    lower_role_id: preselectedState?.preselectedLowerRole || '',
    created_by: 'system',
    reason: ''
  });
  
  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(`/stores-hierarchy/${storeId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (field: 'higher_role_id' | 'lower_role_id', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!storeId) {
      setValidationErrors({ general: 'Store ID is required' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const hierarchyRequest: CreateHierarchyRequest = {
        higher_role_id: parseInt(formData.higher_role_id),
        lower_role_id: parseInt(formData.lower_role_id),
        store_id: storeId,
        metadata: {
          created_by: formData.created_by,
          reason: formData.reason || ''
        },
        is_active: true
      };
      
      await createHierarchy(hierarchyRequest);
      
      // Success - navigate back to store hierarchy detail page
      navigate(`/stores-hierarchy/${storeId}`);
    } catch (err) {
      console.error('Failed to create hierarchy:', err);
      setValidationErrors({ general: 'Failed to create hierarchy. Please try again.' });
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

  if (!storeId) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Alert variant="destructive" className="border-destructive/50 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            Store ID is required to create hierarchy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Header storeId={storeId} onBack={handleBack} />

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
          isLoading={isLoading}
          validationErrors={validationErrors}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onRoleChange={handleRoleChange}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
};

export default CreateHierarchyPage;