import React, { useEffect } from 'react'
import banner from '../assets/banner.png'
import { useSelector } from 'react-redux';
import { PiShareFat } from "react-icons/pi";




const Profilecard = ({room}) => {
  
  
  
  
  let profileInfo;
  if(room)
    {
     
    profileInfo = useSelector(state => state.room.roomInfo)
    console.log("Fetched Details Inside Profile Info");
  
  }
  else
    profileInfo = useSelector(state => state.profile.profileInfo)


    

  
  let profileLink='';


  useEffect(() => {
    profileLink = room?`${window.location.origin}/room/${profileInfo?.CreatorId}/${profileInfo?.title}`:`${window.location.origin}/u/${profileInfo?.username}`;
    
  }, [profileInfo])
  
  


  const handleShare = async () => {

    if (navigator.share) {

      try {
        await navigator.share({
          title: room?`${profileInfo?.title}` :`${profileInfo?.username}'s Profile`,
          text: room?`Check out ${profileInfo?.title}'s profile on our site!` :`Check out ${profileInfo?.username}'s profile on our site!`,
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
  
  return (
    <div className=' w-[80vw] xxs:w-[75vw] xs:w-[65vw] sm:w-[50vw]  1_5md:w-full mx-0    rounded-3xl  bg-[#c2c7b3] '>
      <div className=' rounded-t-3xl h-32 w-full overflow-hidden'>
        <img className=' w-full h-full object-cover' src={banner} alt="" />
      </div>

      <div className=' p-4'>
          <div className=' text-xl font-bold'>{room? `Name : ${profileInfo?.title} `: profileInfo?.username}</div>

          <div>
            <button className='flex items-center bg-[#99a086] py-2 px-3  text-white my-2 gap-1 rounded-full' onClick={() => handleShare()}><PiShareFat className=' text-xl'/><span className=' text-xs font-medium'>Share</span></button>
          </div>

          <div className=' grid grid-cols-[1fr_1fr] gap-8 my-4'>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?._count?.posts || 0}</span>
              <span className=' text-sm text-gray-700'>{"Posts"}</span>
            </div>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{room?profileInfo?.UsersEnrolled?.filter((val)=>(val.joined==true)).length||0:profileInfo?._count?.comments||0}</span>
              <span className=' text-sm text-gray-700'>{room?"Members":"Comments"}</span>
            </div>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?.createdAt?.split("T")[0]}</span>
              <span className=' text-sm text-gray-700'>Cake day</span>
            </div>
            {room?<></>:<div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?._count?.upvotes|| 0}</span>
              <span className=' text-sm text-gray-700'>Upvotes</span>
            </div>}
          </div>

          <div className=' border-b '></div>
      </div>

    </div>
  )
}

export default Profilecard
