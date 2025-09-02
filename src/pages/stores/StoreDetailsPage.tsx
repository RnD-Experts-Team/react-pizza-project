/**
 * StoreDetailsPage Component
 * Displays comprehensive store information including users and roles sections
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../features/stores/hooks/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { StoreUsersSection } from '../../components/stores/StoreUsersSection';
import { StoreRolesSection } from '../../components/stores/StoreRolesSection';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import {
  Edit,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Building2,
  Hash,
} from 'lucide-react';


export const StoreDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use the custom hook for store data
  const { store, loading, error } = useStore(id || null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#d1fae5] text-[#064e3b] border-[#a7f3d0] dark:bg-[#064e3b] dark:text-[#d1fae5] dark:border-[#065f46]';
      case 'inactive':
        return 'bg-[#fecaca] text-[#7f1d1d] border-[#fca5a5] dark:bg-[#7f1d1d] dark:text-[#fecaca] dark:border-[#991b1b]';
      case 'pending':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fde68a] dark:bg-[#92400e] dark:text-[#fef3c7] dark:border-[#b45309]';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  const handleEditStore = () => {
    if (id) {
      navigate(`/stores/edit/${id}`);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <Skeleton className="h-5 w-28 sm:h-6 sm:w-32" />
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <Skeleton className="h-5 w-28 sm:h-6 sm:w-32" />
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <ManageLayout
        title="Loading..."
        subtitle="Please wait while we load the store details"
        backButton={{ show: true, to: '/stores' }}
      >
        
          {renderLoadingSkeleton()}
        
      </ManageLayout>
    );
  }

  if (error) {
    return (
      <ManageLayout
        title="Error"
        subtitle="Failed to load store details"
        backButton={{ show: true}}
      >
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              Failed to load store details: {error}
            </AlertDescription>
          </Alert>
        </div>
      </ManageLayout>
    );
  }

  if (!store) {
    return (
      <ManageLayout
        title="Store Not Found"
        subtitle="The store may have been deleted or the ID is invalid"
        backButton={{ show: true }}
      >
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              Store not found. The store may have been deleted or the ID is invalid.
            </AlertDescription>
          </Alert>
        </div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title={store.name}
      subtitle={`Store ID: ${store.id}`}
      backButton={{ show: true }}
      mainButtons={
        <Button onClick={handleEditStore}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Store
        </Button>
      }
      
    >
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Store Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Store ID</span>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="font-mono text-xs sm:text-sm break-all">{store.id}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Name</span>
                <span className="font-medium text-sm sm:text-base break-words">{store.name}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Phone</span>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm break-all">{store.metadata?.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Status</span>
                <Badge className={`text-xs sm:text-sm ${getStatusColor(store.is_active ? 'active' : 'inactive')}`}>
                  {store.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Location & Timestamps */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Location & Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Address</span>
                <div className="flex items-start space-x-1 sm:space-x-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm break-words">
                    {store.metadata?.address || 'No address provided'}
                  </span>
                </div>
              </div>
              
              <Separator className="my-2 sm:my-4" />
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created</span>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm break-words">{formatDate(store.created_at)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Last Updated</span>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm break-words">{formatDate(store.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users and Roles Sections */}
        <div className="space-y-4 sm:space-y-6">
          <StoreUsersSection 
            storeId={store.id}
          />
          
          <StoreRolesSection 
            storeId={store.id}
          />
        </div>
      </div>
    </ManageLayout>
  );
};

export default StoreDetailsPage;