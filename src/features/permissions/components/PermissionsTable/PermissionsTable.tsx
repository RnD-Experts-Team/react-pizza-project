import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PermissionsTableHeader } from '@/features/permissions/components/PermissionsTable/PermissionTableHeader';
import { PermissionsTableContent } from '@/features/permissions/components/PermissionsTable/PermissionsTableContent';
import { PermissionsTableFooter } from '@/features/permissions/components/PermissionsTable/PermissionsTableFooter';

export const PermissionsTable: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Memoize the options object to prevent usePermissions from re-running
  const permissionOptions = useMemo(() => ({
    page: currentPage,
    per_page: perPage,
  }), [currentPage, perPage]);

  const { permissions, loading, error, refetch, pagination, fetchPermissions } =
    usePermissions(true, permissionOptions);

  // Memoize handlers to prevent child re-renders
  const handleCreatePermission = useCallback(() => {
    navigate('/user-management/create/permission');
  }, [navigate]);

  const handlePerPageChange = useCallback(async (value: string) => {
    const newPerPage = parseInt(value, 10);
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per_page
    await fetchPermissions({ page: 1, per_page: newPerPage });
  }, [fetchPermissions]);

  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    await fetchPermissions({ page, per_page: perPage });
  }, [fetchPermissions, perPage]);

  const handlePreviousPage = useCallback(() => {
    if (pagination && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [pagination, currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.lastPage) {
      handlePageChange(currentPage + 1);
    }
  }, [pagination, currentPage, handlePageChange]);

  // Memoize computed values
  const permissionsCount = useMemo(() => 
    pagination?.total || permissions.length, 
    [pagination?.total, permissions.length]
  );

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading permissions: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Permissions Table */}
      <Card className="rounded-sm bg-card border border-border shadow-[var(--shadow-realistic)]">
        <PermissionsTableHeader
          permissionsCount={permissionsCount}
          loading={loading}
          onRefresh={refetch}
          onCreatePermission={handleCreatePermission}
        />

        <CardContent className="p-0 bg-card">
          <PermissionsTableContent
            permissions={permissions}
            loading={loading}
          />
        </CardContent>

        <PermissionsTableFooter
          loading={loading}
          permissions={permissions}
          pagination={pagination}
          currentPage={currentPage}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </Card>
    </div>
  );
};
