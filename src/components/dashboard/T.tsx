import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  ChartBarIcon, 
  ArrowPathIcon, 
   
  PencilIcon 
} from '@heroicons/react/24/outline';

// Icon mapping for better type safety and easier maintenance
const iconMap = {
  FlowbiteChartLineDownOutline: ChartBarIcon,
  IconParkOutlineRecycling: ArrowPathIcon,
  TablerPlusMinus: PencilIcon,
  Fa6SolidPencil: PencilIcon,
} as const;

interface PerformanceItemProps {
  title: string;
  bgColor: string;
  icon: keyof typeof iconMap;
  daily: string;
  weekly: string;
}

interface InfoSectionProps {
  title?: string;
  data?: PerformanceItemProps[];
  className?: string;
}

const defaultData: PerformanceItemProps[] = [
  {
    title: 'Waste Altmetrics',
    bgColor: 'bg-blue-500',
    icon: 'FlowbiteChartLineDownOutline',
    daily: '$5',
    weekly: '$24',
  },
  {
    title: 'Waste Gateway',
    bgColor: 'bg-blue-400',
    icon: 'IconParkOutlineRecycling',
    daily: '$0',
    weekly: '$1,117.54',
  },
  {
    title: 'Over / Short',
    bgColor: 'bg-blue-300',
    icon: 'TablerPlusMinus',
    daily: '$4.49',
    weekly: '$0',
  },
  {
    title: 'Modified Orders',
    bgColor: 'bg-green-200',
    icon: 'Fa6SolidPencil',
    daily: '$0',
    weekly: '$0',
  },
];

const PerformanceCard: React.FC<{ item: PerformanceItemProps }> = ({ item }) => {
  const IconComponent = iconMap[item.icon];
  
  return (
    <Card className="w-full h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader 
        className={cn(
          "flex flex-row items-center justify-between space-y-0 pb-2 rounded-t-md",
          item.bgColor
        )}
      >
        <CardTitle className="text-sm font-medium text-foreground">
          {item.title}
        </CardTitle>
        <IconComponent className="h-5 w-5 text-foreground" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            Daily
          </span>
          <span className="text-sm font-bold text-foreground">
            {item.daily}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Weekly
          </span>
          <span className="text-sm text-foreground">
            {item.weekly}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const InfoSection: React.FC<InfoSectionProps> = ({ 
  title = "Sales Performance Overview",
  data = defaultData,
  className
}) => {
  return (
    <section className={cn(
      "w-full p-4 md:p-6 lg:p-8 space-y-6",
      className
    )}>
      <header className="text-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h1>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {data.map((item, index) => (
          <PerformanceCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};
