// src/features/serviceClients/components/RotateTokenDialog.tsx

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useServiceClients } from '@/features/serviceClients/hooks/useServiceClients';
import type { ServiceClient } from '@/features/serviceClients/types';

interface RotateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceClient: ServiceClient | null;
  onSuccess?: (token: string) => void;
}

interface FormData {
  expires_at: string;
}

export const RotateTokenDialog: React.FC<RotateTokenDialogProps> = ({
  open,
  onOpenChange,
  serviceClient,
  onSuccess,
}) => {
  const { rotateToken, loading } = useServiceClients();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      expires_at: ''
    }
  });

  // Consolidated loading state
  const isLoading = isSubmitting || loading.rotating;

  const onSubmit = async (data: FormData) => {
    if (!serviceClient) return;
    
    // Clear previous errors
    setSubmitError(null);
    
    try {
      const token = await rotateToken(serviceClient.id, {
        expires_at: data.expires_at || undefined
      });
      
      if (token) {
        reset();
        onOpenChange(false);
        onSuccess?.(token);
      }
    } catch (error) {
      console.error('Failed to rotate token:', error);
      setSubmitError('Failed to rotate token. Please try again.');
    }
  };

  const validateExpirationDate = (value: string) => {
    if (!value) return true; // Optional field
    
    const selectedDate = new Date(value);
    
    // Check for invalid dates
    if (isNaN(selectedDate.getTime())) {
      return 'Please enter a valid date';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    
    if (selectedDate <= today) {
      return 'Expiration date must be in the future';
    }
    
    return true;
  };

  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      reset(); // Reset form when dialog closes
      setSubmitError(null); // Clear any error messages
    } else {
      // Clear errors when opening
      setSubmitError(null);
    }
    onOpenChange(open);
  }, [reset, onOpenChange]);

  if (!serviceClient) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Rotate Service Token</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Generate a new token for "{serviceClient.name}". The old token will be invalidated.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          {/* Error message display */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600" role="alert">
                {submitError}
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="expires_at" className="text-sm sm:text-base">
              New Expiration Date (Optional)
            </Label>
            <Input
              id="expires_at"
              type="date"
              {...register('expires_at', {
                validate: validateExpirationDate
              })}
              className="mt-1"
              aria-invalid={errors.expires_at ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.expires_at && (
              <p className="text-sm text-red-600 mt-1" role="alert">
                {errors.expires_at.message}
              </p>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleDialogClose(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? 'Rotating...' : 'Rotate Token'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
