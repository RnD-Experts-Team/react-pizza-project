import React from 'react';
import { PerformanceCard } from './PerformanceCard';
import type { PerformanceItemProps } from '@/types/performance';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PerformanceGridProps {
  data: PerformanceItemProps[];
  isLoading?: boolean;
  className?: string;
}

export const PerformanceGrid: React.FC<PerformanceGridProps> = ({
  data,
  isLoading = false,
  className,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        // Always 2x2 grid
        'grid grid-cols-2 lg:grid-cols-4 grid-rows-2 lg:grid-rows-1',

        // Responsive gap and spacing
        isMobile ? 'gap-2' : 'gap-4 md:gap-6',
        className,
      )}
    >
      {data.slice(0, 4).map((item, index) => (
        <PerformanceCard
          key={`${item.title}-${index}`}
          item={item}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
