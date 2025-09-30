import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PerformanceItemProps } from '@/features/dashboard/types/performance'; // Make sure iconMap is imported
import { iconMap } from '@/features/dashboard/types/performance';

// import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceCardProps {
  item: PerformanceItemProps;
  isLoading?: boolean;
  isMobile?: boolean;
  bgColor?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  item,
  isLoading = false,
  isMobile = false,
  bgColor,
}) => {
  const IconComponent = iconMap[item.icon]; // Access icon component directly from item

  return (
    <Card
      className={cn(
        'w-full h-full shadow-realistic transition-all duration-200 overflow-hidden',
        'hover:shadow-realistic-lg transform hover:scale-[1.02]',
        isLoading && 'opacity-50 pointer-events-none',
      )}
    >
      <CardHeader
        className={cn(
          'flex flex-row items-center justify-between space-y-0 rounded-t-md',
          bgColor || item.bgColor,
          isMobile ? 'p-2' : 'p-4',
        )}
      >
        <CardTitle
          className={cn(
            'font-medium text-foreground truncate',
            isMobile ? 'text-sm leading-tight' : 'text-base',
          )}
        >
          {item.title}
        </CardTitle>
        <IconComponent
          className={cn('text-foreground', isMobile ? 'h-4 w-4' : 'h-6 w-6')}
        />
      </CardHeader>
      <CardContent
        className={cn(
          'space-y-2',
          isMobile ? 'p-2' : 'p-4',
          isMobile ? 'space-y-2' : 'space-y-4',
        )}
      >
        <MetricRow
          label="Daily"
          value={item.daily}
          primary
          isMobile={isMobile}
        />
        <MetricRow label="Weekly" value={item.weekly} isMobile={isMobile} />
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
  isMobile = false,
}) => (
  <div className="flex items-center justify-between gap-2 min-w-0">
    <span
      className={cn(
        'text-muted-foreground truncate flex-shrink',
        primary && 'font-semibold',
        isMobile ? 'text-sm' : 'text-base',
      )}
    >
      {label}
    </span>
    <span
      className={cn(
        'text-foreground truncate flex-shrink-0',
        primary && 'font-bold',
        isMobile ? 'text-sm font-medium' : 'text-base',
        primary && !isMobile && 'font-bold',
      )}
    >
      {value}
    </span>
  </div>
);
