// src/features/serviceClients/components/ServiceClientsTable.tsx

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Power } from 'lucide-react';
import { useServiceClients } from '../../features/serviceClients/hooks/useServiceClients';
import type { ServiceClient } from '../../features/serviceClients/types';

interface ServiceClientsTableProps {
  onRotateToken: (client: ServiceClient) => void;
}

export const ServiceClientsTable: React.FC<ServiceClientsTableProps> = ({
  onRotateToken,
}) => {
  const { clients, loading, toggleStatus } = useServiceClients();

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

  if (loading.fetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No service clients found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <div>
                  <p>{client.name}</p>
                  {client.notes && (
                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={client.is_active ? 'default' : 'secondary'}>
                  {client.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(client.expires_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRotateToken(client)}
                    disabled={loading.rotating}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Rotate
                  </Button>
                  <Button
                    variant={client.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(client)}
                    disabled={loading.toggling}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    {client.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
