import React, { useContext, useState } from 'react'
import Logo from "../../../assets/logo.svg";
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import { Link } from "react-router-dom";
import {LuSearch} from "react-icons/lu";
import {BLOG_NAVBAR_DATA} from "../../../../src/utils/data"
import SideMenu from '../SideMenu';
import { UserContext } from '../../../context/userContext';
import ProfileInfoCard from '../../Cards/ProfileInfoCard';
import Login from '../../Auth/Login';
import SignUp from "../../Auth/SignUp";
import Modal from '../../Modal';

const BlogNavbar = ({activeMenu}) => {
    const {user, setOpenAuthForm} = useContext(UserContext);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
  return (
    <>
    <div className='bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-50'>
        <div className='container mx-auto flex items-center justify-between gap-5'>
            <div className='flex items-center gap-5'>
           
              <button
                className='text-gray-800 hover:text-sky-500 p-2 rounded-lg border-2 border-gray-400 bg-white shadow-sm hover:shadow-md transition-all'
                onClick={() => setOpenSideMenu(!openSideMenu)}
              >
                {openSideMenu ? (
                  <HiOutlineX className='text-3xl font-bold' />
                ) : (
                  <HiOutlineMenu className='text-3xl font-bold' />
                )}
              </button>
              
              
              <Link to="/" className="flex items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={Logo} 
                    alt='logo' 
                    className='h-12 w-auto md:h-14 object-contain'
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </Link>
            </div>

           
            <nav className='hidden md:flex items-center gap-10'>
                {BLOG_NAVBAR_DATA.map((item,index) => {
                  if(item?.onlySideMenu) return;

                  return(
                    <Link key={item.id} to={item.path}>
                      <li className='text-[15px] text-black font-medium list-none relative group cursor-pointer'>
                        {item.label}
                        <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-sky-500 transition-all duration-300 origin-left ${
                          activeMenu === item.label ? "scale-x-100" : "scale-x-0"
                        } group-hover:scale-x-100`}></span>
                      </li>
                    </Link>
                  )
                })}
            </nav>

         
            <div className='flex items-center gap-6'>
              <button
                className='hover:text-sky-500 cursor-pointer transition-colors'
                onClick={() => setOpenSearchBar(true)}
              >
                <LuSearch className='text-[22px]' />
              </button>
              {user ? (
                <div className='md:block'>
                  <ProfileInfoCard />
                </div>
              ) : (
                <button
                  className='flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-xl'
                  onClick={() => setOpenAuthForm(true)}
                >
                  Login/SignUp
                </button>
              )}
            </div>
        </div>

      
        {openSideMenu && (
          <div className='fixed inset-0 top-[73px] z-40'>
           
            <div 
              className='fixed inset-0 bg-black bg-opacity-50'
              onClick={() => setOpenSideMenu(false)}
            />
           
            <div className='fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white shadow-xl z-50 overflow-y-auto'>
              <SideMenu 
                activeMenu={activeMenu} 
                isBlogMenu 
                onClose={() => setOpenSideMenu(false)}
              />
            </div>
          </div>
        )}
    </div>

    <AuthModal />
    </>
  )
}

export default BlogNavbar

const AuthModal = () => {
  const {openAuthForm, setOpenAuthForm} = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      <Modal
        isOpen={openAuthForm}
        onClose={()=> {
          setOpenAuthForm(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className='w-full max-w-4xl'>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    
    </>
  )
}