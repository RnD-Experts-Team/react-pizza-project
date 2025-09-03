import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ManageLayout } from '@/components/layouts/ManageLayout';

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
    <ManageLayout
      title="Create Permission"
      subtitle="Add a new permission to the system"
      backButton={{
        show: true,
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-destructive bg-destructive/10 text-destructive">
          <AlertDescription className="text-sm sm:text-base">{error}</AlertDescription>
        </Alert>
      )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Permission Information */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-card-foreground">
                  <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Permission Details
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground">
                  Enter the permission name and guard configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Permission Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="name" className="text-sm sm:text-base font-medium text-foreground">
                      Permission Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., manage-users, view-reports"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring transition-colors ${
                        errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-xs sm:text-sm text-destructive font-medium">{errors.name}</p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Use lowercase letters, numbers, and hyphens only
                    </p>
                  </div>

                  {/* Guard Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="guard_name" className="text-sm sm:text-base font-medium text-foreground">
                      Guard Name *
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Input
                        id="guard_name"
                        type="text"
                        placeholder="web"
                        value={formData.guard_name}
                        onChange={(e) => handleInputChange('guard_name', e.target.value)}
                        className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring transition-colors flex-1 ${
                          errors.guard_name ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                        }`}
                        disabled={isLoading}
                      />
                      <Badge 
                        variant="outline" 
                        className="px-3 py-2 text-xs sm:text-sm border-border text-muted-foreground bg-muted/50 self-start sm:self-center whitespace-nowrap"
                      >
                        Default: web
                      </Badge>
                    </div>
                    {errors.guard_name && (
                      <p className="text-xs sm:text-sm text-destructive font-medium">{errors.guard_name}</p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Specifies the authentication guard for this permission
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                disabled={isLoading}
                className="order-2 sm:order-1 bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="order-1 sm:order-2 min-w-[120px] sm:min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm sm:text-base">Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">Create Permission</span>
                  </>
                )}
              </Button>
            </div>
          </form>
    </ManageLayout>
  );
};

export default CreatePermissionPage;