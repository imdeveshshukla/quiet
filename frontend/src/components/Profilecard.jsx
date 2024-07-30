import React from 'react'
import banner from '../assets/banner.png'
import { useSelector } from 'react-redux';
import { PiShareFat } from "react-icons/pi";




const Profilecard = () => {

  const profileInfo = useSelector(state => state.profile.profileInfo)


  const profileLink = `${window.location.origin}/u/${profileInfo?.username}`;

  const handleShare = async () => {
    console.log(profileInfo);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileInfo?.username}'s Profile`,
          text: `Check out ${profileInfo?.username}'s profile on our site!`,
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
    <div className='m-12 rounded-3xl h-fit bg-[#c2c7b3] '>
      <div className=' rounded-t-3xl h-32 w-full overflow-hidden'>
        <img className=' w-full h-full object-cover' src={banner} alt="" />
      </div>

      <div className=' p-4'>
          <div className=' text-xl font-bold'>{profileInfo?.username}</div>

          <div>
            <button className='flex items-center bg-[#99a086] py-2 px-3  text-white my-2 gap-1 rounded-full' onClick={() => handleShare()}><PiShareFat className=' text-xl'/><span className=' text-xs font-medium'>Share</span></button>
          </div>

          <div className=' grid grid-cols-[1fr_1fr] gap-6 my-4'>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?._count?.posts}</span>
              <span className=' text-sm text-gray-700'>Posts</span>
            </div>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?._count?.comments}</span>
              <span className=' text-sm text-gray-700'>Comments</span>
            </div>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?.createdAt?.split("T")[0]}</span>
              <span className=' text-sm text-gray-700'>Cake day</span>
            </div>
            <div className=' flex flex-col items-start'>
              <span className=' font-medium text-sm'>{profileInfo?._count?.upvotes}</span>
              <span className=' text-sm text-gray-700'>Upvotes</span>
            </div>
          </div>

          <div className=' border-b '></div>
      </div>

    </div>
  )
}

export default Profilecard
