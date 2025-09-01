import React from 'react';
import { Button } from '../../ui/button';
import { 
  ArrowLeft,
  Building2,
  RefreshCw,
  Link,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PageHeaderProps {
  storeId: string;
  loading: boolean;
  onBack: () => void;
  onRefresh: () => void;
  onCreateHierarchy: () => void;
  onDeleteHierarchy: () => void;
  onValidateHierarchy: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  storeId,
  loading,
  onBack,
  onRefresh,
  onCreateHierarchy,
  onDeleteHierarchy,
  onValidateHierarchy
}) => {
  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <Button onClick={onBack} variant="outline" size="sm" className="hover:bg-accent w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Stores</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center space-x-2 text-foreground">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Store Hierarchy</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Role hierarchy for store: <span className="font-mono text-foreground">{storeId}</span>
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={onCreateHierarchy}
          variant="outline"
          size="sm"
          className="hover:bg-accent text-xs sm:text-sm"
        >
          <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Create Hierarchy</span>
          <span className="sm:hidden">Create</span>
        </Button>
        <Button
          onClick={onDeleteHierarchy}
          variant="outline"
          size="sm"
          className="hover:bg-accent text-xs sm:text-sm"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Remove Hierarchy</span>
          <span className="sm:hidden">Remove</span>
        </Button>
        <Button
          onClick={onValidateHierarchy}
          variant="outline"
          size="sm"
          className="hover:bg-accent text-xs sm:text-sm"
        >
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Validate Hierarchy</span>
          <span className="sm:hidden">Validate</span>
        </Button>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
          className="hover:bg-accent text-xs sm:text-sm"
        >
          <RefreshCw className={cn("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2", loading && "animate-spin")} />
          <span className="hidden sm:inline">Refresh</span>
          <span className="sm:hidden">↻</span>
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;