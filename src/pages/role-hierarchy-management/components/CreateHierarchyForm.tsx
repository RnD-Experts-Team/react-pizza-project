import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { CreateRoleHierarchyRequest } from '../../../types/roleHierarchy';
import type { Role } from '../../../types/authTypes';
import { Loader2 } from 'lucide-react';

interface CreateHierarchyFormProps {
  storeId: string;
  roles: Role[];
  onSubmit: (data: CreateRoleHierarchyRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CreateHierarchyForm: React.FC<CreateHierarchyFormProps> = ({
  storeId,
  roles,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateRoleHierarchyRequest>({
    higher_role_id: 0,
    lower_role_id: 0,
    store_id: storeId,
    metadata: {
      created_by: 'system',
      reason: '',
    },
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.higher_role_id || formData.higher_role_id === 0) {
      newErrors.higher_role_id = 'Higher role is required';
    }

    if (!formData.lower_role_id || formData.lower_role_id === 0) {
      newErrors.lower_role_id = 'Lower role is required';
    }

    if (formData.higher_role_id === formData.lower_role_id) {
      newErrors.lower_role_id = 'Lower role must be different from higher role';
    }

    if (!formData.metadata?.reason?.trim()) {
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleRoleChange = (field: 'higher_role_id' | 'lower_role_id', value: string) => {
    const roleId = parseInt(value);
    setFormData(prev => ({
      ...prev,
      [field]: roleId,
    }));
    
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        if (field === 'lower_role_id' && prev.lower_role_id?.includes('different')) {
          delete newErrors.lower_role_id;
        }
        return newErrors;
      });
    }
  };

  const handleMetadataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
    
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getAvailableRoles = (excludeRoleId?: number) => {
    return roles.filter(role => role.id !== excludeRoleId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Higher Role */}
        <div className="space-y-2">
          <Label htmlFor="higher-role">Higher Role *</Label>
          <Select
            value={formData.higher_role_id.toString()}
            onValueChange={(value) => handleRoleChange('higher_role_id', value)}
          >
            <SelectTrigger className={errors.higher_role_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select higher role" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableRoles(formData.lower_role_id || undefined).map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.higher_role_id && (
            <p className="text-sm text-red-500">{errors.higher_role_id}</p>
          )}
        </div>

        {/* Lower Role */}
        <div className="space-y-2">
          <Label htmlFor="lower-role">Lower Role *</Label>
          <Select
            value={formData.lower_role_id.toString()}
            onValueChange={(value) => handleRoleChange('lower_role_id', value)}
          >
            <SelectTrigger className={errors.lower_role_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select lower role" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableRoles(formData.higher_role_id || undefined).map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lower_role_id && (
            <p className="text-sm text-red-500">{errors.lower_role_id}</p>
          )}
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Provide additional context for this hierarchy relationship
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this hierarchy relationship is needed..."
              value={formData.metadata?.reason || ''}
              onChange={(e) => handleMetadataChange('reason', e.target.value)}
              className={errors.reason ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="created-by">Created By</Label>
            <Input
              id="created-by"
              value={formData.metadata?.created_by || ''}
              onChange={(e) => handleMetadataChange('created_by', e.target.value)}
              placeholder="Enter creator name"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Hierarchy
        </Button>
      </div>
    </form>
  );
};

export default CreateHierarchyForm;