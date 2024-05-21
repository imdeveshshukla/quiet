import React from 'react'



const Loader = () => {
 

  return (
    <>
    <div className=' absolute z-10 bg-[#0005] backdrop-blur-sm h-full w-full flex justify-center items-center'>
        <div className=" w-32 h-32 box rounded-full border-t-4 animate-spin  border-white"></div>
    </div>
    </>
     
  )
}

export default Loader
