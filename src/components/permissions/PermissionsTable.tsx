/**
 * Permissions Table Component
 * 
 * Features:
 * - Displays permissions in a sortable table with Card wrapper
 * - Create permission functionality
 * - Loading states and responsive design
 * - Error handling and refresh capability
 * - Light/dark mode compatibility using CSS variables
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../features/permissions/hooks/usePermissions';
import { permissionFormatting } from '../../features/permissions/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2, Plus, RefreshCw, AlertCircle } from 'lucide-react';

export const PermissionsTable: React.FC = () => {
  const navigate = useNavigate();
  const { permissions, loading, error, refetch } = usePermissions();

  const handleCreatePermission = () => {
    navigate('/user-management/create/permission');
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading permissions: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Permissions Table */}
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
              Permissions
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div
                className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <span className="hidden sm:inline">
                  Total: {permissions.length} permissions
                </span>
                <span className="sm:hidden">
                  {permissions.length} permissions
                </span>
              </div>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
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
                <Button
                  onClick={handleCreatePermission}
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden xs:inline">Create Permission</span>
                  <span className="xs:hidden">Create</span>
                </Button>
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
                Loading permissions...
              </span>
            </div>
          ) : !permissions.length ? (
            <div
              className="text-center py-6 sm:py-8"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <p
                className="text-sm sm:text-base text-muted-foreground"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No permissions found.
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
                      className="min-w-[8rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Name
                    </TableHead>
                    <TableHead
                      className="min-w-[4rem] text-xs sm:text-sm hidden sm:table-cell"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Guard
                    </TableHead>
                    <TableHead
                      className="min-w-[12rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Used by Roles
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow
                      key={permission.id}
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
                            {permissionFormatting.formatDisplayName(permission.name).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-xs sm:text-sm font-medium truncate"
                              style={{ color: 'var(--foreground)' }}
                              title={permissionFormatting.formatDisplayName(permission.name)}
                            >
                              {permissionFormatting.formatDisplayName(permission.name)}
                            </div>
                            {/* Mobile: Show guard inline */}
                            <div className="sm:hidden mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0.5"
                                style={{
                                  backgroundColor: 'var(--secondary)',
                                  color: 'var(--secondary-foreground)',
                                  borderColor: 'var(--border)',
                                }}
                              >
                                {permission.guard_name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1"
                          style={{
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--secondary-foreground)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          {permission.guard_name}
                        </Badge>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4">
                        <div className="space-y-1 max-w-[10rem] lg:max-w-none">
                          <span
                            className="text-xs sm:text-sm"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {permission.roles?.length || 0} roles
                          </span>
                          {permission.roles && permission.roles.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {permission.roles.slice(0, 2).map((role) => (
                                <Badge
                                  key={role.id}
                                  variant="secondary"
                                  className="text-xs px-1 py-0.5"
                                  style={{
                                    backgroundColor: 'var(--accent)',
                                    color: 'var(--accent-foreground)',
                                    borderColor: 'var(--border)',
                                  }}
                                >
                                  <span
                                    className="truncate max-w-[3rem]"
                                    title={role.name}
                                  >
                                    {role.name}
                                  </span>
                                </Badge>
                              ))}
                              {permission.roles.length > 2 && (
                                <span 
                                  className="text-xs"
                                  style={{ color: 'var(--muted-foreground)' }}
                                >
                                  +{permission.roles.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
