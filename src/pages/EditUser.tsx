import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useUserManagement';
import type { UpdateUserForm, User, Role, Permission } from '@/types/userManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Save, Shield, Key, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormErrors {
  name?: string;
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state, actions } = useUserManagement();
  const { roles, permissions, loading, error } = state;
  const { fetchRoles, fetchPermissions, fetchUserById, updateUser } = actions;

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserForm>({
    name: '',
    roles: [],
    permissions: []
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        navigate('/user-management');
        return;
      }

      try {
        setIsLoadingUser(true);
        const [userResponse] = await Promise.all([
          fetchUserById(parseInt(id)),
          fetchRoles(),
          fetchPermissions()
        ]);

        if (userResponse) {
          setUser(userResponse);
          setFormData({
            name: userResponse.name,
            roles: userResponse.roles.map(role => role.name),
            permissions: userResponse.permissions.map(permission => permission.name)
          });
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        navigate('/user-management');
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadData();
  }, [id, fetchUserById, fetchRoles, fetchPermissions, navigate]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleToggle = (role: Role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role.name)
        ? prev.roles.filter(name => name !== role.name)
        : [...prev.roles, role.name]
    }));
  };

  const handlePermissionToggle = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission.name)
        ? prev.permissions.filter(name => name !== permission.name)
        : [...prev.permissions, permission.name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user basic info
      const success = await updateUser(user.id, {
        name: formData.name,
        roles: formData.roles,
        permissions: formData.permissions
      });

      if (success) {
        navigate('/user-management', { 
          state: { message: 'User updated successfully!' }
        });
      }
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setIsSubmitting(false);
    }
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
      'admin': 'bg-red-100 text-red-800 hover:bg-red-200',
      'manager': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'user': 'bg-green-100 text-green-800 hover:bg-green-200',
      'editor': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    };
    return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const getPermissionColor = (permissionName: string) => {
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 text-green-800 hover:bg-green-200',
      'read': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'update': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'delete': 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    const key = permissionName.toLowerCase().split(' ')[0] || permissionName.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const hasChanges = () => {
    if (!user) return false;
    
    const originalRoles = user.roles.map(role => role.name).sort();
    const originalPermissions = user.permissions.map(permission => permission.name).sort();
    const currentRoles = [...formData.roles].sort();
    const currentPermissions = [...formData.permissions].sort();
    
    return (
      formData.name !== user.name ||
      JSON.stringify(originalRoles) !== JSON.stringify(currentRoles) ||
      JSON.stringify(originalPermissions) !== JSON.stringify(currentPermissions)
    );
  };

  if (isLoadingUser || (loading && !roles.length && !permissions.length)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
          <Link to="/user-management">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Management
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/user-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground mt-1">
              Update {user.name}'s information, roles, and permissions
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Update the basic information for this user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed after user creation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Roles
            </CardTitle>
            <CardDescription>
              The user currently has the following roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.roles.length > 0 ? (
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
            <Separator className="my-4" />
            <h4 className="font-medium mb-3">Update Roles (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleToggle(role)}
                  className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                    formData.roles.includes(role.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {role.permissions ? role.permissions.length : 0} permissions
                      </p>
                    </div>
                    <Badge className={getRoleColor(role.name)}>
                      {role.name}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.permissions && role.permissions.slice(0, 3).map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions && role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {formData.roles.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No roles selected - user will have no role assigned
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Current Direct Permissions
            </CardTitle>
            <CardDescription>
              Permissions granted directly to the user (beyond role permissions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.permissions.length > 0 ? (
                user.permissions.map((permission) => (
                  <Badge
                    key={permission.id}
                    variant="outline"
                    className={getPermissionColor(permission.name)}
                  >
                    {permission.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No direct permissions assigned</p>
              )}
            </div>
            <Separator className="my-4" />
            <h4 className="font-medium mb-3">Update Additional Permissions</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  onClick={() => handlePermissionToggle(permission)}
                  className={`cursor-pointer p-2 rounded-md border transition-all ${
                    formData.permissions.includes(permission.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Badge
                    className={`w-full justify-center ${
                      getPermissionColor(permission.name)
                    }`}
                  >
                    {permission.name}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link to="/user-management">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={isSubmitting || !hasChanges()}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating User...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update User
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default EditUser;
