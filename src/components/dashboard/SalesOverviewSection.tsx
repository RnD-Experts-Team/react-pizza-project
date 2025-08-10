import React from 'react';
// import { LineMdPhone } from './LineMdPhone';
// import { StashTrendArrowUp } from './StashTrendArrowUp';
// import line13 from './line-1-3.svg';
export const SalesOverviewSection = (): React.ReactElement => {
  return (
    <section
      className="flex flex-col w-[498px] items-start gap-[5px] px-2.5 py-0 relative flex-[0_0_auto]"
      role="region"
      aria-label="Phone sales overview"
    >
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div
          className="flex items-center justify-center"
          role="img"
          aria-label="Phone icon"
        >
          {/* <LineMdPhone className="!relative !w-10 !h-10 !aspect-[1]" /> */}
        </div>
        <div className="w-[78px] flex flex-col h-10 items-center justify-between relative">
          <h3 className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            Phone
          </h3>
          <div
            className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#34dd28] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label="Growth percentage: positive 50.7%"
          >
            +50.7%
          </div>
        </div>
        <div className="w-[66px] flex flex-col h-10 items-center justify-between relative">
          <div
            className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label="Sales amount: 235 dollars and 79 cents"
          >
            $ 235.79
          </div>
          <div
            className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#777777] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
            aria-label="Market share: 13.66%"
          >
            13.66%
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          role="img"
          aria-label="Trending up arrow"
        >
          {/* <StashTrendArrowUp className="!relative !w-10 !h-10 !aspect-[1]" /> */}
        </div>
      </div>
      <img
        className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
        alt="Divider line"
        // src={line13}
      />
    </section>
  );
};
