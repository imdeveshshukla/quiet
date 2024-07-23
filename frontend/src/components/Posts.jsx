import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import dp from '../assets/dummydp.png'
import { BiUpvote, BiUpArrow } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";

import { useNavigate } from 'react-router-dom';
import { setPostDetail } from '../redux/Postdetail';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';





const Posts = ({ id,post, title, body, media, countComment, createdAt, user,upvotes }) => {
  const userInfo = useSelector(state => state.user.userInfo);
  const isLogin = useSelector(state => state.login.value);
  const posts = useSelector(state => state.post.posts);
  const Navigate = useNavigate();
  const dispatch = useDispatch();


  const getTime = (createdAt) => {
    const postDate = new Date(createdAt).getTime();
    const crrTime = new Date().getTime();

    let sec = Math.floor((crrTime - postDate) / 1000);
    let min = Math.floor(sec / 60);
    let hours = Math.floor(sec / 3600)
    let day = Math.floor(sec / (60 * 60 * 24))
    let month = Math.floor(sec / (60 * 60 * 24 * 30));
    let years = Math.floor(sec / (60 * 60 * 24 * 30 * 12));
    const ans = years > 0 ? years + ' year' : (month > 0 ? month + ' month' : day > 0 ? day + " days" : hours > 0 ? hours + " hours" : min > 0 ? min + " minutes" : sec > 0 ? sec + " seconds" : 0 + " seconds");

    return ans;
  }






  const handleComment = async (id) => {
    if (!isLogin) {
      toast.dismiss()
      toast.error("Sign In First");
      return;
    }
    if (id) {
      Navigate(`/posts/${id}`);
    }
  }

  const [upvoteNumber, setUpvote] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoteNum, setDownvotenum] = useState(0);
  const [downvote, setDownVote] = useState(false);

  const getUpvote = async () => {

    
    const upvoteArr = await upvotes?.filter(vote => (vote.upvotes == 1 && vote.commentId==null));
    

    const downvoteArr = await upvotes?.filter(vote => (vote.upvotes == -1 && vote.commentId==null));
   

    setUpvote(upvoteArr?.length);
    setDownvotenum(downvoteArr?.length);

    if(await upvoteArr?.find(vote=> (vote.userId==userInfo?.userID ) )){
      setUpvoted(true);
    }
    if(await downvoteArr?.find(vote=> (vote.userId==userInfo?.userID ))){
      setDownVote(true)
    }

  }



  useEffect(() => {
    // console.log("Under UseEffect");
    getUpvote();
  }, []);


  const upvote = async (key) => {
    if(isLogin) {
      // console.clear()
      // console.log(key);
      let val = 1;
      if (!upvoted) {
        setUpvoted(true);
        if (downvote) setDownvotenum((val) => val - 1);
        setDownVote(false);
        val = 1;
        setUpvote((upvoteNumber) => upvoteNumber + 1);
      }
      else {
        setUpvoted(false);
        val = 0;
        setUpvote((upvoteNumber) => upvoteNumber - 1)
      }

      const res = await axios.post("http://localhost:3000/posts/vote", { postId: key, val ,commentId:null });

      if(res.status==201){
        console.log(res);
        
        // dispatch(toggleUpvote(res.data.newUpvote))
      }
      
    }
    else {
      toast.dismiss();
      toast.error("Sign In First");
    }
  }
  const downVoteFunc = async (key) => {
    if (!isLogin) {
      toast.dismiss();
      toast.error("Sign In First");
      return;
    }
     let val = -1;
    if (!downvote) {
      setDownVote(true);
      if (upvoted) {
        setUpvote((val) => val - 1);
        setUpvoted(false);
      }
      val = -1;
      setDownvotenum((downvote) => downvote + 1);
    }
    else {
      setDownVote(false);
      val = 0;
      setDownvotenum((upvoteNumber) => upvoteNumber - 1)
    }
    const res = await axios.post("http://localhost:3000/posts/vote", { postId: key, val, commentId: null });
    if(res.status==201){
      console.log(res);
    }

  }



  return (<>
  
    <div className='px-8 py-4  border-2 border-[#f9ff86] rounded-2xl   animate-glow m-8'>

      <header className='flex gap-2 items-center my-2'>
        <img src={user && user.dp ? user.dp : dp}
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer   bg-white" />
        <span className=' font-semibold cursor-pointer'>u/{user?.username}</span>•<span className=' text-xs text-gray-700'>{`${getTime(createdAt)} ago`}</span>

      </header>
      <main onClick={() => handleComment(id)} className=' cursor-pointer'>
        <div className='text-lg font-bold my-2'>{title}</div>
        <div className='my-2 '>{body}</div>
        {!media ? "" :
          <img className=' w-full  max-h-[420px] object-contain py-2 ' src={media} alt="postImg" />
        }</main>
      <footer className='flex py-2 gap-6'>
        <div className={upvoted?' rounded-3xl flex gap-1 items-start justify-center p-2 bg-green-600 text-white':downvote?' rounded-3xl flex gap-1 items-start justify-center p-2 bg-red-600 text-white':' rounded-3xl flex gap-1 items-start justify-center p-2 bg-zinc-400 text-black'}>

          <BiUpvote onClick={() => { upvote(id) }} className={upvoted ? 'text-2xl hover:text-neutral-950 text-green-900  cursor-pointer' : 'text-2xl hover:text-green-700  cursor-pointer'} />
          <span>{upvoteNumber}</span>
          <BiDownvote onClick={() => { downVoteFunc(id) }} className={downvote ? 'text-2xl hover:text-neutral-950 text-red-900  cursor-pointer' : 'text-2xl hover:text-red-700  cursor-pointer'} />
          <span>{downvoteNum}</span>
        </div>

        <div onClick={() => handleComment(id)} className=' rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-blue-300'>
          <GoComment className='text-2xl ' />
          <span>{countComment ? countComment : 0}</span>
        </div>

        <div className=' rounded-3xl flex gap-2 items-start justify-center p-2 bg-amber-100 hover:text-amber-500 cursor-pointer'>
          <RiShareForwardLine className='text-2xl' />
          <span>Share</span>
        </div>
      </footer>
    </div>
    <div className=' bg-gray-700 h-[1px]'></div>

  </>
  )
}

export default Posts;
