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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)]">Single Role Assignment</h1>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
                Assign a single role to a user for a specific store
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <span className="text-sm sm:text-base font-medium text-[var(--card-foreground)]">Assignment Progress</span>
                <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  {completedSteps} of {assignmentSteps.length} steps completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 sm:h-3" />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2">
                {assignmentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 sm:gap-1 lg:gap-2">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-[#10b981] flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 rounded-full border-2 border-[var(--muted)] flex-shrink-0" />
                    )}
                    <span className={`text-xs sm:text-[10px] lg:text-xs ${step.completed ? 'text-[#059669]' : 'text-[var(--muted-foreground)]'} truncate`}>
                      {step.title}
                    </span>
                    {index < assignmentSteps.length - 1 && (
                      <ArrowRight className="h-3 w-3 sm:h-2 sm:w-2 lg:h-3 lg:w-3 text-[var(--muted-foreground)] ml-1 sm:ml-0 lg:ml-2 hidden sm:block flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Result */}
        {assignmentResult && (
          <Alert className={`px-4 sm:px-6 py-3 sm:py-4 ${assignmentResult.success ? 'border-[#10b981] bg-[#dcfce7]' : 'border-[#ef4444] bg-[#fef2f2]'} dark:${assignmentResult.success ? 'border-[#059669] bg-[#064e3b]' : 'border-[#dc2626] bg-[#7f1d1d]'}`}>
            {assignmentResult.success ? (
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#059669] flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#dc2626] flex-shrink-0" />
            )}
            <AlertDescription className={`text-sm sm:text-base ${assignmentResult.success ? 'text-[#065f46]' : 'text-[#991b1b]'} dark:${assignmentResult.success ? 'text-[#10b981]' : 'text-[#f87171]'} ml-2`}>
              {assignmentResult.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Selection Summary */}
      {(assignmentData.selectedUser || assignmentData.selectedRole || assignmentData.selectedStore) && (
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[var(--card-foreground)]">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary)]" />
              Current Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-[var(--card-foreground)]">Selected User</span>
                </div>
                <div>
                  {assignmentData.selectedUser ? (
                    (() => {
                      const user = users.find(u => u.id === assignmentData.selectedUser);
                      return user ? (
                        <Badge variant="secondary" className="text-xs sm:text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                          {user.name}
                        </Badge>
                      ) : (
                        <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">User not found</span>
                      );
                    })()
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">No user selected</span>
                  )}
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-[var(--card-foreground)]">Selected Role</span>
                </div>
                <div>
                  {assignmentData.selectedRole ? (
                    (() => {
                      const role = roles.find(r => r.id === assignmentData.selectedRole);
                      return role ? (
                        <Badge variant="secondary" className="text-xs sm:text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                          {role.name}
                        </Badge>
                      ) : (
                        <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">Role not found</span>
                      );
                    })()
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">No role selected</span>
                  )}
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-[var(--card-foreground)]">Selected Store</span>
                </div>
                <div>
                  {assignmentData.selectedStore ? (
                    (() => {
                      const store = stores.find(s => s.id === assignmentData.selectedStore);
                      return store ? (
                        <Badge variant="secondary" className="text-xs sm:text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                          {store.name}
                        </Badge>
                      ) : (
                        <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">Store not found</span>
                      );
                    })()
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">No store selected</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-[var(--muted)] p-1 rounded-lg">
          <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Users</span>
            <span className="sm:hidden">U</span>
            {assignmentData.selectedUser && <span className="hidden lg:inline text-[var(--primary)]">(1 selected)</span>}
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Roles</span>
            <span className="sm:hidden">R</span>
            {assignmentData.selectedRole && <span className="hidden lg:inline text-[var(--primary)]">(1 selected)</span>}
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm">
            <Store className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Stores</span>
            <span className="sm:hidden">S</span>
            {assignmentData.selectedStore && <span className="hidden lg:inline text-[var(--primary)]">(1 selected)</span>}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
                <CardTitle className="text-base sm:text-lg text-[var(--card-foreground)]">Select User</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
                    />
                  </div>
                  <Select value={userFilter} onValueChange={(value: any) => setUserFilter(value)}>
                    <SelectTrigger className="w-full sm:w-40 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] text-sm sm:text-base">
                      <Filter className="h-4 w-4 mr-2 text-[var(--muted-foreground)]" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                      <SelectItem value="all" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">All Users</SelectItem>
                      <SelectItem value="with-roles" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">With Roles</SelectItem>
                      <SelectItem value="without-roles" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">Without Roles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              {usersError ? (
                <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
                  Error loading users: {usersError}
                </div>
              ) : usersLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
                  <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">Loading users...</span>
                </div>
              ) : (
                <RadioGroup
                  value={assignmentData.selectedUser?.toString() || ''}
                  onValueChange={handleUserSelect}
                  className="space-y-3 sm:space-y-4"
                >
                  {displayUsers.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                      {userSearch ? 'No users found matching your search' : 'No users found'}
                    </div>
                  ) : (
                    displayUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                        <RadioGroupItem value={user.id.toString()} id={`user-${user.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                        <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-xs sm:text-sm font-medium text-[var(--primary)] flex-shrink-0">
                                {getInitials(user.name)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">{user.name}</div>
                                <div className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate">{user.email}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                              <div className="flex flex-wrap gap-1">
                                {user.roles && user.roles.length > 0 ? (
                                  user.roles.slice(0, 2).map((role) => (
                                    <Badge key={role.id} variant="outline" className="text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                                      {role.name}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-[var(--muted-foreground)] text-xs">No roles</span>
                                )}
                                {user.roles && user.roles.length > 2 && (
                                  <Badge variant="outline" className="text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                                    +{user.roles.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-[var(--muted-foreground)]">
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
        <TabsContent value="roles" className="space-y-4 sm:space-y-6">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
                <CardTitle className="text-base sm:text-lg text-[var(--card-foreground)]">Select Role</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input
                    placeholder="Search roles..."
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              {rolesError ? (
                <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
                  Error loading roles: {rolesError}
                </div>
              ) : rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
                  <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">Loading roles...</span>
                </div>
              ) : (
                <RadioGroup
                  value={assignmentData.selectedRole?.toString() || ''}
                  onValueChange={handleRoleSelect}
                  className="space-y-3 sm:space-y-4"
                >
                  {displayRoles.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                      {roleSearch ? 'No roles found matching your search' : 'No roles found'}
                    </div>
                  ) : (
                    displayRoles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                        <RadioGroupItem value={role.id.toString()} id={`role-${role.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                        <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">{role.name}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                              <Badge variant="default" className="bg-[var(--primary)] text-[var(--primary-foreground)] text-xs">
                                Active
                              </Badge>
                              <div className="text-xs text-[var(--muted-foreground)]">
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
        <TabsContent value="stores" className="space-y-4 sm:space-y-6">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
                <CardTitle className="text-base sm:text-lg text-[var(--card-foreground)]">Select Store</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      placeholder="Search stores..."
                      value={storeSearch}
                      onChange={(e) => setStoreSearch(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
                    />
                  </div>
                  <Select value={storeFilter} onValueChange={(value: any) => setStoreFilter(value)}>
                    <SelectTrigger className="w-full sm:w-40 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] text-sm sm:text-base">
                      <Filter className="h-4 w-4 mr-2 text-[var(--muted-foreground)]" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                      <SelectItem value="all" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">All Stores</SelectItem>
                      <SelectItem value="active" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">Active</SelectItem>
                      <SelectItem value="inactive" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              {storesError ? (
                <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
                  Error loading stores: {storesError}
                </div>
              ) : storesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
                  <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">Loading stores...</span>
                </div>
              ) : (
                <RadioGroup
                  value={assignmentData.selectedStore || ''}
                  onValueChange={handleStoreSelect}
                  className="space-y-3 sm:space-y-4"
                >
                  {displayStores.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                      {storeSearch ? 'No stores found matching your search' : 'No stores found'}
                    </div>
                  ) : (
                    displayStores.map((store) => (
                      <div key={store.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                        <RadioGroupItem value={store.id} id={`store-${store.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                        <Label htmlFor={`store-${store.id}`} className="flex-1 cursor-pointer">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                            <div className="flex items-start gap-3">
                              <Store className="h-5 w-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">{store.name}</div>
                                <div className="text-xs sm:text-sm text-[var(--muted-foreground)] font-mono truncate">{store.id}</div>
                                {store.metadata.address && (
                                  <div className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-[250px] sm:max-w-[300px] truncate">
                                    {store.metadata.address}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-start lg:items-end gap-1 sm:gap-2">
                              <Badge variant={store.is_active ? 'default' : 'secondary'} className={`text-xs ${store.is_active ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--secondary)] text-[var(--secondary-foreground)]'}`}>
                                {store.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              {store.metadata.phone && (
                                <div className="text-xs text-[var(--muted-foreground)]">
                                  {store.metadata.phone}
                                </div>
                              )}
                              <div className="text-xs text-[var(--muted-foreground)]">
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