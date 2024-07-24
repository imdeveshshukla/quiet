import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTime } from './Posts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearNotification, setNotification, updateNotification } from '../redux/Notification';
import { FiRefreshCcw } from "react-icons/fi";
import SmallLoader from './SmallLoader';




axios.defaults.withCredentials = true


const Notification = ({setIsNfnOpen}) => {
    const notifications = useSelector(state => state.notification.notifications);
    const dispatch = useDispatch();
    const Navigate =useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh= async()=>{
        setIsLoading(true);
        getUserNotification()
    }

    const getUserNotification = async()=>{
        try {
          const res = await axios.get("http://localhost:3000/u/notification", { withCredentials: true });
          console.log(res.data);
          dispatch(setNotification(res.data.data))
        } catch (error) {
          console.log(error);
          
        }
        setIsLoading(false)
      }


    const handleClick=(id, nId)=>{
        console.log(id, nId);
        
        Navigate(`/posts/${id}`);
        setIsNfnOpen(false);
        markAsRead(nId);
    }


    const handleAllRead = async() => {
        console.log("notify",notifications);
        if(notifications.length==0) return;
        try {
            const res = await axios.post("http://localhost:3000/u/markallasread", { withCredentials: true  });
            if(res.status==202){
                dispatch(clearNotification());
            }
        } catch (error) {
            
        }
        
    }

    const markAsRead=async(id)=>{
        console.log(id);
        
        try {
            const res = await axios.post("http://localhost:3000/u/markasread", { id });
            console.log(res);
            if(res.status==201){
                dispatch(updateNotification(id));
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <div className=' rounded-2xl shadow-md shadow-current absolute top-16 right-20 w-[25vw]  bg-[#c2c7b3] '>

            <span  className=' absolute right-4 top-2 text-white text-xl'>{isLoading?<SmallLoader/>:<FiRefreshCcw className=' cursor-pointer' onClick={()=>handleRefresh()}/>}</span>

            <div className=' bg-[#6f742b] text-white rounded-t-2xl text-center p-1'>Notifications</div>
            {notifications.length==0 && <div className=' p-4  text-red-950 text-center font-semibold'>You're all caught up! No new notifications.</div>}
            <div className=' max-h-[60vh] overflow-auto scrollable-box'>
            {notifications?.map(item => <>
                <div onClick={()=>handleClick(item.postId, item.id)} className=' cursor-pointer hover:bg-[#acb499] shadow-sm  shadow-lime-800 px-4 py-2'>
                    <div className=' flex items-center justify-between'><span className='text-md '><span className='font-semibold'>{item.user2.username} </span>{item.title}</span><span className=' text-xs text-slate-600'>{getTime(item.createdAt)} ago</span></div>
                    {item.body?<div className=' text-sm line-clamp-3 bg-[#9eb840] overflow-clip px-3 text-white m-1 py-1 rounded-lg'>{item.body}</div>:<></>}
                </div>
            </>
            )}
            </div>


            <div onClick={() => handleAllRead()} className=' text-blue-600 bg-[#b4ba5a] rounded-b-2xl text-sm text-center cursor-pointer p-1 '>
                Mark all as Read
            </div>
        </div>
    )
}
export default Notification

export const Message = ({ }) => {
    return (<>



    </>
    )
}








