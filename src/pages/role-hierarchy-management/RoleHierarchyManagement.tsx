import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { useReduxRoleHierarchy } from '../../hooks/useReduxRoleHierarchy';
import { useUserManagement } from '../../hooks/useReduxUserManagement';
import { useStoreManagement } from '../../hooks/useReduxStoreManagement';
import type {  RoleHierarchyFilters } from '../../types/roleHierarchy';
import { Plus, Search, Filter, MoreHorizontal, Edit, GitBranch, Store, TreePine } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';


const RoleHierarchyManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    hierarchies,
    loading,
    error,
    fetchStoreHierarchy,
    fetchStoreHierarchyTree,
    filterHierarchies,
    getHierarchiesByStore,
    clearError,
  } = useReduxRoleHierarchy();

  const { state: { roles }, actions: { fetchRoles } } = useUserManagement();
  const { state: { stores }, actions: { fetchStores } } = useStoreManagement();

  const [activeTab, setActiveTab] = useState('hierarchies');
  const [filters, setFilters] = useState<RoleHierarchyFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  // const [ setSelectedHierarchy] = useState<RoleHierarchy | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // const [ setShowDetailsDialog] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');

  useEffect(() => {
    fetchRoles();
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
    if (value === 'tree' && selectedStoreId) {
      fetchStoreHierarchyTree(selectedStoreId);
    }
  };

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    setFilters({ ...filters, store_id: storeId });
    fetchStoreHierarchy(storeId);
    if (activeTab === 'tree') {
      fetchStoreHierarchyTree(storeId);
    }
  };

  // const handleCreateHierarchy = async (data: CreateRoleHierarchyRequest) => {
  //   const result = await createRoleHierarchy(data);
  //   if (result.success) {
  //     toast({
  //       title: 'Success',
  //       description: 'Role hierarchy created successfully',
  //     });
  //     setShowCreateForm(false);
  //     if (selectedStoreId) {
  //       fetchStoreHierarchy(selectedStoreId);
  //       if (activeTab === 'tree') {
  //         fetchStoreHierarchyTree(selectedStoreId);
  //       }
  //     }
  //   } else {
  //     toast({
  //       title: 'Error',
  //       description: result.error,
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // const handleViewDetails = (hierarchy: RoleHierarchy) => {
  //   setSelectedHierarchy(hierarchy);
  //   setShowDetailsDialog(true);
  // };

  const filteredHierarchies = React.useMemo(() => {
    let filtered = selectedStoreId ? getHierarchiesByStore(selectedStoreId) : hierarchies;
    
    if (searchTerm) {
      filtered = filterHierarchies({ ...filters, search: searchTerm });
    } else {
      filtered = filterHierarchies(filters);
    }
    
    return filtered;
  }, [hierarchies, filters, searchTerm, selectedStoreId, filterHierarchies, getHierarchiesByStore]);

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || `Role ${roleId}`;
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || storeId;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Hierarchy Management</h1>
          <p className="text-muted-foreground">
            Manage role hierarchies and organizational structures across stores
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={!selectedStoreId}>
          <Plus className="mr-2 h-4 w-4" />
          Create Hierarchy
        </Button>
      </div>

      {/* Store Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Selection
          </CardTitle>
          <CardDescription>
            Select a store to view and manage its role hierarchies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="store-select">Store</Label>
              <Select value={selectedStoreId} onValueChange={handleStoreSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedStoreId && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="hierarchies" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Hierarchies
            </TabsTrigger>
            <TabsTrigger value="tree" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              Tree View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchies" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search hierarchies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="higher-role">Higher Role</Label>
                    <Select
                      value={filters.higher_role_id?.toString() || 'all'}
                      onValueChange={(value) => setFilters({ ...filters, higher_role_id: value === 'all' ? undefined : parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lower-role">Lower Role</Label>
                    <Select
                      value={filters.lower_role_id?.toString() || 'all'}
                      onValueChange={(value) => setFilters({ ...filters, lower_role_id: value === 'all' ? undefined : parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={filters.is_active?.toString() || 'all'}
                      onValueChange={(value) => setFilters({ ...filters, is_active: value === 'all' ? undefined : value === 'true' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hierarchies Table */}
            <Card>
              <CardHeader>
                <CardTitle>Role Hierarchies</CardTitle>
                <CardDescription>
                  {filteredHierarchies.length} hierarchy(ies) found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Higher Role</TableHead>
                        <TableHead>Lower Role</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHierarchies.map((hierarchy) => (
                        <TableRow key={hierarchy.id}>
                          <TableCell className="font-medium">
                            {hierarchy.higher_role?.name || getRoleName(hierarchy.higher_role_id)}
                          </TableCell>
                          <TableCell>
                            {hierarchy.lower_role?.name || getRoleName(hierarchy.lower_role_id)}
                          </TableCell>
                          <TableCell>
                            {hierarchy.store?.name || getStoreName(hierarchy.store_id)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(hierarchy.is_active)}
                          </TableCell>
                          <TableCell>
                            {hierarchy.created_at ? new Date(hierarchy.created_at).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem >
                                  <Edit className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredHierarchies.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No hierarchies found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tree" className="space-y-4">
            {/* <HierarchyTreeView
              treeData={hierarchyTree}
              loading={treeLoading}
              onRefresh={() => selectedStoreId && fetchStoreHierarchyTree(selectedStoreId)}
            /> */}
          </TabsContent>
        </Tabs>
      )}

      {/* Create Hierarchy Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Role Hierarchy</DialogTitle>
            <DialogDescription>
              Define a new role hierarchy relationship for {getStoreName(selectedStoreId)}
            </DialogDescription>
          </DialogHeader>
          {/* <CreateHierarchyForm
            storeId={selectedStoreId}
            roles={roles}
            onSubmit={handleCreateHierarchy}
            onCancel={() => setShowCreateForm(false)}
            loading={createLoading}
          /> */}
        </DialogContent>
      </Dialog>

      {/* Hierarchy Details Dialog */}
      {/* <HierarchyDetailsModal
        hierarchy={selectedHierarchy}
        isOpen={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      /> */}
    </div>
  );
};

export default RoleHierarchyManagement;