import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export const EmptyRoleDetailState: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
        <Eye className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Select a Role</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          Click on any role in the hierarchy tree to view its details and permissions.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyRoleDetailState;