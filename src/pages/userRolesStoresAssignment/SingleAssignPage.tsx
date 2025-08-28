/**
 * Single Assignment Page
 * 
 * A page for assigning a single role to a user for a specific store
 * with radio button selection for single choice interface.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { useStores } from '../../features/stores/hooks/useStores';
import { useAssignmentOperations } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import type { AssignUserRoleRequest } from '../../features/userRolesStoresAssignment/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';

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
  X,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowRight,
  UserCheck,
  Settings,
  ArrowLeft,
} from 'lucide-react';

interface AssignmentData {
  selectedUser: number | null;
  selectedRole: number | null;
  selectedStore: string | null;
}

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const SingleAssignPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get pre-selected values from URL params
  const preSelectedUserId = searchParams.get('userId');
  const preSelectedStoreId = searchParams.get('storeId');
  
  // State for assignment data
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    selectedUser: preSelectedUserId ? parseInt(preSelectedUserId) : null,
    selectedRole: null,
    selectedStore: preSelectedStoreId || null,
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
  } = useUsers();

  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
  } = useRoles();

  const {
    stores,
    loading: storesLoading,
    error: storesError,
  } = useStores();

  // Get assignment operations hook
  const { assignUserRole, isAssigning: isAssigningHook, assignError } = useAssignmentOperations();

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
      id: 'user',
      title: 'Select User',
      description: 'Choose a user to assign role to',
      completed: assignmentData.selectedUser !== null,
    },
    {
      id: 'role',
      title: 'Select Role',
      description: 'Choose a role to assign',
      completed: assignmentData.selectedRole !== null,
    },
    {
      id: 'store',
      title: 'Select Store',
      description: 'Choose a store for the assignment',
      completed: assignmentData.selectedStore !== null,
    },
  ];

  const completedSteps = assignmentSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / assignmentSteps.length) * 100;

  // Handler functions
  const handleUserSelect = (userId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedUser: parseInt(userId),
    }));
  };

  const handleRoleSelect = (roleId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedRole: parseInt(roleId),
    }));
  };

  const handleStoreSelect = (storeId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedStore: storeId,
    }));
  };

  const handleClearSelection = () => {
    setAssignmentData({
      selectedUser: preSelectedUserId ? parseInt(preSelectedUserId) : null,
      selectedRole: null,
      selectedStore: preSelectedStoreId || null,
    });
    setAssignmentResult(null);
  };

  const handleAssignment = async () => {
    if (!assignmentData.selectedUser || !assignmentData.selectedRole || !assignmentData.selectedStore) {
      return;
    }

    setIsAssigning(true);
    setShowConfirmDialog(false);

    try {
      const assignmentRequest: AssignUserRoleRequest = {
        user_id: assignmentData.selectedUser,
        role_id: assignmentData.selectedRole,
        store_id: assignmentData.selectedStore,
        is_active: true,
        metadata: {
          start_date: new Date().toISOString(),
          notes: 'Single assignment via Assignment Page'
        }
      };

      await assignUserRole(assignmentRequest);
      
      setAssignmentResult({
        success: true,
        message: `Successfully assigned role to user for the selected store.`,
      });

      // Clear selection after successful assignment
      setTimeout(() => {
        handleClearSelection();
      }, 3000);
    } catch (error) {
      console.error('Assignment error:', error);
      setAssignmentResult({
        success: false,
        message: assignError?.message || 'Failed to assign role. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const canAssign = assignmentData.selectedUser !== null &&
                   assignmentData.selectedRole !== null &&
                   assignmentData.selectedStore !== null;

  // Use the hook's loading state for better consistency
  const isActuallyAssigning = isAssigning || isAssigningHook;

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

  const handleGoBack = () => {
    navigate('/user-role-store-assignment');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Single Role Assignment</h1>
              <p className="text-muted-foreground mt-2">
                Assign a single role to a user for a specific store
              </p>
            </div>
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
                  disabled={!canAssign || isActuallyAssigning}
                  className="flex items-center gap-2"
                >
                  {isActuallyAssigning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  {isActuallyAssigning ? 'Assigning...' : 'Assign Role'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Role Assignment</DialogTitle>
                  <DialogDescription>
                    You are about to assign a role to the selected user for the selected store.
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
      {(assignmentData.selectedUser || assignmentData.selectedRole || assignmentData.selectedStore) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Selected User</span>
                </div>
                <div>
                  {assignmentData.selectedUser ? (
                    (() => {
                      const user = users.find(u => u.id === assignmentData.selectedUser);
                      return user ? (
                        <Badge variant="secondary" className="text-xs">
                          {user.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">User not found</span>
                      );
                    })()
                  ) : (
                    <span className="text-muted-foreground text-sm">No user selected</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Selected Role</span>
                </div>
                <div>
                  {assignmentData.selectedRole ? (
                    (() => {
                      const role = roles.find(r => r.id === assignmentData.selectedRole);
                      return role ? (
                        <Badge variant="secondary" className="text-xs">
                          {role.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Role not found</span>
                      );
                    })()
                  ) : (
                    <span className="text-muted-foreground text-sm">No role selected</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="font-medium">Selected Store</span>
                </div>
                <div>
                  {assignmentData.selectedStore ? (
                    (() => {
                      const store = stores.find(s => s.id === assignmentData.selectedStore);
                      return store ? (
                        <Badge variant="secondary" className="text-xs">
                          {store.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Store not found</span>
                      );
                    })()
                  ) : (
                    <span className="text-muted-foreground text-sm">No store selected</span>
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
            Users {assignmentData.selectedUser && '(1 selected)'}
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles {assignmentData.selectedRole && '(1 selected)'}
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Stores {assignmentData.selectedStore && '(1 selected)'}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Select User</CardTitle>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {usersError ? (
                <div className="text-red-500 text-center py-4">
                  Error loading users: {usersError}
                </div>
              ) : usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <RadioGroup
                  value={assignmentData.selectedUser?.toString() || ''}
                  onValueChange={handleUserSelect}
                  className="space-y-4"
                >
                  {displayUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {userSearch ? 'No users found matching your search' : 'No users found'}
                    </div>
                  ) : (
                    displayUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value={user.id.toString()} id={`user-${user.id}`} />
                        <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex flex-wrap gap-1">
                                {user.roles && user.roles.length > 0 ? (
                                  user.roles.slice(0, 2).map((role) => (
                                    <Badge key={role.id} variant="outline" className="text-xs">
                                      {role.name}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-xs">No roles</span>
                                )}
                                {user.roles && user.roles.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.roles.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(user.created_at)}
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))
                  )}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Select Role</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {rolesError ? (
                <div className="text-red-500 text-center py-4">
                  Error loading roles: {rolesError}
                </div>
              ) : rolesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading roles...</span>
                </div>
              ) : (
                <RadioGroup
                  value={assignmentData.selectedRole?.toString() || ''}
                  onValueChange={handleRoleSelect}
                  className="space-y-4"
                >
                  {displayRoles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {roleSearch ? 'No roles found matching your search' : 'No roles found'}
                    </div>
                  ) : (
                    displayRoles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value={role.id.toString()} id={`role-${role.id}`} />
                        <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">{role.name}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="default">
                                Active
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(role.created_at)}
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))
                  )}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Select Store</CardTitle>
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
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {storesError ? (
                <div className="text-red-500 text-center py-4">
                  Error loading stores: {storesError}
                </div>
              ) : storesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading stores...</span>
                </div>
              ) : (
                <RadioGroup
                  value={assignmentData.selectedStore || ''}
                  onValueChange={handleStoreSelect}
                  className="space-y-4"
                >
                  {displayStores.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {storeSearch ? 'No stores found matching your search' : 'No stores found'}
                    </div>
                  ) : (
                    displayStores.map((store) => (
                      <div key={store.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value={store.id} id={`store-${store.id}`} />
                        <Label htmlFor={`store-${store.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Store className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">{store.name}</div>
                                <div className="text-sm text-muted-foreground font-mono">{store.id}</div>
                                {store.metadata.address && (
                                  <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                                    {store.metadata.address}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={store.is_active ? 'default' : 'secondary'}>
                                {store.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              {store.metadata.phone && (
                                <div className="text-xs text-muted-foreground">
                                  {store.metadata.phone}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">
                                {formatDate(store.created_at)}
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))
                  )}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SingleAssignPage;