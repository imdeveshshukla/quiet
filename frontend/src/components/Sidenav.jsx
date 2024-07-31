import React, { useRef, useEffect } from 'react'
import { IoHome } from "react-icons/io5";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import { LuArrowUpRightSquare } from "react-icons/lu";
import { NavLink, useLocation } from 'react-router-dom';
import Qicon from '../assets/q.svg';
import { FaHouseUser } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import CreateRoomBtn from './CreateRoomBtn';
import { setShowSideNav } from '../redux/hamburger'
import { GrMenu } from "react-icons/gr";
import { HotTopicNav } from './Rightnav';



const Sidenav = () => {
  const isLogin = useSelector(state => state.login.value);
  const userData = useSelector(state => state.user.userInfo);
  const hamburger = useSelector(state => state.hamburger.value)
  const dispatch = useDispatch()

  // console.log("SIDENAV");
  // console.log(userData?.OwnedRooms);
  // const [rooms,setRooms] = 
  const navRef = useRef(null);



  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      dispatch(setShowSideNav(false))
    }

  };



  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHamburger = () => {
    console.log("hamburger");

    dispatch(setShowSideNav(!hamburger))

  }


  return (<>

    <nav ref={navRef} className={` ${hamburger ? 'left-0' : '-left-full'} fixed transition-all duration-400 ease-in-out bg-[#bbc2a5] xl:bg-[#fff0]  border-4 xl:border-none  border-[#dae0cb] xl:sticky xl:left-0  xl:block max-h-[calc(100vh-74.46px)] overflow-auto  p-3 z-20 h-[calc(100vh-74.47px)]  top-[74.46px] `} >
      <GrMenu onClick={() => handleHamburger()} className=' cursor-pointer hover:text-gray-700 fixed left-2 top-5 text-3xl block xl:hidden' />
      <div className="sidenav">

        <div className='p-3 m-2 border-b-2 border-gray-600'>
          <NavLink to={"/"} className={(e) => { return e.isActive ? 'w-full flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'w-full flex rounded items-center gap-2 px-4 py-2' }}><IoHome /><span>Home</span></NavLink>
          <NavLink to={"/popular"} className={(e) => { return e.isActive ? 'flex w-full rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex w-full rounded items-center gap-2 px-4 py-2' }}><LuArrowUpRightSquare /><span>Popular</span></NavLink>
          <NavLink to={"/all"} className={(e) => { return e.isActive ? 'flex w-full  rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex w-full  rounded items-center gap-2 px-4 py-2' }}><HiOutlineChartSquareBar /><span>All</span></NavLink>
        </div>

        <div className='p-3 m-2 border-b-2 border-gray-600'>
          <div className=' flex items-center gap-4'><FaHouseUser className=' text-2xl' /><span className=' text-lg font-semibold'>Rooms</span></div>
          <div className='pl-6 m-4 flex flex-col'>
            {isLogin && <> <CreateRoomBtn />

              {isLogin && userData?.OwnedRooms?.map(function (room) {
                return <NavLink key={room.id} to={`/room/${userData?.username}/${room.title}`} className={'w-full flex rounded items-center gap-2 px-4 py-2 hover:bg-[#65692375]'}><IoHome /><span>{room.title}</span></NavLink>
              })}
            </>
            }

          </div>
        </div>

        <div className={`  1_5md::hidden p-3 m-2 border-b-2 border-gray-600`}>
            <HotTopicNav/>
        </div>


      </div>
    </nav>

    {hamburger && <div className="fixed inset-0 top-[74.46px] bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>}

  </>

  )
}

export default Sidenav
