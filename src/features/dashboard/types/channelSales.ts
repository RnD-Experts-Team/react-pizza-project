export interface ChannelDataProps {
  id: string;
  name: string;
  daily: string;
  weekly: string;
}

export interface ChannelSalesDashboardProps {
  title?: string;
  channels?: ChannelDataProps[];
  className?: string;
}