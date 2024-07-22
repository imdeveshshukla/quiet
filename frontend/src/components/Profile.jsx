import React, { useRef, useState, useEffect } from 'react'
import dp from '../assets/dummydp.png'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { PiCameraPlusLight } from "react-icons/pi";
import { setUserInfo } from '../redux/user';
import toast from 'react-hot-toast';
import SmallLoader from './SmallLoader'

const Profile = () => {
  const dpUploadRef = useRef(null);
  const dpRef= useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectFile = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dpLoc, setdpLoc] = useState("");
  const dispatch= useDispatch();
  const [btnLoading,setBtnLoading] = useState(false);


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

      <div className='overflow-auto '>

        <div className=' border-b-2 mr-2 border-black'>
          <div className='flex items-center gap-6'>
            <div className='relative  rounded-full'>
              <img src={userInfo && userInfo.dp ? userInfo.dp : dp}
                alt="Profile"
                className="w-36 h-36 rounded-full   bg-white " />


              {/* <button onClick={() => selectFile.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>
              <input onChange={() => setIsOpen(true)} accept='image/*' ref={selectFile} type="file" name="media" id="media" hidden /> */}

              <button onClick={() => setIsOpen(true)} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>

            </div>
            <div>
              <h2 className=' text-3xl font-bold '>{userInfo && userInfo.username ? userInfo.username : 'Anonymous'}</h2>
              <p className=' text-gray-600 font-semibold'>u/{userInfo && userInfo.username ? userInfo.username : 'Anonymous'}</p>
            </div>
          </div>
          <div className='flex m-8 items-center gap-8'>
            <NavLink to={"/profile/overview"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}><span>Overview</span></NavLink>
            <NavLink to={"/profile/posts"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}>Posts</NavLink>
            <NavLink to={"/profile/commented"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}>Commented</NavLink>
            <NavLink to={"/profile/upvoted"} className={(e) => { return e.isActive ? 'flex rounded-2xl items-center gap-2 px-4 py-2 bg-[#65692375]' : 'flex rounded items-center gap-2 px-4 py-2' }}>Upvoted</NavLink>
          </div>
        </div>

        



      </div>

    </>
  )
}

export default Profile
