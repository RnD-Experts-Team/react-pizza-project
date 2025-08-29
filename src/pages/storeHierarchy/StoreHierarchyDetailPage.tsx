/**
 * Store Hierarchy Detail Page
 * 
 * Displays the role hierarchy tree for a specific store with interactive features.
 * Shows roles, permissions, and hierarchical relationships in a beautiful tree view.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHierarchyTree } from '../../features/storeHierarchy/hooks/UseRoleHierarchy';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';


import { 
  ArrowLeft,
  Search,
  Users,
  Shield,
  ChevronDown,
  ChevronRight,
  Crown,
  UserCheck,
  Building2,
  RefreshCw,
  AlertCircle,
  Eye,
  Trash2,
  CheckCircle,
  Link,

} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { RoleTreeNode, Role } from '../../features/storeHierarchy/types';

interface RoleNodeProps {
  node: RoleTreeNode;
  level: number;
  onToggleExpand: (nodeId: number) => void;
  onSelectRole: (role: Role) => void;
  expandedNodes: Set<number>;
  selectedRoleId?: number;
  searchTerm: string;
}

const RoleNode: React.FC<RoleNodeProps> = ({
  node,
  level,
  onToggleExpand,
  onSelectRole,
  expandedNodes,
  selectedRoleId,
  searchTerm
}) => {
  const isExpanded = expandedNodes.has(node.role.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedRoleId === node.role.id;
  const isHighlighted = searchTerm && 
    node.role.name.toLowerCase().includes(searchTerm.toLowerCase());

  const indentWidth = level * 24;

  return (
    <div className="space-y-1">
      {/* Role Node */}
      <div 
        className={cn(
          "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer",
          isSelected 
            ? "bg-primary/10 border-primary shadow-sm" 
            : "hover:bg-muted/50 border-transparent",
          isHighlighted && "ring-2 ring-yellow-400/50 bg-yellow-50"
        )}
        style={{ marginLeft: `${indentWidth}px` }}
        onClick={() => onSelectRole(node.role)}
      >
        {/* Expand/Collapse Button */}
        <div className="flex-shrink-0">
          {hasChildren ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.role.id);
              }}
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
        <div className={cn(
          "p-1.5 rounded-md",
          level === 0 ? "bg-yellow-100" : level === 1 ? "bg-blue-100" : "bg-gray-100"
        )}>
          {level === 0 ? (
            <Crown className={cn("h-4 w-4", "text-yellow-600")} />
          ) : (
            <UserCheck className={cn(
              "h-4 w-4",
              level === 1 ? "text-blue-600" : "text-gray-600"
            )} />
          )}
        </div>

        {/* Role Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className={cn(
              "font-medium truncate",
              isSelected ? "text-primary" : "text-foreground"
            )}>
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
};




const RoleDetailPanel: React.FC<{ role: Role; onClose: () => void }> = ({ role, onClose }) => {
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

export const StoreHierarchyDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const {
    tree: hierarchyTree,
    isLoading: loading,
    error,
    refetchTree: refetch,
    utils: treeUtilities
  } = useHierarchyTree(storeId!);

  // Auto-expand root nodes on load
  useEffect(() => {
    if (hierarchyTree && hierarchyTree.length > 0) {
      const rootIds = hierarchyTree.map((node: RoleTreeNode) => node.role.id);
      setExpandedNodes(new Set(rootIds));
    }
  }, [hierarchyTree]);

  const handleToggleExpand = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleExpandAll = () => {
    if (hierarchyTree && treeUtilities) {
      const allNodeIds = new Set<number>();
      
      const collectNodeIds = (nodes: RoleTreeNode[]) => {
        nodes.forEach(node => {
          allNodeIds.add(node.role.id);
          if (node.children) {
            collectNodeIds(node.children);
          }
        });
      };
      
      collectNodeIds(hierarchyTree);
      setExpandedNodes(allNodeIds);
    }
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleBack = () => {
    navigate('/stores-hierarchy');
  };

  if (!storeId) {
    return (
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <Alert variant="destructive" className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            Store ID is required to view hierarchy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <Button onClick={handleBack} variant="outline" size="sm" className="hover:bg-accent w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Stores</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center space-x-2 text-foreground">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Store Hierarchy</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Role hierarchy for store: <span className="font-mono text-foreground">{storeId}</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => navigate(`/stores-hierarchy/${storeId}/create-hierarchy`)}
            variant="outline"
            size="sm"
            className="hover:bg-accent text-xs sm:text-sm"
          >
            <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Create Hierarchy</span>
            <span className="sm:hidden">Create</span>
          </Button>
          <Button
            onClick={() => navigate(`/stores-hierarchy/${storeId}/delete-confirmation`)}
            variant="outline"
            size="sm"
            className="hover:bg-accent text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Remove Hierarchy</span>
            <span className="sm:hidden">Remove</span>
          </Button>
          <Button
            onClick={() => navigate(`/stores-hierarchy/${storeId}/validate`)}
            variant="outline"
            size="sm"
            className="hover:bg-accent text-xs sm:text-sm"
          >
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Validate Hierarchy</span>
            <span className="sm:hidden">Validate</span>
          </Button>
          <Button
            onClick={() => refetch(storeId!)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="hover:bg-accent text-xs sm:text-sm"
          >
            <RefreshCw className={cn("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2", loading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">↻</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            {error?.message || 'An error occurred while loading the hierarchy.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Hierarchy Tree */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3 p-4 sm:p-6">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-foreground">
                  <Users className="h-5 w-5" />
                  <span>Role Hierarchy Tree</span>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Button onClick={handleExpandAll} variant="outline" size="sm" className="hover:bg-accent text-xs sm:text-sm">
                    <span className="hidden sm:inline">Expand All</span>
                    <span className="sm:hidden">Expand</span>
                  </Button>
                  <Button onClick={handleCollapseAll} variant="outline" size="sm" className="hover:bg-accent text-xs sm:text-sm">
                    <span className="hidden sm:inline">Collapse All</span>
                    <span className="sm:hidden">Collapse</span>
                  </Button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : hierarchyTree && hierarchyTree.length > 0 ? (
                <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px]">
                  <div className="space-y-2">
                    {hierarchyTree.map((node: RoleTreeNode) => (
                      <RoleNode
                        key={node.role.id}
                        node={node}
                        level={0}
                        onToggleExpand={handleToggleExpand}
                        onSelectRole={handleSelectRole}
                        expandedNodes={expandedNodes}
                        selectedRoleId={selectedRole?.id}
                        searchTerm={searchTerm}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">No hierarchy found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    This store doesn't have any role hierarchy configured yet.
                  </p>
                  <Button 
                    onClick={() => navigate(`/stores-hierarchy/${storeId}/create-hierarchy`)}
                    className="text-sm sm:text-base"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Create Hierarchy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role Details Panel */}
        <div className="space-y-4">
          {selectedRole ? (
            <RoleDetailPanel 
              role={selectedRole} 
              onClose={() => setSelectedRole(null)} 
            />
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                <Eye className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Select a Role</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Click on any role in the hierarchy tree to view its details and permissions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreHierarchyDetailPage;