import React from 'react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  storeId: string;
  onBack: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ storeId, onBack }) => {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-2 self-start sm:self-auto w-fit"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">Store Role Assignments</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            View all role assignments for Store ID: {storeId}
          </p>
        </div>
      </div>

      <Separator />
    </>
  );
};

export default PageHeader;