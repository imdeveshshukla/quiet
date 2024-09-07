import React, { useState, useEffect } from 'react';
import Hottopic from '../components/Hottopic';
import baseAddress from "../utils/localhost";
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Postskelton, { PollSkelton } from '../components/Postskelton';
import { clearHotPostsInfo, setHotPost } from '../redux/Hotposts';
import Posts from '../components/Posts';
import { GrRefresh } from 'react-icons/gr';
import SmallLoader from '../components/SmallLoader';
import { clearPollInfo, setPoll } from '../redux/userpolls';
import Polls from '../components/Polls';


export const HotTopicPostsorPolls = ({ title, topic, dp, bg }) =>{
  const [disVal, setdisVal] = useState("post")
    useEffect(()=>{
      setdisVal("post")
    },[topic])
    return(
        <>
        <Hottopic topic={title} dp={dp} bg={bg} />
        <div>
            <div className='flex gap-2 justify-end mx-4 xxs:mx-8 mt-6'>
                
    <div className={`flex items-center gap-1 ${disVal === 'post' ? 'bg-[#65692375] ' : 'bg-gray-200'}  rounded-md`}>
        <input 
            className='size-4 hidden' 
            onChange={() => setdisVal("post")} 
            checked={disVal === "post"} 
            type="radio" 
            value="post" 
            name="post_poll" 
            id="post" 
        />
        <label 
            className={`font-semibold px-3 py-1 font-roboto cursor-pointer ${disVal === 'post' ? 'text-white' : 'text-gray-700'}`} 
            htmlFor="post">
            Post
        </label>
    </div>
    <div className={`flex items-center ${disVal === 'poll' ? 'bg-[#65692375]' : 'bg-gray-200'}  rounded-md`}>
        <input 
            className=' hidden' 
            onChange={() => setdisVal("poll")} 
            checked={disVal === "poll"} 
            type="radio" 
            value="poll" 
            name="post_poll" 
            id="poll" 
        />
        <label 
            className={`font-semibold px-3 py-1 font-roboto cursor-pointer ${disVal === 'poll' ? 'text-white' : 'text-gray-700'}`} 
            htmlFor="poll">
            Poll
        </label>
    </div>
</div>


            {disVal==="post" && <HotTopicPosts title={title} topic={topic} dp={dp} bg={bg}/>}
            {disVal==="poll" && <HotTopicPolls title={title} topic={topic}/>}


        </div>
        </>
    )
}

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

export const HotTopicPolls = ({ title, topic })=>{
  const hotposts = useSelector(state => state.userpoll.polls);
  const [page,setPage] = useState(0);
  const [isLoading,setisLoading] = useState(false)
  const [hasMore,setHasMore] = useState(true);
  const dispatch = useDispatch();

  async function getPolls(customPage){
      if (customPage == 1) {
        dispatch(clearPollInfo())
        setHasMore(true);
        setPage(1);
      }
      try {
        
        // console.log("InsidegetPolls ",isLoading)
        const res = await axios.get(`${baseAddress}poll/q/hottopicspoll`, {
          params: {
            offset: customPage,
            limit: 10,
            topic:topic
          }
        });
        
        if (res.status === 200) {
          const fetchedPolls = res.data;
          dispatch(setPoll(fetchedPolls));
          if (fetchedPolls?.length < 10) {
            setHasMore(false);
          }

          setisLoading(false);
          console.log("InsidegetPolls ",isLoading)
        }
      } catch (error) {
        console.log(error);
        setHasMore(false); // Stop fetching if there's an error
        setisLoading(false);
      }
  }

  useEffect(() => {
    setisLoading(true)  // Set loading to true during transition
    setPage(1);  
    dispatch(clearPollInfo());  
    getPolls(1);
  }, [topic, title]);

  useEffect(() => {
    if (page > 1) {
      getPolls(page);  
    }
  }, [page]);

  const fetchMoreData = () => {
    if (!hasMore) return;
    setPage((prevPage) => prevPage + 1); 
  };

  return(
    <div className="min-h-fit xs:pl-8 sm:pl-16">
        <InfiniteScroll
          dataLength={hotposts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="py-8">
              <PollSkelton />
            </div>
          }
          endMessage={
            <p className="text-center break-words font-semibold p-4">
              {`${hotposts.length === 0
                ? "It looks like there aren't any Polls yet."
                : "You've reached the end of the page!"}`}
            </p>
          }
        >
          <div className="polls">
            { hotposts.map((post) => (
              <Polls key={post?.id}poll={post} topic={topic}/>
            ))}
          </div>
        </InfiniteScroll>
      </div>
  )

}

export default HotTopicPosts;
