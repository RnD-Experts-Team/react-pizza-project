import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsSectionProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  isCreating: boolean;
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  onCancel,
  isSubmitting,
  isCreating,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting || isCreating}
        className="w-full sm:w-auto min-w-[120px]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Rule'
        )}
      </Button>
    </div>
  );
};