import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';
import {
  Home,
  Settings,
  Store,
  Users,
  ShieldCheck,
  FileText,
  Building,
  UserCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';
import AppSidebarHeader from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import type { MenuItem, AuthStore } from './types';
import { getStores } from '../../../features/auth/utils/permissionAndRolesStorage';

// Helper function to transform auth store data to display format
const transformStoreData = (authStores: any[]): AuthStore[] => {
  return authStores.map((storeData) => ({
    id: storeData.store.id,
    name: storeData.store.name,
    metadata: storeData.store.metadata,
    is_active: storeData.store.is_active,
  }));
};

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

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const [stores, setStores] = useState<AuthStore[]>([]);
  const [currentStore, setCurrentStore] = useState<AuthStore | null>(null);
  const [, setActiveMenuItem] = useState<string>('');

  // Load stores from auth data on component mount
  useEffect(() => {
    const authStores = getStores();
    if (authStores && authStores.length > 0) {
      const transformedStores = transformStoreData(authStores);
      const activeStores = transformedStores.filter(store => store.is_active);
      
      if (activeStores.length > 0) {
        setStores(activeStores);
        // Set current store if not already set
        if (!currentStore && activeStores[0]) {
          setCurrentStore(activeStores[0]);
        }
      } else {
        // No active stores available
        setStores([]);
        setCurrentStore(null);
      }
    } else {
      // No stores available from auth data
      setStores([]);
      setCurrentStore(null);
    }
  }, [currentStore]);

  // Update active menu item based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    setActiveMenuItem(currentPath);
  }, [location.pathname]);

  // Handle store change
  const handleStoreChange = (store: AuthStore) => {
    setCurrentStore(store);
  };

  // Main menu items (excluding settings)
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Blank Page',
      url: '/blank-page',
      icon: FileText,
    },
    {
      title: 'User Management',
      url: '/user-management',
      icon: Users,
    },
    {
      title: 'Employees',
      url: '/employees',
      icon: UserCheck,
    },
    {
      title: 'Employment Information',
      url: '/employment-information',
      icon: CreditCard,
    },
    {
      title: 'Service Client Management',
      url: '/service-client-management',
      icon: ShieldCheck,
    },
    {
      title: 'Auth Rules',
      url: '/auth-rules',
      icon: ShieldCheck,
    },
    {
      title: 'Stores',
      url: '/stores',
      icon: Store,
    },
    {
      title: 'User Role Store Assignment',
      url: '/user-role-store-assignment',
      icon: Users,
    },
    {
      title: 'Positions',
      url: '/positions',
      icon: Building,
    },
    {
      title: 'Schedule Preferences',
      url: '/schedule-preferences',
      icon: Calendar,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="bg-sidebar-gradient border-r border-sidebar-border shadow-md"
    >
      {stores.length > 0 && currentStore && (
        <AppSidebarHeader
          stores={stores}
          currentStore={currentStore}
          onStoreChange={handleStoreChange}
        />
      )}
      
      <SidebarContent className="!bg-sidebar">
        <NavigationMenu menuItems={menuItems} />
      </SidebarContent>
      
      {/* Settings in Footer */}
      <SidebarFooter className="bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isMenuItemActive(location.pathname, '/settings')}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent/70"
              tooltip="Settings"
            >
              <Link
                to="/settings"
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;