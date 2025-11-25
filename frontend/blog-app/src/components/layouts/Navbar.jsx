import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import LOGO from "../../assets/logo.svg";
import SideMenu from './SideMenu';

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    
    return (
        <>
            <div className='flex items-center gap-4 bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30'>
                <button
                    className='block lg:hidden text-black'
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                >
                    {openSideMenu ? (
                        <HiOutlineX className='text-2xl'/>
                    ) : (
                        <HiOutlineMenu className='text-2xl'/>
                    )}
                </button>
                <img src={LOGO} alt='logo' className='h-10 w-auto'/>
            </div>
            
          
            {openSideMenu && (
                <div className='fixed inset-0 z-40 lg:hidden'>
                   
                    <div 
                        className='absolute inset-0 bg-black bg-opacity-50'
                        onClick={() => setOpenSideMenu(false)}
                    />
                    
                    <div className='absolute left-0 top-0 h-full w-64 bg-white shadow-lg'>
                        <SideMenu 
                            activeMenu={activeMenu} 
                            setOpenSideMenu={setOpenSideMenu}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar