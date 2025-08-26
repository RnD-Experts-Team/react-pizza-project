/**
 * Permissions Table Component
 * 
 * Displays a table of permissions with create functionality
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
import { Loader2, Plus } from 'lucide-react';

export const PermissionsTable: React.FC = () => {
  const navigate = useNavigate();
  const { permissions, loading, error } = usePermissions();

  const handleCreatePermission = () => {
    navigate('/user-management/create-permission');
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-4">
            Error loading permissions: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Permissions</CardTitle>
          <Button onClick={handleCreatePermission} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Permission
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading permissions...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Guard</TableHead>
                <TableHead>Used by Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No permissions found
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      {permissionFormatting.formatDisplayName(permission.name)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{permission.guard_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {permission.roles?.length || 0} roles
                        </span>
                        {permission.roles && permission.roles.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {permission.roles.slice(0, 2).map((role) => (
                              <Badge key={role.id} variant="secondary" className="text-xs">
                                {role.name}
                              </Badge>
                            ))}
                            {permission.roles.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{permission.roles.length - 2} more
                              </Badge>
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
        )}
      </CardContent>
    </Card>
  );
};
