import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface PermissionsTabProps {
  permissions: Permission[];
  getPermissionColor: (permissionName: string) => string;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({
  permissions,
  getPermissionColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>
          Manage system permissions and access controls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((permission) => (
            <Card key={permission.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    {permission.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Guard: {permission.guard_name}
                  </p>
                </div>
                <Badge className={getPermissionColor(permission.name)}>
                  {permission.name.split(' ')[0] || 'Permission'}
                </Badge>
              </div>
            </Card>
          ))}

          {permissions.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No permissions found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;