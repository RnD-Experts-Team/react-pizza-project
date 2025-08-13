import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
// import {
//   TruckIcon,
//   ChartBarIcon,
//   ExclamationCircleIcon,
//   CheckCircleIcon,
//   XCircleIcon,
// } from '@heroicons/react/24/outline';

// Type definitions
interface BasicMetricProps {
  label: string;
  value: string;
  line?: string;
}

interface DetailedMetricProps {
  label: string;
  value: string;
  status: string;
  statusColor: string;
  backgroundImage?: string;
  line?: string;
}

interface PlatformData {
  name: string;
  basicMetrics: BasicMetricProps[];
  detailedMetrics: DetailedMetricProps[];
}

interface PerformanceDashboardProps {
  platforms?: PlatformData[];
  className?: string;
  defaultTab?: string;
}

// Status badge configuration
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
    colorMap[statusColor as keyof typeof colorMap] ||
    'bg-gray-100 border-gray-200'
  );
};

// Basic metric row component
const BasicMetricRow: React.FC<BasicMetricProps & { isLast?: boolean }> = ({
  label,
  value,
  isLast = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-1">
        <span className="text-sm font-semibold text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};

// Detailed metric row with status component
const DetailedMetricRow: React.FC<
  DetailedMetricProps & { isLast?: boolean }
> = ({ label, value, status, statusColor, isLast = false }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-1">
        <span className="text-sm font-semibold text-muted-foreground flex-1">
          {label}
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
  <div className="flex items-center py-3">
    <span className="text-base font-bold text-yellow-600">On Track ?</span>
  </div>
);

// Performance metrics section
const PerformanceMetrics: React.FC<{ platform: PlatformData }> = ({
  platform,
}) => {
  return (
    <div className="space-y-3 p-4">
      {/* Basic Metrics */}
      <div className="space-y-2">
        {platform.basicMetrics.map((metric, index) => (
          <BasicMetricRow
            key={`basic-${index}`}
            {...metric}
            isLast={index === platform.basicMetrics.length - 1}
          />
        ))}
      </div>

      {/* On Track Section */}
      <OnTrackSection />

      {/* Detailed Metrics */}
      <div className="space-y-2">
        {platform.detailedMetrics.map((metric, index) => (
          <DetailedMetricRow
            key={`detailed-${index}`}
            {...metric}
            isLast={index === platform.detailedMetrics.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

// Default platform data
const defaultPlatforms: PlatformData[] = [
  {
    name: 'Doordash',
    basicMetrics: [
      { label: 'Most Loved Restaurant', value: '0' },
      { label: 'Optimization Score', value: 'Med' },
      { label: '#1 Top Missing or Incorrect Item', value: '0' },
      { label: 'Reviews Responded', value: '1' },
    ],
    detailedMetrics: [
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
  },
  {
    name: 'UberEats',
    basicMetrics: [
      { label: 'Customer Satisfaction', value: '4.2' },
      { label: 'Delivery Time Average', value: '28min' },
      { label: 'Order Accuracy Rate', value: '94%' },
      { label: 'Support Tickets Resolved', value: '12' },
    ],
    detailedMetrics: [
      {
        label: 'Customer Reviews Overview',
        value: '4.1',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Cost of Refunds',
        value: '$127',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Unfulfilled Order Rate',
        value: '2.3%',
        status: 'OT',
        statusColor: '#14cd24',
      },
      {
        label: 'Time Unavailable During Open Hours',
        value: '0.5h',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Driver Wait Time',
        value: '3.2',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'System Downtime',
        value: '0.1h',
        status: 'OT',
        statusColor: '#00c610',
      },
    ],
  },
  {
    name: 'GrubHub',
    basicMetrics: [
      { label: 'Order Volume', value: '156' },
      { label: 'Peak Hours Performance', value: 'Good' },
      { label: 'Menu Item Accuracy', value: '91%' },
      { label: 'Customer Complaints', value: '3' },
    ],
    detailedMetrics: [
      {
        label: 'Rating',
        value: '4.0',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Food was Good',
        value: '0.87',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Delivery was On Time',
        value: '0.92',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Order was Accurate',
        value: '0.89',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Customer Service Response',
        value: '2.1h',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Promotional Campaign ROI',
        value: '1.4x',
        status: 'OT',
        statusColor: '#00c610',
      },
    ],
  },
];

// Main Performance Dashboard component
export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  platforms = defaultPlatforms,
  className,
  defaultTab = platforms[0]?.name.toLowerCase(),
}) => {
  return (
    <div className={cn('w-full max-w-2xl mx-auto p-4', className)}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList
          className="grid w-full mb-0 rounded-b-none shadow-md"
          style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}
        >
          {platforms.map((platform) => (
            <TabsTrigger
              key={platform.name}
              value={platform.name.toLowerCase()}
              className="text-lg font-bold px-4 py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-200 rounded-t-lg rounded-b-none transition-colors duration-200"
            >
              {platform.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent
            key={platform.name}
            value={platform.name.toLowerCase()}
            className="mt-0"
          >
            <Card className="rounded-t-none border-t-0 shadow-lg min-h-[420px]">
              <CardContent className="p-0">
                <PerformanceMetrics platform={platform} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Export with original name for backward compatibility
export const FrameScreen = PerformanceDashboard;
