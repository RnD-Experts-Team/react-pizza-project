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
import { useAssignmentOperations } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import type { BulkAssignUserRolesRequest, BulkAssignmentItem } from '../../features/userRolesStoresAssignment/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
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

  // Get assignment operations hook
  const { bulkAssignUserRoles, isBulkAssigning, bulkAssignError } = useAssignmentOperations();

  const handleAssignment = async () => {
    setIsAssigning(true);
    setShowConfirmDialog(false);

    try {
      const assignmentPromises: Promise<any>[] = [];
      let totalAssignments = 0;

      // Create bulk assignment requests for each selected user
      for (const userId of assignmentData.selectedUsers) {
        // Create assignments array for this user (all combinations of roles and stores)
        const assignments: BulkAssignmentItem[] = [];
        
        for (const roleId of assignmentData.selectedRoles) {
          for (const storeId of assignmentData.selectedStores) {
            assignments.push({
              role_id: roleId,
              store_id: storeId,
              metadata: {
                start_date: new Date().toISOString(),
                notes: 'Bulk assignment via Assignment Page'
              }
            });
            totalAssignments++;
          }
        }

        // Create bulk assignment request for this user
        const bulkRequest: BulkAssignUserRolesRequest = {
          user_id: userId,
          assignments: assignments
        };

        // Add the promise to the array
        assignmentPromises.push(bulkAssignUserRoles(bulkRequest));
      }

      // Execute all bulk assignments in parallel
      const results = await Promise.allSettled(assignmentPromises);
      
      // Check results
      const successfulAssignments = results.filter(result => result.status === 'fulfilled').length;
      const failedAssignments = results.filter(result => result.status === 'rejected').length;

      if (failedAssignments === 0) {
        setAssignmentResult({
          success: true,
          message: `Successfully assigned ${assignmentData.selectedRoles.length} roles to ${assignmentData.selectedUsers.length} users across ${assignmentData.selectedStores.length} stores (${totalAssignments} total assignments).`,
        });

        // Clear selection after successful assignment
        setTimeout(() => {
          handleClearSelection();
        }, 3000);
      } else {
        setAssignmentResult({
          success: false,
          message: `Partial success: ${successfulAssignments} users assigned successfully, ${failedAssignments} failed. Please check the failed assignments and try again.`,
        });
      }
    } catch (error) {
      console.error('Assignment error:', error);
      setAssignmentResult({
        success: false,
        message: bulkAssignError?.message || 'Failed to assign roles. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const canAssign = assignmentData.selectedUsers.length > 0 &&
                   assignmentData.selectedRoles.length > 0 &&
                   assignmentData.selectedStores.length > 0;

  // Use the hook's loading state for better consistency
  const isActuallyAssigning = isAssigning || isBulkAssigning;

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
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Role Assignment
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Assign roles to users across different stores with an intuitive interface
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleClearSelection}
              disabled={!canAssign}
              className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Clear Selection</span>
              <span className="sm:hidden">Clear</span>
            </Button>
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogTrigger asChild>
                <Button
                  disabled={!canAssign || isActuallyAssigning}
                  className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isActuallyAssigning ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isActuallyAssigning ? 'Assigning...' : 'Assign Roles'}
                  </span>
                  <span className="sm:hidden">
                    {isActuallyAssigning ? 'Assigning...' : 'Assign'}
                  </span>
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
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-xs sm:text-sm font-medium text-card-foreground">Assignment Progress</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {completedSteps} of {assignmentSteps.length} steps completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-1.5 sm:h-2 bg-secondary" />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                {assignmentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                    {step.completed ? (
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" style={{color: '#10b981'}} />
                    ) : (
                      <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-muted bg-background" />
                    )}
                    <span className={`text-xs sm:text-sm ${step.completed ? 'font-medium' : 'text-muted-foreground'}`} style={{color: step.completed ? '#059669' : undefined}}>
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{step.title.split(' ')[1] || step.title}</span>
                    </span>
                    {index < assignmentSteps.length - 1 && (
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground ml-1 sm:ml-2 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Result */}
        {assignmentResult && (
          <Alert className={`border-2 ${assignmentResult.success ? 'bg-background' : 'bg-background'}`} style={{
            borderColor: assignmentResult.success ? '#10b981' : '#ef4444',
            backgroundColor: assignmentResult.success ? 'color-mix(in srgb, #10b981 8%, var(--background))' : 'color-mix(in srgb, #ef4444 8%, var(--background))'
          }}>
            {assignmentResult.success ? (
              <CheckCircle className="h-4 w-4" style={{color: '#059669'}} />
            ) : (
              <AlertCircle className="h-4 w-4" style={{color: '#dc2626'}} />
            )}
            <AlertDescription className="text-sm sm:text-base" style={{
              color: assignmentResult.success ? '#065f46' : '#7f1d1d'
            }}>
              {assignmentResult.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Selection Summary */}
      {(assignmentData.selectedUsers.length > 0 || assignmentData.selectedRoles.length > 0 || assignmentData.selectedStores.length > 0) && (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Selection Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="font-medium text-xs sm:text-sm text-card-foreground">
                    Selected Users ({assignmentData.selectedUsers.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignmentData.selectedUsers.slice(0, 3).map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-border">
                        {user.name}
                      </Badge>
                    ) : null;
                  })}
                  {assignmentData.selectedUsers.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      +{assignmentData.selectedUsers.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="font-medium text-xs sm:text-sm text-card-foreground">
                    Selected Roles ({assignmentData.selectedRoles.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignmentData.selectedRoles.slice(0, 3).map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return role ? (
                      <Badge key={roleId} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-border">
                        {role.name}
                      </Badge>
                    ) : null;
                  })}
                  {assignmentData.selectedRoles.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      +{assignmentData.selectedRoles.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="font-medium text-xs sm:text-sm text-card-foreground">
                    Selected Stores ({assignmentData.selectedStores.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignmentData.selectedStores.slice(0, 3).map(storeId => {
                    const store = stores.find(s => s.id === storeId);
                    return store ? (
                      <Badge key={storeId} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-border">
                        {store.name}
                      </Badge>
                    ) : null;
                  })}
                  {assignmentData.selectedStores.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
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
      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-md">
          <TabsTrigger 
            value="users" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Users ({assignmentData.selectedUsers.length})</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Roles ({assignmentData.selectedRoles.length})</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stores" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <Store className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Stores ({assignmentData.selectedStores.length})</span>
            <span className="sm:hidden">Stores</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Select Users
                </CardTitle>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-8 sm:pl-10 text-xs sm:text-sm bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <Select value={userFilter} onValueChange={(value: any) => setUserFilter(value)}>
                      <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm bg-background border-input text-foreground">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="all" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                          All Users
                        </SelectItem>
                        <SelectItem value="with-roles" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                          With Roles
                        </SelectItem>
                        <SelectItem value="without-roles" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                          Without Roles
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSelectAllUsers}
                      className="text-xs sm:text-sm bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {assignmentData.selectedUsers.length === displayUsers.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 p-3 sm:p-6">
              {usersError ? (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    Error loading users: {usersError}
                  </AlertDescription>
                </Alert>
              ) : usersLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">Loading users...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {displayUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-2 sm:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        assignmentData.selectedUsers.includes(user.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          checked={assignmentData.selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                        />
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-medium text-primary">
                            {getInitials(user.name)}
                          </div>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-xs sm:text-sm text-card-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.slice(0, 2).map((role) => (
                                <Badge key={role.id} variant="outline" className="text-xs border-border text-muted-foreground">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No roles</span>
                            )}
                            {user.roles && user.roles.length > 2 && (
                              <Badge variant="outline" className="text-xs border-border text-muted-foreground">
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
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Select Roles
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="pl-8 sm:pl-10 text-xs sm:text-sm bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSelectAllRoles}
                    className="text-xs sm:text-sm bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {assignmentData.selectedRoles.length === displayRoles.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 p-3 sm:p-6">
              {rolesError ? (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    Error loading roles: {rolesError}
                  </AlertDescription>
                </Alert>
              ) : rolesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">Loading roles...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {displayRoles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-2 sm:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        assignmentData.selectedRoles.includes(role.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleRoleToggle(role.id)}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          checked={assignmentData.selectedRoles.includes(role.id)}
                          onChange={() => handleRoleToggle(role.id)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            <p className="font-medium text-xs sm:text-sm text-card-foreground truncate">{role.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            Guard: {role.guard_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            Created: {formatDate(role.created_at)}
                          </p>
                          {role.permissions && role.permissions.length > 0 && (
                            <div className="mt-1 sm:mt-2">
                              <span className="text-xs text-muted-foreground">
                                {role.permissions.length} permissions
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {displayRoles.length === 0 && (
                    <div className="col-span-full text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                      No roles found.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Select Stores
                </CardTitle>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search stores..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        className="pl-8 sm:pl-10 text-xs sm:text-sm bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <Select value={storeFilter} onValueChange={(value: any) => setStoreFilter(value)}>
                      <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm bg-background border-input text-foreground">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="all" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                          All Stores
                        </SelectItem>
                        <SelectItem value="active" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                          Active
                        </SelectItem>
                        <SelectItem value="inactive" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSelectAllStores}
                    className="text-xs sm:text-sm bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {assignmentData.selectedStores.length === displayStores.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 p-3 sm:p-6">
              {storesError ? (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    Error loading stores: {storesError}
                  </AlertDescription>
                </Alert>
              ) : storesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading stores...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {displayStores.map((store) => (
                    <div
                      key={store.id}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md bg-card ${
                        assignmentData.selectedStores.includes(store.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => handleStoreToggle(store.id)}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          checked={assignmentData.selectedStores.includes(store.id)}
                          onChange={() => handleStoreToggle(store.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <Store className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                            <p className="font-medium text-sm sm:text-base text-card-foreground truncate">{store.name}</p>
                            <Badge
                              variant={store.is_active ? 'default' : 'secondary'}
                              className="text-xs flex-shrink-0"
                            >
                              {store.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-mono truncate">
                            {store.id}
                          </p>
                          {store.metadata.address && (
                            <p className="text-xs text-muted-foreground mt-1 truncate" title={store.metadata.address}>
                              {store.metadata.address}
                            </p>
                          )}
                          {store.metadata.phone && (
                            <p className="text-xs text-muted-foreground truncate">
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