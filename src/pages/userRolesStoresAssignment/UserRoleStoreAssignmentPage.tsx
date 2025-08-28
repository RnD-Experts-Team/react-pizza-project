/**
 * User Role Store Assignment Page
 * 
 * This page displays tables of users and stores with search functionality
 * and assign roles buttons for managing user role store assignments.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useStores } from '../../features/stores/hooks/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Loader2, Search, UserPlus, Store, Users, ShoppingBag, Eye } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

export const UserRoleStoreAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Local state for search terms
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [storeSearchTerm, setStoreSearchTerm] = useState('');

  // Fetch users and stores data
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { stores, loading: storesLoading, error: storesError } = useStores();

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Filter stores based on search term
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
    store.id.toLowerCase().includes(storeSearchTerm.toLowerCase())
  );

  const handleAssignUserRole = (userId: number) => {
    navigate(`/user-role-store-assignment/assign?userId=${userId}`);
  };

  const handleAssignStoreRole = (storeId: string) => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  };

  const handleAssignRoles = () => {
    // TODO: Implement assign roles functionality
    navigate(`/user-role-store-assignment/assign`);
  };

  const handleBulkAssign = () => {
    // TODO: Implement bulk assign functionality
    navigate(`/user-role-store-assignment/bulk`);
  };

  const handleViewUserAssignments = (userId: number) => {
    navigate(`/user-role-store-assignment/users/${userId}`);
  };

  const handleViewStoreAssignments = (storeId: string) => {
    navigate(`/user-role-store-assignment/stores/${storeId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Role Store Assignment</h1>
        <p className="text-muted-foreground">
          Manage user role assignments across different stores. Search and assign roles to users and stores.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleAssignRoles} className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Assign Roles
        </Button>
        <Button onClick={handleBulkAssign} variant="outline" className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Bulk Assign
        </Button>
      </div>

      <Separator />

      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <CardTitle>Users</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersError ? (
            <div className="text-red-500 text-center py-4">
              Error loading users: {usersError}
            </div>
          ) : usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Stores</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {userSearchTerm ? 'No users found matching your search' : 'No users found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role.id} variant="outline" className="text-xs">
                                {role.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No roles</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.stores && user.stores.length > 0 ? (
                            user.stores.map((userStore) => (
                              <Badge key={userStore.store.id} variant="secondary" className="text-xs">
                                {userStore.store.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No stores</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignUserRole(user.id)}
                            className="text-xs"
                          >
                            Assign Roles
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUserAssignments(user.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Assigned Roles
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stores Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <CardTitle>Stores</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores by name or ID..."
                value={storeSearchTerm}
                onChange={(e) => setStoreSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {storesError ? (
            <div className="text-red-500 text-center py-4">
              Error loading stores: {storesError}
            </div>
          ) : storesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading stores...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {storeSearchTerm ? 'No stores found matching your search' : 'No stores found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-mono text-sm">
                        {store.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {store.name}
                      </TableCell>
                      <TableCell>
                        {store.metadata.phone || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {store.metadata.address || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={store.is_active ? 'default' : 'secondary'}
                        >
                          {store.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(store.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignStoreRole(store.id)}
                            className="text-xs"
                          >
                            Assign Roles
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStoreAssignments(store.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Assigned Roles
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleStoreAssignmentPage;