import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PerformanceItemProps, iconMap } from '@/types/performance'; // Make sure iconMap is imported

import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceCardProps {
  item: PerformanceItemProps;
  isLoading?: boolean;
  isMobile?: boolean;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ 
  item, 
  isLoading = false,
  isMobile = false
}) => {
  const IconComponent = item.icon; // Access icon component directly from item
  
  return (
    <Card 
      className={cn(
        "w-full h-full shadow-md transition-all duration-200",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      <CardHeader 
        className={cn(
          "flex flex-row items-center justify-between space-y-0 rounded-t-md",
          item.bgColor,
          isMobile ? "p-2 pb-1" : "p-4 pb-2"
        )}
      >
        <CardTitle className={cn(
          "font-medium text-foreground",
          isMobile ? "text-xs leading-tight" : "text-sm"
        )}>
          {item.title}
        </CardTitle>
        <IconComponent className={cn(
          "text-foreground",
          isMobile ? "h-3 w-3" : "h-5 w-5"
        )} size={isMobile ? 16 : 24} />
      </CardHeader>
      <CardContent className={cn(
        "space-y-2",
        isMobile ? "p-2" : "p-4",
        isMobile ? "space-y-1" : "space-y-3"
      )}>
        <MetricRow 
          label="Daily" 
          value={item.daily} 
          primary 
          isMobile={isMobile}
        />
        <MetricRow 
          label="Weekly" 
          value={item.weekly} 
          isMobile={isMobile}
        />
      </CardContent>
    </Card>
  );
};

interface MetricRowProps {
  label: string;
  value: string;
  primary?: boolean;
  isMobile?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({ 
  label, 
  value, 
  primary = false, 
  isMobile = false 
}) => (
  <div className="flex items-center justify-between">
    <span className={cn(
      "text-muted-foreground",
      primary && "font-semibold",
      isMobile ? "text-xs" : "text-sm"
    )}>
      {label}
    </span>
    <span className={cn(
      "text-foreground",
      primary && "font-bold",
      isMobile ? "text-xs font-medium" : "text-sm",
      primary && !isMobile && "font-bold"
    )}>
      {value}
    </span>
  </div>
);
