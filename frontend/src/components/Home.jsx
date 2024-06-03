import React, { useEffect, useState } from 'react'
import Createpost from './Createpost'
import { useDispatch, useSelector } from 'react-redux'
import Posts from './Posts';
import axios from 'axios';
import loading from '../redux/loading';
import setPost  from '../redux/Post';
import Postskelton from './Postskelton';
import { setSkeltonLoader } from '../redux/skelton';
import { v4 as uuidv4 } from 'uuid';



const Home = () => {

  const posts = useSelector(state=>state.post.posts);
  const isLogin= useSelector(state=> state.login.value);
  const isSkelton= useSelector(state=>state.skelton.value);
  const dispatch = useDispatch();
  
  // console.log(posts);
  return (
    <div className=' h-full overflow-auto border-x-2 border-black pl-16'>
        
        {isLogin && <Createpost/>}
        <div className='bg-gray-700 h-[1px]'></div>

        <div className="post">
        {posts==null? <Postskelton/> : posts.map((post)=>{

          return isSkelton?<Postskelton key={uuidv4()}/>:<Posts key={post.id} id={post.id} username={post.username} title={post.title} body={post.body} media={post.img} countComment={post.comments?.length} createdAt={post.createdAt} user={post?.user} />
        })}

        </div>

    </div>
  )
}

export default Home
