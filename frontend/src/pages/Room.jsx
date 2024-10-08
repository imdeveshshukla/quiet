import axios from "axios";
import { useEffect, useRef, useState } from "react";
import baseAddress from "../utils/localhost";
import { Link, Navigate, useAsyncError, useLocation, useNavigate, useParams } from 'react-router-dom'
import q from '../assets/q.svg'
import { setRoomDetail, changeBgImg, changeDpImg } from "../redux/roomSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SmoothLoader from "../assets/SmoothLoader";
import { addNewRoom, setRooms } from "../redux/userRooms"
import Postskelton, { PollSkelton } from "../components/Postskelton";
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
import { MdExitToApp } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import banner from '../assets/banner.png'
import { BiEdit } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import roomDp from '../assets/roomdp.jpg'
import OnclickCard from "../components/OnclickCard";
import { addRoomCreatorId, addRoomTitle } from "../redux/RoomCreatePosts";
import getRoomsPolls from "../utils/getRoomPolls";
import { clearPollInfo, setPoll } from '../redux/userpolls';
import Polls from "../components/Polls";
import ConfirmWindow from "../components/ConfirmWindow";
import { clearRoomPostsInfo, setRoomPost } from "../redux/RoomPosts";




const Room = function () {
  const location = useLocation();
  const navlink = location?.state;
  const { title, CreatorId } = useParams();

  const { data, isLoading, isError, error } = useGetRoomDetailsQuery(title);

  const [joined, setJoined] = useState(false);
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user.userInfo);
  const room = useSelector(state => state.rooms.rooms);
  const roomDetail = useSelector(state => state.room.roomInfo);

  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [isLoading2, setisLoading2] = useState(false)
  const ref = useRef(null);
  const dpref = useRef(null)
  const navigate = useNavigate();
  const isSkelton = useSelector((state) => state.skelton.value);
  const [disVal, setdisVal] = useState("post")
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);  //testing
  const [hasMore2, setHasMore2] = useState(true); 
  const isOwner = (CreatorId === userData?.userID && joined);
  const [showAddMem, setShowAddMem] = useState(false);
  const [privateRoom, setPrivateRoom] = useState(true);
  const dropdownRef = useRef(null);
  const [isOpen, setisOpen] = useState(false);
  const [page2,setPage2] = useState(0);
  
  const onNewRoomPost = useSelector((state)=>state.roomCreatePost.value.onNewRoomPost);
  
  
  
  const [showChangeTitleBox, setBox] = useState(false);
  function handleToggle() {
    setisOpen((isOpen) => !isOpen)
  }

  const [openConfirm, setOpenConfirm] = useState(false)
  const [ifDelete, setifDelete] = useState(false);

  const handleDeleteRoom=(id)=>{
      setOpenConfirm(true)   
  }

  useEffect(() => {
      if(ifDelete){
          deleteRoom()
      }
  }, [ifDelete])


  async function deleteRoom() {



    toast.loading("Processing...");
    try {
      const roomId = roomDetail.id;
      const res = await axios.post(baseAddress + "rooms/leave/" + roomId);

      toast.dismiss();
      toast.success(res?.data?.msg);
      const updatedRooms = [...room].filter(roomObject => roomObject.room.id !== roomId);
      dispatch(setRooms(updatedRooms));
      refresh();
      if (isOwner) navigate('/');
      else setJoined(false);
    }
    catch (e) {
      toast.dismiss();
      toast.error(e?.response?.data?.msg);
    }
  }
  function openPostBtn() {
    dispatch(addRoomTitle(title));
    dispatch(addRoomCreatorId(CreatorId));
    navigate('/create')
  }

  async function joinRoom() {
    try {
      setisLoading2(true)
      const res = await axios.post(`${baseAddress}rooms/join`, {
        title,
        Username: userData?.username
      })
      if (res.status == 200) {
        dispatch(addNewRoom(res?.data?.room));
        refresh();

        toast.success(res?.data.msg);

        setJoined(true);
      }
      else {
        navigate('/');
        toast.success(res?.data?.msg);
      }
      setisLoading2(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data.msg);
      setisLoading2(false);
    }
  }

  async function refresh() {
    dispatch(roomsApi.util.invalidateTags([{ type: 'Room', id: title }]));
  }

  async function onStart() {
    if (isLoading) return;
    setisLoading2(true);
    dispatch(setRoomDetail(data?.room));
    setPrivateRoom(data?.room?.privateRoom);

    setJoined(data?.joined);
    if (data?.joined || !(data?.room?.privateRoom)) {
      setdisVal("post");
    }
    setisLoading2(false);
  }
  useEffect(() => {
    setisLoading2(true);
    onStart();
    setisLoading2(false);
    
  }, [data, title])



  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setisOpen(false);
    }
  };
  useEffect(() => {

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      dispatch(clearRoomPostsInfo());
      dispatch(clearPollInfo());
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  function onNewPost(){
    dispatch(clearRoomPostsInfo())
    dispatch(clearPollInfo())
    //refresh()
  }

  useEffect(()=>{
    if(onNewRoomPost){
      if(onNewRoomPost === 'post')setdisVal("post")
      else setdisVal("poll")
      onNewPost();
    }
  },[onNewRoomPost])

  

  const updateBgImg = async (e) => {
    setLoader1(true);
    const bgImg = e.target.files[0];
    const formData = new FormData();
    if (!bgImg) {
      return;
    }
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
    if (!roomImg) {
      return;
    }
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


  
  

  return (
    <>
    {openConfirm && isOwner && <ConfirmWindow msg={"Are you certain you want to delete this Room? This can't be undone."} setOpenConfirm={setOpenConfirm} setifDelete={setifDelete}/>}
    {openConfirm  && !isOwner && <ConfirmWindow msg={"Are you certain you want to leave this room?"} setOpenConfirm={setOpenConfirm} setifDelete={setifDelete}/>}
      {showAddMem && <AddMemBox setShow={setShowAddMem} id={title} />}
      {showChangeTitleBox && <AddMemBox setShow={setBox} id={roomDetail?.title} update={roomDetail?.title} />}
      <div className="w-full">
        <div className=' flex flex-col  gap-4 w-full  2_sm:gap-6'>
          <div className='border-black border-2 relative shadow-lg bg-gray-200 shadow-slate-300 rounded-2xl  h-36 xs:h-44 sm:h-48 m-4  '>
            <img className=' w-full h-full object-cover rounded-2xl' src={roomDetail?.bgImg || banner} alt="backgroudImage" />
            {(isOwner) &&
              <button onClick={() => ref.current?.click()}
                className="absolute flex text-sm font-bold bottom-2 bg-slate-400 right-2 rounded-full p-1 border-2  hover:bg-gray-600">
                {loader1 ? <SmallLoader /> : <PiCameraPlusLight className=" text-2xl " />}
                <input type="file" onChange={(e) => updateBgImg(e)} name="bgImg" accept="image/*" ref={ref} id="" hidden />
              </button>}
            <div className=' absolute  left-6 sm:left-14 bottom-0 border-4  bg-gray-200 translate-y-1/2  h-32 w-32 xs:h-40 xs:w-40 rounded-full  '>

              {loader2 ? <div className="h-full w-full rounded-full flex items-center justify-center bg-gray-200 "><SmallLoader /></div> : <img className=' h-full w-full object-cover rounded-full' src={roomDetail?.img || roomDp} alt="Image Not Uploaded" />}
              <input onChange={(e) => handleDpUpdate(e)} accept='image/*' ref={dpref} type="file" name="media" id="media" hidden />
              {isOwner && (<button onClick={() => dpref.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>)}

            </div>
          </div>
          <div className=' 1_5md:hidden  flex justify-end mr-6 '><OnclickCard room={true} /></div>


          <div className="flex items-center  justify-end pr-8 gap-2   w-full">
            {
              joined ?
                <div className='flex self-end gap-2 justify-self-end'>
                  <button className="flex items-center gap-2 bg-[#6c712eb7] text-white py-1  xs:py-2 px-2 xxs:px-6 rounded-lg  hover:bg-slate-500"
                    onClick={openPostBtn}
                  >

                    <RiAddBoxLine className=" text-xl" />
                    <span className="text-sm pt-0 mt-0 self-center no-underline">{"Post"}</span>
                  </button>
                  {isOwner && <button className="flex bg-[#6c712eb7] items-center gap-2 text-white py-1 xs:py-2 px-3 rounded-lg self-center hover:bg-slate-500"
                    onClick={() => setShowAddMem(true)}
                  >
                    <BsPersonFillAdd className=" text-xl" />
                  </button>
                  }
                </div>
                :
                <>
                  <button className=" flex items-center gap-2 bg-[#6c712eb7] text-white py-1 xs:py-2 px-6 rounded-lg self-center hover:bg-slate-500"
                    onClick={joinRoom}
                  >

                    <BsHouseAddFill className=" text-xl" />
                    <span className="text-sm pt-0 mt-0 self-center no-underline">{(isLoading || isLoading2) ? <SmoothLoader /> : (privateRoom ? "Send Request" : "Join")}</span>
                  </button>
                </>
            }{!joined ? <></> :
              <div className="relative flex items-center gap-8" ref={dropdownRef} >

                <button onClick={handleToggle} className="flex items-center rounded-full border-2 border-[#656923] text-[#656923] hover:border-white focus:outline-none">
                  <BsThreeDots />
                </button>
                {isOpen && (
                  <div className="absolute right-0 top-10  bg-white rounded-md shadow-lg z-10">
                    <ul className=" bg-[#6c712eb7] rounded-md ">
                      {isOwner ? <>
                        <li className=" text-white rounded-md hover:bg-gray-700">
                          <button onClick={() => handleDeleteRoom()} to={"/"} className="px-4 py-1 flex items-center gap-1 ">
                            <span>Delete</span> <MdDelete />
                          </button>
                        </li>
                        <hr />
                        <li className=" text-white rounded-md hover:bg-gray-700">
                          <button onClick={() => setBox(true)} to={"/"} className="px-4 py-1 flex items-center m-auto gap-3 ">
                            <span className="m-auto text-center ">Title</span> <CiEdit />
                          </button>
                        </li>
                      </> : <>
                        <li className=" text-white hover:bg-grey">
                          <button onClick={() => handleDeleteRoom()} to={"/"} className="px-4 py-1 flex items-center gap-1 ">
                            <span>Leave</span> <MdExitToApp />
                          </button>
                        </li>
                      </>}
                    </ul>

                  </div>
                )}
              </div>}
          </div>
          <div className='flex items-center relative  justify-end pr-8   w-full text-center text-lg xxs:text-2xl xs:text-3xl font-bold'>
            <img className=" w-7 xxs:w-8 xs:w-9 rounded-l-lg " src={q} alt="" /><span className=" overflow-clip line-clamp-1 break-all max-w-[70%] bg-white text-[#6c712ed0] font-ubuntu rounded-r-lg px-1">{roomDetail?.title}</span>
          </div>
        </div>
        <div className='h-[1.5px] bg-gray-800 mt-6'></div>

      </div>
      <div className='flex gap-2 justify-end mx-4 xxs:mx-8 my-6'>
                
                <div className={`flex items-center gap-1 ${disVal === 'post' ? 'bg-[#65692375] ' : 'bg-gray-200'}  rounded-md`}>
                    <input 
                        className='size-4 hidden' 
                        onChange={() => (setdisVal("post"))} 
                        checked={disVal === "post"} 
                        type="radio" 
                        value="post" 
                        name="post_poll" 
                        id="post" 
                    />
                    <label 
                        className={`font-semibold px-3 py-1 font-roboto cursor-pointer ${disVal === 'post' ? 'text-white' : 'text-gray-700'}`} 
                        htmlFor="post">
                        Post
                    </label>
                </div>
                <div className={`flex items-center ${disVal === 'poll' ? 'bg-[#65692375]' : 'bg-gray-200'}  rounded-md`}>
                    <input 
                        className=' hidden' 
                        onChange={() => (setdisVal("poll"))} 
                        checked={disVal === "poll"} 
                        type="radio" 
                        value="poll" 
                        name="post_poll" 
                        id="poll" 
                    />
                    <label 
                        className={`font-semibold px-3 py-1 font-roboto cursor-pointer ${disVal === 'poll' ? 'text-white' : 'text-gray-700'}`} 
                        htmlFor="poll">
                        Poll
                    </label>
                </div>
            </div>
      {
        disVal === "post"?
        <RoomPost title={title} privateRoom={privateRoom} joined={navlink?.joined || joined} data={data}/>
        :
        <RoomPolls title={title} privateRoom={privateRoom} joined={navlink?.joined || joined} data={data}/>
      }
    </>
  )
}

export default Room;

export const RoomPost = ({title,privateRoom,joined,data})=>{

  const hotposts = useSelector((state) => state.roomPosts.hotposts);
  const [hasMore,setHasMore] = useState(true);
  const [isLoading,setisLoading] = useState(false)
  const [page,setPage] = useState(0);
  const dispatch = useDispatch();
  
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const getPost = async (initial) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Previous request canceled due to new topic.');
    }

    const source =axios.CancelToken.source();
    setCancelTokenSource(source);

    setisLoading(true);
    if (!joined && privateRoom) {
      setHasMore(false);
      setisLoading(false);
      dispatch(setRoomPost([]))
      return;
    }
    else {
      if (page == 0 || initial) {
        dispatch(clearRoomPostsInfo())
        setPage(0);
      }
      try {
        // dispatch(setSkeltonLoader())
        const res = await axios.get(`${baseAddress}posts/getPost?title=${title}`, {
          cancelToken: source.token,
          params: {
            offset: initial?0:page,
            limit: 10,
          },
        });

        if (res.status === 200) {
          const fetchedPosts = res.data.posts;

          dispatch(setRoomPost(fetchedPosts));

          if (fetchedPosts.length < 10) {
            setHasMore(false);
          }
          setisLoading(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error(error);
          setHasMore(false);
        }
      }
      
    }
  };
  
  useEffect(()=>{
      dispatch(clearRoomPostsInfo());
      setPage(0);
      setHasMore(true);
      setisLoading(true);
      const timeID = setTimeout(() => {getPost(true)} , 1500);
      return ()=> clearTimeout(timeID);
  },[title,data,joined,privateRoom])

  useEffect(() => {
    if (joined || !privateRoom) 
    {
      if(page>0)getPost();
    }   
  }, [page])

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    
    setPage((prevPage) => prevPage + 10);
  };
  return <div className=' min-h-fit xs:pl-8 sm:pl-16'>
        {privateRoom && !joined ? <ForbiddenPage /> :
          <InfiniteScroll
            dataLength={hotposts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<PollSkelton />}
            endMessage={hotposts.length > 0 ? <p className=' text-center font-semibold p-4'>{"You've reached the end of the page!"}</p> : <p className=' text-center font-semibold p-4'>No posts available to display!</p>}
          >

            <div className="post">
              { 
                (
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
                    inRoom={true}
                    room={data?.room}
                    joined={joined}
                  />
                )
                )
              )}
            </div>
          </InfiniteScroll>
        }
      </div>
}

