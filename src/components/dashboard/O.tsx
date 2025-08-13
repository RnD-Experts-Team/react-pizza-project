import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  TruckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

// Icon mapping for different channel types
const iconMap = {
  ubereats: TruckIcon,
  doordash: TruckIcon,
  grubhub: TruckIcon,
  phone: DevicePhoneMobileIcon,
  mobile: DevicePhoneMobileIcon,
  website: GlobeAltIcon,
  desktop: ComputerDesktopIcon,
} as const;

interface ChannelDataProps {
  id: string;
  name: string;
  percentage: string;
  price: string;
  marketShare: string;
  icon?: keyof typeof iconMap;
  trend?: 'up' | 'down';
  variant?: 'positive' | 'negative' | 'neutral';
}

interface ChannelSalesDashboardProps {
  title?: string;
  channels?: ChannelDataProps[];
  className?: string;
  showIcons?: boolean;
  showTrendArrows?: boolean;
}

const defaultChannels: ChannelDataProps[] = [
  {
    id: 'doordash',
    name: 'DoorDash',
    percentage: '-3.78%',
    price: '$564.56',
    marketShare: '33.44%',
    icon: 'doordash',
    trend: 'down',
    variant: 'negative',
  },
  {
    id: 'grubhub',
    name: 'GrubHub',
    percentage: '-17.11%',
    price: '$31.63',
    marketShare: '1.83%',
    icon: 'grubhub',
    trend: 'down',
    variant: 'negative',
  },
  {
    id: 'mobile',
    name: 'Mobile',
    percentage: '+14.43%',
    price: '$523.26',
    marketShare: '30.31%',
    icon: 'mobile',
    trend: 'up',
    variant: 'positive',
  },
  {
    id: 'phone',
    name: 'Phone',
    percentage: '+50.7%',
    price: '$235.79',
    marketShare: '13.66%',
    icon: 'phone',
    trend: 'up',
    variant: 'positive',
  },
  {
    id: 'ubereats',
    name: 'UberEats',
    percentage: '-57.5%',
    price: '$20.72',
    marketShare: '1.2%',
    icon: 'ubereats',
    trend: 'down',
    variant: 'negative',
  },
  {
    id: 'website',
    name: 'Website',
    percentage: '-36.45%',
    price: '$338.05',
    marketShare: '19.58%',
    icon: 'website',
    trend: 'down',
    variant: 'negative',
  },
];

const ChannelItem: React.FC<{
  channel: ChannelDataProps;
  showIcon?: boolean;
  showTrendArrow?: boolean;
  isLast?: boolean;
}> = ({ channel, showIcon = true, showTrendArrow = true, isLast = false }) => {
  const IconComponent = channel.icon ? iconMap[channel.icon] : GlobeAltIcon;
  const TrendIcon = channel.trend === 'up' ? ChevronUpIcon : ChevronDownIcon;

  const getPercentageColor = (variant: string) => {
    switch (variant) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2.5 py-1">
        {/* Left: Icon */}
        {showIcon && (
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* Center: Channel Info */}
        <div className="flex flex-col items-center justify-center min-w-[78px] space-y-1">
          <h3 className="text-sm md:text-base font-bold text-foreground whitespace-nowrap">
            {channel.name}
          </h3>
          <Badge
            variant={channel.variant === 'positive' ? 'default' : 'destructive'}
            className={cn(
              'text-xs font-normal',
              getPercentageColor(channel.variant || 'neutral'),
            )}
          >
            {channel.percentage}
          </Badge>
        </div>

        {/* Center Right: Financial Data */}
        <div className="flex flex-col items-center justify-center min-w-[66px] space-y-1">
          <span className="text-sm md:text-base font-bold text-foreground whitespace-nowrap">
            {channel.price}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
            {channel.marketShare}
          </span>
        </div>

        {/* Right: Trend Arrow */}
        {showTrendArrow && (
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <TrendIcon
              className={cn('w-6 h-6', getTrendColor(channel.trend || 'down'))}
            />
          </div>
        )}
      </div>

      {!isLast && <Separator className="mx-2.5" />}
    </div>
  );
};

export const ChannelSalesDashboard: React.FC<ChannelSalesDashboardProps> = ({
  title = 'Channel Sales',
  channels = defaultChannels,
  className,
  showIcons = true,
  showTrendArrows = true,
}) => {
  return (
    <Card className={cn('w-full max-w-md mx-auto shadow-lg', className)}>
      <CardHeader className="bg-[#7f675b] text-white rounded-t-lg">
        <CardTitle className="text-lg md:text-xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-0">
          {channels.map((channel, index) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              showIcon={showIcons}
              showTrendArrow={showTrendArrows}
              isLast={index === channels.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
