// src/components/serviceClients/ServiceClientsTable.tsx

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Power, Plus } from 'lucide-react';
import { useServiceClients } from '../../features/serviceClients/hooks/useServiceClients';
import { CreateServiceClientDialog } from './CreateServiceClientDialog';
import type { ServiceClient } from '../../features/serviceClients/types';

interface ServiceClientsTableProps {
  onRotateToken: (client: ServiceClient) => void;
  onCreateSuccess: (token: string) => void;
}

export const ServiceClientsTable: React.FC<ServiceClientsTableProps> = ({
  onRotateToken,
  onCreateSuccess,
}) => {
  const { clients, loading, toggleStatus } = useServiceClients();
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

  if (loading.fetching) {
    return (
      <div className="flex items-center justify-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-muted-foreground text-sm sm:text-base">No service clients found</p>
      </div>
    );
  }

  return (
    <>
      {/* Create Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Service Client</span>
          <span className="sm:hidden">Create Client</span>
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm sm:text-base">Name</TableHead>
              <TableHead className="text-sm sm:text-base hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-sm sm:text-base hidden md:table-cell">Expires</TableHead>
              <TableHead className="text-right text-sm sm:text-base">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="text-sm sm:text-base">{client.name}</p>
                    {client.notes && (
                      <p className="text-xs sm:text-sm text-muted-foreground">{client.notes}</p>
                    )}
                    {/* Mobile-only status and expiry info */}
                    <div className="sm:hidden mt-1 space-y-1">
                      <Badge variant={client.is_active ? 'default' : 'secondary'} className="text-xs">
                        {client.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Expires: {formatDate(client.expires_at)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={client.is_active ? 'default' : 'secondary'}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {formatDate(client.expires_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRotateToken(client)}
                      disabled={loading.rotating}
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Rotate</span>
                    </Button>
                    <Button
                      variant={client.is_active ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(client)}
                      disabled={loading.toggling}
                      className="text-xs sm:text-sm px-2 sm:px-3"
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
