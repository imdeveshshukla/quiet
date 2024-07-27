import React from 'react'
import { SiFireship } from "react-icons/si";
import { RiCommunityLine } from "react-icons/ri";
import Qicon from '../assets/q.svg';
import { NavLink } from 'react-router-dom';



const Rightnav = () => {
  return (
    <div className='p-8 max-h-screen sticky top-20'>
      <div className=' rounded-2xl bg-[#c2c7b3] border-gray-600'>
                <h6 className='bg-[#6f742bba] rounded-t-2xl  py-2 px-4  flex items-center gap-4 '><SiFireship className=' text-2xl '/><span className='font-medium'>HOT-TOPICS</span></h6>
                <ul className='m-4 p-1 '>
                    <NavLink to={"/q/sports"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}> <img src={Qicon} alt="" />Sports</NavLink>
                    <NavLink to={"/q/dsa"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />DS&A</NavLink>
                    <NavLink to={"/q/iet"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />I.E.T</NavLink>
                    <NavLink to={"/q/entertainment"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Entertainment</NavLink>
                    <NavLink to={"/q/lifestyle"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lifestyle</NavLink>
                    <NavLink to={"/q/lucknow"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lucknow</NavLink>
                </ul>
            </div>
    </div>
  )
}

export default Rightnav
