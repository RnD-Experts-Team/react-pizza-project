import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Filter, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUsers } from '@/features/users/hooks/useUsers';




interface BulkUserSelectionTabProps {
  selectedUserIds: number[];
  onUserToggle: (userId: number) => void;
  onSelectAllUsers: () => void;
}


export const BulkUserSelectionTab: React.FC<BulkUserSelectionTabProps> = ({
  selectedUserIds,
  onUserToggle,
}) => {
  // Internal state for search and filters
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'with-roles' | 'without-roles'>('all');


  // Fetch users data with pagination
  const {
    users,
    loading: usersLoading,
    error: usersError,
    pagination,
    fetchUsers,
    perPage,
    setPerPage,
  } = useUsers();


  // Filter users based on search and filters
  const displayUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    );


    switch (userFilter) {
      case 'with-roles':
        filtered = filtered.filter(user => user.roles && user.roles.length > 0);
        break;
      case 'without-roles':
        filtered = filtered.filter(user => !user.roles || user.roles.length === 0);
        break;
    }


    return filtered;
  }, [users, userSearch, userFilter]);


  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination handlers
  const handlePageChange = useCallback(async (page: number) => {
    try {
      await fetchUsers({ page, per_page: perPage });
    } catch (error) {
      console.error('Failed to fetch users for page:', page, error);
    }
  }, [fetchUsers, perPage]);


  const handlePerPageChange = useCallback(async (newPerPage: string) => {
    const perPageNum = parseInt(newPerPage, 10);
    setPerPage(perPageNum);
    try {
      await fetchUsers({ page: 1, per_page: perPageNum });
    } catch (error) {
      console.error('Failed to fetch users with new per page:', perPageNum, error);
    }
  }, [setPerPage, fetchUsers]);

  // Selection logic based on current page users
  const allDisplayUsersSelected = displayUsers.length > 0 && displayUsers.every(user => selectedUserIds.includes(user.id));
  const someDisplayUsersSelected = displayUsers.some(user => selectedUserIds.includes(user.id)) && !allDisplayUsersSelected;

  // Handle selection logic for current page users
  const handleSelectAllCurrentPage = useCallback(() => {
    const currentPageUserIds = displayUsers.map(user => user.id);
    
    if (allDisplayUsersSelected) {
      // Deselect all current page users
      currentPageUserIds.forEach(userId => {
        if (selectedUserIds.includes(userId)) {
          onUserToggle(userId);
        }
      });
    } else {
      // Select all current page users
      currentPageUserIds.forEach(userId => {
        if (!selectedUserIds.includes(userId)) {
          onUserToggle(userId);
        }
      });
    }
  }, [displayUsers, allDisplayUsersSelected, selectedUserIds, onUserToggle]);

  // Pagination info
  const paginationInfo = useMemo(() => {
    if (!pagination) return null;
    return {
      currentPage: pagination.currentPage || 1,
      lastPage: pagination.lastPage || 1,
      from: pagination.from || 0,
      to: pagination.to || 0,
      total: pagination.total || 0,
    };
  }, [pagination]);


  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Select Users
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring text-sm sm:text-base"
              />
            </div>
            <Select value={userFilter} onValueChange={(value) => setUserFilter(value as 'all' | 'with-roles' | 'without-roles')}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border text-foreground text-sm sm:text-base">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                  All Users
                </SelectItem>
                <SelectItem value="with-roles" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                  With Roles
                </SelectItem>
                <SelectItem value="without-roles" className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                  Without Roles
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {displayUsers.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              checked={allDisplayUsersSelected}
              ref={(el) => {
                if (el) (el as any).indeterminate = someDisplayUsersSelected;
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
              {allDisplayUsersSelected ? 'Deselect All' : 'Select All'} ({displayUsers.length})
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {usersError ? (
          <div className="text-destructive text-center py-4 text-sm sm:text-base">
            Error loading users: {usersError}
          </div>
        ) : usersLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm sm:text-base text-muted-foreground">
              Loading users...
            </span>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayUsers.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                {userSearch ? 'No users found matching your search' : 'No users found'}
              </div>
            ) : (
              displayUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => onUserToggle(user.id)}
                    className="border-border"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => onUserToggle(user.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-medium">
                          {getInitials(user.name)}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-card-foreground truncate">
                            {user.name}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.slice(0, 2).map((role: any, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                                {role.name || role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                              No roles
                            </Badge>
                          )}
                          {user.roles && user.roles.length > 2 && (
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                              +{user.roles.length - 2}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(user.created_at)}
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
        {paginationInfo && paginationInfo.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-3 border-t border-border bg-card/50">
            {/* Left: Per page selector */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={handlePerPageChange}
                disabled={usersLoading}
              >
                <SelectTrigger className="w-16 h-8 text-xs bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {[5, 10, 15, 25, 50].map(option => (
                    <SelectItem key={option} value={option.toString()} className="text-popover-foreground focus:bg-accent focus:text-accent-foreground">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">per page</span>
            </div>


            {/* Center: Page navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                disabled={usersLoading || paginationInfo.currentPage <= 1}
                className="h-8 px-3 text-xs bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>


              <span className="text-xs sm:text-sm px-3 text-foreground font-medium">
                Page {paginationInfo.currentPage} of {paginationInfo.lastPage}
              </span>


              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                disabled={usersLoading || paginationInfo.currentPage >= paginationInfo.lastPage}
                className="h-8 px-3 text-xs bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>


            {/* Right: Results info */}
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">
                {paginationInfo.from} to {paginationInfo.to} of {paginationInfo.total} users
              </span>
              <span className="sm:hidden">
                {paginationInfo.from}-{paginationInfo.to} of {paginationInfo.total}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
