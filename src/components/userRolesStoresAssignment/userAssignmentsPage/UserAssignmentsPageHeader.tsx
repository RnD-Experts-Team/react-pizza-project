import React from 'react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { ArrowLeft, Plus } from 'lucide-react';

interface UserAssignmentsPageHeaderProps {
  userId: string;
  onBack: () => void;
  onAssignRole: () => void;
}

export const UserAssignmentsPageHeader: React.FC<UserAssignmentsPageHeaderProps> = ({
  userId,
  onBack,
  onAssignRole,
}) => {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 self-start">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-col space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">User Role Assignments</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              View all role assignments for User ID: {userId}
            </p>
          </div>
        </div>
        <Button onClick={onAssignRole} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Assign Role</span>
        </Button>
      </div>

      <Separator />
    </>
  );
};

export default UserAssignmentsPageHeader;