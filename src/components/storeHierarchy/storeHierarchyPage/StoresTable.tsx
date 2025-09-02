/**
 * StoresTable Component
 * 
 * Displays the main stores data table with store information and actions.
 * Handles store data rendering, status badges, hierarchy navigation, and all store table logic.
 * Styled to match the main StoresTable component with Card wrapper and pagination.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../../features/stores/hooks/useStores';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '../../ui/card';
import { Network, Building2 } from 'lucide-react';
import { LoadingTable } from './LoadingTable';

export const StoresTable: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    stores,
    loading,
    error,
    pagination,
    refetch,
    changePage,
  } = useStores(true);

  const handleViewHierarchy = (storeId: string) => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  };

  const handleRetry = () => {
    refetch();
  };

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

  if (loading) {
    return <LoadingTable />;
  }

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
              className="text-lg sm:text-xl flex items-center space-x-2"
              style={{ color: 'var(--card-foreground)' }}
            >
              <Building2 className="h-5 w-5" />
              <span>Store Locations</span>
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
                      className="min-w-[8rem] text-xs sm:text-sm"
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

                      <TableCell className="p-2 sm:p-4">
                        <Button
                          onClick={() => handleViewHierarchy(store.id)}
                          variant="outline"
                          size="sm"
                          className="h-6 w-auto sm:h-8 text-xs sm:text-sm hover:bg-accent px-2 sm:px-3"
                          style={{
                            color: 'var(--foreground)',
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--background)',
                          }}
                        >
                          <Network className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">View Hierarchy</span>
                          <span className="sm:hidden">View</span>
                        </Button>
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