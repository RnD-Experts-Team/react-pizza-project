/**
 * StoreRolesSection Component
 * Displays roles associated with a specific store in a table format
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreRoles } from '../../features/stores/store/storesSlice';
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
import { Shield, AlertCircle, Calendar, User } from 'lucide-react';
import type { AppDispatch, RootState } from '../../store';

interface StoreRolesSectionProps {
  storeId: string;
}

export const StoreRolesSection: React.FC<StoreRolesSectionProps> = ({
  storeId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get roles data and states from Redux
  const roles = useSelector((state: RootState) => 
    state.stores.storeRoles[storeId] || []
  );
  const loading = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStoreRoles.loading
  );
  const error = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStoreRoles.error
  );

  // Fetch store roles on component mount
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreRoles(storeId));
    }
  }, [dispatch, storeId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGuardDisplayName = (guardName: string) => {
    // Convert guard names to more readable format
    switch (guardName.toLowerCase()) {
      case 'web':
        return 'Web Application';
      case 'api':
        return 'API Access';
      case 'admin':
        return 'Admin Panel';
      default:
        return guardName.charAt(0).toUpperCase() + guardName.slice(1);
    }
  };

  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes('admin') || name.includes('manager')) {
      return '👑';
    } else if (name.includes('user') || name.includes('member')) {
      return '👤';
    } else if (name.includes('viewer') || name.includes('read')) {
      return '👁️';
    }
    return '🔐';
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded" />
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
      <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        No roles assigned
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        This store doesn't have any roles assigned yet.
      </p>
    </div>
  );

  const renderRolesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Guard</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={`${role.id}-${role.pivot.user_id}`}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">
                    {getRoleIcon(role.name)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {role.id}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {getGuardDisplayName(role.guard_name)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">User ID: {role.pivot.user_id}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={role.pivot.is_active ? 'default' : 'secondary'}
                className={role.pivot.is_active ? 'bg-green-100 text-green-800' : ''}
              >
                {role.pivot.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(role.pivot.created_at)}</span>
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
            <Shield className="h-5 w-5" />
            <CardTitle>Store Roles</CardTitle>
            <Badge variant="secondary" className="ml-2">
              {roles.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load store roles: {error}
            </AlertDescription>
          </Alert>
        )}

        {loading && renderLoadingSkeleton()}
        
        {!loading && !error && roles.length === 0 && renderEmptyState()}
        
        {!loading && !error && roles.length > 0 && (
          <div className="rounded-md border">
            {renderRolesTable()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreRolesSection;