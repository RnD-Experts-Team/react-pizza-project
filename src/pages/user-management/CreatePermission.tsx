import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useReduxUserManagement';
import type { CreatePermissionForm } from '@/types/userManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Key, Plus, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormErrors {
  name?: string;
  guard_name?: string;
}

const CreatePermission: React.FC = () => {
  const navigate = useNavigate();
  const { state, actions } = useUserManagement();
  const {  error } = state;
  const { createPermission } = actions;

  const [formData, setFormData] = useState<CreatePermissionForm>({
    name: '',
    guard_name: 'web'
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Permission name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Permission name must be at least 2 characters long';
    } else if (!/^[a-zA-Z0-9\s_-]+$/.test(formData.name.trim())) {
      errors.name = 'Permission name can only contain letters, numbers, spaces, underscores, and hyphens';
    }

    // Guard name validation
    if (!formData.guard_name.trim()) {
      errors.guard_name = 'Guard name is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.guard_name.trim())) {
      errors.guard_name = 'Guard name can only contain letters, numbers, and underscores';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createPermission(formData);
      navigate('/user-management', { 
        state: { message: 'Permission created successfully!' }
      });
    } catch (err) {
      console.error('Failed to create permission:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPermissionPreview = () => {
    if (!formData.name.trim()) return null;
    
    const name = formData.name.trim();
    const action = name.split(' ')[0]?.toLowerCase() || 'action';
    // const resource = name.split(' ')[1]?.toLowerCase() || 'resource';
    
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 text-green-800',
      'read': 'bg-blue-100 text-blue-800',
      'update': 'bg-yellow-100 text-yellow-800',
      'delete': 'bg-red-100 text-red-800',
      'manage': 'bg-purple-100 text-purple-800',
      'view': 'bg-cyan-100 text-cyan-800',
    };
    
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const permissionExamples = [
    { name: 'create users', description: 'Allow creating new users' },
    { name: 'read posts', description: 'Allow viewing posts' },
    { name: 'update profile', description: 'Allow updating user profiles' },
    { name: 'delete comments', description: 'Allow deleting comments' },
    { name: 'manage settings', description: 'Allow managing system settings' },
    { name: 'view reports', description: 'Allow viewing reports and analytics' },
  ];

  const handleExampleClick = (exampleName: string) => {
    setFormData(prev => ({ ...prev, name: exampleName }));
    if (formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/user-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Permission</h1>
          <p className="text-muted-foreground mt-1">
            Create a new permission that can be assigned to roles and users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permission Information
                </CardTitle>
                <CardDescription>
                  Enter the details for the new permission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Permission Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter permission name (e.g., create users, read posts)"
                    className={formErrors.name ? 'border-destructive' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-destructive">{formErrors.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use a descriptive name like "action resource" (e.g., "create users", "read posts")
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guard_name">Guard Name *</Label>
                  <Input
                    id="guard_name"
                    name="guard_name"
                    type="text"
                    value={formData.guard_name}
                    onChange={handleInputChange}
                    placeholder="Enter guard name (e.g., web, api)"
                    className={formErrors.guard_name ? 'border-destructive' : ''}
                  />
                  {formErrors.guard_name && (
                    <p className="text-sm text-destructive">{formErrors.guard_name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Guard name defines the authentication context (usually 'web' for web applications)
                  </p>
                </div>

                {/* Permission Preview */}
                {formData.name.trim() && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      <Badge className={getPermissionPreview() || undefined}>
                        {formData.name.trim()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Guard: {formData.guard_name}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link to="/user-management">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Permission...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Permission
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {/* Permission Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-4 w-4" />
                Permission Examples
              </CardTitle>
              <CardDescription>
                Click on any example to use it as a template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {permissionExamples.map((example, index) => (
                  <div
                    key={index}
                    onClick={() => handleExampleClick(example.name)}
                    className="cursor-pointer p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <Badge className="mb-2">
                      {example.name}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Permission Naming Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Naming Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-green-700">✓ Good Examples:</h4>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                    <li>create users</li>
                    <li>read posts</li>
                    <li>update profile</li>
                    <li>delete comments</li>
                    <li>manage settings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-700">✗ Avoid:</h4>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                    <li>CreateUser (camelCase)</li>
                    <li>user.create (dots)</li>
                    <li>create-user (hyphens in action)</li>
                    <li>CRUD (too vague)</li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <h4 className="font-medium mb-2">Format:</h4>
                  <p className="text-muted-foreground">
                    <code className="bg-muted px-1 rounded">action resource</code>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use lowercase with spaces between words
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CreatePermission;