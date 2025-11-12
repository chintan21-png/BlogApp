import React from 'react'
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from '../../utils/data';
import {LuLogOut} from "react-icons/lu";
import {useNavigate} from "react-router-dom";
import CharAvatar from '../Cards/CharAvatar';

const SideMenu = ({activeMenu, isBlogMenu, onClose}) => {
    const user = null;
    const navigate = useNavigate();

    const handleClick = (route) => {
        if(route === "logout") {
            handleLogout();
            return;
        }
        navigate(route);
        onClose?.(); 
    };
    
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        onClose?.();
    };
    
    const menuData = isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA;
    
  return (
    <div className='w-full h-full bg-white p-5'>
       
        {user && (
            <div className='flex flex-col items-center justify-center gap-1 mt-3 mb-7'>
                {user?.profileImageUrl ? (
                    <img
                        src={user?.profileImageUrl}
                        alt='Profile'
                        className='w-20 h-20 bg-slate-400 rounded-full object-cover'
                    />
                ) : (
                    <CharAvatar
                        fullName={user?.name || ""}
                        width="w-20"
                        height="h-20"
                        style="text-xl"
                    />
                )} 
                <div>
                    <h5 className='text-gray-950 font-semibold text-center leading-6 mt-1'>
                        {user.name}
                    </h5>
                    <p className='text-[13px] font-medium text-gray-800 text-center'>
                        {user?.email}
                    </p>
                </div>
            </div>
        )}
        
        
        <div className="space-y-2">
            {menuData.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu === item.label
                        ? "text-white bg-gradient-to-r from-sky-500 to-cyan-400 shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    } py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer`}
                    onClick={() => handleClick(item.path)}
                >
                    {item.icon && <item.icon className='text-xl' />}
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </div>
        
        
        {user && (
            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    className='w-full flex items-center gap-4 text-[15px] text-gray-700 hover:bg-red-50 hover:text-red-600 py-3 px-6 rounded-lg transition-colors cursor-pointer'
                    onClick={handleLogout}
                >
                    <LuLogOut className='text-xl' />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        )}
    </div>
  )
}

export default SideMenu