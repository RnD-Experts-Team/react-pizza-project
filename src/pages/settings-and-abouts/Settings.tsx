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
        // Ensure local state is synchronized with the latest data
        setUserProfile((result.payload as User) || user);
      } else {
        setProfileError('Failed to load user profile');
      }
    } catch (err) {
      setProfileError('Failed to load user profile');
      console.error('Profile refresh error:', err);
    } finally {
      setProfileLoading(false);
    }
  };







  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <SettingsIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground text-base sm:text-lg px-4 sm:px-0">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      {saveStatus && (
        <Alert
          className={`mb-4 sm:mb-6 mx-2 sm:mx-0 ${saveStatus.includes('successfully') ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'}`}
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

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 mx-2 sm:mx-0">
          <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">

          <Card className="border-border bg-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-card-foreground">Current Profile Information</CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                View your current account information and details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {profileError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm mb-3 sm:mb-4">
                  {profileError}
                </div>
              )}
              


              {profileLoading ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground text-sm sm:text-base">Loading profile...</p>
                </div>
              ) : userProfile ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="mt-1 text-sm sm:text-base text-foreground font-medium">{userProfile.name}</p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="mt-1 text-sm sm:text-base text-foreground font-medium break-all">{userProfile.email}</p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Email Verified
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userProfile.email_verified_at
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {userProfile.email_verified_at
                          ? 'Verified'
                          : 'Not Verified'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Member Since
                    </label>
                    <p className="mt-1 text-sm sm:text-base text-foreground">
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm sm:text-base text-foreground">
                      {new Date(userProfile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">No profile data available</p>
              )}


            </CardContent>
          </Card>

        </TabsContent>



        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-card-foreground">Theme Preferences</CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                Customize the appearance of your Pizza Portal experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-sm sm:text-base"
                >
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                  <span>Light</span>
                </Button>

                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-sm sm:text-base"
                >
                  <div className="w-6 h-6 bg-gray-800 border-2 border-gray-600 rounded"></div>
                  <span>Dark</span>
                </Button>

                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-sm sm:text-base sm:col-span-1 col-span-1"
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
