/**
 * User Assignments Page
 * 
 * This page displays all role assignments for a specific user
 * using the useUserRolesStoresAssignment hook.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { useStores } from '../../features/stores/hooks/useStores';
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
import { ArrowLeft, User, Store, Shield, Plus, Trash2, Loader2, MoreHorizontal } from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import type { Assignment } from '../../features/userRolesStoresAssignment/types';

export const UserAssignmentsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const userIdNumber = userId ? parseInt(userId) : 0;
  
  const {
    getUserAssignments,
    fetchUserAssignments,
    isLoadingUserAssignments,
    getUserAssignmentsError,
    toggleUserRoleStatus,
    removeUserRole,
  } = useUserRolesStoresAssignment();

  // Fetch roles and stores to get names
  const { roles } = useRoles();
  const { stores } = useStores();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<number>>(new Set());

  // Fetch user assignments on component mount
  useEffect(() => {
    if (userIdNumber) {
      fetchUserAssignments(userIdNumber);
    }
  }, [userIdNumber, fetchUserAssignments]);

  const assignments = getUserAssignments(userIdNumber);
  const loading = isLoadingUserAssignments();
  const error = getUserAssignmentsError();

  const handleBack = () => {
    navigate('/user-role-store-assignment');
  };

  const handleAssignRole = () => {
    navigate(`/user-role-store-assignment/assign?userId=${userId}`);
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : `Role ID: ${roleId}`;
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : storeId;
  };

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
      fetchUserAssignments(userIdNumber);
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
      fetchUserAssignments(userIdNumber);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 self-start">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-col space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">User Role Assignments</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              View all role assignments for User ID: {userId}
            </p>
          </div>
        </div>
        <Button onClick={handleAssignRole} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Assign Role</span>
        </Button>
      </div>

      <Separator />

      {/* Assignments Section */}
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <CardTitle className="text-lg sm:text-xl">Role Assignments</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {error ? (
            <div className="text-destructive text-center py-4 px-4 sm:px-0">
              Error loading assignments: {error.message || 'Unknown error'}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8 px-4 sm:px-0">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
              <span className="ml-2 text-sm sm:text-base">Loading assignments...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm font-medium">Assignment ID</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium hidden sm:table-cell">Store</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium hidden md:table-cell">Assigned Date</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium hidden lg:table-cell">Updated Date</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                        No role assignments found for this user
                      </TableCell>
                    </TableRow>
                  ) : (
                  assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-xs sm:text-sm py-2 sm:py-4">
                        <div className="truncate max-w-[80px] sm:max-w-none">
                          {assignment.id}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm truncate">
                            {getRoleName(assignment.role_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Store className="h-3 w-3 sm:h-4 sm:w-4 text-chart-3 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm truncate">
                            {getStoreName(assignment.store_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Switch
                            checked={assignment.is_active}
                            onCheckedChange={() => handleToggleStatus(assignment)}
                            disabled={!assignment.id || updatingAssignments.has(assignment.id)}
                            className="scale-75 sm:scale-100"
                          />
                          <Badge 
                            variant={assignment.is_active ? 'default' : 'secondary'}
                            className="text-xs px-1 sm:px-2 py-0.5"
                          >
                            <span className="hidden sm:inline">{assignment.is_active ? 'Active' : 'Inactive'}</span>
                            <span className="sm:hidden">{assignment.is_active ? 'A' : 'I'}</span>
                          </Badge>
                          {assignment.id && updatingAssignments.has(assignment.id) && (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground py-2 sm:py-4 hidden md:table-cell">
                        <div className="truncate">
                          {formatDate(assignment.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground py-2 sm:py-4 hidden lg:table-cell">
                        <div className="truncate">
                          {formatDate(assignment.updated_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 sm:py-4">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                               <span className="sr-only">Open menu</span>
                               <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             <DropdownMenuItem
                               onClick={() => handleDeleteClick(assignment)}
                               className="text-destructive focus:text-destructive text-xs sm:text-sm"
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
        <AlertDialogContent className="mx-4 sm:mx-auto max-w-sm sm:max-w-lg">
          <AlertDialogHeader className="space-y-2 sm:space-y-3">
            <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              This action cannot be undone. This will permanently delete the role assignment
              {assignmentToDelete && (
                <span className="font-medium">
                  {' '}for {getRoleName(assignmentToDelete.role_id)} in {getStoreName(assignmentToDelete.store_id)}
                </span>
              )}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <span className="hidden sm:inline">Delete Assignment</span>
              <span className="sm:hidden">Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserAssignmentsPage;