import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import type { InfoCardsProps } from '@/types/infoCards';

interface CardDataProps {
  title: string;
  daily: string;
  weekly: string;
  icon?: keyof typeof iconMap;
  variant?: 'default' | 'success' | 'warning' | 'info';
  trend?: 'up' | 'down' | 'neutral';
  id?: string;
}

const iconMap = {
  currency: CurrencyDollarIcon,
  chart: ChartBarIcon,
  trophy: TrophyIcon,
  trending: ArrowTrendingUpIcon,
} as const;

const variantStyles = {
  default: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
  success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
  info: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
};

const EnhancedInfoCard: React.FC<{
  card: CardDataProps;
  showIcon?: boolean;
}> = ({ card, showIcon = true }) => {
  const IconComponent = card.icon ? iconMap[card.icon] : CurrencyDollarIcon;
  const variant = card.variant || 'default';

  return (
    <Card
      className={cn(
        'w-full h-full min-h-[150px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]',
        variantStyles[variant],
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm md:text-base font-semibold text-foreground">
            {card.title}
          </CardTitle>
          {card.trend && (
            <Badge
              variant={
                card.trend === 'up'
                  ? 'default'
                  : card.trend === 'down'
                    ? 'destructive'
                    : 'secondary'
              }
              className="text-xs"
            >
              {card.trend}
            </Badge>
          )}
        </div>
        {showIcon && (
          <div className="p-2 rounded-md bg-white/50">
            <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-md">
          <span className="text-sm md:text-base font-semibold text-muted-foreground">
            Daily
          </span>
          <span className="text-lg md:text-xl font-bold text-foreground">
            {card.daily}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/30 rounded-md">
          <span className="text-sm md:text-base text-muted-foreground">
            Weekly
          </span>
          <span className="text-base md:text-lg font-semibold text-foreground">
            {card.weekly}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const InfoCards: React.FC<InfoCardsProps> = ({
  data = [
    {
      title: 'Total Tips',
      daily: '$13.91',
      weekly: '$70.22',
      icon: 'currency',
      variant: 'success',
      trend: 'up',
      id: 'tips-1',
    },
    {
      title: 'Total Sales',
      daily: '$13.91',
      weekly: '$70.22',
      icon: 'chart',
      variant: 'info',
      trend: 'up',
      id: 'sales-1',
    },
    {
      title: 'Performance',
      daily: '$13.91',
      weekly: '$70.22',
      icon: 'trophy',
      variant: 'warning',
      trend: 'neutral',
      id: 'performance-1',
    },
    {
      title: 'Growth',
      daily: '$13.91',
      weekly: '$70.22',
      icon: 'trending',
      variant: 'default',
      trend: 'up',
      id: 'growth-1',
    },
  ],
  className,
  // columns = {
  //   sm: 1,
  //   md: 2,
  //   lg: 2,
  //   xl: 4
  // },
  showIcons = true,
}) => {
  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6 w-full',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      {data.map((card, index) => (
        <EnhancedInfoCard
          key={card.id || index}
          card={card as CardDataProps}
          showIcon={showIcons}
        />
      ))}
    </div>
  );
};
