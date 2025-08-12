import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { MetricRow, MetricRowWithStatus } from './MetricRow';
import { OnTrackSection } from './OnTrackSection';
import type { PlatformCardProps } from '@/types/dsqr';
import { iconMap } from '@/types/dsqr';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface DSQRTabbedViewProps {
  platforms: PlatformCardProps[];
  className?: string;
}

// Transform platform data to match the tabbed format
const transformPlatformData = (platform: PlatformCardProps) => {
  return {
    name: platform.title,
    basicMetrics: (platform.data || []).map(item => ({
      label: item.label,
      value: item.value,
      line: item.line
    })),
    detailedMetrics: (platform.metrics || []).map(metric => ({
      label: metric.label,
      value: metric.value,
      status: metric.status,
      statusColor: metric.statusColor,
      line: metric.line
    })),
    hasOnTrack: platform.hasOnTrack,
    onTrackPosition: platform.onTrackPosition
  };
};

const getPlatformIcon = (platformTitle: string) => {
  const title = platformTitle.toLowerCase();
  if (title.includes('doordash')) return iconMap.doordash;
  if (title.includes('ubereats')) return iconMap.ubereats;
  if (title.includes('grubhub')) return iconMap.grubhub;
  return ChartBarIcon;
};

export const DSQRTabbedView: React.FC<DSQRTabbedViewProps> = ({
  platforms,
  className
}) => {
  const initialTab = platforms[0]?.title.toLowerCase().replace(/\s+/g, '') || 'platform-0';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto p-4",
      className
    )}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList 
          className="grid w-full mb-0 rounded-b-none shadow-md"
          style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}
        >
          {platforms.map((platform, index) => {
            const IconComponent = getPlatformIcon(platform.title);
            const tabValue = platform.title.toLowerCase().replace(/\s+/g, '') || `platform-${index}`;
            
            return (
              <TabsTrigger 
                key={tabValue}
                value={tabValue}
                className="text-sm font-bold px-2 py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-200 rounded-t-lg rounded-b-none transition-colors duration-200 flex items-center gap-1"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{platform.title}</span>
                <span className="sm:hidden">{platform.title.substring(0, 4)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {platforms.map((platform, index) => {
          const tabValue = platform.title.toLowerCase().replace(/\s+/g, '') || `platform-${index}`;
          const transformedData = transformPlatformData(platform);
          
          return (
            <TabsContent 
              key={tabValue}
              value={tabValue}
              className="mt-0"
            >
              <Card className="rounded-t-none border-t-0 shadow-lg min-h-[400px]">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* Basic Metrics */}
                    {transformedData.basicMetrics.length > 0 && (
                      <div className="space-y-1">
                        {transformedData.basicMetrics.map((metric, metricIndex) => (
                          <MetricRow 
                            key={`basic-${metricIndex}`} 
                            {...metric} 
                            isLast={false}
                            isMobile={true}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* On Track Section */}
                    {transformedData.hasOnTrack && (
                      (transformedData.onTrackPosition === 'top' || 
                       (transformedData.onTrackPosition === 'middle' && transformedData.basicMetrics.length > 0))
                    ) && <OnTrackSection isMobile={true} />}
                    
                    {/* Detailed Metrics */}
                    {transformedData.detailedMetrics.length > 0 && (
                      <div className="space-y-1">
                        {transformedData.detailedMetrics.map((metric, metricIndex) => (
                          <MetricRowWithStatus 
                            key={`detailed-${metricIndex}`} 
                            {...metric} 
                            isLast={metricIndex === transformedData.detailedMetrics.length - 1}
                            isMobile={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
