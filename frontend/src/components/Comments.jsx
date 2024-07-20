import axios from 'axios';

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import SmallLoader from './SmallLoader';
import { setComment } from '../redux/Postdetail';
import { setUserPostComment } from '../redux/userposts';
import { setPostComment } from '../redux/Post';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go';
import { RiShareForwardLine } from 'react-icons/ri';
//test




export const CommentBox = () => {
  const [isComment,setIsComment]= useState(false)
  const [comment, setcomment] = useState("")
  const dispatch= useDispatch()
  const [loading,setLoading] = useState(false);
  const post= useSelector(state=>state.postDetail.post);

  const addComment= async ()=>{
    toast.loading("Adding your comment...");
    setLoading(true);
    console.log(comment);
    try {
        const res= await axios.post(`http://localhost:3000/posts/createcomment`, {withCredentials:true,postId: post?.id, content:comment});
        console.log(res);
        if(res.status==201){
            setIsComment(false)
            console.log(res.data.newComment);
            dispatch(setComment(res.data.newComment))
            dispatch(setUserPostComment(res.data.newComment))
            dispatch(setPostComment(res.data.newComment))
            console.log(post);
            toast.dismiss();
            toast.success("Comment Added.")
            setcomment("");
        }
    }
    catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error("Failed to Add Comment");
        if(error.response?.status==500){
            toast.error("Server Issue!!");
        }
    }   
    setLoading(false);
  }

  return (
    <div className={isComment?'border bg-[#e2e4c6]  rounded-3xl border-black':'outline-none border bg-[#e2e4c6]  rounded-3xl border-gray-500'} >
            <textarea onClick={()=>setIsComment(true)} onChange={(e)=> setcomment(e.target.value)} value={comment} className='w-full bg-transparent outline-none rounded-3xl px-4 py-2 '  placeholder='Add a Comment' name="comment" id="comment"></textarea>
            {isComment&& <div className='flex gap-3 p-3 justify-end'>
                <button onClick={()=>{setIsComment(false)
                    setcomment("")
                }} className='px-4 py-2 rounded-3xl bg-gray-500 ' type="button">Cancel</button>
                <button onClick={()=>addComment()} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{!loading?"Comment":<SmallLoader/>}</button> 
                </div>}
            </div>
  )
}

export const CommentBody=({dp,body,user,createdAt,getTime})=>(<>        //old one
    <div className='p-2'>
         <header className='flex items-center gap-2'>
             <img src={user.dp? user.dp:dp}
               alt="Profile"
               className="w-8 h-8 rounded-full   bg-white " />
               <span className=' text-sm  font-medium'>u/{user.username}</span>•<span className=' text-xs text-gray-600'>{getTime(createdAt)} ago</span>
         </header>
         <main className='p-2'>
             {body}
         </main>
    </div>
 
    </>
)
export function CommentBody2({dp,body,user,createdAt,getTime}){ //currently using 
    const [upvoted,isUpvoted] = useState(false);
    const [downvote,isDownVoted] = useState(false);
    
    const [countComment,setCountCommnet] = useState(0);
    return(<>   
    {/* <div className='p-1'> */}
    <div class="relative grid grid-cols-1 gap-4 p-4 mb-5 border rounded-lg bg-[#6d712eb8] shadow-lg">
    <div class="relative flex gap-4">
        <img src={dp} class="relative rounded-lg -top-1 -mb-4 bg-[#6d712eb8] border h-12 w-12" alt="" loading="lazy"/>
        <div class="flex flex-col w-full">
            <div class="flex flex-row justify-between">
                <p class="relative text-l whitespace-nowrap truncate overflow-hidden">{user.username}</p>
                {/* <a class="text-gray-500 text-xl" href="#"><i class="fa-solid fa-trash"></i></a> */}
            </div>
            <p class="text-gray-800 text-sm">{createdAt}</p>
        </div>
    </div>
        <p class="-mt-4 text-gray-100">{body}</p>
        <div className="btns">
        <footer className='flex gap-6'>
        <div className={upvoted?' rounded-l flex gap-1 items-start justify-center p-2 bg-green-600 text-white':downvote?' rounded-3xl flex gap-1 items-start justify-center p-2 bg-red-600 text-white':' rounded-3xl flex gap-1 items-start justify-center p-2 bg-zinc-400 text-black'}>

          <BiUpvote onClick={() => { upvote(id) }} className={upvoted ? 'text-l hover:text-neutral-950 text-green-900  cursor-pointer' : 'text-l hover:text-green-700  cursor-pointer'} />
          <span>{0}</span>
          <BiDownvote onClick={() => { downVoteFunc(id) }} className={downvote ? 'text-l hover:text-neutral-950 text-red-900  cursor-pointer' : 'text-l hover:text-red-700  cursor-pointer'} />
          <span>{0}</span>
        </div>

        <div onClick={() => handleComment(id)} className=' rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-blue-300'>
          <GoComment className='text-l' />
          <span>{countComment ? countComment : 0}</span>
        </div>
      </footer>
        </div>
    </div>

    </>)}


export default CommentBox
