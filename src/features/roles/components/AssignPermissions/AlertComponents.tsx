import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Alert className="border-primary/20 bg-primary/10">
      <Shield className="h-4 w-4 text-primary" />
      <AlertDescription className="text-primary">{message}</AlertDescription>
    </Alert>
  );
};

interface ErrorAlertProps {
  error: string | null;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert
      variant="destructive"
      className="border-destructive bg-destructive/10"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-destructive-foreground">
        {error}
      </AlertDescription>
    </Alert>
  );
};
