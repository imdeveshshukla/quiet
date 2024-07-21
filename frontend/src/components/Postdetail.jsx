import React, { useState,useEffect, useMemo } from 'react'
import Posts from './Posts'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlinePlus } from "react-icons/ai";
import {  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { clearPostDetail, setComment, setPostDetail } from '../redux/Postdetail';
import dp from '../assets/dummydp.png'
import { setPostComment } from '../redux/Post';
import SmallLoader from './SmallLoader';
import Postskelton from './Postskelton';
import { setUserPostComment } from '../redux/userposts';
import { CommentBody, CommentBody2, CommentBox } from './Comments';





axios.defaults.withCredentials = true


const Postdetail = () => {
    const post= useSelector(state=>state.postDetail.post);
    // const userInfo= useSelector(state=>state.user.userInfo);
    const isLogin= useSelector(state=>state.login.value);
    const Navigate= useNavigate()
    const dispatch= useDispatch()
    const location = useLocation();

    const getApost=async(id)=>{
        try {
          const res = await axios.get("http://localhost:3000/posts/getapost", { 
            params:{
              id
            }
          });
          console.log(res);
          
          if(res.status==200){
            dispatch(setPostDetail(res.data.post))
          }
        } catch (error) {
          console.log(error);
          
        }
      }
 
      useEffect(() => {
        dispatch(clearPostDetail())
        let loc=String(location.pathname)
        if(loc.includes("/posts/")){
            let id= loc.split("/posts/")[1];
            console.log("postDetailID",id);
            getApost(id)   
        }
      },[])
      




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
    
    const groupComments = useMemo(()=>{
      const group = {}
      const temp = []
      post?.comments.forEach((comment)=>{
          group[comment.parentId] ||= [];
          group[comment.parentId].push(comment);
      })
      return group;
    },[post?.comments])

    function getChildren(id){
        return groupComments[id]
    }
  // console.log("Groupd Comments = "+JSON.stringify(groupComments));
  return (<>
    <div className='h-full overflow-auto border-x-2 border-black pl-16'>
      {post?<Posts key={post?.id}  id={post?.id} title={post?.title} body={post?.body} media={post?.img} countComment={post?.comments?.length} createdAt={post?.createdAt} user={post?.user} upvotes={post?.upvotes}/>:<Postskelton/>}

      <div className=' m-4'>
        {isLogin?  <CommentBox/>

        :<button onClick={()=>Navigate("/signin")} className='flex items-center gap-2 border border-black rounded-3xl px-4 py-2' type="button"><AiOutlinePlus className='text-2xl'/><span>Add a comment</span></button> }
        
      </div>
    <div className=' bg-gray-700 h-[1px]'></div>
    
    <div className='m-4'>
    {console.log(post?.comments)};
    <CommentBody comments={groupComments[null]} postId={post?.id} getChildren={getChildren}  dp={dp} getTime={getTime}/>
    {/* <CommentBody comments={post?.comments} dp={dp} getTime={getTime}/> */}
    </div>

    </div>
    </>
  )
}
export default Postdetail
