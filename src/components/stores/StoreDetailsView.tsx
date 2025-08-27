/**
 * StoreDetailsView Component
 * Detailed view component for displaying store information, users, and roles
 * with proper loading states and error handling
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  Shield, 
  Edit, 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Store management imports
import { useStore, useStoreUsers, useStoreRoles } from '../../features/stores/hooks/useStores';
import type { Store, StoreUser, StoreRole } from '../../features/stores/types';

/**
 * Props for the StoreDetailsView component
 */
interface StoreDetailsViewProps {
  storeId: string | null;
  onEdit?: (store: Store) => void;
  onBack?: () => void;
  onUserAction?: (user: StoreUser, action: string) => void;
  onRoleAction?: (role: StoreRole, action: string) => void;
  className?: string;
}

/**
 * StoreDetailsView component
 */
export const StoreDetailsView: React.FC<StoreDetailsViewProps> = ({
  storeId,
  onEdit,
  onBack,
  onUserAction,
  onRoleAction,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Use custom hooks
  const { store, loading: storeLoading, error: storeError, exists } = useStore(storeId);
  const { users, loading: usersLoading, error: usersError, hasUsers, userCount } = useStoreUsers(storeId);
  const { roles, loading: rolesLoading, error: rolesError, hasRoles, roleCount } = useStoreRoles(storeId);

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
      month: 'long',
      day: 'numeric',
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
  };

  


  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Render error state
  const renderError = (error: string) => (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  // Render not found state
  const renderNotFound = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold">Store Not Found</h3>
          <p className="text-gray-500">
            The store you're looking for doesn't exist or has been removed.
          </p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render user actions dropdown
  const renderUserActions = (user: StoreUser) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onUserAction?.(user, 'view')}>
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUserAction?.(user, 'edit')}>
          Edit Role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onUserAction?.(user, 'remove')}
          className="text-red-600"
        >
          Remove from Store
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Render role actions dropdown
  const renderRoleActions = (role: StoreRole) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onRoleAction?.(role, 'view')}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleAction?.(role, 'edit')}>
          Edit Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Main loading state
  if (storeLoading && !store) {
    return renderLoadingSkeleton();
  }

  // Error states
  if (storeError) {
    return renderError(storeError);
  }

  // Store not found
  if (!storeLoading && !exists) {
    return renderNotFound();
  }

  // Store not loaded yet
  if (!store) {
    return renderLoadingSkeleton();
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <Badge variant={store.is_active ? "default" : "secondary"}>
                {store.is_active ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-1">{store.id}</p>
          </div>
        </div>
        
        {onEdit && (
          <Button onClick={() => onEdit(store)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Store
          </Button>
        )}
      </div>

      {/* Store Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Address</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{store.metadata.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{formatPhone(store.metadata.phone)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{roleCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users ({userCount})</TabsTrigger>
          <TabsTrigger value="roles">Roles ({roleCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Detailed information about this store location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Created</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(store.created_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(store.created_at)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Last Updated</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(store.updated_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(store.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Users</CardTitle>
              <CardDescription>
                Users associated with this store location
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              )}

              {usersError && renderError(usersError)}

              {!usersLoading && !usersError && !hasUsers && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users assigned to this store</p>
                </div>
              )}

              {!usersLoading && !usersError && hasUsers && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Role #{user.pivot.role_id}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.pivot.is_active ? "default" : "secondary"}>
                              {user.pivot.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(user.pivot.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            {renderUserActions(user)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Roles</CardTitle>
              <CardDescription>
                Roles configured for this store location
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rolesLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              )}

              {rolesError && renderError(rolesError)}

              {!rolesLoading && !rolesError && !hasRoles && (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No roles configured for this store</p>
                </div>
              )}

              {!rolesLoading && !rolesError && hasRoles && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Guard</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => {
                      return (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{role.guard_name}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            User #{role.pivot.user_id}
                          </TableCell>
                          <TableCell>
                            <Badge variant={role.pivot.is_active ? "default" : "secondary"}>
                              {role.pivot.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(role.pivot.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            {renderRoleActions(role)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreDetailsView;
