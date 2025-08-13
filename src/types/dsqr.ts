import {
  TruckIcon,
  ChartBarIcon,
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
  icon?: React.ComponentType<any>;
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
  doordash: TruckIcon,
  ubereats: TruckIcon,
  grubhub: TruckIcon,
  default: ChartBarIcon,
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
