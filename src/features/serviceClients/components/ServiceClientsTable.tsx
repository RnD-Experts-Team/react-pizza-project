/**
 * Service Clients Table Component
 * 
 * Features:
 * - Displays service clients in a sortable table with Card wrapper
 * - Create, rotate token, and toggle status functionality
 * - Loading states and responsive design
 * - Pagination functionality
 * - Error handling and refresh capability
 * - Light/dark mode compatibility using CSS variables
 */

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Power, Plus, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useServiceClients } from '@/features/serviceClients/hooks/useServiceClients';
import { CreateServiceClientDialog } from '@/features/serviceClients/components/CreateServiceClientDialog';
import type { ServiceClient } from '@/features/serviceClients/types';

interface ServiceClientsTableProps {
  onRotateToken: (client: ServiceClient) => void;
  onCreateSuccess: (token: string) => void;
  onRefresh?: () => void;
  onPageChange?: (page: number) => void;
}

export const ServiceClientsTable: React.FC<ServiceClientsTableProps> = ({
  onRotateToken,
  onCreateSuccess,
  onRefresh,
  onPageChange,
}) => {
  const { clients, loading, errors, pagination, toggleStatus } = useServiceClients();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never expires';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const handleToggleStatus = async (client: ServiceClient) => {
    await toggleStatus(client.id);
  };

  const handleCreateSuccess = (token: string) => {
    setCreateDialogOpen(false);
    onCreateSuccess(token);
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Error Alert */}
        {(errors.fetch || errors.create || errors.rotate || errors.toggle) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.fetch || errors.create || errors.rotate || errors.toggle || 'An error occurred'}
            </AlertDescription>
          </Alert>
        )}

        {/* Service Clients Table */}
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
                Service Clients
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {pagination && (
                  <div
                    className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Showing {pagination.from}-{pagination.to} of{' '}
                      {pagination.total} clients
                    </span>
                    <span className="sm:hidden">
                      {pagination.from}-{pagination.to} of {pagination.total}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  {onRefresh && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefresh}
                      disabled={loading.fetching}
                      className="flex items-center gap-2"
                      style={{
                        backgroundColor: loading.fetching
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        borderColor: 'var(--border)',
                        opacity: loading.fetching ? 0.6 : 1,
                      }}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading.fetching ? 'animate-spin' : ''}`}
                      />
                      <span className="hidden xs:inline">Refresh</span>
                    </Button>
                  )}
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="flex items-center justify-center gap-2 text-sm"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden xs:inline">Create Client</span>
                    <span className="xs:hidden">Create</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0" style={{ backgroundColor: 'var(--card)' }}>
            {loading.fetching ? (
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
                  Loading service clients...
                </span>
              </div>
            ) : !clients.length ? (
              <div
                className="text-center py-6 sm:py-8"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <p
                  className="text-sm sm:text-base text-muted-foreground"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  No service clients found.
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
                        className="min-w-[8rem] text-xs sm:text-sm"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Name
                      </TableHead>
                      <TableHead
                        className="min-w-[4rem] text-xs sm:text-sm hidden sm:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Status
                      </TableHead>
                      <TableHead
                        className="min-w-[6rem] text-xs sm:text-sm hidden md:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Expires
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
                    {clients.map((client) => (
                      <TableRow
                        key={client.id}
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
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-xs sm:text-sm font-medium truncate"
                              style={{ color: 'var(--foreground)' }}
                              title={client.name}
                            >
                              {client.name}
                            </div>
                            {client.notes && (
                              <div
                                className="text-xs mt-1 truncate"
                                style={{ color: 'var(--muted-foreground)' }}
                                title={client.notes}
                              >
                                {client.notes}
                              </div>
                            )}
                            {/* Mobile: Show status and expiry inline */}
                            <div className="sm:hidden mt-1 space-y-1">
                              <Badge
                                variant={client.is_active ? 'default' : 'secondary'}
                                className="text-xs px-1 py-0.5"
                                style={{
                                  backgroundColor: client.is_active ? 'var(--primary)' : 'var(--secondary)',
                                  color: client.is_active ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
                                }}
                              >
                                {client.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <div
                                className="text-xs"
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                Expires: {formatDate(client.expires_at)}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                          <Badge
                            variant={client.is_active ? 'default' : 'secondary'}
                            className="text-xs px-2 py-1"
                            style={{
                              backgroundColor: client.is_active ? 'var(--primary)' : 'var(--secondary)',
                              color: client.is_active ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
                            }}
                          >
                            {client.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>

                        <TableCell
                          className="p-2 sm:p-4 hidden md:table-cell text-xs sm:text-sm"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {formatDate(client.expires_at)}
                        </TableCell>

                        <TableCell className="text-right p-2 sm:p-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRotateToken(client)}
                              disabled={loading.rotating}
                              className="text-xs px-2 sm:px-3"
                              style={{
                                backgroundColor: 'var(--secondary)',
                                color: 'var(--secondary-foreground)',
                                borderColor: 'var(--border)',
                              }}
                            >
                              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Rotate</span>
                            </Button>
                            <Button
                              variant={client.is_active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleStatus(client)}
                              disabled={loading.toggling}
                              className="text-xs px-2 sm:px-3"
                            >
                              <Power className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">{client.is_active ? 'Deactivate' : 'Activate'}</span>
                              <span className="sm:hidden">{client.is_active ? 'Off' : 'On'}</span>
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
                    disabled={pagination.current_page <= 1 || loading.fetching}
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    style={{
                      backgroundColor:
                        pagination.current_page <= 1 || loading.fetching
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.current_page <= 1 || loading.fetching
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
                      loading.fetching
                    }
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    style={{
                      backgroundColor:
                        pagination.current_page >= pagination.last_page ||
                        loading.fetching
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.current_page >= pagination.last_page ||
                        loading.fetching
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

      {/* Create Dialog */}
      <CreateServiceClientDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};
