
import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const TagInsights = ({tagUsage}) => {
    const processedData = (() => {
        if(!tagUsage || tagUsage.length === 0) return [];

        const sorted = [...tagUsage].sort((a,b) => b.count - a.count);
        const topFour = sorted.slice(0, 4);
        const others = sorted.slice(4);

        const othersCount = others.reduce((sum, item) => sum + item.count, 0);

        const finalData = topFour.map((item) => ({
            ...item,
            name: item.tag || item.name || "",
        }));

        if(othersCount > 0) {
            finalData.push({
                name: "Others",
                count: othersCount,
            });
        }
        return finalData;
    })();

    return (
        <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-12 md:col-span-7'>
                <CustomPieChart data={processedData} />
            </div>
            <div className='col-span-12 md:col-span-5'>
                <div className='space-y-4'>
                    {processedData.map((item, index) => {
                        const total = processedData.reduce((sum, d) => sum + d.count, 1);
                        const percentage = Math.round((item.count / total) * 100);
                        
                        return (
                            <div key={item.name} className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm font-medium text-gray-800'>
                                        {item.name === 'Others' ? 'Others' : `#${item.name}`}
                                    </span>
                                    <span className='text-xs font-semibold text-sky-600'>
                                        {item.count}
                                    </span>
                                </div>
                                <div className='relative w-full h-1.5 bg-sky-100/60 rounded-full overflow-hidden'>
                                    <div 
                                        className='h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full'
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default TagInsights