import React from 'react';
import { Table, TableBody,  TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ServiceClient } from '@/features/serviceClients/types';
import { ClientRow } from '@/features/serviceClients/components/ServiceClientsTable/ClientRow';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

interface ServiceClientsTableContentProps {
  clients: ServiceClient[];
  loading: {
    fetching: boolean;
    rotating: boolean;
    toggling: boolean;
  };
  onToggleStatus: (client: ServiceClient) => void;
  onRotateToken: (client: ServiceClient) => void;
}

export const ServiceClientsTableContent: React.FC<ServiceClientsTableContentProps> = ({
  clients,
  loading,
  onToggleStatus,
  onRotateToken
}) => {
  if (loading.fetching) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 bg-card">
        <EnhancedLoadingComponent 
          message="Loading service clients..."
          size="medium"
          className="h-48 sm:h-64 bg-card text-muted-foreground"
        />
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="text-center py-6 sm:py-8 bg-card">
        <p className="text-sm sm:text-base text-muted-foreground">
          No service clients found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-muted border-b border-border">
          <TableRow className="border-border">
            <TableHead className="min-w-[8rem] text-xs sm:text-sm text-foreground font-semibold">
              Name
            </TableHead>
            <TableHead className="min-w-[4rem] text-xs sm:text-sm hidden sm:table-cell text-foreground font-semibold">
              Status
            </TableHead>
            <TableHead className="min-w-[6rem] text-xs sm:text-sm hidden md:table-cell text-foreground font-semibold">
              Expires
            </TableHead>
            <TableHead className="min-w-[6rem] text-xs sm:text-sm text-right text-foreground font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              loading={loading}
              onToggleStatus={onToggleStatus}
              onRotateToken={onRotateToken}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
