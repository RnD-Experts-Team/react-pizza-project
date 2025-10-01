import { 
  // StarIcon,
  // ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export interface MetricDataProps {
  label: string;
  value: string;
  line?: string;
  multiline?: boolean;
}

export interface MetricWithStatusProps {
  label: string;
  value: string;
  status: string;
  statusColor: string;
  bgImage?: string;
  line?: string;
  statusLeft?: string;
  multiline?: boolean;
}

export interface PlatformCardProps {
  iconSrc?: string;
  title: string;
  data?: MetricDataProps[] | null;
  metrics?: MetricWithStatusProps[] | null;
  hasOnTrack?: boolean;
  onTrackPosition?: 'top' | 'middle';
  className?: string;
}

export interface DSQRDashboardProps {
  title?: string;
  platforms?: PlatformCardProps[];
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

// Icon mapping for different platform types
export const iconMap = {
  doordash: {
    light: '/doordash-svgrepo-com.svg',
    dark: '/doordash-svgrepo-com-dark.svg',
  },
  ubereats: {
    light: '/ubereats-svgrepo-com.svg',
    dark: '/ubereats-svgrepo-com-dark.svg',
  },
  grubhub: {
    light: '/grubhub-svgrepo-com.svg',
    dark: '/grubhub-svgrepo-com-dark.svg',
  },
  default: {
    light: '/vite.svg',
    dark: '/vite.svg',
  },
};

// Helper function to get the appropriate icon based on theme
export const getThemeIcon = (platform: keyof typeof iconMap, isDark: boolean): string => {
  const platformIcons = iconMap[platform] || iconMap.default;
  return isDark ? platformIcons.dark : platformIcons.light;
};

// Helper function to detect if current theme is dark
export const isDarkTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const root = window.document.documentElement;
  return root.classList.contains('dark');
};

// Status icon mapping
export const statusIconMap = {
  NA: XCircleIcon,
  OT: CheckCircleIcon,
  default: ExclamationCircleIcon,
};

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'OT':
      return 'default';
    case 'NA':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const getStatusBgColor = (statusColor: string) => {
  const colorMap = {
    '#c30000': 'bg-red-100 border-red-200',
    '#00c610': 'bg-green-100 border-green-200',
    '#14cd24': 'bg-green-100 border-green-200',
    '#e0b300': 'bg-yellow-100 border-yellow-200',
  };
  return (
    (colorMap as Record<string, string>)[statusColor] ||
    'bg-gray-100 border-gray-200'
  );
};
