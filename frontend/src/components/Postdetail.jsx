import React, { useState,useEffect, useMemo } from 'react'
import Posts, { sendNotification } from './Posts'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlinePlus } from "react-icons/ai";
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { clearPostDetail, setComment, setPostDetail } from '../redux/Postdetail';
import dp from '../assets/dummydp.png'
import { setPostComment } from '../redux/Post';
import SmallLoader from './SmallLoader';
import Postskelton from './Postskelton';
import { setUserPostComment } from '../redux/userposts';
import { CommentBody, CommentBody2, CommentBox } from './Comments';
import baseAddress from '../utils/localhost';





axios.defaults.withCredentials = true


const Postdetail = ({ myRooms }) => {
    const post= useSelector(state=>state.postDetail.post);
    const userInfo= useSelector(state=>state.user.userInfo);
    const isLogin= useSelector(state=>state.login.value);
    const Navigate= useNavigate()
    const dispatch= useDispatch()
    const location = useLocation();
    const {id}= useParams();
    const {roomid} = useParams();

    const getApost=async()=>{
        if(myRooms){
          let found = false;
          console.log(myRooms);
          console.log(roomid);
          myRooms.map((room)=>{
            if(room.room.id === roomid)found = true;
          });
          if(!found){
            toast.error("Unauthorised");
            return;
          }
        }
        try {
          const res = await axios.get(baseAddress+"posts/getapost", { 
            params:{
              id,
            }
          });
          
          if(res.status==200){
            dispatch(setPostDetail(res.data.post))
          }
        } catch (error) {
          console.log(error);
        }
      }
 
      useEffect(() => {
        dispatch(clearPostDetail())
        getApost()   
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
    <div className=' min-h-screen overflow-auto xs:pl-4 sm:pl-16 1_5md:pl-2  2_md:pl-16'>
      {post?<Posts key={post?.id}  id={post?.id} title={post?.title} body={post?.body} media={post?.img} countComment={post?.comments?.length} createdAt={post?.createdAt} user={post?.user} upvotes={post?.upvotes} postDetails={true}/>:<Postskelton/>}

      <div className=' m-4'>
        {isLogin?  <CommentBox/>

        :<button onClick={()=>Navigate("/signin")} className='flex items-center gap-2 border border-black rounded-3xl px-4 py-2' type="button"><AiOutlinePlus className='text-2xl'/><span>Add a comment</span></button> }
        
      </div>
    <div className=' bg-gray-700 h-[1px]'></div>
    
    <div className=' m-2 xs:m-4'>
      <div className=' text-xl font-bold mb-4 underline'>Comments:</div>
    {/* {console.log(post?.comments)}; */}
    <CommentBody comments={groupComments[null]} postId={post?.id} getChildren={getChildren} userId={userInfo?.userID}  dp={dp} getTime={getTime}/>
    {/* <CommentBody comments={post?.comments} dp={dp} getTime={getTime}/> */}
    </div>

    </div>
    </>
  )
}
export default Postdetail
