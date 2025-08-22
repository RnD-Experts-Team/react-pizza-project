import React, { useState, useEffect } from 'react';
import { useReduxServiceClientManagement } from '../../hooks/useReduxServiceClientManagement';
import type { ServiceClient, TokenDisplayData } from '../../types/serviceClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../hooks/use-toast';
import { Plus, Server, RotateCcw, Power, Copy, Eye, EyeOff, Calendar } from 'lucide-react';

const ServiceClientManagement: React.FC = () => {
  const { toast } = useToast();
  
  const {
    state: { serviceClients, loading, error, pagination },
    actions: {
      fetchServiceClients,
      createServiceClient,
      rotateServiceToken,
      toggleServiceStatus,
      clearError
    }
  } = useReduxServiceClientManagement();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ServiceClient | null>(null);
  const [tokenData, setTokenData] = useState<TokenDisplayData | null>(null);
  const [showToken, setShowToken] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    is_active: true,
    expires_at: '',
    notes: ''
  });
  const [rotateForm, setRotateForm] = useState({
    expires_at: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchServiceClients({ per_page: perPage, page: currentPage });
  }, [currentPage, perPage]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, clearError, toast]);



  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createServiceClient({
      ...createForm,
      expires_at: createForm.expires_at || null
    });
    
    if (result) {
      setTokenData(result);
      setCreateDialogOpen(false);
      setTokenDialogOpen(true);
      setCreateForm({ name: '', is_active: true, expires_at: '', notes: '' });
      toast({
        title: "Success",
        description: "Service client created successfully!",
      });
    }
  };

  const handleRotateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    const result = await rotateServiceToken(selectedClient.id, rotateForm);
    
    if (result) {
      setTokenData(result);
      setRotateDialogOpen(false);
      setTokenDialogOpen(true);
      setRotateForm({ expires_at: '' });
      setSelectedClient(null);
      toast({
        title: "Success",
        description: "Service token rotated successfully!",
      });
    }
  };

  const handleToggleStatus = async (client: ServiceClient) => {
    const success = await toggleServiceStatus(client.id);
    if (success) {
      toast({
        title: "Success",
        description: `Service client ${client.is_active ? 'deactivated' : 'activated'} successfully!`,
      });
    }
  };

  const openRotateDialog = (client: ServiceClient) => {
    setSelectedClient(client);
    setRotateDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Success",
      description: "Token copied to clipboard!",
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never expires';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !serviceClients.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Client Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage API service clients and their authentication tokens
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Service Client
        </Button>
      </div>



      {/* Service Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Service Clients ({serviceClients.length})
          </CardTitle>
          <CardDescription>
            Manage your API service clients and their access tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceClients.length === 0 ? (
              <div className="text-center py-8">
                <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No service clients found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create your first service client
                </Button>
              </div>
            ) : (
              serviceClients.map((client) => (
                <Card key={client.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <Badge className={getStatusColor(client.is_active)}>
                          {client.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">Token Hash</p>
                          <p className="font-mono text-xs break-all">
                            {client.token_hash.substring(0, 16)}...
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Expires</p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(client.expires_at)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Usage</p>
                          <p>{client.use_count} requests</p>
                          {client.last_used_at && (
                            <p className="text-xs">Last used: {formatDate(client.last_used_at)}</p>
                          )}
                        </div>
                      </div>
                      
                      {client.notes && (
                        <>
                          <Separator className="my-3" />
                          <div>
                            <p className="font-medium text-sm">Notes:</p>
                            <p className="text-sm text-muted-foreground">{client.notes}</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRotateDialog(client)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Rotate Token
                      </Button>
                      <Button
                        variant={client.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(client)}
                      >
                        <Power className="h-4 w-4 mr-1" />
                        {client.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > perPage && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === pagination.last_page}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Service Client Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Service Client</DialogTitle>
            <DialogDescription>
              Create a new API service client with authentication token
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={createForm.name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter service client name"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={createForm.is_active}
                onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            
            <div>
              <Label htmlFor="expires_at">Expires At (Optional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={createForm.expires_at}
                onChange={(e) => setCreateForm(prev => ({ ...prev, expires_at: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={createForm.notes}
                onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter notes about this service client"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Client'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rotate Token Dialog */}
      <Dialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rotate Service Token</DialogTitle>
            <DialogDescription>
              Generate a new token for {selectedClient?.name}. The old token will be invalidated.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRotateSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rotate_expires_at">New Expiration Date</Label>
              <Input
                id="rotate_expires_at"
                type="date"
                value={rotateForm.expires_at}
                onChange={(e) => setRotateForm(prev => ({ ...prev, expires_at: e.target.value }))}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRotateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Rotating...' : 'Rotate Token'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Token Display Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Service Client Token</DialogTitle>
            <DialogDescription>
              Save this token securely. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          
          {tokenData && (
            <div className="space-y-4">
              <div>
                <Label>Service Client</Label>
                <p className="font-semibold">{tokenData.serviceClient.name}</p>
              </div>
              
              <div>
                <Label>Token</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type={showToken ? "text" : "password"}
                    value={tokenData.token}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(tokenData.token)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Store this token securely. You won't be able to retrieve it again.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setTokenDialogOpen(false)}>
              I've Saved the Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceClientManagement;
