import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Postskelton, { PollSkelton } from '../components/Postskelton';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSkeltonLoader } from '../redux/skelton';
import userposts, { clearPostsInfo, setPost } from '../redux/userposts';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useOutletContext, useParams } from 'react-router-dom';
import baseAddress from "../utils/localhost";
import { setUserPost } from '../redux/user';
import Polls from '../components/Polls';
import { clearPollInfo, setPoll } from '../redux/userpolls';





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
            loader={<div className='py-2'><Postskelton /></div>}
            endMessage={<p className='text-center break-words font-semibold p-4'>{`${userPost.length === 0 ? "It looks like the user hasn't made any posts yet." : "You've reached the end of the page!"}`}</p>}
        >
            <div className=''>
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

export const ProfilePoll= ()=>{
    const userPoll = useSelector(state => state.userpoll.polls);
    const isSkelton = useSelector(state => state.skelton.value);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useOutletContext();
    const { username } = useParams();
    const [isLoading, setisLoading] = useState(false)

    const getPoll =async(reset= false)=>{
        setisLoading(true)
        dispatch(setSkeltonLoader())
        if(reset){
            dispatch(clearPollInfo())
            setPage(1);
            setHasMore(true)
        }
        try {
            const res= await axios.get(`${baseAddress}search/getuserpolls`, {
                params:{
                    userId: user.userID,
                    page,
                    limit: 10,
                }
            })

            console.log(res);
            if(res.status==200){
                dispatch(setPoll(res.data))

                if(res.data.length<10){
                    setHasMore(false)
                }
            }

            
        } catch (error) {
            
        }
        setisLoading(false)
        dispatch(setSkeltonLoader())
    }


    useEffect(() => {
        getPoll(true);
    }, [username]);


    useEffect(() => {
        if (page > 1) {
            getPoll();
        }
    }, [page]);


    const fetchMoreData = () => {
        if (isLoading || !hasMore) return;
        setPage(prevPage => prevPage + 1);
    };
    


    

    return (

            <InfiniteScroll
            dataLength={userPoll?.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className='py-2'><PollSkelton /></div>}
            endMessage={<p className='text-center break-words font-semibold p-4'>{`${userPoll.length === 0 ? "It looks like the user hasn't made any posts yet." : "You've reached the end of the page!"}`}</p>}
        >
            <div className=''>
                {(isSkelton && userPoll.length === 0) ? <PollSkelton /> :
                    userPoll.map(poll => (
                        <Polls key={poll.id} poll={poll} />
                    ))
                }
            </div>
        </InfiniteScroll>

    )
}

export const ProfilePostOrPoll= ()=>{
    const [disVal, setdisVal] = useState("post")
    return(
        <div>
            <div className='flex gap-2 justify-end mx-4 xxs:mx-8 mt-6'>
    <div className={`flex items-center gap-1 ${disVal === 'post' ? 'bg-[#65692375] ' : 'bg-gray-200'} px-3 py-1 rounded-md`}>
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
            className={`font-semibold font-roboto cursor-pointer ${disVal === 'post' ? 'text-white' : 'text-gray-700'}`} 
            htmlFor="post">
            Post
        </label>
    </div>
    <div className={`flex items-center gap-1 ${disVal === 'poll' ? 'bg-[#65692375]' : 'bg-gray-200'} px-3 py-1 rounded-md`}>
        <input 
            className='size-4 hidden' 
            onChange={() => setdisVal("poll")} 
            checked={disVal === "poll"} 
            type="radio" 
            value="poll" 
            name="post_poll" 
            id="poll" 
        />
        <label 
            className={`font-semibold font-roboto cursor-pointer ${disVal === 'poll' ? 'text-white' : 'text-gray-700'}`} 
            htmlFor="poll">
            Poll
        </label>
    </div>
</div>


            {disVal==="post" && <ProfilePosts/>}
            {disVal==="poll" && <ProfilePoll/>}


        </div>
    )
}
