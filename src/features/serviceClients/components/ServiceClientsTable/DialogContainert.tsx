import React from 'react';
import { CreateServiceClientDialog } from '@/features/serviceClients/components/Dialogs/CreateServiceClientDialog';
import { RotateTokenDialog } from '@/features/serviceClients/components/Dialogs/RotateTokenDialog';
import { TokenDisplayDialog } from '@/features/serviceClients/components/Dialogs/TokenDisplayDialog';
import type { ServiceClient } from '@/features/serviceClients/types';

interface DialogContainerProps {
  createDialogOpen: boolean;
  rotateDialogOpen: boolean;
  tokenDialogOpen: boolean;
  selectedClient: ServiceClient | null;
  currentToken: string;
  onCreateDialogChange: (open: boolean) => void;
  onRotateDialogChange: (open: boolean) => void;
  onTokenDialogChange: (open: boolean) => void;
  onCreateSuccess: (token: string) => void;
  onRotateSuccess: (token: string) => void;
  onCloseTokenDialog: () => void;
}

export const DialogContainer: React.FC<DialogContainerProps> = ({
  createDialogOpen,
  rotateDialogOpen,
  tokenDialogOpen,
  selectedClient,
  currentToken,
  onCreateDialogChange,
  onRotateDialogChange,
  onTokenDialogChange,
  onCreateSuccess,
  onRotateSuccess,
  onCloseTokenDialog
}) => {
  return (
    <>
      {/* Create Dialog */}
      <CreateServiceClientDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        onSuccess={onCreateSuccess}
      />
      
      {/* Rotate Token Dialog */}
      <RotateTokenDialog
        open={rotateDialogOpen}
        onOpenChange={onRotateDialogChange}
        serviceClient={selectedClient}
        onSuccess={onRotateSuccess}
      />
      
      {/* Token Display Dialog */}
      <TokenDisplayDialog
        open={tokenDialogOpen}
        onOpenChange={onTokenDialogChange}
        token={currentToken}
        onClose={onCloseTokenDialog}
      />
    </>
  );
};
