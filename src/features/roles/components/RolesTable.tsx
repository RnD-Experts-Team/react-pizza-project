/**
 * Roles Table Component
 * 
 * Features:
 * - Displays roles in a sortable table with Card wrapper  
 * - Assign permissions and create role functionality
 * - Loading states and responsive design
 * - Error handling and refresh capability
 * - Light/dark mode compatibility using CSS variables
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { roleFormatting } from '@/features/roles/utils';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export const RolesTable: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading, error, refetch } = useRoles();

  const handleAssignPermissions = () => {
    navigate('/user-management/roles/assign-permissions');
  };

  const handleCreate = () => {
    navigate('/user-management/create/role');
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading roles: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Roles Table */}
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
              Roles
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div
                className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <span className="hidden sm:inline">
                  Total: {roles.length} roles
                </span>
                <span className="sm:hidden">
                  {roles.length} roles
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
                  onClick={handleAssignPermissions}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden xs:inline">Assign</span>
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden xs:inline">Create Role</span>
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
                Loading roles...
              </span>
            </div>
          ) : !roles.length ? (
            <div
              className="text-center py-6 sm:py-8"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <p
                className="text-sm sm:text-base text-muted-foreground"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No roles found.
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
                      Permissions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow
                      key={role.id}
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
                            {roleFormatting.formatDisplayName(role.name).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-xs sm:text-sm font-medium truncate"
                              style={{ color: 'var(--foreground)' }}
                              title={roleFormatting.formatDisplayName(role.name)}
                            >
                              {roleFormatting.formatDisplayName(role.name)}
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
                                {role.guard_name}
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
                          {role.guard_name}
                        </Badge>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4">
                        <div className="space-y-1 max-w-[10rem] lg:max-w-none">
                          <span
                            className="text-xs sm:text-sm"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {roleFormatting.formatPermissionCount(role.permissions?.length || 0)}
                          </span>
                          {role.permissions && role.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 2).map((permission) => (
                                <Badge
                                  key={permission.id}
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
                                    title={permission.name}
                                  >
                                    {permission.name}
                                  </span>
                                </Badge>
                              ))}
                              {role.permissions.length > 2 && (
                                <span 
                                  className="text-xs"
                                  style={{ color: 'var(--muted-foreground)' }}
                                >
                                  +{role.permissions.length - 2}
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
