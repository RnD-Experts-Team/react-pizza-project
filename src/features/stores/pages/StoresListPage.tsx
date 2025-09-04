/**
 * StoresListPage Component
 * Main page that displays the stores table with create store functionality
 * Simplified to only handle layout and navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StoresTable } from '@/features/stores/components/StoresTable/StoresTable';
import { ManageLayout } from '@/components/layouts/ManageLayout';

export const StoresListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateStore = () => {
    navigate('/stores/create');
  };

  return (
    <ManageLayout
      title="Stores Management"
      subtitle="Manage your store locations and settings"
    >
      <StoresTable onCreateStore={handleCreateStore} />
    </ManageLayout>
  );
};

export default StoresListPage;
