import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRoles } from '@/features/roles/hooks/useRoles';
import type { GetRolesParams } from '@/features/roles/types';



interface RoleSelectionTabProps {
  selectedRoleId: number | null;
  onRoleSelect: (roleId: string) => void;
}

export const RoleSelectionTab: React.FC<RoleSelectionTabProps> = ({
  selectedRoleId,
  onRoleSelect,
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

  // Use roles directly from API (no client-side filtering needed)
  const displayRoles = roles;

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
            Select Role
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
                placeholder="Search roles..."
                value={roleSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
              />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {rolesError ? (
          <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
            Error loading roles: {rolesError}
          </div>
        ) : rolesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
            <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">
              Loading roles...
            </span>
          </div>
        ) : (
          <RadioGroup
            value={selectedRoleId?.toString() || ''}
            onValueChange={onRoleSelect}
            className="space-y-3 sm:space-y-4"
          >
            {displayRoles.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                {roleSearch ? 'No roles found matching your search' : 'No roles found'}
              </div>
            ) : (
              displayRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                  <RadioGroupItem value={role.id.toString()} id={`role-${role.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                  <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">
                            {role.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {formatDate(role.created_at)}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))
            )}
          </RadioGroup>
        )}
        
        {/* Pagination Controls */}
        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-3 border-t border-[var(--border)] bg-[var(--card)]/50">
            {/* Left: Per page selector */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[var(--muted-foreground)]">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={handlePerPageChange}
                disabled={rolesLoading}
              >
                <SelectTrigger className="w-16 h-8 text-xs bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                  <SelectItem value="5" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">5</SelectItem>
                  <SelectItem value="10" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">10</SelectItem>
                  <SelectItem value="25" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">25</SelectItem>
                  <SelectItem value="50" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">50</SelectItem>
                  <SelectItem value="100" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-[var(--muted-foreground)]">per page</span>
            </div>

            {/* Center: Page navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={rolesLoading || currentPage <= 1}
                className="h-8 px-3 text-xs bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>

              <span className="text-xs sm:text-sm px-3 text-[var(--foreground)] font-medium">
                Page {currentPage} of {pagination.lastPage || 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={rolesLoading || currentPage >= (pagination.lastPage || 1)}
                className="h-8 px-3 text-xs bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            {/* Right: Results info */}
            <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              <span className="hidden sm:inline">
                {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} roles
              </span>
              <span className="sm:hidden">
                {pagination.from || 0}-{pagination.to || 0} of {pagination.total || 0}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};