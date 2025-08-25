import React from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PerformanceGrid } from '@/components/performance/PerformanceGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import type { PerformanceItemProps } from '@/types/performance';

import { Button } from '@/components/ui/button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface CustomerServiceOverviewProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showRefresh?: boolean;
}

export const CustomerServiceOverview: React.FC<CustomerServiceOverviewProps> = ({
  title = 'Customer Services Overview',
  subtitle,
  className,
  showRefresh = true,
}) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // First row of metrics
  const firstRowData: PerformanceItemProps[] = [
    {
      title: 'Customer Count',
      bgColor: 'bg-performance-bg-1',
      icon: 'users',
      daily: '199',
      weekly: '658',
    },
    {
      title: 'Customer Count %',
      bgColor: 'bg-performance-bg-2',
      icon: 'trending',
      daily: '75%',
      weekly: '85%',
    },
    {
      title: 'Upselling %',
      bgColor: 'bg-performance-bg-3',
      icon: 'arrowUp',
      daily: '0%',
      weekly: '100%',
    },
    {
      title: 'Digital Sales %',
      bgColor: 'bg-performance-bg-4',
      icon: 'computer',
      daily: '33%',
      weekly: '35.33%',
    },
  ];

  // Second row of metrics
  const secondRowData: PerformanceItemProps[] = [
    {
      title: 'Customer Service %',
      bgColor: 'bg-performance-bg-5',
      icon: 'microphone',
      daily: '91%',
      weekly: '93.89%',
    },
    {
      title: 'Put Into Portal %',
      bgColor: 'bg-performance-bg-6',
      icon: 'arrowUp',
      daily: '100%',
      weekly: '99.33%',
    },
    {
      title: 'In Portal On Time %',
      bgColor: 'bg-performance-bg-7',
      icon: 'clock',
      daily: '98%',
      weekly: '97.33%',
    },
    {
      title: 'Portal Eligible Transactions',
      bgColor: 'bg-performance-bg-8',
      icon: 'document',
      daily: '47',
      weekly: '152',
    },
  ];

  return (
    <section
      className={cn(
        'w-full p-2 space-y-2',
        // Responsive padding and spacing
        isMobile ? ' space-y-2' : ' space-y-6',
        className,
      )}
    >
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actions={
          showRefresh ? (
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'sm'}
              onClick={refreshData}
              disabled={isLoading}
              className={cn('gap-2', isMobile && 'text-xs px-2 py-1')}
            >
              <ArrowPathIcon
                className={cn(
                  isMobile ? 'h-3 w-3' : 'h-4 w-4',
                  isLoading && 'animate-spin',
                )}
              />
              {isMobile ? 'Refresh' : 'Refresh'}
            </Button>
          ) : null
        }
      />

      {/* First Performance Grid */}
      <PerformanceGrid className='pb-2' data={firstRowData} isLoading={isLoading} />
      
      {/* Second Performance Grid */}
      <PerformanceGrid data={secondRowData} isLoading={isLoading} />
    </section>
  );
};