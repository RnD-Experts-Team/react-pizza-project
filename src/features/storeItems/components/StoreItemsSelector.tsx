import React, { useState, useEffect, useCallback } from 'react';
import { useCurrentStore } from '@/components/layouts/mainLayout/CurrentStoreContext';
import { usePizzaStoreItems } from '../hooks/useStoreItems';

interface StoreItemsSelectorProps {
  className?: string;
}

export const StoreItemsSelector: React.FC<StoreItemsSelectorProps> = ({ className = '' }) => {
  const { currentStore } = useCurrentStore();
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

  // Handle item selection
  const handleItemToggle = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      
      // Log selected items to console
      const selectedItemsArray = Array.from(newSelection);
      const selectedItemsData = items.filter(item => selectedItemsArray.includes(item.item_id));
      console.log('Selected Items:', selectedItemsData);
      
      return newSelection;
    });
  }, [items]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === filteredItems.length) {
      // Deselect all
      setSelectedItems(new Set());
      console.log('Selected Items:', []);
    } else {
      // Select all filtered items
      const allItemIds = new Set(filteredItems.map(item => item.item_id));
      setSelectedItems(allItemIds);
      const selectedItemsData = filteredItems;
      console.log('Selected Items:', selectedItemsData);
    }
  }, [selectedItems.size, filteredItems]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedItems(new Set());
    console.log('Selected Items:', []);
  }, []);

  if (!currentStore) {
    return (
      <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <p className="text-yellow-800">Please select a store to view items.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <p className="text-red-800">Error loading items: {error.message}</p>
          <button
            onClick={clearError}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Store Items - {currentStore.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedItems.size} of {filteredItems.length} selected
            </span>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
          </button>
          {selectedItems.size > 0 && (
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading items...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No items match your search.' : 'No items available for this store.'}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.item_id}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  id={`item-${item.item_id}`}
                  checked={selectedItems.has(item.item_id)}
                  onChange={() => handleItemToggle(item.item_id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`item-${item.item_id}`}
                  className="ml-3 flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {item.menu_item_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {item.item_id}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedItems.size > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => {
                const selectedItemsData = items.filter(item => selectedItems.has(item.item_id));
                console.log('Current Selection:', selectedItemsData);
              }}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Log Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreItemsSelector;