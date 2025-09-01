import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Loader2, Search, Filter } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: any[];
  created_at: string;
}

interface UserSelectionTabProps {
  users: User[];
  displayUsers: User[];
  selectedUserId: number | null;
  userSearch: string;
  userFilter: 'all' | 'with-roles' | 'without-roles';
  usersLoading: boolean;
  usersError: string | null;
  onUserSelect: (userId: string) => void;
  onUserSearchChange: (search: string) => void;
  onUserFilterChange: (filter: 'all' | 'with-roles' | 'without-roles') => void;
  formatDate: (dateString: string) => string;
  getInitials: (name: string) => string;
}

export const UserSelectionTab: React.FC<UserSelectionTabProps> = ({
  displayUsers,
  selectedUserId,
  userSearch,
  userFilter,
  usersLoading,
  usersError,
  onUserSelect,
  onUserSearchChange,
  onUserFilterChange,
  formatDate,
  getInitials,
}) => {
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
                onChange={(e) => onUserSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
              />
            </div>
            <Select value={userFilter} onValueChange={onUserFilterChange}>
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
              displayUsers.map((user) => (
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
              ))
            )}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};