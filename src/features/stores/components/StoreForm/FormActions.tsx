import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { buttonClasses } from '@/features/stores/utils/StoreFormUtils';

interface FormActionsProps {
  mode: 'create' | 'edit';
  loading: boolean;
  isSubmitting: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  mode,
  loading,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-border">
      <Button
        type="button"
        variant="outline"
        onClick={() => window.history.back()}
        disabled={loading || isSubmitting}
        className={`w-full sm:w-auto order-2 sm:order-1 ${buttonClasses.responsive} border-border hover:bg-accent hover:text-accent-foreground`}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading || isSubmitting}
        className={`w-full sm:w-auto order-1 sm:order-2 ${buttonClasses.responsive} bg-primary hover:bg-primary/90 text-primary-foreground`}
      >
        {(loading || isSubmitting) && (
          <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
        )}
        {mode === 'create' ? 'Create Store' : 'Update Store'}
      </Button>
    </div>
  );
};
