import axios from "axios";
import { useEffect, useRef, useState } from "react";
import baseAddress from "../utils/localhost";
import { useAsyncError, useParams } from 'react-router-dom'
import bg from '../assets/unnamed.png'
import { MdFileUpload } from "react-icons/md";
import { setRoomDetail,changeBgImg } from "../redux/roomSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SmoothLoader from "../assets/SmoothLoader";
import Loader from "../components/Loader";
const Room = function()
{
    
    const {title,username} = useParams();
    const userData = useSelector(state => state.user.userInfo);
    const room = useSelector(state => state.rooms.rooms);
    const roomDetail = useSelector(state=> state.room.roomInfo);
    const dispatch = useDispatch();
    const [img,setImg] = useState(null);
    const [desc,setDescription] = useState(null);
    const [bgImg,setBgImg] = useState(null);
    const [owner,setOwner] = useState(null);
    const [privacy,setPrivacy] = useState(true);
    const [users,setUsers] = useState([]);
    const [posts,setPost] = useState([]);
    const [loader1,setLoader1] = useState(false);
    const [loading,setLoading] = useState(false);
    const ref = useRef(null);
    function getRooms(){
        const crr = room.forEach(function(val){
          if(val?.room?.title == title)
          {
            dispatch(setRoomDetail(val.room));
            return;
          }
        });
        // console.log("Crr ",crr);
        // if(crr){
        //   dispatch(setRoomDetail(crr));
    }
    useEffect(() => {
      // console.log("Inside UseEFfect");
      getRooms();
    }, [title])
        
    // useEffect(()=>{
    //   room = room.forEach((val,idx)=>{
    //     if(val?.room.id == roomDetail.id)
    //     {
    //       room[idx].room = roomDetail;
    //     }
    //   })
    //   console.log("update = ",room);
    // },[roomDetail]);
    const updateBgImg = async(e)=>{
      setLoader1(true);
      const bgImg = e.target.files[0];
      const formData = new FormData();
      formData.append('title',title);
      formData.append('bgImg',bgImg);
      console.log(formData);
      try{
        const res = await axios.post(baseAddress+"rooms/updatebgImg",formData);
        console.log(res.data);
        const updated = res.data.updatedRoom.bgImg;
        dispatch(changeBgImg(updated));
        toast.success("Updated");
      }
      catch(e)
      {
        console.log(e);
      }
      finally{
        setLoader1(false);
      }
    }
    return <div className="w-full">
      <div className=''>
          <div className='border-black border-2 relative shadow-lg shadow-slate-300 rounded-2xl h-48 m-4  '>
              <img className=' w-full h-full object-cover rounded-2xl' src={roomDetail?.bgImg||bg} alt="backgroudImage" />
              {(roomDetail?.CreatorId == userData?.userID)&&(loader1?<div className="absolute bottom-0.5 right-2"><SmoothLoader/></div>:
              <button onClick={() => ref.current?.click()} 
              className="absolute flex text-sm font-bold bottom-0.5 right-2 rounded hover:bg-gray-600">
                <MdFileUpload size={20}/>{"Change"}
                <input type="file" onChange={(e)=>updateBgImg(e)} name="bgImg" accept="image/*" ref={ref} id="" hidden/>
              </button>)}
              <div className=' absolute left-14 bottom-0 border-4  translate-y-1/2  h-40 w-40 rounded-full overflow-hidden '>
                  <img className=' h-full w-full object-cover' src={roomDetail?.img} alt="Image Not Uploaded" />
              </div>
          </div>
          <div className='flex items-center gap-0 underline justify-start ml-60  w-full text-center text-4xl font-bold'>
          <div className="bg-black text-white text-sm rounded px-1">{username}/</div><span>{title}</span></div>
          <div className='h-[1.5px] bg-gray-800 mt-10'></div>
      </div>

    </div>
}

export default Room;