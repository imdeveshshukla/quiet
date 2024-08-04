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






const Home = () => {
  const posts = useSelector((state) => state.post.posts);
  const isLogin = useSelector((state) => state.login.value);
  const isSkelton = useSelector((state) => state.skelton.value);
  const [isLoading, setisLoading] = useState(false)
  
  const dispatch = useDispatch();
  // const page = useSelector(state => state.page.value)
  

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  const getPost = async () => {
    dispatch(setSkeltonLoader())
    setisLoading(true)
    if (page == 1) {
      window.scrollTo(0, 0);
      dispatch(clearPostsInfo())
    }
    try {
      const res = await axios.get('http://localhost:3000/posts/getPost', {
        params: {
          page,
          limit: 10,
        },
      });
      console.log(res.data);


      if (res.status === 200) {
        const fetchedPosts = res.data.posts;

        if (fetchedPosts.length < 10) {
          setHasMore(false);
        }

        dispatch(setPost(fetchedPosts));
      }
    } catch (error) {
      console.error(error);
      setHasMore(false); // Stop fetching if there's an error
    }

    dispatch(setSkeltonLoader())
    setisLoading(false)
  };

  const handleNewPost = () => {
    console.log("hello");
    if(page==1){
      getPost()
      setHasMore(true);
      return;
    }
    setPage(1);
    setHasMore(true);
  }

  useEffect(() => {
    if(posts.length > 0)return;
    getPost();
  }, []);
  
  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    console.clear();
    setPage((prevPages)=>prevPages+1);
    getPost();
  };


  return (
    <div className=' min-h-screen xxs:pl-0 xs:pl-8 sm:pl-16'>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Postskelton />}
        endMessage={<p className=' text-center font-semibold p-4'>You've reached the end of the page!</p>}
      >
        {isLogin && <Createpost onNewPost={handleNewPost} />}
        <div className='bg-gray-700 h-[1px]'></div>
        <div className=' flex items-center justify-end mx-4 mt-3'>
          <span onClick={()=>handleNewPost()} className=' bg-[#eff1d3] rounded-full p-1'>
          {isLoading?<SmallLoader/>:<GrRefresh  className=' cursor-pointer text-blue-500 text-xl font-extrabold'/>}
          </span>
        </div>


        <div className="post">
          {(isSkelton && posts.length === 0) ? (
            <Postskelton />
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
