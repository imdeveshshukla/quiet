import React from 'react'
import { IoHome } from "react-icons/io5";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import { LuArrowUpRightSquare } from "react-icons/lu";
import { NavLink, useLocation } from 'react-router-dom';
import { RiCommunityLine } from "react-icons/ri";
import Qicon from '../assets/q.svg';
import { FaHouseUser } from "react-icons/fa6";

const Sidenav = () => {
  return (
    <nav className='top-[12vh] h-max p-3 sticky'>
      <div className="sidenav">

            <div className='p-3 m-2 border-b-2 border-gray-600'>
                <NavLink to={"/"}   className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]':'w-full flex rounded items-center gap-2 px-4 py-2'}}><IoHome/><span>Home</span></NavLink>
                <NavLink to={"/popular"}  className={(e)=>{return e.isActive?'flex w-full rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]':'flex w-full rounded items-center gap-2 px-4 py-2'}}><LuArrowUpRightSquare/><span>Popular</span></NavLink>
                <NavLink to={"/all"}  className={(e)=>{return e.isActive?'flex w-full  rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]':'flex w-full  rounded items-center gap-2 px-4 py-2'}}><HiOutlineChartSquareBar/><span>All</span></NavLink>
            </div>

            <div className='p-2 m-2 border-b-2 border-gray-600'>
                <h6 className=' opacity-70   flex items-center gap-4 '><RiCommunityLine className=' text-2xl '/><span className='font-medium'>HOT-TOPICS</span></h6>
                <ul className='m-4 p-1 '>
                    <NavLink to={"/q/sports"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}> <img src={Qicon} alt="" />Sports</NavLink>
                    <NavLink to={"/q/dsa"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />DS&A</NavLink>
                    <NavLink to={"/q/iet"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />I.E.T</NavLink>
                    <NavLink to={"/q/entertainment"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Entertainment</NavLink>
                    <NavLink to={"/q/lifestyle"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lifestyle</NavLink>
                    <NavLink to={"/q/lucknow"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lucknow</NavLink>
                </ul>
            </div>
            
            <div>
            <h6 className=' opacity-70  flex items-center gap-4 '><RiCommunityLine className=' text-2xl '/><span className='font-medium'>HOT-TOPICS</span></h6>
                <ul className='m-4 p-1 '>
                    <NavLink to={"/q/sports"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}> <img src={Qicon} alt="" />Sports</NavLink>
                    <NavLink to={"/q/dsa"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />DS&A</NavLink>
                    <NavLink to={"/q/iet"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />I.E.T</NavLink>
                    <NavLink to={"/q/entertainment"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Entertainment</NavLink>
                    <NavLink to={"/q/lifestyle"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lifestyle</NavLink>
                    <NavLink to={"/q/lucknow"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lucknow</NavLink>
                    <NavLink to={"/q/sports"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}> <img src={Qicon} alt="" />Sports</NavLink>
                    <NavLink to={"/q/dsa"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />DS&A</NavLink>
                    <NavLink to={"/q/iet"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />I.E.T</NavLink>
                    <NavLink to={"/q/entertainment"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Entertainment</NavLink>
                    <NavLink to={"/q/lifestyle"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lifestyle</NavLink>
                    <NavLink to={"/q/lucknow"} className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-1 px-4 py-2 bg-[#65692375]':'w-full flex items-center gap-1 px-4 py-2 hover:bg-[#838a0060] rounded-2xl'}}><img src={Qicon} alt="" />Lucknow</NavLink>
                </ul>
            </div>
        </div>
    </nav>
  )
}

export default Sidenav
