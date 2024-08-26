// src/components/ProfileLayout.js
import React, { useRef, useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import dp from '../assets/dummydp.png';
import { useDispatch, useSelector } from 'react-redux'
import { PiCameraPlusLight } from "react-icons/pi";
import { setUserInfo } from '../redux/user';
import toast from 'react-hot-toast';
import SmallLoader from './SmallLoader'
import OnclickCard from './OnclickCard';
import { ProfileSkelton } from './Postskelton';
import baseAddress from '../utils/localhost';
import LeetCode from './LeetCode';
import LeetCodeLogo from '../assets/LeetCodeLogo'
import Codeforces from './Codeforces';


axios.defaults.withCredentials = true



const ProfileLayout = ({ isLoading, user }) => {
  const location = useLocation();
  const userInfo = useSelector((state) => state.user.userInfo);
  const dpUploadRef = useRef(null);
  const dpRef = useRef(null);
  const selectFile = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dpLoc, setdpLoc] = useState("");
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [showLCard, setshowLCard] = useState(false)
  const cardRef = useRef(null);


  const currentPath = location.pathname.split('/').pop();

  


  const handleClickOutside = (event) => {
    if (dpUploadRef.current && !dpUploadRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setshowLCard(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);





  const handleDpUpdate = async (e) => {
    const file = e.target.files[0];
    setdpLoc(e.target.files[0])

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dpRef.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }




  return (
    <>
      {isOpen && <div className='fixed top-0 left-0 z-10 min-h-screen min-w-full  backdrop-blur-sm'>
        <div ref={dpUploadRef} className='absolute left-[50%] top-[50%] w-[80%]  xs:w-[60%]  sm:w-[40%] rounded-3xl shadow-md h-[30%] lg:w-[30%] 2_md:h-[40%] translate-x-[-50%] translate-y-[-50%] bg-[#808449] p-4 flex items-center justify-center '>

          <div className=' rounded-2xl flex flex-col items-center justify-between gap-4'>
            <div className='relative  rounded-full'>
              <img ref={dpRef} src={userInfo && userInfo.dp ? userInfo.dp : dp}
                alt="Profile"
                className="w-36 h-36 rounded-full   bg-white "
              />

              <button onClick={() => selectFile.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>

              <input onChange={(e) => handleDpUpdate(e)} accept='image/*' ref={selectFile} type="file" name="media" id="media" hidden />


            </div>
            <div className=' flex gap-4'>
              <button onClick={() => setIsOpen(false)} className='px-4 py-2 rounded-3xl bg-white' type="button">Cancle</button>
              <button onClick={() => handleDpChange({dpLoc,setBtnLoading,setIsOpen,dispatch})} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{btnLoading ? <SmallLoader /> : "Save"}</button>
            </div>
          </div>

        </div>

      </div>}




      <div className='min-h-[calc(100vh-74.46px)] xs:pl-8 sm:pl-16'>
        {isLoading ? <ProfileSkelton /> : <><div className='relative flex items-center gap-3 xxs:gap-6 px-2 xxs:px-4 py-6'>
          <div className='relative  rounded-full'>
            <img
              src={(userInfo?.username === user?.username && userInfo?.dp) ? userInfo.dp : user?.dp ? user.dp : dp}
              alt="Profile"
              className="  w-32 h-32 xs:w-36 xs:h-36 rounded-full bg-white"
            />
            {userInfo?.username === user.username && <button onClick={() => setIsOpen(true)} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>}
          </div>
          <div className='flex flex-col gap-1'>
            <div className=' text-lg  xxs:text-2xl break-words xs:text-3xl font-bold'>{user.username}</div>
            <div className=' text-xs xxs:text-base font-semibold text-gray-700'>u/{user.username}</div>
            <div className=' text-sm xxs:text-base break-words font-semibold text-gray-800'>{userInfo?.bio}</div>
            {user?.showCf&&<div className=' text-sm xxs:text-base break-words font-semibold text-gray-800'><Codeforces rating={user?.codeforces}/></div>}
          </div>



          <div className=' 1_5md:hidden absolute top-4 right-4 xxs:right-8 xs:right-12 sm:right-20 '><OnclickCard /></div>


          {user.showLC && <div className='  absolute bottom-4 right-4  xxs:right-8 xs:right-12 sm:right-20 '>
            <button onClick={() => setshowLCard(true)} className=' bg-black rounded-full flex p-2 items-center justify-center'>
              <LeetCodeLogo />
            </button>
          </div>}

          {showLCard && <div className='fixed top-[74.46px] z-50 left-0 w-[100vw] h-[calc(100vh-74.46px)] bg-black bg-opacity-50 backdrop-blur-md ' >

            <span ref={cardRef} className='fixed left-[50%] top-[50%]  translate-x-[-50%] translate-y-[-50%]'>
              <LeetCode />
            </span>

          </div>}

        </div>

        </>}



        <div className='flex my-4 justify-evenly xs:m-4 items-center  xs:gap-4 sm:gap-8'>
          <NavLink to="overview" className={(e) => e.isActive ? 'flex rounded-2xl items-center px-3 py-1 xxs:px-4 xxs:py-2 bg-[#65692375]' : 'flex rounded items-center  px-3 py-1 xxs:px-4 xxs:py-2'}>Overview</NavLink>
          <NavLink to="posts" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-3 py-1 xxs:px-4 xxs:py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-3 py-1 xxs:px-4 xxs:py-2'}>Posts</NavLink>
          <NavLink to="commented" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-3 py-1 xxs:px-4 xxs:py-2 bg-[#65692375]' : 'flex rounded items-center px-3 py-1 xxs:px-4 xxs:py-2'}>Commented</NavLink>
          <NavLink to="upvoted" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-3 py-1 xxs:px-4 xxs:py-2 bg-[#65692375]' : 'flex rounded items-center px-3 py-1 xxs:px-4 xxs:py-2'}>Upvoted</NavLink>
        </div>

        <div className='border-b-2 border-black  mx-2'></div>

        {currentPath === user.username && <Navigate to="overview" replace />}

        <Outlet context={{ user }} />
      </div>
    </>
  );
};

export default ProfileLayout;

export const handleDpChange = async ({dpLoc, setBtnLoading, dispatch,setIsOpen}) => {
  const formData = new FormData();
  formData.append('profileImg', dpLoc);
  setBtnLoading(true);
  try {

    const res = await axios.post(baseAddress + 'u/uploadImg', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }, withCredentials: true,
    });

    if (res.status == 202) {
      dispatch(setUserInfo(res.data));
      toast.success("Profile Picture Updated !")
      setIsOpen(false);
    }
  } catch (error) {
    if (error.response.status == 403) {
      toast.error("Profile picture could't be updated ! ")
    }
    console.log(error.response);

  }
  setBtnLoading(false)
}
