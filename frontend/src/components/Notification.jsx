import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTime } from './Posts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearNotification, setNotification, updateNotification } from '../redux/Notification';
import { FiRefreshCcw } from "react-icons/fi";
import SmallLoader from './SmallLoader';
import Loader from './Loader';
import baseAddress from '../utils/localhost';
import { addNewRoom } from '../redux/userRooms';
import { setRoomDetail } from '../redux/roomSlice';
import toast from 'react-hot-toast';




axios.defaults.withCredentials = true


const Notification = ({setIsNfnOpen}) => {
    const notifications = useSelector(state => state.notification.notifications);
    const dispatch = useDispatch();
    const Navigate =useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [bigLoader,setBigLoader] = useState(false);
    const handleRefresh= async()=>{
        setIsLoading(true);
        getUserNotification()
    }

    const getUserNotification = async()=>{
        try {
          const res = await axios.get("http://localhost:3000/u/notification", { withCredentials: true });
          dispatch(setNotification(res.data.data))
          
        } catch (error) {
          console.log(error);
          
        }
        setIsLoading(false)
      }

    const addUserToRoom = async(title,fromUser)=>{
        // console.clear();
        console.log(title+" "+fromUser);
        setBigLoader(true)
        try {
            const res = await axios.post(`${baseAddress}rooms/acceptJoiningRequest`,{
                title,
                fromUser
            })
            console.log(res);
            if(res.status == 200)
            {
                const room = res?.data?.room;
                dispatch(addNewRoom(room));
                // dispatch(setRoomDetail(room));
                const creatorId = room?.CreatorId;
                const title = room?.title;
                setBigLoader(false);
                Navigate(`/room/${creatorId}/${title}`,{state:{joined:true}});

            }
            else{
                toast.error(res.data.msg);
            }
            setBigLoader(false)
        } catch (error) {
            setBigLoader(false)
            toast.error(error.message);
        }
    }
    const handleClick=(item, nId)=>{
        setIsNfnOpen(false);
        markAsRead(nId);
        if(item.postId)
            Navigate(`/post/${item.postId}`);
        else
        {
            console.log(item);
            addUserToRoom(item.body,item.fromUser);
        }
    }


    const handleAllRead = async() => {
        setIsNfnOpen(false)
        if(notifications.length==0) return;
        try {
            const res = await axios.post("http://localhost:3000/u/markallasread", { withCredentials: true  });
            if(res.status==202){
                dispatch(clearNotification());
            }
        } catch (error) {
            console.log(error);      
        }
        
    }

    const markAsRead=async(id)=>{
        
        try {
            const res = await axios.post("http://localhost:3000/u/markasread", { id });
            if(res.status==201){
                dispatch(updateNotification(id));
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <div className=' rounded-2xl shadow-md shadow-current absolute top-20 right-2  xxs:right-5 xs:right-20  w-[96vw] xxs:w-[90vw] xs:w-[75vw]  sm:w-[55vw]  2_sm:w-[50vw] md:w-[46vw] 1_5md:w-[43vw]  2_md:w-[40vw]  lg:w-[37vw] 1_5lg:w-[33vw] xl:w-[30vw]  bg-[#c2c7b3] '>

            <span  className=' absolute right-4 top-2 text-white text-xl'>{isLoading?<SmallLoader/>:<FiRefreshCcw className=' cursor-pointer' onClick={()=>handleRefresh()}/>}</span>

            <div className=' bg-[#6f742b] text-white rounded-t-2xl text-center p-1'>Notifications</div>
            {notifications.length==0 && <div className=' p-4  text-red-950 text-center font-semibold'>You're all caught up! No new notifications.</div>}
            <div className=' max-h-[70vh] sm:max-h-[60vh] overflow-auto scrollable-box'>
            {notifications?.map(item =><>
                <div key={item.id} onClick={()=>handleClick(item, item.id)} className=' cursor-pointer hover:bg-[#acb499] shadow-sm  shadow-lime-800 px-2 py-1 xxs:px-4  xxs:py-2'>
                    <div className=' flex items-center justify-between'><span className='text-md '><span className='font-semibold'>{item.user2.username} </span>{item.title}</span><span className=' text-xs text-slate-600'>{getTime(item.createdAt)} ago</span></div>
                    {item.body?<div className='whitespace-pre-wrap break-words text-sm line-clamp-3 bg-[#9eb840] overflow-clip px-3 text-white m-1 py-1 rounded-lg'>{item.body}</div>:<></>}
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








