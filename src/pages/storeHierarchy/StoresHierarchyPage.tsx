/**
 * Stores Hierarchy Main Page
 * 
 * A modern, responsive page that displays all stores with hierarchy navigation.
 * Features beautiful UI, search functionality, and direct access to role hierarchies.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../features/stores/hooks/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Calendar,
  Network,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  AlertCircle,
  Store as StoreIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Store } from '../../features/stores/types';

interface StoreCardProps {
  store: Store;
  onViewHierarchy: (storeId: string) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onViewHierarchy }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {store.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-mono">
                {store.id}
              </p>
            </div>
          </div>
          <Badge 
            variant={store.is_active ? "default" : "secondary"}
            className={cn(
              "transition-colors",
              store.is_active 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-gray-100 text-gray-600"
            )}
          >
            {store.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Store Details */}
        <div className="space-y-2">
          {store.metadata.address && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{store.metadata.address}</span>
            </div>
          )}
          
          {store.metadata.phone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{store.metadata.phone}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(store.created_at)}</span>
          </div>
        </div>

        <Separator />
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={() => onViewHierarchy(store.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            size="sm"
          >
            <Network className="h-4 w-4 mr-2" />
            Show Hierarchy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const StoreCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Separator />
      <div className="flex space-x-2">
        <Skeleton className="h-8 flex-1" />
      </div>
    </CardContent>
  </Card>
);

type ViewMode = 'grid' | 'list';

export const StoresHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
  const {
    stores,
    loading,
    error,
    refetch,
    totalStores,
    hasStores,
    isEmpty
  } = useStores(true);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        refetch({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, refetch]);

  // Filter stores based on search and active status
  const filteredStores = useMemo(() => {
    let filtered = stores;
    
    if (searchTerm) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.metadata.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showActiveOnly) {
      filtered = filtered.filter(store => store.is_active);
    }
    
    return filtered;
  }, [stores, searchTerm, showActiveOnly]);

  const handleViewHierarchy = (storeId: string) => {
    navigate(`/stores-hierarchy/${storeId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Store Hierarchies
            </h1>
            <p className="text-muted-foreground">
              Manage and view role hierarchies across all store locations
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
              className="hover:bg-primary/5"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <StoreIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                  <p className="text-2xl font-bold">{totalStores}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                  <p className="text-2xl font-bold">
                    {stores.filter(store => store.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Filtered Results</p>
                  <p className="text-2xl font-bold">{filteredStores.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores by name, ID, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                variant={showActiveOnly ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                Active Only
              </Button>
              
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {Array.from({ length: 6 }).map((_, index) => (
              <StoreCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && isEmpty && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stores found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'No stores have been created yet'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stores Grid/List */}
        {!loading && hasStores && (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onViewHierarchy={handleViewHierarchy}
              />
            ))}
          </div>
        )}

        {/* No Results State */}
        {!loading && hasStores && filteredStores.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matching stores</h3>
              <p className="text-muted-foreground mb-4">
                No stores match your current search and filter criteria
              </p>
              <div className="flex justify-center space-x-2">
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
                <Button onClick={() => setShowActiveOnly(false)} variant="outline">
                  Show All Stores
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoresHierarchyPage;