import React from 'react';
// import image from './image.svg';
// import line12 from './line-1-2.svg';
// import line13 from './line-1-3.svg';
// import line14 from './line-1-4.svg';
// import line15 from './line-1-5.svg';
// import line16 from './line-1-6.svg';
// import line17 from './line-1-7.svg';
// import line18 from './line-1-8.svg';
// import line19 from './line-1-9.svg';
// import line1 from './line-1.svg';
export const PerformanceMetricsSection = (): React.ReactElement => {
  const basicMetrics = [
    { label: 'Most Loved Restaurant', value: '0', line: "line1" },
    { label: 'Optimization Score', value: 'Med', line: "image" },
    { label: '#1 Top Missing or Incorrect Item', value: '0', line: "line12" },
    { label: 'Reviews Responded', value: '1', line: "line13" },
  ];
  const detailedMetrics = [
    {
      label: 'Ratings - Average Rating',
      value: '4',
      status: 'NA',
      statusColor: '#c30000',
      backgroundImage: 'url(/vector.svg)',
      line: "line14",
    },
    {
      label: 'Cancellations - Sales Lost',
      value: '0',
      status: 'OT',
      statusColor: '#00c610',
      backgroundImage: 'url(/vector-2.svg)',
      line: "line15",
    },
    {
      label: 'Missing or Incorrect Error Charges',
      value: '4',
      status: 'NA',
      statusColor: '#c30000',
      backgroundImage: 'url(/vector-3.svg)',
      line: "line16",
    },
    {
      label: 'Avoidable Wait M.Sec',
      value: '1',
      status: 'OT',
      statusColor: '#00c610',
      backgroundImage: 'url(/vector-4.svg)',
      line: "line17",
    },
    {
      label: 'total Dasher Wait M.Sec',
      value: '4',
      status: 'NA',
      statusColor: '#c30000',
      backgroundImage: 'url(/vector-5.svg)',
      line: "line18",
    },
    {
      label: 'Downtime H.MM',
      value: '1',
      status: 'NA',
      statusColor: '#c30000',
      backgroundImage: 'url(/vector-6.svg)',
      line: "line19",
    },
  ];
  return (
    <section className="flex flex-col w-[489px] h-[420px] items-center gap-[15px] p-2.5 relative bg-white rounded-[0px_10px_10px_10px] overflow-hidden shadow-card-shadow">
      {basicMetrics.map((metric, index) => (
        <div
          key={index}
          className="flex flex-col h-5 items-start justify-between relative self-stretch w-full"
        >
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-fit mt-[-0.50px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-[#555555] text-sm tracking-[0] leading-[11.5px] whitespace-nowrap">
              {metric.label}
            </div>
            <div className="relative w-fit mt-[-0.50px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-sm tracking-[0] leading-[11.5px] whitespace-nowrap">
              {metric.value}
            </div>
          </div>
          <img
            className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
            alt="Line"
            src={metric.line}
          />
        </div>
      ))}
      <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-[89px] mt-[-1.00px] [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-[#e0b300] text-base tracking-[0] leading-[11.5px]">
          On Track ?
        </div>
      </div>
      {detailedMetrics.map((metric, index) => (
        <div
          key={index}
          className="flex flex-col h-[26px] items-start justify-between relative self-stretch w-full"
        >
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-fit [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-[#555555] text-sm tracking-[0] leading-[11.5px] whitespace-nowrap">
              {metric.label}
            </div>
            <div className="flex items-center justify-end flex-1 grow gap-2.5 relative">
              <div className="relative w-fit [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-black text-sm tracking-[0] leading-[11.5px] whitespace-nowrap">
                {metric.value}
              </div>
              <div className="relative w-9 h-[22px] mr-[-2.00px]">
                <div
                  className="relative w-[34px] h-[22px] bg-[100%_100%]"
                  style={{ backgroundImage: metric.backgroundImage }}
                >
                  <div
                    className="absolute top-[5px] left-2 [font-family:'Inria_Sans-Bold',Helvetica] font-bold text-sm text-center tracking-[0] leading-[11.5px] whitespace-nowrap"
                    style={{ color: metric.statusColor }}
                  >
                    {metric.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="relative self-stretch w-full h-px mb-[-1.00px] object-cover"
            alt="Line"
            src={metric.line}
          />
        </div>
      ))}
    </section>
  );
};
