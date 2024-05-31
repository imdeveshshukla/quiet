import React, { useEffect, useState } from 'react'
import Createpost from './Createpost'
import { useDispatch, useSelector } from 'react-redux'
import Posts from './Posts';
import axios from 'axios';
import loading from '../redux/loading';
import setPost  from '../redux/Post';


const Home = () => {

  const posts = useSelector(state=>state.post.posts);
  const isLogin= useSelector(state=> state.login.value);
  const dispatch = useDispatch();
  // console.log("Posts");
  // console.log(posts);
  return (
    <div className=' h-full overflow-auto border-x-2 border-black pl-16'>
        
        {isLogin && <Createpost/>}
        <div className='bg-gray-700 h-[1px]'></div>

        <div className="post ">
        {posts==null?"":posts.map((post)=>{
          const postDate = new Date(post.createdAt);
          const crrTime = new Date();
          const years = crrTime.getFullYear() - postDate.getFullYear() 
          const month = crrTime.getMonth() - postDate.getMonth();
          const date = crrTime.getDate() - postDate.getDate();
          const hours = crrTime.getHours() - postDate.getHours();
          const min = crrTime.getMinutes() - postDate.getMinutes();
          const sec = crrTime.getSeconds() - postDate.getSeconds();
          const ans = years>0?years+' year':(month>0?month+' month':date>0?date+" days":hours>0?hours+" hours":min>0?min+" minutes":sec>0?sec+" seconds":0+" seconds");
          console.log(postDate.getHours()+" "+crrTime.getHours());
          return<>
          <Posts key={post.id} id={post.id} username={post.username} title={post.title} body={post.body} media={post.img} countComment={post.comments?.length} time={ans} />
          </>
        })}

        </div>

    </div>
  )
}

export default Home
