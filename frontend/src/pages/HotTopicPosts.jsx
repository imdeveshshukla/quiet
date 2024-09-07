import React, { useState, useEffect } from 'react'
import Hottopic from '../components/Hottopic'
import baseAddress from "../utils/localhost";

import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Postskelton from '../components/Postskelton';
import { setSkeltonLoader } from '../redux/skelton';
import { clearHotPostsInfo, setHotPost } from '../redux/Hotposts';
import Posts from '../components/Posts';
import { GrRefresh } from 'react-icons/gr';
import SmallLoader from '../components/SmallLoader';






const HotTopicPosts = ({ title, topic, dp, bg }) => {


  const [isLoading, setisLoading] = useState(false)
  const isSkelton = useSelector((state) => state.skelton.value);
  const hotposts = useSelector((state) => state.hotpost.hotposts);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  const getPost = async (reset = false) => {
    dispatch(setSkeltonLoader())
    setisLoading(true)
    try {
      if (reset) {
        dispatch(clearHotPostsInfo());
        setPage(1);
        setHasMore(true);
      }
      const currentPage = reset ? 1 : page;
      const res = await axios.get(`${baseAddress}posts/q/hottopic`, {
        params: {
          page: currentPage,
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
    setisLoading(false)

  };


  useEffect(() => {

    getPost(true); // Fetch posts for the new topic
  }, [topic]);



  useEffect(() => {
    if (page > 1)
      getPost();
  }, [page]);




  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage(currentPage=> currentPage+1)
  };





  return (<>

      <Hottopic topic={title} dp={dp} bg={bg} />
    <div className=' min-h-fit xs:pl-8 sm:pl-16'>

      <InfiniteScroll
        dataLength={hotposts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div className='py-8'><Postskelton /></div>}
        endMessage={<p className='text-center break-words font-semibold p-4'>{`${hotposts.length === 0 ? "It looks like there aren't any posts yet." : "You've reached the end of the page!"}`}</p>}
      >

        <div className=' flex items-center justify-end mx-4 mt-3'>
          <span onClick={() => getPost(true)} className=' bg-[#eff1d3] rounded-full p-1'>
            {isLoading ? <SmallLoader /> : <GrRefresh className=' cursor-pointer text-blue-500 text-xl font-extrabold' />}
          </span>
        </div>

        <div className="post">
          {(isSkelton && hotposts.length == 0) ? (
            <Postskelton />
          ) : (
            hotposts.map((post) => (
              <Posts
                key={post.id}
                id={post.id}
                post={post}
                title={post.title}
                topic={topic}
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

                </>
  )
}

export default HotTopicPosts


