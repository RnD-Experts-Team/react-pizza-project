import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Store } from '../../types/scheduler.types';

interface StoreSelectionProps {
  selectedStoreId: string | null;
  stores: Store[];
  onStoreChange: (storeId: string) => void;
  getStoreName: (storeId: string) => string;
}

/**
 * StoreSelection Component
 * 
 * Provides store selection functionality for filtering employees
 */
const StoreSelection: React.FC<StoreSelectionProps> = ({
  selectedStoreId,
  stores,
  onStoreChange,
  getStoreName
}) => {
  return (
    <div className="mb-4 flex items-center gap-4 rounded-lg bg-card border border-border p-4 shadow-sm">
      <Label htmlFor="storeSelect" className="text-sm font-medium text-card-foreground whitespace-nowrap">
        Select Store:
      </Label>
      <Select
        value={selectedStoreId || 'all'}
        onValueChange={onStoreChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Stores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stores</SelectItem>
          {stores.map(store => (
            <SelectItem key={store.id} value={store.id}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStoreId && (
        <span className="text-sm text-muted-foreground">
          Showing employees from: <span className="font-medium text-primary">{getStoreName(selectedStoreId)}</span>
        </span>
      )}
    </div>
  );
};

export default StoreSelection;