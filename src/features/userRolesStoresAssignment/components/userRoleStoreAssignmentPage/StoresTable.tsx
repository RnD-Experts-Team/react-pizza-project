/**
 * StoresTable Component
 * Displays a table of stores with action buttons for view and assign operations
 * Fully responsive with light/dark mode support using CSS custom properties
 * Now includes integrated Redux state management and data fetching
 * Styled to match AuthRulesTable component with Card wrapper and pagination
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '@/features/stores/hooks/useStores';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Eye, UserPlus, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

export const StoresTable: React.FC = () => {
  const navigate = useNavigate();

  // Use the custom hook instead of direct Redux selectors
  const {
    stores,
    loading,
    error,
    pagination,
    refetch,
    changePage,
  } = useStores();

  const handleView = (storeId: string) => {
    navigate(`/user-role-store-assignment/view/store/${storeId}`);
  };

  const handleAssign = (storeId: string) => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  };

  const handleRetry = () => {
    refetch();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load stores: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stores Table */}
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
              Stores
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {pagination && (
                <div
                  className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <span className="hidden sm:inline">
                    Showing {pagination.from}-{pagination.to} of{' '}
                    {pagination.total} stores
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
                  onClick={handleRetry}
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
                Loading stores...
              </span>
            </div>
          ) : !stores.length ? (
            <div
              className="text-center py-6 sm:py-8"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <p
                className="text-sm sm:text-base text-muted-foreground"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No stores found.
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
                      className="min-w-[6rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Store ID
                    </TableHead>
                    <TableHead
                      className="min-w-[10rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Name
                    </TableHead>
                    <TableHead
                      className="min-w-[10rem] text-xs sm:text-sm hidden md:table-cell"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Phone
                    </TableHead>
                    <TableHead
                      className="min-w-[12rem] text-xs sm:text-sm hidden lg:table-cell"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Address
                    </TableHead>
                    <TableHead
                      className="min-w-[5rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Status
                    </TableHead>
                    <TableHead
                      className="min-w-[8rem] text-xs sm:text-sm hidden sm:table-cell"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Created
                    </TableHead>
                    <TableHead
                      className="min-w-[5rem] text-right text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow
                      key={store.id}
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
                        <div
                          className="truncate max-w-[5rem] sm:max-w-none"
                          title={store.id}
                        >
                          {store.id}
                        </div>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4">
                        <div
                          className="text-xs sm:text-sm truncate max-w-[8rem] sm:max-w-none"
                          style={{ color: 'var(--foreground)' }}
                          title={store.name}
                        >
                          {store.name}
                        </div>
                      </TableCell>

                      <TableCell
                        className="p-2 sm:p-4 text-xs sm:text-sm hidden md:table-cell"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {store.metadata?.phone || 'N/A'}
                      </TableCell>

                      <TableCell
                        className="p-2 sm:p-4 text-xs sm:text-sm hidden lg:table-cell"
                        style={{ color: 'var(--foreground)' }}
                      >
                        <div
                          className="truncate max-w-[10rem] lg:max-w-none"
                          title={store.metadata?.address || 'N/A'}
                        >
                          {store.metadata?.address || 'N/A'}
                        </div>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4">
                        <Badge
                          variant={store.is_active ? 'default' : 'secondary'}
                          className="text-xs px-1 py-0.5 sm:px-2 sm:py-1"
                          style={{
                            backgroundColor: store.is_active
                              ? 'var(--primary)'
                              : 'var(--secondary)',
                            color: store.is_active
                              ? 'var(--primary-foreground)'
                              : 'var(--secondary-foreground)',
                            borderColor: store.is_active
                              ? 'var(--primary)'
                              : 'var(--border)',
                          }}
                        >
                          {store.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      <TableCell
                        className="text-xs sm:text-sm p-2 sm:p-4 hidden sm:table-cell"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {formatDate(store.created_at)}
                      </TableCell>

                      <TableCell className="text-right p-2 sm:p-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssign(store.id)}
                            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto"
                            style={{
                              backgroundColor: 'var(--secondary)',
                              color: 'var(--secondary-foreground)',
                              borderColor: 'var(--border)',
                            }}
                          >
                            <UserPlus className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Assign</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(store.id)}
                            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto"
                            style={{
                              color: 'var(--muted-foreground)',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
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
        {pagination && pagination.last_page > 1 && (
          <CardFooter
            className="pt-4 sm:pt-5 lg:pt-6"
            style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page <= 1 || loading}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  style={{
                    backgroundColor:
                      pagination.current_page <= 1 || loading
                        ? 'var(--muted)'
                        : 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderColor: 'var(--border)',
                    opacity:
                      pagination.current_page <= 1 || loading
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
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <span className="sm:hidden">
                    {pagination.current_page}/{pagination.last_page}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    pagination.current_page >= pagination.last_page ||
                    loading
                  }
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  style={{
                    backgroundColor:
                      pagination.current_page >= pagination.last_page ||
                      loading
                        ? 'var(--muted)'
                        : 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderColor: 'var(--border)',
                    opacity:
                      pagination.current_page >= pagination.last_page ||
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
  );
};

export default StoresTable;
