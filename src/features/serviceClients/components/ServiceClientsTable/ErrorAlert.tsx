import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  errors: {
    fetch?: string | null;
    create?: string | null;
    rotate?: string | null;
    toggle?: string | null;
  };
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ errors }) => {
  if (!errors.fetch && !errors.create && !errors.rotate && !errors.toggle) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {errors.fetch || errors.create || errors.rotate || errors.toggle || 'An error occurred'}
      </AlertDescription>
    </Alert>
  );
};
