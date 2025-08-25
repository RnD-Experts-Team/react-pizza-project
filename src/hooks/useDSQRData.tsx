import { useState } from 'react';
import type { PlatformCardProps } from '@/types/dsqr';

const defaultPlatforms: PlatformCardProps[] = [
  {
    iconSrc: '/doordash-svgrepo-com.svg',
    title: 'Doordash',
    data: [
      { label: 'Most Loved Restaurant', value: '0' },
      { label: 'Optimization Score', value: 'Med' },
      { label: '#1 Top Missing or Incorrect Item', value: '0' },
      { label: 'Reviews Responded', value: '1' },
    ],
    metrics: [
      {
        label: 'Ratings - Average Rating',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Cancellations - Sales Lost',
        value: '0',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Missing or Incorrect Error Charges',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Avoidable Wait M.Sec',
        value: '1',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'total Dasher Wait M.Sec',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Downtime H.MM',
        value: '1',
        status: 'NA',
        statusColor: '#c30000',
      },
    ],
    hasOnTrack: true,
    onTrackPosition: 'middle',
  },
  {
    iconSrc: '/ubereats-svgrepo-com.svg',
    title: 'UberEats',
    data: [
      { label: 'Top Inaccurate item', value: '0' },
      { label: 'Reviews Responded', value: '1' },
    ],
    metrics: [
      {
        label: 'Customer reviews overview',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Cost of Refunds',
        value: '0',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Unfulfilled order rate',
        value: '0',
        status: 'OT',
        statusColor: '#14cd24',
      },
      {
        label: 'Time unavailable during\nopen hours hh.mm',
        value: '0',
        status: 'OT',
        statusColor: '#00c610',
        multiline: true,
      },
    ],
    hasOnTrack: true,
    onTrackPosition: 'middle',
  },
  {
    iconSrc: '/grubhub-svgrepo-com.svg',
    title: 'GrubHub',
    data: null,
    metrics: [
      {
        label: 'Rating',
        value: '4',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Food was good',
        value: '0.83',
        status: 'NA',
        statusColor: '#c30000',
      },
      {
        label: 'Delivery was on time',
        value: '1',
        status: 'OT',
        statusColor: '#00c610',
      },
      {
        label: 'Order was accurate',
        value: '0.91',
        status: 'NA',
        statusColor: '#c30000',
      },
    ],
    hasOnTrack: true,
    onTrackPosition: 'top',
  },
];

export const useDSQRData = () => {
  const [platforms, setPlatforms] =
    useState<PlatformCardProps[]>(defaultPlatforms);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPlatforms([...defaultPlatforms]);
    setIsLoading(false);
  };

  return { platforms, isLoading, refreshData };
};
