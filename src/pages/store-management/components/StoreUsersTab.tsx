import React from 'react';
import type { StoreUser, PaginationMeta } from '@/types/storeManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck } from 'lucide-react';

interface StoreUsersTabProps {
  storeUsers: StoreUser[];
  pagination: PaginationMeta;
  selectedStoreId: string | null;
  onFetchStoreUsers: (storeId: string, options?: { page?: number }) => void;
  getUserInitials: (name: string) => string;
  getRoleColor: (roleName: string) => string;
}

const StoreUsersTab: React.FC<StoreUsersTabProps> = ({
  pagination,
  selectedStoreId,
  onFetchStoreUsers,
}) => {
  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric'
  //   });
  // };

  if (!selectedStoreId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Store Users</CardTitle>
          <CardDescription>
            Select a store to view its users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No store selected</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please select a store from the Stores tab to view its users.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Users</CardTitle>
        <CardDescription>
          Users associated with the selected store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* {storeUsers.length === 0 ? ( */}
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This store doesn't have any users assigned yet.
              </p>
            </div>
          {/* ) : (
            storeUsers.map((storeUser) => (
              <Card key={`${storeUser.store_id}-${storeUser.user_id}`} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(storeUser.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{storeUser.user_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{storeUser.user_email}</span>
                      </div>
                      
                      {storeUser.role_name && (
                        <div className="flex gap-2 mt-2">
                          <Badge className={getRoleColor(storeUser.role_name)}>
                            {storeUser.role_name}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Assigned: {formatDate(storeUser.created_at)}</span>
                        </div>
                        {storeUser.updated_at !== storeUser.created_at && (
                          <span>Updated: {formatDate(storeUser.updated_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link to={`/user-management/user-detail/${storeUser.user_id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View User
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )} */}
        </div>
        
        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => selectedStoreId && onFetchStoreUsers(selectedStoreId, { page: pagination.current_page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => selectedStoreId && onFetchStoreUsers(selectedStoreId, { page: pagination.current_page + 1 })}
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

export default StoreUsersTab;