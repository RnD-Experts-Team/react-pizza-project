/**
 * Service Clients Table Component
 * 
 * Features:
 * - Displays service clients in a sortable table with Card wrapper
 * - Create, rotate token, and toggle status functionality
 * - Loading states and responsive design
 * - Pagination functionality with per page selection
 * - Error handling and refresh capability
 * - Light/dark mode compatibility using CSS variables
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useServiceClients } from '@/features/serviceClients/hooks/useServiceClients';
import type { ServiceClient } from '@/features/serviceClients/types';
import { ErrorAlert } from '@/features/serviceClients/components/ServiceClientsTable/ErrorAlert';
import { TableHeader } from '@/features/serviceClients/components/ServiceClientsTable/TableHeader';
import { ServiceClientsTableContent } from '@/features/serviceClients/components/ServiceClientsTable/ServiceClientsTableContent';
import { PaginationFooter } from '@/features/serviceClients/components/ServiceClientsTable/PaginationFooter';
import { DialogContainer } from '@/features/serviceClients/components/ServiceClientsTable/DialogContainert';

interface ServiceClientsTableProps {
  onRotateToken?: (client: ServiceClient) => void;
  onCreateSuccess?: (token: string) => void;
}

export const ServiceClientsTable: React.FC<ServiceClientsTableProps> = ({
  onCreateSuccess,
}) => {
  const { clients, loading, errors, pagination, toggleStatus, fetchClients } = useServiceClients();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Dialog states
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ServiceClient | null>(null);
  const [currentToken, setCurrentToken] = useState('');

  // Per page options
  const perPageOptions = [5, 10, 15, 20, 25, 50];

  const handleToggleStatus = async (client: ServiceClient) => {
    await toggleStatus(client.id);
  };

  const handleCreateSuccess = (token: string) => {
    setCreateDialogOpen(false);
    setCurrentToken(token);
    setTokenDialogOpen(true);
    toast({
      title: "Success",
      description: "Service client created successfully!",
    });
    // Refresh the current page
    fetchClients({ per_page: perPage, page: currentPage });
    if (onCreateSuccess) {
      onCreateSuccess(token);
    }
  };
  
  const handleRotateSuccess = (token: string) => {
    setCurrentToken(token);
    setTokenDialogOpen(true);
    setSelectedClient(null);
    toast({
      title: "Success",
      description: "Service token rotated successfully!",
    });
  };
  
  const handleRotateToken = (client: ServiceClient) => {
    setSelectedClient(client);
    setRotateDialogOpen(true);
  };
  
  const handleCloseTokenDialog = () => {
    setTokenDialogOpen(false);
    setCurrentToken('');
  };

  // Fetch clients when pagination parameters change
  useEffect(() => {
    fetchClients({ 
      per_page: perPage, 
      page: currentPage 
    });
  }, [currentPage, perPage, fetchClients]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue: string) => {
    const perPage = Number(perPageValue);
    setPerPage(perPage);
    setCurrentPage(1); // Reset to first page when changing per page
  };
  
  const handleRefresh = () => {
    fetchClients({ per_page: perPage, page: currentPage });
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Error Alert */}
        <ErrorAlert errors={errors} />

        {/* Service Clients Table */}
        <Card className="rounded-sm bg-card border border-border shadow-sm">
          <CardHeader className="mb-0 bg-muted border-b border-border">
            <TableHeader 
              loading={loading.fetching}
              onRefresh={handleRefresh}
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          </CardHeader>
          <CardContent className="p-0 bg-card">
            <ServiceClientsTableContent 
              clients={clients}
              loading={loading}
              onToggleStatus={handleToggleStatus}
              onRotateToken={handleRotateToken}
            />
          </CardContent>
          {pagination && pagination.last_page > 0 && (
            <CardFooter className="bg-card border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3">
              <PaginationFooter 
                pagination={pagination}
                perPage={perPage}
                perPageOptions={perPageOptions}
                loading={loading.fetching}
                onPerPageChange={handlePerPageChange}
                onPageChange={handlePageChange}
              />
            </CardFooter>
          )}
        </Card>
      </div>

      <DialogContainer 
        createDialogOpen={createDialogOpen}
        rotateDialogOpen={rotateDialogOpen}
        tokenDialogOpen={tokenDialogOpen}
        selectedClient={selectedClient}
        currentToken={currentToken}
        onCreateDialogChange={setCreateDialogOpen}
        onRotateDialogChange={setRotateDialogOpen}
        onTokenDialogChange={setTokenDialogOpen}
        onCreateSuccess={handleCreateSuccess}
        onRotateSuccess={handleRotateSuccess}
        onCloseTokenDialog={handleCloseTokenDialog}
      />
    </>
  );
};
