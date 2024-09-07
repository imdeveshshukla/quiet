import React, { useState, useEffect } from 'react';
import Hottopic from '../components/Hottopic';
import baseAddress from "../utils/localhost";
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Postskelton from '../components/Postskelton';
import { clearHotPostsInfo, setHotPost } from '../redux/Hotposts';
import Posts from '../components/Posts';
import { GrRefresh } from 'react-icons/gr';
import SmallLoader from '../components/SmallLoader';

const HotTopicPosts = ({ title, topic, dp, bg }) => {
  const [isLoading, setisLoading] = useState(false);
  const [intLoading, setintLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);  // For pagination control
  const dispatch = useDispatch();

  const hotposts = useSelector((state) => state.hotpost.hotposts);
  
  // Cancel token for API requests
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const getPost = async (reset = false, customPage = 1) => {
    // Cancel previous request if it exists
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Previous request canceled due to new topic.');
    }

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);
    setisLoading(true);

    try {
      if (reset) {
        dispatch(clearHotPostsInfo());  // Clear posts immediately
        setPage(1);  // Set page to 1 after clearing posts
        setHasMore(true);  // Allow fetching more posts
      }

      const currentPage = reset ? 1 : customPage;
      const res = await axios.get(`${baseAddress}posts/q/hottopic`, {
        cancelToken: source.token,  // Pass the cancel token to Axios
        params: {
          page: currentPage,
          limit: 10,
          topic,
        },
      });

      if (res.status === 200) {
        const fetchedPosts = res.data.posts;
        if (fetchedPosts.length < 10) {
          setHasMore(false);  // No more data to fetch
        }
        dispatch(setHotPost(fetchedPosts));  // Append new posts
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error(error);
        setHasMore(false);  // Disable further fetching in case of error
      }
    }
    setisLoading(false);
  };

  // Handle topic or title change with setTimeout for synchronization
  useEffect(() => {
    setintLoading(true)
    setisLoading(true);  // Set loading to true during transition
    setPage(1);  // Set page to 1 immediately
    dispatch(clearHotPostsInfo());  // Clear posts immediately

    // Use setTimeout to delay the API call after clearing posts and setting page
    const timeoutId = setTimeout(() => {
      getPost(true, 1);
      setintLoading(false)  // Fetch new posts for the new topic from page 1
    }, 500);  // Delay by 300ms to allow for state updates

    return () => clearTimeout(timeoutId);  // Cleanup the timeout
  }, [topic, title]);


  useEffect(() => {
    if (page > 1) {
      getPost(false, page);  // Fetch posts for the current page
    }
  }, [page]);

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage((prevPage) => prevPage + 1);  // Increment page number for infinite scroll
  };

  return (
    <>
      <Hottopic topic={title} dp={dp} bg={bg} />
      <div className="min-h-fit xs:pl-8 sm:pl-16">
        <InfiniteScroll
          dataLength={hotposts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="py-8">
              <Postskelton />
            </div>
          }
          endMessage={
            <p className="text-center break-words font-semibold p-4">
              {`${hotposts.length === 0
                ? "It looks like there aren't any posts yet."
                : "You've reached the end of the page!"}`}
            </p>
          }
        >
          <div className="flex items-center justify-end mx-4 mt-3">
            <span
              onClick={() => getPost(true, 1)}  // Reset to fetch from page 1
              className="bg-[#eff1d3] rounded-full p-1"
            >
              {isLoading ? <SmallLoader /> : (
                <GrRefresh className="cursor-pointer text-blue-500 text-xl font-extrabold" />
              )}
            </span>
          </div>

          <div className="post">
            { intLoading ? <Postskelton/>: hotposts.map((post) => (
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
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default HotTopicPosts;
