import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Shield, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import type { HierarchyTreeNode } from '../../../types/roleHierarchy';

interface HierarchyTreeViewProps {
  treeData: HierarchyTreeNode[];
  onViewRole: (roleId: number) => void;
  loading?: boolean;
}

interface TreeNodeProps {
  node: HierarchyTreeNode;
  level: number;
  onViewRole: (roleId: number) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onViewRole }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = node.children && node.children.length > 0;
  const indentLevel = level * 24;

  return (
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
          style={{ marginLeft: `${indentLevel}px` }}
        >
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          ) : (
            <div className="w-6" /> // Spacer for alignment
          )}
          
          <div className="flex items-center space-x-2 flex-1">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{node.role.name}</span>
            <Badge variant="outline" className="text-xs">
              ID: {node.role.id}
            </Badge>
            
            {node.permissions && node.permissions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {node.permissions.length} permissions
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewRole(node.role.id)}
            className="h-6 px-2"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
        
        {hasChildren && (
          <CollapsibleContent>
            <div className="space-y-1">
              {node.children!.map((child) => (
                <TreeNode
                  key={child.role.id}
                  node={child}
                  level={level + 1}
                  onViewRole={onViewRole}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

const HierarchyTreeView: React.FC<HierarchyTreeViewProps> = ({
  treeData,
  onViewRole,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy Tree</CardTitle>
          <CardDescription>Loading hierarchy structure...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!treeData || treeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy Tree</CardTitle>
          <CardDescription>No hierarchy structure found for this store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Shield className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No Role Hierarchy</p>
            <p className="text-sm text-center">
              Create role hierarchies to see the organizational structure
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTotalRoles = (nodes: HierarchyTreeNode[]): number => {
    return nodes.reduce((total, node) => {
      return total + 1 + (node.children ? getTotalRoles(node.children) : 0);
    }, 0);
  };

  const getTotalPermissions = (nodes: HierarchyTreeNode[]): number => {
    return nodes.reduce((total, node) => {
      const nodePermissions = node.permissions ? node.permissions.length : 0;
      const childPermissions = node.children ? getTotalPermissions(node.children) : 0;
      return total + nodePermissions + childPermissions;
    }, 0);
  };

  const totalRoles = getTotalRoles(treeData);
  const totalPermissions = getTotalPermissions(treeData);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Role Hierarchy Tree</CardTitle>
            <CardDescription>
              Organizational structure showing role relationships and permissions
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline">
              <Shield className="h-3 w-3 mr-1" />
              {totalRoles} roles
            </Badge>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {totalPermissions} permissions
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {treeData.map((rootNode) => (
            <TreeNode
              key={rootNode.role.id}
              node={rootNode}
              level={0}
              onViewRole={onViewRole}
            />
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            <p className="mb-1">
              <strong>Legend:</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-blue-500" />
                <span>Role</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>Permission count</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>View details</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyTreeView;