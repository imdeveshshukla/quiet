import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Postskelton from '../components/Postskelton';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSkeltonLoader } from '../redux/skelton';
import axios from 'axios';
import baseAddress from "../utils/localhost";
import { clearUserPostsInfo, setPost } from '../redux/userposts';
import { useOutletContext } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';



const Profileupvoted = () => {

  const userPost = useSelector(state => state.userpost.posts);
  const isSkelton = useSelector(state => state.skelton.value);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useOutletContext();
  const [isLoading, setisLoading] = useState(false)

  

  const getUserUpvotes = async (reset = false) => {
    dispatch(setSkeltonLoader());
    setisLoading(true)
    try {
        if (reset) {
            dispatch(clearUserPostsInfo());
            setPage(1);
            setHasMore(true);
        }

        const currentPage = reset ? 1 : page;

        const res = await axios.get(`${baseAddress}search/getuserupvotes`, {
            params: {
                userId: user.userID,
                page: currentPage,
                limit: 10,
            },
            withCredentials: true,
        });

        

        if (res.status === 200) {
            if (res.data.length < 10) {
                setHasMore(false);
            }
            let posts= []
            Array.from(res.data).forEach(e=>posts.push(e.post));
            // let posts = res.data.map(e => e.post);
            
            dispatch(setPost(posts));

        }
    } catch (error) {
        console.log(error);
    }
    dispatch(setSkeltonLoader());
    setisLoading(false)
};
 




useEffect(() => {
    if(page==1){
        getUserUpvotes(true)
    }else{
        getUserUpvotes()
    }
}, [page]);

const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
  setPage(prevPage => prevPage + 1);
};


  return (
    <InfiniteScroll
            dataLength={userPost.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className='py-8'><Postskelton /></div>}
            endMessage={<p className='text-center break-words font-semibold p-4'>{`${userPost.length === 0 ? "It looks like the user hasn't made any upvotes yet." : "You've reached the end of the page!"}`}</p>}
        >
            <div className='py-8'>
                {
                    userPost.map(post => (
                        <Posts key={uuidv4()} post={post} joined={true} inRoom={post.subCommunity} room={post.room} id={post.id} title={post.title} body={post.body} media={post.img} countComment={post.comments?.length} createdAt={post.createdAt} user={post.user} upvotes={post.upvotes} />
                    ))
                }
            </div>
        </InfiniteScroll>
  )
}

export default Profileupvoted
