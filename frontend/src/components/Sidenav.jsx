import React, { useRef, useEffect, useState } from 'react'
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
import axios from 'axios';
import baseAddress from '../utils/localhost';
import { clearRooms, setRooms } from '../redux/userRooms';
import SmoothLoader from '../assets/SmoothLoader';
import { RiHomeWifiFill } from "react-icons/ri";
import { CiCircleChevUp } from "react-icons/ci";
import { CiCircleChevDown } from "react-icons/ci";
import { BsInfoCircle } from 'react-icons/bs';


const Sidenav = () => {
  const isLogin = useSelector(state => state.login.value);
  const userData = useSelector(state => state.user.userInfo);

  const hamburger = useSelector(state => state.hamburger.value)
  const myAllRoom = useSelector(state => state.rooms.rooms);
  const dispatch = useDispatch()
  const [roomLoader, setRoomLoader] = useState(false);
  const navRef = useRef(null);
  const [notJoinedRooms, setNotJoinedRooms] = useState([]);
  const [roomLoader2, setRoomLoader2] = useState(false);

  const [openBar, setOpenBar] = useState(false);
  const [openBar2, setOpenBar2] = useState(true);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      dispatch(setShowSideNav(false))
    }

  };

  const getRooms = async () => {
    try {
      const res = await axios.get(baseAddress + `rooms/getAllRoom/${userData?.userID}`);

      dispatch(setRooms(res.data.rooms));
      setRoomLoader(false);
    } catch (e) {
      console.log("Error in Fetching Rooms =" + e.message);
      setRoomLoader(false);
    }
  }

  const getNotJoinedRoom = async () => {
    setRoomLoader2(true)
    try {
      const res = await axios.get(baseAddress + "rooms/notJoinedRoom");

      setNotJoinedRooms(res.data.rooms);

    } catch (e) {
      console.log(e.message);
    }
    finally {
      setRoomLoader2(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (isLogin) {
      setRoomLoader(true);
      getRooms();
      // getNotJoinedRoom();
    }
    else {
      dispatch(clearRooms());
    }
  }, [userData, isLogin])

  useEffect(() => {
    if (isLogin) {
      getNotJoinedRoom();
    }
  }, [myAllRoom])

  const handleHamburger = () => {
    dispatch(setShowSideNav(!hamburger))

  }

  return (<>

    <nav ref={navRef} className={` ${hamburger ? 'left-0' : '-left-full'} w-80 xl:w-full fixed transition-all duration-400 ease-in-out bg-[#bbc2a5] xl:bg-[#fff0]  border-4 xl:border-none  border-[#dae0cb] xl:sticky xl:left-0 z-20 xl:block  overflow-auto  p-3  h-[calc(100vh-74.47px)]  top-[74.46px] `} >
      <GrMenu onClick={() => handleHamburger()} className=' cursor-pointer hover:text-gray-700 fixed left-2 top-5 text-3xl block xl:hidden' />
      <div className="sidenav">

        <div className='p-3 m-2 border-b-2 border-gray-600'>
          <NavLink onClick={() => dispatch(setShowSideNav(false))} to={"/"} className={(e) => { return e.isActive ? 'w-full flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'w-full flex rounded items-center gap-2 px-4 py-2' }}><IoHome /><span>Home</span></NavLink>
          <NavLink onClick={() => dispatch(setShowSideNav(false))} to={"/popular"} className={(e) => { return e.isActive ? 'flex w-full rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex w-full rounded items-center gap-2 px-4 py-2' }}><LuArrowUpRightSquare /><span>Popular</span></NavLink>
          {!isLogin && <NavLink onClick={() => dispatch(setShowSideNav(false))} to={"/about/"} className={(e) => { return e.isActive ? 'flex w-full  rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex w-full  rounded items-center gap-2 px-4 py-2' }}><BsInfoCircle /><span>About</span></NavLink>}
        </div>

        {isLogin && <div className='p-3 m-2 border-b-2  border-gray-600'>
          <button className='w-full' onClick={() => setOpenBar2((v) => !v)}>
            <div className=' flex items-center justify-between'>
              <div className='flex justify-center gap-2'>
                <FaHouseUser className=' text-2xl' /><span className=' text-lg font-semibold'>My Rooms</span>
              </div>
              <span className=''>{openBar2 ? <CiCircleChevDown size={25} /> : <CiCircleChevUp size={25} />}</span>
            </div>
          </button>

          <div className={`pl-6 m-4 flex flex-col gap-2 ${!openBar2 ? `hidden` : ``}`}>
            <CreateRoomBtn />

            {roomLoader ? <div className="mx-auto"><SmoothLoader /></div> : (myAllRoom?.map(function (val) {
              return <NavLink key={val.room.id} to={`/room/${val?.room?.CreatorId}/${val?.room?.title}`} state={{ joined: true }} className={'w-full flex rounded items-center gap-2 pl-4 py-1 hover:bg-[#65692375]'}><IoHome /><span className=' break-all overflow-clip line-clamp-1 w-5/6'>{val?.room.title}</span></NavLink>

            }))}
          </div>
        </div>}

        <div className={`  1_5md:hidden p-3 m-2 border-b-2 border-gray-600`}>
          <HotTopicNav />
        </div>
      </div>
      {isLogin && <div className='p-3 m-2 border-b-2 border-gray-600'>
        <button className=' w-full' onClick={() => setOpenBar((v) => !v)}>

          <div className=' flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <RiHomeWifiFill className=' text-2xl' /><span className=' text-lg font-semibold'>Public Rooms</span>
            </div>
            <span>{openBar ? <CiCircleChevDown size={25} /> : <CiCircleChevUp size={25} />}</span>
          </div>
        </button>
        <div className={`pl-6 m-4 gap-1 flex flex-col ${!openBar ? `hidden` : ``}`}>
          {roomLoader2 ? <div className="mx-auto"><SmoothLoader /></div> : (notJoinedRooms?.map(function (val) {
            return <NavLink key={val.id} to={`/room/${val?.CreatorId}/${val?.title}`} className={'w-full flex rounded items-center gap-2 pl-4 py-1 hover:bg-[#65692375]'}><IoHome /><span className='break-all overflow-clip line-clamp-1 w-5/6'>{val?.title}</span></NavLink>
          }))}
        </div>
      </div>}


    </nav>

    {hamburger && <div className="fixed inset-0 top-[74.46px] bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>}

  </>

  )
}

export default Sidenav
