import React, { useState } from 'react';
export const DashboardHeaderSection = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState('Doordash');
  const tabs = [
    { name: 'Doordash', width: 'w-[137px]' },
    { name: 'UberEats', width: 'inline-flex' },
    { name: 'GrubHub', width: 'inline-flex' },
  ];
  return (
    <div className="flex w-[489px] items-start pt-0.5 pb-0 px-0 flex-[0_0_auto] shadow-[0px_4px_4px_#00000040] gap-2.5 relative">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`flex flex-col ${tab.width} items-center justify-center px-1.5 py-2.5 ${activeTab === tab.name ? 'bg-white' : 'bg-[#eeeeee]'} rounded-[10px_10px_0px_0px] overflow-hidden shadow-[0px_0px_2px_#00000040] gap-2.5 relative cursor-pointer transition-colors duration-200 hover:bg-white`}
          onClick={() => setActiveTab(tab.name)}
          role="tab"
          aria-selected={activeTab === tab.name}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setActiveTab(tab.name);
            }
          }}
        >
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[11.5px] whitespace-nowrap">
            {tab.name}
          </div>
        </div>
      ))}
    </div>
  );
};
