import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Store as StoreIcon, ChevronLeft, ChevronRight } from 'lucide-react';


import { useStores } from '@/features/stores/hooks/useStores';
import { setPerPage, selectPerPage } from '@/features/stores/store/storesSlice';
import type { AppDispatch } from '@/store';


interface BulkStoreSelectionTabProps {
  selectedStoreIds: string[];
  onStoreToggle: (storeId: string) => void;
  onSelectAllStores: () => void;
}


export const BulkStoreSelectionTab: React.FC<BulkStoreSelectionTabProps> = ({
  selectedStoreIds,
  onStoreToggle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Internal state for search only
  const [storeSearch, setStoreSearch] = useState('');
  
  // Get current per page value from Redux
  const perPage = useSelector(selectPerPage);


  // Fetch stores data with pagination
  const {
    stores,
    pagination,
    loading: storesLoading,
    error: storesError,
    changePage,
    currentPageData,
    refetch,
  } = useStores(true, { search: storeSearch });


  // Since we're using server-side search and pagination, we don't need client-side filtering
  const displayStores = stores;


  // Pagination options
  const perPageOptions = [5, 10, 15, 25, 50];


  // Handle per page change
  const handlePerPageChange = useCallback(async (value: string) => {
    const newPerPage = parseInt(value, 10);
    dispatch(setPerPage(newPerPage));
    
    // Refetch with new per page value
    await refetch({ 
      per_page: newPerPage, 
      page: 1,
      search: storeSearch
    });
  }, [dispatch, refetch, storeSearch]);


  // Handle search with debouncing effect
  const handleSearchChange = useCallback((value: string) => {
    setStoreSearch(value);
    // Reset to first page when searching
    if (pagination && pagination.current_page !== 1) {
      changePage(1);
    }
  }, [pagination, changePage]);


  // Pagination state calculations
  const paginationState = useMemo(() => {
    if (!pagination) {
      return {
        shouldShowPagination: false,
        currentPage: 1,
        isPrevDisabled: true,
        isNextDisabled: true,
      };
    }


    return {
      shouldShowPagination: pagination.last_page > 1,
      currentPage: pagination.current_page,
      isPrevDisabled: pagination.current_page <= 1,
      isNextDisabled: pagination.current_page >= pagination.last_page,
    };
  }, [pagination]);


  // Handle page navigation
  const handlePreviousPage = useCallback(() => {
    if (!paginationState.isPrevDisabled) {
      changePage(paginationState.currentPage - 1);
    }
  }, [paginationState.isPrevDisabled, paginationState.currentPage, changePage]);


  const handleNextPage = useCallback(() => {
    if (!paginationState.isNextDisabled) {
      changePage(paginationState.currentPage + 1);
    }
  }, [paginationState.isNextDisabled, paginationState.currentPage, changePage]);


  // Results text for pagination info
  const resultsText = useMemo(() => {
    if (!currentPageData || currentPageData.total === 0) {
      return 'No stores found';
    }


    const { from, to, total } = currentPageData;
    return (
      <>
        <span className="hidden sm:inline">
          {from} to {to} of {total} stores
        </span>
        <span className="sm:hidden">
          {from}-{to} of {total}
        </span>
      </>
    );
  }, [currentPageData]);


  // Utility function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Selection logic based on current page stores
  const allDisplayStoresSelected = displayStores.length > 0 && displayStores.every(store => selectedStoreIds.includes(store.id));
  const someDisplayStoresSelected = displayStores.some(store => selectedStoreIds.includes(store.id)) && !allDisplayStoresSelected;

  // Handle selection logic for current page stores
  const handleSelectAllCurrentPage = useCallback(() => {
    const currentPageStoreIds = displayStores.map(store => store.id);
    
    if (allDisplayStoresSelected) {
      // Deselect all current page stores
      currentPageStoreIds.forEach(storeId => {
        if (selectedStoreIds.includes(storeId)) {
          onStoreToggle(storeId);
        }
      });
    } else {
      // Select all current page stores
      currentPageStoreIds.forEach(storeId => {
        if (!selectedStoreIds.includes(storeId)) {
          onStoreToggle(storeId);
        }
      });
    }
  }, [displayStores, allDisplayStoresSelected, selectedStoreIds, onStoreToggle]);


  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
            <StoreIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Select Stores
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores..."
              value={storeSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
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
              onCheckedChange={handleSelectAllCurrentPage}
              className="border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllCurrentPage}
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
                          <StoreIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
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
        
        {/* Pagination Controls */}
        {(displayStores.length > 0 || paginationState.shouldShowPagination) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-3 border-t border-border bg-card/50">
            {/* Left: Per page selector */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={handlePerPageChange}
                disabled={storesLoading}
              >
                <SelectTrigger className="w-16 h-8 text-xs bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {perPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()} className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">per page</span>
            </div>


            {/* Center: Page navigation */}
            {paginationState.shouldShowPagination && pagination && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={paginationState.isPrevDisabled || storesLoading}
                  className="h-8 px-3 text-xs bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Prev
                </Button>


                <span className="text-xs sm:text-sm px-3 text-foreground font-medium">
                  Page {paginationState.currentPage} of {pagination.last_page}
                </span>


                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={paginationState.isNextDisabled || storesLoading}
                  className="h-8 px-3 text-xs bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Next
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}


            {/* Right: Results info */}
            <div className="text-xs sm:text-sm text-muted-foreground">
              {resultsText}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
