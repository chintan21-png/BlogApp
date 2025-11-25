// DashboardLayout.jsx - Fixed
import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import SideMenu from './SideMenu';
import Navbar from './Navbar';

const DashboardLayout = ({ children, activeMenu}) => {
  const { user } = useContext(UserContext);
  
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar activeMenu={activeMenu}/>
      
      {user && (
        <div className='flex'>
         
          <div className='hidden lg:block w-64 min-w-64 bg-white shadow-sm'>
            <SideMenu activeMenu={activeMenu} setOpenSideMenu={() => {}}/>
          </div>
        
          <div className='flex-1 p-6'>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout