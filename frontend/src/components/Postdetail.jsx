import React, { useState,useEffect } from 'react'
import Posts from './Posts'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlinePlus } from "react-icons/ai";
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setComment } from '../redux/Postdetail';
import dp from '../assets/dummydp.png'
import { setPostComment } from '../redux/Post';




axios.defaults.withCredentials = true


const Postdetail = () => {
    const post= useSelector(state=>state.postDetail.post);
    const userInfo= useSelector(state=>state.user.userInfo);
    const isLogin= useSelector(state=>state.login.value);
    const Navigate= useNavigate()
    const [isComment,setIsComment]= useState(false)
    const [comment, setcomment] = useState("")
    const dispatch= useDispatch()

    

    const addComment= async ()=>{
        console.log(comment);
        try {
            const res= await axios.post(`http://localhost:3000/posts/createcomment`, {withCredentials:true,postId: post?.id, content:comment, dp:userInfo?.dp, username: userInfo.username});
            console.log(res);
            if(res.status==201){
                console.log(res.data.newComment);
                dispatch(setComment(res.data.newComment))
                dispatch(setPostComment(res.data.newComment))
                
                console.log(post);
                
                toast.success("Comment Added.")
                setcomment("");
            }
        } catch (error) {
            console.log(error);
            
            if(error.response?.status==500){
                toast.error("Failed to add comment")
            }
        }   
    }

    const getAllComment=async()=>{
        console.log(post);
        
    }

    useEffect(() => {
        getAllComment();
    }, [])
    
    


  return (<>
    <div className='h-full overflow-auto border-x-2 border-black pl-16'>
      <Posts key={post?.id}  username={post?.username} id={post?.id} title={post?.title} body={post?.body} media={post?.img} countComment={post?.comments.length}/>

      <div className=' m-4'>
        {isLogin?  <div className={isComment?'border bg-[#e2e4c6]  rounded-3xl border-black':'outline-none border bg-[#e2e4c6]  rounded-3xl border-gray-500'} >
            <textarea onClick={()=>setIsComment(true)} onChange={(e)=> setcomment(e.target.value)} value={comment} className='w-full bg-transparent outline-none rounded-3xl px-4 py-2 '  placeholder='Add a Comment' name="comment" id="comment"></textarea>
            {isComment&& <div className='flex gap-3 p-3 justify-end'>
                <button onClick={()=>{setIsComment(false)
                    setcomment("")
                }} className='px-4 py-2 rounded-3xl bg-gray-500 ' type="button">Cancel</button>
                <button onClick={()=>addComment()} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">Comment</button> 
                </div>}
            </div>

        :<button onClick={()=>Navigate("/signin")} className='flex items-center gap-2 border border-black rounded-3xl px-4 py-2' type="button"><AiOutlinePlus className='text-2xl'/><span>Add a comment</span></button> }
        
      </div>
    <div className=' bg-gray-700 h-[1px]'></div>
    
    <div className='m-4'>
        {post?.comments.map(comment=>{
            return <Comment key={comment.id} dp={dp} pic={comment.dp} body={comment.body} username={comment.username} />
        })}
            
    </div>

    </div>
    </>
  )
}
export const Comment=({username,pic,dp,body})=>(<>
   <div>
        <header className='flex items-center gap-2'>
            <img src={pic? pic:dp}
              alt="Profile"
              className="w-8 h-8 rounded-full   bg-white "  />
              <span className=' text-sm  font-medium'>u/{username}</span>•<span className=' text-xs text-gray-600'>{`8hrs ago`}</span>
        </header>
        <main className='p-2'>
            {body}
        </main>
   </div>
   <div className=' bg-gray-700 h-[1px]'></div>

   </>
)

export default Postdetail
