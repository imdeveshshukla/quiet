import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import Createpost from '../components/CreatepostButton';
import Posts from '../components/Posts';
import Postskelton from '../components/Postskelton';
import { clearPostsInfo, setPost } from '../redux/Post';
import { setSkeltonLoader } from '../redux/skelton';
import { GrRefresh } from "react-icons/gr";
import SmallLoader from '../components/SmallLoader';
import baseAddress from "../utils/localhost";
import { setOnNewPost } from '../redux/onNewPost';
import Polls from '../components/Polls';
import { clearOffset, setPollOffset, setPostOffset } from '../redux/offset';
import { addRoomCreatorId, addRoomTitle, setOnNewRoomPost } from '../redux/RoomCreatePosts';
import SmoothLoader from '../assets/SmoothLoader';


const Home = () => {
  const posts = useSelector((state) => state.post.posts);
  const isLogin = useSelector((state) => state.login.value);
  const isSkelton = useSelector((state) => state.skelton.value);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const offset = useSelector(state => state.offset.value);
  const onNewPost = useSelector(state => state.onNewPost.value);
  const [reset, setReset] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to get posts and polls
  const getPost = async (reset = false) => {
    setisLoading(true);
    dispatch(setSkeltonLoader());

    try {
      const resPosts = await axios.get(`${baseAddress}posts/getPost`, {
        params: {
          offset: offset.postOffSet,
          limit: 15,
        },
      });

      const resPolls = await axios.get(`${baseAddress}poll/getallpolls`, {
        params: {
          offset: offset.pollOffSet,
          limit: 15,
        }
      });

      if (resPosts.status === 200 && resPolls.status === 200) {
        const combinedData = [...resPolls.data, ...resPosts.data.posts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 15); // Take the top 15

        dispatch(setPost(combinedData));

        const fetchedPosts = combinedData.filter(item => 'body' in item);
        const postCount = fetchedPosts.length;
        const pollCount = combinedData.length - postCount;

        dispatch(setPollOffset(pollCount));
        dispatch(setPostOffset(postCount));

        if (combinedData.length < 15) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }

    dispatch(setSkeltonLoader());
    setisLoading(false);
  };

  // Function to handle new post creation/resetting
  const handleNewPost = async () => {
    dispatch(clearPostsInfo());
    dispatch(clearOffset());
    setReset(true); // Mark reset as true
  };

  // Trigger post fetching when offsets are reset
  useEffect(() => {
    if (reset) {
      setHasMore(true)
      getPost(true);
      setReset(false); // Reset the flag after fetching data
    }
  }, [reset, offset]);

  // Trigger new post fetch when a new post is created
  useEffect(() => {
    if (onNewPost) {
      window.scrollTo(0,0)
      handleNewPost();
      dispatch(setOnNewPost(false));
    }
  }, [onNewPost]);

  // Initial fetch when the component is mounted
  useEffect(() => {
    dispatch(addRoomTitle(null));
    dispatch(addRoomCreatorId(null));
    dispatch(setOnNewRoomPost(false));
    if (posts.length === 0) {
      getPost(true);
    }
  }, []);

  // Fetch more posts when scrolling down
  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    getPost(); // Fetch next set of data
  };

  return (
    <div className='min-h-screen xs:pl-8 sm:pl-16'>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div className='py-2'><Postskelton/></div>}
        endMessage={
          <p className='text-center break-words font-semibold p-4'>
            {`${posts.length === 0 ? "It looks like there's no posts to display." : "You've reached the end of the page!"}`}
          </p>
        }
      >
        {isLogin && <Createpost />}
        <div className='flex items-center justify-end mx-4 mt-3'>
          <span onClick={() => handleNewPost()} className='bg-[#eff1d3] rounded-full p-1'>
            {isLoading ? <SmoothLoader /> : <GrRefresh className='cursor-pointer text-blue-500 text-xl font-extrabold' />}
          </span>
        </div>

        <div className="post">
          { (posts.length === 0) ? (
            <Postskelton />
          ) :(
            posts?.map((post) => (
              'body' in post ? (
                <Posts
                  key={post.id}
                  id={post.id}
                  post={post}
                  title={post.title}
                  body={post.body}
                  media={post.img}
                  countComment={post.comments?.length}
                  createdAt={post.createdAt}
                  user={post?.user}
                  upvotes={post?.upvotes}
                />
              ) : (
                <Polls key={uuidv4()} poll={post} />
              )
            ))
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
