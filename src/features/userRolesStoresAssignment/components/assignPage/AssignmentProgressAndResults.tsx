// components/AssignmentProgressAndResults.tsx
import React from 'react';
import { BulkProgressIndicator } from '@/features/userRolesStoresAssignment/components/assignPage/BulkProgressIndicator';
import { BulkAssignmentResult } from '@/features/userRolesStoresAssignment/components/assignPage/BulkAssignmentResult';
import { BulkSelectionSummary } from '@/features/userRolesStoresAssignment/components/assignPage/BulkSelectionSummary';
import type { AssignmentData, AssignmentStep } from '@/features/userRolesStoresAssignment/types';

interface AssignmentResult {
  success: boolean;
  message: string;
}

interface AssignmentProgressAndResultsProps {
  assignmentSteps: AssignmentStep[];
  completedSteps: number;
  progressPercentage: number;
  assignmentResult: AssignmentResult | null;
  assignmentData: AssignmentData;
}

export const AssignmentProgressAndResults: React.FC<AssignmentProgressAndResultsProps> = ({
  assignmentSteps,
  completedSteps,
  progressPercentage,
  assignmentResult,
  assignmentData,
}) => {
  const hasSelections = 
    assignmentData.selectedUsers.length > 0 || 
    assignmentData.selectedRoles.length > 0 || 
    assignmentData.selectedStores.length > 0;

  return (
    <>
      {/* Progress Indicator */}
      <BulkProgressIndicator
        assignmentSteps={assignmentSteps}
        completedSteps={completedSteps}
        progressPercentage={progressPercentage}
      />

      {/* Assignment Result */}
      {assignmentResult && (
        <BulkAssignmentResult result={assignmentResult} />
      )}

      {/* Selection Summary */}
      {hasSelections && (
        <BulkSelectionSummary
          assignmentData={assignmentData}
        />
      )}
    </>
  );
};
