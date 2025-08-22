import React from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { InfoCardsGrid } from '@/components/infoCards/InfoCardsGrid';
import { useInfoCardsData } from '@/hooks/useInfoCardsData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CardDataProps } from '@/types/infoCards';
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
  showIcons?: boolean;
  showRefresh?: boolean;
}

export const InfoCards: React.FC<InfoCardsProps> = ({
  title = 'Business Overview',
  subtitle,
  data: externalData,
  className,
  showIcons = true,
  showRefresh = true,
}) => {
  const { data: hookData, isLoading, refreshData } = useInfoCardsData();
  const isMobile = useIsMobile();
  const data = externalData || hookData;

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
        isMobile ? 'p-2 space-y-3' : 'p-4 md:p-6 lg:p-8 space-y-6',
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

      {/* Main content area with cards on left and chart on right */}
      <div className={cn('flex gap-6', isMobile ? 'flex-col' : 'flex-row')}>
        {/* Left side - Cards */}
        <div className={cn('flex-shrink-0', isMobile ? 'w-full' : 'w-1/2')}>
          <InfoCardsGrid
            data={data}
            showIcons={showIcons}
            isLoading={isLoading}
          />
        </div>

        {/* Right side - Bar Chart */}
        <div
          className={cn(
            'flex-1 bg-white rounded-lg border p-4',
            isMobile ? 'h-64' : 'h-96',
          )}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
