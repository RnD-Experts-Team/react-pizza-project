import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';
import type { NavigationMenuProps } from './types';

// Helper function to check if a menu item should be active
function isMenuItemActive(currentPath: string, menuUrl: string): boolean {
  // Exact match for dashboard and settings
  if (menuUrl === '/dashboard' || menuUrl === '/settings') {
    return currentPath === menuUrl;
  }

  // For other routes, check if current path starts with menu URL
  // This enables hierarchical navigation (e.g., /stores/create activates /stores)
  return currentPath === menuUrl || currentPath.startsWith(menuUrl + '/');
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ menuItems }) => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 sm:px-3 text-xs sm:text-sm group-data-[collapsible=icon]:hidden">
        Application
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isMenuItemActive(location.pathname, item.url)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-sidebar-accent hover:underline data-[active=true]:bg-sidebar-accent/70"
                tooltip={item.title}
              >
                <Link
                  to={item.url}
                  className="flex items-center space-x-2 sm:space-x-3"
                >
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavigationMenu;