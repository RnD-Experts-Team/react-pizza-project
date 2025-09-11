// src/features/preferences/pages/PreferenceDetailsPage.tsx

/**
 * Preference Details Page Component
 *
 * Displays detailed information about a specific preference including
 * associated schedule preferences. Fetches preference data by ID from URL parameters.
 * Includes proper loading and error states.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Hash,
  Tag,
} from 'lucide-react';
import { preferenceApiService } from '../services/api';
import type { Preference, ApiError, SchedulePreference } from '../types';

/**
 * Preference Details Page Component
 */
const PreferenceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [preference, setPreference] = useState<Preference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preference data on component mount
  useEffect(() => {
    const fetchPreferenceData = async () => {
      if (!id || isNaN(Number(id))) {
        setError('Invalid preference ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const preferenceData = await preferenceApiService.getPreferenceById(
          Number(id),
        );
        setPreference(preferenceData);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage =
          apiError.message || 'Failed to fetch preference details';
        setError(errorMessage);
        toast.error('Error loading preference', { description: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferenceData();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    if (id && !isNaN(Number(id))) {
      const fetchPreferenceData = async () => {
        try {
          setLoading(true);
          setError(null);
          const preferenceData = await preferenceApiService.getPreferenceById(
            Number(id),
          );
          setPreference(preferenceData);
        } catch (err) {
          const apiError = err as ApiError;
          const errorMessage =
            apiError.message || 'Failed to fetch preference details';
          setError(errorMessage);
          toast.error('Error loading preference', {
            description: errorMessage,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchPreferenceData();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Preferences</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Loading preference details...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Preferences</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">
                Error Loading Preference
              </h3>
              <p className="text-sm text-gray-500 max-w-md">{error}</p>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRetry}
                  className="flex items-center space-x-2"
                >
                  <span>Try Again</span>
                </Button>
                <Button variant="outline" onClick={handleBackClick}>
                  Back to Preferences
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render list of schedule preferences associated
  const renderSchedulePreferences = (
    schedulePreferences: SchedulePreference[],
  ) => {
    if (!schedulePreferences.length) {
      return (
        <p className="text-gray-500">No schedule preferences associated.</p>
      );
    }
    return (
      <ul className="divide-y divide-gray-200">
        {schedulePreferences.map((sp) => (
          <li key={sp.id} className="py-2 flex justify-between">
            <div>
              <span className="font-medium">{sp.employment_type}</span> - Max
              Hours: {sp.maximum_hours}
            </div>
            <div className="text-gray-500 text-sm">
              Emp Info ID: {sp.emp_info_id}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Main content
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Preferences</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {preference?.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Preference Details</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Basic Information & Timestamps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Basic Information</span>
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <div className="flex items-center space-x-2 mt-1">
                <Hash className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{preference?.id}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 mt-1 font-medium">
                {preference?.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Slug</label>
              <p className="text-gray-900 mt-1">
                {preference?.slug || (
                  <em className="text-gray-400">No slug assigned</em>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Timestamps</span>
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created At
              </label>
              <p className="text-gray-900 mt-1">
                {preference
                  ? new Date(preference.created_at).toLocaleString()
                  : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-gray-900 mt-1">
                {preference
                  ? new Date(preference.updated_at).toLocaleString()
                  : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Associated Schedule Preferences */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Associated Schedule Preferences</span>
          </h2>
        </CardHeader>
        <CardContent>
          {preference?.schedule_preferences &&
          preference.schedule_preferences.length > 0 ? (
            renderSchedulePreferences(preference.schedule_preferences)
          ) : (
            <p className="text-center text-gray-500 py-6">
              No schedule preferences assigned.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferenceDetailsPage;
