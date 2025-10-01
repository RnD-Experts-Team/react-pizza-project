import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { useCurrentStore } from '@/components/layouts/mainLayout/CurrentStoreContext';
import { useDsprApi } from '../../DSPR/hooks/useCoordinator';
import { SingleDatePicker } from '@/components/ui/singleDatePicker';

interface StoreItemsFilterProps {
  className?: string;
  onFilterChange?: (filters: { date: string; selectedItems: string[] }) => void;
  onError?: (error: string | null) => void;
}

export const StoreItemsFilter: React.FC<StoreItemsFilterProps> = ({
  className = '',
  onFilterChange,
  onError,
}) => {
  const { currentStore } = useCurrentStore();

  // Initialize DSPR API hook
  const { fetchData: fetchDsprData } = useDsprApi({
    enableLogging: true,
    autoClearErrors: true,
  });

  // Error state management
  const [, setError] = useState<string | null>(null);

  // Stable error handler to prevent useEffect loops
  const handleError = useCallback(
    (error: string | null) => {
      setError(error);
      if (onError) {
        onError(error);
      }
    },
    [onError],
  );

  const isValidDate = (dateString: string): boolean => {
    if (!dateString) return false;

    // Parse components and build a LOCAL date at midnight
    const [y, m, d] = dateString.split('-').map(Number);
    const selected = new Date(y, m - 1, d); // local midnight (no timezone shift)

    // Today at local midnight
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return selected < today; // strictly before today
  };

  const formatLocalYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getTwoDaysAgoLocal = () => {
    const now = new Date();
    const twoDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 2,
    );
    return formatLocalYmd(twoDaysAgo);
  };

  // For your max (yesterday):
  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const [selectedDate, setSelectedDate] =
    useState<Date | undefined>(new Date(getTwoDaysAgoLocal()));
  const [pendingDate, setPendingDate] = useState<Date | undefined>(new Date(getTwoDaysAgoLocal()));

  // Helper function to send data to DSPR API
  const sendToDsprApi = useCallback(
    async (
      storeId: string,
      date: Date,
      context: string = 'filter-update',
    ) => {
      try {
        if (storeId && date) {
          const dateString = formatLocalYmd(date);
          await fetchDsprData(
            { store: storeId, date: dateString },
            [], // Empty array since no items are selected
          );
          console.log(`[${context}] DSPR API call initiated:`, {
            store: storeId,
            date: dateString,
            itemCount: 0,
            items: [],
          });
          // Clear error on successful API call
          handleError(null);
        }
      } catch (error) {
        const errorMessage = `Failed to fetch store items data: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`[${context}] DSPR API call failed:`, error);
        handleError(errorMessage);
      }
    },
    [fetchDsprData, handleError],
  );

  // Keep latest function without re-render loops
  const sendToDsprApiRef = useRef(sendToDsprApi);
  sendToDsprApiRef.current = sendToDsprApi;

  // Auto-apply filters when defaults are set (first load)
  useEffect(() => {
    if (currentStore?.id && !selectedDate) {
      // Validate the default date before applying
      if (pendingDate && isValidDate(formatLocalYmd(pendingDate))) {
        setSelectedDate(pendingDate);

        if (onFilterChange) {
          onFilterChange({
            date: formatLocalYmd(pendingDate),
            selectedItems: [],
          });
        }
      } else {
        // Handle case where default date is invalid
        const errorMessage =
          'Default date is invalid. Please select a valid date.';
        handleError(errorMessage);
      }
    }
  }, [
    currentStore?.id,
    selectedDate,
    pendingDate,
    onFilterChange,
    handleError,
  ]);

  // Handle store context errors
  useEffect(() => {
    if (!currentStore) {
      handleError('No store selected. Please select a store to continue.');
    } else {
      handleError(null); // Clear error when store is available
    }
  }, [currentStore, handleError]);

  // Handle date change (update pending state)
  const handleDateChange = (date: Date | undefined) => {
    setPendingDate(date);
  };

  // Apply filters - update applied state
  const handleApplyFilters = useCallback(() => {
    // Check if date is invalid and handle it appropriately
    if (pendingDate && !isValidDate(formatLocalYmd(pendingDate))) {
      const errorMessage =
        'Invalid date selected. Please select a date before today.';
      handleError(errorMessage);
      return;
    }

    // Clear any previous errors
    handleError(null);

    setSelectedDate(pendingDate);

    if (onFilterChange && pendingDate) {
      onFilterChange({
        date: formatLocalYmd(pendingDate),
        selectedItems: [],
      });
    }
  }, [pendingDate, onFilterChange, handleError]);

  // Centralized DSPR call ONLY when applied filters change
  useEffect(() => {
    if (currentStore?.id && selectedDate) {
      // Additional validation before making API call
      if (isValidDate(formatLocalYmd(selectedDate))) {
        sendToDsprApiRef.current(
          currentStore.id,
          selectedDate,
          'filters-changed',
        );
      } else {
        // Handle invalid date for API call
        const errorMessage = 'Cannot make API call with invalid date.';
        handleError(errorMessage);
      }
    }
  }, [currentStore?.id, selectedDate, handleError]);

  if (!currentStore) {
    return (
      <Card className={`bg-yellow-50 border-yellow-200 ${className}`}>
        <CardContent className="p-4">
          <p className="text-yellow-800">
            Please select a store to view filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border-border shadow-sm ${className}`}>
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-card-foreground">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <span>Store Items Filter - {currentStore.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-2">
        <div className="flex justify-between w-full items-center gap-3">
          <SingleDatePicker
            value={pendingDate}
            onChange={handleDateChange}
            maxDate={yesterday}
            placeholder="Select date"
            className="w-40 bg-background border-border text-foreground focus:ring-ring focus:border-ring text-sm"
          />
          <button
            onClick={handleApplyFilters}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-medium text-sm ${
              pendingDate && !isValidDate(formatLocalYmd(pendingDate))
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            Apply Filters
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreItemsFilter;
