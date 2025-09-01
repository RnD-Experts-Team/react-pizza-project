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
    <div className="container mx-auto px-4 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 lg:px-8 lg:py-8 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="flex items-center gap-2 self-start sm:self-auto w-fit"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">Store Role Assignments</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            View all role assignments for Store ID: {storeId}
          </p>
        </div>
      </div>

      <Separator />

      {/* Assignments Section */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--primary)' }} />
              <CardTitle className="text-lg sm:text-xl">Role Assignments</CardTitle>
            </div>
            <Button
              onClick={handleAssignRole}
              className="flex items-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="sm:inline">Assign Role</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {error ? (
            <div className="text-center py-6 sm:py-8" style={{ color: 'var(--destructive)' }}>
              <p className="text-sm sm:text-base font-medium">Error loading assignments</p>
              <p className="text-xs sm:text-sm mt-1 opacity-80">{error.message || 'Unknown error'}</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-3">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" style={{ color: 'var(--primary)' }} />
              <span className="text-sm sm:text-base" style={{ color: 'var(--muted-foreground)' }}>Loading assignments...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm min-w-[100px]">Assignment ID</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">User</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[100px]">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px] hidden md:table-cell">Assigned Date</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px] hidden lg:table-cell">Updated Date</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 sm:py-12" style={{ color: 'var(--muted-foreground)' }}>
                        <div className="flex flex-col items-center space-y-2">
                          <Store className="h-8 w-8 sm:h-12 sm:w-12 opacity-50" style={{ color: 'var(--muted-foreground)' }} />
                          <p className="text-sm sm:text-base font-medium">No role assignments found</p>
                          <p className="text-xs sm:text-sm opacity-75">This store has no role assignments yet</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-mono text-xs sm:text-sm py-3">
                          <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                            {assignment.id}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: 'var(--chart-4)' }} />
                            <span className="font-medium text-xs sm:text-sm truncate">
                              {getUserName(assignment.user_id)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: 'var(--chart-3)' }} />
                            <span className="font-medium text-xs sm:text-sm truncate">
                              {getRoleName(assignment.role_id)}
                            </span>
                          </div>
                        </TableCell>
                      <TableCell className="py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Switch
                              checked={assignment.is_active}
                              onCheckedChange={() => handleToggleStatus(assignment)}
                              disabled={!assignment.id || updatingAssignments.has(assignment.id)}
                              className="scale-75 sm:scale-100"
                            />
                            <Badge 
                              variant={assignment.is_active ? 'default' : 'secondary'}
                              className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1"
                            >
                              <span className="hidden sm:inline">{assignment.is_active ? 'Active' : 'Inactive'}</span>
                              <span className="sm:hidden">{assignment.is_active ? 'On' : 'Off'}</span>
                            </Badge>
                            {assignment.id && updatingAssignments.has(assignment.id) && (
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" style={{ color: 'var(--primary)' }} />
                            )}
                          </div>
                        </TableCell>
                      <TableCell className="text-xs sm:text-sm py-3 hidden md:table-cell" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="flex flex-col">
                            <span>{formatDate(assignment.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm py-3 hidden lg:table-cell" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="flex flex-col">
                            <span>{formatDate(assignment.updated_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 sm:h-8 sm:w-8" size="sm">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(assignment)}
                                className="text-xs sm:text-sm"
                                style={{ color: 'var(--destructive)' }}
                              >
                                <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Delete Assignment</span>
                                <span className="sm:hidden">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base leading-relaxed">
              This action cannot be undone. This will permanently delete the role assignment
              {assignmentToDelete && (
                <span className="font-medium block mt-2 p-2 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                  User: {getUserName(assignmentToDelete.user_id)}<br />
                  Role: {getRoleName(assignmentToDelete.role_id)}
                </span>
              )}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto order-1 sm:order-2"
              style={{ 
                backgroundColor: 'var(--destructive)', 
                color: 'var(--destructive-foreground)'
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoreAssignmentsPage;