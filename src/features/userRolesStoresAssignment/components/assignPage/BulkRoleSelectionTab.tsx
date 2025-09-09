import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRoles } from '@/features/roles/hooks/useRoles';
import type { GetRolesParams } from '@/features/roles/types';


interface BulkRoleSelectionTabProps {
  selectedRoleIds: number[];
  onRoleToggle: (roleId: number) => void;
  onSelectAllRoles: () => void;
}


export const BulkRoleSelectionTab: React.FC<BulkRoleSelectionTabProps> = ({
  selectedRoleIds,
  onRoleToggle,
}) => {
  // Internal state for search and pagination
  const [roleSearch, setRoleSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);


  // Pagination parameters
  const paginationParams: GetRolesParams = {
    page: currentPage,
    per_page: perPage,
    search: roleSearch || undefined,
  };


  // Fetch roles data with pagination
  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
    pagination,
    fetchRoles,
  } = useRoles(true, paginationParams);


  // Pagination handlers
  const handlePageChange = useCallback(async (newPage: number) => {
    setCurrentPage(newPage);
    await fetchRoles({
      page: newPage,
      per_page: perPage,
      search: roleSearch || undefined,
    });
  }, [fetchRoles, perPage, roleSearch]);


  const handlePerPageChange = useCallback(async (newPerPage: string) => {
    const perPageValue = parseInt(newPerPage, 10);
    setPerPage(perPageValue);
    setCurrentPage(1); // Reset to first page
    await fetchRoles({
      page: 1,
      per_page: perPageValue,
      search: roleSearch || undefined,
    });
  }, [fetchRoles, roleSearch]);


  const handleSearchChange = useCallback(async (searchValue: string) => {
    setRoleSearch(searchValue);
    setCurrentPage(1); // Reset to first page when searching
    await fetchRoles({
      page: 1,
      per_page: perPage,
      search: searchValue || undefined,
    });
  }, [fetchRoles, perPage]);


  const handlePreviousPage = useCallback(() => {
    if (pagination && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, pagination, handlePageChange]);


  const handleNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.lastPage) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, pagination, handlePageChange]);


  // Use roles directly from API (no client-side filtering needed)
  const displayRoles = roles;


  // Utility function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  // Selection logic based on current page roles
  const allDisplayRolesSelected = displayRoles.length > 0 && displayRoles.every(role => selectedRoleIds.includes(role.id));
  const someDisplayRolesSelected = displayRoles.some(role => selectedRoleIds.includes(role.id)) && !allDisplayRolesSelected;


  // Handle selection logic for current page roles
  const handleSelectAllCurrentPage = useCallback(() => {
    const currentPageRoleIds = displayRoles.map(role => role.id);
    
    if (allDisplayRolesSelected) {
      // Deselect all current page roles
      currentPageRoleIds.forEach(roleId => {
        if (selectedRoleIds.includes(roleId)) {
          onRoleToggle(roleId);
        }
      });
    } else {
      // Select all current page roles
      currentPageRoleIds.forEach(roleId => {
        if (!selectedRoleIds.includes(roleId)) {
          onRoleToggle(roleId);
        }
      });
    }
  }, [displayRoles, allDisplayRolesSelected, selectedRoleIds, onRoleToggle]);


  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Select Roles
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={roleSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring text-sm sm:text-base"
            />
          </div>
        </div>
        {displayRoles.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              checked={allDisplayRolesSelected}
              ref={(el) => {
                if (el) (el as any).indeterminate = someDisplayRolesSelected;
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
              {allDisplayRolesSelected ? 'Deselect All' : 'Select All'} ({displayRoles.length})
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {rolesError ? (
          <div className="text-destructive text-center py-4 text-sm sm:text-base">
            Error loading roles: {rolesError}
          </div>
        ) : rolesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm sm:text-base text-muted-foreground">
              Loading roles...
            </span>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayRoles.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                {roleSearch ? 'No roles found matching your search' : 'No roles found'}
              </div>
            ) : (
              displayRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={() => onRoleToggle(role.id)}
                    className="border-border"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => onRoleToggle(role.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-card-foreground truncate">
                            {role.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">


                        <span className="text-xs text-muted-foreground">
                          {formatDate(role.created_at)}
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
      
        {/* Pagination Controls */}
        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-3 border-t border-border bg-card/50">
            {/* Left: Per page selector */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={handlePerPageChange}
                disabled={rolesLoading}
              >
                <SelectTrigger className="w-16 h-8 text-xs bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="5" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">5</SelectItem>
                  <SelectItem value="10" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">10</SelectItem>
                  <SelectItem value="25" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">25</SelectItem>
                  <SelectItem value="50" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">50</SelectItem>
                  <SelectItem value="100" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">per page</span>
            </div>


            {/* Center: Page navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={rolesLoading || currentPage <= 1}
                className="h-8 px-3 text-xs bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>


              <span className="text-xs sm:text-sm px-3 text-foreground font-medium">
                Page {currentPage} of {pagination.lastPage || 1}
              </span>


              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={rolesLoading || currentPage >= (pagination.lastPage || 1)}
                className="h-8 px-3 text-xs bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>


            {/* Right: Results info */}
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">
                {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} roles
              </span>
              <span className="sm:hidden">
                {pagination.from || 0}-{pagination.to || 0} of {pagination.total || 0}
              </span>
            </div>
          </div>
        )}
    </Card>
  );
};
