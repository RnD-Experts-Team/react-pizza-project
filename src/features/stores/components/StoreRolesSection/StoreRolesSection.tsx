/**
 * StoreRolesSection Component
 * Displays user role assignments for a specific store in a table format
 */
import React, { useEffect, useCallback, useMemo } from 'react';
import { useAssignmentData } from '@/features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { AssignmentsTable } from '@/features/stores/components/StoreRolesSection/AssignmentsTable';
import { LoadingSkeleton } from '@/features/stores/components/StoreRolesSection/LoadingSkeleton';
import { EmptyState } from '@/features/stores/components/StoreRolesSection/EmptyState';

interface StoreRolesSectionProps {
  storeId: string;
}

export const StoreRolesSection: React.FC<StoreRolesSectionProps> = ({
  storeId,
}) => {
  // Use the assignment data hook to get store assignments
  const { 
    getStoreAssignments, 
    fetchStoreAssignments, 
    isLoadingStoreAssignments, 
    getStoreAssignmentsError 
  } = useAssignmentData();

  // Get assignments for this store
  const assignments = getStoreAssignments(storeId);
  const loading = isLoadingStoreAssignments();
  const error = getStoreAssignmentsError();

  // Fetch assignments when component mounts or storeId changes
  useEffect(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

  // Memoize the retry handler
  const handleRetry = useCallback(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

  // Memoize the assignments count
  const assignmentsCount = useMemo(() => assignments.length, [assignments.length]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
            <CardTitle className="text-base sm:text-lg lg:text-xl">Store Role Assignments</CardTitle>
            <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs sm:text-sm">
              {assignmentsCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        {error && (
          <Alert variant="destructive" className="mb-3 sm:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="text-sm">Failed to load role assignments: {error.message}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="sm:ml-4 h-8 text-xs sm:text-sm w-full sm:w-auto"
              >
                <RefreshCw className="mr-1 sm:mr-2 h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {loading && <LoadingSkeleton />}
        
        {!loading && !error && assignmentsCount === 0 && <EmptyState />}
        
        {!loading && !error && assignmentsCount > 0 && (
          <div className="rounded-md border border-border bg-card">
            <AssignmentsTable assignments={assignments} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreRolesSection;
