import axios from "axios";
import { useEffect, useRef, useState } from "react";
import baseAddress from "../utils/localhost";
import { Link, Navigate, useAsyncError, useLocation, useNavigate, useParams } from 'react-router-dom'
import bg from '../assets/unnamed.png'
import { MdFileUpload } from "react-icons/md";
import q from '../assets/q.svg'
import { setRoomDetail, changeBgImg, updatePost, changeDpImg } from "../redux/roomSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SmoothLoader from "../assets/SmoothLoader";
import Loader from "../components/Loader";
import { addNewRoom, setRooms } from "../redux/userRooms";
import CreatePost from "./CreatePost";
import { clearHotPostsInfo, setHotPost } from "../redux/Hotposts";
import { setSkeltonLoader } from "../redux/skelton";
import Postskelton from "../components/Postskelton";
import Posts from "../components/Posts";
import InfiniteScroll from "react-infinite-scroll-component";
import { SiTestin } from "react-icons/si";
import { BsThreeDots } from "react-icons/bs";
import AddMemBox from "../components/AddMemBox";
import { PiCameraPlusLight } from "react-icons/pi";
import SmallLoader from "../components/SmallLoader";
import { GrRefresh } from "react-icons/gr";
import { BsPersonFillAdd } from "react-icons/bs";
import { RiAddBoxLine } from "react-icons/ri";
import { BsHouseAddFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import ForbiddenPage from "./ForbiddenPage";
import { roomsApi, useGetRoomDetailsQuery } from "./RoomApis";

const Room = function () {
  const location = useLocation();
  // const [joined, setJoined] = useState(location?.state?.joined||false)
  const { title, CreatorId } = useParams();
  
  const {data,isLoading,isError,error} = useGetRoomDetailsQuery(title)
  // console.log(data)
  const [joined,setJoined] = useState(data?.joined);
  const dispatch = useDispatch();
  
  const userData = useSelector(state => state.user.userInfo);
  // const userID = localStorage.getItem("userID");
  // const userID = userData?.userID;
  const room = useSelector(state => state.rooms.rooms);
  const roomDetail = useSelector(state => state.room.roomInfo);
  
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  // const [isLoading, setisLoading] = useState(false)
  const ref = useRef(null);
  const dpref= useRef(null)
  const [showCP, setShowCP] = useState(false);
  const navigate = useNavigate();
  const isSkelton = useSelector((state) => state.skelton.value);
  const hotposts = useSelector((state) => state.hotpost.hotposts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);  //testing
  const [gotPost, setPost] = useState([]);
  const isOwner = (CreatorId === userData?.userID && joined);
  const [showAddMem, setShowAddMem] = useState(false);
  const [privateRoom, setPrivateRoom] = useState(true);
  const dropdownRef = useRef(null);
  const [isOpen,setisOpen] = useState(false);
  function handleToggle(){
    setisOpen((isOpen) => !isOpen)
  }
  async function deleteRoom(){
    setisOpen((isOpen)=>!isOpen);

    toast.loading("Processing...");
    try{
      const roomId = roomDetail.id;
      const res = await axios.post(baseAddress+"rooms/leave/"+roomId);
      toast.dismiss();
      toast.success(res?.data?.msg);
      const updatedRooms = [...room].filter(roomObject => roomObject.room.id !== roomId);
      dispatch(setRooms(updatedRooms));
      refresh();
      if(isOwner)navigate('/');
      else setJoined(false);
    }
    catch(e)
    {
      toast.dismiss();
      toast.error(e?.response?.data?.msg);
    }
  }
  function openPostBtn() {
    setShowCP(true);
  }

  async function joinRoom() {
    // console.log("Code For Joining the room");
    try {
      const res = await axios.post(`${baseAddress}rooms/join`, {
        title
      })
      if (res.status == 200) {
        console.clear()
        // console.log(res?.data?.room);
        dispatch(addNewRoom(res?.data?.room));
        refresh();
        console.log(res?.data);
        console.log(room);
        toast.success(res?.data.msg);
        
        setJoined(true);
      }
      else {
        toast.error(res?.data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }



  const getPost = async () => {
    
    // setisLoading(true)
    console.log(`Fetching posts for page: ${page}`);
    if (!joined && privateRoom) {
      setHasMore(false);
      dispatch(setHotPost([]))
      // setisLoading(false);
      return;
    }
    if (page == 1) {
      dispatch(clearHotPostsInfo())
    }
    try {
      dispatch(setSkeltonLoader())
      const res = await axios.get(`${baseAddress}posts/getPost?title=${title}`, {
        params: {
          page,
          limit: 10,
        },
      });

      if (res.status === 200) {
        const fetchedPosts = res.data.posts;

        if (fetchedPosts.length < 10) {
          setHasMore(false);
        }
        dispatch(setSkeltonLoader())
        dispatch(setHotPost(fetchedPosts));
        // console.log(fetchedPosts);
      }
    } catch (error) {
      console.log(error);
      setHasMore(false); // Stop fetching if there's an error
      dispatch(setSkeltonLoader())
    }

    // setisLoading(false)


  };
 
  // console.clear();
  
  async function refresh() {
    dispatch(roomsApi.util.invalidateTags([{ type: 'Room', id: title }]));
    getPost();
  }

  useEffect(() => {
    dispatch(setRoomDetail(data?.room));
    setJoined(data?.joined);
    setPrivateRoom(data?.room?.privateRoom);
    console.log("Inside useeffect ")
    console.log(data);
    getPost();
    setPage(1); 
    if (joined) setHasMore(true);
    return () => {
      dispatch(clearHotPostsInfo());
    }
  }, [data])

  useEffect(()=>{
    getPost();
  },[page])


  function onNewPost() {
    setPage(1);
    setHasMore(true);
    refresh();
    dispatch(updatePost(gotPost));
  }

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage((prevPage) => prevPage + 1);
  };

  const updateBgImg = async (e) => {
    setLoader1(true);
    const bgImg = e.target.files[0];
    const formData = new FormData();
    formData.append('title', title);
    formData.append('bgImg', bgImg);
    try {
      const res = await axios.post(baseAddress + "rooms/updatebgImg", formData);
      const updated = res.data.updatedRoom.bgImg;
      dispatch(changeBgImg(updated));
      toast.success("Updated");
    }
    catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.msg);
    }
    finally {
      setLoader1(false);
    }
  }


  const handleDpUpdate = async (e) => {
    setLoader2(true);
    const roomImg = e.target.files[0];
    const formData = new FormData();
    formData.append('title', title);
    formData.append('roomImg', roomImg);
    try {
      const res = await axios.post(baseAddress + "rooms/updatedp", formData);
      const updated = res.data.updatedRoom.img;
      dispatch(changeDpImg(updated));
      toast.success("Updated");
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setLoader2(false);
    }
  }


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setisOpen(false);
    }

  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // console.log(roomDetail?.CreatorId + "==" + userData?.userID+" === ");
  console.log('Private Room' + privateRoom);
  return (
    <>
      {showCP && <CreatePost showCP={showCP} onNewPost={onNewPost} setShowCP={setShowCP} roomTitle={title} setPost={setPost} />}
      {showAddMem && <AddMemBox setShow={setShowAddMem} id={title} />}
      <div className="w-full">
        <div className=' flex flex-col gap-6'>
          <div className='border-black border-2 relative shadow-lg shadow-slate-300 rounded-2xl h-48 m-4  '>
            <img className=' w-full h-full object-cover rounded-2xl' src={roomDetail?.bgImg || bg} alt="backgroudImage" />
            {(isOwner) && (loader1 ? <div className="absolute bottom-0.5 right-2"><SmoothLoader /></div> :
              <button onClick={() => ref.current?.click()}
                className="absolute flex text-sm font-bold bottom-2 bg-slate-400 right-2 rounded-full p-1 border-2  hover:bg-gray-600">
                <PiCameraPlusLight className=" text-2xl " />
                <input type="file" onChange={(e) => updateBgImg(e)} name="bgImg" accept="image/*" ref={ref} id="" hidden />
              </button>)}
            <div className=' absolute left-14 bottom-0 border-4  bg-blue-600 translate-y-1/2  h-40 w-40 rounded-full  '>
              
              {loader2?<div className="h-full w-full rounded-full flex items-center justify-center bg-[#fff5] backdrop-blur-lg"><SmallLoader/></div>:<img  className=' h-full w-full object-cover rounded-full' src={roomDetail?.img} alt="Image Not Uploaded" />}
              <input onChange={(e) => handleDpUpdate(e)} accept='image/*' ref={dpref} type="file" name="media" id="media" hidden />
              {isOwner && (<button onClick={() => dpref.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>)}

            </div>
          </div>
          <div className='flex items-center  justify-end pr-8   w-full text-center text-3xl font-bold'>
            <img className=" w-9 rounded-l-lg " src={q} alt="" /><span className=" bg-white  rounded-r-lg px-1">{title}</span>
          </div>
          <div className="flex items-center  justify-end pr-8   w-full">
             {
              joined ?
                <div className='flex self-end gap-2 justify-self-end'>
                  <button className="flex items-center gap-2 bg-black text-white py-2 px-6 rounded-lg  hover:bg-slate-500"
                    onClick={openPostBtn}
                  >

                    <RiAddBoxLine className=" text-xl"/>
                    <span className="text-sm pt-0 mt-0 self-center no-underline">{"Post"}</span>
                  </button>
                  {isOwner && <button className="flex bg-black items-center gap-2 text-white py-2 px-3 rounded-lg self-center hover:bg-slate-500"
                    onClick={() => setShowAddMem(true)}
                  >
                    <BsPersonFillAdd className=" text-xl"/> 
                  </button>
                  }
                </div>
                :
                <>
                  <button className=" flex items-center gap-2 bg-black text-white py-2 px-6 rounded-lg self-center hover:bg-slate-500"
                    onClick={joinRoom}
                  >

                    <BsHouseAddFill className=" text-xl"/>
                    <span className="text-sm pt-0 mt-0 self-center no-underline">{privateRoom ? "Send Request" : "Join"}</span>
                  </button>
                </>
            }
            <div className="relative flex items-center gap-8" ref={dropdownRef} >

              <button onClick={handleToggle} className="flex items-center rounded-full border-2 border-black hover:border-white focus:outline-none">
                <BsThreeDots/>
              </button>
              {isOpen && (
                <div className="absolute right-0 top-10 w-40 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1 bg-black rounded-md ">
                    <li className="px-4 py-1 text-white hover:bg-grey">
                      <button onClick={() => deleteRoom()} to={"/"} className="block">{isOwner?'Delete':'Leave'}</button>
                    </li>
                  </ul>

                </div>
              )}
            </div>
          </div>
          </div>
          <div className='h-[1.5px] bg-gray-800 mt-10'></div>

      </div>

      
      <div className=' min-h-screen px-10'>
{privateRoom&&!joined?<ForbiddenPage/>:
        <InfiniteScroll
          dataLength={hotposts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Postskelton />}
          endMessage={hotposts.length > 0 ? <p className=' text-center font-semibold p-4'>{"You've reached the end of the page!"}</p> : <p className=' text-center font-semibold p-4'>No posts available to display!</p>}
        >
          {/* <Hottopic topic={title} dp={dp} bg={bg} /> */}

          <div className=' flex items-center justify-end mx-4 mt-3'>
            <span onClick={() =>( refresh() )} className=' bg-[#eff1d3] rounded-full p-1'>
              {isSkelton ? <SmallLoader /> : <GrRefresh className=' cursor-pointer text-blue-500 text-xl font-extrabold' />}
            </span>
          </div>

          <div className="post">
            { (hotposts.length == 0 && isSkelton) ? (
              <Postskelton />
            ) : (
              hotposts.map((post) => (
                <Posts
                  key={post.id}
                  id={post.id}
                  post={post}
                  title={post.title}
                  body={post.body}
                  media={post.img}
                  countComment={post.comments?.length}
                  createdAt={post.createdAt}
                  user={post?.user}
                  upvotes={post?.upvotes}
                />
              )
              )
            )}
          </div>
        </InfiniteScroll>
}
      </div>
    </>
  )
}

export default Room;