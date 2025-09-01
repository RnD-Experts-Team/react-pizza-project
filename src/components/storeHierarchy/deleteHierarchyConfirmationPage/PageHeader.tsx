import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PageHeaderProps {
  storeId: string;
  onBack: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  storeId,
  onBack,
  onRefresh,
  loading
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button onClick={onBack} variant="outline" size="sm" className="hover:bg-accent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Hierarchy</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            <span>Delete Hierarchy Confirmation</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Select hierarchy relationships to delete for store: <span className="font-mono">{storeId}</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
          className="hover:bg-accent text-sm sm:text-base"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          <span className="hidden sm:inline">Refresh</span>
          <span className="sm:hidden">Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;