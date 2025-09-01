import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import { Avatar } from '../../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Loader2, Search, Filter, Users } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: any[];
  created_at: string;
}

interface BulkUserSelectionTabProps {
  users: User[];
  displayUsers: User[];
  selectedUserIds: number[];
  userSearch: string;
  userFilter: 'all' | 'with-roles' | 'without-roles';
  usersLoading: boolean;
  usersError: string | null;
  onUserToggle: (userId: number) => void;
  onSelectAllUsers: () => void;
  onUserSearchChange: (search: string) => void;
  onUserFilterChange: (filter: 'all' | 'with-roles' | 'without-roles') => void;
  formatDate: (dateString: string) => string;
  getInitials: (name: string) => string;
}

export const BulkUserSelectionTab: React.FC<BulkUserSelectionTabProps> = ({
  displayUsers,
  selectedUserIds,
  userSearch,
  userFilter,
  usersLoading,
  usersError,
  onUserToggle,
  onSelectAllUsers,
  onUserSearchChange,
  onUserFilterChange,
  formatDate,
  getInitials,
}) => {
  const allDisplayUsersSelected = displayUsers.length > 0 && selectedUserIds.length === displayUsers.length;
  const someDisplayUsersSelected = selectedUserIds.length > 0 && selectedUserIds.length < displayUsers.length;

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
                onChange={(e) => onUserSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring text-sm sm:text-base"
              />
            </div>
            <Select value={userFilter} onValueChange={onUserFilterChange}>
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
              onCheckedChange={onSelectAllUsers}
              className="border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAllUsers}
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
      </CardContent>
    </Card>
  );
};