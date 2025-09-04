import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Power } from 'lucide-react';
import type { ServiceClient } from '@/features/serviceClients/types';

interface ClientRowProps {
  client: ServiceClient;
  loading: {
    rotating: boolean;
    toggling: boolean;
  };
  onToggleStatus: (client: ServiceClient) => void;
  onRotateToken: (client: ServiceClient) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never expires';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

export const ClientRow: React.FC<ClientRowProps> = ({
  client,
  loading,
  onToggleStatus,
  onRotateToken
}) => {
  return (
    <TableRow
      key={client.id}
      className="border-border bg-card hover:bg-muted/50"
    >
      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 text-foreground">
        <div className="min-w-0 flex-1">
          <div
            className="text-xs sm:text-sm font-medium truncate text-foreground"
            title={client.name}
          >
            {client.name}
          </div>
          {client.notes && (
            <div
              className="text-xs mt-1 truncate text-muted-foreground"
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
            >
              {client.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <div className="text-xs text-muted-foreground">
              Expires: {formatDate(client.expires_at)}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
        <Badge
          variant={client.is_active ? 'default' : 'secondary'}
          className="text-xs px-2 py-1"
        >
          {client.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>

      <TableCell className="p-2 sm:p-4 hidden md:table-cell text-xs sm:text-sm text-foreground">
        {formatDate(client.expires_at)}
      </TableCell>

      <TableCell className="text-right p-2 sm:p-4">
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRotateToken(client)}
            disabled={loading.rotating}
            className="text-xs px-2 sm:px-3 bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">Rotate</span>
          </Button>
          <Button
            variant={client.is_active ? "destructive" : "default"}
            size="sm"
            onClick={() => onToggleStatus(client)}
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
  );
};
