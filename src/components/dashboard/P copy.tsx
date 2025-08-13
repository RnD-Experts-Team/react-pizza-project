import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Icon mapping for different card types
const iconMap = {
  currency: CurrencyDollarIcon,
  chart: ChartBarIcon,
  trophy: TrophyIcon,
  trending: ArrowTrendingUpIcon,
} as const;

interface CardDataProps {
  title: string;
  daily: string;
  weekly: string;
  icon?: keyof typeof iconMap;
  bgColor?: string;
  id?: string;
}

interface InfoCardsProps {
  data?: CardDataProps[];
  className?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showIcons?: boolean;
}

const defaultData: CardDataProps[] = [
  {
    title: 'Total Tips',
    daily: '$13.91',
    weekly: '$70.22',
    icon: 'currency',
    id: 'tips-1',
  },
  {
    title: 'Total Sales',
    daily: '$13.91',
    weekly: '$70.22',
    icon: 'chart',
    id: 'sales-1',
  },
  {
    title: 'Performance',
    daily: '$13.91',
    weekly: '$70.22',
    icon: 'trophy',
    id: 'performance-1',
  },
  {
    title: 'Growth',
    daily: '$13.91',
    weekly: '$70.22',
    icon: 'trending',
    id: 'growth-1',
  },
];

const InfoCard: React.FC<{
  card: CardDataProps;
  showIcon?: boolean;
  className?: string;
}> = ({ card, showIcon = true, className }) => {
  const IconComponent = card.icon ? iconMap[card.icon] : CurrencyDollarIcon;

  return (
    <Card
      className={cn(
        'w-full h-full min-h-[150px] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base md:text-lg font-medium text-foreground">
          {card.title}
        </CardTitle>
        {showIcon && (
          <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold text-muted-foreground">
            Daily
          </span>
          <span className="text-lg md:text-xl font-bold text-foreground">
            {card.daily}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base md:text-lg text-muted-foreground">
            Weekly
          </span>
          <span className="text-base md:text-lg text-foreground">
            {card.weekly}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const InfoCards: React.FC<InfoCardsProps> = ({
  data = defaultData,
  className,
  columns = {
    sm: 1,
    md: 2,
    lg: 2,
    xl: 4,
  },
  showIcons = true,
}) => {
  const gridClasses = cn(
    'grid gap-4 md:gap-6 w-full',
    `grid-cols-${columns.sm}`,
    `md:grid-cols-${columns.md}`,
    `lg:grid-cols-${columns.lg}`,
    `xl:grid-cols-${columns.xl}`,
  );

  return (
    <div className={cn(gridClasses, className)}>
      {data.map((card, index) => (
        <InfoCard key={card.id || index} card={card} showIcon={showIcons} />
      ))}
    </div>
  );
};
