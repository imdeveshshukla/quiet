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
import { RiReplyLine } from "react-icons/ri";

import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { sendNotification } from './Posts';
import { getTime } from './Posts';
import ReadMore from './ReadMore';
import baseAddress from '../utils/localhost';
import { useNavigate } from 'react-router-dom';





export const CommentBox = ({ commentId = null, setOpenBox, setShowChild, openBox }) => {
  const [isComment, setIsComment] = useState(false)
  const [comment, setcomment] = useState("")
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const post = useSelector(state => state.postDetail.post);



  useEffect(() => {
    if (openBox) {
      setIsComment(true)
    }
  }, [])


  const addComment = async () => {
    toast.loading("Adding your comment...");
    setLoading(true);

    try {
      const res = await axios.post(`${baseAddress}posts/createcomment`, {
        withCredentials: true, postId: post?.id,
        commentId, content: comment
      });

      if (res.status == 201) {
        setIsComment(false)
        dispatch(setComment(res.data.newComment))
        dispatch(setUserPostComment(res.data.newComment))
        dispatch(setPostComment(res.data.newComment))
        const data = res.data.newComment;
        if (data.parentId) {
          if (data.userId != data.post.userId) {
            sendNotification({ postId: data.postId, toUser: data.post.userId, fromUser: data.userId, title: "replied to a comment on your post!", body: data.body });
          }
          if (data.userId != data.parent.userId) {
            sendNotification({ postId: data.postId, toUser: data.parent.userId, fromUser: data.userId, title: "replied to your comment on a post!", body: data.body })
          }
        } else {
          if (data.userId != data.post.userId) {
            sendNotification({ postId: data.postId, toUser: data.post.userId, fromUser: data.userId, title: "commented on your post!", body: res.data.newComment.body });
          }
        }
        toast.dismiss();
        toast.success("Comment Added.");
        setcomment("");
        if (openBox) {
          setOpenBox(false)
          setShowChild(true)
        }
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
          setOpenBox(false)

        }} className='px-4 py-2 rounded-3xl bg-gray-500 ' type="button">Cancel</button>
        <button onClick={() => addComment()} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{!loading ? (openBox ? "Reply" : "Comment") : <SmallLoader />}</button>
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
  const userInfo = useSelector(state => state.user.userInfo);
  const Navigate= useNavigate();


  function handleComment(id) {
    setOpenBox((openBox) => !openBox);

  }
  async function getUpvote() {
    const res = await axios.post(baseAddress+"posts/upvoteNum", { postId: postId, commentId: id });

    setUpvotes(res.data.numbers);
    res.data.upvote.forEach((item) => {
      if (item.userId == userInfo?.userID) setUpvoted(true);
    })

    setDownvote(res.data.downVoteNum);
    res.data.downvote.forEach((item) => {
      if (item.userId == userInfo?.userID) setDownVoted(true);
    })
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
      setUpvotes((upvoteNumber) => upvoteNumber - 1);
    }

    try {
      const res = await axios.post(baseAddress+"posts/vote", { commentId: id, val, postId: postId });

      if (res.status == 201) {
        const data = res.data.newUpvote;

        if (val == 1) {
          if (data.comment.parentId) {
            if (data.userId != data.comment.userId) {
              sendNotification({ postId: data.postId, fromUser: data.userId, toUser: data.comment.userId, title: "liked your reply on a comment!", body: data.comment.body });
            }
          }
          else {
            if (data.userId != data.comment.userId) {
              sendNotification({ postId: data.postId, fromUser: data.userId, toUser: data.comment.userId, title: "liked your comment on a post!", body: data.comment.body });
            }
          }
          if (data.userId != data.post.userId) {
            sendNotification({ postId: data.postId, fromUser: data.userId, toUser: data.post.userId, title: "liked a comment on your post!", body: data.comment.body });
          }
        }


      }
    } catch (error) {

    }
  }


  async function downvote() {
    let val = -1;
    if (!downvoted) {
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
    const res = await axios.post(baseAddress+"posts/vote", { commentId: id, val, postId: postId });
    const data = res.data.newUpvote

    if (val == -1) {
      if (res.status == 201) {
        if (data.comment.parentId) {
          if (data.userId != data.comment.userId)
            sendNotification({ postId: data.postId, fromUser: data.userId, toUser: data.comment.userId, title: "disliked your reply on a comment!", body: data.comment.body });
        }
        else {
          if (data.userId != data.comment.userId)
            sendNotification({ postId: data.postId, fromUser: data.userId, toUser: data.comment.userId, title: "disliked your comment on a post!", body: data.comment.body });
        }
        if (data.userId != data.post.userId)
          sendNotification({ postId: data.postId, fromUser: data.userId, toUser: data.post.userId, title: "disliked a comment on your post!", body: data.comment.body });
      }
    }
  }



  return (<>

    <div className="relative flex flex-col gap-2 py-2  px-4 xxs:px-7  xs:px-14  border rounded-2xl bg-[#e2e4c6] shadow-md shadow-current justify-center">
      <div className="relative flex gap-2 items-center">

        <img src={user.dp ? user.dp : dp} className="relative rounded-full -top-1 -mb-4  border h-8 w-8 object-contain bg-white" alt="" loading="lazy" />

        <div className="flex items-center w-full gap-2">
          <div className="flex flex-row justify-between">
            <p onClick={()=> Navigate(`/u/${user.username}`)} className="relative cursor-pointer  whitespace-nowrap hover:text-green-900 truncate text-sm xxs:text-base  font-medium overflow-clip">u/{user.username}</p>
            {/* <a className="text-gray-500 text-xl" href="#"><i className="fa-solid fa-trash"></i></a> */}
          </div><span>•</span>
          <p className="text-gray-500 text-[9px] xxs:text-xs  line-clamp-1 overflow-clip">{getTime(createdAt)} ago</p>
        </div>
      </div>
      <div className=' mx-10 text-sm xs:text-base whitespace-pre-wrap break-words'><ReadMore maxLines={3} children={body} /></div>
      <div className="btns">
        <footer className='flex gap-4 items-center'>
          <div className={'  flex gap-2 items-center justify-center  '}>

            <span className='flex items-center'>
              <span onClick={() => upvote()} className=' text-xl cursor-pointer hover:text-blue-800'>{upvoted ? <BiSolidLike className='text-blue-600' /> : <BiLike className='' />}</span>
              <span>{upvotes}</span>
            </span>
            <span className='flex items-center'>
              <span onClick={() => downvote()} className=' text-xl cursor-pointer hover:text-red-800'>{downvoted ? <BiSolidDislike className=' text-red-600' /> : <BiDislike />}</span>
              <span>{downvotes}</span>
            </span>


          </div>

          <div onClick={(id) => handleComment(id)} className=' rounded-3xl flex gap-2 items-center justify-center px-2  cursor-pointer hover:text-blue-700 bg-blue-300'>
            <RiReplyLine className='text-lg' />
            <span>{childs.length}</span>
          </div>

          {(childs.length != 0) && (showChild ? <span onClick={() => setShowChild(false)} className=' flex items-center gap-1 text-2xl cursor-pointer'><IoIosArrowUp /><span className=' text-xs text-blue-800 font-medium '>Hide replies</span></span> : <span onClick={() => setShowChild(true)} className='flex items-center gap-1 text-2xl cursor-pointer'><IoIosArrowDown /><span className=' text-xs text-blue-800 font-medium '>Show replies</span></span>)}
          <div>
          </div>
        </footer>
      </div>

    </div>
    {openBox && <CommentBox commentId={id} setOpenBox={setOpenBox} setShowChild={setShowChild} openBox={openBox} />}

    <div className=' pl-2 xs:pl-3 sm:pl-5 border-l-2  border-white divide-x border-solid'>
      {showChild && <CommentBody comments={childs} getChildren={getChildren} dp={dp} getTime={getTime} postId={postId} />}

    </div>
  </>)
}


export default CommentBox



export const OuterLayer = () => {

  return (<>

  </>)
}