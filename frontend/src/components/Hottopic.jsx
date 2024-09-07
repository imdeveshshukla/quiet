import React from 'react'
import Q from '../assets/q.svg'
const Hottopic = ({ topic, dp, bg }) => {

    return (
        <>

            <div className=''>
                <div className='border-black border-2 relative shadow-lg shadow-slate-300 rounded-2xl h-64 m-4  '>
                    <img className=' w-full h-full object-cover rounded-2xl' src={bg} alt="" />
                    <div className=' absolute left-14 bottom-0 border-4  translate-y-1/2  h-40 w-40 rounded-full overflow-hidden '>
                        <img className=' h-full w-full object-cover' src={dp} alt="" />
                    </div>
                </div>
                <div className='flex items-center relative  justify-end pr-8   w-full text-center text-lg xxs:text-2xl xs:text-3xl font-bold'>
            <img className=" w-7 xxs:w-8 xs:w-9 rounded-l-lg " src={Q} alt="" /><span className=" overflow-clip line-clamp-1 break-all max-w-[70%] bg-white text-[#6c712ed0] font-ubuntu rounded-r-lg px-1">{topic}</span>
          </div>
                <div className='h-[1.5px] bg-gray-800 mt-10'></div>
            </div>


        </>
    )
}

export default Hottopic
