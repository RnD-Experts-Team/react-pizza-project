import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  loading: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  loading,
  onCancel
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 px-4 sm:px-2 lg:px-0 border-t" style={{ borderTopColor: 'var(--border)' }}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || loading}
        className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderColor: 'var(--primary)'
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" style={{ color: 'var(--primary-foreground)' }} />
            <span className="text-sm sm:text-base">Creating...</span>
          </>
        ) : (
          <span className="text-sm sm:text-base">Create User</span>
        )}
      </Button>
    </div>
  );
};

export default FormActions;