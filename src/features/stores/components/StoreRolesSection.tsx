/**
 * StoreRolesSection Component
 * Displays roles associated with a specific store in a table format
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreRoles } from '@/features/stores/store/storesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle, Calendar, User, RefreshCw } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store';

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

  const handleRetry = () => {
    if (storeId) {
      dispatch(fetchStoreRoles(storeId));
    }
  };

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
    <div className="space-y-2 sm:space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded mx-auto sm:mx-0" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mx-auto sm:mx-0" />
            <Skeleton className="h-3 w-32 sm:w-48 mx-auto sm:mx-0" />
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-6 sm:py-8 lg:py-12 px-4">
      <Shield className="mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-muted-foreground mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg lg:text-xl font-medium text-muted-foreground mb-2">
        No roles assigned
      </h3>
      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 max-w-md mx-auto">
        This store doesn't have any roles assigned yet.
      </p>
    </div>
  );

  const renderRolesTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] sm:min-w-[250px]">Role</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[120px]">Guard</TableHead>
            <TableHead className="hidden md:table-cell min-w-[140px]">User</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="hidden lg:table-cell min-w-[120px]">Assigned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={`${role.id}-${role.pivot.user_id}`}>
              <TableCell className="py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-primary/10 flex items-center justify-center mx-auto sm:mx-0 flex-shrink-0">
                    <span className="text-sm sm:text-lg">
                      {getRoleIcon(role.name)}
                    </span>
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">{role.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      ID: {role.id}
                    </div>
                    {/* Show guard and user info on mobile */}
                    <div className="sm:hidden mt-1 space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {getGuardDisplayName(role.guard_name)}
                      </Badge>
                      <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>User: {role.pivot.user_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell py-3 sm:py-4">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {getGuardDisplayName(role.guard_name)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell py-3 sm:py-4">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">User ID: {role.pivot.user_id}</span>
                </div>
              </TableCell>
              <TableCell className="py-3 sm:py-4">
                <div className="flex justify-center sm:justify-start">
                  <Badge 
                    variant={role.pivot.is_active ? 'default' : 'secondary'}
                    className={`text-xs sm:text-sm ${
                      role.pivot.is_active ? 'bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b] dark:text-[#10b981]' : ''
                    }`}
                  >
                    {role.pivot.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {/* Show assigned date on mobile */}
                <div className="lg:hidden mt-1 flex items-center justify-center sm:justify-start space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(role.pivot.created_at)}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell py-3 sm:py-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{formatDate(role.pivot.created_at)}</span>
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
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
            <CardTitle className="text-base sm:text-lg lg:text-xl">Store Roles</CardTitle>
            <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs sm:text-sm">
              {roles.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        {error && (
          <Alert variant="destructive" className="mb-3 sm:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-sm">Failed to load store roles: {error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="sm:ml-4 h-8 text-xs sm:text-sm w-full sm:w-auto"
              >
                <RefreshCw className="mr-1 sm:mr-2 h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loading && renderLoadingSkeleton()}
        
        {!loading && !error && roles.length === 0 && renderEmptyState()}
        
        {!loading && !error && roles.length > 0 && (
          <div className="rounded-md border border-border bg-card">
            {renderRolesTable()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreRolesSection;