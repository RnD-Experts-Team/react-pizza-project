import { useState } from 'react';
import type { ChannelDataProps } from '@/types/channelSales';

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

export const useChannelSalesData = () => {
  const [channels, setChannels] = useState<ChannelDataProps[]>(defaultChannels);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setChannels([...defaultChannels]);
    setIsLoading(false);
  };

  return { channels, isLoading, refreshData };
};
