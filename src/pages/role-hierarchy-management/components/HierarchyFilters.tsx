import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { X, Search, Filter } from 'lucide-react';
import type { RoleHierarchyFilters } from '../../../types/roleHierarchy';
import type { Role } from '../../../types/authTypes';
import type { Store } from '../../../types/authTypes';

interface HierarchyFiltersProps {
  filters: RoleHierarchyFilters;
  onFiltersChange: (filters: RoleHierarchyFilters) => void;
  roles: Role[];
  stores: Store[];
  onClearFilters: () => void;
  className?: string;
}

const HierarchyFilters: React.FC<HierarchyFiltersProps> = ({
  filters,
  onFiltersChange,
  roles,
  stores,
  onClearFilters,
  className = '',
}) => {
  const handleFilterChange = (key: keyof RoleHierarchyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.search?.trim()) count++;
    if (filters.higher_role_id) count++;
    if (filters.lower_role_id) count++;
    if (filters.store_id) count++;
    if (filters.is_active !== undefined) count++;
    if (filters.created_by?.trim()) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const getRoleName = (roleId: number): string => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : `Role ${roleId}`;
  };

  const getStoreName = (storeId: string): string => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : `Store ${storeId}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by role names, store, or creator..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Role Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="higher-role-filter">Higher Role</Label>
            <Select
              value={filters.higher_role_id?.toString() || 'all'}
              onValueChange={(value) => 
                handleFilterChange('higher_role_id', value === 'all' ? undefined : parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All higher roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All higher roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lower-role-filter">Lower Role</Label>
            <Select
              value={filters.lower_role_id?.toString() || 'all'}
              onValueChange={(value) => 
                handleFilterChange('lower_role_id', value === 'all' ? undefined : parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All lower roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All lower roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Store and Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store-filter">Store</Label>
            <Select
              value={filters.store_id || 'all'}
              onValueChange={(value) => 
                handleFilterChange('store_id', value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filters.is_active?.toString() || 'all'}
              onValueChange={(value) => 
                handleFilterChange('is_active', value === 'all' ? undefined : value === 'true')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Created By Filter */}
        <div className="space-y-2">
          <Label htmlFor="created-by-filter">Created By</Label>
          <Input
            id="created-by-filter"
            placeholder="Filter by creator name..."
            value={filters.created_by || ''}
            onChange={(e) => handleFilterChange('created_by', e.target.value)}
          />
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium text-gray-700">Active Filters:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.search && (
                <Badge variant="outline" className="text-xs">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.higher_role_id && (
                <Badge variant="outline" className="text-xs">
                  Higher: {getRoleName(filters.higher_role_id)}
                  <button
                    onClick={() => handleFilterChange('higher_role_id', undefined)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.lower_role_id && (
                <Badge variant="outline" className="text-xs">
                  Lower: {getRoleName(filters.lower_role_id)}
                  <button
                    onClick={() => handleFilterChange('lower_role_id', undefined)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.store_id && (
                <Badge variant="outline" className="text-xs">
                  Store: {getStoreName(filters.store_id)}
                  <button
                    onClick={() => handleFilterChange('store_id', undefined)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.is_active !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Status: {filters.is_active ? 'Active' : 'Inactive'}
                  <button
                    onClick={() => handleFilterChange('is_active', undefined)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.created_by && (
                <Badge variant="outline" className="text-xs">
                  Creator: "{filters.created_by}"
                  <button
                    onClick={() => handleFilterChange('created_by', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HierarchyFilters;