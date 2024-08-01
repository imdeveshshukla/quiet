import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Postskelton from '../components/Postskelton';
import InfiniteScroll from 'react-infinite-scroll-component'
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSkeltonLoader } from '../redux/skelton';



const ProfileComments = () => {
  const [userComment, setUserComment] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useOutletContext();
  const { username } = useParams();
  const dispatch= useDispatch()
  const isSkelton = useSelector(state => state.skelton.value);



  const getUserComment = async (reset = false) => {
    console.log("fetching");
    dispatch(setSkeltonLoader());
    
    try {
        if (reset) {
            setUserComment([]);
            setPage(1);
            setHasMore(true);
        }

        const currentPage = reset ? 1 : page;

        const res = await axios.get(`http://localhost:3000/search/getusercomments`, {
            params: {
                userID: user.userID,
                username,
                page: currentPage,
                limit: 10,
            },
            withCredentials: true,
        });
console.log("userComments",res);

        if (res.status === 200) {
            if (res.data.length < 10) {
                setHasMore(false);
            }
            setUserComment([...userComment, res.data])
        }
    } catch (error) {
        console.log(error);
    }
    dispatch(setSkeltonLoader());

};

useEffect(() => {
  console.log("usrname eff",user, username);
  
  
  getUserComment(true);
}, [username]);

useEffect(() => {
  console.log("page eff", user, username);
  
  if (page > 1) {
      getUserComment();
  }
}, [page]);


  const fetchMoreData = () => {
    setPage(prevPage => prevPage + 1);
};
  return (
    <InfiniteScroll
            dataLength={userComment.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className='py-8'><Postskelton /></div>}
            endMessage={<p className='text-center font-semibold p-4'>{`${userComment.length==0? 'No comments':"You've reached the end of the page!"}`}</p>}
        >
            <div className='py-8'>
                {(isSkelton && userComment.length === 0) ? <Postskelton /> :
                    userComment.map(post => (
                        <></>
                    ))
                }
            </div>
        </InfiniteScroll>
  )
}

export default ProfileComments
