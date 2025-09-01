/**
 * View User Page
 * 
 * Page for viewing user details in a beautiful layout with responsive design
 * and CSS variable integration for light/dark mode compatibility
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
    navigate(`/user-management/edit/user${userId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 md:py-8 lg:py-10">
        <div className="flex items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16">
          <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 animate-spin" style={{ color: 'var(--primary)' }} />
          <span className="ml-2 text-sm sm:text-base" style={{ color: 'var(--foreground)' }}>Loading user...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 md:py-8 lg:py-10">
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" onClick={handleBack} className="p-1.5 sm:p-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>User Details</h1>
            </div>
          </div>
          <div className="text-center py-3 sm:py-4 text-sm sm:text-base" style={{ color: 'var(--destructive)' }}>
            {error || 'User not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 md:py-8 lg:py-10">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" onClick={handleBack} className="p-1.5 sm:p-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>User Details</h1>
              <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--muted-foreground)' }}>
                View all information about this user
              </p>
            </div>
          </div>
          <Button onClick={handleEdit} className="flex items-center gap-2 w-full sm:w-auto justify-center" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <Edit className="h-4 w-4" />
            <span className="text-sm sm:text-base">Edit User</span>
          </Button>
        </div>

        {/* User Profile Card */}
        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <CardContent className="pt-4 sm:pt-5 md:pt-6 p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold mx-auto sm:mx-0" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary)' }}>
                {formattedData?.initials}
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: 'var(--card-foreground)' }}>{formattedData?.displayName}</h2>
                <div className="flex items-center gap-2 justify-center sm:justify-start" style={{ color: 'var(--muted-foreground)' }}>
                  <Mail className="h-4 w-4" />
                  <span className="text-sm sm:text-base">{formattedData?.formattedEmail}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Badge variant={user.email_verified_at ? "default" : "secondary"} className="text-xs sm:text-sm">
                    {formattedData?.verificationStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Account Information */}
          <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg" style={{ color: 'var(--card-foreground)' }}>
                <User className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--primary)' }} />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
              <div>
                <label className="text-xs sm:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>User ID</label>
                <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--card-foreground)' }}>{user.id}</p>
              </div>
              <Separator style={{ backgroundColor: 'var(--border)' }} />
              <div>
                <label className="text-xs sm:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Created</label>
                <p className="text-sm sm:text-base mt-1 flex items-center gap-2" style={{ color: 'var(--card-foreground)' }}>
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: 'var(--muted-foreground)' }} />
                  {formattedData?.createdAt}
                </p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Last Updated</label>
                <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--card-foreground)' }}>{formattedData?.updatedAt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Roles and Permissions */}
          <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg" style={{ color: 'var(--card-foreground)' }}>
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--primary)' }} />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
              <div>
                <label className="text-xs sm:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Roles ({formattedData?.roleCount})
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} variant="outline" className="text-xs sm:text-sm px-2 py-1">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>No roles assigned</p>
                  )}
                </div>
              </div>
              <Separator style={{ backgroundColor: 'var(--border)' }} />
              <div>
                <label className="text-xs sm:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Direct Permissions ({formattedData?.permissionCount})
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {user.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((permission) => (
                      <Badge key={permission.id} variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                        {permission.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>No direct permissions</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Access */}
          <Card className="lg:col-span-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg" style={{ color: 'var(--card-foreground)' }}>
                <Store className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--primary)' }} />
                Store Access ({formattedData?.storeCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 md:p-6">
              {user.stores && user.stores.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {user.stores.map((userStore) => (
                    <div key={userStore.store.id} className="rounded-lg p-3 sm:p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
                        <h4 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--card-foreground)' }}>{userStore.store.name}</h4>
                        <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1 w-fit">{userStore.store.id}</Badge>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                          Store Roles
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                          {userStore.roles.map((role) => (
                            <Badge key={role.id} variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base" style={{ color: 'var(--muted-foreground)' }}>No store access assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;
