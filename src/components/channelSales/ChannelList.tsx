import React from 'react';
import { ChannelItem } from './ChannelItem';
import type { ChannelDataProps } from '@/types/channelSales';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChannelListProps {
  channels: ChannelDataProps[];
  showIcons?: boolean;
  showTrendArrows?: boolean;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  showIcons = true,
  showTrendArrows = true,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-0">
      {channels.map((channel, index) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          showIcon={showIcons}
          showTrendArrow={showTrendArrows}
          isLast={index === channels.length - 1}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
