/**
 * User Role Store Assignment Page
 * 
 * This page displays tables of users and stores with search functionality
 * and assign roles buttons for managing user role store assignments.
 * Fully responsive design with CSS variables for light/dark mode compatibility.
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          User Role Store Assignment
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Manage user role assignments across different stores. Search and assign roles to users and stores.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button 
          onClick={handleAssignRoles} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
        >
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          Assign Roles
        </Button>
        <Button 
          onClick={handleBulkAssign} 
          variant="outline" 
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          Bulk Assign
        </Button>
      </div>

      <Separator />

      {/* Users Section */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-card-foreground">Users</CardTitle>
            </div>
            <div className="relative w-full lg:w-80 xl:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {usersError ? (
            <div className="text-destructive text-center py-6 sm:py-8 text-sm sm:text-base">
              Error loading users: {usersError}
            </div>
          ) : usersLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <span className="ml-2 sm:ml-3 text-sm sm:text-base text-muted-foreground">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">Email</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Roles</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">Stores</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 sm:py-12 text-muted-foreground text-sm sm:text-base">
                          {userSearchTerm ? 'No users found matching your search' : 'No users found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium px-3 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-medium text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium text-foreground truncate">{user.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden truncate">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                        <div className="text-xs sm:text-sm truncate max-w-[200px]">{user.email}</div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.slice(0, 2).map((role) => (
                              <Badge key={role.id} variant="outline" className="text-xs px-2 py-1 bg-background border-border text-foreground">
                                {role.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs sm:text-sm">No roles</span>
                          )}
                          {user.roles && user.roles.length > 2 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 bg-muted text-muted-foreground">
                              +{user.roles.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {user.stores && user.stores.length > 0 ? (
                            user.stores.slice(0, 2).map((userStore) => (
                              <Badge key={userStore.store.id} variant="secondary" className="text-xs px-2 py-1 bg-secondary text-secondary-foreground">
                                {userStore.store.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs sm:text-sm">No stores</span>
                          )}
                          {user.stores && user.stores.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted text-muted-foreground">
                              +{user.stores.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right px-3 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignUserRole(user.id)}
                            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            Assign
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUserAssignments(user.id)}
                            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stores Section */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Store className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-card-foreground">Stores</CardTitle>
            </div>
            <div className="relative w-full lg:w-80 xl:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores by name or ID..."
                value={storeSearchTerm}
                onChange={(e) => setStoreSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {storesError ? (
            <div className="text-destructive text-center py-6 sm:py-8 text-sm sm:text-base">
              Error loading stores: {storesError}
            </div>
          ) : storesLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <span className="ml-2 sm:ml-3 text-sm sm:text-base text-muted-foreground">Loading stores...</span>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Store ID</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">Phone</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">Address</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">Created</TableHead>
                      <TableHead className="text-xs sm:text-sm font-medium text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 sm:py-12 text-muted-foreground text-sm sm:text-base">
                          {storeSearchTerm ? 'No stores found matching your search' : 'No stores found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4">
                        <div className="text-foreground font-medium truncate max-w-[100px] sm:max-w-none">
                          {store.id}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium px-3 sm:px-4 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                          {store.name}
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden truncate max-w-[120px]">
                          {store.metadata.phone || 'No phone'}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px]">
                          {store.metadata.phone || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px]" title={store.metadata.address || 'N/A'}>
                          {store.metadata.address || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                        <Badge 
                          variant={store.is_active ? 'default' : 'secondary'}
                          className={`text-xs px-2 py-1 ${
                            store.is_active 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {store.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                        {formatDate(store.created_at)}
                      </TableCell>
                      <TableCell className="text-right px-3 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignStoreRole(store.id)}
                            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            Assign
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStoreAssignments(store.id)}
                            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);
};

export default UserRoleStoreAssignmentPage;