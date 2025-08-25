import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../hooks/use-toast';
import { useReduxUserRoleStoreAssignment } from '../../../hooks/useReduxUserRoleStoreAssignment';
import { useUserManagement } from '../../../hooks/useReduxUserManagement';
import { useStoreManagement } from '../../../hooks/useReduxStoreManagement';
import type { BulkAssignUserRolesRequest, BulkAssignmentItem } from '../../../types/userRoleStoreAssignment';
import { Loader2, Plus, Trash2, Store, UserCheck } from 'lucide-react';

interface BulkAssignmentFormProps {
  onClose: () => void;
  initialUserId?: number;
}

const BulkAssignmentForm: React.FC<BulkAssignmentFormProps> = ({ onClose, initialUserId }) => {
  const { toast } = useToast();
  const { bulkAssignUserRoles, bulkAssignLoading } = useReduxUserRoleStoreAssignment();
  const { state: { users, roles }, actions: { fetchUsers, fetchRoles } } = useUserManagement();
  const { state: { stores }, actions: { fetchStores } } = useStoreManagement();

  const [selectedUserId, setSelectedUserId] = useState<number>(initialUserId || 0);
  const [assignments, setAssignments] = useState<BulkAssignmentItem[]>([
    {
      role_id: 0,
      store_id: '',
      metadata: {},
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchStores();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedUserId) {
      newErrors.user_id = 'Please select a user';
    }

    if (assignments.length === 0) {
      newErrors.assignments = 'Please add at least one assignment';
    }

    assignments.forEach((assignment, index) => {
      if (!assignment.role_id) {
        newErrors[`assignment_${index}_role`] = 'Please select a role';
      }
      if (!assignment.store_id) {
        newErrors[`assignment_${index}_store`] = 'Please select a store';
      }
    });

    // Check for duplicate store assignments
    const storeIds = assignments.map(a => a.store_id).filter(Boolean);
    const duplicateStores = storeIds.filter((store, index) => storeIds.indexOf(store) !== index);
    if (duplicateStores.length > 0) {
      newErrors.duplicates = 'Cannot assign the same store multiple times';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clean up assignments - remove empty metadata
    const cleanAssignments = assignments.map(assignment => ({
      ...assignment,
      metadata: Object.fromEntries(
        Object.entries(assignment.metadata || {}).filter(([_, value]) => value !== '')
      ),
    }));

    const submitData: BulkAssignUserRolesRequest = {
      user_id: selectedUserId,
      assignments: cleanAssignments,
    };

    const result = await bulkAssignUserRoles(submitData);

    if (result.success) {
      toast({
        title: 'Success',
        description: `Successfully assigned ${assignments.length} role(s) to user`,
      });
      onClose();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to bulk assign user roles',
        variant: 'destructive',
      });
    }
  };

  const addAssignment = () => {
    setAssignments(prev => [
      ...prev,
      {
        role_id: 0,
        store_id: '',
        metadata: {},
      },
    ]);
  };

  const removeAssignment = (index: number) => {
    if (assignments.length > 1) {
      setAssignments(prev => prev.filter((_, i) => i !== index));
      // Clear related errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`assignment_${index}_role`];
        delete newErrors[`assignment_${index}_store`];
        return newErrors;
      });
    }
  };

  const updateAssignment = (index: number, field: keyof BulkAssignmentItem, value: any) => {
    setAssignments(prev => {
      const updated = [...prev];
      if (field === 'metadata') {
        updated[index] = {
          ...updated[index],
          metadata: {
            ...updated[index].metadata,
            ...value,
          },
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }
      return updated;
    });

    // Clear related errors
    const errorKey = `assignment_${index}_${field === 'role_id' ? 'role' : 'store'}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Bulk Assign User Roles</DialogTitle>
        <DialogDescription>
          Assign multiple roles to a user across different stores in a single operation.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label htmlFor="user_id">User *</Label>
        <Select
          value={selectedUserId.toString()}
          onValueChange={(value) => {
            setSelectedUserId(parseInt(value));
            if (errors.user_id) {
              setErrors(prev => ({ ...prev, user_id: '' }));
            }
          }}
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Role Assignments *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAssignment}>
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
        </div>

        {errors.assignments && (
          <p className="text-sm text-red-500">{errors.assignments}</p>
        )}
        
        {errors.duplicates && (
          <p className="text-sm text-red-500">{errors.duplicates}</p>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {assignments.map((assignment, index) => {
            const selectedRole = roles.find(role => role.id === assignment.role_id);
            const selectedStore = stores.find(store => store.id === assignment.store_id);
            
            return (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Assignment #{index + 1}
                    </CardTitle>
                    {assignments.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAssignment(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Select
                        value={assignment.role_id.toString()}
                        onValueChange={(value) => updateAssignment(index, 'role_id', parseInt(value))}
                      >
                        <SelectTrigger className={errors[`assignment_${index}_role`] ? 'border-red-500' : ''}>
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
                      {errors[`assignment_${index}_role`] && (
                        <p className="text-sm text-red-500">{errors[`assignment_${index}_role`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Store *</Label>
                      <Select
                        value={assignment.store_id}
                        onValueChange={(value) => updateAssignment(index, 'store_id', value)}
                      >
                        <SelectTrigger className={errors[`assignment_${index}_store`] ? 'border-red-500' : ''}>
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
                      {errors[`assignment_${index}_store`] && (
                        <p className="text-sm text-red-500">{errors[`assignment_${index}_store`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Department/Notes</Label>
                    <Input
                      placeholder="e.g., Electronics, Clothing, etc."
                      value={assignment.metadata?.department || ''}
                      onChange={(e) => updateAssignment(index, 'metadata', { department: e.target.value })}
                    />
                  </div>

                  {/* Assignment Preview */}
                  {selectedRole && selectedStore && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="h-4 w-4" />
                        <Badge variant="outline">{selectedRole.name}</Badge>
                        <span>in</span>
                        <Store className="h-4 w-4" />
                        <Badge variant="outline">{selectedStore.name}</Badge>
                        {assignment.metadata?.department && (
                          <>
                            <span>•</span>
                            <span className="text-muted-foreground">{assignment.metadata.department}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bulk Assignment Summary */}
      {selectedUser && assignments.some(a => a.role_id && a.store_id) && (
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Bulk Assignment Summary</h4>
          <div className="text-sm space-y-2">
            <p><span className="font-medium">User:</span> {selectedUser.name} ({selectedUser.email})</p>
            <p><span className="font-medium">Total Assignments:</span> {assignments.filter(a => a.role_id && a.store_id).length}</p>
            <div className="space-y-1">
              <span className="font-medium">Assignments:</span>
              {assignments
                .filter(a => a.role_id && a.store_id)
                .map((assignment, index) => {
                  const role = roles.find(r => r.id === assignment.role_id);
                  const store = stores.find(s => s.id === assignment.store_id);
                  return (
                    <div key={index} className="ml-4 text-xs flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{role?.name}</Badge>
                      <span>→</span>
                      <Badge variant="outline" className="text-xs">{store?.name}</Badge>
                      {assignment.metadata?.department && (
                        <span className="text-muted-foreground">({assignment.metadata.department})</span>
                      )}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={bulkAssignLoading}>
          {bulkAssignLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assign Roles ({assignments.filter(a => a.role_id && a.store_id).length})
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BulkAssignmentForm;