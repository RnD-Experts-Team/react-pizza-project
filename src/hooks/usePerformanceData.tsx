import { useState, useEffect } from 'react';
import type { PerformanceItemProps } from '@/types/performance';


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

export const usePerformanceData = () => {
  const [data, setData] = useState<PerformanceItemProps[]>(defaultData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setData([...defaultData]); // Create new array reference to trigger re-render
    setIsLoading(false);
  };

  return { data, isLoading, refreshData };
};
