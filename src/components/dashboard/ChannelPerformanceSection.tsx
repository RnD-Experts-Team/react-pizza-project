import React from 'react';
// import { SimpleIconsDoordash } from './SimpleIconsDoordash';
// import { StashTrendArrowDown } from './StashTrendArrowDown';
// import line1 from './line-1.svg';
export const ChannelPerformanceSection = (): React.ReactElement =>  {
  return (
    <div className="flex flex-col w-[498px] items-start gap-[5px] px-2.5 py-0 relative flex-[0_0_auto]">
      
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        
        {/* <SimpleIconsDoordash
          className="!relative !w-10 !h-10 !aspect-[1]"
          color="white"
        /> */}
        <div className="w-[78px] flex flex-col h-10 items-center justify-between relative">
          
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            
            DoorDash
          </div>
          <div className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#ff4b4b] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap">
            
            -3.78%
          </div>
        </div>
        <div className="w-[66px] flex flex-col h-10 items-center justify-between relative">
          
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-[11.5px] whitespace-nowrap">
            
            $ 564.56
          </div>
          <div className="relative w-fit [font-family:'Inria_Sans-Regular',Helvetica] font-normal text-[#777777] text-base text-center tracking-[0] leading-[11.5px] whitespace-nowrap">
            
            33.44%
          </div>
        </div>
        {/* <StashTrendArrowDown className="!relative !w-10 !h-10 !aspect-[1]" /> */}
      </div>
      <img
        className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
        alt="Line"
        // src={line1}
      />
    </div>
  );
};
