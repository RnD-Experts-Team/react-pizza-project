import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TruckIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
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
  data?: MetricDataProps[] | null;
  metrics?: MetricWithStatusProps[] | null;
  hasOnTrack?: boolean;
  onTrackPosition?: 'top' | 'middle';
  className?: string;
}

interface DSQRDashboardProps {
  title?: string;
  platforms?: PlatformCardProps[];
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showFilters?: boolean;
  allowLayoutChange?: boolean;
}

// Icon mapping for different platform types
const iconMap = {
  doordash: TruckIcon,
  ubereats: TruckIcon,
  grubhub: TruckIcon,
  default: ChartBarIcon
};

// Status icon mapping
const statusIconMap = {
  'NA': XCircleIcon,
  'OT': CheckCircleIcon,
  'default': ExclamationCircleIcon
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'OT': return 'default';
    case 'NA': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusBgColor = (statusColor: string) => {
  const colorMap = {
    '#c30000': 'bg-red-100 border-red-200',
    '#00c610': 'bg-green-100 border-green-200',
    '#14cd24': 'bg-green-100 border-green-200',
    '#e0b300': 'bg-yellow-100 border-yellow-200',
  };
  return (colorMap as Record<string, string>)[statusColor] || 'bg-gray-100 border-gray-200';
};

// Simple metric row component
const MetricRow: React.FC<MetricDataProps & { isLast?: boolean }> = ({ 
  label, 
  value, 
  multiline = false,
  isLast = false 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <span className={cn(
          "text-sm font-semibold text-muted-foreground",
          multiline ? "leading-relaxed" : "whitespace-nowrap"
        )}>
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
        <span className="text-sm font-bold text-foreground">
          {value}
        </span>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};

// Metric row with status component
const MetricRowWithStatus: React.FC<MetricWithStatusProps & { isLast?: boolean }> = ({ 
  label, 
  value, 
  status, 
  statusColor, 
  multiline = false,
  isLast = false 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <span className={cn(
          "text-sm font-semibold text-muted-foreground flex-1",
          multiline ? "leading-relaxed" : "whitespace-nowrap"
        )}>
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
          <span className="text-sm font-bold text-foreground">
            {value}
          </span>
          <div className={cn(
            "flex items-center justify-center w-8 h-6 rounded-sm",
            getStatusBgColor(statusColor)
          )}>
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
    <span className="text-base font-bold text-yellow-600">
      On Track ?
    </span>
  </div>
);

// Platform card component
const PlatformCard: React.FC<PlatformCardProps> = ({
  icon: IconComponent,
  title,
  data = null,
  metrics = null,
  hasOnTrack = true,
  onTrackPosition = 'middle',
  className
}) => {
  // Safe handling of null data and metrics
  const safeData = data || [];
  const safeMetrics = metrics || [];

  return (
    <Card className={cn(
      "w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow duration-200",
      className
    )}>
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
        {safeData.length > 0 && safeData.map((item, index) => (
          <MetricRow 
            key={`data-${index}`} 
            {...item} 
            isLast={false}
          />
        ))}
        
        {/* On Track section at top */}
        {hasOnTrack && onTrackPosition === 'top' && <OnTrackSection />}
        
        {/* On Track section in middle - only show if we have data */}
        {hasOnTrack && onTrackPosition === 'middle' && safeData.length > 0 && <OnTrackSection />}
        
        {/* Render metrics with status - only if we have metrics */}
        {safeMetrics.length > 0 && safeMetrics.map((metric, index) => (
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
    onTrackPosition: 'middle'
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
    onTrackPosition: 'middle'
  },
  {
    icon: TruckIcon,
    title: 'GrubHub',
    data: null,
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
    onTrackPosition: 'top'
  }
];

// Enhanced DSQR Dashboard component
const DSQRDashboardComponent: React.FC<DSQRDashboardProps> = ({
  title = "DSQR Dashboard",
  platforms = defaultPlatforms,
  className,
  layout: initialLayout = 'horizontal',
  showFilters = true,
  allowLayoutChange = true
}) => {
  const [currentLayout, setCurrentLayout] = useState(initialLayout);
  const [activeTab, setActiveTab] = useState('all');
  const [hiddenPlatforms, setHiddenPlatforms] = useState<string[]>([]);

  const filteredPlatforms = platforms.filter(platform => {
    if (activeTab === 'all') return !hiddenPlatforms.includes(platform.title);
    return platform.title.toLowerCase() === activeTab && !hiddenPlatforms.includes(platform.title);
  });

  const togglePlatformVisibility = (platformTitle: string) => {
    setHiddenPlatforms(prev => 
      prev.includes(platformTitle) 
        ? prev.filter(p => p !== platformTitle)
        : [...prev, platformTitle]
    );
  };

  const getLayoutClasses = () => {
    switch (currentLayout) {
      case 'vertical':
        return 'flex flex-col gap-6';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      default:
        return 'flex flex-col lg:flex-row justify-center gap-6 overflow-x-auto';
    }
  };

  const platformTabs = ['all', ...platforms.map(p => p.title.toLowerCase())];

  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto p-4 md:p-6",
      className
    )}>
      <header className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          {title}
        </h1>
        
        {(showFilters || allowLayoutChange) && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {allowLayoutChange && (
              <div className="flex gap-2">
                <Button
                  variant={currentLayout === 'horizontal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentLayout('horizontal')}
                >
                  <ArrowsPointingOutIcon className="w-4 h-4 mr-1" />
                  Horizontal
                </Button>
                <Button
                  variant={currentLayout === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentLayout('grid')}
                >
                  <Squares2X2Icon className="w-4 h-4 mr-1" />
                  Grid
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.title}
                  variant="outline"
                  size="sm"
                  onClick={() => togglePlatformVisibility(platform.title)}
                >
                  {hiddenPlatforms.includes(platform.title) ? (
                    <EyeSlashIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <EyeIcon className="w-4 h-4 mr-1" />
                  )}
                  {platform.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {showFilters && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
            {platformTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {platformTabs.map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className={cn("w-full", getLayoutClasses())}>
                {filteredPlatforms.map((platform, index) => (
                  <PlatformCard
                    key={`platform-${index}`}
                    {...platform}
                    className="flex-shrink-0"
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {!showFilters && (
        <div className={cn("w-full", getLayoutClasses())}>
          {filteredPlatforms.map((platform, index) => (
            <PlatformCard
              key={`platform-${index}`}
              {...platform}
              className="flex-shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main export
export const DSQRDashboard = DSQRDashboardComponent;

// Export the component with the original name for backward compatibility
export const Dsqr = DSQRDashboardComponent;

// Export enhanced version specifically
export const EnhancedDSQRDashboard = DSQRDashboardComponent;
