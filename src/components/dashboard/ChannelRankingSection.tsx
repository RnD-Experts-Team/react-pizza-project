import React from 'react';
// import { SimpleIconsDoordash } from './SimpleIconsDoordash';
// import { StashTrendArrowDown } from './StashTrendArrowDown';
// import image from './image.svg';
export const ChannelRankingSection = (): React.ReactElement => {
  return (
    <div className="flex flex-col w-[498px] items-start gap-[5px] px-2.5 py-0 relative flex-[0_0_auto]">
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        {/* <SimpleIconsDoordash
          className="!relative !w-10 !h-10 !aspect-[1]"
          color="#FF9900"
        /> */}
        <div className="w-[78px] flex flex-col h-10 items-center justify-between relative">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            GrubHub
          </div>
          <div className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#ff4b4b] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap">
            -17.11%
          </div>
        </div>
        <div className="w-[66px] flex flex-col h-10 items-center justify-between relative">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            $ 31.63
          </div>
          <div className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#777777] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap">
            1.83%
          </div>
        </div>
        {/* <StashTrendArrowDown className="!relative !w-10 !h-10 !aspect-[1]" /> */}
      </div>
      <img
        className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
        alt="Line"
        // src={image}
      />
    </div>
  );
};
