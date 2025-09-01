/**
 * Roles Table Component
 * 
 * Displays a table of roles with columns: Name, Guard, Permissions
 * Actions: Create Role, Assign Permissions
 * 
 * Features:
 * - Responsive design with mobile-first approach
 * - Light/dark mode compatibility using CSS variables
 * - Adaptive layout for different screen sizes
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { roleFormatting } from '../../features/roles/utils';
import { Button } from '../ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Settings, Plus, Loader2, RefreshCw } from 'lucide-react';

export const RolesTable: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading, error, refetch } = useRoles();

  const handleAssignPermissions = () => {
    navigate('/user-management/roles/assign-permissions');
  };

  const handleCreate = () => {
    navigate('/user-management/create/role');
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Roles</CardTitle>
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
            Error loading roles: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl">Roles</CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleAssignPermissions} 
            variant="outline" 
            className="flex items-center gap-2 w-full sm:w-auto text-sm"
          >
            <Settings className="h-4 w-4" />
            <span className="sm:inline">Assign Permissions</span>
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2 w-full sm:w-auto text-sm">
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Create Role</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
            <span className="ml-2 text-sm sm:text-base">Loading roles...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4 hidden sm:table-cell">Guard</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium px-2 sm:px-4">Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 sm:py-12 text-muted-foreground text-sm sm:text-base px-2 sm:px-4">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-medium text-primary">
                            {roleFormatting.formatDisplayName(role.name).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium truncate">
                              {roleFormatting.formatDisplayName(role.name)}
                            </div>
                            {/* Mobile: Show guard inline */}
                            <div className="sm:hidden mt-1">
                              <Badge variant="outline" className="text-xs px-1 py-0">{role.guard_name}</Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell px-2 sm:px-4 py-3 sm:py-4">
                        <Badge variant="outline" className="text-xs">{role.guard_name}</Badge>
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {roleFormatting.formatPermissionCount(role.permissions?.length || 0)}
                          </span>
                          {role.permissions && role.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 2).map((permission) => (
                                <Badge key={permission.id} variant="secondary" className="text-xs px-1 py-0">
                                  {permission.name}
                                </Badge>
                              ))}
                              {role.permissions.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{role.permissions.length - 2}</span>
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
