/**
 * Stores Hierarchy Main Page
 * 
 * A modern, responsive page that displays all stores with hierarchy navigation.
 * Features beautiful UI and direct access to role hierarchies.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../features/stores/hooks/useStores';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Network,
  RefreshCw,
  AlertCircle,
  Building2
} from 'lucide-react';
import { cn } from '../../lib/utils';



export const StoresHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    stores,
    loading,
    error,
    refetch
  } = useStores(true);

  const handleViewHierarchy = (storeId: string) => {
    navigate(`/stores-hierarchy/${storeId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };



  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Store Hierarchies
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage and view role hierarchies across all store locations
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="hover:bg-accent"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Loading Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Building2 className="h-5 w-5" />
              <span>Store Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Store Hierarchies
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage and view role hierarchies across all store locations
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
              className="hover:bg-accent"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Building2 className="h-5 w-5" />
            <span>Store Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stores.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No stores found
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Get started by adding your first store location
              </p>
            </div>
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
                          onClick={() => handleViewHierarchy(store.id)}
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
    </div>
  );
};

export default StoresHierarchyPage;