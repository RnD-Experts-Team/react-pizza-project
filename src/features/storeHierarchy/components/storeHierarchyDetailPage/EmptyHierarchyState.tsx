import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Link } from 'lucide-react';

interface EmptyHierarchyStateProps {
  onCreateHierarchy: () => void;
}

export const EmptyHierarchyState: React.FC<EmptyHierarchyStateProps> = ({ onCreateHierarchy }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">No hierarchy found</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-4">
        This store doesn't have any role hierarchy configured yet.
      </p>
      <Button 
        onClick={onCreateHierarchy}
        className="text-sm sm:text-base"
      >
        <Link className="h-4 w-4 mr-2" />
        Create Hierarchy
      </Button>
    </div>
  );
};

export default EmptyHierarchyState;