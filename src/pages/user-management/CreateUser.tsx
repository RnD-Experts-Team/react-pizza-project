import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useReduxUserManagement';
import type { CreateUserForm, Role, Permission } from '@/types/userManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { ArrowLeft, UserPlus, Eye, EyeOff, Shield, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const {
    state: { roles, permissions, loading, error },
    actions: { fetchRoles, fetchPermissions, createUser }
  } = useUserManagement();

  const [formData, setFormData] = useState<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
    permissions: []
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Password confirmation validation
    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
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

  const handleRoleToggle = (role: Role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role.name)
        ? prev.roles.filter(name => name !== role.name)
        : [...prev.roles, role.name]
    }));
  };

  const handlePermissionToggle = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission.name)
        ? prev.permissions.filter(name => name !== permission.name)
        : [...prev.permissions, permission.name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await createUser(formData);
      if (success) {
        navigate('/user-management', { 
          state: { message: 'User created successfully!' }
        });
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      'admin': 'bg-red-100 text-red-800 hover:bg-red-200',
      'manager': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'user': 'bg-green-100 text-green-800 hover:bg-green-200',
      'editor': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    };
    return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const getPermissionColor = (permissionName: string) => {
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 text-green-800 hover:bg-green-200',
      'read': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'update': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'delete': 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    const key = permissionName.toLowerCase().split(' ')[0] || permissionName.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  if (loading && !roles.length && !permissions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-4 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/user-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground mt-1">
            Add a new user to the system with roles and permissions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Enter the basic information for the new user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={formErrors.email ? 'border-destructive' : ''}
                />
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className={formErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className={formErrors.password_confirmation ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formErrors.password_confirmation && (
                  <p className="text-sm text-destructive">{formErrors.password_confirmation}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles (Optional)
            </CardTitle>
            <CardDescription>
              Select roles for this user (leave empty for no role)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleToggle(role)}
                  className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                    formData.roles.includes(role.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {role.permissions ? role.permissions.length : 0} permissions
                      </p>
                    </div>
                    <Badge className={getRoleColor(role.name)}>
                      {role.name}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.permissions && role.permissions.slice(0, 3).map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions && role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {formData.roles.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No roles selected - user will be created without any role
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Additional Permissions
            </CardTitle>
            <CardDescription>
              Grant additional permissions beyond those provided by roles (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  onClick={() => handlePermissionToggle(permission)}
                  className={`cursor-pointer p-2 rounded-md border transition-all ${
                    formData.permissions.includes(permission.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Badge
                    className={`w-full justify-center ${
                      getPermissionColor(permission.name)
                    }`}
                  >
                    {permission.name}
                  </Badge>
                </div>
              ))}
            </div>
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
                Creating User...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
