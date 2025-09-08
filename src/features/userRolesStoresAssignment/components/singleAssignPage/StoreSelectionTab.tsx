import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Filter, Store as StoreIcon } from 'lucide-react';
import { useStores } from '@/features/stores/hooks/useStores';

interface StoreSelectionTabProps {
  selectedStoreId: string | null;
  onStoreSelect: (storeId: string) => void;
}

export const StoreSelectionTab: React.FC<StoreSelectionTabProps> = ({
  selectedStoreId,
  onStoreSelect,
}) => {
  // Internal state for search and filter
  const [storeSearch, setStoreSearch] = useState('');
  const [storeFilter, setStoreFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Handler for filter change
  const handleFilterChange = (value: string) => {
    setStoreFilter(value as 'all' | 'active' | 'inactive');
  };

  // Fetch stores data
  const {
    stores,
    loading: storesLoading,
    error: storesError,
  } = useStores();

  // Filter stores based on search and status
  const displayStores = useMemo(() => {
    let filtered = stores.filter(store =>
      store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      store.id.toLowerCase().includes(storeSearch.toLowerCase())
    );

    switch (storeFilter) {
      case 'active':
        filtered = filtered.filter(store => store.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter(store => !store.is_active);
        break;
    }

    return filtered;
  }, [stores, storeSearch, storeFilter]);

  // Utility function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="text-base sm:text-lg text-[var(--card-foreground)]">
            Select Store
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search stores..."
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
              />
            </div>
            <Select value={storeFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-40 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] text-sm sm:text-base">
                <Filter className="h-4 w-4 mr-2 text-[var(--muted-foreground)]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="all" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">
                  All Stores
                </SelectItem>
                <SelectItem value="active" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {storesError ? (
          <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
            Error loading stores: {storesError}
          </div>
        ) : storesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
            <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">
              Loading stores...
            </span>
          </div>
        ) : (
          <RadioGroup
            value={selectedStoreId?.toString() || ''}
            onValueChange={onStoreSelect}
            className="space-y-3 sm:space-y-4"
          >
            {displayStores.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                {storeSearch ? 'No stores found matching your search' : 'No stores found'}
              </div>
            ) : (
              displayStores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                  <RadioGroupItem value={store.id.toString()} id={`store-${store.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                  <Label htmlFor={`store-${store.id}`} className="flex-1 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                          <StoreIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">
                            {store.name}
                          </div>
                          <div className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate">
                            ID: {store.id}
                          </div>
                          <div className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate">
                            {store.metadata.address}
                          </div>
                          <div className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate">
                            {store.metadata.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                        <Badge
                          variant={store.is_active ? 'default' : 'secondary'}
                          className={`text-xs ${
                            store.is_active
                              ? 'bg-[#16a34a] text-white'
                              : 'bg-[var(--secondary)] text-[var(--secondary-foreground)]'
                          }`}
                        >
                          {store.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {formatDate(store.created_at)}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))
            )}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};