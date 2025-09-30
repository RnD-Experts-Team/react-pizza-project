import React from 'react';
import { PerformanceCard } from '@/features/dashboard/components/performance/PerformanceCard';
import type { PerformanceItemProps } from '@/features/dashboard/types/performance';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/useTheme';
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
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div
      className={cn(
        // Always 2x2 grid
        'grid grid-cols-2 lg:grid-cols-4 grid-rows-2 lg:grid-rows-1',

        // Responsive gap and spacing
        isMobile ? 'gap-2' : 'gap-4 md:gap-8',
        className,
      )}
    >
      {data.slice(0, 4).map((item, index) => {
        // Use theme-aware primary color shades
        const lightModeColors = ['bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400'];
        const darkModeColors = ['bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900'];
        const bgColorClasses = isDarkMode ? darkModeColors : lightModeColors;
        const bgColorClass = bgColorClasses[index];
        
        return (
          <PerformanceCard
            key={`${item.title}-${index}`}
            item={item}
            isLoading={isLoading}
            isMobile={isMobile}
            bgColor={bgColorClass}
          />
        );
      })}
    </div>
  );
};
