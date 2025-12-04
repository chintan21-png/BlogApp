import React, { useRef, useState } from 'react'
import { LuTrash, LuFileImage } from 'react-icons/lu'

const CoverImageSelector = ({ image, setImage, preview, setPreview }) => {
    const inputRef = useRef(null);
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file) {
            if(setImage) {
                setImage(file);
            }
            const previewUrl = URL.createObjectURL(file);
            if(setPreview) {
                setPreview(previewUrl);
            }
        }
    };
    
    const handleRemoveImage = () => {
        if(setImage) {
            setImage(null);
        }
        if(setPreview) {
            setPreview(null);
        }
    };

    const onChooseFile = () => {
        if(inputRef.current) {
            inputRef.current.click();
        }
    };
    
  return (
    <div className='mb-6'>
        <input
            type='file'
            accept='image/*'
            ref={inputRef}
            onChange={handleImageChange}
            className='hidden'
        />

        {(!image && !preview) ? (
            <div
                className='w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-md border border-dashed border-gray-300 cursor-pointer relative'
                onClick={onChooseFile}
            >
                <div className='w-14 h-14 flex items-center justify-center bg-sky-50 rounded-full'>
                    <LuFileImage className='text-xl text-sky-600'/>
                </div>
                <p className='text-sm text-gray-700'>Click to Upload a cover image</p>
            </div>
        ) : (
            <div className='relative w-full h-56'>
                <img
                    src={preview || image}
                    alt='Cover'
                    className='w-full h-full object-cover rounded-md'
                />
                <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-red-600 transition-colors'
                >
                    <LuTrash />
                </button>
            </div>
        )}
    </div>
  )
}

export default CoverImageSelector