import React from 'react'
import { IoHome } from "react-icons/io5";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import { LuArrowUpRightSquare } from "react-icons/lu";
import { NavLink, useLocation } from 'react-router-dom';
import Qicon from '../assets/q.svg';
import { FaHouseUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import CreateRoomBtn from './CreateRoomBtn';

const Sidenav = () => {
  const isLogin = useSelector(state => state.login.value);
  const userData = useSelector(state => state.user.userInfo);
  // console.log("SIDENAV");
  console.log((userData?.OwnedRooms));
  // const [rooms,setRooms] = 
  return (
    <nav className='top-20 max-h-screen overflow-auto  p-3 z-10 sticky'>
      <div className="sidenav">

        <div className='p-3 m-2 border-b-2 border-gray-600'>
          <NavLink to={"/"} className={(e) => { return e.isActive ? 'w-full flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'w-full flex rounded items-center gap-2 px-4 py-2' }}><IoHome /><span>Home</span></NavLink>
          <NavLink to={"/popular"} className={(e) => { return e.isActive ? 'flex w-full rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex w-full rounded items-center gap-2 px-4 py-2' }}><LuArrowUpRightSquare /><span>Popular</span></NavLink>
          <NavLink to={"/all"} className={(e) => { return e.isActive ? 'flex w-full  rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex w-full  rounded items-center gap-2 px-4 py-2' }}><HiOutlineChartSquareBar /><span>All</span></NavLink>
        </div>

        <div className='p-3 m-2 border-b-2 border-gray-600'>
          <div className=' flex items-center gap-4'><FaHouseUser className=' text-2xl' /><span className=' text-lg font-semibold'>Rooms</span></div>
          <div className='pl-6 m-4 flex flex-col'>
            {isLogin &&<> <CreateRoomBtn />
            {isLogin && userData?.OwnedRooms?.map(function(room){
              return <NavLink key={room.id} to={`/room/${userData?.username}/${room.title}`} className={'w-full flex rounded items-center gap-2 px-4 py-2 hover:bg-[#65692375]'}><IoHome /><span>{room.title}</span></NavLink>
            })}
              </>
            }
            
          </div>
        </div>


      </div>
    </nav>
  )
}

export default Sidenav
