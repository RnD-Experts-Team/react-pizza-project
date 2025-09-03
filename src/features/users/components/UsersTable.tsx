/**
 * Users Table Component
 * 
 * Features:
 * - Displays users in a sortable table with Card wrapper
 * - Create, view, edit, and delete user functionality
 * - Loading states and responsive design
 * - Pagination functionality
 * - Error handling and refresh capability
 * - Light/dark mode compatibility using CSS variables
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useDeleteUser } from '@/features/users/hooks/useUsers';
import { fetchUsers } from '@/features/users/store/usersSlice';
import { userFormatting } from '@/features/users/utils';
import type { AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, Edit, Trash2, Plus, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export const UsersTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, pagination, refetch } = useUsers();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleView = (userId: number) => {
    navigate(`/user-management/view/user/${userId}`);
  };

  const handleUpdate = (userId: number) => {
    navigate(`/user-management/edit/user/${userId}`);
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
    navigate('/user-management/create/user');
  };

  // Handle pagination by dispatching fetchUsers with the new page
  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ page }));
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading users: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <Card
          className="rounded-sm"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-realistic)',
          }}
        >
          <CardHeader
            className="mb-0"
            style={{
              backgroundColor: 'var(--muted)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <CardTitle
                className="text-lg sm:text-xl"
                style={{ color: 'var(--card-foreground)' }}
              >
                Users
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {pagination && (
                  <div
                    className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Showing {pagination.from}-{pagination.to} of{' '}
                      {pagination.total} users
                    </span>
                    <span className="sm:hidden">
                      {pagination.from}-{pagination.to} of {pagination.total}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={loading}
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor: loading
                        ? 'var(--muted)'
                        : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                    />
                    <span className="hidden xs:inline">Refresh</span>
                  </Button>
                  <Button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 text-sm"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden xs:inline">Create User</span>
                    <span className="xs:hidden">Create</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0" style={{ backgroundColor: 'var(--card)' }}>
            {loading ? (
              <div
                className="flex items-center justify-center h-48 sm:h-64"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--muted-foreground)',
                }}
              >
                <Loader2
                  className="h-6 w-6 sm:h-8 sm:w-8 animate-spin"
                  style={{ color: 'var(--primary)' }}
                />
                <span
                  className="ml-2 text-sm sm:text-base"
                  style={{ color: 'var(--foreground)' }}
                >
                  Loading users...
                </span>
              </div>
            ) : !users.length ? (
              <div
                className="text-center py-6 sm:py-8"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <p
                  className="text-sm sm:text-base text-muted-foreground"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  No users found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader
                    style={{
                      backgroundColor: 'var(--muted)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <TableRow style={{ borderColor: 'var(--border)' }}>
                      <TableHead
                        className="min-w-[10rem] text-xs sm:text-sm"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Name
                      </TableHead>
                      <TableHead
                        className="min-w-[8rem] text-xs sm:text-sm hidden sm:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Roles
                      </TableHead>
                      <TableHead
                        className="min-w-[8rem] text-xs sm:text-sm hidden md:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Stores
                      </TableHead>
                      <TableHead
                        className="min-w-[6rem] text-xs sm:text-sm text-right"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        style={{
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--card)',
                        }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell
                          className="font-medium text-xs sm:text-sm p-2 sm:p-4"
                          style={{ color: 'var(--foreground)' }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium"
                              style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                              }}
                            >
                              {userFormatting.formatInitials(user.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="text-xs sm:text-sm font-medium truncate"
                                style={{ color: 'var(--foreground)' }}
                                title={userFormatting.formatDisplayName(user.name)}
                              >
                                {userFormatting.formatDisplayName(user.name)}
                              </div>
                              {/* Mobile: Show roles and stores inline */}
                              <div className="sm:hidden mt-1 space-y-1">
                                {user.roles && user.roles.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.roles.slice(0, 2).map((role) => (
                                      <Badge
                                        key={role.id}
                                        variant="outline"
                                        className="text-xs px-1 py-0.5"
                                        style={{
                                          backgroundColor: 'var(--secondary)',
                                          color: 'var(--secondary-foreground)',
                                          borderColor: 'var(--border)',
                                        }}
                                      >
                                        {role.name}
                                      </Badge>
                                    ))}
                                    {user.roles.length > 2 && (
                                      <span
                                        className="text-xs"
                                        style={{ color: 'var(--muted-foreground)' }}
                                      >
                                        +{user.roles.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {user.stores && user.stores.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.stores.slice(0, 2).map((userStore) => (
                                      <Badge
                                        key={userStore.store.id}
                                        variant="secondary"
                                        className="text-xs px-1 py-0.5"
                                        style={{
                                          backgroundColor: 'var(--accent)',
                                          color: 'var(--accent-foreground)',
                                          borderColor: 'var(--border)',
                                        }}
                                      >
                                        {userStore.store.name}
                                      </Badge>
                                    ))}
                                    {user.stores.length > 2 && (
                                      <span
                                        className="text-xs"
                                        style={{ color: 'var(--muted-foreground)' }}
                                      >
                                        +{user.stores.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                          <div className="space-y-1 max-w-[8rem] lg:max-w-none">
                            {user.roles && user.roles.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.roles.slice(0, 2).map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant="outline"
                                    className="text-xs px-1 py-0.5"
                                    style={{
                                      backgroundColor: 'var(--secondary)',
                                      color: 'var(--secondary-foreground)',
                                      borderColor: 'var(--border)',
                                    }}
                                  >
                                    <span
                                      className="truncate max-w-[3rem]"
                                      title={role.name}
                                    >
                                      {role.name}
                                    </span>
                                  </Badge>
                                ))}
                                {user.roles.length > 2 && (
                                  <span
                                    className="text-xs"
                                    style={{ color: 'var(--muted-foreground)' }}
                                  >
                                    +{user.roles.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span
                                className="text-xs sm:text-sm"
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                No roles
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                          <div className="space-y-1 max-w-[8rem] lg:max-w-none">
                            {user.stores && user.stores.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.stores.slice(0, 2).map((userStore) => (
                                  <Badge
                                    key={userStore.store.id}
                                    variant="secondary"
                                    className="text-xs px-1 py-0.5"
                                    style={{
                                      backgroundColor: 'var(--accent)',
                                      color: 'var(--accent-foreground)',
                                      borderColor: 'var(--border)',
                                    }}
                                  >
                                    <span
                                      className="truncate max-w-[3rem]"
                                      title={userStore.store.name}
                                    >
                                      {userStore.store.name}
                                    </span>
                                  </Badge>
                                ))}
                                {user.stores.length > 2 && (
                                  <span
                                    className="text-xs"
                                    style={{ color: 'var(--muted-foreground)' }}
                                  >
                                    +{user.stores.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span
                                className="text-xs sm:text-sm"
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                No stores
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right p-2 sm:p-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(user.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              title="View user"
                              style={{
                                color: 'var(--muted-foreground)',
                                backgroundColor: 'transparent',
                              }}
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdate(user.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              title="Edit user"
                              style={{
                                color: 'var(--muted-foreground)',
                                backgroundColor: 'transparent',
                              }}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick({ id: user.id, name: user.name })}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              disabled={deleteLoading}
                              title="Delete user"
                              style={{
                                color: 'var(--destructive)',
                                backgroundColor: 'transparent',
                              }}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          {pagination && pagination.lastPage > 1 && (
            <CardFooter
              className="pt-4 sm:pt-5 lg:pt-6"
              style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage <= 1 || loading}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    style={{
                      backgroundColor:
                        pagination.currentPage <= 1 || loading
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.currentPage <= 1 || loading
                          ? 0.5
                          : 1,
                    }}
                  >
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </Button>
                  <span
                    className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Page {pagination.currentPage} of {pagination.lastPage}
                    </span>
                    <span className="sm:hidden">
                      {pagination.currentPage}/{pagination.lastPage}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      pagination.currentPage >= pagination.lastPage ||
                      loading
                    }
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    style={{
                      backgroundColor:
                        pagination.currentPage >= pagination.lastPage ||
                        loading
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.currentPage >= pagination.lastPage ||
                        loading
                          ? 0.5
                          : 1,
                    }}
                  >
                    <span className="hidden xs:inline">Next</span>
                    <span className="xs:hidden">Next</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

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
