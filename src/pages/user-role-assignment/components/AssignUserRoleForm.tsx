import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { useToast } from '../../../hooks/use-toast';
import { useReduxUserRoleStoreAssignment } from '../../../hooks/useReduxUserRoleStoreAssignment';
import { useUserManagement } from '../../../hooks/useReduxUserManagement';
import { useStoreManagement } from '../../../hooks/useReduxStoreManagement';
import type { AssignUserRoleToStoreRequest } from '../../../types/userRoleStoreAssignment';
import { Loader2 } from 'lucide-react';

interface AssignUserRoleFormProps {
  onClose: () => void;
  initialData?: Partial<AssignUserRoleToStoreRequest>;
}

const AssignUserRoleForm: React.FC<AssignUserRoleFormProps> = ({ onClose, initialData }) => {
  const { toast } = useToast();
  const { assignUserRoleToStore, assignmentLoading } = useReduxUserRoleStoreAssignment();
  const { state: { users, roles }, actions: { fetchUsers, fetchRoles } } = useUserManagement();
  const { state: { stores }, actions: { fetchStores } } = useStoreManagement();

  const [formData, setFormData] = useState<AssignUserRoleToStoreRequest>({
    user_id: initialData?.user_id || 0,
    role_id: initialData?.role_id || 0,
    store_id: initialData?.store_id || '',
    metadata: {
      start_date: initialData?.metadata?.start_date || '',
      notes: initialData?.metadata?.notes || '',
    },
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchStores();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a user';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Please select a role';
    }

    if (!formData.store_id) {
      newErrors.store_id = 'Please select a store';
    }

    if (formData.metadata?.start_date) {
      const startDate = new Date(formData.metadata.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.start_date = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clean up metadata - remove empty values
    const cleanMetadata = Object.fromEntries(
      Object.entries(formData.metadata || {}).filter(([_, value]) => value !== '')
    );

    const submitData = {
      ...formData,
      metadata: Object.keys(cleanMetadata).length > 0 ? cleanMetadata : undefined,
    };

    const result = await assignUserRoleToStore(submitData);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'User role assigned to store successfully',
      });
      onClose();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to assign user role to store',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('metadata.')) {
      const metadataField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const selectedUser = users.find(user => user.id === formData.user_id);
  const selectedRole = roles.find(role => role.id === formData.role_id);
  const selectedStore = stores.find(store => store.id === formData.store_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Assign User Role to Store</DialogTitle>
        <DialogDescription>
          Assign a specific role to a user for a particular store. This will grant the user permissions associated with the role in that store.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="user_id">User *</Label>
          <Select
            value={formData.user_id.toString()}
            onValueChange={(value) => handleInputChange('user_id', parseInt(value))}
          >
            <SelectTrigger className={errors.user_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.user_id && (
            <p className="text-sm text-red-500">{errors.user_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role_id">Role *</Label>
          <Select
            value={formData.role_id.toString()}
            onValueChange={(value) => handleInputChange('role_id', parseInt(value))}
          >
            <SelectTrigger className={errors.role_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role_id && (
            <p className="text-sm text-red-500">{errors.role_id}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="store_id">Store *</Label>
        <Select
          value={formData.store_id}
          onValueChange={(value) => handleInputChange('store_id', value)}
        >
          <SelectTrigger className={errors.store_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{store.name}</span>
                  <span className="text-sm text-muted-foreground">{store.id}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.store_id && (
          <p className="text-sm text-red-500">{errors.store_id}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.metadata?.start_date || ''}
            onChange={(e) => handleInputChange('metadata.start_date', e.target.value)}
            className={errors.start_date ? 'border-red-500' : ''}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.start_date && (
            <p className="text-sm text-red-500">{errors.start_date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_active">Status</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active" className="text-sm">
              {formData.is_active ? 'Active' : 'Inactive'}
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes about this assignment..."
          value={formData.metadata?.notes || ''}
          onChange={(e) => handleInputChange('metadata.notes', e.target.value)}
          rows={3}
        />
      </div>

      {/* Assignment Summary */}
      {selectedUser && selectedRole && selectedStore && (
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Assignment Summary</h4>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">User:</span> {selectedUser.name} ({selectedUser.email})</p>
            <p><span className="font-medium">Role:</span> {selectedRole.name}</p>
            <p><span className="font-medium">Store:</span> {selectedStore.name} ({selectedStore.id})</p>
            <p><span className="font-medium">Status:</span> {formData.is_active ? 'Active' : 'Inactive'}</p>
            {formData.metadata?.start_date && (
              <p><span className="font-medium">Start Date:</span> {new Date(formData.metadata.start_date).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={assignmentLoading}>
          {assignmentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assign Role
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AssignUserRoleForm;