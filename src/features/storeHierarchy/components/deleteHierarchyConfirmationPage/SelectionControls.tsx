import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

interface SelectionControlsProps {
  totalCount: number;
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (selected: boolean) => void;
  onDeleteSelected: () => void;
  isDeleting: boolean;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  totalCount,
  selectedCount,
  allSelected,
  someSelected,
  onSelectAll,
  onDeleteSelected,
  isDeleting
}) => {
  if (totalCount === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) (el as any).indeterminate = someSelected;
              }}
              onCheckedChange={onSelectAll}
            />
            <div>
              <h3 className="font-medium text-sm sm:text-base">Select Hierarchies</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {selectedCount} of {totalCount} selected
              </p>
            </div>
          </div>
          
          <Button
            onClick={onDeleteSelected}
            variant="destructive"
            size="sm"
            disabled={selectedCount === 0 || isDeleting}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Delete Selected ({selectedCount})</span>
            <span className="sm:hidden">Delete ({selectedCount})</span>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SelectionControls;