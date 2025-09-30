import React from 'react';
import { ChannelItem } from '@/features/dashboard/components/channelSales/ChannelItem';
import type { ChannelDataProps } from '@/features/dashboard/types/channelSales';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChannelListProps {
  channels: ChannelDataProps[];
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-0">
      {channels.map((channel, index) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isLast={index === channels.length - 1}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
