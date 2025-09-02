import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Loader2, UserPlus, Eye, AlertCircle, RefreshCw } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles?: Array<{ id: number; name: string }>;
  stores?: Array<{ store: { id: string; name: string } }>;
}

interface Pagination {
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
  total: number;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination?: Pagination;
  onAssignRole: (userId: number) => void;
  onViewAssignments: (userId: number) => void;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
  pagination,
  onAssignRole,
  onViewAssignments,
  onPageChange,
  onRefresh,
}) => {

  return (
    <>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading users: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <Card
          className="rounded-sm"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-realistic)',
          }}
        >
          <CardHeader
            className="mb-0"
            style={{
              backgroundColor: 'var(--muted)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <CardTitle
                className="text-lg sm:text-xl"
                style={{ color: 'var(--card-foreground)' }}
              >
                Users
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {pagination && (
                  <div
                    className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Showing {pagination.from} to {pagination.to} of {pagination.total} users
                    </span>
                    <span className="sm:hidden">
                      {pagination.from}-{pagination.to} of {pagination.total}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  {onRefresh && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefresh}
                      disabled={loading}
                      className="flex items-center gap-2"
                      style={{
                        backgroundColor: loading
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        borderColor: 'var(--border)',
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                      />
                      <span className="hidden xs:inline">Refresh</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0" style={{ backgroundColor: 'var(--card)' }}>
            {loading ? (
              <div
                className="flex items-center justify-center h-48 sm:h-64"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--muted-foreground)',
                }}
              >
                <Loader2
                  className="h-6 w-6 sm:h-8 sm:w-8 animate-spin"
                  style={{ color: 'var(--primary)' }}
                />
                <span
                  className="ml-2 text-sm sm:text-base"
                  style={{ color: 'var(--foreground)' }}
                >
                  Loading users...
                </span>
              </div>
            ) : !users.length ? (
              <div
                className="text-center py-6 sm:py-8"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <p
                  className="text-sm sm:text-base text-muted-foreground"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  No users found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader
                    style={{
                      backgroundColor: 'var(--muted)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <TableRow style={{ borderColor: 'var(--border)' }}>
                      <TableHead
                        className="min-w-[10rem] text-xs sm:text-sm"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Name
                      </TableHead>
                      <TableHead
                        className="min-w-[8rem] text-xs sm:text-sm hidden sm:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Email
                      </TableHead>
                      <TableHead
                        className="min-w-[8rem] text-xs sm:text-sm hidden md:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Roles
                      </TableHead>
                      <TableHead
                        className="min-w-[8rem] text-xs sm:text-sm hidden lg:table-cell"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Stores
                      </TableHead>
                      <TableHead
                        className="w-[6rem] text-xs sm:text-sm text-right"
                        style={{ color: 'var(--foreground)', fontWeight: '600' }}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        style={{
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--card)',
                        }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell
                          className="font-medium text-xs sm:text-sm p-2 sm:p-4"
                          style={{ color: 'var(--foreground)' }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium"
                              style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="text-xs sm:text-sm font-medium truncate"
                                style={{ color: 'var(--foreground)' }}
                                title={user.name}
                              >
                                {user.name}
                              </div>
                              {/* Mobile: Show email, roles and stores inline */}
                              <div className="sm:hidden mt-1 space-y-1">
                                <div
                                  className="text-xs truncate"
                                  style={{ color: 'var(--muted-foreground)' }}
                                  title={user.email}
                                >
                                  {user.email}
                                </div>
                                {user.roles && user.roles.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.roles.slice(0, 2).map((role) => (
                                      <Badge
                                        key={role.id}
                                        variant="secondary"
                                        className="text-xs px-1 py-0"
                                        style={{
                                          backgroundColor: 'var(--secondary)',
                                          color: 'var(--secondary-foreground)',
                                        }}
                                      >
                                        {role.name}
                                      </Badge>
                                    ))}
                                    {user.roles.length > 2 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                        style={{
                                          borderColor: 'var(--border)',
                                          color: 'var(--muted-foreground)',
                                        }}
                                      >
                                        +{user.roles.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {user.stores && user.stores.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.stores.slice(0, 2).map((storeAssignment) => (
                                      <Badge
                                        key={storeAssignment.store.id}
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                        style={{
                                          borderColor: 'var(--border)',
                                          color: 'var(--foreground)',
                                        }}
                                      >
                                        {storeAssignment.store.name}
                                      </Badge>
                                    ))}
                                    {user.stores.length > 2 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                        style={{
                                          borderColor: 'var(--border)',
                                          color: 'var(--muted-foreground)',
                                        }}
                                      >
                                        +{user.stores.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-xs sm:text-sm p-2 sm:p-4 hidden sm:table-cell"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <div className="truncate" title={user.email}>
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4 hidden md:table-cell">
                          {user.roles && user.roles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.roles.slice(0, 2).map((role) => (
                                <Badge
                                  key={role.id}
                                  variant="secondary"
                                  className="text-xs"
                                  style={{
                                    backgroundColor: 'var(--secondary)',
                                    color: 'var(--secondary-foreground)',
                                  }}
                                >
                                  {role.name}
                                </Badge>
                              ))}
                              {user.roles.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: 'var(--border)',
                                    color: 'var(--muted-foreground)',
                                  }}
                                >
                                  +{user.roles.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              No roles
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4 hidden lg:table-cell">
                          {user.stores && user.stores.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.stores.slice(0, 2).map((storeAssignment) => (
                                <Badge
                                  key={storeAssignment.store.id}
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: 'var(--border)',
                                    color: 'var(--foreground)',
                                  }}
                                >
                                  {storeAssignment.store.name}
                                </Badge>
                              ))}
                              {user.stores.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: 'var(--border)',
                                    color: 'var(--muted-foreground)',
                                  }}
                                >
                                  +{user.stores.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              No stores
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right p-2 sm:p-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAssignRole(user.id)}
                              className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto"
                              style={{
                                backgroundColor: 'var(--secondary)',
                                color: 'var(--secondary-foreground)',
                                borderColor: 'var(--border)',
                              }}
                            >
                              <UserPlus className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">Assign</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewAssignments(user.id)}
                              className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto"
                              style={{
                                color: 'var(--muted-foreground)',
                                backgroundColor: 'transparent',
                              }}
                            >
                              <Eye className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          
          {pagination && pagination.lastPage > 1 && (
            <CardFooter
              className="pt-4 sm:pt-5 lg:pt-6"
              style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage <= 1 || loading}
                    onClick={() => onPageChange?.(pagination.currentPage - 1)}
                    style={{
                      backgroundColor:
                        pagination.currentPage <= 1 || loading
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.currentPage <= 1 || loading
                          ? 0.5
                          : 1,
                    }}
                  >
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </Button>
                  <span
                    className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Page {pagination.currentPage} of {pagination.lastPage}
                    </span>
                    <span className="sm:hidden">
                      {pagination.currentPage}/{pagination.lastPage}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      pagination.currentPage >= pagination.lastPage ||
                      loading
                    }
                    onClick={() => onPageChange?.(pagination.currentPage + 1)}
                    style={{
                      backgroundColor:
                        pagination.currentPage >= pagination.lastPage ||
                        loading
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.currentPage >= pagination.lastPage ||
                        loading
                          ? 0.5
                          : 1,
                    }}
                  >
                    <span className="hidden xs:inline">Next</span>
                    <span className="xs:hidden">Next</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
};

export default UsersTable;