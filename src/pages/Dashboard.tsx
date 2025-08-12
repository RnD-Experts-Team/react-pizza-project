import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../hooks/useAuth.tsx";
import { authService } from "../services/authService.ts";
import type { User } from "../types/authTypes.ts";
// import {InfoSection2} from "../components/dashboard/T.tsx";
// import {InfoCards} from "../components/dashboard/P copy.tsx";
import {ChannelSalesDashboard} from "../components/dashboard/O.tsx";
import {Dsqr} from "../components/dashboard/U copy.tsx";
import {FrameScreen} from "../components/dashboard/Y copy.tsx";
import { InfoSection } from '@/components/InfoSection';
import {InfoCards} from "../components/InfoCards";






const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(user);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    setError("");

    try {
      const profile = await authService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      setError("Failed to load user profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRefreshProfile = () => {
    fetchUserProfile();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div className="min-h-screen rounded-lg bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <InfoSection></InfoSection>
        <InfoCards></InfoCards>
        <ChannelSalesDashboard></ChannelSalesDashboard>
        <Dsqr></Dsqr>
        <FrameScreen></FrameScreen>





        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's your account information.
            </p>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Your account information and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                    {error}
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
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userProfile.email_verified_at
                            ? "Verified"
                            : "Not Verified"}
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

                <div className="mt-6">
                  <Button
                    onClick={handleRefreshProfile}
                    variant="outline"
                    disabled={profileLoading}
                    className="w-full"
                  >
                    {profileLoading ? "Refreshing..." : "Refresh Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage your account and session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={() => navigate("/pizza")} className="w-full">
                    View Pizza Catalog
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
