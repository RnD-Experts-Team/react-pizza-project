import React from 'react';
// import { SimpleIconsUbereats } from './SimpleIconsUbereats';
// import { StashTrendArrowDown } from './StashTrendArrowDown';
// import line14 from './line-1-4.svg';
export const ChannelDetailsSection = (): React.ReactElement => {
  const channelData = {
    name: 'UberEats',
    percentage: '-57.5%',
    price: '$ 20.72',
    change: '1.2%',
  };
  return (
    <section
      className="flex flex-col w-[498px] items-start gap-[5px] px-2.5 py-0 relative flex-[0_0_auto]"
      role="region"
      aria-label="Channel Details"
    >
      
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        
        {/* <SimpleIconsUbereats
          className="!relative !w-10 !h-10 !aspect-[1]"
          aria-label="UberEats logo"
        /> */}
        <div className="w-[78px] flex flex-col h-10 items-center justify-between relative">
          
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            
            {channelData.name}
          </div>
          <div
            className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#ff4b4b] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label={`Percentage change: ${channelData.percentage}`}
          >
            
            {channelData.percentage}
          </div>
        </div>
        <div className="w-[66px] flex flex-col h-10 items-center justify-between relative">
          
          <div
            className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label={`Price: ${channelData.price}`}
          >
            
            {channelData.price}
          </div>
          <div
            className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#777777] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label={`Change: ${channelData.change}`}
          >
            
            {channelData.change}
          </div>
        </div>
        {/* <StashTrendArrowDown
          className="!relative !w-10 !h-10 !aspect-[1]"
          aria-label="Trend arrow down"
        /> */}
      </div>
      <img
        className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
        alt="Divider line"
        // src={line14}
      />
    </section>
  );
};
