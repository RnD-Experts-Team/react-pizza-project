import {
  CurrencyDollarIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export interface CardDataProps {
  title: string;
  daily: string;
  weekly: string;
  icon?: keyof typeof iconMap;
  bgColor?: string;
  id?: string;
}

export interface InfoCardsProps {
  data?: CardDataProps[];
  className?: string;
  showIcons?: boolean;
}

// Icon mapping for different card types
export const iconMap = {
  currency: CurrencyDollarIcon,
  chart: ChartBarIcon,
  trophy: TrophyIcon,
  trending: ArrowTrendingUpIcon,
} as const;
