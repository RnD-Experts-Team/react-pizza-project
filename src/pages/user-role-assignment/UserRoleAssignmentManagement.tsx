import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { useToast } from '../../hooks/use-toast';
import { useReduxUserRoleStoreAssignment } from '../../hooks/useReduxUserRoleStoreAssignment';
import { useUserManagement } from '../../hooks/useReduxUserManagement';
import { useStoreManagement } from '../../hooks/useReduxStoreManagement';
import type { UserRoleStoreAssignment, UserRoleStoreAssignmentFilters } from '../../types/userRoleStoreAssignment';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight, Users, Store, UserCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import AssignUserRoleForm from './components/AssignUserRoleForm';
import BulkAssignmentForm from './components/BulkAssignmentForm';
import AssignmentDetailsDialog from './components/AssignmentDetailsDialog';

const UserRoleAssignmentManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    assignments,
    storeAssignments,
    userAssignments,
    loading,
    error,
    toggleLoading,
    removeLoading,
    fetchStoreAssignments,
    fetchUserAssignments,
    toggleUserRoleStoreStatus,
    removeUserRoleStore,
    filterAssignments,
    clearError,
  } = useReduxUserRoleStoreAssignment();

  const { state: { users, roles }, actions: { fetchUsers, fetchRoles } } = useUserManagement();
  const { state: { stores }, actions: { fetchStores } } = useStoreManagement();

  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<UserRoleStoreAssignmentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<UserRoleStoreAssignment | null>(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'store' && filters.store_id) {
      fetchStoreAssignments(filters.store_id);
    } else if (value === 'user' && filters.user_id) {
      fetchUserAssignments(filters.user_id);
    }
  };

  const handleToggleStatus = async (assignment: UserRoleStoreAssignment) => {
    const result = await toggleUserRoleStoreStatus({
      user_id: assignment.user_id,
      role_id: assignment.role_id,
      store_id: assignment.store_id,
    });

    if (result.success) {
      toast({
        title: 'Success',
        description: `Assignment ${assignment.is_active ? 'deactivated' : 'activated'} successfully`,
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to toggle assignment status',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveAssignment = async (assignment: UserRoleStoreAssignment) => {
    const result = await removeUserRoleStore({
      user_id: assignment.user_id,
      role_id: assignment.role_id,
      store_id: assignment.store_id,
    });

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Assignment removed successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to remove assignment',
        variant: 'destructive',
      });
    }
  };

  const getCurrentAssignments = () => {
    let currentAssignments: UserRoleStoreAssignment[] = [];
    
    switch (activeTab) {
      case 'store':
        currentAssignments = storeAssignments;
        break;
      case 'user':
        currentAssignments = userAssignments;
        break;
      default:
        currentAssignments = assignments;
    }

    return filterAssignments(currentAssignments, { ...filters, search: searchTerm });
  };

  const filteredAssignments = getCurrentAssignments();

  const renderAssignmentRow = (assignment: UserRoleStoreAssignment) => (
    <TableRow key={`${assignment.user_id}-${assignment.role_id}-${assignment.store_id}`}>
      <TableCell>
        <div className="font-medium">{assignment.user?.name}</div>
        <div className="text-sm text-muted-foreground">{assignment.user?.email}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{assignment.role?.name}</Badge>
      </TableCell>
      <TableCell>
        <div className="font-medium">{assignment.store?.name}</div>
        <div className="text-sm text-muted-foreground">{assignment.store_id}</div>
      </TableCell>
      <TableCell>
        <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
          {assignment.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        {assignment.metadata?.start_date && (
          <div className="text-sm">{new Date(assignment.metadata.start_date).toLocaleDateString()}</div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm">{new Date(assignment.created_at || '').toLocaleDateString()}</div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedAssignment(assignment);
                setShowDetailsDialog(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToggleStatus(assignment)}
              disabled={toggleLoading}
            >
              {assignment.is_active ? (
                <ToggleLeft className="mr-2 h-4 w-4" />
              ) : (
                <ToggleRight className="mr-2 h-4 w-4" />
              )}
              {assignment.is_active ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Assignment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this role assignment? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRemoveAssignment(assignment)}
                    disabled={removeLoading}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Role Store Assignments</h1>
          <p className="text-muted-foreground">
            Manage user role assignments across different stores
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkForm} onOpenChange={setShowBulkForm}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Bulk Assign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <BulkAssignmentForm onClose={() => setShowBulkForm(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAssignForm} onOpenChange={setShowAssignForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <AssignUserRoleForm onClose={() => setShowAssignForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Assignments</CardTitle>
          <CardDescription>
            View and manage user role assignments by different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                All Assignments
              </TabsTrigger>
              <TabsTrigger value="store" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                By Store
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                By User
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 py-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              {activeTab === 'store' && (
                <Select
                  value={filters.store_id || ''}
                  onValueChange={(value) => {
                    setFilters({ ...filters, store_id: value });
                    if (value) fetchStoreAssignments(value);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {activeTab === 'user' && (
                <Select
                  value={filters.user_id?.toString() || ''}
                  onValueChange={(value) => {
                    const userId = parseInt(value);
                    setFilters({ ...filters, user_id: userId });
                    if (userId) fetchUserAssignments(userId);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Select
                value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
                onValueChange={(value) => {
                  setFilters({
                    ...filters,
                    is_active: value === 'all' ? undefined : value === 'true',
                  });
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading assignments...
                        </TableCell>
                      </TableRow>
                    ) : filteredAssignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No assignments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssignments.map(renderAssignmentRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="store" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading store assignments...
                        </TableCell>
                      </TableRow>
                    ) : filteredAssignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {filters.store_id ? 'No assignments found for selected store' : 'Select a store to view assignments'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssignments.map(renderAssignmentRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading user assignments...
                        </TableCell>
                      </TableRow>
                    ) : filteredAssignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {filters.user_id ? 'No assignments found for selected user' : 'Select a user to view assignments'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssignments.map(renderAssignmentRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedAssignment && (
        <AssignmentDetailsDialog
          assignment={selectedAssignment}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  );
};

export default UserRoleAssignmentManagement;