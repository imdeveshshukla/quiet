import React, { useEffect, useRef, useState } from 'react'
import banner from '../assets/banner.png'
import { useDispatch, useSelector } from 'react-redux';
import { PiCameraPlusLight, PiShareFat } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SmoothLoader from '../assets/SmoothLoader';
import baseAddress from '../utils/localhost';
import toast from 'react-hot-toast';
import axios from 'axios';
import SmallLoader from './SmallLoader';
import { setBgImg } from '../redux/profile';
import { setUserInfo } from '../redux/user';
import dp from '../assets/dummydp.png';





const Profilecard = ({ room }) => {

  const dispatch= useDispatch()
  const nav = useNavigate();
  const ref = useRef(null)
  const currUser = useSelector((state) => state.user.userInfo);
  const [loader1, setLoader] = useState(false);
  const [updateBtn, setupdateBtn] = useState(false)



  let profileInfo;
  if (room) {
    profileInfo = useSelector(state => state.room.roomInfo)
  }
  else
    profileInfo = useSelector(state => state.profile.profileInfo)





  let profileLink = '';
  
  
  useEffect(() => {
    profileLink = room ? `${window.location.origin}/room/${profileInfo?.CreatorId}/${profileInfo?.title}` : `${window.location.origin}/u/${profileInfo?.username}`;

  }, [profileInfo])


  




  const handleShare = async () => {

    if (navigator.share) {

      try {
        await navigator.share({
          title: room ? `${profileInfo?.title}` : `${profileInfo?.username}'s Profile`,
          text: room ? `Check out ${profileInfo?.title}'s profile on our site!` : `Check out ${profileInfo?.username}'s profile on our site!`,
          url: profileLink,
        });
        console.log('Profile shared successfully');
      } catch (error) {
        console.error('Error sharing profile', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(profileLink)
        .then(() => {
          alert('Profile link copied to clipboard');
        })
        .catch((error) => {
          console.error('Error copying link to clipboard', error);
        });
    }
  };


useEffect(() => {
  if(profileInfo && currUser && profileInfo?.username == currUser?.username){

    
    setupdateBtn(true)
  }else{
    setupdateBtn(false)
  }
  
}, [profileInfo,currUser])



  return (
    <div className=' w-[90vw]  xxs:w-[75vw] xs:w-[65vw] sm:w-[50vw]  1_5md:w-full mx-0    rounded-3xl  bg-[#c2c7b3] '>
      <div className=' relative rounded-t-3xl h-32 bg-gray-200 w-full overflow-hidden'>
        <img className=' w-full h-full object-cover' src={profileInfo?.bgImg || banner} alt="" />
        {(updateBtn && !room) &&<><button onClick={() => ref.current?.click()}
            className=" absolute border-black  flex text-sm font-bold bottom-2 bg-opacity-70 bg-slate-400 right-2 rounded-full p-1 border  hover:bg-gray-600">
            {loader1 ? <SmallLoader /> : <PiCameraPlusLight className=" text-xl " />}
          </button></>}
        <input type="file" onChange={(e) => updateBgImg({bgImg:e.target.files[0],setLoader,dispatch})} name="bgImg" accept="image/*" ref={ref} id="" hidden />
      </div>

      <div className=' p-4'>
        <div className=' break-all w-full line-clamp-3 overflow-clip text-xl font-bold'>{room ? <><span className='text-lg font-roboto font-medium'>Name:</span> {profileInfo?.title}</>  : profileInfo?.username}</div>

        <div>
          <button className='flex items-center bg-[#99a086] py-2 px-3  text-white my-2 gap-1 rounded-full' onClick={() => handleShare()}><PiShareFat className=' text-xl' /><span className=' text-xs font-medium'>Share</span></button>
        </div>

        <div className=' grid grid-cols-[1fr_1fr] gap-8 my-4'>
          <div className=' flex flex-col items-start'>
            <span className=' font-medium text-sm'>{profileInfo?._count?.posts || 0}</span>
            <span className=' text-sm text-gray-700'>{"Posts"}</span>
          </div>
          <div className=' flex flex-col items-start'>
            <span className=' font-medium text-sm'>{room ? profileInfo?.UsersEnrolled?.filter((val) => (val.joined == true)).length || 0 : profileInfo?._count?.comments || 0}</span>
            <span className=' text-sm text-gray-700'>{room ? "Members" : "Comments"}</span>
          </div>
          <div className=' flex flex-col items-start'>
            <span className=' font-medium text-sm'>{profileInfo?.createdAt?.split("T")[0]}</span>
            <span className=' text-sm text-gray-700'>Cake day</span>
          </div>
          {room ? <></> : <div className=' flex flex-col items-start'>
            <span className=' font-medium text-sm'>{profileInfo?._count?.upvotes || 0}</span>
            <span className=' text-sm text-gray-700'>Upvotes</span>
          </div>}
        </div>


        {!room && profileInfo?.username === currUser?.username && <>
          <div className=' border-b border-gray-500 mb-1 '></div>
          <div className=' cursor-default flex items-center justify-between'>
            <div className=' flex items-center gap-1'>
              <img className='h-9 w-9 rounded-full bg-white' src={profileInfo?.dp ||dp } alt="" />
              <div>
                <div className=' text-sm font-medium'>Profile</div>
                <div className='text-xs text-gray-500'>Customise your profile</div>
              </div>
            </div>
            <button className='flex items-center bg-[#99a086] py-2 px-3 hover:underline  text-white my-2 gap-1 rounded-full' onClick={() => nav('/setting/')}><CiEdit className=' text-xl' /><span className=' text-xs font-medium'>Edit</span></button>
          </div>
        </>
        }
      </div>

    </div>
  )
}

export default Profilecard

export const updateBgImg = async ({bgImg,setLoader,dispatch}) => {
  
  if(!bgImg){
    return;
  }
  
  setLoader(true);
  
  const formData = new FormData();
  formData.append('bgImg', bgImg);
  try {
    const res = await axios.post(`${baseAddress}u/updatebg`, formData);
    
    dispatch(setUserInfo(res.data))
    
    dispatch(setBgImg(res.data.bgImg));
    toast.success("Banner updated!")
  }
  catch (e) {
    console.log(e);
    toast.error("Error uploading image!");
  }
  finally {
    setLoader(false);
  }
}
