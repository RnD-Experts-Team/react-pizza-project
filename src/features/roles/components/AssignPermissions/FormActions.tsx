import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  assignLoading: boolean;
  selectedRole: any;
  selectedPermissionsCount: number;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  assignLoading,
  selectedRole,
  selectedPermissionsCount,
  onCancel,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          assignLoading ||
          !selectedRole ||
          selectedPermissionsCount === 0
        }
        className="w-full sm:w-auto min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Assigning...
          </>
        ) : (
          'Assign Permissions'
        )}
      </Button>
    </div>
  );
};
