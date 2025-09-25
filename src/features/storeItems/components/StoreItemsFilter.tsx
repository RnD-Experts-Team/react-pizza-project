import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Internal state for pending filters (before apply is clicked)
  const [pendingDate, setPendingDate] = useState<string>(getTodayDate());
  const [pendingItems, setPendingItems] = useState<Set<string>>(new Set());
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');

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
      
      // Log store change with current filter state
      console.log('Store Changed - Filter State:', {
        newStore: {
          id: currentStore.id,
          name: currentStore.name
        },
        currentFilters: {
          selectedDate: selectedDate,
          selectedItems: Array.from(selectedItems),
          searchTerm: searchTerm
        },
        pendingFilters: {
          pendingDate: pendingDate,
          pendingItems: Array.from(pendingItems),
          pendingSearchTerm: pendingSearchTerm
        }
      });
    }
  }, [currentStore?.id, fetchItems, selectedDate, selectedItems, searchTerm, pendingDate, pendingItems, pendingSearchTerm]);

  // Set first item as selected by default when items are loaded
  useEffect(() => {
    if (items.length > 0 && pendingItems.size === 0) {
      const firstItemId = items[0].item_id;
      setPendingItems(new Set([firstItemId]));
    }
  }, [items, pendingItems.size]);

  // Auto-apply filters when defaults are set (first load)
  useEffect(() => {
    if (items.length > 0 && pendingItems.size > 0 && selectedItems.size === 0) {
      // Auto-apply the default filters
      setSelectedDate(pendingDate);
      setSelectedItems(pendingItems);
      setSearchTerm(pendingSearchTerm);
      
      // Log current filters
      const selectedItemsArray = Array.from(pendingItems);
      const selectedItemsData = items.filter(item => selectedItemsArray.includes(item.item_id));
      
      console.log('Auto-applied Filter State:', {
        selectedDate: pendingDate,
        selectedItems: selectedItemsData,
        selectedItemIds: selectedItemsArray
      });

      // Call optional callback if provided
      if (onFilterChange) {
        onFilterChange({
          date: pendingDate,
          selectedItems: selectedItemsArray
        });
      }
    }
  }, [items, pendingItems, pendingDate, pendingSearchTerm, selectedItems.size, onFilterChange]);

  // Filter items based on search term (use pending search term for display)
  const filteredItems = React.useMemo(() => {
    if (!pendingSearchTerm) return items;
    return filterItems({ searchTerm: pendingSearchTerm });
  }, [items, pendingSearchTerm, filterItems]);

  // Handle date change (update pending state)
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setPendingDate(newDate);
  };

  // Handle item selection (update pending state)
  const handleItemToggle = useCallback((itemId: string) => {
    setPendingItems(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      return newSelection;
    });
  }, []);

  // Handle select all (update pending state)
  const handleSelectAll = useCallback(() => {
    let newSelection: Set<string>;
    if (pendingItems.size === filteredItems.length) {
      // Deselect all
      newSelection = new Set();
    } else {
      // Select all filtered items
      newSelection = new Set(filteredItems.map(item => item.item_id));
    }
    setPendingItems(newSelection);
  }, [pendingItems.size, filteredItems]);

  // Clear selection (update pending state)
  const handleClearSelection = useCallback(() => {
    const newSelection = new Set<string>();
    setPendingItems(newSelection);
  }, []);

  // Apply filters - this is when we actually update the applied state and trigger logging
  const handleApplyFilters = useCallback(() => {
    setSelectedDate(pendingDate);
    setSelectedItems(pendingItems);
    setSearchTerm(pendingSearchTerm);
    
    // Log current filters
    const selectedItemsArray = Array.from(pendingItems);
    const selectedItemsData = items.filter(item => selectedItemsArray.includes(item.item_id));
    
    console.log('Filter State:', {
      selectedDate: pendingDate,
      selectedItems: selectedItemsData,
      selectedItemIds: selectedItemsArray
    });

    // Call optional callback if provided
    if (onFilterChange) {
      onFilterChange({
        date: pendingDate,
        selectedItems: selectedItemsArray
      });
    }
  }, [pendingDate, pendingItems, pendingSearchTerm, items, onFilterChange]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setPendingDate('');
    setPendingItems(new Set());
    setPendingSearchTerm('');
    setSelectedDate('');
    setSelectedItems(new Set());
    setSearchTerm('');
  }, []);

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
      <CardHeader 
        className="px-3 py-3 sm:px-4 md:px-6 sm:py-4 md:py-6 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={toggleCollapse}
      >
        <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm sm:text-base md:text-lg text-card-foreground">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="truncate">Store Items Filter - {currentStore.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(selectedDate || selectedItems.size > 0) && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full whitespace-nowrap">
                Active
              </span>
            )}
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="px-3 py-3 sm:px-4 md:px-6 sm:pb-4 md:pb-6 space-y-4 sm:space-y-6">
        {/* Date Selection Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
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
            value={pendingDate}
            onChange={handleDateChange}
            className="w-full bg-background border-border text-foreground focus:ring-ring focus:border-ring text-sm sm:text-base"
            placeholder="Select a date"
          />
          {pendingDate && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Selected: {new Date(pendingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Items Selection Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-sm font-medium text-foreground">Store Items</h4>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {pendingItems.size} of {filteredItems.length} selected
            </span>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search items..."
                value={pendingSearchTerm}
                onChange={(e) => setPendingSearchTerm(e.target.value)}
                className="w-full text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleSelectAll}
                className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring whitespace-nowrap"
              >
                {pendingItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
              {pendingItems.size > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="border border-border rounded-lg">
            {isLoading ? (
              <div className="flex flex-col sm:flex-row items-center justify-center py-6 sm:py-8 gap-2">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                <span className="text-xs sm:text-sm text-muted-foreground text-center">Loading items...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground px-4">
                {searchTerm ? 'No items match your search.' : 'No items available for this store.'}
              </div>
            ) : (
              <div className="space-y-1 max-h-48 sm:max-h-64 overflow-y-auto p-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.item_id}
                    className="flex items-center p-2 sm:p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`item-${item.item_id}`}
                      checked={pendingItems.has(item.item_id)}
                      onChange={() => handleItemToggle(item.item_id)}
                      className="h-4 w-4 text-primary focus:ring-ring border-border rounded flex-shrink-0"
                    />
                    <label
                      htmlFor={`item-${item.item_id}`}
                      className="ml-2 sm:ml-3 flex-1 cursor-pointer min-w-0"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {item.menu_item_name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          ID: {item.item_id}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Apply and Reset Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <button
              onClick={handleApplyFilters}
              className="w-full sm:flex-1 px-4 py-2 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring font-medium text-sm sm:text-base"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Summary Section */}
        {(selectedDate || selectedItems.size > 0) && (
          <div className="p-3 sm:p-4 border border-border rounded-lg bg-accent/50">
            <h5 className="text-sm font-medium text-foreground mb-2">Applied Filters:</h5>
            <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
              {selectedDate && (
                <p className="break-words">Date: {new Date(selectedDate).toLocaleDateString('en-US', {
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
      )}
    </Card>
  );
};

export default StoreItemsFilter;