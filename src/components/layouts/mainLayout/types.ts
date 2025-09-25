import type { LucideIcon } from 'lucide-react';

// Store structure from auth_permissions_and_roles
export interface StoreMetadata {
  phone?: string;
  address?: string;
  [key: string]: any;
}

export interface AuthStore {
  id: string;
  name: string;
  metadata: StoreMetadata;
  is_active: boolean;
}

// Legacy store interface for backward compatibility
export interface Store {
  id: number;
  name: string;
  address: string;
}

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface StoreSelectProps {
  stores: AuthStore[];
  currentStore: AuthStore;
  onStoreChange: (store: AuthStore) => void;
}

export interface NavigationMenuProps {
  menuItems: MenuItem[];
}

export interface BreadcrumbNavigationProps {
  pathname: string;
}

export interface SidebarHeaderProps {
  stores: AuthStore[];
  currentStore: AuthStore;
  onStoreChange: (store: AuthStore) => void;
}