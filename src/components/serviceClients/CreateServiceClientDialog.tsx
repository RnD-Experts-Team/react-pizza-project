// src/features/serviceClients/components/CreateServiceClientDialog.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useServiceClients } from '../../features/serviceClients/hooks/useServiceClients';

interface CreateServiceClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (token: string) => void;
}

export const CreateServiceClientDialog: React.FC<CreateServiceClientDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { createClient, loading } = useServiceClients();
  
  const [form, setForm] = useState({
    name: '',
    is_active: true,
    expires_at: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = await createClient({
      ...form,
      expires_at: form.expires_at || null
    });
    
    if (token) {
      setForm({ name: '', is_active: true, expires_at: '', notes: '' });
      onOpenChange(false);
      onSuccess?.(token);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create Service Client</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new API service client with authentication token
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter service client name"
              required
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active" className="text-sm sm:text-base">Active</Label>
          </div>
          
          <div>
            <Label htmlFor="expires_at" className="text-sm sm:text-base">Expires At (Optional)</Label>
            <Input
              id="expires_at"
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm(prev => ({ ...prev, expires_at: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-sm sm:text-base">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter notes about this service client"
              rows={3}
              className="mt-1 resize-none"
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
              disabled={loading.creating}
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
