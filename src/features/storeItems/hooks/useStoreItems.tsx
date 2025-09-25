// hooks/usePizzaStoreItems.ts

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import {
  fetchStoreItems,
  clearError,
  clearStoreItems,
  clearAllItems,
  setCurrentStoreId,
  clearStoreCache,
  selectItemsByStore,
  selectCurrentItems,
  selectLoadingState,
  selectIsLoading,
  selectError,
  selectCurrentStoreId,
  selectStoreMetadata,
  selectHasDataForStore,
} from '../store/storeItemsSlice';
import {
  type MenuItem,
  type MenuItemFilter,
  type MenuItemSort,
  type UsePizzaStoreItemsReturn,
  MENU_ITEM_CATEGORIES,
  MENU_ITEM_SORT_FIELDS,
  SORT_DIRECTIONS,
} from '../types';

/**
 * Custom hook for managing pizza store items
 * Provides a clean interface for components to interact with pizza store data
 * @param storeId - Optional store ID to focus on specific store
 */
export const usePizzaStoreItems = (storeId?: string): UsePizzaStoreItemsReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const currentStoreId = useSelector(selectCurrentStoreId);
  const targetStoreId = storeId || currentStoreId;
  const items = useSelector(selectItemsByStore(targetStoreId || ''));
  const currentItems = useSelector(selectCurrentItems);
  const loadingState = useSelector(selectLoadingState);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const storeMetadata = useSelector(selectStoreMetadata(targetStoreId || ''));
  const hasData = useSelector(selectHasDataForStore(targetStoreId || ''));

  /**
   * Fetch items for a specific store
   */
  const fetchItems = useCallback(
    async (fetchStoreId: string, forceRefresh = false): Promise<void> => {
      try {
        await dispatch(
          fetchStoreItems({
            storeId: fetchStoreId,
            forceRefresh,
          })
        ).unwrap();
      } catch (error) {
        // Error is already handled by the slice
        console.error('Failed to fetch store items:', error);
      }
    },
    [dispatch]
  );

  /**
   * Clear current error state
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear items for a specific store
   */
  const handleClearStoreItems = useCallback(
    (clearStoreId: string) => {
      dispatch(clearStoreItems(clearStoreId));
    },
    [dispatch]
  );

  /**
   * Clear all cached items
   */
  const handleClearAllItems = useCallback(() => {
    dispatch(clearAllItems());
  }, [dispatch]);

  /**
   * Set current store ID
   */
  const handleSetCurrentStoreId = useCallback(
    (newStoreId: string | null) => {
      dispatch(setCurrentStoreId(newStoreId));
    },
    [dispatch]
  );

  /**
   * Clear cache for a specific store
   */
  const handleClearStoreCache = useCallback(
    async (cacheStoreId: string): Promise<void> => {
      try {
        await dispatch(clearStoreCache(cacheStoreId)).unwrap();
      } catch (error) {
        console.error('Failed to clear store cache:', error);
      }
    },
    [dispatch]
  );

  /**
   * Categorize menu item based on name patterns
   */
  const categorizeMenuItem = useCallback((item: MenuItem): string => {
    const itemName = item.menu_item_name.toLowerCase();

    if (itemName.includes('deep') && itemName.includes('dish')) {
      return MENU_ITEM_CATEGORIES.DEEP_DISH;
    }
    if (itemName.includes('stuffed') && itemName.includes('crust')) {
      return MENU_ITEM_CATEGORIES.STUFFED_CRUST;
    }
    if (itemName.includes('thin') && itemName.includes('crust')) {
      return MENU_ITEM_CATEGORIES.THIN_CRUST;
    }
    if (itemName.includes('crazy bread') || itemName.includes('breadsticks')) {
      return MENU_ITEM_CATEGORIES.BREADSTICKS;
    }
    if (itemName.includes('wings')) {
      return MENU_ITEM_CATEGORIES.WINGS;
    }
    if (itemName.includes('beverage') || itemName.includes('water') || itemName.includes('dole')) {
      return MENU_ITEM_CATEGORIES.BEVERAGES;
    }
    if (itemName.includes('brownie') || itemName.includes('cookie')) {
      return MENU_ITEM_CATEGORIES.DESSERTS;
    }
    if (itemName.includes('crazy puffs') || itemName.includes('sauce') || itemName.includes('dip')) {
      return MENU_ITEM_CATEGORIES.SIDES;
    }
    if (itemName.includes('fee') || itemName.includes('tip')) {
      return MENU_ITEM_CATEGORIES.FEES;
    }
    if (
      itemName.includes('pizza') ||
      itemName.includes('pepperoni') ||
      itemName.includes('cheese') ||
      itemName.includes('sausage') ||
      itemName.includes('meat')
    ) {
      return MENU_ITEM_CATEGORIES.PIZZA;
    }

    return MENU_ITEM_CATEGORIES.OTHER;
  }, []);

  /**
   * Filter items based on provided criteria
   */
  const filterItems = useCallback(
    (filter: MenuItemFilter): MenuItem[] => {
      let filteredItems = targetStoreId ? items : currentItems;

      if (filter.category) {
        filteredItems = filteredItems.filter(
          item => categorizeMenuItem(item) === filter.category
        );
      }

      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.menu_item_name.toLowerCase().includes(searchTerm) ||
          item.item_id.includes(searchTerm)
        );
      }

      if (filter.availableOnly) {
        // Assuming all items are available by default
        // This can be extended when availability data is added
        filteredItems = filteredItems.filter(() => true);
      }

      return filteredItems;
    },
    [items, currentItems, targetStoreId, categorizeMenuItem]
  );

  /**
   * Sort items based on provided criteria
   */
  const sortItems = useCallback(
    (sort: MenuItemSort): MenuItem[] => {
      const itemsToSort = targetStoreId ? items : currentItems;
      
      return [...itemsToSort].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sort.field) {
          case MENU_ITEM_SORT_FIELDS.NAME:
            aValue = a.menu_item_name.toLowerCase();
            bValue = b.menu_item_name.toLowerCase();
            break;
          case MENU_ITEM_SORT_FIELDS.ID:
            aValue = a.item_id;
            bValue = b.item_id;
            break;
          case MENU_ITEM_SORT_FIELDS.DISPLAY_ORDER:
            // Default display order based on category and name
            aValue = `${categorizeMenuItem(a)}_${a.menu_item_name.toLowerCase()}`;
            bValue = `${categorizeMenuItem(b)}_${b.menu_item_name.toLowerCase()}`;
            break;
          default:
            aValue = a.menu_item_name.toLowerCase();
            bValue = b.menu_item_name.toLowerCase();
        }

        if (sort.direction === SORT_DIRECTIONS.DESC) {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    },
    [items, currentItems, targetStoreId, categorizeMenuItem]
  );

  /**
   * Get filtered and categorized items with enhanced data
   */
  const getEnhancedItems = useCallback(() => {
    const baseItems = targetStoreId ? items : currentItems;
    return baseItems.map(item => ({
      ...item,
      category: categorizeMenuItem(item),
      isAvailable: true, // Can be enhanced with real availability data
    }));
  }, [items, currentItems, targetStoreId, categorizeMenuItem]);

  // Memoized return value
  const returnValue = useMemo((): UsePizzaStoreItemsReturn => ({
    items: targetStoreId ? items : currentItems,
    isLoading,
    error,
    fetchItems,
    clearError: handleClearError,
    filterItems,
    sortItems,
    hasData,
    storeMetadata,
    // Additional helper methods
    clearStoreItems: handleClearStoreItems,
    clearAllItems: handleClearAllItems,
    setCurrentStoreId: handleSetCurrentStoreId,
    clearStoreCache: handleClearStoreCache,
    getEnhancedItems,
    categorizeItem: categorizeMenuItem,
    // State information
    loadingState,
    currentStoreId,
    targetStoreId,
  }), [
    items,
    currentItems,
    targetStoreId,
    isLoading,
    error,
    fetchItems,
    handleClearError,
    filterItems,
    sortItems,
    hasData,
    storeMetadata,
    handleClearStoreItems,
    handleClearAllItems,
    handleSetCurrentStoreId,
    handleClearStoreCache,
    getEnhancedItems,
    categorizeMenuItem,
    loadingState,
    currentStoreId,
  ]);

  return returnValue;
};

/**
 * Hook for getting items from multiple stores
 * Useful for comparison or aggregated views
 */
export const useMultipleStoreItems = (storeIds: string[]) => {
  const dispatch = useDispatch<AppDispatch>();

  const allItems = useMemo(() => {
    return storeIds.reduce((acc, storeId) => {
      const items = useSelector(selectItemsByStore(storeId));
      acc[storeId] = items;
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [storeIds]);

  const fetchMultipleStores = useCallback(
    async (forceRefresh = false): Promise<void> => {
      const promises = storeIds.map(storeId =>
        dispatch(fetchStoreItems({ storeId, forceRefresh })).unwrap()
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to fetch multiple stores:', error);
      }
    },
    [dispatch, storeIds]
  );

  return {
    allItems,
    fetchMultipleStores,
  };
};

export default usePizzaStoreItems;
