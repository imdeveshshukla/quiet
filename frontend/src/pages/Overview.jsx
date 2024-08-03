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
import Posts, { sendNotification } from '../components/Posts';
import { getTime } from '../components/Posts';
import { v4 as uuidv4 } from 'uuid';
import ReadMore from '../components/ReadMore';
import { UserComment } from './ProfileComments';

const Overview = () => {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useOutletContext();
  const { username } = useParams();
  const dispatch = useDispatch()
  const isSkelton = useSelector(state => state.skelton.value);
  const [postOffset, setPostOffset] = useState(0);
  const [commentOffset, setCommentOffset] = useState(0);
  const [isLoading, setisLoading] = useState(false)

  const getUserOverview = async (reset = false) => {
    console.log("fetching");
    dispatch(setSkeltonLoader());
    setisLoading(true)

    try {
      if (reset) {
        setUserData([]);
        setPage(1);
        setHasMore(true);
      }

      const currentPage = reset ? 1 : page;



      const res1 = await axios.get(`http://localhost:3000/search/getusercomments`, {
        params: {
          userID: user.userID,
          username,
          page: currentPage,
          limit: 10,
          offset: commentOffset,
        },
        withCredentials: true,
      });

      console.log("res1", res1);



      const res2 = await axios.get(`http://localhost:3000/search/getuserposts`, {
        params: {
          userID: user.userID,
          username,
          page: currentPage,
          limit: 10,
          offset: postOffset,
        },
        withCredentials: true,
      });

      console.log("res2", res2);

      if (res1.status === 200 && res2.status == 200) {

        let res = [...res1.data, ...res2.data.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,10);
        
        console.log("res", res);

        setUserData([...userData, ...res]);
        let temp = res.filter(e => 'postId' in e);
        let co = temp.length;
        let po = res.length - co;
        setPostOffset(postOffset + po);
        setCommentOffset(commentOffset + co);


        if (res.length < 10) {
          setHasMore(false);
        }

      }
    } catch (error) {
      console.log(error);
    }
    dispatch(setSkeltonLoader());
    setisLoading(false)

  };

  useEffect(() => {
    if(page==1){
      window.scroll(0,0)
      getUserOverview(true);
    }else{
      getUserOverview();
    }
  }, [page]);



  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  };

  return (<>
    <InfiniteScroll
      dataLength={userData.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<div className='py-8'><CommentSkelton /></div>}
      endMessage={<p className='text-center break-words font-semibold p-4'>{`${userData.length == 0 ? "It looks like the user hasn't made any posts or comments yet." : "You've reached the end of the page!"}`}</p>}
    >
      <div className='py-8'>
        {(isSkelton && userData.length === 0) ? <></> :
          (
            userData.map(e=><>
              {'postId' in e? <UserComment key={e.id} comment={e}/>
              
                 :

              <Posts key={e.id}  id={e.id} title={e.title} body={e.body} media={e.img} countComment={e.comments?.length} createdAt={e.createdAt} user={e.user} upvotes={e.upvotes}/>}
            </>)
          )
        }
      </div>
    </InfiniteScroll>
    </>
  )
}

export default Overview
