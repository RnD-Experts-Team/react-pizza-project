/**
 * Stores Hierarchy Main Page
 * 
 * A simplified page component that provides layout structure for the stores hierarchy.
 * All store table logic has been moved to the StoresTable component.
 */

import React from 'react';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import { StoresTable } from '../../components/storeHierarchy/storeHierarchyPage';

export const StoresHierarchyPage: React.FC = () => {
  return (
    <ManageLayout
      title="Store Hierarchies"
      subtitle="Manage and view role hierarchies across all store locations"
    >
      <StoresTable />
    </ManageLayout>
  );
};

export default StoresHierarchyPage;