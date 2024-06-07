import React, { useEffect, useState } from 'react'
import Posts from './Posts';
import Postskelton from './Postskelton';
import { useSelector, useDispatch } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import { setSkeltonLoader } from '../redux/skelton';
import { clearPostsInfo, setPost } from '../redux/userposts';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Profile from './Profile';



axios.defaults.withCredentials = true



const Userpost = () => {
    const userPost = useSelector(state => state.userpost.posts)
    const isSkelton = useSelector(state => state.skelton.value);
    const dispatch = useDispatch()
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);



    const getUserPost = async () => {
        
        console.log("get");
        if(page==1){
            dispatch(clearPostsInfo())
        }
    
        
        try {
            const res = await axios.get(`http://localhost:3000/u/getuserpost`, {
                params: {
                    page,
                    limit: 10,
                },
                withCredentials: true 
            });
            
            console.log(res);
            
            if (res.status == 200) {
                if (res.data.posts.length < 10) {
                    setHasMore(false);
                }

                dispatch(setPost(res.data.posts))
            }
        } catch (error) {
            console.log(error);
            
        }
       

      
    }


    useEffect(() => {
        console.log("useeff userpost");
        
        getUserPost();
    }, [page]);


    const fetchMoreData = () => {
        console.log(`Loading more data, current page: ${page}`);
        setPage((prevPage) => prevPage + 1);
    };

    return (


            <InfiniteScroll
                dataLength={userPost.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<div className='pl-20 py-8 border-x-2  border-black'><Postskelton/></div>}
                endMessage={<p className=' text-center font-semibold p-4'>You've reached the end of the page!</p>}
            >
                <div className=' pl-20 py-8 border-x-2 border-black'>
                <Profile/>

                {(!userPost)||(page==1 && isSkelton)? <Postskelton />:
                    userPost.map(post => {
                        return (
                            <Posts key={uuidv4()} post={post} id={post.id} title={post.title} body={post.body} media={post.img} countComment={post.comments?.length} createdAt={post.createdAt} user={post.user} upvotes={post.upvotes} />
                        )
                    }
                )}
                </div>
            </InfiniteScroll>
        
    )
}

export default Userpost
