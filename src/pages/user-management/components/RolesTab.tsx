import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface RolesTabProps {
  roles: Role[];
  getRoleColor: (roleName: string) => string;
  getPermissionColor: (permissionName: string) => string;
}

const RolesTab: React.FC<RolesTabProps> = ({
  roles,
  getRoleColor,
  getPermissionColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
        <CardDescription>
          Manage user roles and their associated permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {role.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Guard: {role.guard_name}
                  </p>
                </div>
                <Badge className={getRoleColor(role.name)}>
                  {role.name}
                </Badge>
              </div>
              {role.permissions && role.permissions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className={getPermissionColor(permission.name)}
                      >
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {roles.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No roles found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesTab;