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



const Home = () => {
  const posts = useSelector((state) => state.post.posts);
  const isLogin = useSelector((state) => state.login.value);
  const isSkelton = useSelector((state) => state.skelton.value);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getPost = async () => {
    dispatch(setSkeltonLoader())
    console.log(`Fetching posts for page: ${page}`);
    if(page==1){
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
  };

  const handleNewPost=()=>{
    // dispatch(clearPostsInfo())
    setPage(1);
    setHasMore(true);
    getPost()
  }

  useEffect(() => {
    console.log("underUse effect getting post for page",page);
    getPost();
  }, [page]);

  const fetchMoreData = () => {
    console.log(`Loading more data, current page: ${page}`);
    setPage((prevPage) => prevPage + 1);
    
  };

  return (
    <div className=' min-h-screen  border-x-2 border-black pl-16'>
    <InfiniteScroll  
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Postskelton />}
        endMessage={<p className=' text-center font-semibold p-4'>You've reached the end of the page!</p>}   
      >
      {isLogin && <Createpost onNewPost={handleNewPost}/>}
      <div className='bg-gray-700 h-[1px]'></div>

      
        <div className="post">
          { (!posts)||(page==1 && isSkelton) ? (
            <Postskelton />
          ) : (
            posts.map((post) => (
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
