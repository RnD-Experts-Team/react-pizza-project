import React from 'react';
// import { StashTrendArrowDown } from './StashTrendArrowDown';
// import { StreamlinePlumpBrowserWebsite1Solid } from './StreamlinePlumpBrowserWebsite1Solid';
// import line15 from './line-1-5.svg';
export const TopChannelSection = (): React.ReactElement => {
  return (
    <section className="flex flex-col w-[498px] items-start gap-[5px] px-2.5 py-0 relative flex-[0_0_auto]">
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        {/* <StreamlinePlumpBrowserWebsite1Solid
          className="!relative !w-10 !h-10 !aspect-[1]"
          aria-label="Website icon"
        /> */}
        <div className="w-[78px] flex flex-col h-10 items-center justify-between relative">
          <h3 className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            Website
          </h3>
          <span
            className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#ff4b4b] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label="Percentage change: negative 36.45%"
          >
            -36.45%
          </span>
        </div>
        <div className="w-[66px] flex flex-col h-10 items-center justify-between relative">
          <span
            className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label="Value: 338 dollars and 5 cents"
          >
            $ 338.05
          </span>
          <span
            className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#777777] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label="Percentage: 19.58%"
          >
            19.58%
          </span>
        </div>
        {/* <StashTrendArrowDown
          className="!relative !w-10 !h-10 !aspect-[1]"
          aria-label="Trend arrow down"
        /> */}
      </div>
      <img
        className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
        alt="Divider line"
        // src={line15}
      />
    </section>
  );
};
