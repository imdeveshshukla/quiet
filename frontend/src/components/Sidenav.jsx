import React from 'react'
import { IoHome } from "react-icons/io5";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import { LuArrowUpRightSquare } from "react-icons/lu";
import { NavLink, useLocation } from 'react-router-dom';
import { RiCommunityLine } from "react-icons/ri";


const Sidenav = () => {
  return (
    <nav className=' sticky top-[11vh] h-0'>
      <div className="sidenav">
            <div className='p-3 m-2 border-b-2 border-gray-600'>
                <NavLink to={"/"}   className={(e)=>{return e.isActive?'w-full flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]':'w-full flex rounded items-center gap-2 px-4 py-2'}}><IoHome/><span>Home</span></NavLink>
                <NavLink to={"/popular"}  className={(e)=>{return e.isActive?'flex w-full rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]':'flex w-full rounded items-center gap-2 px-4 py-2'}}><LuArrowUpRightSquare/><span>Popular</span></NavLink>
                <NavLink to={"/all"}  className={(e)=>{return e.isActive?'flex w-full  rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]':'flex w-full  rounded items-center gap-2 px-4 py-2'}}><HiOutlineChartSquareBar/><span>All</span></NavLink>
            </div>

            <div className='p-2 m-2 border-b-2 border-gray-600'>
                <h6 className=' opacity-70   flex items-center gap-4 '><RiCommunityLine className=' text-2xl'/><span>COMMUNITIES</span></h6>
                <ul className='m-4 p-1'>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                </ul>
            </div>
            
            <div>

            </div>
    </div>
    </nav>
  )
}

export default Sidenav
