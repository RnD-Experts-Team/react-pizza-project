/**
 * EditStoreDialog Component
 * Modal dialog for editing existing stores with form validation
 * and proper error handling using shadcn/ui components
 */

import React, { useState, useEffect } from 'react';
import { Loader2, Edit } from 'lucide-react';

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
import type { Store, UpdateStorePayload } from '../../features/stores/types';

/**
 * Form data interface
 */
interface FormData {
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

/**
 * Form errors interface
 */
interface FormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

/**
 * Props for the EditStoreDialog component
 */
interface EditStoreDialogProps {
  store: Store | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (store: Store) => void;
  triggerButton?: React.ReactNode;
}

/**
 * EditStoreDialog component
 */
export const EditStoreDialog: React.FC<EditStoreDialogProps> = ({
  store,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
  triggerButton,
}) => {
  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    phone: '',
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  // Store operations hook
  const {
    updateStore,
    loading,
    errors,
    reset: resetStoreOperations,
  } = useStoreOperations();

  // Initialize form data when store changes
  useEffect(() => {
    if (store && isOpen) {
      const initialData = {
        name: store.name,
        address: store.metadata.address,
        phone: formatPhoneDisplay(store.metadata.phone),
        is_active: store.is_active,
      };
      
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [store, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        address: '',
        phone: '',
        is_active: true,
      });
      setFormErrors({});
      setIsSubmitting(false);
      setHasChanges(false);
      resetStoreOperations();
    }
  }, [isOpen, resetStoreOperations]);

  // Check for changes
  useEffect(() => {
    if (store) {
      const currentPhone = formatPhoneDisplay(store.metadata.phone);
      const changed = 
        formData.name !== store.name ||
        formData.address !== store.metadata.address ||
        formData.phone !== currentPhone ||
        formData.is_active !== store.is_active;
      
      setHasChanges(changed);
    }
  }, [formData, store]);

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

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
    
    if (!store) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      // No changes, just close the dialog
      setIsOpen(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to API payload
      const payload: UpdateStorePayload = {
        name: formData.name.trim(),
        metadata: {
          address: formData.address.trim(),
          phone: formData.phone.replace(/\D/g, ''), // Remove non-digits for API
        },
        is_active: formData.is_active,
      };

      const result = await updateStore(store.id, payload);

      if (result.success) {
        // Close dialog and notify parent
        setIsOpen(false);
        onSuccess?.(result.store!);
      }
    } catch (error) {
      console.error('Failed to update store:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close with unsaved changes warning
  const handleClose = () => {
    if (loading.update || isSubmitting) return; // Prevent closing during submission
    
    if (hasChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      );
      if (!confirmClose) return;
    }
    
    setIsOpen(false);
  };

  // Handle reset form
  const handleReset = () => {
    if (store) {
      const initialData = {
        name: store.name,
        address: store.metadata.address,
        phone: formatPhoneDisplay(store.metadata.phone),
        is_active: store.is_active,
      };
      
      setFormData(initialData);
      setFormErrors({});
      setHasChanges(false);
    }
  };

  const renderTrigger = () => {
    if (triggerButton) {
      return triggerButton;
    }

    return (
      <Button variant="outline" size="sm" disabled={!store}>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
    );
  };

  const isLoading = loading.update || isSubmitting;

  // Don't render if no store provided
  if (!store && isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {renderTrigger()}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>
            Update the store information. Changes will be saved when you click "Save Changes".
          </DialogDescription>
        </DialogHeader>

        {store && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              Editing Store: <span className="font-mono font-bold text-foreground">{store.id}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Changes Indicator */}
          {hasChanges && (
            <Alert>
              <AlertDescription>
                You have unsaved changes that will be lost if you close this dialog.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {errors.update && (
            <Alert variant="destructive">
              <AlertDescription>
                {errors.update}
              </AlertDescription>
            </Alert>
          )}

          {/* Dialog Footer */}
          <DialogFooter className="gap-2">
            <div className="flex items-center gap-2 flex-1">
              {hasChanges && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              )}
            </div>
            
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
              disabled={isLoading || !hasChanges}
            >
              {isLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStoreDialog;
