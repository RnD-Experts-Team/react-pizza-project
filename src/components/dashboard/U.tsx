import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  TruckIcon,
  // ChartBarIcon,
  // StarIcon,
  // ClockIcon,
  // ExclamationCircleIcon,
  // CheckCircleIcon,
  // XCircleIcon,
} from '@heroicons/react/24/outline';

// Type definitions
interface MetricDataProps {
  label: string;
  value: string;
  line?: string;
  multiline?: boolean;
}

interface MetricWithStatusProps {
  label: string;
  value: string;
  status: string;
  statusColor: string;
  bgImage?: string;
  line?: string;
  statusLeft?: string;
  multiline?: boolean;
}

interface PlatformCardProps {
  icon?: React.ComponentType<any>;
  title: string;
  data?: MetricDataProps[] | null; // Allow null
  metrics?: MetricWithStatusProps[] | null; // Allow null
  hasOnTrack?: boolean;
  onTrackPosition?: 'top' | 'middle';
  className?: string;
}

interface DSQRDashboardProps {
  title?: string;
  platforms?: PlatformCardProps[];
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

// Icon mapping for different platform types
// const iconMap = {
//   doordash: TruckIcon,
//   ubereats: TruckIcon,
//   grubhub: TruckIcon,
//   default: ChartBarIcon,
// };

// Status icon mapping
// const statusIconMap = {
//   NA: XCircleIcon,
//   OT: CheckCircleIcon,
//   default: ExclamationCircleIcon,
// };

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'OT':
      return 'default';
    case 'NA':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusBgColor = (statusColor: string) => {
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

// Simple metric row component
const MetricRow: React.FC<MetricDataProps & { isLast?: boolean }> = ({
  label,
  value,
  multiline = false,
  isLast = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <span
          className={cn(
            'text-sm font-semibold text-muted-foreground',
            multiline ? 'leading-relaxed' : 'whitespace-nowrap',
          )}
        >
          {multiline ? (
            <span className="block">
              {label.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < label.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          ) : (
            label
          )}
        </span>
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};

// Metric row with status component
const MetricRowWithStatus: React.FC<
  MetricWithStatusProps & { isLast?: boolean }
> = ({
  label,
  value,
  status,
  statusColor,
  multiline = false,
  isLast = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <span
          className={cn(
            'text-sm font-semibold text-muted-foreground flex-1',
            multiline ? 'leading-relaxed' : 'whitespace-nowrap',
          )}
        >
          {multiline ? (
            <span className="block">
              {label.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < label.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          ) : (
            label
          )}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">{value}</span>
          <div
            className={cn(
              'flex items-center justify-center w-8 h-6 rounded-sm',
              getStatusBgColor(statusColor),
            )}
          >
            <Badge
              variant={getStatusVariant(status)}
              className="text-xs px-1 py-0 h-4"
              style={{ color: statusColor }}
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};

// On Track section component
const OnTrackSection: React.FC = () => (
  <div className="flex items-center py-2">
    <span className="text-base font-bold text-yellow-600">On Track ?</span>
  </div>
);

// Platform card component - FIXED VERSION
const PlatformCard: React.FC<PlatformCardProps> = ({
  icon: IconComponent,
  title,
  data = null, // Default to null instead of empty array
  metrics = null, // Default to null instead of empty array
  hasOnTrack = true,
  onTrackPosition = 'middle',
  className,
}) => {
  // Safe handling of null data and metrics
  const safeData = data || [];
  const safeMetrics = metrics || [];

  return (
    <Card
      className={cn(
        'w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow duration-200',
        className,
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          {IconComponent && (
            <IconComponent className="w-6 h-6 text-muted-foreground" />
          )}
          <CardTitle className="text-lg font-bold text-center flex-1">
            {title}
          </CardTitle>
          {IconComponent && (
            <IconComponent className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Render basic data metrics - only if we have data */}
        {safeData.length > 0 &&
          safeData.map((item, index) => (
            <MetricRow key={`data-${index}`} {...item} isLast={false} />
          ))}

        {/* On Track section at top */}
        {hasOnTrack && onTrackPosition === 'top' && <OnTrackSection />}

        {/* On Track section in middle - only show if we have data */}
        {hasOnTrack && onTrackPosition === 'middle' && safeData.length > 0 && (
          <OnTrackSection />
        )}

        {/* Render metrics with status - only if we have metrics */}
        {safeMetrics.length > 0 &&
          safeMetrics.map((metric, index) => (
            <MetricRowWithStatus
              key={`metric-${index}`}
              {...metric}
              isLast={index === safeMetrics.length - 1}
            />
          ))}
      </CardContent>
    </Card>
  );
};

// Default platform data
const defaultPlatforms: PlatformCardProps[] = [
  {
    icon: TruckIcon,
    title: 'Doordash',
    data: [
      { label: 'Most Loved Restaurant', value: '0' },
      { label: 'Optimization Score', value: 'Med' },
      { label: '#1 Top Missing or Incorrect Item', value: '0' },
      { label: 'Reviews Responded', value: '1' },
    ],
    metrics: [
      {
        label: 'Ratings - Average Rating',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Cancellations - Sales Lost',
        value: '0',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Missing or Incorrect Error Charges',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Avoidable Wait M.Sec',
        value: '1',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'total Dasher Wait M.Sec',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Downtime H.MM',
        value: '1',
        status: 'NA',
        statusColor: '#c30000',
      },
    ],
    hasOnTrack: true,
    onTrackPosition: 'middle',
  },
  {
    icon: TruckIcon,
    title: 'UberEats',
    data: [
      { label: 'Top Inaccurate item', value: '0' },
      { label: 'Reviews Responded', value: '1' },
    ],
    metrics: [
      {
        label: 'Customer reviews overview',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Cost of Refunds',
        value: '0',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Unfulfilled order rate',
        value: '0',
        status: 'OT',
        statusColor: '#14cd24',
      },
      {
        label: 'Time unavailable during\nopen hours hh.mm',
        value: '0',
        status: 'OT',
        statusColor: '#00c610',
        multiline: true,
      },
    ],
    hasOnTrack: true,
    onTrackPosition: 'middle',
  },
  {
    icon: TruckIcon,
    title: 'GrubHub',
    data: null, // This was causing the error
    metrics: [
      {
        label: 'Rating',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Food was good',
        value: '0.83',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Delivery was on time',
        value: '1',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Order was accurate',
        value: '0.91',
        status: 'NA',
        statusColor: '#c30000',
      },
    ],
    hasOnTrack: true,
    onTrackPosition: 'top',
  },
];

// Main DSQR Dashboard component
export const DSQRDashboard: React.FC<DSQRDashboardProps> = ({
  title = 'DSQR',
  platforms = defaultPlatforms,
  className,
  layout = 'horizontal',
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-6';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      default:
        return 'flex flex-col lg:flex-row justify-center gap-6 overflow-x-auto';
    }
  };

  return (
    <div className={cn('w-full max-w-7xl mx-auto p-4 md:p-6', className)}>
      <header className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {title}
        </h1>
      </header>

      <div className={cn('w-full', getLayoutClasses())}>
        {platforms.map((platform, index) => (
          <PlatformCard
            key={`platform-${index}`}
            {...platform}
            className="flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

// Export the component with the original name for backward compatibility
export const Dsqr = DSQRDashboard;
