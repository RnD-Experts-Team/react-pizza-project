import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ChannelDataProps, iconMap } from '@/types/channelSales';
import { GlobeAltIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface ChannelItemProps {
  channel: ChannelDataProps;
  showIcon?: boolean;
  showTrendArrow?: boolean;
  isLast?: boolean;
  isMobile?: boolean;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  showIcon = true, 
  showTrendArrow = true, 
  isLast = false,
  isMobile = false
}) => {
  const IconComponent = channel.icon ? channel.icon : GlobeAltIcon;
  const TrendIcon = channel.trend === 'up' ? ChevronUpIcon : ChevronDownIcon;
  
  const getPercentageColor = (variant: string) => {
    switch (variant) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-blue-500';
  };

  return (
    <div className="space-y-2">
      <div className={cn(
        "flex items-center justify-between",
        // Responsive padding
        isMobile ? "px-2 py-1" : "px-2.5 py-1"
      )}>
        {/* Left: Icon */}
        {showIcon && (
          <ChannelIcon 
            IconComponent={IconComponent} 
            isMobile={isMobile} 
          />
        )}

        {/* Center: Channel Info */}
        <ChannelInfo 
          channel={channel} 
          getPercentageColor={getPercentageColor}
          isMobile={isMobile}
        />

        {/* Center Right: Financial Data */}
        <FinancialData 
          channel={channel} 
          isMobile={isMobile}
        />

        {/* Right: Trend Arrow */}
        {showTrendArrow && (
          <TrendArrow 
            TrendIcon={TrendIcon}
            trend={channel.trend}
            getTrendColor={getTrendColor}
            isMobile={isMobile}
          />
        )}
      </div>
      
      {!isLast && (
        <Separator className={cn(
          isMobile ? "mx-2" : "mx-2.5"
        )} />
      )}
    </div>
  );
};

// Sub-components
interface ChannelIconProps {
  IconComponent: React.ComponentType<any>;
  isMobile: boolean;
}

const ChannelIcon: React.FC<ChannelIconProps> = ({ IconComponent, isMobile }) => (
  <div className={cn(
    "flex-shrink-0 flex items-center justify-center",
    isMobile ? "w-8 h-8" : "w-10 h-10"
  )}>
    <IconComponent className={cn(
      "text-muted-foreground",
      isMobile ? "w-4 h-4" : "w-6 h-6"
    )} />
  </div>
);

interface ChannelInfoProps {
  channel: ChannelDataProps;
  getPercentageColor: (variant: string) => string;
  isMobile: boolean;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({ 
  channel, 
  getPercentageColor, 
  isMobile 
}) => (
  <div className={cn(
    "flex flex-col items-center justify-center space-y-1",
    isMobile ? "min-w-[60px]" : "min-w-[78px]"
  )}>
    <h3 className={cn(
      "font-bold text-foreground whitespace-nowrap",
      isMobile ? "text-xs" : "text-sm md:text-base"
    )}>
      {channel.name}
    </h3>
    <Badge 
      variant={channel.variant === 'positive' ? 'default' : 'destructive'}
      className={cn(
        "font-normal",
        getPercentageColor(channel.variant || 'neutral'),
        isMobile ? "text-xs px-1 py-0" : "text-xs"
      )}
    >
      {channel.percentage}
    </Badge>
  </div>
);

interface FinancialDataProps {
  channel: ChannelDataProps;
  isMobile: boolean;
}

const FinancialData: React.FC<FinancialDataProps> = ({ channel, isMobile }) => (
  <div className={cn(
    "flex flex-col items-center justify-center space-y-1",
    isMobile ? "min-w-[50px]" : "min-w-[66px]"
  )}>
    <span className={cn(
      "font-bold text-foreground whitespace-nowrap",
      isMobile ? "text-xs" : "text-sm md:text-base"
    )}>
      {channel.price}
    </span>
    <span className={cn(
      "text-muted-foreground whitespace-nowrap",
      isMobile ? "text-xs" : "text-xs md:text-sm"
    )}>
      {channel.marketShare}
    </span>
  </div>
);

interface TrendArrowProps {
  TrendIcon: React.ComponentType<any>;
  trend?: 'up' | 'down';
  getTrendColor: (trend: string) => string;
  isMobile: boolean;
}

const TrendArrow: React.FC<TrendArrowProps> = ({ 
  TrendIcon, 
  trend, 
  getTrendColor, 
  isMobile 
}) => (
  <div className={cn(
    "flex-shrink-0 flex items-center justify-center",
    isMobile ? "w-8 h-8" : "w-10 h-10"
  )}>
    <TrendIcon 
      className={cn(
        getTrendColor(trend || 'down'),
        isMobile ? "w-4 h-4" : "w-6 h-6"
      )} 
    />
  </div>
);
