import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { GrGallery } from "react-icons/gr";
import dp from '../assets/dummydp.png'
const Createpost = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const selectFile= useRef(null);
    const [post, setPost] = useState({title:"", body:"", media:""})

     const handleChange=(e)=>{
        setPost({...post, [e.target.name]:e.target.value})
     }


    const handleSubmit= async()=>{
        console.log(post);
        
    }
  return (
    <div  className=' p-8 flex relative justify-center gap-4'>
      <div className=''>
        <img src={userInfo && userInfo.dp ? userInfo.dp : dp}
              alt="Profile"
              className="w-24 h-24 rounded-full   bg-white "  />
      </div>
      <div className='w-[60%] '>
            <div className="inputs flex flex-col w-full gap-2 ">
                <input onChange={(e)=>handleChange(e)} value={post.title}  className=' bg-[#e2e4c6] border rounded-md w-full outline-none focus:border-b-black p-2 ' type="text" name="title" id="title" placeholder='Title' />
                <textarea onChange={(e)=>handleChange(e)}  value={post.body}  className=' bg-[#e2e4c6] border  rounded-md w-full outline-none focus:border-b-black p-2 ' name="body" id="body" placeholder='Body'></textarea>
                <div><button  onClick={()=>selectFile.current?.click()} className='flex items-center gap-2 border-2 text-blue-800 rounded-3xl border-blue-800 px-3 py-1 bg bg-blue-300 hover:bg-blue-400' type="button"><span>Upload</span><GrGallery/></button></div>
                <input onChange={(e)=>handleChange(e)}  value={post.media} ref={selectFile} type="file" name="media" id="media" hidden />
            </div>
            <div className='flex justify-center'>
                <button onClick={()=>handleSubmit()} className='border-2 border-[#656923] py-1 px-4 bg-[#939851] rounded-3xl hover:shadow-lg hover:text-white' type="button">Post</button>
            </div>
      </div>
    </div>
  )
}

export default Createpost
