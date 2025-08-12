import React from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PerformanceGrid } from '@/components/performance/PerformanceGrid';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { PerformanceItemProps } from '@/types/performance';

import { Button } from '@/components/ui/button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface InfoSectionProps {
  title?: string;
  subtitle?: string;
  data?: PerformanceItemProps[];
  className?: string;
  showRefresh?: boolean;
  onCardClick?: (item: PerformanceItemProps, index: number) => void;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  title = "Sales Performance Overview",
  subtitle,
  data: externalData,
  className,
  showRefresh = true,
  onCardClick
}) => {
  const { data: hookData, isLoading, refreshData } = usePerformanceData();
  const isMobile = useIsMobile();
  const data = externalData || hookData;

  const handleCardClick = (item: PerformanceItemProps, index: number) => {
    onCardClick?.(item, index);
    console.log(`Clicked on ${item.title}`, item);
  };

  return (
    <section className={cn(
      "w-full",
      // Responsive padding and spacing
      isMobile 
        ? "p-2 space-y-3" 
        : "p-4 md:p-6 lg:p-8 space-y-6",
      className
    )}>
      <SectionHeader 
        title={title}
        subtitle={subtitle}
        actions={
          showRefresh ? (
            <Button
              variant="outline"
              size={isMobile ? "sm" : "sm"}
              onClick={refreshData}
              disabled={isLoading}
              className={cn(
                "gap-2",
                isMobile && "text-xs px-2 py-1"
              )}
            >
              <ArrowPathIcon className={cn(
                isMobile ? "h-3 w-3" : "h-4 w-4",
                isLoading && "animate-spin"
              )} />
              {isMobile ? "Refresh" : "Refresh"}
            </Button>
          ) : null
        }
      />
      
      <PerformanceGrid
        data={data}
        onCardClick={handleCardClick}
        isLoading={isLoading}
      />
    </section>
  );
};
