/**
 * UsersTable Component
 * 
 * Displays a table of users with search functionality and action buttons.
 * Includes responsive design and handles loading, error, and empty states.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Loader2, Search, UserPlus, Eye } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles?: Array<{ id: number; name: string }>;
  stores?: Array<{ store: { id: string; name: string } }>;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  userSearchTerm: string;
  onSearchChange: (value: string) => void;
  onAssignRole: (userId: number) => void;
  onViewAssignments: (userId: number) => void;
  formatDate: (dateString: string) => string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
  userSearchTerm,
  onSearchChange,
  onAssignRole,
  onViewAssignments,
  formatDate,
}) => {
  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 text-sm sm:text-base bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {error ? (
          <div className="text-destructive text-center py-6 sm:py-8 text-sm sm:text-base">
            Error loading users: {error}
          </div>
        ) : loading ? (
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
                              onClick={() => onAssignRole(user.id)}
                              className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              Assign
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewAssignments(user.id)}
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
  );
};

export default UsersTable;