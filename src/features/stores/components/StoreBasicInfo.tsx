/**
 * StoreBasicInfo Component
 * Displays store's basic information including ID, name, and status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Hash } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  is_active: boolean;
  metadata?: {
    address?: string;
    phone?: string;
  };
  created_at: string;
  updated_at: string;
}

interface StoreBasicInfoProps {
  store: Store;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-[#d1fae5] text-[#064e3b] border-[#a7f3d0] dark:bg-[#064e3b] dark:text-[#d1fae5] dark:border-[#065f46]';
    case 'inactive':
      return 'bg-[#fecaca] text-[#7f1d1d] border-[#fca5a5] dark:bg-[#7f1d1d] dark:text-[#fecaca] dark:border-[#991b1b]';
    case 'pending':
      return 'bg-[#fef3c7] text-[#92400e] border-[#fde68a] dark:bg-[#92400e] dark:text-[#fef3c7] dark:border-[#b45309]';
    default:
      return 'bg-secondary text-secondary-foreground border-border';
  }
};

export const StoreBasicInfo: React.FC<StoreBasicInfoProps> = ({ store }) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Basic Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Store ID</span>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="font-mono text-xs sm:text-sm break-all">{store.id}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Name</span>
          <span className="font-medium text-sm sm:text-base break-words">{store.name}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Status</span>
          <Badge className={`text-xs sm:text-sm ${getStatusColor(store.is_active ? 'active' : 'inactive')}`}>
            {store.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
