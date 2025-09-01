/**
 * StoresTable Component
 * 
 * Displays the main stores data table with store information and actions.
 * Handles store data rendering, status badges, and hierarchy navigation.
 */

import React from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Network, Building2 } from 'lucide-react';
import type { Store } from '../../../features/stores/types';
import { EmptyState } from './EmptyState';

interface StoresTableProps {
  stores: Store[];
  onViewHierarchy: (storeId: string) => void;
  formatDate: (dateString: string) => string;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  stores,
  onViewHierarchy,
  formatDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Building2 className="h-5 w-5" />
          <span>Store Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {stores.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Store ID</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[120px]">Phone</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[200px]">Address</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[100px]">Created</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs sm:text-sm">
                      {store.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm sm:text-base">
                      {store.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {store.metadata.phone || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm">
                      {store.metadata.address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={store.is_active ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {store.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm text-muted-foreground">
                      {formatDate(store.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => onViewHierarchy(store.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs sm:text-sm hover:bg-accent"
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
    </Card>
  );
};

export default StoresTable;