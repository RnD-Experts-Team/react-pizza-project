/**
 * StoresList Component
 * Example component demonstrating how to use the Store management hooks
 * with shadcn/ui components, TailwindCSS, and proper error handling
 */

import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2, Loader2 } from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Store management imports
import { useStores } from '../../features/stores/hooks/useStores';
import type { Store } from '../../features/stores/types';

/**
 * Props for the StoresList component
 */
interface StoresListProps {
  onCreateStore?: () => void;
  onEditStore?: (store: Store) => void;
  onViewStore?: (store: Store) => void;
  onDeleteStore?: (store: Store) => void;
  className?: string;
}

/**
 * Main StoresList component
 */
export const StoresList: React.FC<StoresListProps> = ({
  onCreateStore,
  onEditStore,
  onViewStore,
  onDeleteStore,
  className = '',
}) => {
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Use our custom hooks
  const {
    stores,
    pagination,
    loading,
    error,
    refetch,
    totalStores,
    hasStores,
    isEmpty,
    currentPageData,
  } = useStores(true); // autoFetch = true

  const handleDeleteClick = (store: Store) => {
    setStoreToDelete({ id: store.id, name: store.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!storeToDelete || !onDeleteStore) return;
    
    setDeleteLoading(true);
    try {
      const store = stores.find(s => s.id === storeToDelete.id);
      if (store) {
        await onDeleteStore(store);
      }
      setDeleteDialogOpen(false);
      setStoreToDelete(null);
      // Success feedback could be added here (toast notification)
    } catch (error) {
      console.error('Failed to delete store:', error);
      // Error feedback could be added here (toast notification)
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format phone number for display
  const formatPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
    }
    return phone;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <Alert variant="destructive">
      <AlertDescription>
        {error || 'Failed to load stores. Please try again.'}
      </AlertDescription>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => refetch()}
      >
        Retry
      </Button>
    </Alert>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No stores found</h3>
          <p className="text-gray-500 max-w-sm">
            Get started by creating your first store.
          </p>
          {onCreateStore && (
            <Button onClick={onCreateStore} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Store
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render store actions buttons
  const renderStoreActions = (store: Store) => (
    <div className="flex items-center justify-end gap-2">
      {onViewStore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewStore(store)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEditStore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditStore(store)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDeleteStore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteClick(store)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          disabled={deleteLoading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page > 1) {
                  refetch({ page: pagination.current_page - 1 });
                }
              }}
              className={pagination.current_page <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
            const page = i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    refetch({ page });
                  }}
                  isActive={page === pagination.current_page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {pagination.last_page > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page < pagination.last_page) {
                  refetch({ page: pagination.current_page + 1 });
                }
              }}
              className={pagination.current_page >= pagination.last_page ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>

      {/* Results Summary */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {totalStores > 0 
              ? `Showing ${currentPageData.from}-${currentPageData.to} of ${totalStores} stores`
              : 'No stores found'
            }
          </div>
        </div>
      )}

      {/* Content */}
      {loading && renderLoadingSkeleton()}
      {error && renderError()}
      {!loading && !error && isEmpty && renderEmptyState()}
      
      {!loading && !error && hasStores && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-mono text-sm">
                    {store.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {store.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {store.metadata.address}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatPhone(store.metadata.phone)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={store.is_active ? "default" : "secondary"}>
                      {store.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(store.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderStoreActions(store)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {!loading && !error && hasStores && renderPagination()}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the store{' '}
              <span className="font-semibold">{storeToDelete?.name}</span> and remove all its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Store
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoresList;
