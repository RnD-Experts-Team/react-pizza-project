import { useState } from 'react';
import type { CardDataProps } from '@/types/infoCards';

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

export const useInfoCardsData = () => {
  const [data, setData] = useState<CardDataProps[]>(defaultData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setData([...defaultData]); // Create new array reference to trigger re-render
    setIsLoading(false);
  };

  return { data, isLoading, refreshData };
};
