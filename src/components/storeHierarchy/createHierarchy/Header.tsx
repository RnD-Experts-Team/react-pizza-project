import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  storeId: string;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ storeId, onBack }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-accent">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Create Hierarchy</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Create a new role hierarchy for store: <span className="font-mono text-foreground">{storeId}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;