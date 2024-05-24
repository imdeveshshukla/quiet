import React, { useRef, useState } from 'react'
import dp from '../assets/dummydp.png'
import { useSelector } from 'react-redux'
import { NavLink, Outlet} from 'react-router-dom';

import { PiCameraPlusLight } from "react-icons/pi";


const Profile = () => {

  const userInfo = useSelector((state) => state.user.userInfo);

  const handleDpChange=()=>{
    
  }

  return (

    <div className=' border-x-2 border-black pl-20 py-8 overflow-auto max-h-[89.5vh]'>
      <div className=' border-b-2 mr-2 border-black'>
        <div className='flex items-center gap-6'>
          <div className='relative  rounded-full'>
            <img src={userInfo && userInfo.dp ? userInfo.dp : dp}
              alt="Profile"
              className="w-36 h-36 rounded-full   bg-white " />
              
            
              <button onClick={()=>handleDpChange()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight/></button>
          </div>
          <div>
            <h2 className=' text-3xl font-bold '>{userInfo && userInfo.username ? userInfo.username : 'Anonymous'}</h2>
            <p className=' text-gray-600 font-semibold'>u/{userInfo && userInfo.username ? userInfo.username : 'Anonymous'}</p>
          </div>
        </div>
        <div className='flex m-8 items-center gap-8'>
          <NavLink to={"/profile/overview"}   className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}><span>Overview</span></NavLink>
          <NavLink to={"/profile/posts"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}>Posts</NavLink>
          <NavLink to={"/profile/commented"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}>Commented</NavLink>
          <NavLink to={"/profile/upvoted"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}>Upvoted</NavLink>
        </div>
      </div>

      <div className=' '>
        <Outlet />
      </div>

    </div>
  )
}

export default Profile
