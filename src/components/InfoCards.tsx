import React from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PerformanceGrid } from '@/components/performance/PerformanceGrid';
import { useInfoCardsData } from '@/hooks/useInfoCardsData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CardDataProps } from '@/types/infoCards';
import type { PerformanceItemProps } from '@/types/performance';
import { Button } from '@/components/ui/button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InfoCardsProps {
  title?: string;
  subtitle?: string;
  data?: CardDataProps[];
  className?: string;
  showRefresh?: boolean;
}

export const InfoCards: React.FC<InfoCardsProps> = ({
  title = 'Business Overview',
  subtitle,
  data: externalData,
  className,
  showRefresh = true,
}) => {
  const { data: hookData, isLoading, refreshData } = useInfoCardsData();
  const isMobile = useIsMobile();
  const data = externalData || hookData;

  // Transform CardDataProps to PerformanceItemProps
  const transformedData: PerformanceItemProps[] = data.map((card) => ({
    title: card.title,
    daily: card.daily,
    weekly: card.weekly,
    bgColor: card.bgColor || '#f3f4f6',
    icon: 'FlowbiteChartLineDownOutline' as const, // Default icon
  }));

  // Random data for the bar chart
  const chartData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <section
      className={cn(
        'w-full',
        // Responsive padding and spacing
        isMobile ? 'p-2 space-y-2' : 'p-2 space-y-6',
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
              Refresh
            </Button>
          ) : null
        }
      />

      {/* Main content area with cards on top and chart below */}
      <div className="flex flex-col gap-6">
        {/* Top - Cards */}
        <div className="w-full">
          <PerformanceGrid
            data={transformedData}
            isLoading={isLoading}
          />
        </div>

        {/* Bottom - Bar Chart */}
        <div
          className={cn(
            'w-full bg-card rounded-lg border border-border p-4 shadow-realistic overflow-hidden',
            isMobile ? 'h-48' : 'h-72',
          )}
        >
          <h3 className="text-lg font-semibold mb-4 text-card-foreground truncate">
            Performance Chart
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--popover-foreground)'
                }}
              />
              <Legend />
              <Bar dataKey="pv" fill="var(--chart-1)" />
              <Bar dataKey="uv" fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
