import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitActionsProps {
  isSubmitting: boolean;
  isLoading: boolean;
  rolesLoading: boolean;
  onCancel: () => void;
}

const SubmitActions: React.FC<SubmitActionsProps> = ({
  isSubmitting,
  isLoading,
  rolesLoading,
  onCancel
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="w-full sm:w-auto text-sm sm:text-base hover:bg-accent"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || isLoading || rolesLoading}
        className="w-full sm:w-auto min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="hidden sm:inline">Creating...</span>
            <span className="sm:hidden">Creating</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Create Hierarchy</span>
            <span className="sm:hidden">Create</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitActions;