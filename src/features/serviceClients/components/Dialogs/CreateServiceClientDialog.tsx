// src/features/serviceClients/components/CreateServiceClientDialog.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useServiceClients } from '@/features/serviceClients/hooks/useServiceClients';

// Constants
const FORM_DEFAULTS = {
  name: '',
  is_active: true,
  expires_at: '',
  notes: ''
};

const MAX_NOTES_LENGTH = 500;
const WARNING_DAYS_THRESHOLD = 7;

interface CreateServiceClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (token: string) => void;
}

interface FormErrors {
  name?: string;
  expires_at?: string;
  notes?: string;
}

export const CreateServiceClientDialog: React.FC<CreateServiceClientDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { createClient, loading } = useServiceClients();
  
  const [form, setForm] = useState(FORM_DEFAULTS);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);

  // Real-time validation that runs whenever form changes
  const currentErrors = useMemo((): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    // Expiration date validation
    if (form.expires_at) {
      const expiryDate = new Date(form.expires_at);
      const now = new Date();
      
      if (expiryDate <= now) {
        newErrors.expires_at = 'Expiration date must be in the future';
      }
    }
    
    // Notes validation
    if (form.notes && form.notes.length > MAX_NOTES_LENGTH) {
      newErrors.notes = `Notes must be ${MAX_NOTES_LENGTH} characters or less`;
    }
    
    return newErrors;
  }, [form]);

  // Update displayed errors whenever currentErrors change
  useEffect(() => {
    setErrors(currentErrors);
  }, [currentErrors]);

  const validateForm = useCallback((): boolean => {
    return Object.keys(currentErrors).length === 0;
  }, [currentErrors]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, name: value }));
  }, []);

  const handleActiveChange = useCallback((checked: boolean) => {
    setForm(prev => ({ ...prev, is_active: checked }));
  }, []);

  const handleExpiresAtChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, expires_at: value }));
  }, []);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, notes: value }));
  }, []);

  const handleCancel = useCallback(() => {
    setForm(FORM_DEFAULTS);
    setErrors({});
    setError(null);
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    // Show confirmation if expiration date is within warning threshold
    if (form.expires_at) {
      const expiryDate = new Date(form.expires_at);
      const daysDiff = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= WARNING_DAYS_THRESHOLD) {
        const message = daysDiff === 1 
          ? 'This token will expire tomorrow. Continue?' 
          : `This token will expire in ${daysDiff} days. Continue?`;
        
        const confirmed = window.confirm(message);
        if (!confirmed) return;
      }
    }
    
    try {
      const token = await createClient({
        ...form,
        name: form.name.trim(),
        expires_at: form.expires_at || null
      });
      
      if (token) {
        setForm(FORM_DEFAULTS);
        setErrors({});
        setError(null);
        onOpenChange(false);
        onSuccess?.(token);
      }
    } catch (err) {
      console.error('Failed to create service client:', err);
      setError('Failed to create service client. Please try again.');
    }
  };

  const remainingCharacters = MAX_NOTES_LENGTH - form.notes.length;
  
  // Only disable submit button during loading, not for validation errors
  const isSubmitDisabled = loading.creating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create Service Client</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new API service client with authentication token
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm sm:text-base">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Enter service client name"
              className={`mt-1 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.is_active}
              onCheckedChange={handleActiveChange}
            />
            <Label htmlFor="is_active" className="text-sm sm:text-base">Active</Label>
          </div>
          
          <div>
            <Label htmlFor="expires_at" className="text-sm sm:text-base">Expires At (Optional)</Label>
            <Input
              id="expires_at"
              type="date"
              value={form.expires_at}
              onChange={handleExpiresAtChange}
              className={`mt-1 ${errors.expires_at ? 'border-red-500 focus:border-red-500' : ''}`}
              aria-describedby={errors.expires_at ? "expires-error" : undefined}
            />
            {errors.expires_at && (
              <p id="expires-error" className="text-red-500 text-xs mt-1">
                {errors.expires_at}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-sm sm:text-base">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={handleNotesChange}
              placeholder="Enter notes about this service client"
              rows={3}
              className={`mt-1 resize-none ${errors.notes ? 'border-red-500 focus:border-red-500' : ''}`}
              maxLength={MAX_NOTES_LENGTH}
              aria-describedby={errors.notes ? "notes-error" : "notes-count"}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.notes ? (
                <p id="notes-error" className="text-red-500 text-xs">
                  {errors.notes}
                </p>
              ) : (
                <span></span>
              )}
              <span 
                id="notes-count" 
                className={`text-xs ${remainingCharacters < 50 ? 'text-orange-500' : 'text-gray-500'}`}
              >
                {remainingCharacters} characters remaining
              </span>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="w-full sm:w-auto order-2 sm:order-1"
              disabled={loading.creating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {loading.creating ? 'Creating...' : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
