// components/UsersTable/UsersTable.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useDeleteUser } from '@/features/users/hooks/useUsers';
import { fetchUsers } from '@/features/users/store/usersSlice';
import type { AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import { Table, TableBody } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';

// Import sub-components
import { UserTableRow } from '@/features/users/components/UsersTable/UserTableRow';
import { UsersTableHeader } from '@/features/users/components/UsersTable/UsersTableHeader';
import { UsersTableFooter } from '@/features/users/components/UsersTable/UsersTableFooter';
import { EmptyState } from '@/features/users/components/UsersTable/EmptyState';
import { LoadingState } from '@/features/users/components/UsersTable/LoadingState';
import { DeleteConfirmationDialog } from '@/features/users/components/UsersTable/DeleteConfirmationDialog';

export const UsersTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, pagination, refetch, perPage, setPerPage } = useUsers();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  // Navigation handlers
  const handleView = (userId: number) => {
    navigate(`/user-management/view/user/${userId}`);
  };

  const handleUpdate = (userId: number) => {
    navigate(`/user-management/edit/user/${userId}`);
  };

  const handleCreate = () => {
    navigate('/user-management/create/user');
  };

  // Delete handlers
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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ page, per_page: perPage }));
  };

  const handlePerPageChange = async (value: string) => {
    const newPerPage = parseInt(value, 10);
    setPerPage(newPerPage);
    dispatch(fetchUsers({ page: 1, per_page: newPerPage }));
  };

  const handlePreviousPage = () => {
    if (pagination && pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.currentPage < pagination.lastPage) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  // Render table content
  const renderTableContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (!users.length) {
      return <EmptyState />;
    }

    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <UsersTableHeader />
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onView={handleView}
                onEdit={handleUpdate}
                onDelete={handleDeleteClick}
                deleteLoading={deleteLoading}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
        <Card className="rounded-sm bg-card border border-border shadow-sm">
          <CardHeader className="mb-0 bg-muted border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <CardTitle className="text-lg sm:text-xl text-card-foreground">
                Users
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={loading}
                    className={`flex items-center gap-2 bg-secondary text-secondary-foreground border-border ${
                      loading ? 'bg-muted opacity-60' : ''
                    }`}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden xs:inline">Refresh</span>
                  </Button>
                  <Button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden xs:inline">Create User</span>
                    <span className="xs:hidden">Create</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 bg-card">
            {renderTableContent()}
          </CardContent>
          
          <UsersTableFooter
            loading={loading}
            users={users}
            pagination={pagination}
            currentPage={pagination?.currentPage || 1}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userToDelete={userToDelete}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
};
