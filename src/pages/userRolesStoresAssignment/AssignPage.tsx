/**
 * Enhanced Assignment Page
 * 
 * A comprehensive page for assigning roles to users across different stores
 * with an intuitive multi-select interface and advanced filtering capabilities.
 */

import React, { useState, useMemo } from 'react';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { useStores } from '../../features/stores/hooks/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Avatar } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Loader2,
  Search,
  Users,
  Shield,
  Store,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowRight,
  UserCheck,
  Settings,
} from 'lucide-react';

interface AssignmentData {
  selectedUsers: number[];
  selectedRoles: number[];
  selectedStores: string[];
}

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const AssignPage: React.FC = () => {
  // State for assignment data
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    selectedUsers: [],
    selectedRoles: [],
    selectedStores: [],
  });

  // State for search terms
  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');

  // State for filters
  const [userFilter, setUserFilter] = useState<'all' | 'with-roles' | 'without-roles'>('all');
  const [storeFilter, setStoreFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // State for assignment process
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch data using hooks
  const {
    users,
    loading: usersLoading,
    error: usersError,
    filteredUsers,
    searchTerm: userSearchTerm,
    setSearchTerm: setUserSearchTerm,
  } = useUsers();

  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
    filteredRoles,
    searchTerm: roleSearchTerm,
    setSearchTerm: setRoleSearchTerm,
  } = useRoles();

  const {
    stores,
    loading: storesLoading,
    error: storesError,
    searchTerm: storeSearchTerm,
    setSearchTerm: setStoreSearchTerm,
  } = useStores();

  // Filter users based on local filters
  const displayUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    switch (userFilter) {
      case 'with-roles':
        filtered = filtered.filter(user => user.roles && user.roles.length > 0);
        break;
      case 'without-roles':
        filtered = filtered.filter(user => !user.roles || user.roles.length === 0);
        break;
    }

    return filtered;
  }, [users, userSearch, userFilter]);

  // Filter roles based on search
  const displayRoles = useMemo(() => {
    return roles.filter(role =>
      role.name.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [roles, roleSearch]);

  // Filter stores based on search and status
  const displayStores = useMemo(() => {
    let filtered = stores.filter(store =>
      store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      store.id.toLowerCase().includes(storeSearch.toLowerCase())
    );

    switch (storeFilter) {
      case 'active':
        filtered = filtered.filter(store => store.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter(store => !store.is_active);
        break;
    }

    return filtered;
  }, [stores, storeSearch, storeFilter]);

  // Assignment steps for progress tracking
  const assignmentSteps: AssignmentStep[] = [
    {
      id: 'users',
      title: 'Select Users',
      description: 'Choose users to assign roles to',
      completed: assignmentData.selectedUsers.length > 0,
    },
    {
      id: 'roles',
      title: 'Select Roles',
      description: 'Choose roles to assign',
      completed: assignmentData.selectedRoles.length > 0,
    },
    {
      id: 'stores',
      title: 'Select Stores',
      description: 'Choose stores for the assignment',
      completed: assignmentData.selectedStores.length > 0,
    },
  ];

  const completedSteps = assignmentSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / assignmentSteps.length) * 100;

  // Handler functions
  const handleUserToggle = (userId: number) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  const handleRoleToggle = (roleId: number) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId],
    }));
  };

  const handleStoreToggle = (storeId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.includes(storeId)
        ? prev.selectedStores.filter(id => id !== storeId)
        : [...prev.selectedStores, storeId],
    }));
  };

  const handleSelectAllUsers = () => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.length === displayUsers.length
        ? []
        : displayUsers.map(user => user.id),
    }));
  };

  const handleSelectAllRoles = () => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.length === displayRoles.length
        ? []
        : displayRoles.map(role => role.id),
    }));
  };

  const handleSelectAllStores = () => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.length === displayStores.length
        ? []
        : displayStores.map(store => store.id),
    }));
  };

  const handleClearSelection = () => {
    setAssignmentData({
      selectedUsers: [],
      selectedRoles: [],
      selectedStores: [],
    });
    setAssignmentResult(null);
  };

  const handleAssignment = async () => {
    setIsAssigning(true);
    setShowConfirmDialog(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Implement actual assignment logic
      console.log('Assignment data:', assignmentData);

      setAssignmentResult({
        success: true,
        message: `Successfully assigned ${assignmentData.selectedRoles.length} roles to ${assignmentData.selectedUsers.length} users across ${assignmentData.selectedStores.length} stores.`,
      });

      // Clear selection after successful assignment
      setTimeout(() => {
        handleClearSelection();
      }, 3000);
    } catch (error) {
      setAssignmentResult({
        success: false,
        message: 'Failed to assign roles. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const canAssign = assignmentData.selectedUsers.length > 0 &&
                   assignmentData.selectedRoles.length > 0 &&
                   assignmentData.selectedStores.length > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Assignment</h1>
            <p className="text-muted-foreground mt-2">
              Assign roles to users across different stores with an intuitive interface
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClearSelection}
              disabled={!canAssign}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogTrigger asChild>
                <Button
                  disabled={!canAssign || isAssigning}
                  className="flex items-center gap-2"
                >
                  {isAssigning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  {isAssigning ? 'Assigning...' : 'Assign Roles'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Role Assignment</DialogTitle>
                  <DialogDescription>
                    You are about to assign {assignmentData.selectedRoles.length} roles to{' '}
                    {assignmentData.selectedUsers.length} users across{' '}
                    {assignmentData.selectedStores.length} stores.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAssignment}>
                    Confirm Assignment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assignment Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps} of {assignmentSteps.length} steps completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between">
                {assignmentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted" />
                    )}
                    <span className={`text-xs ${step.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                    {index < assignmentSteps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Result */}
        {assignmentResult && (
          <Alert className={assignmentResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {assignmentResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={assignmentResult.success ? 'text-green-800' : 'text-red-800'}>
              {assignmentResult.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Selection Summary */}
      {(assignmentData.selectedUsers.length > 0 || assignmentData.selectedRoles.length > 0 || assignmentData.selectedStores.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Selection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Selected Users ({assignmentData.selectedUsers.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignmentData.selectedUsers.slice(0, 3).map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary" className="text-xs">
                        {user.name}
                      </Badge>
                    ) : null;
                  })}
                  {assignmentData.selectedUsers.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{assignmentData.selectedUsers.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Selected Roles ({assignmentData.selectedRoles.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignmentData.selectedRoles.slice(0, 3).map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return role ? (
                      <Badge key={roleId} variant="secondary" className="text-xs">
                        {role.name}
                      </Badge>
                    ) : null;
                  })}
                  {assignmentData.selectedRoles.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{assignmentData.selectedRoles.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="font-medium">Selected Stores ({assignmentData.selectedStores.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignmentData.selectedStores.slice(0, 3).map(storeId => {
                    const store = stores.find(s => s.id === storeId);
                    return store ? (
                      <Badge key={storeId} variant="secondary" className="text-xs">
                        {store.name}
                      </Badge>
                    ) : null;
                  })}
                  {assignmentData.selectedStores.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{assignmentData.selectedStores.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({assignmentData.selectedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles ({assignmentData.selectedRoles.length})
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Stores ({assignmentData.selectedStores.length})
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Select Users</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={userFilter} onValueChange={(value: any) => setUserFilter(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="with-roles">With Roles</SelectItem>
                      <SelectItem value="without-roles">Without Roles</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={handleSelectAllUsers}
                    className="whitespace-nowrap"
                  >
                    {assignmentData.selectedUsers.length === displayUsers.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {usersError ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Error loading users: {usersError}</AlertDescription>
                </Alert>
              ) : usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        assignmentData.selectedUsers.includes(user.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={assignmentData.selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                        />
                        <Avatar className="h-10 w-10">
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {getInitials(user.name)}
                          </div>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.slice(0, 2).map((role) => (
                                <Badge key={role.id} variant="outline" className="text-xs">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No roles</span>
                            )}
                            {user.roles && user.roles.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.roles.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Select Roles</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSelectAllRoles}
                    className="whitespace-nowrap"
                  >
                    {assignmentData.selectedRoles.length === displayRoles.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {rolesError ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Error loading roles: {rolesError}</AlertDescription>
                </Alert>
              ) : rolesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading roles...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayRoles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        assignmentData.selectedRoles.includes(role.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => handleRoleToggle(role.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={assignmentData.selectedRoles.includes(role.id)}
                          onChange={() => handleRoleToggle(role.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <p className="font-medium">{role.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Guard: {role.guard_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created: {formatDate(role.created_at)}
                          </p>
                          {role.permissions && role.permissions.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">
                                {role.permissions.length} permissions
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Select Stores</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stores..."
                      value={storeSearch}
                      onChange={(e) => setStoreSearch(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={storeFilter} onValueChange={(value: any) => setStoreFilter(value)}>
                    <SelectTrigger className="w-full sm:w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={handleSelectAllStores}
                    className="whitespace-nowrap"
                  >
                    {assignmentData.selectedStores.length === displayStores.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {storesError ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Error loading stores: {storesError}</AlertDescription>
                </Alert>
              ) : storesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading stores...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayStores.map((store) => (
                    <div
                      key={store.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        assignmentData.selectedStores.includes(store.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => handleStoreToggle(store.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={assignmentData.selectedStores.includes(store.id)}
                          onChange={() => handleStoreToggle(store.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-primary" />
                            <p className="font-medium">{store.name}</p>
                            <Badge
                              variant={store.is_active ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {store.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 font-mono">
                            {store.id}
                          </p>
                          {store.metadata.address && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {store.metadata.address}
                            </p>
                          )}
                          {store.metadata.phone && (
                            <p className="text-xs text-muted-foreground">
                              {store.metadata.phone}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Created: {formatDate(store.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignPage;