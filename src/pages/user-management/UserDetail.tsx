import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useReduxUserManagement';
import type { User } from '@/types/userManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Edit, Shield, Key, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { actions } = useUserManagement();
  const { fetchUserById } = actions;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        navigate('/user-management');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const userResponse = await fetchUserById(parseInt(id));
        if (userResponse) {
          setUser(userResponse);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Failed to load user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id, fetchUserById, navigate]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-2 md:p-4 max-w-7xl">
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The user you're looking for doesn't exist."}
          </p>
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
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground mt-1">
              User details and permissions overview
            </p>
          </div>
        </div>
        <Link to={`/user-management/edit-user/${user.id}`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email_verified_at ? formatDate(user.email_verified_at) : 'Not verified'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.updated_at)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Assigned Roles
            </CardTitle>
            <CardDescription>
              Roles assigned to this user and their associated permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.roles.length > 0 ? (
              <div className="space-y-4">
                {user.roles.map((role) => (
                  <Card key={role.id} className="p-4 border-l-4 border-l-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(role.name)}>
                          {role.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Guard: {role.guard_name}
                        </span>
                      </div>
                    </div>
                    {role.permissions && role.permissions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Role Permissions:</p>
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
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No roles assigned to this user</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Direct Permissions
            </CardTitle>
            <CardDescription>
              Permissions granted directly to this user (beyond role permissions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
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
            ) : (
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No direct permissions assigned to this user</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
