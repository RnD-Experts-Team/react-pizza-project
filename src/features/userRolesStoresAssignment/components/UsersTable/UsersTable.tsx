/**
 * Users Table Component
 * 
 * Features:
 * - Displays users in a sortable table with Card wrapper
 * - View and assign user functionality
 * - Loading states and responsive design
 * - Pagination functionality with per-page selection
 * - Error handling and refresh capability
 * - Light/dark mode compatibility using CSS variables
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUsers } from '@/features/users/hooks/useUsers';
import { fetchUsers } from '@/features/users/store/usersSlice';
import type { AppDispatch } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { UsersTableHeader } from '@/features/userRolesStoresAssignment/components/UsersTable/UsersTableHeader';
import { UsersTableContent } from '@/features/userRolesStoresAssignment/components/UsersTable/UsersTableContent';
import { UsersTableFooter } from '@/features/userRolesStoresAssignment/components/UsersTable/UsersTableFooter';

export const UsersTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, pagination, refetch, perPage, setPerPage } = useUsers();

  const handleView = (userId: number) => {
    navigate(`/user-role-store-assignment/view/user/${userId}`);
  };

  const handleAssign = (userId: number) => {
    navigate(`/user-role-store-assignment/assign?userId=${userId}`);
  };

  // Handle pagination by dispatching fetchUsers with the new page
  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ page, per_page: perPage }));
  };

  // Handle per-page change
  const handlePerPageChange = async (value: string) => {
    const newPerPage = parseInt(value, 10);
    setPerPage(newPerPage);
    // Reset to first page when changing per_page
    dispatch(fetchUsers({ page: 1, per_page: newPerPage }));
  };

  // Footer handlers
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

  return (
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
        className="rounded-sm border shadow-sm"
        style={{ 
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-realistic)' 
        }}
      >
        <UsersTableHeader
          loading={loading}
          onRefresh={refetch}
        />
        
        <CardContent className="p-0 bg-card">
          <UsersTableContent
            users={users}
            loading={loading}
            onView={handleView}
            onAssign={handleAssign}
          />
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
  );
};
