import React, { useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown,
  ChevronRight,
  Crown,
  UserCheck,
  Shield,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoleTreeNode, Role } from '@/features/storeHierarchy/types';

interface RoleNodeProps {
  node: RoleTreeNode;
  level: number;
  onToggleExpand: (nodeId: number) => void;
  onSelectRole: (role: Role) => void;
  expandedNodes: Set<number>;
  selectedRoleId?: number;
  searchTerm: string;
}

export const RoleNode: React.FC<RoleNodeProps> = React.memo(({
  node,
  level,
  onToggleExpand,
  onSelectRole,
  expandedNodes,
  selectedRoleId,
  searchTerm
}) => {
  // Memoized computed values
  const computedValues = useMemo(() => ({
    isExpanded: expandedNodes.has(node.role.id),
    hasChildren: node.children && node.children.length > 0,
    isSelected: selectedRoleId === node.role.id,
    isHighlighted: searchTerm && 
      node.role.name.toLowerCase().includes(searchTerm.toLowerCase()),
    indentWidth: level * 24
  }), [
    expandedNodes, 
    node.role.id, 
    node.children, 
    selectedRoleId, 
    searchTerm, 
    node.role.name, 
    level
  ]);

  const { isExpanded, hasChildren, isSelected, isHighlighted, indentWidth } = computedValues;

  // Memoized event handlers
  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node.role.id);
  }, [onToggleExpand, node.role.id]);

  const handleSelectRole = useCallback(() => {
    onSelectRole(node.role);
  }, [onSelectRole, node.role]);

  // Memoized className computations
  const nodeClassName = useMemo(() => cn(
    "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer",
    isSelected 
      ? "bg-primary/10 border-primary shadow-sm" 
      : "hover:bg-muted/50 border-transparent",
    isHighlighted && "ring-2 ring-yellow-400/50 bg-yellow-50"
  ), [isSelected, isHighlighted]);

  const iconContainerClassName = useMemo(() => cn(
    "p-1.5 rounded-md",
    level === 0 ? "bg-yellow-100" : level === 1 ? "bg-blue-100" : "bg-gray-100"
  ), [level]);

  const iconClassName = useMemo(() => cn(
    "h-4 w-4",
    level === 0 ? "text-yellow-600" : level === 1 ? "text-blue-600" : "text-gray-600"
  ), [level]);

  const titleClassName = useMemo(() => cn(
    "font-medium truncate",
    isSelected ? "text-primary" : "text-foreground"
  ), [isSelected]);

  return (
    <div className="space-y-1">
      {/* Role Node */}
      <div 
        className={nodeClassName}
        style={{ marginLeft: `${indentWidth}px` }}
        onClick={handleSelectRole}
      >
        {/* Expand/Collapse Button */}
        <div className="flex-shrink-0">
          {hasChildren ? (
            <Button
              onClick={handleToggleExpand}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-primary/10"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="h-6 w-6" />
          )}
        </div>

        {/* Role Icon */}
        <div className={iconContainerClassName}>
          {level === 0 ? (
            <Crown className="h-4 w-4 text-yellow-600" />
          ) : (
            <UserCheck className={iconClassName} />
          )}
        </div>

        {/* Role Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className={titleClassName}>
              {node.role.name}
            </h4>
            <Badge 
              variant="default"
              className="text-xs"
            >
              Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            No description
          </p>
        </div>

        {/* Permissions Count */}
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>{node.role.permissions?.length || 0}</span>
        </div>

        {/* Children Count */}
        {hasChildren && (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{node.children!.length}</span>
          </div>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="space-y-1">
          {node.children!.map((child) => (
            <RoleNode
              key={child.role.id}
              node={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
              onSelectRole={onSelectRole}
              expandedNodes={expandedNodes}
              selectedRoleId={selectedRoleId}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// Add display name for better debugging
RoleNode.displayName = 'RoleNode';

export default RoleNode;
