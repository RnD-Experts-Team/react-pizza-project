import React from 'react';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import AppSidebar from './mainLayout/AppSidebar';
import AppHeader from './mainLayout/AppHeader';
import type { MainLayoutProps } from './mainLayout/types';

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
