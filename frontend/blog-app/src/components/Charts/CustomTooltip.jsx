
import React from 'react'

const CustomTooltip = ({active, payload}) => {
    if(active && payload && payload.length) {
        return (
            <div className='bg-white shadow-md rounded-lg p-3 border border-gray-200'>
                <p className='text-sm font-semibold text-gray-800 mb-1'>
                    {payload[0].name}: {payload[0].value}
                </p>
            </div>
        )
    }
    return null;
}

export default CustomTooltip