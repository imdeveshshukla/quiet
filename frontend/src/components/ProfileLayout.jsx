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


const ProfileLayout = ({ user }) => {
  const location = useLocation();
  const userInfo = useSelector((state) => state.user.userInfo);
  const dpUploadRef = useRef(null);
  const dpRef= useRef(null);
  const selectFile = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dpLoc, setdpLoc] = useState("");
  const dispatch= useDispatch();
  const [btnLoading,setBtnLoading] = useState(false);

  const currentPath = location.pathname.split('/').pop();
  
  const handleDpChange = async() => {
    const formData = new FormData();
    formData.append('profileImg', dpLoc);
    setBtnLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/u/uploadImg', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if(res.status==202){
            dispatch(setUserInfo(res.data));
            toast.success("Profile Picture Updated !")
            setIsOpen(false);
          }
    } catch (error) {
      if(error.response.status==403){
        toast.error("Profile picture could't be updated ! ")
      }
    }
    setBtnLoading(false)
  }


  const handleClickOutside = (event) => {
    if (dpUploadRef.current && !dpUploadRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleDpUpdate=async(e)=>{
    const file = e.target.files[0];
    setdpLoc(e.target.files[0])
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dpRef.current.src=reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  

  return (
    <>
    {isOpen && <div className='fixed top-0 left-0 z-10 min-h-screen min-w-full  backdrop-blur-sm'>
        <div ref={dpUploadRef} className='absolute left-[50%] top-[50%] rounded-3xl shadow-md w-[30vw] h-[40vh] translate-x-[-50%] translate-y-[-50%] bg-[#808449] p-4 flex items-center justify-center '>

          <div className=' rounded-2xl flex flex-col items-center justify-between gap-4'>
            <div className='relative  rounded-full'>
              <img ref={dpRef}  src={userInfo && userInfo.dp ? userInfo.dp : dp}
                alt="Profile"
                className="w-36 h-36 rounded-full   bg-white "
              />

              <button onClick={() => selectFile.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>

              <input onChange={(e)=> handleDpUpdate(e)}  accept='image/*' ref={selectFile} type="file" name="media" id="media" hidden />


            </div>
            <div className=' flex gap-4'>
              <button onClick={()=> setIsOpen(false)} className='px-4 py-2 rounded-3xl bg-white' type="button">Cancle</button>
              <button onClick={()=> handleDpChange()} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{btnLoading?<SmallLoader/>:"Save"}</button>
            </div>
          </div>

        </div>

      </div>}


    <div className='min-h-screen border-x-2 border-black pl-16'>
      <div className='flex items-center gap-6 py-6'>
        <div className='relative  rounded-full'>
        <img
          src={(userInfo?.username=== user?.username && userInfo?.dp)? userInfo.dp :user?.dp ? user.dp : dp}
          alt="Profile"
          className="w-36 h-36 rounded-full bg-white"
          />
          {userInfo?.username ===user.username && <button onClick={() => setIsOpen(true)} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>}
        </div>
        <div className='flex flex-col gap-1'>
          <div className='text-3xl font-bold'>{user.username}</div>
          <div className='font-semibold text-gray-700'>u/{user.username}</div>
        </div>
      </div>

      <div className='flex m-4 items-center gap-8'>
        <NavLink to="overview" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2'}>Overview</NavLink>
        <NavLink to="posts" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2'}>Posts</NavLink>
        <NavLink to="commented" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2'}>Commented</NavLink>
        <NavLink to="upvoted" className={(e) => e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2'}>Upvoted</NavLink>
      </div>

      <div className='border-b-2 border-black mr-2'></div>

      {currentPath === user.username && <Navigate to="overview" replace /> ||  console.log(user.username, "hello")
      
      
    }
      
      <Outlet context={{user}} />
    </div>
    </>
  );
};

export default ProfileLayout;
