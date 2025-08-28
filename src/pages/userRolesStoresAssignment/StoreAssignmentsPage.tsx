/**
 * Store Assignments Page
 * 
 * This page displays all role assignments for a specific store
 * using the useUserRolesStoresAssignment hook.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
// import { useStores } from '../../features/stores/hooks/useStores'; // Removed as it's not used
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
// Dialog imports removed as they are not used
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Loader2, ArrowLeft, User, Store, Shield, Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import type { Assignment } from '../../features/userRolesStoresAssignment/types';

export const StoreAssignmentsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  
  const {
    getStoreAssignments,
    fetchStoreAssignments,
    isLoadingStoreAssignments,
    getStoreAssignmentsError,
    toggleUserRoleStatus,
    removeUserRole,
    // Removed unused variables: isToggling, isRemoving, toggleError, removeError
  } = useUserRolesStoresAssignment();
  
  const { users } = useUsers();
  const { roles } = useRoles();
  // const { stores } = useStores(); // Removed as it's not used
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<number>>(new Set());

  // Fetch store assignments on component mount
  useEffect(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

  // Helper functions to get names
  const getUserName = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : `User ID: ${userId}`;
  };

  const getRoleName = (roleId: number) => {
    const role = roles?.find(r => r.id === roleId);
    return role ? role.name : `Role ID: ${roleId}`;
  };

  // getStoreName function removed as it's not used

  // Handle toggle status
  const handleToggleStatus = async (assignment: Assignment) => {
    if (!assignment.id || updatingAssignments.has(assignment.id)) return;
    
    setUpdatingAssignments(prev => new Set(prev).add(assignment.id!));
    try {
      await toggleUserRoleStatus({
        user_id: assignment.user_id,
        role_id: assignment.role_id,
        store_id: assignment.store_id
      });
      // Refresh the assignments after toggle
      if (storeId) {
        fetchStoreAssignments(storeId);
      }
    } catch (error) {
      console.error('Failed to toggle assignment status:', error);
    } finally {
      setUpdatingAssignments(prev => {
        const newSet = new Set(prev);
        if (assignment.id) {
          newSet.delete(assignment.id);
        }
        return newSet;
      });
    }
  };

  // Handle delete
  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    
    try {
      await removeUserRole({
        user_id: assignmentToDelete.user_id,
        role_id: assignmentToDelete.role_id,
        store_id: assignmentToDelete.store_id
      });
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
      // Refresh the assignments after deletion
      if (storeId) {
        fetchStoreAssignments(storeId);
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  // Handle assign role navigation
  const handleAssignRole = () => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  };

  const assignments = getStoreAssignments(storeId || '');
  const loading = isLoadingStoreAssignments();
  const error = getStoreAssignmentsError();

  const handleBack = () => {
    navigate('/user-role-store-assignment');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Store Role Assignments</h1>
          <p className="text-muted-foreground">
            View all role assignments for Store ID: {storeId}
          </p>
        </div>
      </div>

      <Separator />

      {/* Assignments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <CardTitle>Role Assignments</CardTitle>
            </div>
            <Button
              onClick={handleAssignRole}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Assign Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 text-center py-4">
              Error loading assignments: {error.message || 'Unknown error'}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading assignments...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Updated Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No role assignments found for this store
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-sm">
                        {assignment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {getUserName(assignment.user_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {getRoleName(assignment.role_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={assignment.is_active}
                            onCheckedChange={() => handleToggleStatus(assignment)}
                            disabled={!assignment.id || updatingAssignments.has(assignment.id)}
                          />
                          <Badge 
                            variant={assignment.is_active ? 'default' : 'secondary'}
                          >
                            {assignment.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {assignment.id && updatingAssignments.has(assignment.id) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(assignment.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(assignment.updated_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(assignment)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Assignment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role assignment
              {assignmentToDelete && (
                <span className="font-medium">
                  {' '}for {getUserName(assignmentToDelete.user_id)} with role {getRoleName(assignmentToDelete.role_id)}
                </span>
              )}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoreAssignmentsPage;