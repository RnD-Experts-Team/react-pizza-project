import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  userName?: string;
  onBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ userName, onBack }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <Button variant="ghost" onClick={onBack} className="p-1.5 sm:p-2 self-start">
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Edit User
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">
          Update {userName}'s information
        </p>
      </div>
    </div>
  );
};

export default PageHeader;