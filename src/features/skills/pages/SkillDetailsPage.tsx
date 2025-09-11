// src/features/skills/pages/SkillDetailsPage.tsx
/**
 * Skill Details Page Component
 * 
 * Displays detailed information about a specific skill including
 * associated employees. Fetches skill data by ID from URL parameters.
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
  User,
  Calendar,
  Hash,
  Tag
} from 'lucide-react';
import { getSkillById } from '../services/api';
import type { SkillWithEmpInfos, ApiError, EmpInfo } from '../types';

/**
 * User-defined type guard to check if skill has emp_infos property
 */
const hasEmpInfos = (skill: SkillWithEmpInfos | null): skill is SkillWithEmpInfos => {
  return !!skill && 'emp_infos' in skill && Array.isArray(skill.emp_infos);
};

/**
 * Skill Details Page Component
 */
const SkillDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [skill, setSkill] = useState<SkillWithEmpInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch skill data on component mount
  useEffect(() => {
    const fetchSkillData = async () => {
      if (!id || isNaN(Number(id))) {
        setError('Invalid skill ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const skillData = await getSkillById(Number(id));
        setSkill(skillData);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch skill details';
        setError(errorMessage);
        toast.error('Error loading skill', { description: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchSkillData();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    if (id && !isNaN(Number(id))) {
      const fetchSkillData = async () => {
        try {
          setLoading(true);
          setError(null);
          const skillData = await getSkillById(Number(id));
          setSkill(skillData);
        } catch (err) {
          const apiError = err as ApiError;
          const errorMessage = apiError.message || 'Failed to fetch skill details';
          setError(errorMessage);
          toast.error('Error loading skill', { description: errorMessage });
        } finally {
          setLoading(false);
        }
      };
      fetchSkillData();
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
                <span>Back to Skills</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Loading skill details...</span>
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
                <span>Back to Skills</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Error Loading Skill</h3>
              <p className="text-sm text-gray-500 max-w-md">{error}</p>
              <div className="flex items-center space-x-2">
                <Button onClick={handleRetry} className="flex items-center space-x-2">
                  <span>Try Again</span>
                </Button>
                <Button variant="outline" onClick={handleBackClick}>
                  Back to Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <span>Back to Skills</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{skill?.name}</h1>
                <p className="text-sm text-gray-500 mt-1">Skill Details</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skill Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
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
                <span className="text-gray-900">{skill?.id}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 mt-1 font-medium">{skill?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Slug</label>
              <p className="text-gray-900 mt-1">
                {skill?.slug || <em className="text-gray-400">No slug assigned</em>}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Timestamps</span>
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="text-gray-900 mt-1">
                {skill ? new Date(skill.created_at).toLocaleString() : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900 mt-1">
                {skill ? new Date(skill.updated_at).toLocaleString() : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Associated Employees */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Associated Employees</span>
          </h2>
        </CardHeader>
        <CardContent>
          {hasEmpInfos(skill) && skill.emp_infos.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                {skill.emp_infos.length} employee{skill.emp_infos.length !== 1 ? 's' : ''} have this skill
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skill.emp_infos.map((emp: EmpInfo) => (
                  <div key={emp.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{emp.full_name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Rating: {emp.pivot.rating}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Store: {emp.store_id}</p>
                        <p>Status: {emp.status}</p>
                        <p>Arabic Team: {emp.is_arabic_team ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees assigned</h3>
              <p className="text-sm text-gray-500">
                This skill has not been assigned to any employees yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillDetailsPage;