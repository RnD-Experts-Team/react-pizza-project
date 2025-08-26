/**
 * Users Table Component
 * 
 * Displays a table of users with updated columns: Name, Roles, Stores
 * Actions: Create (navigate to page), Update (navigate to page), View (navigate to page), Delete (alert dialog)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useDeleteUser } from '../../features/users/hooks/useUsers';
import { userFormatting } from '../../features/users/utils';
import { Button } from '../ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';

export const UsersTable: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useUsers();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleView = (userId: number) => {
    navigate(`/user-management/user-detail/${userId}`);
  };

  const handleUpdate = (userId: number) => {
    navigate(`/user-management/edit-user/${userId}`);
  };

  const handleDeleteClick = (user: { id: number; name: string }) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      // Success feedback could be added here (toast notification)
    } catch (error) {
      console.error('Failed to delete user:', error);
      // Error feedback could be added here (toast notification)
    }
  };

  const handleCreate = () => {
    navigate('/user-management/create-user');
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-4">
            Error loading users: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create User
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Stores</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {userFormatting.formatInitials(user.name)}
                          </div>
                          {userFormatting.formatDisplayName(user.name)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role.id} variant="outline" className="text-xs">
                                {role.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No roles</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.stores && user.stores.length > 0 ? (
                            user.stores.map((userStore) => (
                              <Badge key={userStore.store.id} variant="secondary" className="text-xs">
                                {userStore.store.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No stores</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdate(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick({ id: user.id, name: user.name })}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            disabled={deleteLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
              This action cannot be undone. This will permanently delete the user{' '}
              <span className="font-semibold">{userToDelete?.name}</span> and remove all their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
