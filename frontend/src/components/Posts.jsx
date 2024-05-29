import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import dp from '../assets/dummydp.png'
import { BiUpvote,BiUpArrow } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";
import { combineSlices } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { setPostDetail } from '../redux/Postdetail';

import { useState } from 'react';
import axios from 'axios';

const Posts = ({username,id,title, body, media,countComment}) => {

const Posts = ({postId, userId, username,title, body, media}) => {
  const userInfo= useSelector(state=> state.user.userInfo);
  const posts= useSelector(state=> state.post.posts);
  const Navigate= useNavigate();
  const dispatch= useDispatch();
  const handleComment=async(id)=>{

    if(id){
      let post= await  Array.from(posts).find(post=>post.id==id);
     
      dispatch(setPostDetail(post))
      Navigate(`/posts/${id}`);
    }
  }



 
  return (<>
    <div  className=' rounded-3xl  m-6 p-4 hover:bg-[#828a0026] '>
        <header  className='flex gap-2 items-center my-2'>

  const [upvoteNumber, setUpvote] = useState(0);
  const [upvoted,setUpvoted] = useState(false);
  const [downvoteNum,setDownvotenum] = useState(0);
  const [downvote,setDownVote] = useState(false);
  const getUpvote = async (key)=>{
    
    const res = await axios.post("http://localhost:3000/posts/upvoteNum",{ postId:key });
    // console.clear();
    console.clear();
    console.log(userInfo);
    console.log(res);
    const upvoteArr = res.data.upvote;
    const downvoteArr = res.data.downvote;
    setUpvote(res.data.numbers);
    setDownvotenum(res.data.downVoteNum)
    
    // console.log(upvoteArr);
    if(upvoteArr)
    {
      upvoteArr.map((mp)=>{
        if(mp?.userId == userInfo?.userId){
          console.log(upvoted);
          setUpvoted(true);
          console.log(upvoted);
        }
      })
    }
    if(downvoteArr)
    {
      downvoteArr.map((mp)=>{
        if(mp?.userId == userInfo?.userId){
          setDownVote(true);
        }
      })
    }

  }
  useEffect(() => {
    console.log("Under UseEffecy");
    getUpvote(postId);
  }, []);
  const upvote = async(key)=>{
    let val= 0;
    if(!upvoted)
    {
      setUpvoted(true);
      if(downvote)setDownvotenum((val)=>val-1);
      setDownVote(false);
      val = 1;
      setUpvote((upvoteNumber)=>upvoteNumber+1);
    }
    else{
      setUpvoted(false);
      val = 0;
      setUpvote((upvoteNumber)=>upvoteNumber-1)
    }
    const res = await axios.post("http://localhost:3000/posts/vote",{ postId:key, val});
    console.clear();
    console.log(res.data);
  }
  const downVoteFunc = async(key)=>{
    let val= 0;
    if(!downvote)
    {
      setDownVote(true);
      if(upvoted){
        setUpvote((val)=>val-1);
        setUpvoted(false);
      }
      val = -1;
      setDownvotenum((downvote)=>downvote+1);
    }
    else{
      setDownVote(false);
      val = 0;
      setDownvotenum((upvoteNumber)=>upvoteNumber-1)
    }
    const res = await axios.post("http://localhost:3000/posts/vote",{ postId:key, val});
    console.clear();
    console.log(res.data);
  }
 
  
  

  return (
    <div className=' rounded-3xl  m-6 p-4 hover:bg-[#828a0026] '>
        <header className='flex gap-2 items-center my-2'>
          <img  src={userInfo&&userInfo.dp? userInfo.dp:dp}
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer   bg-white" />
          <span className=' font-semibold cursor-pointer'>u/{username}</span>•<span className=' text-xs text-gray-700'>8 hrs ago</span>
          
        </header>
        <main onClick={()=>handleComment(id,username,title,body,media)} className=' cursor-pointer'>
          <div className='text-lg font-bold my-2'>{title}</div>
          <div className='my-2 '>{body}</div>
          <img className=' w-full  max-h-[420px] object-contain py-2 ' src={media} alt="postImg" />
        </main>
        <footer className='flex py-2 gap-6'>
          <div className=' rounded-3xl flex gap-1 items-start justify-center p-2 bg-zinc-400'>
          
          <BiUpvote onClick={()=>{upvote(postId)}} className={upvoted?'text-2xl hover:text-neutral-950 text-green-700 cursor-pointer':'text-2xl hover:text-green-700 text-neutral-950 cursor-pointer'}/>
          <span>{upvoteNumber}</span>
          <BiDownvote onClick={()=>{downVoteFunc(postId)}} className={downvote?'text-2xl hover:text-neutral-950 text-red-700  cursor-pointer':'text-2xl hover:text-red-700  cursor-pointer'}/>
          <span>{downvoteNum}</span>
          </div>

          <div onClick={()=>handleComment(id)} className=' rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-blue-300'>
          <GoComment className='text-2xl '/> 
          <span>{countComment}</span>
          </div>

          <div className=' rounded-3xl flex gap-2 items-start justify-center p-2 bg-amber-100 hover:text-amber-500 cursor-pointer'>
          <RiShareForwardLine className='text-2xl'/>
          <span>Share</span>
          </div>
        </footer>
    </div>
    <div className=' bg-gray-700 h-[1px]'></div>

    </>
  )
}

export default Posts
