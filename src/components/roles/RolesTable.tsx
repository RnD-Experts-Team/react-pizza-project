/**
 * Roles Table Component - Updated
 * 
 * Removed actions column and added assign permissions button in header
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
import { Settings, Plus, Loader2 } from 'lucide-react';

export const RolesTable: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading, error } = useRoles();

  const handleAssignPermissions = () => {
    navigate('/user-management/assign-permissions');
  };

  const handleCreate = () => {
    navigate('/user-management/create-role');
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-4">
            Error loading roles: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Roles</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleAssignPermissions} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Assign Permissions
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading roles...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Guard</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      {roleFormatting.formatDisplayName(role.name)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.guard_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {roleFormatting.formatPermissionCount(role.permissions?.length || 0)}
                        </span>
                        {role.permissions && role.permissions.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {role.permissions.slice(0, 2).map((permission) => (
                              <Badge key={permission.id} variant="secondary" className="text-xs">
                                {permission.name}
                              </Badge>
                            ))}
                            {role.permissions.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.permissions.length - 2} more
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
