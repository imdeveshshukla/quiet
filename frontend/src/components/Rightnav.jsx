import React from 'react'
import { SiFireship } from "react-icons/si";
import { RiCommunityLine } from "react-icons/ri";
import Qicon from '../assets/q.svg';
import { NavLink } from 'react-router-dom';
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { IoMdSchool } from "react-icons/io";
import { GiBrain } from "react-icons/gi";
import { GiLifeInTheBalance } from "react-icons/gi";
import { GiByzantinTemple } from "react-icons/gi";
import { MdOutlineMovieFilter } from "react-icons/md";
import Profilecard from './Profilecard';




const Rightnav = () => {

  const room = location.pathname.includes('/room');

  return (
    <div className='  p-4 2_md:p-8 h-[calc(100vh-74.46px)] overflow-auto sticky top-[74.46px]  hidden  1_5md:block  lg:mr-4 1_5lg:mr-6 1_5xl:mr-16'>
      
      {(location.pathname.includes("/u/")) || room ?<Profilecard room={room}/>:<HotTopicNav/>}

    </div>
  )
}

export default Rightnav

export const HotTopicNav=()=>{
  return (
    <div className=' rounded-2xl bg-[#c2c7b3] border-gray-600'>
                <h6 className='bg-[#6f742bba] rounded-t-2xl  py-2 px-2 1_5md:px-4  flex items-center gap-4 '><SiFireship className=' text-2xl '/><span className='font-medium'>HOT-TOPICS</span></h6>
                <ul className=' mx-1 1_5md:mx-5 my-2 pb-2 '>
                    <NavLink to={"/q/sports"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-3 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}> <MdOutlineSportsVolleyball className=' text-2xl '/>Sports</NavLink>
                    <NavLink to={"/q/dsa"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-3 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><GiBrain className=' text-2xl '/>DS&A</NavLink>
                    <NavLink to={"/q/iet"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-3 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><IoMdSchool className=' text-2xl '/>I.E.T</NavLink>
                    <NavLink to={"/q/entertainment"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-3 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><MdOutlineMovieFilter className=' text-2xl '/>Entertainment</NavLink>
                    <NavLink to={"/q/lifestyle"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-3 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><GiLifeInTheBalance className=' text-2xl '/>Lifestyle</NavLink>
                    <NavLink to={"/q/lucknow"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-3 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><GiByzantinTemple className=' text-2xl '/>Lucknow</NavLink>
                </ul>
            </div>
  )
}
