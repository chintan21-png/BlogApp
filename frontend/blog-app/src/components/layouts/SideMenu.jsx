import React, { useContext } from 'react'
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from '../../utils/data';
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import CharAvatar from '../Cards/CharAvatar';
import { UserContext } from '../../context/userContext';

const SideMenu = ({ activeMenu, isBlogMenu, setOpenSideMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return;
        }
        setOpenSideMenu?.(false);
        navigate(route);
    };

    const handleLogout = () => {
        clearUser();
        setOpenSideMenu?.(false);
        navigate("/");
    };

    const menuData = isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA;

    return (
        <div className='w-full h-full bg-white flex flex-col'>
            {user && (
                <div className='flex flex-col items-center gap-3 mb-8 px-6 pt-8'>
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt='Profile'
                            className='w-16 h-16 rounded-full object-cover'
                        />
                    ) : (
                        <CharAvatar
                            fullName={user?.name || ""}
                            width="w-16"
                            height="h-16"
                            style="text-lg"
                        />
                    )}
                    <div className='text-center'>
                        <h5 className='text-gray-900 font-semibold text-sm'>{user.name}</h5>
                        <p className='text-xs text-gray-600 mt-1'>{user.email}</p>
                    </div>
                </div>
            )}

            <div className="space-y-2 flex-1 px-6">
                {menuData.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-3 text-sm ${
                            activeMenu === item.label
                                ? "text-white bg-gradient-to-r from-sky-500 to-cyan-400"
                                : "text-gray-700 hover:bg-gray-100"
                        } py-2.5 px-4 rounded-lg`}
                        onClick={() => handleClick(item.path)}
                    >
                        {item.icon && <item.icon className='text-lg' />}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>

            {user && (
                <div className="mt-3 pt-3 border-t px-6 pb-6">
                    <button
                        className='w-full flex items-center gap-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 py-2.5 px-4 rounded-lg'
                        onClick={handleLogout}
                    >
                        <LuLogOut className='text-lg' />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SideMenu;
