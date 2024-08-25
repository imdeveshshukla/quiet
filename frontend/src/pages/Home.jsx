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
import { increment, Reset } from '../redux/Page';
import baseAddress from "../utils/localhost";







const Home = () => {
  const posts = useSelector((state) => state.post.posts);
  const isLogin = useSelector((state) => state.login.value);
  const isSkelton = useSelector((state) => state.skelton.value);
  const [isLoading, setisLoading] = useState(false)

  const dispatch = useDispatch();
  const page = useSelector(state => state.page.value)

  const [hasMore, setHasMore] = useState(true);


  const getPost = async (p) => {
    setisLoading(true)
    dispatch(setSkeltonLoader())
    try {
      const res = await axios.get(`${baseAddress}posts/getPost`, {
        params: {
          page: p,
          limit: 10,
        },
      });




      if (res.status === 200) {
        const fetchedPosts = res.data.posts;

        if (fetchedPosts.length < 10) {
          setHasMore(false);
        }

        dispatch(setPost(fetchedPosts));
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
    dispatch(setSkeltonLoader())
    setisLoading(false)
  };

  const handleNewPost = () => {

    dispatch(Reset())
    dispatch(clearPostsInfo())
    getPost(1)
    setHasMore(true);
  }

  useEffect(() => {
    getPost(1);
  }, [posts.length]);

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    getPost(page + 1)
    dispatch(increment());

  };
  return (
    <div className=' min-h-screen xs:pl-8 sm:pl-16'>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Postskelton />}
        endMessage={<p className='text-center break-words font-semibold p-4'>{`${posts.length === 0 ? "It looks like there's no posts to display." : "You've reached the end of the page!"}`}</p>}
      >
        {isLogin && <Createpost onNewPost={handleNewPost} />}
        <div className=' flex items-center justify-end mx-4 mt-3'>
          <span onClick={() => handleNewPost()} className=' bg-[#eff1d3] rounded-full p-1'>
            {isLoading ? <SmallLoader /> : <GrRefresh className=' cursor-pointer text-blue-500 text-xl font-extrabold' />}
          </span>
        </div>


        <div className="post">
          {(isSkelton && posts.length === 0) ? (
            <><Postskelton /></>
          ) : (
            posts?.map((post) => (
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
            )
            )
          )}
        </div>
      </InfiniteScroll>



    </div>



  );
};

export default Home;
