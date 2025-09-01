import React from 'react';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 lg:py-10 xl:py-12">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" onClick={onBack} className="p-1.5 sm:p-2">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Edit User
            </h1>
          </div>
        </div>
        <Alert variant="destructive" className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ErrorState;