import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-destructive">
        Failed to load stores: {error}
      </AlertDescription>
    </Alert>
  );
};
