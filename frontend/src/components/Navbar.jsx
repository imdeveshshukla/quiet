import React, { useRef, useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/login'
import axios from 'axios';
import {  clearUserInfo } from '../redux/user'

import dp from '../assets/dummydp.png'
import toast from 'react-hot-toast';
import { clearPostsInfo } from '../redux/Post';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import Notification from './Notification';
import Search from './Search'
import {setShowSearch} from '../redux/search'
import baseAddress from '../utils/localhost'
import { BsInfoCircle } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from 'react-icons/lu'





axios.defaults.withCredentials = true



const Navbar = () => {
  const isLogin = useSelector((state) => state.login.value);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isNtfnOpen, setIsNfnOpen] = useState(false);
  const notifications = useSelector(state => state.notification.notifications)
  const hamburger = useSelector(state => state.hamburger.value);
  
  const showSearch= useSelector(state=> state.search.value)
  
  


  const Navigate = useNavigate()



  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const ntfndropdownRef = useRef(null);


  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (ntfndropdownRef.current && !ntfndropdownRef.current.contains(event.target)) {
      setIsNfnOpen(false);
    }

  };






  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  const logOut = async () => {

    try {

      toast.loading("Logging out...")
      setIsOpen(!isOpen);
      const res = await axios.post(baseAddress+"auth/logout", { withCredentials: true })
      if (res.status == 200) {
        dispatch(logout());
        dispatch(clearUserInfo());
        dispatch(clearPostsInfo())
        toast.dismiss()
        Navigate("/signin");
      }
    } catch (error) {
      console.log(error);
    }

  }





  return (
    <nav className="bg-[#6c712eb8] flex justify-between items-center pl-8 pr-2 xxs:pr-4 xs:px-8 sticky w-full top-0 z-10 backdrop-blur-md h-[74.46px]">


      <div className="logo relative w-36 xxs:w-40 xs:w-52 flex items-center gap-3">
        <Link to={"/"}><img src={logo} alt="" /></Link>
      </div>

      <span className=' hidden 2_sm:block'><Search/></span>


      <div className={`${isLogin?' gap-6':'xxs:gap-1 sm:gap-2'} flex  1_5md:gap-8 items-center`}>

        <span><IoSearchOutline onClick={() => dispatch(setShowSearch(!showSearch))} className=' relative cursor-pointer text-3xl 2_sm:hidden' /></span>

        


        <div ref={ntfndropdownRef}>
          {
            isLogin && <div onClick={() => setIsNfnOpen(!isNtfnOpen)} className='relative'><IoNotificationsOutline className=' text-black font-semibold cursor-pointer text-3xl' />
              <span className='absolute flex items-center justify-center p-2 -top-2 text-[10px] -right-1 h-4 w-4 font-bold text-white bg-red-700 rounded-full'>{notifications.length}</span>
            </div>
          }
          {isNtfnOpen && <Notification setIsNfnOpen={setIsNfnOpen} />}
        </div>
        {isLogin ? <>
          <div className="relative flex items-center gap-8" ref={dropdownRef} >

            <button onClick={handleToggle} className="flex w-12 h-12 overflow-hidden items-center rounded-full border-2  border-t-orange-600 border-b-green-900 hover:border-black focus:outline-none">
              <img
                src={userInfo && userInfo.dp ? userInfo.dp : dp}
                alt="Profile"
                className="w-full h-full  object-cover bg-gray-200"
              />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-12 mt-3 w-48 bg-white rounded-md shadow-lg z-10">
                <ul className="py-1 bg-[#656923] rounded-md ">

                  <li className="px-4 py-2 cursor-default text-gray-300 font-semibold font-ubuntu ">
                    <span className='text-sm font-semibold font-mono text-red-800 '>Welcome</span> {userInfo && userInfo.username ? userInfo.username : `Anonymous`}
                  </li>
                  <li className=" hover:text-gray-200 px-4 py-2 text-white hover:bg-[#6d712eb8]">

                    <Link onClick={() => setIsOpen(!isOpen)} to={`u/${userInfo?.username}`} className="flex gap-2 justify-between items-center"><span>Profile</span> <span><CgProfile className='text-lg' /></span></Link>
                  </li>
                  <li className=" hover:text-gray-200 px-4 py-2 text-white hover:bg-[#6d712eb8]">
                    <Link onClick={() => setIsOpen(!isOpen)} to={"/setting/"} className="flex gap-2 justify-between items-center"><span>Settings</span> <span><IoSettingsOutline className='text-lg' /></span></Link>
                  </li>

                  <li className=" hover:text-gray-200 px-4 py-2 text-white  hover:bg-[#6d712eb8]">
                    <Link onClick={() => setIsOpen(!isOpen)} to={"/about/"} className="flex gap-2 justify-between items-center"><span>About</span> <span><BsInfoCircle className='text-lg' /></span></Link>
                  </li>

                  <li className=" hover:text-gray-200 px-4 py-2 text-white cursor-pointer justify-between flex items-center gap-3 hover:bg-[#6d712eb8]" onClick={() => logOut()}>
                    <span>Logout</span> <span><LuLogOut className='text-lg' /></span>
                  </li>
                </ul>

              </div>
            )}
          </div>
        </>
          : <><Link to={"/signin"}><div className="signin cursor-pointer xxs:text-lg px-2 py-1 font-semibold hover:text-[#565252]">Sign in</div></Link>
            <Link to={"/signup"}><div className="signup cursor-pointer rounded-xl  bg-black text-white px-2 py-1  xxs:text-lg  hover:shadow-sm shadow-md shadow-current">Sign up</div></Link></>}
      </div>
    </nav>
  )
}



export default Navbar
