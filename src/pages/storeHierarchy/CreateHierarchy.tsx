/**
 * Create Hierarchy Page
 * 
 * Page for creating role hierarchies with radio group selection for higher and lower roles,
 * and optional metadata fields for created_by and reason.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCreateHierarchy } from '../../features/storeHierarchy/hooks/UseRoleHierarchy';
import { useRoles } from '../../features/roles/hooks/useRoles';
import type { CreateHierarchyRequest } from '../../features/storeHierarchy/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Loader2, AlertCircle, Crown, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const CreateHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams<{ storeId: string }>();
  const { createHierarchy, isLoading, error } = useCreateHierarchy();
  const { roles, loading: rolesLoading } = useRoles();
  
  // Get preselected roles from navigation state (from validate page)
  const preselectedState = location.state as {
    preselectedHigherRole?: string;
    preselectedLowerRole?: string;
  } | null;
  
  // Form state
  const [formData, setFormData] = useState<{
    higher_role_id: string;
    lower_role_id: string;
    created_by: string;
    reason: string;
  }>({
    higher_role_id: preselectedState?.preselectedHigherRole || '',
    lower_role_id: preselectedState?.preselectedLowerRole || '',
    created_by: 'system',
    reason: ''
  });
  
  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(`/stores-hierarchy/${storeId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (field: 'higher_role_id' | 'lower_role_id', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.higher_role_id) {
      errors.higher_role_id = 'Please select a higher role';
    }
    
    if (!formData.lower_role_id) {
      errors.lower_role_id = 'Please select a lower role';
    }
    
    if (formData.higher_role_id === formData.lower_role_id && formData.higher_role_id) {
      errors.lower_role_id = 'Higher role and lower role cannot be the same';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!storeId) {
      setValidationErrors({ general: 'Store ID is required' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const hierarchyRequest: CreateHierarchyRequest = {
        higher_role_id: parseInt(formData.higher_role_id),
        lower_role_id: parseInt(formData.lower_role_id),
        store_id: storeId,
        metadata: {
          created_by: formData.created_by,
          reason: formData.reason || ''
        },
        is_active: true
      };
      
      await createHierarchy(hierarchyRequest);
      
      // Success - navigate back to store hierarchy detail page
      navigate(`/stores-hierarchy/${storeId}`);
    } catch (err) {
      console.error('Failed to create hierarchy:', err);
      setValidationErrors({ general: 'Failed to create hierarchy. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear validation errors when form data changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [formData]);

  if (!storeId) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Alert variant="destructive" className="border-destructive/50 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            Store ID is required to create hierarchy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2 hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Create Hierarchy</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Create a new role hierarchy for store: <span className="font-mono text-foreground">{storeId}</span>
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {(error || validationErrors.general) && (
          <Alert variant="destructive" className="border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              {error?.message || validationErrors.general}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Higher Role Selection */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                <span className="text-foreground">Higher Role</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select the role that will be higher in the hierarchy (parent role)
              </p>
            </CardHeader>
            <CardContent className="pt-0 sm:pt-6">
              {rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm sm:text-base text-muted-foreground">Loading roles...</span>
                </div>
              ) : (
                <RadioGroup
                  value={formData.higher_role_id}
                  onValueChange={(value) => handleRoleChange('higher_role_id', value)}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50">
                      <RadioGroupItem
                        value={role.id.toString()}
                        id={`higher-role-${role.id}`}
                        disabled={formData.lower_role_id === role.id.toString()}
                      />
                      <Label
                        htmlFor={`higher-role-${role.id}`}
                        className={cn(
                          "text-xs sm:text-sm font-medium leading-none cursor-pointer flex-1",
                          formData.lower_role_id === role.id.toString() && "text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <span className="text-foreground">{role.name}</span>
                        {role.permissions && role.permissions.length > 0 && (
                          <span className="text-xs text-muted-foreground ml-1 block sm:inline">
                            ({role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {validationErrors.higher_role_id && (
                <p className="text-xs sm:text-sm text-destructive mt-2">{validationErrors.higher_role_id}</p>
              )}
            </CardContent>
          </Card>

          {/* Lower Role Selection */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-foreground">Lower Role</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select the role that will be lower in the hierarchy (child role)
              </p>
            </CardHeader>
            <CardContent className="pt-0 sm:pt-6">
              {rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm sm:text-base text-muted-foreground">Loading roles...</span>
                </div>
              ) : (
                <RadioGroup
                  value={formData.lower_role_id}
                  onValueChange={(value) => handleRoleChange('lower_role_id', value)}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50">
                      <RadioGroupItem
                        value={role.id.toString()}
                        id={`lower-role-${role.id}`}
                        disabled={formData.higher_role_id === role.id.toString()}
                      />
                      <Label
                        htmlFor={`lower-role-${role.id}`}
                        className={cn(
                          "text-xs sm:text-sm font-medium leading-none cursor-pointer flex-1",
                          formData.higher_role_id === role.id.toString() && "text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <span className="text-foreground">{role.name}</span>
                        {role.permissions && role.permissions.length > 0 && (
                          <span className="text-xs text-muted-foreground ml-1 block sm:inline">
                            ({role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {validationErrors.lower_role_id && (
                <p className="text-xs sm:text-sm text-destructive mt-2">{validationErrors.lower_role_id}</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg text-foreground">Metadata</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Additional information about this hierarchy relationship
              </p>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-0 sm:pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="created_by" className="text-sm font-medium text-foreground">Created By</Label>
                  <Input
                    id="created_by"
                    name="created_by"
                    type="text"
                    value={formData.created_by}
                    onChange={handleInputChange}
                    placeholder="Enter creator name"
                    className={cn(
                      "text-sm sm:text-base",
                      validationErrors.created_by && 'border-destructive'
                    )}
                  />
                  {validationErrors.created_by && (
                    <p className="text-xs sm:text-sm text-destructive">{validationErrors.created_by}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium text-foreground">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Store manager manages assistant manager"
                    className={cn(
                      "text-sm sm:text-base min-h-[80px] sm:min-h-[100px]",
                      validationErrors.reason && 'border-destructive'
                    )}
                    rows={3}
                  />
                  {validationErrors.reason && (
                    <p className="text-xs sm:text-sm text-destructive">{validationErrors.reason}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className="w-full sm:w-auto text-sm sm:text-base hover:bg-accent"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isLoading || rolesLoading}
              className="w-full sm:w-auto min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">Creating</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Create Hierarchy</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHierarchyPage;