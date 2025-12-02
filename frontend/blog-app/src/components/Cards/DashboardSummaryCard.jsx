import React from 'react'


const DashboardSummaryCard = ({ icon, label, value, bgColor, color }) => {
  return (
    <div className='bg-white p-4 rounded-xl border border-gray-200 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div className={`p-2 rounded-lg ${bgColor || 'bg-sky-100'}`}>
          <div className={`text-xl ${color || 'text-sky-500'}`}>
            {icon}
          </div>
        </div>
        <div className='text-right'>
          <h3 className='text-2xl font-bold text-gray-800'>{value}</h3>
          <p className='text-xs text-gray-500 mt-1'>{label}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardSummaryCard