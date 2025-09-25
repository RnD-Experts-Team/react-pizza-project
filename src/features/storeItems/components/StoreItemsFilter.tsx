import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Filter } from 'lucide-react';
import { useCurrentStore } from '@/components/layouts/mainLayout/CurrentStoreContext';
import { usePizzaStoreItems } from '../hooks/useStoreItems';

interface StoreItemsFilterProps {
  className?: string;
  onFilterChange?: (filters: { date: string; selectedItems: string[] }) => void;
}

export const StoreItemsFilter: React.FC<StoreItemsFilterProps> = ({ 
  className = '',
  onFilterChange 
}) => {
  const { currentStore } = useCurrentStore();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const {
    items,
    isLoading,
    error,
    fetchItems,
    clearError,
    filterItems,
  } = usePizzaStoreItems(currentStore?.id);

  // Fetch items when current store changes
  useEffect(() => {
    if (currentStore?.id) {
      fetchItems(currentStore.id);
    }
  }, [currentStore?.id, fetchItems]);

  // Filter items based on search term
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items;
    return filterItems({ searchTerm });
  }, [items, searchTerm, filterItems]);

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    logCurrentFilters(newDate, selectedItems);
  };

  // Handle item selection
  const handleItemToggle = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      
      logCurrentFilters(selectedDate, newSelection);
      return newSelection;
    });
  }, [selectedDate]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    let newSelection: Set<string>;
    if (selectedItems.size === filteredItems.length) {
      // Deselect all
      newSelection = new Set();
    } else {
      // Select all filtered items
      newSelection = new Set(filteredItems.map(item => item.item_id));
    }
    setSelectedItems(newSelection);
    logCurrentFilters(selectedDate, newSelection);
  }, [selectedItems.size, filteredItems, selectedDate]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    const newSelection = new Set<string>();
    setSelectedItems(newSelection);
    logCurrentFilters(selectedDate, newSelection);
  }, [selectedDate]);

  // Log current filters
  const logCurrentFilters = (date: string, itemsSet: Set<string>) => {
    const selectedItemsArray = Array.from(itemsSet);
    const selectedItemsData = items.filter(item => selectedItemsArray.includes(item.item_id));
    
    console.log('Filter State:', {
      selectedDate: date,
      selectedItems: selectedItemsData,
      selectedItemIds: selectedItemsArray
    });

    // Call optional callback if provided
    if (onFilterChange) {
      onFilterChange({
        date,
        selectedItems: selectedItemsArray
      });
    }
  };

  if (!currentStore) {
    return (
      <Card className={`bg-yellow-50 border-yellow-200 ${className}`}>
        <CardContent className="p-4">
          <p className="text-yellow-800">Please select a store to view filters.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-red-50 border-red-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">Error loading items: {error.message}</p>
            <button
              onClick={clearError}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Dismiss
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border-border shadow-sm ${className}`}>
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Store Items Filter - {currentStore.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6">
        {/* Date Selection Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <label 
              htmlFor="date-input" 
              className="text-sm font-medium text-foreground"
            >
              Select Date
            </label>
          </div>
          <Input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full bg-background border-border text-foreground focus:ring-ring focus:border-ring"
            placeholder="Select a date"
          />
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Items Selection Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Store Items</h4>
            <span className="text-sm text-muted-foreground">
              {selectedItems.size} of {filteredItems.length} selected
            </span>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Clear
              </button>
            )}
          </div>

          {/* Items List */}
          <div className="border border-border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Loading items...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No items match your search.' : 'No items available for this store.'}
              </div>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto p-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.item_id}
                    className="flex items-center p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`item-${item.item_id}`}
                      checked={selectedItems.has(item.item_id)}
                      onChange={() => handleItemToggle(item.item_id)}
                      className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                    />
                    <label
                      htmlFor={`item-${item.item_id}`}
                      className="ml-3 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {item.menu_item_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {item.item_id}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {(selectedDate || selectedItems.size > 0) && (
          <div className="p-4 border border-border rounded-lg bg-accent/50">
            <h5 className="text-sm font-medium text-foreground mb-2">Current Filters:</h5>
            <div className="space-y-1 text-sm text-muted-foreground">
              {selectedDate && (
                <p>Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              )}
              {selectedItems.size > 0 && (
                <p>Items: {selectedItems.size} selected</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreItemsFilter;