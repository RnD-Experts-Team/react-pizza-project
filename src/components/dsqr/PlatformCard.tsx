import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MetricRow, MetricRowWithStatus } from './MetricRow';
import { OnTrackSection } from './OnTrackSection';
import type { PlatformCardProps } from '@/types/dsqr';

interface PlatformCardComponentProps extends PlatformCardProps {
  isMobile?: boolean;
}

export const PlatformCard: React.FC<PlatformCardComponentProps> = ({
  icon: IconComponent,
  title,
  data = null,
  metrics = null,
  hasOnTrack = true,
  onTrackPosition = 'middle',
  className,
  isMobile = false
}) => {
  const safeData = data || [];
  const safeMetrics = metrics || [];

  return (
    <Card className={cn(
      "w-full shadow-lg hover:shadow-xl transition-shadow duration-200",
      isMobile ? "max-w-full" : "max-w-sm mx-auto",
      className
    )}>
      <CardHeader className={cn(
        isMobile ? "pb-2 p-3" : "pb-4"
      )}>
        <div className="flex items-center justify-between">
          {IconComponent && (
            <IconComponent className={cn(
              "text-muted-foreground",
              isMobile ? "w-4 h-4" : "w-6 h-6"
            )} />
          )}
          <CardTitle className={cn(
            "font-bold text-center flex-1",
            isMobile ? "text-base" : "text-lg"
          )}>
            {title}
          </CardTitle>
          {IconComponent && (
            <IconComponent className={cn(
              "text-muted-foreground",
              isMobile ? "w-4 h-4" : "w-6 h-6"
            )} />
          )}
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        isMobile ? "space-y-2 p-3 pt-0" : "space-y-3"
      )}>
        {/* Basic data metrics */}
        {safeData.length > 0 && safeData.map((item, index) => (
          <MetricRow 
            key={`data-${index}`} 
            {...item} 
            isLast={false}
            isMobile={isMobile}
          />
        ))}
        
        {/* On Track section at top */}
        {hasOnTrack && onTrackPosition === 'top' && <OnTrackSection isMobile={isMobile} />}
        
        {/* On Track section in middle */}
        {hasOnTrack && onTrackPosition === 'middle' && safeData.length > 0 && <OnTrackSection isMobile={isMobile} />}
        
        {/* Metrics with status */}
        {safeMetrics.length > 0 && safeMetrics.map((metric, index) => (
          <MetricRowWithStatus 
            key={`metric-${index}`} 
            {...metric} 
            isLast={index === safeMetrics.length - 1}
            isMobile={isMobile}
          />
        ))}
      </CardContent>
    </Card>
  );
};
