import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

import type { User } from '../../features/auth/types';
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Palette,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';


const Settings: React.FC = () => {
  const { user,  getUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  // User profile states
  const [userProfile, setUserProfile] = useState<User | null>(user);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');







  const [saveStatus] = useState<string | null>(null);
  


  // Update local userProfile when Redux user changes
  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  // Automatically fetch user profile when component loads
  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, []);



  const fetchUserProfile = async () => {
    setProfileLoading(true);
    setProfileError('');

    try {
      const result = await getUserProfile();
      if (result.type.endsWith('/fulfilled')) {
        // Profile will be updated automatically via Redux state
        setProfileError('');
      } else {
        setProfileError('Failed to load user profile');
      }
    } catch (err) {
      setProfileError('Failed to load user profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRefreshProfile = () => {
    fetchUserProfile();
  };





  return (
    <div className="container mx-auto p-2 md:p-4 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <SettingsIcon className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      {saveStatus && (
        <Alert
          className={`mb-6 ${saveStatus.includes('successfully') ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'}`}
        >
          <CheckCircle
            className={`h-4 w-4 ${saveStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
          />
          <AlertDescription
            className={
              saveStatus.includes('successfully')
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }
          >
            {saveStatus}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>Current Profile Information</CardTitle>
              <CardDescription>
                View your current account information and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profileError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                  {profileError}
                </div>
              )}

              {profileLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading profile...</p>
                </div>
              ) : userProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-gray-900">{userProfile.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{userProfile.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Verified
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userProfile.email_verified_at
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {userProfile.email_verified_at
                          ? 'Verified'
                          : 'Not Verified'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date(userProfile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No profile data available</p>
              )}

              <div className="mt-6 space-y-4">
                <Button
                  onClick={handleRefreshProfile}
                  variant="outline"
                  disabled={profileLoading}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {profileLoading ? 'Refreshing...' : 'Refresh Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

        </TabsContent>



        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of your Pizza Portal experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                  <span>Light</span>
                </Button>

                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-6 h-6 bg-gray-800 border-2 border-gray-600 rounded"></div>
                  <span>Dark</span>
                </Button>

                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-white to-gray-800 border-2 border-gray-400 rounded"></div>
                  <span>System</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Management */}
      </Tabs>
      

    </div>
  );
};

export default Settings;
