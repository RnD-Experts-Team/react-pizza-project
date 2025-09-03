import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Crown, UserCheck, Shield, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoleHierarchy } from '@/features/storeHierarchy/types';

interface HierarchyItemProps {
  hierarchy: RoleHierarchy;
  onSelect: (hierarchy: RoleHierarchy, selected: boolean) => void;
  isSelected: boolean;
  isDeleting: boolean;
}

export const HierarchyItem: React.FC<HierarchyItemProps> = ({
  hierarchy,
  onSelect,
  isSelected,
  isDeleting
}) => {
  return (
    <div className={cn(
      "p-3 sm:p-4 border rounded-lg transition-all duration-200",
      isSelected ? "border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30" : "border-border hover:border-accent-foreground/20",
      isDeleting && "opacity-50 pointer-events-none"
    )}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(hierarchy, checked as boolean)}
          disabled={isDeleting}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-3">
          {/* Hierarchy Relationship */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            {/* Higher Role */}
            <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md w-full sm:w-auto">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs sm:text-sm text-blue-900 dark:text-blue-200 truncate">{hierarchy.higher_role?.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">Higher Role (ID: {hierarchy.higher_role?.id})</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center w-full sm:w-auto">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground rotate-180" />
            </div>
            
            {/* Lower Role */}
            <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md w-full sm:w-auto">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs sm:text-sm text-green-900 dark:text-green-200 truncate">{hierarchy.lower_role?.name}</p>
                <p className="text-xs text-green-600 dark:text-green-300">Lower Role (ID: {hierarchy.lower_role?.id})</p>
              </div>
            </div>
          </div>
          
          {/* Hierarchy Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Store ID</label>
              <p className="font-mono text-foreground text-xs sm:text-sm">{hierarchy.store_id}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hierarchy ID</label>
              <p className="font-mono text-foreground text-xs sm:text-sm">{hierarchy.id}</p>
            </div>
          </div>
          
          {/* Role Permissions Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Higher: {hierarchy.higher_role?.permissions?.length || 0} permissions</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Lower: {hierarchy.lower_role?.permissions?.length || 0} permissions</span>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex flex-col items-end space-y-2">
          <Badge variant="default" className="text-xs">
            Active
          </Badge>
          {isSelected && (
            <Badge variant="destructive" className="text-xs">
              <Trash2 className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">To Delete</span>
              <span className="sm:hidden">Delete</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchyItem;