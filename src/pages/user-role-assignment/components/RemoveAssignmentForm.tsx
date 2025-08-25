import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Card, CardContent } from '../../../components/ui/card';
import { useReduxUserRoleStoreAssignment } from '../../../hooks/useReduxUserRoleStoreAssignment';
import { useUserManagement } from '../../../hooks/useReduxUserManagement';
import { useStoreManagement } from '../../../hooks/useReduxStoreManagement';
import { Loader2, AlertTriangle, UserX, Trash2 } from 'lucide-react';

interface RemoveAssignmentFormProps {
  onClose: () => void;
  initialUserId?: number;
  initialAssignmentId?: number;
}

const RemoveAssignmentForm: React.FC<RemoveAssignmentFormProps> = ({ 
  onClose, 
  initialUserId, 
  initialAssignmentId 
}) => {
  const { 
    // removeUserRoleAssignment, 
    // fetchAssignmentsByUser,
    // assignmentsByUser,
    removeLoading
  } = useReduxUserRoleStoreAssignment();
  const { state: { users }, actions: { fetchUsers, fetchRoles } } = useUserManagement();
  const { state: {}, actions: { fetchStores } } = useStoreManagement();

  const [selectedUserId, setSelectedUserId] = useState<number>(initialUserId || 0);
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>(
    initialAssignmentId ? [initialAssignmentId] : []
  );
  // const [isBulkMode, setIsBulkMode] = useState<boolean>(!initialAssignmentId);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchStores();
  }, []);

  // useEffect(() => {
  //   if (selectedUserId) {
  //     fetchAssignmentsByUser(selectedUserId);
  //   }
  // }, [selectedUserId, fetchAssignmentsByUser]);

  // const validateForm = (): boolean => {
  //   const newErrors: Record<string, string> = {};

  //   if (!selectedUserId) {
  //     newErrors.user_id = 'Please select a user';
  //   }

  //   if (selectedAssignments.length === 0) {
  //     newErrors.assignments = 'Please select at least one assignment to remove';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   // // Remove assignments one by one
  //   // const results = [];
  //   // for (const assignmentId of selectedAssignments) {
  //   //   const result = await removeUserRoleAssignment(assignmentId);
  //   //   results.push(result);
  //   //   if (!result.success) {
  //   //     break; // Stop on first failure
  //   //   }
  //   // }
    
  //   // const allSuccessful = results.every(r => r.success);
  //   // const result = {
  //   //   success: allSuccessful,
  //   //   error: allSuccessful ? null : results.find(r => !r.success)?.error
  //   // };

  //   if (result.success) {
  //     toast({
  //       title: 'Success',
  //       description: `Successfully removed ${selectedAssignments.length} assignment(s)`,
  //     });
  //     onClose();
  //   } else {
  //     toast({
  //       title: 'Error',
  //       description: result.error || 'Failed to remove user role assignment(s)',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // const handleAssignmentToggle = (assignmentId: number, checked: boolean) => {
  //   if (checked) {
  //     setSelectedAssignments(prev => [...prev, assignmentId]);
  //   } else {
  //     setSelectedAssignments(prev => prev.filter(id => id !== assignmentId));
  //   }

  //   // Clear assignment error if any assignment is selected
  //   if (errors.assignments && checked) {
  //     setErrors(prev => ({ ...prev, assignments: '' }));
  //   }
  // };

  // const handleSelectAll = (checked: boolean) => {
  //   if (checked) {
  //     const allIds = userAssignments.map(assignment => assignment.id);
  //     setSelectedAssignments(allIds);
  //   } else {
  //     setSelectedAssignments([]);
  //   }
  // };

  const selectedUser = users.find(user => user.id === selectedUserId);
  // const userAssignments = assignmentsByUser[selectedUserId] || [];
  // const activeAssignments = userAssignments.filter(assignment => assignment.is_active);

  // const getAssignmentDetails = (assignment: UserRoleStoreAssignment) => {
  //   const role = roles.find(r => r.id === assignment.role_id);
  //   const store = stores.find(s => s.id === assignment.store_id);
  //   return { role, store };
  // };

  return (
    <form  className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-red-500" />
          Remove User Role Assignment(s)
        </DialogTitle>
        <DialogDescription>
          Remove role assignments from a user. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label htmlFor="user_id">User *</Label>
        <Select
          value={selectedUserId.toString()}
          onValueChange={(value) => {
            const userId = parseInt(value);
            setSelectedUserId(userId);
            setSelectedAssignments([]); // Clear selections when user changes
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

      {selectedUserId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Active Role Assignments *</Label>
            {/* {activeAssignments.length > 1 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedAssignments.length === activeAssignments.length && activeAssignments.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-normal">
                  Select All
                </Label>
              </div>
            )} */}
          </div>

          {errors.assignments && (
            <p className="text-sm text-red-500">{errors.assignments}</p>
          )}

          {/* {activeAssignments.length === 0 ? ( */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <UserX className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No active role assignments found for this user.
                </p>
              </CardContent>
            </Card>
          {/* ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto"> */}
              {/* {activeAssignments.map((assignment) => {
                const { role, store } = getAssignmentDetails(assignment);
                const isSelected = selectedAssignments.includes(assignment.id);
                
                return (
                  <Card 
                    key={assignment.id} 
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleAssignmentToggle(assignment.id, !isSelected)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleAssignmentToggle(assignment.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <UserX className="h-3 w-3" />
                              {role?.name || 'Unknown Role'}
                            </Badge>
                            <span className="text-muted-foreground">in</span>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Store className="h-3 w-3" />
                              {store?.name || 'Unknown Store'}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-4">
                              <span>ID: {assignment.id}</span>
                              <span>Store ID: {assignment.store_id}</span>
                            </div>
                            
                            {assignment.metadata?.department && (
                              <div>Department: {assignment.metadata.department}</div>
                            )}
                            
                            {assignment.metadata?.start_date && (
                              <div>Start Date: {new Date(assignment.metadata.start_date).toLocaleDateString()}</div>
                            )}
                            
                            {assignment.metadata?.notes && (
                              <div>Notes: {assignment.metadata.notes}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })} */}
            {/* </div>
          )} */}
        </div>
      )}

      {/* Removal Summary */}
      {selectedUser && selectedAssignments.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-red-900">Removal Confirmation</h4>
              <div className="text-sm text-red-800 space-y-1">
                <p><span className="font-medium">User:</span> {selectedUser.name} ({selectedUser.email})</p>
                <p><span className="font-medium">Assignments to Remove:</span> {selectedAssignments.length}</p>
                <p className="text-red-700 font-medium">
                  ⚠️ This action cannot be undone. The user will lose access to the selected roles immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="destructive"
          disabled={removeLoading || selectedAssignments.length === 0}
        >
          {removeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Remove Assignment{selectedAssignments.length > 1 ? 's' : ''} ({selectedAssignments.length})
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RemoveAssignmentForm;