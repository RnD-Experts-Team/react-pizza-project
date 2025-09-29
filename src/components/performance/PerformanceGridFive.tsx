import React from 'react';
import { PerformanceCard } from './PerformanceCard';
import type { PerformanceItemProps } from '@/types/performance';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface PerformanceGridFiveProps {
  data: PerformanceItemProps[];
  isLoading?: boolean;
  className?: string;
}

export const PerformanceGridFive: React.FC<PerformanceGridFiveProps> = ({
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
        // Base grid setup
        'grid w-full',
        
        // Mobile layout: 2 columns, 3 rows (2-2-1)
        'grid-cols-2 grid-rows-3',
        'gap-2 sm:gap-3',
        
        // Tablet and larger layout: 6 columns, 2 rows
        'md:grid-cols-6 md:grid-rows-2',
        'md:gap-4 lg:gap-6 xl:gap-8',
        
        className,
      )}
    >
      {data.slice(0, 5).map((item, index) => {
        // Define color progression for visual appeal
        const lightModeColors = [
          'bg-primary-100', // First card - lightest
          'bg-primary-200', 
          'bg-primary-300', 
          'bg-primary-400', 
          'bg-primary-500'  // Last card - base primary
        ];
        
        const darkModeColors = [
          'bg-primary-900', // First card - darkest
          'bg-primary-800', 
          'bg-primary-700', 
          'bg-primary-600', 
          'bg-primary-500'  // Last card - base primary
        ];
        
        const bgColorClasses = isDarkMode ? darkModeColors : lightModeColors;
        const bgColorClass = bgColorClasses[index];
        
        // Responsive positioning classes
        let positionClasses = '';
        
        // Mobile layout (2 columns)
        if (index === 4) {
          positionClasses = 'col-span-2'; // Fifth card spans 2 columns on mobile
        }
        
        // Tablet and larger layout (6 columns) - override mobile for md breakpoint
        if (index === 3) {
          positionClasses = cn(positionClasses, 'md:col-span-2 md:row-start-2 md:col-start-2'); // Fourth card: columns 2-3, row 2
        }
        if (index === 4) {
          positionClasses = cn(positionClasses, 'md:col-span-2 md:row-start-2 md:col-start-4'); // Fifth card: columns 4-5, row 2
        }
        
        // First row: cards 1, 2, 3 each span 2 columns (positions 1-2, 3-4, 5-6)
        // Second row: cards 4, 5 span 2 columns each (positions 2-3, 4-5)
        if (index === 0) {
          // First card: columns 1-2, row 1
          positionClasses = cn(positionClasses, 'md:col-span-2 md:row-start-1 md:col-start-1');
        } else if (index === 1) {
          // Second card: columns 3-4, row 1  
          positionClasses = cn(positionClasses, 'md:col-span-2 md:row-start-1 md:col-start-3');
        } else if (index === 2) {
          // Third card: columns 5-6, row 1
          positionClasses = cn(positionClasses, 'md:col-span-2 md:row-start-1 md:col-start-5');
        }
        
        return (
          <div
            key={`${item.title}-${index}`}
            className={cn(
              positionClasses,
              // Add subtle hover effects for visual appeal
              'transition-all duration-300 ease-in-out',
              'hover:scale-[1.02] hover:shadow-lg',
              // Ensure proper aspect ratio and sizing
              'min-h-[120px] sm:min-h-[140px] md:min-h-[160px]',
            )}
          >
            <PerformanceCard
              item={item}
              isLoading={isLoading}
              isMobile={isMobile}
              bgColor={bgColorClass}
            />
          </div>
        );
      })}
    </div>
  );
};
