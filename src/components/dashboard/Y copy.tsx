import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  TruckIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  // ExclamationCircleIcon,
  // CheckCircleIcon,
  // XCircleIcon
} from '@heroicons/react/24/outline';

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
  showSearch?: boolean;
  showMetricToggle?: boolean;
  enableCustomization?: boolean;
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
const PerformanceMetrics: React.FC<{
  platform: PlatformData;
  searchTerm: string;
  hiddenMetrics: string[];
}> = ({ platform, searchTerm, hiddenMetrics }) => {
  const filteredBasicMetrics = platform.basicMetrics.filter((metric) =>
    metric.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredDetailedMetrics = platform.detailedMetrics.filter(
    (metric) =>
      metric.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !hiddenMetrics.includes(metric.label),
  );

  return (
    <div className="space-y-3">
      {/* Filtered Basic Metrics */}
      {filteredBasicMetrics.length > 0 && (
        <div className="space-y-2">
          {filteredBasicMetrics.map((metric, index) => (
            <BasicMetricRow
              key={`basic-${index}`}
              {...metric}
              isLast={
                index === filteredBasicMetrics.length - 1 &&
                filteredDetailedMetrics.length === 0
              }
            />
          ))}
        </div>
      )}

      {/* On Track Section */}
      {(filteredBasicMetrics.length > 0 ||
        filteredDetailedMetrics.length > 0) && <OnTrackSection />}

      {/* Filtered Detailed Metrics */}
      {filteredDetailedMetrics.length > 0 && (
        <div className="space-y-2">
          {filteredDetailedMetrics.map((metric, index) => (
            <DetailedMetricRow
              key={`detailed-${index}`}
              {...metric}
              isLast={index === filteredDetailedMetrics.length - 1}
            />
          ))}
        </div>
      )}

      {/* No results message */}
      {searchTerm &&
        filteredBasicMetrics.length === 0 &&
        filteredDetailedMetrics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No metrics found matching "{searchTerm}"
          </div>
        )}
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

// Get platform icon based on name
const getPlatformIcon = (platformName: string) => {
  const iconMap = {
    doordash: TruckIcon,
    ubereats: TruckIcon,
    grubhub: TruckIcon,
  };
  return (
    iconMap[platformName.toLowerCase() as keyof typeof iconMap] || ChartBarIcon
  );
};

// Enhanced Performance Dashboard component
const PerformanceDashboardEnhanced: React.FC<PerformanceDashboardProps> = ({
  platforms = defaultPlatforms,
  className,
  defaultTab,
  showSearch = true,
  showMetricToggle = true,
  enableCustomization = false,
}) => {
  const initialTab =
    defaultTab || platforms[0]?.name.toLowerCase() || 'doordash';
  const [searchTerm, setSearchTerm] = useState('');
  const [hiddenMetrics, setHiddenMetrics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(initialTab);

  // const currentPlatform = platforms.find(p => p.name.toLowerCase() === activeTab);

  const toggleMetricVisibility = (metricLabel: string) => {
    setHiddenMetrics((prev) =>
      prev.includes(metricLabel)
        ? prev.filter((m) => m !== metricLabel)
        : [...prev, metricLabel],
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setHiddenMetrics([]);
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto p-4', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="grid w-full mb-0 rounded-b-none shadow-md"
          style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}
        >
          {platforms.map((platform) => {
            const IconComponent = getPlatformIcon(platform.name);
            return (
              <TabsTrigger
                key={platform.name}
                value={platform.name.toLowerCase()}
                className="text-lg font-bold px-4 py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-200 rounded-t-lg rounded-b-none transition-colors duration-200 flex items-center gap-2"
              >
                <IconComponent className="w-5 h-5" />
                {platform.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent
            key={platform.name}
            value={platform.name.toLowerCase()}
            className="mt-0"
          >
            <Card className="rounded-t-none border-t-0 shadow-lg min-h-[420px]">
              {(showSearch || enableCustomization || showMetricToggle) && (
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {showSearch && (
                      <div className="relative flex-1 min-w-[200px]">
                        <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search metrics..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {enableCustomization &&
                        platform.detailedMetrics.slice(0, 3).map((metric) => (
                          <Button
                            key={metric.label}
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMetricVisibility(metric.label)}
                            className="text-xs"
                            title={`Toggle ${metric.label}`}
                          >
                            {hiddenMetrics.includes(metric.label) ? (
                              <EyeSlashIcon className="w-3 h-3" />
                            ) : (
                              <EyeIcon className="w-3 h-3" />
                            )}
                          </Button>
                        ))}

                      {(searchTerm || hiddenMetrics.length > 0) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="text-xs"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>

                  {showMetricToggle && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Showing{' '}
                        {platform.basicMetrics.filter((m) =>
                          m.label
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                        ).length +
                          platform.detailedMetrics.filter(
                            (m) =>
                              m.label
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) &&
                              !hiddenMetrics.includes(m.label),
                          ).length}{' '}
                        of{' '}
                        {platform.basicMetrics.length +
                          platform.detailedMetrics.length}{' '}
                        metrics
                      </span>
                      {hiddenMetrics.length > 0 && (
                        <span className="text-xs">
                          {hiddenMetrics.length} hidden
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>
              )}

              <CardContent className="p-4 pt-0">
                <PerformanceMetrics
                  platform={platform}
                  searchTerm={searchTerm}
                  hiddenMetrics={hiddenMetrics}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Basic version without enhanced features
const BasicPerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  platforms = defaultPlatforms,
  className,
  defaultTab,
}) => {
  const initialTab =
    defaultTab || platforms[0]?.name.toLowerCase() || 'doordash';

  return (
    <div className={cn('w-full max-w-2xl mx-auto p-4', className)}>
      <Tabs defaultValue={initialTab} className="w-full">
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
              <CardContent className="p-4">
                <PerformanceMetrics
                  platform={platform}
                  searchTerm=""
                  hiddenMetrics={[]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Main exports
export const PerformanceDashboard = BasicPerformanceDashboard;
// Export enhanced version with a different name to avoid redeclaration
export { PerformanceDashboardEnhanced as EnhancedDashboard };

// Export with original name for backward compatibility
export const FrameScreen = PerformanceDashboardEnhanced;
