import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { ScrollArea } from '../../ui/scroll-area';
import { ArrowLeft, Shield } from 'lucide-react';
import type { Role } from '../../../features/storeHierarchy/types';

interface RoleDetailPanelProps {
  role: Role;
  onClose: () => void;
}

export const RoleDetailPanel: React.FC<RoleDetailPanelProps> = ({ role, onClose }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Role Details</CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Role Name</label>
            <p className="text-lg font-semibold">{role.name}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant="default">
                  Active
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role ID</label>
              <p className="text-sm font-mono">{role.id}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Permissions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Permissions ({role.permissions?.length || 0})</span>
            </h4>
          </div>
          
          {role.permissions && role.permissions.length > 0 ? (
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {role.permissions.map((permission) => (
                  <div 
                    key={permission.id}
                    className="p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">{permission.name}</h5>
                      <Badge variant="outline" className="text-xs">
                        {permission.guard_name}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No permissions assigned</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleDetailPanel;