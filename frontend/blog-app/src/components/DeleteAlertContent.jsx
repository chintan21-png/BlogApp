import React from 'react'

const DeleteAlertContent = ({ content, onDelete }) => {
  return (
    <div className='p-4'>
      <p className='text-[14px] text-gray-700 mb-6'>{content}</p>
      <div className='flex justify-end gap-3 mt-4'>
        <button
          type='button'
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          onClick={() => {
           
          }}
        >
          Cancel
        </button>
        <button
          type='button'
          className='px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteAlertContent