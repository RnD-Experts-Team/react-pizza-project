import React from 'react';
import { Button } from '../../ui/button';
import { Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSubmitting,
  onCancel,
}) => {

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-8">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating User...
          </>
        ) : (
          'Update User'
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Cancel
      </Button>
    </div>
  );
};

export default ActionButtons;