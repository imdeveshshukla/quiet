import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Postskelton, { CommentSkelton } from '../components/Postskelton';
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSkeltonLoader } from '../redux/skelton';
import dp from '../assets/dummydp.png'
import { RiReplyLine } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { sendNotification } from '../components/Posts';
import { getTime } from '../components/Posts';
import { v4 as uuidv4 } from 'uuid';
import ReadMore from '../components/ReadMore';





const ProfileComments = () => {
  const [userComment, setUserComment] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useOutletContext();
  const { username } = useParams();
  const dispatch = useDispatch()
  const isSkelton = useSelector(state => state.skelton.value);




  const getUserComment = async (reset = false) => {
    console.log("fetching");
    dispatch(setSkeltonLoader());

    try {
      if (reset) {
        setUserComment([]);
        setPage(1);
        setHasMore(true);
      }

      const currentPage = reset ? 1 : page;

      const res = await axios.get(`http://localhost:3000/search/getusercomments`, {
        params: {
          userID: user.userID,
          username,
          page: currentPage,
          limit: 10,
        },
        withCredentials: true,
      });

      console.log("userComments", res);

      if (res.status === 200) {
        if (res.data.length < 10) {
          setHasMore(false);
        }
        setUserComment([...userComment, ...res.data])
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(setSkeltonLoader());

  };

  useEffect(() => {
    console.log("usrname eff", user, username);


    getUserComment(true);
  }, [username]);

  useEffect(() => {
    console.log("page eff", user, username);

    if (page > 1) {
      getUserComment();
    }
  }, [page]);


  const fetchMoreData = () => {
    setPage(prevPage => prevPage + 1);
  };
  return (
    <InfiniteScroll
      dataLength={userComment.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<div className='py-8'><CommentSkelton /></div>}
      endMessage={<p className='text-center font-semibold p-4'>{`${userComment.length == 0 ? "It looks like the user hasn't made any comments." : "You've reached the end of the page!"}`}</p>}
    >
      <div className='py-8'>
        {(isSkelton && userComment.length === 0) ? <CommentSkelton /> :
          userComment.map(comment => (<>
            <UserComment key={comment.id} comment={comment} />
          </>
          ))
        }
      </div>
    </InfiniteScroll>
  )
}

export default ProfileComments


export const UserComment = ({ comment }) => {

  const Navigate= useNavigate();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownVoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvote] = useState(0);
  const userInfo = useSelector(state => state.user.userInfo);
  const [data, setData] = useState({});



  async function getUpvote() {
    const res = Array.from(comment.upvotes).filter(e => e.upvotes == 1);



    setUpvotes(res.length);
    res.forEach((item) => {
      if (item.userId == userInfo?.userID) setUpvoted(true);
    })

    const response = Array.from(comment.upvotes).filter(e => e.upvotes == -1);


    setDownvote(response.length);
    response.forEach((item) => {
      if (item.userId == userInfo?.userID) setDownVoted(true);
    })
  }

  useEffect(() => {
    if (comment.post.subCommunity) {
      setData(comment.post.room)
    } else {
      setData(comment.post.user);
    }
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
      const res = await axios.post("http://localhost:3000/posts/vote", { commentId: comment.id, val, postId: comment.postId });
      console.log("commentpelike", res);

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
    const res = await axios.post("http://localhost:3000/posts/vote", { commentId: comment.id, val, postId: comment.postId });
    console.log("commentpedislike", res);
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

  const handleClick = (event) => {
    
    if (event.target.closest('.exclude-click')) {
      return;
    }
    Navigate(`/post/${comment.postId}`)
 
  };



  return (<div className=' cursor-pointer' onClick={(e)=>handleClick(e)} key={comment.id}>
    <div className=" flex flex-col mx-2 my-6 sm:m-8   gap-2 py-4 pl-4  pr-2 xxs:pl-8 xxs:pr-4 xs:pl-12 xs:pr-8  sm:px-14  border rounded-2xl bg-[#e2e4c6] shadow-md shadow-current justify-center">
      <div className=" flex gap-2 items-center">

        <img src={data.dp ? data.dp : data.img ? data.img : dp} className="exclude-click  rounded-full   border h-8 w-8 object-contain bg-white" alt="" loading="lazy" />

        <div className="flex  items-center w-full gap-2">
          <div className="flex flex-wrap items-center">
            <p className=" exclude-click   text-sm  font-medium overflow-clip">{data.dp ? 'u' : 'q'}/{data.username ? data.username : data?.title}<span>&nbsp;•&nbsp;</span> </p>

            <span style={{ wordBreak: 'break-word' }} className=' hover:underline hover:text-blue-950 whitespace-pre-wrap  text-xs overflow-clip'>{comment.post.title}</span>

          </div>

        </div>
      </div>

      <div className=' xxs:ml-8 pl-4 py-2 my-2 border rounded-lg bg-[#cdcfa5]'>
        <header className=' flex items-center justify-stretch flex-wrap whitespace-pre-wrap leading-3'>
          <span className='exclude-click text-sm font-mono font-semibold'>{comment?.user.username}</span>
          <span className=' text-xs'>{comment.parentId ? `  replied to  ` : '  commented  '}</span>
          <span  className='exclude-click text-sm font-mono font-semibold'>{comment.parent?.user.username}</span>
          <span>• </span>
          <span className="text-gray-500 text-[9px] xxs:text-xs  line-clamp-1 overflow-clip">{getTime(comment.createdAt)} ago</span>
        </header>

        <section className=' font-serif px-2 py-1'><ReadMore maxLines={3} children={comment.body}/></section>

        <footer>
          <div className="btns">
            <footer className='flex gap-4 items-center'>
              <div className={'  flex gap-2 items-center justify-center  '}>

                <span className='flex items-center'>
                  <span onClick={() => upvote()} className='exclude-click text-xl cursor-pointer hover:text-blue-800'>{upvoted ? <BiSolidLike className='text-blue-600' /> : <BiLike className='exclude-click' />}</span>
                  <span>{upvotes}</span>
                </span>
                <span className='flex items-center'>
                  <span onClick={() => downvote()} className='exclude-click text-xl cursor-pointer hover:text-red-800'>{downvoted ? <BiSolidDislike className=' text-red-600 exclude-click' /> : <BiDislike />}</span>
                  <span>{downvotes}</span>
                </span>


              </div>

              <div className=' rounded-3xl flex gap-2 items-center justify-center px-2  cursor-pointer hover:text-blue-700 bg-blue-300'>
                <RiReplyLine className='text-lg' />
              </div>
            </footer>
          </div>
        </footer>
      </div>


    </div>
    <div className=' bg-gray-700 h-[1px]'></div>

  </div>)
}
