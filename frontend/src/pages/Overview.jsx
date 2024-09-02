import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CommentSkelton } from '../components/Postskelton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSkeltonLoader } from '../redux/skelton';
import baseAddress from "../utils/localhost";
import Posts from '../components/Posts';
import { UserComment } from './ProfileComments';
import { v4 as uuidv4 } from 'uuid';

const Overview = () => {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useOutletContext();
  
  const { username } = useParams();
  const dispatch = useDispatch();
  const isSkelton = useSelector(state => state.skelton.value);
  const [postOffset, setPostOffset] = useState(0);
  const [commentOffset, setCommentOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getUserOverview = async (reset = false) => {
    if (!user.userID) return;

    dispatch(setSkeltonLoader());
    setIsLoading(true);

    try {
      if (reset) {
        setUserData([]);
        setHasMore(true);
        setPage(1); // Reset page to 1
        setPostOffset(0); // Reset offsets
        setCommentOffset(0);
      }

      const currentPage = reset ? 1 : page;

      const res1 = await axios.get(`${baseAddress}search/getusercomments`, {
        params: {
          userID: user.userID,
          username,
          page: currentPage,
          limit: 10,
          offset: commentOffset, 
        },
        withCredentials: true,
      });

      const res2 = await axios.get(`${baseAddress}search/getuserposts`, {
        params: {
          userID: user.userID,
          username,
          page: currentPage,
          limit: 10,
          offset: postOffset,
        },
        withCredentials: true,
      });

      if (res1.status === 200 && res2.status === 200) {
        let res = [...res1.data, ...res2.data.posts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        setUserData(prevUserData => [...prevUserData, ...res]);

        let temp = res.filter(e => 'postId' in e);
        let co = temp.length;
        let po = res.length - co;
        setPostOffset(prevOffset => prevOffset + po);
        setCommentOffset(prevOffset => prevOffset + co);

        if (res.length < 10) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(setSkeltonLoader());
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserOverview(true);  // Ensure initial fetch always resets data

  }, [user.userID]);


  useEffect(() => {
    if (page > 1) {
      getUserOverview();  // Fetch data for subsequent pages without resetting
    }
  }, [page]);

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={userData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div className='py-8'><CommentSkelton /></div>}
        endMessage={<p className='text-center break-words font-semibold p-4'>{`${userData.length === 0 ? "It looks like the user hasn't made any posts or comments yet." : "You've reached the end of the page!"}`}</p>}
      >
        <div className='py-8'>
          {isSkelton && userData.length === 0 ? null :
            (
              userData.map((e) => (
                'postId' in e
                  ? <UserComment key={`comment-${e.postId}-${uuidv4()}`} comment={e} />
                  : <Posts
                      key={`post-${e.id}-${uuidv4()}`}
                      inRoom={e.subCommunity}
                      room={e.room}
                      joined={true}
                      topic={e.topic}
                      id={e.id}
                      title={e.title}
                      body={e.body}
                      media={e.img}
                      countComment={e.comments?.length}
                      createdAt={e.createdAt}
                      user={e.user}
                      upvotes={e.upvotes}
                    />
              ))
            )
          }
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Overview;
