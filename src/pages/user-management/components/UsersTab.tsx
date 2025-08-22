import React from 'react';
import type { User } from '@/types/userManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Users, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UsersTabProps {
  users: User[];
  pagination?: {
    current_page: number;
    last_page: number;
  };
  onDeleteUser: (user: User) => void;
  onFetchUsers: (options?: { page?: number }) => void;
  getUserInitials: (name: string) => string;
  getRoleColor: (roleName: string) => string;
  getPermissionColor: (permissionName: string) => string;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  pagination,
  onDeleteUser,
  onFetchUsers,
  getUserInitials,
  getRoleColor,
  getPermissionColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage user accounts, roles, and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge key={role.id} className={getRoleColor(role.name)}>
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          No Role
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/user-management/user-detail/${user.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/user-management/edit-user/${user.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {user.permissions && user.permissions.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm font-medium mb-2">Direct Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
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
                </>
              )}
            </Card>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={pagination.current_page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFetchUsers({ page })}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTab;