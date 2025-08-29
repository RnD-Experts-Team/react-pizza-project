// src/features/serviceClients/components/RotateTokenDialog.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useServiceClients } from '../../features/serviceClients/hooks/useServiceClients';
import type { ServiceClient } from '../../features/serviceClients/types';

interface RotateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceClient: ServiceClient | null;
  onSuccess?: (token: string) => void;
}

export const RotateTokenDialog: React.FC<RotateTokenDialogProps> = ({
  open,
  onOpenChange,
  serviceClient,
  onSuccess,
}) => {
  const { rotateToken, loading } = useServiceClients();
  
  const [form, setForm] = useState({
    expires_at: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceClient) return;
    
    const token = await rotateToken(serviceClient.id, {
      expires_at: form.expires_at || undefined
    });
    
    if (token) {
      setForm({ expires_at: '' });
      onOpenChange(false);
      onSuccess?.(token);
    }
  };

  if (!serviceClient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Rotate Service Token</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Generate a new token for "{serviceClient.name}". The old token will be invalidated.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="expires_at" className="text-sm sm:text-base">New Expiration Date (Optional)</Label>
            <Input
              id="expires_at"
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm(prev => ({ ...prev, expires_at: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading.rotating}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {loading.rotating ? 'Rotating...' : 'Rotate Token'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
