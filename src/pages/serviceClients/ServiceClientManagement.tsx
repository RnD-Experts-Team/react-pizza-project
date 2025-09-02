// src/pages/serviceClients/ServiceClientManagement.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Server, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useServiceClients } from '../../features/serviceClients/hooks/useServiceClients';
import { RotateTokenDialog } from '../../components/serviceClients/RotateTokenDialog';
import { ServiceClientsTable } from '../../components/serviceClients/ServiceClientsTable';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import type { ServiceClient } from '../../features/serviceClients/types';

const ServiceClientsPage: React.FC = () => {
  const { toast } = useToast();
  const { fetchClients, pagination } = useServiceClients();
  
  // Dialog states
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ServiceClient | null>(null);
  const [currentToken, setCurrentToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchClients({ per_page: perPage, page: currentPage });
  }, [currentPage, fetchClients]);

  const handleCreateSuccess = (token: string) => {
    setCurrentToken(token);
    setTokenDialogOpen(true);
    toast({
      title: "Success",
      description: "Service client created successfully!",
    });
  };

  const handleRotateSuccess = (token: string) => {
    setCurrentToken(token);
    setTokenDialogOpen(true);
    setSelectedClient(null);
    toast({
      title: "Success",
      description: "Service token rotated successfully!",
    });
  };

  const handleRotateToken = (client: ServiceClient) => {
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

  const handleCloseTokenDialog = () => {
    setTokenDialogOpen(false);
    setCurrentToken('');
    setShowToken(false);
  };

  return (
    <ManageLayout
      title="Service Client Management"
      subtitle="Manage API service clients and their authentication tokens"
    >
      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Service Clients
          </CardTitle>
          <CardDescription>
            Manage your API service clients and their access tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceClientsTable 
            onRotateToken={handleRotateToken}
            onCreateSuccess={handleCreateSuccess}
          />
          
          {/* Pagination */}
          {pagination && pagination.total > perPage && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="flex items-center px-2 sm:px-4 text-sm sm:text-base order-first sm:order-none">
                Page {currentPage} of {pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === pagination.last_page}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rotate Token Dialog */}
      <RotateTokenDialog
        open={rotateDialogOpen}
        onOpenChange={setRotateDialogOpen}
        serviceClient={selectedClient}
        onSuccess={handleRotateSuccess}
      />

      {/* Token Display Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={handleCloseTokenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Service Client Token</DialogTitle>
            <DialogDescription>
              Save this token securely. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Token</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type={showToken ? "text" : "password"}
                  value={currentToken}
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
                  onClick={() => copyToClipboard(currentToken)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Store this token securely. You won't be able to retrieve it again.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleCloseTokenDialog}>
              I've Saved the Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ManageLayout>
  );
};

export default ServiceClientsPage;