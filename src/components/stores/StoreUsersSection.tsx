/**
 * StoreUsersSection Component
 * Displays users associated with a specific store in a table format
 * Fully responsive with light/dark mode support using CSS custom properties
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreUsers } from '../../features/stores/store/storesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Users, AlertCircle, Mail, Calendar, RefreshCw } from 'lucide-react';
import type { StoreUser } from '../../features/stores/types';
import type { AppDispatch, RootState } from '../../store';

interface StoreUsersSectionProps {
  storeId: string;
}

export const StoreUsersSection: React.FC<StoreUsersSectionProps> = ({
  storeId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get users data and states from Redux
  const users = useSelector((state: RootState) => 
    state.stores.storeUsers[storeId] || []
  );
  const loading = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStoreUsers.loading
  );
  const error = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStoreUsers.error
  );

  // Fetch store users on component mount
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreUsers(storeId));
    }
  }, [dispatch, storeId]);

  const handleRetry = () => {
    if (storeId) {
      dispatch(fetchStoreUsers(storeId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRole = (user: StoreUser) => {
    // You might want to fetch role names separately or include them in the user data
    return `Role ID: ${user.pivot.role_id}`;
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-2 sm:space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <div className="space-y-1 sm:space-y-2 flex-1">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            <Skeleton className="h-2 sm:h-3 w-32 sm:w-48" />
          </div>
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-6 sm:py-8 px-4">
      <Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
        No users assigned
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
        This store doesn't have any users assigned yet.
      </p>
    </div>
  );

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] sm:min-w-[250px]">User</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[100px]">Role</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="hidden md:table-cell min-w-[120px]">Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={`${user.id}-${user.pivot.role_id}`}>
              <TableCell className="py-2 sm:py-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div 
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                    }}
                  >
                    <span 
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: 'var(--primary)' }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      ID: {user.id}
                    </div>
                    {/* Show email on mobile under name */}
                    <div className="sm:hidden text-xs text-muted-foreground truncate mt-1">
                      {user.email}
                      {user.email_verified_at && (
                        <span 
                          className="ml-2 text-xs"
                          style={{ color: '#22c55e' }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm truncate max-w-[150px] lg:max-w-none">{user.email}</span>
                </div>
                {user.email_verified_at && (
                  <div 
                    className="text-xs mt-1"
                    style={{ color: '#22c55e' }}
                  >
                    Verified
                  </div>
                )}
              </TableCell>
              <TableCell className="py-2 sm:py-4">
                <Badge variant="outline" className="text-xs">
                  {formatRole(user)}
                </Badge>
              </TableCell>
              <TableCell className="py-2 sm:py-4">
                <Badge 
                  variant={user.pivot.is_active ? 'default' : 'secondary'}
                  className={`text-xs ${
                    user.pivot.is_active 
                      ? 'text-white'
                      : ''
                  }`}
                  style={{
                    backgroundColor: user.pivot.is_active ? '#22c55e' : undefined,
                    color: user.pivot.is_active ? '#ffffff' : undefined,
                  }}
                >
                  {user.pivot.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell py-2 sm:py-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">{formatDate(user.pivot.created_at)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Store Users</CardTitle>
            <Badge variant="secondary" className="ml-2 text-xs px-2 py-1 flex-shrink-0">
              {users.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
        {error && (
          <Alert variant="destructive" className="mb-3 sm:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm">Failed to load store users: {error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="h-8 text-xs self-start sm:self-auto"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loading && renderLoadingSkeleton()}
        
        {!loading && !error && users.length === 0 && renderEmptyState()}
        
        {!loading && !error && users.length > 0 && (
          <div className="rounded-md border overflow-hidden">
            {renderUsersTable()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreUsersSection;