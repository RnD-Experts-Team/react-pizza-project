import {
  ChartBarIcon,
  ArrowPathIcon,
  PencilIcon,
  PlusIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ComputerDesktopIcon,
  MicrophoneIcon,
  ClockIcon,
  DocumentTextIcon,
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
  currency: CurrencyDollarIcon,
  trophy: TrophyIcon,
  trending: ArrowTrendingUpIcon,
  users: UsersIcon,
  arrowUp: ArrowUpIcon,
  checkCircle: CheckCircleIcon,
  computer: ComputerDesktopIcon,
  microphone: MicrophoneIcon,
  clock: ClockIcon,
  document: DocumentTextIcon,
} as const;
