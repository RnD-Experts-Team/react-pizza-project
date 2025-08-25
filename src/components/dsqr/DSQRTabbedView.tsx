import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { MetricRow, MetricRowWithStatus } from './MetricRow';
import { OnTrackSection } from './OnTrackSection';
import { useTheme } from '@/hooks/useTheme';
import { getThemeIcon, isDarkTheme } from '@/types/dsqr';
import type { PlatformCardProps } from '@/types/dsqr';

interface DSQRTabbedViewProps {
  platforms: PlatformCardProps[];
  className?: string;
}

// Transform platform data to match the tabbed format
const transformPlatformData = (platform: PlatformCardProps) => {
  return {
    name: platform.title,
    basicMetrics: (platform.data || []).map((item) => ({
      label: item.label,
      value: item.value,
      line: item.line,
    })),
    detailedMetrics: (platform.metrics || []).map((metric) => ({
      label: metric.label,
      value: metric.value,
      status: metric.status,
      statusColor: metric.statusColor,
      line: metric.line,
    })),
    hasOnTrack: platform.hasOnTrack,
    onTrackPosition: platform.onTrackPosition,
  };
};

export const DSQRTabbedView: React.FC<DSQRTabbedViewProps> = ({
  platforms,
  className,
}) => {
  const { theme } = useTheme();
  const initialTab =
    platforms[0]?.title.toLowerCase().replace(/\s+/g, '') || 'platform-0';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Determine if we should use dark icons
  const shouldUseDarkIcon =
    theme === 'dark' || (theme === 'system' && isDarkTheme());

  // Get the appropriate icon based on theme
  const getIconSrc = (iconSrc?: string) => {
    if (iconSrc) {
      // If iconSrc is provided, try to determine platform from the path
      if (iconSrc.includes('doordash')) {
        return getThemeIcon('doordash', shouldUseDarkIcon);
      } else if (iconSrc.includes('ubereats')) {
        return getThemeIcon('ubereats', shouldUseDarkIcon);
      } else if (iconSrc.includes('grubhub')) {
        return getThemeIcon('grubhub', shouldUseDarkIcon);
      }
      // If we can't determine the platform, return the original iconSrc
      return iconSrc;
    }
    return getThemeIcon('default', shouldUseDarkIcon);
  };

  return (
    <div className={cn('w-full max-w-full mx-auto p-4', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="grid w-full h-full mb-0 rounded-b-none shadow-realistic"
          style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}
        >
          {platforms.map((platform, index) => {
            const tabValue =
              platform.title.toLowerCase().replace(/\s+/g, '') ||
              `platform-${index}`;

            return (
              <TabsTrigger
                key={tabValue}
                value={tabValue}
                className="text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=inactive]:bg-mute rounded-t-lg rounded-b-none transition-colors duration-200 flex items-center justify-center"
              >
                {platform.iconSrc && platform.iconSrc.includes('doordash') ? (
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M67.6694 72.9947L53.1808 73.0277L36.8629 55.5806L68.2835 55.4204C69.7479 55.413 71.1497 54.8261 72.1826 53.788C73.2154 52.7499 73.7952 51.3451 73.7952 49.8808C73.7952 49.1512 73.6511 48.4288 73.3711 47.7551C73.0911 47.0814 72.6809 46.4696 72.1638 45.9549C71.6468 45.4402 71.0331 45.0327 70.3582 44.7557C69.6832 44.4788 68.9602 44.3379 68.2306 44.3412L27.5848 44.5233L9.375 26.9727L67.62 26.9795C73.7216 26.9802 79.573 29.4045 83.8872 33.7192C88.2014 38.0339 90.6251 43.8857 90.625 49.9872C90.625 56.0802 88.2081 61.9244 83.9046 66.2377C79.6011 70.5509 73.7623 72.981 67.6694 72.9947Z"
                      stroke="currentColor"
                      stroke-width="2.08333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : platform.iconSrc && platform.iconSrc.includes('grubhub') ? (
                  // Your Grubhub SVG or component here
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M69.6167 40.3H66.1167C65.9167 40.3 65.8167 40.5 65.8167 40.6V48.2167H62.3167V40.6C62.3167 40.4 62.1167 40.3 62.0167 40.3H58.5167C58.3167 40.3 58.2167 40.5 58.2167 40.6V60.15C58.2167 60.35 58.4167 60.45 58.5167 60.45H62.0167C62.2167 60.45 62.3167 60.25 62.3167 60.15V52.3333H65.8167V60.15C65.8167 60.35 66.0167 60.45 66.1167 60.45H69.6167C69.8167 60.45 69.9167 60.25 69.9167 60.15V40.6C69.9167 40.5 69.8167 40.3 69.6167 40.3ZM40.1167 40.3H36.6167C36.4167 40.3 36.3167 40.4 36.3167 40.6V54.45C36.3357 55.0245 36.1595 55.5886 35.8167 56.05C35.5167 56.45 35.1167 56.55 34.6167 56.55C34.3935 56.5501 34.1726 56.506 33.9666 56.4202C33.7606 56.3344 33.5737 56.2085 33.4167 56.05C33.0739 55.5886 32.8976 55.0245 32.9167 54.45V40.6C32.9167 40.4 32.7167 40.3 32.6167 40.3H29.1167C28.9167 40.3 28.8167 40.4 28.8167 40.6V54.55C28.8167 56.35 29.2167 58.05 30.3167 59.1667C31.4167 60.2667 32.9167 60.8667 34.6333 60.8667C36.4333 60.8667 37.95 60.2667 38.95 59.1667C40.05 58.0667 40.45 56.4667 40.45 54.55V40.6C40.4333 40.5 40.3333 40.3 40.1167 40.3ZM5.81667 40C4.01667 40 2.5 40.6 1.5 41.7C0.4 42.8 0 44.4 0 46.3167V54.65C0 56.45 0.4 58.15 1.5 59.2667C2.6 60.3667 4.1 60.9667 5.81667 60.9667C7.61667 60.9667 9.13333 60.3667 10.1333 59.2667C11.2333 58.1667 11.6333 56.5667 11.6333 54.65V50.05C11.6274 49.9459 11.5833 49.8475 11.5095 49.7738C11.4358 49.7 11.3375 49.656 11.2333 49.65H6.11667C6.01252 49.656 5.91421 49.7 5.84045 49.7738C5.76669 49.8475 5.72263 49.9459 5.71667 50.05V53.4667C5.71667 53.6667 5.91667 53.8667 6.11667 53.8667H7.43333V54.6667C7.4539 55.2724 7.27855 55.8685 6.93333 56.3667C6.63333 56.7667 6.23333 56.8667 5.73333 56.8667C5.51019 56.8668 5.28923 56.8227 5.08325 56.7369C4.87727 56.651 4.69036 56.5252 4.53333 56.3667C4.19184 55.8668 4.01685 55.2718 4.03333 54.6667V46.4333C4.03333 45.7333 4.23333 45.1167 4.53333 44.7333C4.83333 44.3333 5.23333 44.2333 5.73333 44.2333C6.21667 44.2333 6.63333 44.4333 6.93333 44.7333C7.23333 45.1333 7.43333 45.7333 7.43333 46.4333V47.2333C7.43333 47.4333 7.63333 47.5333 7.73333 47.5333H11.2333C11.4333 47.5333 11.5333 47.4333 11.5333 47.2333V46.4333C11.5333 44.6333 11.1333 42.9333 10.0333 41.8167C9.13333 40.6 7.51667 40 5.81667 40ZM50.95 55.95C50.65 56.35 50.25 56.45 49.6333 56.45H47.6333V52.2167H49.6333C50.1333 52.2167 50.5333 52.4167 50.8333 52.7167C51.1625 53.15 51.3375 53.675 51.3333 54.2167C51.3667 55.05 51.2667 55.5333 50.95 55.95ZM49.4333 44.4167C49.9333 44.4167 50.3333 44.5167 50.6333 44.9167C50.9333 45.2167 51.0333 45.7167 51.0333 46.3333C51.0333 46.95 50.9333 47.4333 50.6333 47.8333C50.3458 48.137 49.9511 48.3164 49.5333 48.3333H47.7333V44.4167H49.4333ZM53.45 50.1333C54.05 49.5333 55.15 48.1333 55.15 46.3167C55.15 44.2 54.35 42.9 53.7333 42.2C52.6333 41 51.1333 40.4 49.4167 40.4H43.9333C43.7333 40.4 43.6333 40.6 43.6333 40.7V60.2667C43.6333 60.4667 43.8333 60.5667 43.9333 60.5667H49.75C51.55 60.5667 53.25 59.8667 54.3667 58.45C54.9667 57.65 55.6833 56.3333 55.6833 54.3333C55.5667 51.9333 54.0667 50.5167 53.45 50.1333ZM21.5667 48.2167C21.2667 48.6167 20.7667 48.8167 20.15 48.8167H18.45V44.4167H20.15C20.75 44.4167 21.25 44.6167 21.5667 45.0167C21.9667 45.4167 22.0667 45.9167 22.0667 46.6167C22.0667 47.3167 21.9833 47.8167 21.5667 48.2167ZM23.7833 51.8333C24.1833 51.5333 24.4833 51.3333 24.7833 50.9333C25.4833 50.1333 26.3833 48.7167 26.3833 46.5167C26.3833 44.4 25.5833 43.0167 24.7833 42.2C23.7833 41 22.2833 40.4 20.5667 40.3H14.75C14.55 40.3 14.45 40.5 14.45 40.6V60.15C14.45 60.35 14.65 60.45 14.75 60.45H18.25C18.45 60.45 18.55 60.25 18.55 60.15V52.9167H19.75L21.9667 60.3333C21.9667 60.4333 22.1667 60.5333 22.2667 60.5333H25.9667C26.0667 60.5333 26.1667 60.4333 26.2667 60.4333C26.3667 60.4333 26.3667 60.2333 26.3667 60.1333L23.7833 51.8333ZM95.1833 55.95C94.8833 56.35 94.4833 56.45 93.8667 56.45H91.8667V52.2167H93.8667C94.3667 52.2167 94.7667 52.4167 95.0667 52.7167C95.3958 53.15 95.5708 53.675 95.5667 54.2167C95.6833 55.05 95.5 55.5333 95.1833 55.95ZM93.7667 44.4167C94.2667 44.4167 94.6667 44.5167 94.9667 44.9167C95.2667 45.2167 95.3667 45.7167 95.3667 46.3333C95.3667 46.95 95.2667 47.4333 94.9667 47.8333C94.6792 48.137 94.2845 48.3164 93.8667 48.3333H92.0667V44.4167H93.7667ZM97.7833 50.1333C98.3833 49.5333 99.4833 48.1333 99.4833 46.3167C99.4833 44.2 98.6833 42.9 98.0667 42.2C96.9667 41 95.4667 40.4 93.75 40.4H88.2167C88.0167 40.4 87.9167 40.6 87.9167 40.7V60.2667C87.9167 60.4667 88.1167 60.5667 88.2167 60.5667H94.0667C95.8667 60.5667 97.5667 59.8667 98.6833 58.45C99.2833 57.65 100 56.3333 100 54.3333C99.9353 53.5194 99.7054 52.7272 99.3242 52.005C98.9431 51.2829 98.4188 50.646 97.7833 50.1333ZM84.35 40.3H80.85C80.65 40.3 80.55 40.4 80.55 40.6V54.45C80.5691 55.0245 80.3928 55.5886 80.05 56.05C79.75 56.45 79.35 56.55 78.85 56.55C78.6269 56.5501 78.4059 56.506 78.1999 56.4202C77.9939 56.3344 77.807 56.2085 77.65 56.05C77.3072 55.5886 77.1309 55.0245 77.15 54.45V40.6C77.15 40.4 76.95 40.3 76.85 40.3H73.3333C73.1333 40.3 73.0333 40.4 73.0333 40.6V54.55C73.0333 56.35 73.4333 58.05 74.5333 59.1667C75.6333 60.2667 77.1333 60.8667 78.85 60.8667C80.65 60.8667 82.1667 60.2667 83.1667 59.1667C84.2667 58.0667 84.6667 56.4667 84.6667 54.55V40.6C84.7667 40.5 84.5667 40.3 84.35 40.3Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : platform.iconSrc &&
                  platform.iconSrc.includes('ubereats') ? (
                  // Your UberEats SVG or component here
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M33.25 71.9792H23.5V52.4583H33.25M23.5 62.2083H29.8542M70.7083 38.5833C70.7083 37.2885 71.2213 36.0464 72.1349 35.1288C73.0486 34.2113 74.2885 33.693 75.5833 33.6875M70.7083 33.6875V46.625M63.375 70.875C64.5099 71.7574 65.9481 72.1543 67.375 71.9792H68.4792C69.3339 71.9737 70.1521 71.6317 70.7565 71.0273C71.3609 70.4229 71.7029 69.6047 71.7083 68.75C71.7083 67.8916 71.3688 67.0681 70.7638 66.4592C70.1588 65.8503 69.3375 65.5055 68.4792 65.5H66.2083C65.7835 65.5028 65.3623 65.4211 64.9693 65.2598C64.5763 65.0985 64.2192 64.8608 63.9188 64.5604C63.6184 64.26 63.3806 63.9029 63.2193 63.5098C63.058 63.1168 62.9764 62.6957 62.9792 62.2708C62.9792 61.4144 63.3194 60.5931 63.925 59.9875C64.5306 59.3819 65.3519 59.0417 66.2083 59.0417H67.2917C68.7213 58.8729 70.1611 59.2609 71.3125 60.125M65 44.1667C64.5779 44.9022 63.9719 45.5155 63.2415 45.9464C62.5111 46.3774 61.6813 46.6112 60.8333 46.625C60.1793 46.6474 59.5274 46.5378 58.9165 46.3029C58.3057 46.0679 57.7484 45.7124 57.2779 45.2574C56.8074 44.8025 56.4334 44.2575 56.178 43.6549C55.9227 43.0523 55.7913 42.4045 55.7917 41.75V38.5833C55.7917 37.2885 56.3046 36.0464 57.2182 35.1288C58.1319 34.2113 59.3718 33.693 60.6667 33.6875C61.3086 33.6875 61.9442 33.8143 62.5371 34.0606C63.1299 34.3069 63.6682 34.6678 64.1212 35.1227C64.5742 35.5776 64.9328 36.1175 65.1766 36.7114C65.4203 37.3052 65.5444 37.9414 65.5417 38.5833V40.1667H55.7917M55.0417 55.0208V69.6042C55.0417 69.9243 55.1047 70.2412 55.2272 70.537C55.3497 70.8327 55.5292 71.1014 55.7556 71.3277C55.9819 71.5541 56.2506 71.7336 56.5464 71.8561C56.8421 71.9786 57.1591 72.0417 57.4792 72.0417H58.2083M52.4792 59.0417H57.6042M47.3333 67.1042C47.3333 68.3971 46.8197 69.6371 45.9055 70.5513C44.9912 71.4656 43.7513 71.9792 42.4583 71.9792C41.1654 71.9792 39.9254 71.4656 39.0112 70.5513C38.0969 69.6371 37.5833 68.3971 37.5833 67.1042V63.9167C37.5833 62.6237 38.0969 61.3838 39.0112 60.4695C39.9254 59.5553 41.1654 59.0417 42.4583 59.0417C43.7513 59.0417 44.9912 59.5553 45.9055 60.4695C46.8197 61.3838 47.3333 62.6237 47.3333 63.9167M47.3333 71.9792V59.0417M23.5 27.1042V40.1667C23.5938 41.8188 24.3162 43.3725 25.519 44.5089C26.7219 45.6454 28.3139 46.2786 29.9687 46.2786C31.6236 46.2786 33.2156 45.6454 34.4185 44.5089C35.6213 43.3725 36.3437 41.8188 36.4375 40.1667V27.1042M41.4583 38.5833C41.4583 37.2885 41.9713 36.0464 42.8849 35.1288C43.7986 34.2113 45.0385 33.693 46.3333 33.6875C47.6282 33.693 48.8681 34.2113 49.7817 35.1288C50.6954 36.0464 51.2083 37.2885 51.2083 38.5833V41.75C51.2083 43.0429 50.6947 44.2829 49.7805 45.1971C48.8662 46.1114 47.6263 46.625 46.3333 46.625C45.0404 46.625 43.8004 46.1114 42.8862 45.1971C41.9719 44.2829 41.4583 43.0429 41.4583 41.75M41.4583 46.625V27.1042M83.9167 88.0833H15.1667C14.0616 88.0833 13.0018 87.6443 12.2204 86.8629C11.439 86.0815 11 85.0217 11 83.9167V15.1667C11 14.0616 11.439 13.0018 12.2204 12.2204C13.0018 11.439 14.0616 11 15.1667 11H83.9167C85.0217 11 86.0815 11.439 86.8629 12.2204C87.6443 13.0018 88.0833 14.0616 88.0833 15.1667V83.9167C88.0833 85.0217 87.6443 86.0815 86.8629 86.8629C86.0815 87.6443 85.0217 88.0833 83.9167 88.0833Z"
                      stroke="currentColor"
                      stroke-width="2.08333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  <img
                    src={getIconSrc(platform.iconSrc)}
                    alt={`${platform.title} icon`}
                    className="w-12 h-12"
                  />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map((platform, index) => {
          const tabValue =
            platform.title.toLowerCase().replace(/\s+/g, '') ||
            `platform-${index}`;
          const transformedData = transformPlatformData(platform);

          return (
            <TabsContent key={tabValue} value={tabValue} className="mt-0">
              <Card className="rounded-t-none border-t-0 shadow-realistic min-h-[400px]">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* Basic Metrics */}
                    {transformedData.basicMetrics.length > 0 && (
                      <div className="space-y-1">
                        {transformedData.basicMetrics.map(
                          (metric, metricIndex) => (
                            <MetricRow
                              key={`basic-${metricIndex}`}
                              {...metric}
                              isLast={false}
                              isMobile={true}
                            />
                          ),
                        )}
                      </div>
                    )}

                    {/* On Track Section */}
                    {transformedData.hasOnTrack &&
                      (transformedData.onTrackPosition === 'top' ||
                        (transformedData.onTrackPosition === 'middle' &&
                          transformedData.basicMetrics.length > 0)) && (
                        <OnTrackSection isMobile={true} />
                      )}

                    {/* Detailed Metrics */}
                    {transformedData.detailedMetrics.length > 0 && (
                      <div className="space-y-1">
                        {transformedData.detailedMetrics.map(
                          (metric, metricIndex) => (
                            <MetricRowWithStatus
                              key={`detailed-${metricIndex}`}
                              {...metric}
                              isLast={
                                metricIndex ===
                                transformedData.detailedMetrics.length - 1
                              }
                              isMobile={true}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
