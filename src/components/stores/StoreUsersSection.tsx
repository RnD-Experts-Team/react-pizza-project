/**
 * StoreUsersSection Component
 * Displays users associated with a specific store in a table format
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
import { Users, AlertCircle, Mail, Calendar } from 'lucide-react';
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
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        No users assigned
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        This store doesn't have any users assigned yet.
      </p>
    </div>
  );

  const renderUsersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Added</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={`${user.id}-${user.pivot.role_id}`}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {user.id}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.email_verified_at && (
                <div className="text-xs text-green-600 mt-1">
                  Verified
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {formatRole(user)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant={user.pivot.is_active ? 'default' : 'secondary'}
                className={user.pivot.is_active ? 'bg-green-100 text-green-800' : ''}
              >
                {user.pivot.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(user.pivot.created_at)}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>Store Users</CardTitle>
            <Badge variant="secondary" className="ml-2">
              {users.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load store users: {error}
            </AlertDescription>
          </Alert>
        )}

        {loading && renderLoadingSkeleton()}
        
        {!loading && !error && users.length === 0 && renderEmptyState()}
        
        {!loading && !error && users.length > 0 && (
          <div className="rounded-md border">
            {renderUsersTable()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreUsersSection;