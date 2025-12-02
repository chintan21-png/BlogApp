
import React from 'react'
import { LuHeart } from 'react-icons/lu';

const TopPostCard = ({title, coverImageUrl, views, likes, maxViews}) => {
    const viewPercentage = maxViews > 0 ? ((views / maxViews) * 100).toFixed(0) : 0;
    
    return (
        <div className='bg-white py-3 flex flex-col gap-2 border-b border-gray-100 last:border-0'>
            <div className='flex items-start gap-3'>
                <img 
                    src={coverImageUrl} 
                    alt={title} 
                    className='w-12 h-12 rounded-md object-cover bg-gray-200 flex-shrink-0'
                />
                <h3 className='text-sm font-medium text-gray-800 line-clamp-2 flex-1'>{title}</h3>
            </div>
            <div className='relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                <div 
                    className='h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300'
                    style={{width : `${viewPercentage}%`}}
                />
            </div>
            <div className='flex items-center justify-between text-xs text-gray-600 mt-1'>
                <span className='flex items-center gap-1 text-gray-700 font-medium'>
                    {views} views
                </span>
                <span className='flex items-center gap-1 text-gray-700 font-medium'>
                    <LuHeart className='text-[14px] text-red-400'/>
                    {likes} likes
                </span>
            </div>
        </div>
    )
}

export default TopPostCard