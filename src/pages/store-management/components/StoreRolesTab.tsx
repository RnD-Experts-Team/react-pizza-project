import React from 'react';
import type { StoreRole, PaginationMeta } from '@/types/storeManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Calendar, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoreRolesTabProps {
  storeRoles: StoreRole[];
  pagination: PaginationMeta;
  selectedStoreId: string | null;
  onFetchStoreRoles: (storeId: string, options?: { page?: number }) => void;
  getRoleColor: (roleName: string) => string;
}

const StoreRolesTab: React.FC<StoreRolesTabProps> = ({
  storeRoles,
  pagination,
  selectedStoreId,
  onFetchStoreRoles,
  getRoleColor
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!selectedStoreId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Store Roles</CardTitle>
          <CardDescription>
            Select a store to view its roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No store selected</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please select a store from the Stores tab to view its roles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Roles</CardTitle>
        <CardDescription>
          Roles associated with the selected store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {storeRoles.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No roles found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This store doesn't have any roles assigned yet.
              </p>
            </div>
          ) : (
            storeRoles.map((storeRole) => (
              <Card key={`${storeRole.store_id}-${storeRole.role_id}`} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{storeRole.role_name}</h3>
                        <Badge className={getRoleColor(storeRole.role_name)}>
                          {storeRole.role_name}
                        </Badge>
                      </div>
                      
                      {storeRole.role_description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {storeRole.role_description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Assigned: {formatDate(storeRole.created_at)}</span>
                        </div>
                        {storeRole.updated_at !== storeRole.created_at && (
                          <span>Updated: {formatDate(storeRole.updated_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link to={`/user-management/role-detail/${storeRole.role_id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Role
                      </Button>
                    </Link>
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
              Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} roles
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => selectedStoreId && onFetchStoreRoles(selectedStoreId, { page: pagination.current_page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => selectedStoreId && onFetchStoreRoles(selectedStoreId, { page: pagination.current_page + 1 })}
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

export default StoreRolesTab;