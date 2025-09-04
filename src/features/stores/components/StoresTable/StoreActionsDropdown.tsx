import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, MoreHorizontal, TreePine } from 'lucide-react';

interface StoreActionsDropdownProps {
  storeId: string;
  onView: (storeId: string) => void;
  onEdit: (storeId: string) => void;
  onViewHierarchy: (storeId: string) => void;
}

export const StoreActionsDropdown: React.FC<StoreActionsDropdownProps> = ({
  storeId,
  onView,
  onEdit,
  onViewHierarchy,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-muted-foreground bg-transparent hover:bg-muted/50"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] sm:min-w-[160px] bg-popover border border-border shadow-md"
      >
        <DropdownMenuItem
          onClick={() => onView(storeId)}
          className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEdit(storeId)}
          className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span>Edit Store</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onViewHierarchy(storeId)}
          className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <TreePine className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span>View Hierarchy</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
