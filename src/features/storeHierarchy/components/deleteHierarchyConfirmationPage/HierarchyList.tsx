import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, ArrowLeft } from 'lucide-react';
import { HierarchyItem } from '@/features/storeHierarchy/components/deleteHierarchyConfirmationPage/HierarchyItem';
import type { RoleHierarchy } from '@/features/storeHierarchy/types';

interface HierarchyListProps {
  hierarchies: RoleHierarchy[];
  loading: boolean;
  selectedHierarchies: Set<number>;
  deletingIds: Set<number>;
  onSelectHierarchy: (hierarchy: RoleHierarchy, selected: boolean) => void;
  onBack: () => void;
}

export const HierarchyList: React.FC<HierarchyListProps> = ({
  hierarchies,
  loading,
  selectedHierarchies,
  deletingIds,
  onSelectHierarchy,
  onBack
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-lg sm:text-xl">Store Hierarchy Relationships</span>
          </div>
          <Badge variant="outline" className="text-xs sm:text-sm">{hierarchies.length} items</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-32" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-12 w-32" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : hierarchies.length > 0 ? (
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 sm:space-y-4">
              {hierarchies.map((hierarchy) => (
                <HierarchyItem
                  key={hierarchy.id}
                  hierarchy={hierarchy}
                  onSelect={onSelectHierarchy}
                  isSelected={selectedHierarchies.has(hierarchy.id)}
                  isDeleting={deletingIds.has(hierarchy.id)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No hierarchies found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              This store doesn't have any role hierarchy relationships configured.
            </p>
            <Button onClick={onBack} variant="outline" className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Go Back</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HierarchyList;