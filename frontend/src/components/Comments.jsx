import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import SmallLoader from './SmallLoader';
import { setComment } from '../redux/Postdetail';
import { setUserPostComment } from '../redux/userposts';
import { setPostComment } from '../redux/Post';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { GoComment } from 'react-icons/go';
import { RiShareForwardLine } from 'react-icons/ri';
import { PiTextUnderlineFill } from 'react-icons/pi';
import { format } from 'date-fns';
import { IoArrowDownCircleOutline } from "react-icons/io5";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

//test




export const CommentBox = ({ commentId = null }) => {
  const [isComment, setIsComment] = useState(false)
  const [comment, setcomment] = useState("")
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const post = useSelector(state => state.postDetail.post);
  console.log("CommentId " + commentId);
  const addComment = async () => {
    toast.loading("Adding your comment...");
    setLoading(true);
    console.log(comment);
    try {
      const res = await axios.post(`http://localhost:3000/posts/createcomment`, {
        withCredentials: true, postId: post?.id,
        commentId, content: comment
      });
      console.log(res);
      if (res.status == 201) {
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
      if (error.response?.status == 500) {
        toast.error("Server Issue!!");
      }
    }
    setLoading(false);
  }

  return (
    <div className={isComment ? 'border bg-[#e2e4c6]  rounded-3xl border-black' : 'outline-none border bg-[#e2e4c6]  rounded-3xl border-gray-500'} >
      <textarea onClick={() => setIsComment(true)} onChange={(e) => setcomment(e.target.value)} value={comment} className='w-full bg-transparent outline-none rounded-3xl px-4 py-2 ' placeholder='Add a Comment' name="comment" id="comment"></textarea>
      {isComment && <div className='flex gap-3 p-3 justify-end'>
        <button onClick={() => {
          setIsComment(false)
          setcomment("")
        }} className='px-4 py-2 rounded-3xl bg-gray-500 ' type="button">Cancel</button>
        <button onClick={() => addComment()} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{!loading ? "Comment" : <SmallLoader />}</button>
      </div>}
    </div>
  )
}

export function CommentBody({ comments, getChildren, dp, getTime, postId, userId }) {

  return (<>
  <div className=' flex flex-col  gap-2'>
    {comments?.map(comment => {
      return <CommentBody2 key={comment.id} id={comment.id} userId={userId} postId={postId} dp={dp} getChildren={getChildren} body={comment.body} user={comment.user} createdAt={comment.createdAt} getTime={getTime} />
    })}
    </div>
  </>
  )
}
export function CommentBody2({ id, dp, body, user, createdAt, getTime, getChildren, postId, userId }) { //currently using 
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownVoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvote] = useState(0);
  const [openBox, setOpenBox] = useState(false);
  const [showChild, setShowChild] = useState(false);
  const childs = getChildren(id) == undefined ? [] : getChildren(id);

  function handleComment(id) {
    setOpenBox((openBox) => !openBox);

  }
  async function getUpvote() {
    const res = await axios.post("http://localhost:3000/posts/upvoteNum", { postId: postId, commentId: id });
    // console.log("Inside getUPvote = "+JSON.stringify(res.data));
    setUpvotes(res.data.numbers);
    res.data.upvote.forEach((item) => {
      if (item.userId == userId) setUpvoted(true);
    })
    res.data.downvote.forEach((item) => {
      if (item.userId == userId) setDownVoted(true);
    })
    setDownvote(res.data.downVoteNum)
  }

  useEffect(() => {
    getUpvote();
  }, [])

  async function upvote() {

    let val = 1;
    if (!upvoted) {
      setUpvoted(true);
      if (downvoted) setDownvote((val) => val - 1);
      setDownVoted(false);
      val = 1;
      setUpvotes((upvoteNumber) => upvoteNumber + 1);
    }
    else {
      setUpvoted(false);
      val = 0;
      setUpvotes((upvoteNumber) => upvoteNumber - 1)
    }

    const res = await axios.post("http://localhost:3000/posts/vote", { commentId: id, val, postId: postId });

    if (res.status == 201) {
      console.log(res);
    }
  }

  async function downvote() {
    let val = -1;
    if (!downvote) {
      setDownVoted(true);
      if (upvoted) {
        setUpvotes((val) => val - 1);
        setUpvoted(false);
      }
      val = -1;
      setDownvote((downvote) => downvote + 1);
    }
    else {
      setDownVoted(false);
      val = 0;
      setDownvote((upvoteNumber) => upvoteNumber - 1)
    }
    const res = await axios.post("http://localhost:3000/posts/vote", { commentId: id, val, postId: postId });
    if (res.status == 201) {
      console.log(res);
    }
  }
  // console.log("key = "+id);
  return (<>

    <div className="relative flex flex-col gap-2 py-2 px-14  border rounded-2xl bg-[#e2e4c6] shadow-md shadow-current justify-center">
      <div className="relative flex gap-2 items-center">

        <img src={user.dp ? user.dp : dp} className="relative rounded-full -top-1 -mb-4  border h-8 w-8 object-contain bg-white" alt="" loading="lazy" />

        <div className="flex items-center w-full gap-2">
          <div className="flex flex-row justify-between">
            <p className="relative  whitespace-nowrap truncate overflow-hidden">u/{user.username}</p>
            {/* <a className="text-gray-500 text-xl" href="#"><i className="fa-solid fa-trash"></i></a> */}
          </div><span>•</span>
          <p className="text-gray-500 text-xs">{format(new Date(createdAt), 'MMMM d, yyyy h:mm a')}</p>
        </div>
      </div>
      <div className=' mx-10  whitespace-pre-wrap break-words'>{body}</div>
      <div className="btns">
        <footer className='flex gap-4 items-center'>
          <div className={upvoted ? ' rounded-3xl flex gap-1 items-center justify-center px-3 bg-green-600 text-white' : downvoted ? ' rounded-3xl flex gap-1 items-center justify-center px-3 bg-red-600 text-white' : ' rounded-3xl flex gap-1 items-center justify-center px-3 bg-zinc-400 text-black'}>

            <BiUpvote onClick={() => { upvote() }} className={upvoted ? 'text-lg hover:text-neutral-950 text-green-900  cursor-pointer' : 'text-lg hover:text-green-700  cursor-pointer'} />
            <span className=''>{upvotes}</span>
            <BiDownvote onClick={() => { downvote() }} className={downvoted ? 'text-lg hover:text-neutral-950 text-red-900  cursor-pointer' : 'text-lg hover:text-red-700  cursor-pointer'} />
            <span>{downvotes}</span>
          </div>

          <div onClick={(id) => handleComment(id)} className=' rounded-3xl flex gap-2 items-center justify-center px-2  cursor-pointer hover:text-blue-700 bg-blue-300'>
            <GoComment className='text-lg' />
            <span>{childs.length}</span>
          </div>

          {(childs.length!=0 )&& (showChild?<span onClick={()=>setShowChild(false)} className=' flex items-center gap-1 text-2xl cursor-pointer'><IoIosArrowUp/><span className=' text-xs text-blue-800 font-medium '>Hide replies</span></span>:<span onClick={()=>setShowChild(true)} className='flex items-center gap-1 text-2xl cursor-pointer'><IoIosArrowDown/><span className=' text-xs text-blue-800 font-medium '>Show replies</span></span>)}
          <div>
          </div>
        </footer>
      </div>
      
    </div>
    {openBox && <CommentBox commentId={id} />}

    <div className='pl-5 border-l-2  border-white divide-x border-solid'>
      {showChild && <CommentBody comments={childs} getChildren={getChildren} dp={dp} getTime={getTime} postId={postId} />}

    </div>
  </>)
}


export default CommentBox
