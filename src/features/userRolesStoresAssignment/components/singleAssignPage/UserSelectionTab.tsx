import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Filter, ChevronRight } from 'lucide-react';
import { useUsers } from '@/features/users/hooks/useUsers';

interface UserSelectionTabProps {
  selectedUserId: number | null;
  onUserSelect: (userId: string) => void;
}

export const UserSelectionTab: React.FC<UserSelectionTabProps> = ({
  selectedUserId,
  onUserSelect,
}) => {
  // Internal state for search and filter
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'with-roles' | 'without-roles'>('all');

  // Handler for filter change
  const handleFilterChange = (value: string) => {
    setUserFilter(value as 'all' | 'with-roles' | 'without-roles');
  };

  // Fetch users data with pagination
  const {
    users,
    loading: usersLoading,
    error: usersError,
    pagination,
    fetchUsers,
  } = useUsers(true, { per_page: 50 });

  // Filter users based on local filters
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
  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="text-base sm:text-lg text-[var(--card-foreground)]">
            Select User
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
              />
            </div>
            <Select value={userFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-40 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] text-sm sm:text-base">
                <Filter className="h-4 w-4 mr-2 text-[var(--muted-foreground)]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="all" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">
                  All Users
                </SelectItem>
                <SelectItem value="with-roles" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">
                  With Roles
                </SelectItem>
                <SelectItem value="without-roles" className="text-[var(--popover-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]">
                  Without Roles
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {usersError ? (
          <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
            Error loading users: {usersError}
          </div>
        ) : usersLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
            <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">
              Loading users...
            </span>
          </div>
        ) : (
          <RadioGroup
            value={selectedUserId?.toString() || ''}
            onValueChange={onUserSelect}
            className="space-y-3 sm:space-y-4"
          >
            {displayUsers.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                {userSearch ? 'No users found matching your search' : 'No users found'}
              </div>
            ) : (
              <>
                {displayUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                    <RadioGroupItem value={user.id.toString()} id={`user-${user.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                    <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-xs sm:text-sm font-medium text-[var(--primary)] flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">
                              {user.name}
                            </div>
                            <div className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                          <div className="flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.slice(0, 2).map((role) => (
                                <Badge key={role.id} variant="outline" className="text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-[var(--muted-foreground)] text-xs">No roles</span>
                            )}
                            {user.roles && user.roles.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                                +{user.roles.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-[var(--muted-foreground)]">
                            {formatDate(user.created_at)}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
                
                {/* Pagination Controls */}
                {pagination && pagination.currentPage < pagination.lastPage && (
                  <div className="flex justify-center pt-4 sm:pt-6">
                    <Button
                      variant="outline"
                      onClick={() => fetchUsers({ page: pagination.currentPage + 1, per_page: 50 })}
                      disabled={usersLoading}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {usersLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Next Page
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};