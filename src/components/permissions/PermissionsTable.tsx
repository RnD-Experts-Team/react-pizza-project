/**
 * Permissions Table Component
 * 
 * Displays a table of permissions with updated columns: Name, Guard, Used by Roles
 * Actions: Create (navigate to page)
 * 
 * Features:
 * - Responsive design with mobile-first approach
 * - Light/dark mode compatibility using CSS variables
 * - Adaptive layout for different screen sizes
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
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2, Plus, RefreshCw } from 'lucide-react';

export const PermissionsTable: React.FC = () => {
  const navigate = useNavigate();
  const { permissions, loading, error, refetch } = usePermissions();

  const handleCreatePermission = () => {
    navigate('/user-management/create/permission');
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Permissions</CardTitle>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sm:inline">Retry</span>
          </Button>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-destructive text-center py-4 sm:py-6 text-sm sm:text-base">
            Error loading permissions: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl">Permissions</CardTitle>
        <Button onClick={handleCreatePermission} className="flex items-center gap-2 w-full sm:w-auto text-sm">
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Create Permission</span>
        </Button>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
            <span className="ml-2 text-sm sm:text-base">Loading permissions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 hidden sm:table-cell">Guard</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Used by Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 sm:py-12 text-muted-foreground text-sm sm:text-base px-2 sm:px-4">
                      No permissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((permission) => (
                    <TableRow key={permission.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-medium text-primary">
                            {permissionFormatting.formatDisplayName(permission.name).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium truncate">
                              {permissionFormatting.formatDisplayName(permission.name)}
                            </div>
                            {/* Mobile: Show guard inline */}
                            <div className="sm:hidden mt-1">
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {permission.guard_name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell px-2 sm:px-4 py-3 sm:py-4">
                        <Badge variant="outline" className="text-xs">{permission.guard_name}</Badge>
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {permission.roles?.length || 0} roles
                          </span>
                          {permission.roles && permission.roles.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {permission.roles.slice(0, 2).map((role) => (
                                <Badge key={role.id} variant="secondary" className="text-xs px-1 py-0">
                                  {role.name}
                                </Badge>
                              ))}
                              {permission.roles.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{permission.roles.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
