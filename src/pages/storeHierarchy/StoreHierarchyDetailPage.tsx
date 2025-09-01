/**
 * Store Hierarchy Detail Page
 * 
 * Displays the role hierarchy tree for a specific store with interactive features.
 * Shows roles, permissions, and hierarchical relationships in a beautiful tree view.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHierarchyTree } from '../../features/storeHierarchy/hooks/UseRoleHierarchy';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import {
  RoleNode,
  RoleDetailPanel,
  HierarchyTreeHeader,
  PageHeader,
  EmptyHierarchyState,
  EmptyRoleDetailState
} from '../../components/storeHierarchy/storeHierarchyDetailPage';
import type { RoleTreeNode, Role } from '../../features/storeHierarchy/types';



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
      <PageHeader
        storeId={storeId}
        loading={loading}
        onBack={handleBack}
        onRefresh={() => refetch(storeId!)}
        onCreateHierarchy={() => navigate(`/stores-hierarchy/create/${storeId}`)}
        onDeleteHierarchy={() => navigate(`/stores-hierarchy/delete/${storeId}`)}
        onValidateHierarchy={() => navigate(`/stores-hierarchy/validate/${storeId}`)}
      />

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
    </div>
  );
};

export default StoreHierarchyDetailPage;