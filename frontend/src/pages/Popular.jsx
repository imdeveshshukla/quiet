import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import Postskelton from '../components/Postskelton';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSkeltonLoader } from '../redux/skelton';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import baseAddress from "../utils/localhost";



const Popular = () => {
    const isSkelton = useSelector(state => state.skelton.value);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setisLoading] = useState(false)
    const dispatch = useDispatch();


    const deletePopularPost=(id)=>{
        setPosts(posts.filter(post=> post.id!==id));
    }


    const getPosts = async (reset = false) => {
        setisLoading(true)
        try {
            if (reset) {
                setPosts([])
                setPage(1);
                setHasMore(true);
            }

            const currentPage = reset ? 1 : page;

            const res = await axios.get(`${baseAddress}posts/popular`, {
                params: {
                    page: currentPage,
                    limit: 10,
                },
            });


            if (res.status === 200) {
                if (res.data.length < 10) {
                    setHasMore(false);
                }
                setPosts([...posts, ...res.data]);

            }
        } catch (error) {
            console.log(error);
        }
        setisLoading(false)
    };



    useEffect(() => {
        if (page > 1) {
            getPosts();
        } else {
            getPosts(true)
        }
    }, [page]);

    const fetchMoreData = () => {
        if (isLoading || !hasMore) return;
        setPage(prevPage => prevPage + 1);
    };



    return (
        <>
            <div className=' min-h-screen xxs:pl-0 xs:pl-8 sm:pl-16'>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<div className='py-8'><Postskelton /></div>}
                    endMessage={<p className='text-center font-semibold p-4'>You've reached the end of the page!</p>}
                >
                    <div className='py-8'>
                        {
                            posts.map(post => (
                                <Posts key={uuidv4()} id={post.id} title={post.title} body={post.body} media={post.img} countComment={String(post.commentCount).substring(0, post.commentCount.length - 1)} createdAt={post.createdAt} user={post.user} upvotes={post.upvotes} deletePopularPost={deletePopularPost}/>
                            ))
                        }
                    </div>
                </InfiniteScroll>
            </div>
        </>
    )
}

export default Popular
