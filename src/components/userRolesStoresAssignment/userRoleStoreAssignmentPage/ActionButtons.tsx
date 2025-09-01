/**
 * ActionButtons Component
 * 
 * Displays the main action buttons for the User Role Store Assignment page.
 * Includes Assign Roles and Bulk Assign buttons with responsive design.
 */

import React from 'react';
import { Button } from '../../ui/button';
import { Users, ShoppingBag } from 'lucide-react';

interface ActionButtonsProps {
  onAssignRoles: () => void;
  onBulkAssign: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAssignRoles,
  onBulkAssign,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Button 
        onClick={onAssignRoles} 
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
      >
        <Users className="h-4 w-4 sm:h-5 sm:w-5" />
        Assign Roles
      </Button>
      <Button 
        onClick={onBulkAssign} 
        variant="outline" 
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
      >
        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
        Bulk Assign
      </Button>
    </div>
  );
};

export default ActionButtons;