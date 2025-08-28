/**
 * StoreForm Component
 * Reusable form component for creating and editing stores
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import type { Store, CreateStorePayload, UpdateStorePayload } from '../../features/stores/types';

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create New Store' : 'Edit Store'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store ID - only for create mode */}
          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="id">Store ID *</Label>
              <Input
                id="id"
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                onBlur={() => handleBlur('id')}
                placeholder="Enter unique store ID"
                className={errors.id && touched.id ? 'border-destructive' : ''}
              />
              {errors.id && touched.id && (
                <p className="text-sm text-destructive">{errors.id}</p>
              )}
            </div>
          )}

          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Enter store name"
              className={errors.name && touched.name ? 'border-destructive' : ''}
            />
            {errors.name && touched.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="Enter phone number"
              className={errors.phone && touched.phone ? 'border-destructive' : ''}
            />
            {errors.phone && touched.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Enter store address"
              className={errors.address && touched.address ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.address && touched.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Store is active</Label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Store' : 'Update Store'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StoreForm;