import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export interface ChannelDataProps {
  id: string;
  name: string;
  percentage: string;
  price: string;
  marketShare: string;
  icon?: keyof typeof iconMap;
  trend?: 'up' | 'down';
  variant?: 'positive' | 'negative' | 'neutral';
}

export interface ChannelSalesDashboardProps {
  title?: string;
  channels?: ChannelDataProps[];
  className?: string;
  showIcons?: boolean;
  showTrendArrows?: boolean;
}

// Icon mapping for different channel types
export const iconMap = {
  ubereats: TruckIcon,
  doordash: TruckIcon,
  grubhub: TruckIcon,
  phone: DevicePhoneMobileIcon,
  mobile: DevicePhoneMobileIcon,
  website: GlobeAltIcon,
  desktop: ComputerDesktopIcon,
} as const;
