import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChannelList } from '@/components/channelSales/ChannelList';
import { useChannelSalesData } from '@/hooks/useChannelSalesData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ChannelDataProps } from '@/types/channelSales';

interface ChannelSalesDashboardProps {
  title?: string;
  channels?: ChannelDataProps[];
  className?: string;
  showIcons?: boolean;
  showTrendArrows?: boolean;
}

export const ChannelSalesDashboard: React.FC<ChannelSalesDashboardProps> = ({
  title = "Channel Sales",
  channels: externalChannels,
  className,
  showIcons = true,
  showTrendArrows = true
}) => {
  const { channels: hookChannels } = useChannelSalesData();
  const isMobile = useIsMobile();
  const channels = externalChannels || hookChannels;

  return (
    <Card className={cn(
      "w-full shadow-lg",
      // Responsive max width
      isMobile ? "max-w-sm mx-auto" : "max-w-md mx-auto",
      className
    )}>
      <CardHeader className={cn(
        "bg-[#7f675b] text-white rounded-t-lg",
        // Responsive padding
        isMobile ? "p-3" : "p-6"
      )}>
        <CardTitle className={cn(
          "font-bold text-center",
          // Responsive text size
          isMobile ? "text-base" : "text-lg md:text-xl"
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ChannelList
          channels={channels}
          showIcons={showIcons}
          showTrendArrows={showTrendArrows}
        />
      </CardContent>
    </Card>
  );
};
