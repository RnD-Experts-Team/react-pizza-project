import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

interface ValidateHierarchyHeaderProps {
  storeId: string;
  hierarchiesCount: number;
  onBack: () => void;
}

const ValidateHierarchyHeader: React.FC<ValidateHierarchyHeaderProps> = ({
  storeId,
  hierarchiesCount,
  onBack
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-accent">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center space-x-2">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
          <span>Validate Hierarchy</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Check if a role hierarchy exists for store: <span className="font-mono">{storeId}</span>
          {hierarchiesCount > 0 && (
            <span className="ml-2 text-sm text-green-600">
              ({hierarchiesCount} existing hierarchies loaded)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ValidateHierarchyHeader;