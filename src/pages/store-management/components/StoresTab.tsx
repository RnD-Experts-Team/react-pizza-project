import React from 'react';
import type { Store, PaginationMeta } from '@/types/storeManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Store as StoreIcon, Edit, Eye, MapPin, Phone, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoresTabProps {
  stores: Store[];
  pagination: PaginationMeta;
  onStoreSelect: (storeId: string) => void;
  onFetchStores: (options?: { page?: number }) => void;
  getStatusColor: (isActive: boolean) => string;
  getStatusText: (isActive: boolean) => string;
}

const StoresTab: React.FC<StoresTabProps> = ({
  stores,
  pagination,
  onStoreSelect,
  onFetchStores,
  getStatusColor,
  getStatusText
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stores</CardTitle>
        <CardDescription>
          Manage store locations and their information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stores.length === 0 ? (
            <div className="text-center py-8">
              <StoreIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No stores found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new store.
              </p>
              <div className="mt-6">
                <Link to="/store-management/create-store">
                  <Button>
                    <StoreIcon className="mr-2 h-4 w-4" />
                    Create Store
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            stores.map((store) => (
              <Card key={store.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <StoreIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {store.id}</p>
                      </div>
                      <Badge className={getStatusColor(store.is_active)}>
                        {getStatusText(store.is_active)}
                      </Badge>
                    </div>
                    
                    {store.metadata && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {store.metadata.address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{store.metadata.address}</span>
                          </div>
                        )}
                        {store.metadata.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{store.metadata.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Created: {formatDate(store.created_at)}</span>
                      <span>Updated: {formatDate(store.updated_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Link to={`/store-management/store-detail/${store.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/store-management/edit-store/${store.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Separator className="my-1" />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => onStoreSelect(store.id)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => onStoreSelect(store.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Roles
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} stores
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => onFetchStores({ page: pagination.current_page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => onFetchStores({ page: pagination.current_page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoresTab;