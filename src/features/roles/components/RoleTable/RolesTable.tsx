/**
 * Roles Table Component
 * 
 * Features:
 * - Displays roles in a sortable table with Card wrapper  
 * - Assign permissions and create role functionality
 * - Loading states and responsive design
 * - Error handling and refresh capability
 * - Pagination with per-page selection and navigation
 * - Light/dark mode compatibility using CSS variables
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { Card, CardContent} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { RolesTableHeader } from '@/features/roles/components/RoleTable/RolesTableHeader';
import { RolesTableContent } from '@/features/roles/components/RoleTable/RolesTableContent';
import { RolesTablePagination } from '@/features/roles/components/RoleTable/RolesTablePagination';

export const RolesTable: React.FC = () => {
  const navigate = useNavigate();
  
  // Pagination state
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use roles hook with pagination parameters
  const { roles, loading, error, pagination, fetchRoles, refetch } = useRoles(true, {
    per_page: perPage,
    page: currentPage
  });

 const handleAssignPermissions = useCallback(() => {
  navigate('/user-management/roles/assign-permissions');
}, [navigate]);

  const handleCreate = useCallback(() => {
    navigate('/user-management/create/role');
  }, [navigate]);

  // Handle per-page change
  const handlePerPageChange = useCallback((newPerPage: string) => {
    const perPageValue = parseInt(newPerPage, 10);
    setPerPage(perPageValue);
    setCurrentPage(1); // Reset to first page
    fetchRoles({ per_page: perPageValue, page: 1 });
  }, [fetchRoles]);

  // Handle page navigation
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    fetchRoles({ per_page: perPage, page: newPage });
  }, [fetchRoles, perPage]);

  // Handle previous page
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  // Handle next page
  const handleNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.lastPage) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, pagination, handlePageChange]);

  // Calculate pagination display values
  const paginationInfo = pagination ? {
    from: pagination.from || ((currentPage - 1) * perPage + 1),
    to: pagination.to || Math.min(currentPage * perPage, pagination.total),
    total: pagination.total,
    currentPage: pagination.currentPage || currentPage,
    lastPage: pagination.lastPage || Math.ceil(pagination.total / perPage),
  } : null;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading roles: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Roles Table */}
      <Card
        className="rounded-sm bg-card border-border"
        style={{
          boxShadow: 'var(--shadow-realistic)',
        }}
      >
        <RolesTableHeader
          totalRoles={paginationInfo?.total || roles.length}
          loading={loading}
          onRefresh={refetch}
          onAssignPermissions={handleAssignPermissions}
          onCreateRole={handleCreate}
        />
        
        <CardContent className="p-0 bg-card ">
          <RolesTableContent roles={roles} loading={loading} />
          
          <RolesTablePagination
            paginationInfo={paginationInfo}
            perPage={perPage}
            loading={loading}
            onPerPageChange={handlePerPageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
