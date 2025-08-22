import React, { useState } from 'react';
import { useReduxAuthRules } from '../../hooks/useReduxAuthRules';
import type { AuthRuleFormData, TestAuthRuleRequest } from '../../types/authRules';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
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
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
// import { Textarea } from '../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { AlertCircle, Plus, TestTube, ToggleLeft, ToggleRight, Search, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';

const AuthRulesManagement: React.FC = () => {
  const {
    authRules,
    loading,
    error,
    pagination,
    testResult,
    fetchAuthRules,
    createAuthRule,
    testAuthRule,
    toggleRuleStatus,
    clearError,
    clearTestResult,
    refreshRules,
  } = useReduxAuthRules();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [formData, setFormData] = useState<AuthRuleFormData>({
    service: '',
    method: 'GET',
    path_dsl: '',
    route_name: '',
    permissions_any: [],
    permissions_all: [],
    roles_any: [],
    priority: 100,
    is_active: true,
    rule_type: 'path_dsl',
  });
  const [testData, setTestData] = useState<TestAuthRuleRequest>({
    path_dsl: '',
    test_path: '',
  });
  const [permissionInput, setPermissionInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  const handleSearch = () => {
    fetchAuthRules({ search: searchTerm, service: serviceFilter });
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAuthRule(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleTestRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await testAuthRule(testData);
  };

  const resetForm = () => {
    setFormData({
      service: '',
      method: 'GET',
      path_dsl: '',
      route_name: '',
      permissions_any: [],
      permissions_all: [],
      roles_any: [],
      priority: 100,
      is_active: true,
      rule_type: 'path_dsl',
    });
    setPermissionInput('');
    setRoleInput('');
  };

  const addPermission = (type: 'any' | 'all') => {
    if (permissionInput.trim()) {
      const field = type === 'any' ? 'permissions_any' : 'permissions_all';
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], permissionInput.trim()]
      }));
      setPermissionInput('');
    }
  };

  const removePermission = (type: 'any' | 'all', index: number) => {
    const field = type === 'any' ? 'permissions_any' : 'permissions_all';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addRole = () => {
    if (roleInput.trim()) {
      setFormData(prev => ({
        ...prev,
        roles_any: [...prev.roles_any, roleInput.trim()]
      }));
      setRoleInput('');
    }
  };

  const removeRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roles_any: prev.roles_any.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Authorization Rules Management</h1>
          <p className="text-muted-foreground">Manage API authorization rules and permissions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => clearTestResult()}>
                <TestTube className="w-4 h-4 mr-2" />
                Test Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Test Authorization Rule</DialogTitle>
                <DialogDescription>
                  Test if a path matches your DSL pattern
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTestRule} className="space-y-4">
                <div>
                  <Label htmlFor="path_dsl">Path DSL Pattern</Label>
                  <Input
                    id="path_dsl"
                    value={testData.path_dsl}
                    onChange={(e) => setTestData(prev => ({ ...prev, path_dsl: e.target.value }))}
                    placeholder="/orders/{id}/items/*"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="test_path">Test Path</Label>
                  <Input
                    id="test_path"
                    value={testData.test_path}
                    onChange={(e) => setTestData(prev => ({ ...prev, test_path: e.target.value }))}
                    placeholder="/orders/123/items/abc"
                    required
                  />
                </div>
                {testResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Test Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Matches:</span>
                        <Badge variant={testResult.matches ? 'default' : 'destructive'}>
                          {testResult.matches ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Compiled:</span>
                        <Badge variant={testResult.compiled_successfully ? 'default' : 'destructive'}>
                          {testResult.compiled_successfully ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                      <div>
                        <Label>Generated Regex:</Label>
                        <code className="block text-xs bg-muted p-2 rounded mt-1">
                          {testResult.path_regex}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Testing...' : 'Test'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); clearError(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Authorization Rule</DialogTitle>
                <DialogDescription>
                  Create a new authorization rule for API access control
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRule} className="space-y-4">
                <Tabs value={formData.rule_type} onValueChange={(value) => setFormData(prev => ({ ...prev, rule_type: value as 'path_dsl' | 'route_name' }))}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="path_dsl">Path DSL</TabsTrigger>
                    <TabsTrigger value="route_name">Route Name</TabsTrigger>
                  </TabsList>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service">Service</Label>
                      <Input
                        id="service"
                        value={formData.service}
                        onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="method">HTTP Method</Label>
                      <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="path_dsl">
                    <div>
                      <Label htmlFor="path_dsl">Path DSL</Label>
                      <Input
                        id="path_dsl"
                        value={formData.path_dsl}
                        onChange={(e) => setFormData(prev => ({ ...prev, path_dsl: e.target.value }))}
                        placeholder="/api/users/{id}"
                        required={formData.rule_type === 'path_dsl'}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="route_name">
                    <div>
                      <Label htmlFor="route_name">Route Name</Label>
                      <Input
                        id="route_name"
                        value={formData.route_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, route_name: e.target.value }))}
                        placeholder="users.show"
                        required={formData.rule_type === 'route_name'}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4">
                  <div>
                    <Label>Permissions (Any)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={permissionInput}
                        onChange={(e) => setPermissionInput(e.target.value)}
                        placeholder="Enter permission"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPermission('any'))}
                      />
                      <Button type="button" onClick={() => addPermission('any')}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.permissions_any.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removePermission('any', index)}>
                          {permission} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Roles (Any)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value)}
                        placeholder="Enter role"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                      />
                      <Button type="button" onClick={addRole}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.roles_any.map((role, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeRole(index)}>
                          {role} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 100 }))}
                        min="1"
                        max="1000"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Rule'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Authorization Rules</CardTitle>
              <CardDescription>
                Total: {pagination.total} rules
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Input
                placeholder="Filter by service..."
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="w-4 h-4" />
              </Button>
              <Button onClick={refreshRules} variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path/Route</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.service}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.method === 'GET' ? 'default' : rule.method === 'POST' ? 'secondary' : 'destructive'}>
                      {rule.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <code className="text-xs bg-muted p-1 rounded">
                      {rule.path_dsl || rule.route_name || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.permissions_any?.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.roles_any?.map((role, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRuleStatus(rule.id)}
                      disabled={loading}
                    >
                      {rule.is_active ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {authRules.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No authorization rules found
            </div>
          )}
          
          {loading && (
            <div className="text-center py-8">
              Loading...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthRulesManagement;