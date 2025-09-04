/**
 * Token Display Dialog Component
 * 
 * Features:
 * - Displays service client token in a dialog
 * - Toggle visibility of token
 * - Copy token to clipboard functionality with error handling
 * - Security warning about token storage
 * - Prevents closing until user has viewed or copied the token
 * - Enhanced accessibility with proper ARIA labels
 * - Auto-clear token from memory after timeout for security
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TokenDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  onClose?: () => void;
  autoClearTimeout?: number; // Optional timeout in milliseconds (default: 5 minutes)
}

export const TokenDisplayDialog: React.FC<TokenDisplayDialogProps> = ({
  open,
  onOpenChange,
  token,
  onClose,
  autoClearTimeout = 300000, // 5 minutes default
}) => {
  const { toast } = useToast();
  const [showToken, setShowToken] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [displayToken, setDisplayToken] = useState(token);

  // Auto-clear token from memory after timeout for security
  useEffect(() => {
    if (!open || !displayToken) return;

    const timeoutId = setTimeout(() => {
      setDisplayToken('');
      toast({
        title: "Security Notice",
        description: "Token has been cleared from memory for security.",
        variant: "destructive",
      });
    }, autoClearTimeout);

    return () => clearTimeout(timeoutId);
  }, [open, displayToken, autoClearTimeout, toast]);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) {
      toast({
        title: "Error",
        description: "No token available to copy.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setHasInteracted(true);
      toast({
        title: "Success",
        description: "Token copied to clipboard!",
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setHasInteracted(true);
        toast({
          title: "Success",
          description: "Token copied to clipboard!",
        });
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to copy token. Please copy manually.",
          variant: "destructive",
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }, [toast]);

  const toggleTokenVisibility = useCallback(() => {
    if (!displayToken) {
      toast({
        title: "Error",
        description: "Token is no longer available for viewing.",
        variant: "destructive",
      });
      return;
    }
    
    setShowToken(!showToken);
    setHasInteracted(true);
  }, [displayToken, showToken, toast]);

  const handleClose = useCallback(() => {
    if (!hasInteracted) {
      return; // Prevent closing if user hasn't interacted
    }

    // Reset all state
    setShowToken(false);
    setHasInteracted(false);
    setDisplayToken(token); // Reset token for next time
    onOpenChange(false);
    onClose?.();
  }, [hasInteracted, onOpenChange, onClose, token]);

  // Prevent dialog from closing via backdrop click or escape key if not interacted
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && !hasInteracted) {
      return; // Prevent closing
    }
    if (!open) {
      handleClose();
    }
  }, [hasInteracted, handleClose]);

  const handlePointerDownOutside = useCallback((e: Event) => {
    if (!hasInteracted) {
      e.preventDefault();
    }
  }, [hasInteracted]);

  const handleEscapeKeyDown = useCallback((e: KeyboardEvent) => {
    if (!hasInteracted) {
      e.preventDefault();
    }
  }, [hasInteracted]);

  // Reset display token when dialog opens
  useEffect(() => {
    if (open && !displayToken) {
      setDisplayToken(token);
    }
  }, [open, token, displayToken]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
        aria-describedby="token-warning"
      >
        <DialogHeader>
          <DialogTitle>Service Client Token</DialogTitle>
          <DialogDescription>
            Save this token securely. You won't be able to see it again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="token-input">Token</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="token-input"
                type={showToken ? "text" : "password"}
                value={displayToken}
                readOnly
                className="font-mono text-sm"
                aria-describedby="token-warning"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleTokenVisibility}
                disabled={!displayToken}
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(displayToken)}
                disabled={!displayToken}
                aria-label="Copy token to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div 
            id="token-warning"
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> Store this token securely. You won't be able to retrieve it again.
              {!displayToken && (
                <span className="block mt-1 font-medium text-red-600 dark:text-red-400">
                  Token has been cleared from memory for security.
                </span>
              )}
              {displayToken && !hasInteracted && (
                <span className="block mt-1 font-medium">
                  Please view or copy the token before closing this dialog.
                </span>
              )}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            disabled={!hasInteracted}
            variant={hasInteracted ? "default" : "secondary"}
            aria-describedby={!hasInteracted ? "interaction-required" : undefined}
          >
            I've Saved the Token
          </Button>
          {!hasInteracted && (
            <span 
              id="interaction-required" 
              className="sr-only"
              aria-live="polite"
            >
              You must view or copy the token before you can close this dialog
            </span>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
