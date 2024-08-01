import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loading } from '../redux/loading';
import { GrGallery } from "react-icons/gr";
import dp from '../assets/dummydp.png';
import axios from 'axios';
import { clearPostsInfo, setPost } from '../redux/Post';
import toast from 'react-hot-toast';
import { setUserInfo, setUserPost } from '../redux/user';
import SmallLoader from '../components/SmallLoader'
import { setSkeltonLoader } from '../redux/skelton';
import { useNavigate } from 'react-router-dom';



const Createpost = ({onNewPost}) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const selectFile= useRef(null);
    const Navigate= useNavigate()
    const [Btnloading,setLoading] = useState(false);
    const buttonRef = useRef(null);
    const dispatch = useDispatch();
    
    
    const [selectedOption, setSelectedOption] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    
    
    const handleChange=(e)=>{
      setImage(e.target.files[0]);
      console.log(e.target.files[0].name);
      
    }
    
    const handleSelectChange = (event) => {
      console.log(event.target.value);
      setSelectedOption(event.target.value);
    };

    const handleSubmit= async(e)=>{
      if (buttonRef.current) {
        buttonRef.current.disabled = true;
      }
        console.log(title+"\n"+description+"\n"+selectedOption);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('topic', selectedOption);
        formData.append('body', description);
        formData.append('postImg', image);
        console.log(formData);
        
                
        setLoading(true);
        toast.loading("Posting....");
        try {
          const response = await axios.post('http://localhost:3000/posts/postWithImg', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response.data.post);
          if(response.status==201){
            // dispatch(setPost(response.data.post));
            // dispatch(setUserPost(response.data.post))
            toast.dismiss();
            toast.success("Successfully Posted!")
            setTitle("")
            setDescription("")
            setSelectedOption("")
            setImage(null)
            // getUserData(userInfo.email);
            onNewPost()
          }
        } catch (error) {
          toast.dismiss()
          toast.error("Error uploading the post!")
          console.error('Error uploading the post:', error);
        }
        setLoading(false);
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
        
    }


    const getUserData=async(email)=>{ 
 
      // dispatch(loading())
   
      
      try {
        const res= await axios.get(`http://localhost:3000/u/${email}`, {withCredentials:true});
        console.log(res);
        if(res.status==200){
          dispatch(setUserInfo(res.data));
        }
      } catch (error) {
        console.log(error);
        
      } 
      // dispatch(loading())
   }





  return (
    <>
<div className='flex mt-6 px-28 justify-start  '>
<div className='flex  hover:bg-[#808449cf]  items-center px-2 py-1  rounded-full border-[1px] border-black '>
    
    <span className=' rounded-full border-2 border-white'>
    <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="15" fill="black" />
    <text x="50%" y="50%" font-size="18" text-anchor="middle" fill="white" font-family="Arial, sans-serif" dominant-baseline="middle">q/</text>
   </svg>
</span>
    <select className=' cursor-pointer bg-transparent py-2 px-4   outline-none'  id="options" value={selectedOption} onChange={(e)=>handleSelectChange(e)}>
      
      <option className='bg-[#808449] text-white font-extralight text-lg' value="">Select a Topic</option>
      <option className='bg-[#808449] text-white font-extralight text-lg' value="sports">Sports</option>
      <option className='bg-[#808449] text-white font-extralight text-lg' value="dsa">DSA</option>
      <option className='bg-[#808449] text-white font-extralight text-lg' value="iet">IET</option>
      <option className='bg-[#808449] text-white font-extralight text-lg' value="entertainment">Entertainment</option>
      <option className='bg-[#808449] text-white font-extralight text-lg' value="lifestyle">Lifestyle</option>
      <option className='bg-[#808449] text-white font-extralight text-lg' value="lucknow">Lucknow</option>
    </select>
  
  </div>
</div>
    <div  className=' p-8 flex relative justify-center gap-4'>
      <div className=''>
        <img src={userInfo && userInfo.dp ? userInfo.dp : dp}
              alt="Profile"
              className="w-24 h-24 rounded-full   bg-white "  />
      </div>
      <div className='w-[60%] '>
            <div className="inputs flex flex-col w-full gap-2 ">
                <input onChange={(e) => setTitle(e.target.value)} value={title}  className=' bg-[#e2e4c6] border rounded-md w-full outline-none focus:border-b-black p-2 ' type="text" name="title" id="title" placeholder='Title' required/>
                <textarea  onChange={(e) => setDescription(e.target.value)} required value={description}  className=' bg-[#e2e4c6] border  rounded-md w-full outline-none focus:border-b-black p-2 ' name="body" id="body" placeholder='Body'></textarea>
                <div className=''>
                  
                <span className=' line-clamp-1 overflow-clip mb-2 cursor-not-allowed underline text-blue-800 text-sm'>{image?.name}</span>
                  <button  onClick={()=>selectFile.current?.click()} className='flex items-center gap-2 border-2 text-blue-800 rounded-3xl border-blue-800 px-3 py-1 bg bg-blue-300 hover:bg-blue-400' type="button"><span>Upload</span><GrGallery/></button></div>
                <input onChange={(e)=>handleChange(e)} accept='image/*' ref={selectFile} type="file" name="media" id="media" hidden/>
            </div>
            <div className='flex justify-center'>
                <button onClick={(e)=>handleSubmit(e)} ref={buttonRef} className='  py-1 px-5  bg-blue-600 rounded-3xl hover:shadow-lg hover:text-white' type="submit">{Btnloading?<SmallLoader/>:"Post"}</button>
            </div>
            
            
      </div>
    </div>
    </>)

}

export default Createpost

