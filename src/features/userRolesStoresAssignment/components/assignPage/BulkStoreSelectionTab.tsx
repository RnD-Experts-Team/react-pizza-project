import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { Loader2, Search, Store } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  metadata: {
    phone: string;
    address: string;
    [key: string]: any;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BulkStoreSelectionTabProps {
  displayStores: Store[];
  selectedStoreIds: string[];
  storeSearch: string;
  storesLoading: boolean;
  storesError: string | null;
  onStoreToggle: (storeId: string) => void;
  onSelectAllStores: () => void;
  onStoreSearchChange: (search: string) => void;
  formatDate: (dateString: string) => string;
}

export const BulkStoreSelectionTab: React.FC<BulkStoreSelectionTabProps> = ({
  displayStores,
  selectedStoreIds,
  storeSearch,
  storesLoading,
  storesError,
  onStoreToggle,
  onSelectAllStores,
  onStoreSearchChange,
  formatDate,
}) => {
  const allDisplayStoresSelected = displayStores.length > 0 && selectedStoreIds.length === displayStores.length;
  const someDisplayStoresSelected = selectedStoreIds.length > 0 && selectedStoreIds.length < displayStores.length;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Select Stores
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores..."
              value={storeSearch}
              onChange={(e) => onStoreSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring text-sm sm:text-base"
            />
          </div>
        </div>
        {displayStores.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              checked={allDisplayStoresSelected}
              ref={(el) => {
                if (el) (el as any).indeterminate = someDisplayStoresSelected;
              }}
              onCheckedChange={onSelectAllStores}
              className="border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAllStores}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            >
              {allDisplayStoresSelected ? 'Deselect All' : 'Select All'} ({displayStores.length})
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {storesError ? (
          <div className="text-destructive text-center py-4 text-sm sm:text-base">
            Error loading stores: {storesError}
          </div>
        ) : storesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm sm:text-base text-muted-foreground">
              Loading stores...
            </span>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayStores.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                {storeSearch ? 'No stores found matching your search' : 'No stores found'}
              </div>
            ) : (
              displayStores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={selectedStoreIds.includes(store.id)}
                    onCheckedChange={() => onStoreToggle(store.id)}
                    className="border-border"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => onStoreToggle(store.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-card-foreground truncate">
                            {store.name}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground truncate">
                            {store.metadata?.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                        <Badge
                          variant={store.is_active ? 'default' : 'secondary'}
                          className={`text-xs ${
                            store.is_active
                              ? 'bg-green-600 text-white'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {store.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(store.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};