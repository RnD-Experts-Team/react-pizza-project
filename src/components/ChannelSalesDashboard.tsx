import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChannelList } from '@/components/channelSales/ChannelList';
import { useChannelSalesData } from '@/hooks/useChannelSalesData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ChannelDataProps } from '@/types/channelSales';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface ChannelSalesDashboardProps {
  title?: string;
  channels?: ChannelDataProps[];
  className?: string;
  showIcons?: boolean;
  showTrendArrows?: boolean;
}

export const ChannelSalesDashboard: React.FC<ChannelSalesDashboardProps> = ({
  title = 'Channel Sales',
  channels: externalChannels,
  className,
  showIcons = true,
  showTrendArrows = true,
}) => {
  const { channels: hookChannels } = useChannelSalesData();
  const isMobile = useIsMobile();
  const channels = externalChannels || hookChannels;

  // Sample data for pie chart
  const pieData = [
    { name: 'Online', value: 400, fill: '#0088FE' },
    { name: 'Retail', value: 300, fill: '#00C49F' },
    { name: 'Mobile', value: 300, fill: '#FFBB28' },
    { name: 'Direct', value: 200, fill: '#FF8042' },
  ];

  // Custom label function
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={cn(
      'w-full grid grid-cols-1 gap-8 p-2 overflow-hidden',
      isMobile ? 'grid-cols-1' : 'grid-cols-2'
    )}>
      {/* Channel Sales Card */}
      <Card
        className={cn(
          'shadow-realistic-lg flex-shrink-0 overflow-hidden',
          // Responsive sizing
          isMobile ? 'w-full' : 'w-full',
          className,
        )}
      >
        <CardHeader
          className={cn(
            'bg-channel-header text-channel-header-foreground rounded-t-lg',
            // Responsive padding
            isMobile ? 'p-3' : 'p-6',
          )}
        >
          <CardTitle
            className={cn(
              'font-bold text-center',
              // Responsive text size
              isMobile ? 'text-base' : 'text-lg md:text-xl',
            )}
          >
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Channel List */}
          <ChannelList
            channels={channels}
            showIcons={showIcons}
            showTrendArrows={showTrendArrows}
          />
        </CardContent>
      </Card>

      {/* Pie Chart Card */}
      <Card className={cn(
        'shadow-realistic-lg flex-1 overflow-hidden',
        isMobile ? 'w-full' : 'w-full'
      )}>
        <CardHeader className={cn(
          'bg-channel-header text-channel-header-foreground rounded-t-lg',
          isMobile ? 'p-3' : 'p-6'
        )}>
          <CardTitle className={cn(
            'font-bold text-center',
            isMobile ? 'text-base' : 'text-lg md:text-xl'
          )}>
            Sales Distribution
          </CardTitle>
        </CardHeader>
        
        <CardContent className={cn(
          'p-4 overflow-hidden',
          isMobile ? 'h-64' : 'h-80'
        )}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
