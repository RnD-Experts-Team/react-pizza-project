/**
 * StoreForm Component
 * Reusable form component for creating and editing stores
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
// Card components removed - using div wrapper instead
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import type { Store, CreateStorePayload, UpdateStorePayload } from '@/features/stores/types';

interface StoreFormProps {
  mode: 'create' | 'edit';
  initialData?: Store;
  onSubmit: (data: CreateStorePayload | UpdateStorePayload) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

interface FormData {
  id: string;
  name: string;
  phone: string;
  address: string;
  is_active: boolean;
}

interface FormErrors {
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
}

export const StoreForm: React.FC<StoreFormProps> = ({
  mode,
  initialData,
  onSubmit,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    phone: '',
    address: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        phone: initialData.metadata.phone || '',
        address: initialData.metadata.address || '',
        is_active: initialData.is_active,
      });
    }
  }, [mode, initialData]);

  // Validation function
  const validateField = (name: string, value: string | boolean): string | undefined => {
    switch (name) {
      case 'id':
        if (mode === 'create' && !value) {
          return 'Store ID is required';
        }
        if (mode === 'create' && typeof value === 'string' && value.length < 3) {
          return 'Store ID must be at least 3 characters';
        }
        break;
      case 'name':
        if (!value) {
          return 'Store name is required';
        }
        if (typeof value === 'string' && value.length < 2) {
          return 'Store name must be at least 2 characters';
        }
        break;
      case 'phone':
        if (value && typeof value === 'string') {
          const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return 'Please enter a valid phone number';
          }
        }
        break;
      case 'address':
        if (!value) {
          return 'Address is required';
        }
        if (typeof value === 'string' && value.length < 5) {
          return 'Address must be at least 5 characters';
        }
        break;
    }
    return undefined;
  };

  // Handle input changes
  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle input blur for validation
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      id: true,
      name: true,
      phone: true,
      address: true,
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'create') {
        const payload: CreateStorePayload = {
          id: formData.id,
          name: formData.name,
          metadata: {
            phone: formData.phone,
            address: formData.address,
          },
          is_active: formData.is_active,
        };
        await onSubmit(payload);
      } else {
        const payload: UpdateStorePayload = {
          name: formData.name,
          metadata: {
            phone: formData.phone,
            address: formData.address,
          },
          is_active: formData.is_active,
        };
        await onSubmit(payload);
      }
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          {mode === 'create' ? 'Store Information' : 'Edit Store Information'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === 'create' 
            ? 'Please fill in all required fields to create a new store.'
            : 'Update the store information below.'
          }
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Store ID - only for create mode */}
          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm sm:text-base font-medium text-foreground">
                Store ID *
              </Label>
              <Input
                id="id"
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                onBlur={() => handleBlur('id')}
                placeholder="Enter unique store ID"
                className={`w-full text-sm sm:text-base ${errors.id && touched.id ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background text-foreground`}
              />
              {errors.id && touched.id && (
                <p className="text-xs sm:text-sm text-destructive">{errors.id}</p>
              )}
            </div>
          )}

          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium text-foreground">
              Store Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Enter store name"
              className={`w-full text-sm sm:text-base ${errors.name && touched.name ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background text-foreground`}
            />
            {errors.name && touched.name && (
              <p className="text-xs sm:text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm sm:text-base font-medium text-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="Enter phone number"
              className={`w-full text-sm sm:text-base ${errors.phone && touched.phone ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background text-foreground`}
            />
            {errors.phone && touched.phone && (
              <p className="text-xs sm:text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm sm:text-base font-medium text-foreground">
              Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Enter store address"
              className={`w-full text-sm sm:text-base resize-none ${errors.address && touched.address ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring'} bg-background text-foreground`}
              rows={3}
            />
            {errors.address && touched.address && (
              <p className="text-xs sm:text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2 sm:space-x-3 py-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            />
            <Label htmlFor="is_active" className="text-sm sm:text-base font-medium text-foreground cursor-pointer">
              Store is active
            </Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
              className="w-full sm:w-auto order-2 sm:order-1 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 border-border hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto order-1 sm:order-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
              {mode === 'create' ? 'Create Store' : 'Update Store'}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default StoreForm;