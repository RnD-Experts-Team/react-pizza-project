/**
 * CreateStorePage Component
 * Standalone page for creating new stores with form validation
 * and proper error handling using shadcn/ui components
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Store management imports
import { useStoreOperations } from '../../features/stores/hooks/useStores';
import type { CreateStorePayload } from '../../features/stores/types';

/**
 * Form data interface
 */
interface FormData {
  id: string;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

/**
 * Form errors interface
 */
interface FormErrors {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
}

/**
 * Props for the CreateStorePage component
 */
interface CreateStorePageProps {
  existingStoreIds?: string[];
}

/**
 * CreateStorePage component
 */
export const CreateStorePage: React.FC<CreateStorePageProps> = ({
  existingStoreIds = [],
}) => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    address: '',
    phone: '',
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store operations hook
  const {
    createStore,
    loading,
    errors,
  } = useStoreOperations();

  // Generate next available store ID
  const generateNextStoreId = useCallback(() => {
    const existingNumbers = existingStoreIds
      .map(id => {
        const match = id.match(/^STORE_(\d{3})$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `STORE_${nextNumber.toString().padStart(3, '0')}`;
  }, [existingStoreIds]);

  // Set generated ID on component mount
  useEffect(() => {
    if (!formData.id) {
      setFormData(prev => ({
        ...prev,
        id: generateNextStoreId()
      }));
    }
  }, [formData.id, generateNextStoreId]);

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validate Store ID
    if (!formData.id.trim()) {
      errors.id = 'Store ID is required';
    } else if (!/^STORE_\d{3}$/.test(formData.id)) {
      errors.id = 'Store ID must follow format STORE_XXX (e.g., STORE_001)';
    } else if (existingStoreIds.includes(formData.id)) {
      errors.id = 'Store ID already exists';
    }

    // Validate Store Name
    if (!formData.name.trim()) {
      errors.name = 'Store name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Store name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Store name must not exceed 100 characters';
    }

    // Validate Address
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    } else if (formData.address.trim().length > 200) {
      errors.address = 'Address must not exceed 200 characters';
    }

    // Validate Phone
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        errors.phone = 'Phone number must be at least 10 digits';
      } else if (phoneDigits.length > 20) {
        errors.phone = 'Phone number must not exceed 20 digits';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Format phone number for display
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) {
      const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      // Add extension if there are more digits
      if (digits.length > 10) {
        return `${formatted} ext. ${digits.slice(10)}`;
      }
      return formatted;
    }
    return value;
  };

  // Handle phone input change with formatting
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneDisplay(value);
    handleInputChange('phone', formatted);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to API payload
      const payload: CreateStorePayload = {
        id: formData.id.trim(),
        name: formData.name.trim(),
        metadata: {
          address: formData.address.trim(),
          phone: formData.phone.replace(/\D/g, ''), // Remove non-digits for API
        },
        is_active: formData.is_active,
      };

      const result = await createStore(payload);

      if (result.success) {
        // Navigate back to stores list
        navigate('/stores', { 
          state: { 
            message: `Store "${result.store?.name || formData.name}" created successfully!`,
            type: 'success'
          }
        });
      } else {
        // Handle API errors returned by the hook
        console.error('Failed to create store:', result.message);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error creating store:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    navigate('/stores');
  };

  const isLoading = loading.create || isSubmitting;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Store</h1>
          <p className="text-muted-foreground">
            Add a new store location to your system
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Fill in the details for the new store. All fields are required.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store ID Field */}
            <div className="space-y-2">
              <Label htmlFor="store-id">Store ID</Label>
              <Input
                id="store-id"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="STORE_001"
                className="font-mono"
                disabled={isLoading}
                aria-invalid={!!formErrors.id}
                aria-describedby={formErrors.id ? "store-id-error" : "store-id-description"}
              />
              <p className="text-sm text-muted-foreground">
                Unique identifier for the store (format: STORE_XXX)
              </p>
              {formErrors.id && (
                <p id="store-id-error" className="text-sm text-red-500" role="alert">{formErrors.id}</p>
              )}
            </div>

            {/* Store Name Field */}
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Downtown Location"
                disabled={isLoading}
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? "store-name-error" : "store-name-description"}
              />
              <p className="text-sm text-muted-foreground">
                Display name for the store location
              </p>
              {formErrors.name && (
                <p id="store-name-error" className="text-sm text-red-500" role="alert">{formErrors.name}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="store-address">Address</Label>
              <Textarea
                id="store-address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street, City, State 12345"
                className="min-h-[80px]"
                disabled={isLoading}
                aria-invalid={!!formErrors.address}
                aria-describedby={formErrors.address ? "store-address-error" : "store-address-description"}
              />
              <p className="text-sm text-muted-foreground">
                Full address of the store location
              </p>
              {formErrors.address && (
                <p id="store-address-error" className="text-sm text-red-500" role="alert">{formErrors.address}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="store-phone">Phone Number</Label>
              <Input
                id="store-phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
                type="tel"
                disabled={isLoading}
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? "store-phone-error" : "store-phone-description"}
              />
              <p className="text-sm text-muted-foreground">
                Contact phone number for the store
              </p>
              {formErrors.phone && (
                <p id="store-phone-error" className="text-sm text-red-500" role="alert">{formErrors.phone}</p>
              )}
            </div>

            {/* Active Status Field */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="store-active" className="text-base">Active Store</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this store for operations and display
                </p>
              </div>
              <Switch
                id="store-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                disabled={isLoading}
              />
            </div>

            {/* Error Display */}
            {errors.create && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errors.create}
                </AlertDescription>
              </Alert>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                <Save className="h-4 w-4 mr-2" />
                Create Store
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStorePage;