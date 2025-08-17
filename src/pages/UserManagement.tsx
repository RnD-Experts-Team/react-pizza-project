import React, { useState, useEffect } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import type { User, Role, Permission } from '@/types/userManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Users, UserPlus, Shield, Key, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const {
    state: { users, roles, permissions, loading, error, pagination },
    actions: {
      fetchUsers,
      fetchRoles,
      fetchPermissions,
      deleteUser
    }
  } = useUserManagement();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      'admin': 'bg-red-100 text-red-800',
      'manager': 'bg-blue-100 text-blue-800',
      'user': 'bg-green-100 text-green-800',
      'editor': 'bg-purple-100 text-purple-800',
    };
    return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPermissionColor = (permissionName: string) => {
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 text-green-800',
      'read': 'bg-blue-100 text-blue-800',
      'update': 'bg-yellow-100 text-yellow-800',
      'delete': 'bg-red-100 text-red-800',
    };
    const key = permissionName.toLowerCase().split(' ')[0] || permissionName.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !users.length && !roles.length && !permissions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and permissions for your application
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/user-management/create-user">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </Link>
          <Link to="/user-management/create-role">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </Link>
          <Link to="/user-management/create-permission">
            <Button variant="outline">
              <Key className="mr-2 h-4 w-4" />
              Create Permission
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'users' | 'roles' | 'permissions')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles ({roles.length})
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Permissions ({permissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
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
                          onClick={() => openDeleteDialog(user)}
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
                        onClick={() => fetchUsers({ page })}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>
                Manage user roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <Card key={role.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {role.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Guard: {role.guard_name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {role.permissions && role.permissions.map((permission) => (
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
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {roles.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No roles found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
