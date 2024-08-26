import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Postskelton from '../components/Postskelton';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSkeltonLoader } from '../redux/skelton';
import { clearPostsInfo, setPost } from '../redux/userposts';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useOutletContext, useParams } from 'react-router-dom';
import baseAddress from "../utils/localhost";





axios.defaults.withCredentials = true;

const ProfilePosts = () => {
    const userPost = useSelector(state => state.userpost.posts);
    const isSkelton = useSelector(state => state.skelton.value);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useOutletContext();
    const { username } = useParams();
    const [isLoading, setisLoading] = useState(false)


    const getUserPost = async (reset = false) => {
        dispatch(setSkeltonLoader());
        setisLoading(true)
        try {
            if (reset) {
                dispatch(clearPostsInfo());
                setPage(1);
                setHasMore(true);
            }

            const currentPage = reset ? 1 : page;

            const res = await axios.get(`${baseAddress}search/getuserposts`, {
                params: {
                    userID: user.userID,
                    username,
                    page: currentPage,
                    limit: 10,
                },
                withCredentials: true,
            });
           
            

            if (res.status === 200) {
                if (res.data.posts.length < 10) {
                    setHasMore(false);
                }
                dispatch(setPost(res.data.posts));

            }
        } catch (error) {
            console.log(error);
        }
        dispatch(setSkeltonLoader());
        setisLoading(false)
    };
    

    useEffect(() => {
        getUserPost(true);
    }, [username]);


    useEffect(() => {
        if (page > 1) {
            getUserPost();
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
            endMessage={<p className='text-center break-words font-semibold p-4'>{`${userPost.length === 0 ? "It looks like the user hasn't made any posts yet." : "You've reached the end of the page!"}`}</p>}
        >
            <div className='py-8'>
                {(isSkelton && userPost.length === 0) ? <Postskelton /> :
                    userPost.map(post => (
                        <Posts key={uuidv4()} joined={true} post={post} topic={post.topic} inRoom={post.subCommunity} room={post.room} id={post.id} title={post.title} body={post.body} media={post.img} countComment={post.comments?.length} createdAt={post.createdAt} user={post.user} upvotes={post.upvotes} />
                    ))
                }
            </div>
        </InfiniteScroll>
    );
};

export default ProfilePosts;
