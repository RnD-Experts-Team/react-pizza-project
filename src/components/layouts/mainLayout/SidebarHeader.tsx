import React from 'react';
import { SidebarHeader } from '../../ui/sidebar';
import StoreSelector from './StoreSelector';
import type { SidebarHeaderProps } from './types';

const AppSidebarHeader: React.FC<SidebarHeaderProps> = ({
  stores,
  currentStore,
  onStoreChange,
}) => {
  return (
    <SidebarHeader className="bg-transparent">
      {/* Pizza Portal Title */}
      <div className="px-2 sm:px-3 py-3 sm:py-4">
        <h1 className="text-lg sm:text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">
          Pizza Portal
        </h1>
        {/* Show "P" when collapsed */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
          <span className="text-lg font-bold text-primary">P</span>
        </div>
      </div>

      {/* Current Store Display */}
      <div className="">
        <StoreSelector
          stores={stores}
          currentStore={currentStore}
          onStoreChange={onStoreChange}
        />
      </div>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;