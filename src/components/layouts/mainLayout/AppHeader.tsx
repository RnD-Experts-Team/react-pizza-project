import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '../../ui/sidebar';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import BreadcrumbNavigation from './BreadcrumbNavigation';

const AppHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <header className="flex h-12 sm:h-16 shrink-0 items-center gap-1 sm:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border">
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
          <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col border-b border-border">
      {/* Top Header Row */}
      <div className="flex h-12 sm:h-16 shrink-0 items-center gap-1 sm:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center px-2 sm:px-4">
          <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
          <BreadcrumbNavigation pathname={location.pathname} />
        </div>
      </div>
      {/* Breadcrumbs Row */}
    </header>
  );
};

export default AppHeader;