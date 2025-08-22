import React, { useState, useEffect } from 'react';
import { useUserManagement } from '@/hooks/useReduxUserManagement';
import type { User } from '@/types/userManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus,Users, Shield, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import UsersTab from './components/UsersTab';
import RolesTab from './components/RolesTab';
import PermissionsTab from './components/PermissionsTab';

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

        <TabsContent value="users">
          <UsersTab
            users={users}
            pagination={pagination || { current_page: 1, last_page: 1 }}
            onDeleteUser={openDeleteDialog}
            onFetchUsers={fetchUsers}
            getUserInitials={getUserInitials}
            getRoleColor={getRoleColor}
            getPermissionColor={getPermissionColor}
          />
        </TabsContent>

        <TabsContent value="roles">
           <RolesTab
             roles={roles}
             getRoleColor={getRoleColor}
             getPermissionColor={getPermissionColor}
           />
         </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab
            permissions={permissions}
            getPermissionColor={getPermissionColor}
          />
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
