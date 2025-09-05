import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';

interface HierarchyTreeHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const HierarchyTreeHeader: React.FC<HierarchyTreeHeaderProps> = React.memo(({
  searchTerm,
  onSearchChange,
  onExpandAll,
  onCollapseAll
}) => {
  return (
    <CardHeader className="pb-3 p-4 sm:p-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-foreground">
          <Users className="h-5 w-5" />
          <span>Role Hierarchy Tree</span>
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Button onClick={onExpandAll} variant="outline" size="sm" className="hover:bg-accent text-xs sm:text-sm">
            <span className="hidden sm:inline">Expand All</span>
            <span className="sm:hidden">Expand</span>
          </Button>
          <Button onClick={onCollapseAll} variant="outline" size="sm" className="hover:bg-accent text-xs sm:text-sm">
            <span className="hidden sm:inline">Collapse All</span>
            <span className="sm:hidden">Collapse</span>
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </CardHeader>
  );
});

// Add display name for debugging purposes
HierarchyTreeHeader.displayName = 'HierarchyTreeHeader';

export default HierarchyTreeHeader;
