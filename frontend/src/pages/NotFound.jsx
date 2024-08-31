// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";


const NotFound = ({gotError}) => {
  return (
    <div className=" left-0  top-0 w-full flex flex-col items-center justify-center h-[calc(100vh-74.46px)] bg-[#d1d3b2] ">
      <div className="flex flex-col items-center text-gray-700 mx-4">

        <div className=' flex flex-col p-6 gap-2 border-[12px] border-[#6d712eb8] rounded-xl w-full'>

          <div className=' flex items-center gap-2 '>
            <span className=' h-3 w-3 bg-[#6d712eb8] rounded-full '></span>
            <span className=' h-3 w-3 bg-[#6d712eb8] rounded-full '></span>
            <span className=' h-3 w-3 bg-[#6d712eb8] rounded-full '></span>
          </div>

          <div className='h-3 border rounded-full bg-[#6d712eb8]'></div>

            <div className='flex justify-center items-center text-[#6d712eb8]'>
                <div className=' text-9xl font-medium'>{'{'}</div>
                <div className=' text-8xl relative font-medium'>4</div>
                <div className=' text-8xl font-mono relative top-5 font-medium'>0</div>
                <div className=' text-8xl relative font-medium'>4</div>
                <div className=' text-9xl font-medium'>{'}'}</div>
            </div>

        </div>

        <h1 className="text-2xl font-bold mb-2 text-[#6d712eb8]">Page Not Found</h1>
        <p className=" mb-4 text-[#6d712eb8]">Sorry, but we can't find the page you are looking for...</p>
        {!gotError&&<Link to="/" className=" border-black flex items-center gap-2 border rounded py-1 px-4  hover:bg-[#c2c596e0] hover:text-blue-500"
        >
          <IoHome className=' text-gray-700 ' /><span>Back to Home</span>
        </Link>}
      </div>
    </div>
  );
};

export default NotFound;
