import { 
  ChartBarIcon, 
  ArrowPathIcon, 
  PencilIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';

export interface PerformanceItemProps {
  title: string;
  bgColor: string;
  icon: keyof typeof iconMap;
  daily: string;
  weekly: string;
}

export interface InfoSectionProps {
  title?: string;
  data?: PerformanceItemProps[];
  className?: string;
}

// Map your custom names to actual Heroicons
export const iconMap = {
  FlowbiteChartLineDownOutline: ChartBarIcon,
  IconParkOutlineRecycling: ArrowPathIcon,
  TablerPlusMinus: PlusIcon,
  Fa6SolidPencil: PencilIcon,
} as const;
