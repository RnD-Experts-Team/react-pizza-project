/**
 * CreateStoreDialog Component
 * Simple modal dialog for creating new stores with basic form validation
 * and proper error handling using shadcn/ui components
 */

import React, { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';

// shadcn/ui imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

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
 * Props for the CreateStoreDialog component
 */
interface CreateStoreDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (store: any) => void;
  triggerButton?: React.ReactNode;
  existingStoreIds?: string[];
}

/**
 * CreateStoreDialog component
 */
export const CreateStoreDialog: React.FC<CreateStoreDialogProps> = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
  triggerButton,
  existingStoreIds = [],
}) => {
  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false);
  
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

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  // Store operations hook
  const {
    createStore,
    loading,
    errors,
    reset: resetStoreOperations,
  } = useStoreOperations();

  // Generate next available store ID
  const generateNextStoreId = () => {
    const existingNumbers = existingStoreIds
      .map(id => {
        const match = id.match(/^STORE_(\d{3})$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `STORE_${nextNumber.toString().padStart(3, '0')}`;
  };

  // Set generated ID when dialog opens
  useEffect(() => {
    if (isOpen && !formData.id) {
      setFormData(prev => ({
        ...prev,
        id: generateNextStoreId()
      }));
    }
  }, [isOpen, existingStoreIds]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        id: '',
        name: '',
        address: '',
        phone: '',
        is_active: true,
      });
      setFormErrors({});
      setIsSubmitting(false);
      resetStoreOperations();
    }
  }, [isOpen, resetStoreOperations]);

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
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
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
        // Close dialog and notify parent
        setIsOpen(false);
        onSuccess?.(result.store);
      }
    } catch (error) {
      console.error('Failed to create store:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (loading.create || isSubmitting) return; // Prevent closing during submission
    setIsOpen(false);
  };

  const renderTrigger = () => {
    if (triggerButton) {
      return triggerButton;
    }

    return (
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create Store
      </Button>
    );
  };

  const isLoading = loading.create || isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {renderTrigger()}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Add a new store location to your system. All fields are required.
          </DialogDescription>
        </DialogHeader>

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
            />
            <p className="text-sm text-muted-foreground">
              Unique identifier for the store (format: STORE_XXX)
            </p>
            {formErrors.id && (
              <p className="text-sm text-red-500">{formErrors.id}</p>
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
            />
            <p className="text-sm text-muted-foreground">
              Display name for the store location
            </p>
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
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
            />
            <p className="text-sm text-muted-foreground">
              Full address of the store location
            </p>
            {formErrors.address && (
              <p className="text-sm text-red-500">{formErrors.address}</p>
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
            />
            <p className="text-sm text-muted-foreground">
              Contact phone number for the store
            </p>
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
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

          {/* Dialog Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
              Create Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreDialog;
