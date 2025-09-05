/**
 * Store Hierarchy Detail Page
 * 
 * Displays the role hierarchy tree for a specific store with interactive features.
 * Shows roles, permissions, and hierarchical relationships in a beautiful tree view.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHierarchyTree } from '@/features/storeHierarchy/hooks/UseRoleHierarchy';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Link, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import {
  RoleNode,
  RoleDetailPanel,
  HierarchyTreeHeader,
  EmptyHierarchyState,
  EmptyRoleDetailState
} from '@/features/storeHierarchy/components/storeHierarchyDetailPage';
import type { RoleTreeNode, Role } from '@/features/storeHierarchy/types';

/**
 * Extracted helper function to get all node IDs from a tree structure
 * This function recursively traverses the tree and collects all role IDs
 */
const getAllNodeIds = (nodes: RoleTreeNode[]): Set<number> => {
  const allNodeIds = new Set<number>();

  const collectNodeIds = (nodes: RoleTreeNode[]) => {
    nodes.forEach(node => {
      allNodeIds.add(node.role.id);
      if (node.children) {
        collectNodeIds(node.children);
      }
    });
  };

  collectNodeIds(nodes);
  return allNodeIds;
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

  // Memoize rootIds calculation to avoid recalculation on every render
  const rootIds = useMemo(() => {
    return hierarchyTree?.map((node: RoleTreeNode) => node.role.id) || [];
  }, [hierarchyTree]);

  // Auto-expand root nodes on load
  useEffect(() => {
    if (hierarchyTree && hierarchyTree.length > 0) {
      setExpandedNodes(new Set(rootIds));
    }
  }, [hierarchyTree, rootIds]);

  // Memoized callback to prevent unnecessary re-renders of child components
  const handleToggleExpand = useCallback((nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Memoized callback for role selection
  const handleSelectRole = useCallback((role: Role) => {
    setSelectedRole(role);
  }, []);

  // Simplified handleExpandAll using extracted helper function
  const handleExpandAll = useCallback(() => {
    if (hierarchyTree && treeUtilities) {
      const allNodeIds = getAllNodeIds(hierarchyTree);
      setExpandedNodes(allNodeIds);
    }
  }, [hierarchyTree, treeUtilities]);

  // Memoized callback for collapsing all nodes
  const handleCollapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

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

  const secondaryButtons = (
    <>
      <Button
        onClick={() => navigate(`/stores-hierarchy/create/${storeId}`)}
        variant="outline"
        size="sm"
        className="hover:bg-accent text-xs sm:text-sm"
        aria-label="Create new hierarchy for this store"
      >
        <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Create Hierarchy</span>
        <span className="sm:hidden">Create</span>
      </Button>
      <Button
        onClick={() => navigate(`/stores-hierarchy/delete/${storeId}`)}
        variant="outline"
        size="sm"
        className="hover:bg-accent text-xs sm:text-sm"
        aria-label="Remove hierarchy for this store"
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Remove Hierarchy</span>
        <span className="sm:hidden">Remove</span>
      </Button>
      <Button
        onClick={() => navigate(`/stores-hierarchy/validate/${storeId}`)}
        variant="outline"
        size="sm"
        className="hover:bg-accent text-xs sm:text-sm"
        aria-label="Validate hierarchy for this store"
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
        aria-label="Refresh hierarchy data"
      >
        <RefreshCw className={cn("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2", loading && "animate-spin")} />
        <span className="hidden sm:inline">Refresh</span>
        <span className="sm:hidden">↻</span>
      </Button>
    </>
  );

  return (
    <ManageLayout
      title="Store Hierarchy"
      subtitle={`Role hierarchy for store: ${storeId}`}
      backButton={{
        show: true,
      }}
      subButtons={secondaryButtons}
    >
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
            <HierarchyTreeHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
            />
            
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
                <EmptyHierarchyState
                  onCreateHierarchy={() => navigate(`/stores-hierarchy/create/${storeId}`)}
                />
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
            <EmptyRoleDetailState />
          )}
        </div>
      </div>
    </ManageLayout>
  );
};

export default StoreHierarchyDetailPage;