export const RoomPolls = ({title,privateRoom,joined,data})=>{
  const hotposts = useSelector(state => state.userpoll.polls);
  const [page,setPage] = useState(0);
  const [isLoading,setisLoading] = useState(false)
  const [hasMore,setHasMore] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
    setisLoading(true)
    setPage(0);
    dispatch(clearPollInfo());
    setHasMore(true);
    setTimeout(async() => {
     await getRoomsPolls(joined,privateRoom,dispatch,setPoll,clearPollInfo,isLoading,setHasMore,0,title);
     setisLoading(false)
    }, 500); 
},[title])

  useEffect(() => {
    if (joined || !privateRoom) 
    {
      if(page>0)getRoomsPolls(joined,privateRoom,dispatch,setPoll,clearPollInfo,isLoading,setHasMore,page,title);
    }  
  }, [page])

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage((prevPage) => prevPage + 10);
  };
  return <div className='min-h-fit xs:pl-8 sm:pl-16'>
        {privateRoom && !joined ? <ForbiddenPage /> :
          <InfiniteScroll
            dataLength={hotposts.length}
            next={fetchMoreData}

            hasMore={hasMore}
            loader={<PollSkelton />}
            endMessage={hotposts.length > 0 ? <p className=' text-center font-semibold p-4'>{"You've reached the end of the page!"}</p> : <p className=' text-center font-semibold p-4'>No Polls available to display!</p>}
          >

            <div className="post">
              {(
                hotposts.map((post) => (
                  <Polls 
                  key={post?.id}
                  poll={post} 
                  room={data?.room} 
                  inRoom={true}
                  joined = {joined}

                  />
                )
                )
              )}
            </div>
          </InfiniteScroll>
        }
      </div>
}