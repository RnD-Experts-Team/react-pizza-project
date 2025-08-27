/**
 * View User Page
 * 
 * Page for viewing user details in a beautiful layout
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../features/users/hooks/useUsers';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Edit, Mail, Calendar, Shield, Store, User, Loader2 } from 'lucide-react';

const ViewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : undefined;
  
  const { user, loading, error, formattedData } = useUser(userId);

  const handleBack = () => {
    navigate('/user-management');
  };

  const handleEdit = () => {
    navigate(`/user-management/edit-user/${userId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading user...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            </div>
          </div>
          <div className="text-red-500 text-center py-4">
            {error || 'User not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
              <p className="text-muted-foreground">
                View all information about this user
              </p>
            </div>
          </div>
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                {formattedData?.initials}
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold">{formattedData?.displayName}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {formattedData?.formattedEmail}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                    {formattedData?.verificationStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-sm mt-1">{user.id}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formattedData?.createdAt}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm mt-1">{formattedData?.updatedAt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Roles and Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Roles ({formattedData?.roleCount})
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} variant="outline">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No roles assigned</p>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Direct Permissions ({formattedData?.permissionCount})
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((permission) => (
                      <Badge key={permission.id} variant="secondary">
                        {permission.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No direct permissions</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Access */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Access ({formattedData?.storeCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.stores && user.stores.length > 0 ? (
                <div className="space-y-4">
                  {user.stores.map((userStore) => (
                    <div key={userStore.store.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{userStore.store.name}</h4>
                        <Badge variant="outline">{userStore.store.id}</Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Store Roles
                        </label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {userStore.roles.map((role) => (
                            <Badge key={role.id} variant="secondary">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No store access assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;
