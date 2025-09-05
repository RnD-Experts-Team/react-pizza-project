/**
 * StoreUsersSection Component
 * Displays user role assignments for a specific store in a table format
 * Fully responsive with light/dark mode support using CSS custom properties
 */
import React, { useEffect, useCallback, useMemo } from 'react';
import { useAssignmentData } from '@/features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import type { Assignment } from '@/features/userRolesStoresAssignment/types/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';

import { StoreUsersTable } from '@/features/stores/components/StoreUsersSecction/AssignmentsTable';
import { StoreUsersEmptyState } from '@/features/stores/components/StoreUsersSecction/EmptyState';
import { StoreUsersLoadingSkeleton } from '@/features/stores/components/StoreUsersSecction/LoadingSkeleton';

// Constants
const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as const;

interface StoreUsersSectionProps {
  storeId: string;
}

export const StoreUsersSection: React.FC<StoreUsersSectionProps> = React.memo(({
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

  // Memoized callback to prevent unnecessary re-renders
  const fetchStoreAssignmentsCallback = useCallback(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

  // Fetch assignments when component mounts or storeId changes
  useEffect(() => {
    fetchStoreAssignmentsCallback();
  }, [fetchStoreAssignmentsCallback]);

  const handleRetry = useCallback(() => {
    fetchStoreAssignmentsCallback();
  }, [fetchStoreAssignmentsCallback]);

  // Memoized helper functions
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  }, []);

  const formatRole = useCallback((assignment: Assignment) => {
    return assignment.role?.name || `Role ID: ${assignment.role_id}`;
  }, []);

  const getUserInitials = useCallback((userName: string) => {
    return userName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, []);

  // Memoized processed assignments to avoid recalculating on every render
  const processedAssignments = useMemo(() => 
    assignments.map(assignment => ({
      ...assignment,
      formattedDate: formatDate(assignment.created_at),
      formattedRole: formatRole(assignment),
      userInitials: assignment.user?.name ? getUserInitials(assignment.user.name) : null,
      uniqueKey: assignment.id || `${assignment.user_id}-${assignment.role_id}`
    })), [assignments, formatDate, formatRole, getUserInitials]
  );

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Store User Assignments</CardTitle>
            <Badge variant="secondary" className="ml-2 text-xs px-2 py-1 flex-shrink-0">
              {assignments.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
        {error && (
          <Alert variant="destructive" className="mb-3 sm:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm">Failed to load user assignments: {error.message}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="h-8 text-xs self-start sm:self-auto"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loading && <StoreUsersLoadingSkeleton />}
        
        {!loading && !error && assignments.length === 0 && <StoreUsersEmptyState />}
        
        {!loading && !error && assignments.length > 0 && (
          <div className="rounded-md border overflow-hidden">
            <StoreUsersTable assignments={processedAssignments} />
          </div>
        )}
      </CardContent>
    </Card>
  );
});

StoreUsersSection.displayName = 'StoreUsersSection';
export default StoreUsersSection;
