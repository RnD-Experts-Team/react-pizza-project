import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  TruckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface EnhancedChannelDataProps extends ChannelDataProps {
  category: 'delivery' | 'direct' | 'mobile';
  revenue: number;
  growth: number;
}

const enhancedChannels: EnhancedChannelDataProps[] = [
  {
    id: 'doordash',
    name: 'DoorDash',
    percentage: '-3.78%',
    price: '$564.56',
    marketShare: '33.44%',
    icon: 'doordash',
    trend: 'down',
    variant: 'negative',
    category: 'delivery',
    revenue: 564.56,
    growth: -3.78
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
    category: 'mobile',
    revenue: 523.26,
    growth: 14.43
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
    category: 'direct',
    revenue: 338.05,
    growth: -36.45
  }
  // ... add other channels
];

const ChannelCard: React.FC<{
  channel: EnhancedChannelDataProps;
  showProgress?: boolean;
}> = ({ channel, showProgress = false }) => {
  const IconComponent = channel.icon ? iconMap[channel.icon] : GlobeAltIcon;
  const TrendIcon = channel.trend === 'up' ? ChevronUpIcon : ChevronDownIcon;
  
  const progressValue = Math.abs(channel.growth);
  const maxValue = Math.max(...enhancedChannels.map(c => Math.abs(c.growth)));
  const normalizedProgress = (progressValue / maxValue) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-full">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{channel.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">
                {channel.category}
              </p>
            </div>
          </div>
          <TrendIcon 
            className={cn(
              "w-5 h-5",
              channel.trend === 'up' ? 'text-green-600' : 'text-red-500'
            )} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{channel.price}</span>
            <Badge 
              variant={channel.variant === 'positive' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {channel.percentage}
            </Badge>
          </div>
          
          {showProgress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Market Share</span>
                <span>{channel.marketShare}</span>
              </div>
              <Progress 
                value={parseFloat(channel.marketShare)} 
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedChannelSalesDashboard: React.FC<{
  title?: string;
  channels?: EnhancedChannelDataProps[];
  className?: string;
}> = ({
  title = "Channel Sales Dashboard",
  channels = enhancedChannels,
  className
}) => {
  const categories = ['all', 'delivery', 'direct', 'mobile'] as const;
  
  const getFilteredChannels = (category: string) => {
    if (category === 'all') return channels;
    return channels.filter(channel => channel.category === category);
  };

  const getTotalRevenue = (channelList: EnhancedChannelDataProps[]) => {
    return channelList.reduce((sum, channel) => sum + channel.revenue, 0);
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <ChartBarIcon className="w-6 h-6" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => {
            const filteredChannels = getFilteredChannels(category);
            const totalRevenue = getTotalRevenue(filteredChannels);
            
            return (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredChannels.map((channel) => (
                    <ChannelCard 
                      key={channel.id} 
                      channel={channel} 
                      showProgress={true}
                    />
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-semibold">Total Revenue</span>
                    </div>
                    <span className="text-xl font-bold">
                      ${totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
