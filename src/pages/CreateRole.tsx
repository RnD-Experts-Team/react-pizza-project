import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useUserManagement';
import type { CreateRoleForm, Permission } from '@/types/userManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shield, Key, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormErrors {
  name?: string;
  guard_name?: string;
  permissions?: string;
}

interface LocalRoleForm {
  name: string;
  guard_name: string;
  permissions: number[];
}

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { state, actions } = useUserManagement();
  const { permissions, loading, error } = state;
  const { fetchPermissions, createRole } = actions;

  const [formData, setFormData] = useState<LocalRoleForm>({
    name: '',
    guard_name: 'web',
    permissions: []
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Role name must be at least 2 characters long';
    } else if (!/^[a-zA-Z0-9\s_-]+$/.test(formData.name.trim())) {
      errors.name = 'Role name can only contain letters, numbers, spaces, underscores, and hyphens';
    }

    // Guard name validation
    if (!formData.guard_name.trim()) {
      errors.guard_name = 'Guard name is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.guard_name.trim())) {
      errors.guard_name = 'Guard name can only contain letters, numbers, and underscores';
    }

    // Permissions validation
    if (formData.permissions.length === 0) {
      errors.permissions = 'At least one permission must be selected';
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

  const handlePermissionToggle = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
    
    // Clear permission error when user selects a permission
    if (formErrors.permissions) {
      setFormErrors(prev => ({ ...prev, permissions: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert permission IDs to strings as expected by the API
      const roleData: CreateRoleForm = {
        ...formData,
        permissions: formData.permissions.map(id => id.toString())
      };
      await createRole(roleData);
      navigate('/user-management', { 
        state: { message: 'Role created successfully!' }
      });
    } catch (err) {
      console.error('Failed to create role:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPermissionColor = (permissionName: string) => {
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 text-green-800 hover:bg-green-200',
      'read': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'update': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'delete': 'bg-red-100 text-red-800 hover:bg-red-200',
      'manage': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'view': 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
    };
    const key = permissionName.toLowerCase().split(' ')[0] || permissionName.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const getPermissionCategories = () => {
    const categories = new Set<string>();
    permissions.forEach(permission => {
      const category = permission.name.split(' ')[1] || 'general';
      categories.add(category.toLowerCase());
    });
    return Array.from(categories).sort();
  };

  const getFilteredPermissions = () => {
    if (selectedCategory === 'all') {
      return permissions;
    }
    return permissions.filter(permission => {
      const category = permission.name.split(' ')[1] || 'general';
      return category.toLowerCase() === selectedCategory;
    });
  };

  const selectAllInCategory = () => {
    const categoryPermissions = getFilteredPermissions();
    const categoryIds = categoryPermissions.map(p => p.id);
    const allSelected = categoryIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all in category
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryIds.includes(id))
      }));
    } else {
      // Select all in category
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryIds])]
      }));
    }
  };

  const getCategorySelectionStatus = () => {
    const categoryPermissions = getFilteredPermissions();
    const categoryIds = categoryPermissions.map(p => p.id);
    const selectedCount = categoryIds.filter(id => formData.permissions.includes(id)).length;
    
    if (selectedCount === 0) return 'none';
    if (selectedCount === categoryIds.length) return 'all';
    return 'partial';
  };

  if (loading && !permissions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  const categories = getPermissionCategories();
  const filteredPermissions = getFilteredPermissions();
  const selectionStatus = getCategorySelectionStatus();

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
          <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
          <p className="text-muted-foreground mt-1">
            Create a new role and assign permissions to it
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Information
            </CardTitle>
            <CardDescription>
              Enter the basic information for the new role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter role name (e.g., Manager, Editor)"
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permissions *
            </CardTitle>
            <CardDescription>
              Select the permissions that this role should have
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Permission Categories Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  type="button"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All ({permissions.length})
                </Button>
                {categories.map((category) => {
                  const categoryCount = permissions.filter(p => {
                    const cat = p.name.split(' ')[1] || 'general';
                    return cat.toLowerCase() === category;
                  }).length;
                  
                  return (
                    <Button
                      key={category}
                      type="button"
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCount})
                    </Button>
                  );
                })}
              </div>
              
              {selectedCategory !== 'all' && (
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllInCategory}
                  >
                    {selectionStatus === 'all' ? 'Deselect All' : 'Select All'} in {selectedCategory}
                  </Button>
                  {selectionStatus === 'partial' && (
                    <Badge variant="outline">
                      Partially Selected
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Permissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPermissions.map((permission) => (
                <div
                  key={permission.id}
                  onClick={() => handlePermissionToggle(permission.id)}
                  className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                    formData.permissions.includes(permission.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{permission.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Guard: {permission.guard_name}
                      </p>
                    </div>
                    <Badge className={getPermissionColor(permission.name)}>
                      {permission.name.split(' ')[0] || 'Permission'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {filteredPermissions.length === 0 && (
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No permissions found in this category</p>
              </div>
            )}

            {formErrors.permissions && (
              <p className="text-sm text-destructive mt-4">{formErrors.permissions}</p>
            )}

            {/* Selected Permissions Summary */}
            {formData.permissions.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="font-medium mb-3">
                    Selected Permissions ({formData.permissions.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {permissions
                      .filter(p => formData.permissions.includes(p.id))
                      .map((permission) => (
                        <Badge
                          key={permission.id}
                          onClick={() => handlePermissionToggle(permission.id)}
                          className={`cursor-pointer ${getPermissionColor(permission.name)}`}
                        >
                          {permission.name}
                          <span className="ml-1 text-xs">×</span>
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </>
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
                Creating Role...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
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

export default CreateRole;