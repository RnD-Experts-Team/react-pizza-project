/**
 * StoresTable Component
 * 
 * Displays a table of stores with search functionality and action buttons.
 * Includes responsive design and handles loading, error, and empty states.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Loader2, Search, Store, Eye } from 'lucide-react';

interface StoreData {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  metadata: {
    phone?: string;
    address?: string;
  };
}

interface StoresTableProps {
  stores: StoreData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAssignRole: (storeId: string) => void;
  onViewAssignments: (storeId: string) => void;
  formatDate: (dateString: string) => string;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  stores,
  loading,
  error,
  searchTerm,
  onSearchChange,
  onAssignRole,
  onViewAssignments,
  formatDate,
}) => {

  // Filter stores based on search term
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <CardTitle className="text-lg sm:text-xl lg:text-2xl text-card-foreground">Stores</CardTitle>
          </div>
          <div className="relative w-full lg:w-80 xl:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores by name or ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {error ? (
          <div className="text-destructive text-center py-6 sm:py-8 text-sm sm:text-base">
            Error loading stores: {error}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
            <span className="ml-2 sm:ml-3 text-sm sm:text-base text-muted-foreground">Loading stores...</span>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Store ID</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">Phone</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">Address</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">Created</TableHead>
                    <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 sm:py-12 text-muted-foreground text-sm sm:text-base">
                        {searchTerm ? 'No stores found matching your search' : 'No stores found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStores.map((store) => (
                      <TableRow key={store.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4">
                          <div className="text-foreground font-medium truncate max-w-[100px] sm:max-w-none">
                            {store.id}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium px-3 sm:px-4 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                            {store.name}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden truncate max-w-[120px]">
                            {store.metadata.phone || 'No phone'}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                          <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px]">
                            {store.metadata.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
                          <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px]" title={store.metadata.address || 'N/A'}>
                            {store.metadata.address || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                          <Badge 
                            variant={store.is_active ? 'default' : 'secondary'}
                            className={`text-xs px-2 py-1 ${
                              store.is_active 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {store.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                          {formatDate(store.created_at)}
                        </TableCell>
                        <TableCell className="text-right px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAssignRole(store.id)}
                              className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              Assign
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewAssignments(store.id)}
                              className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              <Eye className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoresTable;