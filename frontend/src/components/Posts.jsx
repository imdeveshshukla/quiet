import React from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/dummydp.png'
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";
import { combineSlices } from '@reduxjs/toolkit';

const Posts = ({username,title, body, media}) => {

  const userInfo= useSelector(state=> state.user.userInfo);

 
  return (
    <div className=' rounded-3xl  m-6 p-4 hover:bg-[#828a0026] '>
        <header className='flex gap-2 items-center my-2'>
          <img  src={userInfo&&userInfo.dp? userInfo.dp:dp}
          alt="Profile"
          className="w-8 h-8 rounded-full   bg-white" />
          <span className=' font-semibold'>u/{username}</span>•<span className=' text-xs text-gray-700'>8 hrs ago</span>
          
        </header>
        <main className=''>
          <div className='text-lg font-bold my-2'>{title}</div>
          <div className='my-2 '>{body}</div>
          <img className=' w-full  max-h-[420px] object-contain py-2 ' src={media} alt="postImg" />
        </main>
        <footer className='flex py-2 gap-6'>
          <div className=' rounded-3xl flex gap-1 items-start justify-center p-2 bg-zinc-400'>
          <BiUpvote className='text-2xl hover:text-green-700 cursor-pointer'/>
          <span>8.4k</span>
          <BiDownvote className='text-2xl hover:text-red-700  cursor-pointer'/>
          </div>    

          <div className=' rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-blue-300'>
          <GoComment className='text-2xl '/> 
          <span>8.4k</span>
          </div>

          <div className=' rounded-3xl flex gap-2 items-start justify-center p-2 bg-amber-100 hover:text-amber-500 cursor-pointer'>
          <RiShareForwardLine className='text-2xl'/>
          <span>Share</span>
          </div>
        </footer>
    </div>
  )
}

export default Posts
