/**
 * Users Table Component
 * 
 * Displays a table of users with updated columns: Name, Roles, Stores
 * Actions: Create (navigate to page), Update (navigate to page), View (navigate to page), Delete (alert dialog)
 * 
 * Features:
 * - Responsive design with mobile-first approach
 * - Light/dark mode compatibility using CSS variables
 * - Adaptive layout for different screen sizes
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
import { Eye, Edit, Trash2, Plus, Loader2, RefreshCw } from 'lucide-react';

export const UsersTable: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading, error, refetch } = useUsers();
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
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Users</CardTitle>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sm:inline">Retry</span>
          </Button>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-destructive text-center py-4 sm:py-6 text-sm sm:text-base">
            Error loading users: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Users</CardTitle>
          <Button onClick={handleCreate} className="flex items-center gap-2 w-full sm:w-auto text-sm">
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Create User</span>
          </Button>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
              <span className="ml-2 text-sm sm:text-base">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 hidden sm:table-cell">Roles</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 hidden md:table-cell">Stores</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-right px-2 sm:px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 sm:py-12 text-muted-foreground text-sm sm:text-base px-2 sm:px-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium px-2 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-medium text-primary">
                              {userFormatting.formatInitials(user.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium truncate">
                                {userFormatting.formatDisplayName(user.name)}
                              </div>
                              {/* Mobile: Show roles and stores inline */}
                              <div className="sm:hidden mt-1 space-y-1">
                                {user.roles && user.roles.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.roles.slice(0, 2).map((role) => (
                                      <Badge key={role.id} variant="outline" className="text-xs px-1 py-0">
                                        {role.name}
                                      </Badge>
                                    ))}
                                    {user.roles.length > 2 && (
                                      <span className="text-xs text-muted-foreground">+{user.roles.length - 2}</span>
                                    )}
                                  </div>
                                )}
                                {user.stores && user.stores.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.stores.slice(0, 2).map((userStore) => (
                                      <Badge key={userStore.store.id} variant="secondary" className="text-xs px-1 py-0">
                                        {userStore.store.name}
                                      </Badge>
                                    ))}
                                    {user.stores.length > 2 && (
                                      <span className="text-xs text-muted-foreground">+{user.stores.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell px-2 sm:px-4 py-3 sm:py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map((role) => (
                                <Badge key={role.id} variant="outline" className="text-xs">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs sm:text-sm">No roles</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-2 sm:px-4 py-3 sm:py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.stores && user.stores.length > 0 ? (
                              user.stores.map((userStore) => (
                                <Badge key={userStore.store.id} variant="secondary" className="text-xs">
                                  {userStore.store.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs sm:text-sm">No stores</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-2 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(user.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted"
                              title="View user"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdate(user.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted"
                              title="Edit user"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick({ id: user.id, name: user.name })}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={deleteLoading}
                              title="Delete user"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
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
        <AlertDialogContent className="w-[90vw] max-w-md mx-auto">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg sm:text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base leading-relaxed">
              This action cannot be undone. This will permanently delete the user{' '}
              <span className="font-semibold text-foreground">{userToDelete?.name}</span> and remove all their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
