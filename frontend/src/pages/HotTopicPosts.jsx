import React, { useState, useEffect } from 'react'
import Hottopic from '../components/Hottopic'

import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Postskelton from '../components/Postskelton';
import { setSkeltonLoader } from '../redux/skelton';
import { clearHotPostsInfo, setHotPost } from '../redux/Hotposts';
import Posts from '../components/Posts';






const HotTopicPosts = ({title,topic,dp,bg}) => {

    
    
    const isSkelton = useSelector((state) => state.skelton.value);
    const hotposts = useSelector((state) => state.hotpost.hotposts);
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    const getPost = async () => {
        dispatch(setSkeltonLoader())
        console.log(`Fetching posts for page: ${page}`);
        if(page==1){
          dispatch(clearHotPostsInfo())
        }
        try {
          const res = await axios.get('http://localhost:3000/posts/q/hottopic', {
            params: {
              page,
              limit: 10,
              topic
            },
          });
    
          if (res.status === 200) {
            const fetchedPosts = res.data.posts;
    
            if (fetchedPosts.length < 10) {
              setHasMore(false);
            }
    
            dispatch(setHotPost(fetchedPosts));
          }
        } catch (error) {
          console.log(error);
          setHasMore(false); // Stop fetching if there's an error
        }
        dispatch(setSkeltonLoader())
      };

      useEffect(() => {
        console.log("underUse effect getting post for page", page);
        setPage(1); // Reset page when topic changes
        setHasMore(true); // Reset hasMore when topic changes
        getPost(); // Fetch posts for the new topic
        dispatch(clearHotPostsInfo())
      }, [topic]);

      

      useEffect(() => {
        console.log("underUse effect getting post for page",page);
        getPost();
      }, [page]);




      const fetchMoreData = () => {
        console.log(`Loading more data, current page: ${page}`);
        setPage((prevPage) => prevPage + 1);
      };





    return (

        <div className=' min-h-screen border-x-2 border-black pl-16'>
    <InfiniteScroll  
        dataLength={hotposts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Postskelton />}
        endMessage={hotposts.length>0?<p className=' text-center font-semibold p-4'>You've reached the end of the page!</p>:<p className=' text-center font-semibold p-4'>No posts available to display!</p>}   
      >
      <Hottopic topic={title} dp={dp} bg={bg} />


      
        <div className="post">
          { (!hotposts)||(page==1 && isSkelton) ? (
            <Postskelton />
          ) : (
            hotposts.map((post) => (
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
        
    )
}

export default HotTopicPosts


