import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Key, Plus, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface CreatePermissionForm {
  name: string;
  guard_name: string;
}

interface FormErrors {
  name?: string;
  guard_name?: string;
}

const CreatePermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreatePermissionForm>({
    name: '',
    guard_name: 'web'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof CreatePermissionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Permission name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Permission name must be at least 3 characters';
    }
    
    if (!formData.guard_name.trim()) {
      newErrors.guard_name = 'Guard name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual API call to create permission
      console.log('Creating permission:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to permissions table on success
      navigate('/user-management', { 
        state: { message: 'Permission created successfully!' }
      });
    } catch (err) {
      setError('Failed to create permission. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Permission</h1>
            <p className="text-muted-foreground">
              Add a new permission to the system
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Permission Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permission Details
              </CardTitle>
              <CardDescription>
                Enter the permission name and guard configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Permission Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Permission Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., manage-users, view-reports"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>

                {/* Guard Name */}
                <div className="space-y-2">
                  <Label htmlFor="guard_name" className="text-sm font-medium">
                    Guard Name *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="guard_name"
                      type="text"
                      placeholder="web"
                      value={formData.guard_name}
                      onChange={(e) => handleInputChange('guard_name', e.target.value)}
                      className={errors.guard_name ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <Badge variant="outline" className="px-3 py-2 text-xs">
                      Default: web
                    </Badge>
                  </div>
                  {errors.guard_name && (
                    <p className="text-sm text-red-500">{errors.guard_name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Specifies the authentication guard for this permission
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Permission
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePermissionPage;