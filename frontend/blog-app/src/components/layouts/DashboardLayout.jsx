
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
        <div className='flex pt-16'>
        
          <div className='hidden lg:block w-64 min-w-64 h-screen sticky top-0 bg-white border-r border-gray-200'>
            <div className='h-full overflow-y-auto'>
              <SideMenu activeMenu={activeMenu} setOpenSideMenu={() => {}}/>
            </div>
          </div>
          
        
          <div className='flex-1 p-6 overflow-x-hidden'>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout