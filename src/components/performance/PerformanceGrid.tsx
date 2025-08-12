import React from 'react';
import { PerformanceCard } from './PerformanceCard';
import type { PerformanceItemProps } from '@/types/performance';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PerformanceGridProps {
  data: PerformanceItemProps[];
  onCardClick?: (item: PerformanceItemProps, index: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const PerformanceGrid: React.FC<PerformanceGridProps> = ({
  data,
  onCardClick,
  isLoading = false,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      // Always 2x2 grid
      "grid grid-cols-2 grid-rows-2",
      // Responsive gap and spacing
      isMobile ? "gap-2" : "gap-4 md:gap-6",
      className
    )}>
      {data.slice(0, 4).map((item, index) => (
        <PerformanceCard
          key={`${item.title}-${index}`}
          item={item}
          onClick={() => onCardClick?.(item, index)}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
