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
import { setRooms } from "../redux/userRooms";
import CreatePost from "./CreatePost";
const Room = function({hideData})
{
    
    const {title,CreatorId} = useParams();
    const userData = useSelector(state => state.user.userInfo);
    const room = useSelector(state => state.rooms.rooms);
    const roomDetail = useSelector(state=> state.room.roomInfo);
    const dispatch = useDispatch();
    const [hid,sethide] = useState(hideData?hideData:true);
    const [loader1,setLoader1] = useState(false);
    const ref = useRef(null);
    const [showCP,setShowCP] = useState(false);
    function openPostBtn(){
      setShowCP(true);  
    }
    function onNewPost(){
      console.log("Inside new postFunction");
      
    }
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
    //For Refresh
    // useEffect(()=>{
    //   (async()=>{
    //     try{
    //       const res = await axios.get(baseAddress+`rooms/getAllRoom/${userData?.userID}`);
    //       dispatch(setRooms(res.data.rooms));
    //     }catch(e)
    //     {
    //       console.log("Error in Fetching Rooms ="+e);
    //     }
    //   })();
    // },[userData])

    useEffect(()=>{
      var temp = [...room];
      console.log("temp ",temp);
      
      temp.forEach((val,idx)=>{
        if(val?.room?.id == roomDetail?.id)
        {
          temp[idx] = {room:roomDetail};
          console.log(room[idx])
          console.log(roomDetail);
        }
      })
      console.log("update = ",temp);
      dispatch(setRooms(temp));
    },[roomDetail]);
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
    // console.log(roomDetail?.CreatorId +"=="+userData?.userID);
    return( 
      <>
      {showCP && <CreatePost showCP={showCP} onNewPost={onNewPost} setShowCP={setShowCP} roomTitle={title}/>}
    <div className="w-full">
      <div className=''>
          <div className='border-black border-2 relative shadow-lg shadow-slate-300 rounded-2xl h-48 m-4  '>
              <img className=' w-full h-full object-cover rounded-2xl' src={roomDetail?.bgImg||bg} alt="backgroudImage" />
              {(CreatorId == userData?.userID)&&(loader1?<div className="absolute bottom-0.5 right-2"><SmoothLoader/></div>:
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
          <div className="bg-black text-white text-sm rounded px-1">{"room"}/</div><span>{title}</span>
          <button className="ml-20 flex bg-black text-white p-1 px-3 rounded-md self-center hover:bg-slate-500"
          onClick={openPostBtn}
          >
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
            <span className="text-sm pt-0 mt-0 self-center no-underline">{"Create"}</span>
          </button>
          
          </div>
          <div className='h-[1.5px] bg-gray-800 mt-10'></div>
      </div>

    </div>
    </>
    )
}

export default Room;