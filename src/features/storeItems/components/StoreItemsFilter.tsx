import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useCurrentStore } from '@/components/layouts/mainLayout/CurrentStoreContext';
import { usePizzaStoreItems } from '../hooks/useStoreItems';
import { useDsprApi } from '../../DSPR/hooks/useCoordinator';

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

  // Initialize DSPR API hook
  const { fetchData: fetchDsprData, isLoading: isDsprLoading, error: dsprError } = useDsprApi({
    enableLogging: true,
    autoClearErrors: true
  });

  // Get date 2 days prior to current date in YYYY-MM-DD format
  const getTwoDaysAgoDate = () => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    return twoDaysAgo.toISOString().split('T')[0];
  };

  // Date validation function
  const isValidDate = (dateString: string): boolean => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return selectedDate < today;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTwoDaysAgoDate());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Internal state for pending filters (before apply is clicked)
  const [pendingDate, setPendingDate] = useState<string>(getTwoDaysAgoDate());
  const [pendingItems, setPendingItems] = useState<Set<string>>(new Set());
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');

  // Error states
  const [dateValidationError, setDateValidationError] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');

  const {
    items,
    isLoading,
    error,
    fetchItems,
    clearError,
    filterItems,
  } = usePizzaStoreItems(currentStore?.id);

  // Helper function to send data to DSPR API
  const sendToDsprApi = useCallback(async (
    storeId: string,
    date: string,
    itemIds: string[],
    context: string = 'filter-update'
  ) => {
    try {
      setApiError(''); // Clear previous API errors
      if (storeId && date && itemIds.length > 0) {
        await fetchDsprData(
          { store: storeId, date },
          itemIds
        );
        console.log(`[${context}] DSPR API call initiated:`, {
          store: storeId,
          date,
          itemCount: itemIds.length,
          items: itemIds
        });
      }
    } catch (error) {
      console.error(`[${context}] DSPR API call failed:`, error);
      setApiError("Something went wrong. Please verify: 1) The date must be yesterday or earlier, and 2) If you chose yesterday's date the current time must be after 9:30 AM in Columbus, Cincinnati timezone.");
    }
  }, [fetchDsprData]);

  // Keep latest function without re-render loops
  const sendToDsprApiRef = useRef(sendToDsprApi);
  sendToDsprApiRef.current = sendToDsprApi;

  // ===== FIX 1: Fetch items ONLY when the store id changes
  useEffect(() => {
    if (currentStore?.id) {
      // If fetchItems is not memoized inside usePizzaStoreItems, do NOT add it to deps.
      fetchItems(currentStore.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id]);

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
      // Apply the default filters (clone Set to get a new reference)
      setSelectedDate(pendingDate);
      setSelectedItems(new Set(pendingItems));
      setSearchTerm(pendingSearchTerm);

      // Do NOT call DSPR here; centralized effect below will send exactly once.

      // Optional callback
      if (onFilterChange) {
        onFilterChange({
          date: pendingDate,
          selectedItems: Array.from(pendingItems)
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
    
    // Validate date
    if (newDate && !isValidDate(newDate)) {
      setDateValidationError("Date must be yesterday or earlier. Today and future dates are not allowed.");
    } else {
      setDateValidationError('');
    }
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

  // Apply filters - update applied state
  const handleApplyFilters = useCallback(() => {
    // Validate date before applying
    if (pendingDate && !isValidDate(pendingDate)) {
      setDateValidationError("Date must be yesterday or earlier. Today and future dates are not allowed.");
      return;
    }

    setDateValidationError('');
    setApiError(''); // Clear API errors when applying new filters
    setSelectedDate(pendingDate);
    setSelectedItems(new Set(pendingItems)); // CLONE to avoid shared reference
    setSearchTerm(pendingSearchTerm);

    // Optional callback
    if (onFilterChange) {
      onFilterChange({
        date: pendingDate,
        selectedItems: Array.from(pendingItems)
      });
    }
  }, [pendingDate, pendingItems, pendingSearchTerm, onFilterChange]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const defaultDate = getTwoDaysAgoDate();
    setPendingDate(defaultDate);
    setPendingItems(new Set());
    setPendingSearchTerm('');
    setSelectedDate(defaultDate);
    setSelectedItems(new Set());
    setSearchTerm('');
    setDateValidationError('');
    setApiError('');
  }, []);

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // ===== FIX 2: Centralized DSPR call ONLY when applied filters change
  useEffect(() => {
    if (currentStore?.id && selectedDate && selectedItems.size > 0) {
      const selectedItemsArray = Array.from(selectedItems);
      sendToDsprApiRef.current(currentStore.id, selectedDate, selectedItemsArray, 'filters-changed');
    }
  }, [currentStore?.id, selectedDate, selectedItems]);

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
          {/* Error Messages Section */}
          {(dateValidationError || apiError) && (
            <div className="space-y-2">
              {dateValidationError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{dateValidationError}</p>
                </div>
              )}
              {apiError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">API Error:</p>
                    <p>{apiError}</p>
                  </div>
                  <button
                    onClick={() => setApiError('')}
                    className="ml-auto px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex-shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}

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
              max={new Date(Date.now() - 86400000).toISOString().split('T')[0]} // Yesterday's date as max
              className={`w-full bg-background border-border text-foreground focus:ring-ring focus:border-ring text-sm sm:text-base ${
                dateValidationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Select a date"
            />
            {pendingDate && !dateValidationError && (
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
                  {pendingSearchTerm ? 'No items match your search.' : 'No items available for this store.'}
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
                disabled={!!dateValidationError}
                className={`w-full sm:flex-1 px-4 py-2 sm:py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-medium text-sm sm:text-base ${
                  dateValidationError 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
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
