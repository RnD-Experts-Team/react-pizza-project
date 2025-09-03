import { useState, useCallback } from 'react';
import type { HttpMethod } from '@/features/authorizationRules/types';

interface FormData {
  service: string;
  method: HttpMethod;
  pathType: 'dsl' | 'route';
  pathDsl: string;
  routeName: string;
  isActive: boolean;
}

interface AuthorizationData {
  selectedRoles: string[];
  selectedPermissionsAny: string[];
  selectedPermissionsAll: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

export const useAuthRuleFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Clear validation error for a specific field
  const clearFieldError = useCallback((field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [validationErrors]);

  // Clear authorization validation error
  const clearAuthorizationError = useCallback(() => {
    if (validationErrors.authorization) {
      setValidationErrors(prev => ({ ...prev, authorization: '' }));
    }
  }, [validationErrors]);

  // Validate form data
  const validateForm = useCallback((
    formData: FormData,
    authorizationData: AuthorizationData
  ): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Required fields
    if (!formData.service.trim()) {
      errors.service = 'Service is required';
    }

    if (!formData.method) {
      errors.method = 'HTTP method is required';
    }

    // Path validation
    if (formData.pathType === 'dsl' && !formData.pathDsl.trim()) {
      errors.pathDsl = 'Path DSL is required when using DSL type';
    }

    if (formData.pathType === 'route' && !formData.routeName.trim()) {
      errors.routeName = 'Route name is required when using route type';
    }

    // Authorization validation
    const { selectedRoles, selectedPermissionsAny, selectedPermissionsAll } = authorizationData;
    if (selectedRoles.length === 0 && selectedPermissionsAny.length === 0 && selectedPermissionsAll.length === 0) {
      errors.authorization = 'At least one role or permission is required';
    }

    return errors;
  }, []);

  // Set validation errors
  const setErrors = useCallback((errors: ValidationErrors) => {
    setValidationErrors(errors);
  }, []);

  // Check if form has errors
  const hasErrors = useCallback(() => {
    return Object.keys(validationErrors).some(key => validationErrors[key]);
  }, [validationErrors]);

  // Get error for specific field
  const getFieldError = useCallback((field: string) => {
    return validationErrors[field] || '';
  }, [validationErrors]);

  return {
    validationErrors,
    clearFieldError,
    clearAuthorizationError,
    validateForm,
    setErrors,
    hasErrors,
    getFieldError,
  };
};