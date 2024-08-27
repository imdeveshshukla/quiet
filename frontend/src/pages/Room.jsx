import axios from "axios";
import { useEffect, useRef, useState } from "react";
import baseAddress from "../utils/localhost";
import { Link, Navigate, useAsyncError, useLocation, useNavigate, useParams } from 'react-router-dom'
import bg from '../assets/unnamed.png'
import NotUploaded from '../assets/NotUploaded.jpg'
import { MdFileUpload } from "react-icons/md";
import q from '../assets/q.svg'
import { setRoomDetail, changeBgImg, changeDpImg } from "../redux/roomSlice";
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
import { MdExitToApp } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import banner from '../assets/banner.png'
import { BiEdit } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import roomDp from '../assets/roomdp.jpg'




const Room = function () {
  const location = useLocation();
  const { title, CreatorId } = useParams();

  const { data, isLoading, isError, error } = useGetRoomDetailsQuery(title)

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
  const [isOpen, setisOpen] = useState(false);

  const [showChangeTitleBox, setBox] = useState(false);
  function handleToggle() {
    setisOpen((isOpen) => !isOpen)
  }
  async function deleteRoom() {

    if (!window.confirm("Are you sure?")) {
      setisOpen((isOpen) => !isOpen);
      return
    }


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
    setShowCP(true);
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



  const getPost = async () => {

    // setisLoading(true)

    if (!joined && privateRoom) {
      setHasMore(false);
      dispatch(setHotPost([]))
      return;
    }
    else {
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

    }


  };

  // console.clear();

  async function refresh() {
    dispatch(roomsApi.util.invalidateTags([{ type: 'Room', id: title }]));
    if (joined || !privateRoom) getPost();
  }

  async function onStart() {
    if (isLoading) return;
    setisLoading2(true);
    dispatch(setRoomDetail(data?.room));
    setPrivateRoom(data?.room?.privateRoom);

    setJoined(data?.joined);
    if (joined || !privateRoom) {
      getPost();
      setPage(1);
      setHasMore(true);
    }
    setisLoading2(false);
  }
  useEffect(() => {
    onStart();
    return () => {
      dispatch(clearHotPostsInfo());
    }
  }, [data, title])

  useEffect(() => {
    if (joined || !privateRoom) {
      getPost();
      setPage(1);
      setHasMore(true);
    }
  }, [joined, privateRoom])

  useEffect(() => {
    if (joined || !privateRoom) getPost();
  }, [page])


  function onNewPost() {
    setPage(1);
    setHasMore(true);
    refresh();
  }

  const fetchMoreData = () => {
    if (isLoading || !hasMore) return;
    setPage((prevPage) => prevPage + 1);
  };

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


  return (
    <>
      {showCP && <CreatePost showCP={showCP} onNewPost={onNewPost} setShowCP={setShowCP} roomTitle={title} setPost={setPost} />}
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

          <div className="flex items-center  justify-end pr-8 gap-2   w-full">
            {
              joined ?
                <div className='flex self-end gap-2 justify-self-end'>
                  <button className="flex items-center gap-2 bg-black text-white  xs:py-2 px-2 xxs:px-6 rounded-lg  hover:bg-slate-500"
                    onClick={openPostBtn}
                  >

                    <RiAddBoxLine className=" text-xl" />
                    <span className="text-sm pt-0 mt-0 self-center no-underline">{"Post"}</span>
                  </button>
                  {isOwner && <button className="flex bg-black items-center gap-2 text-white py-1 xs:py-2 px-3 rounded-lg self-center hover:bg-slate-500"
                    onClick={() => setShowAddMem(true)}
                  >
                    <BsPersonFillAdd className=" text-xl" />
                  </button>
                  }
                </div>
                :
                <>
                  <button className=" flex items-center gap-2 bg-black text-white py-1 xs:py-2 px-6 rounded-lg self-center hover:bg-slate-500"
                    onClick={joinRoom}
                  >

                    <BsHouseAddFill className=" text-xl" />
                    <span className="text-sm pt-0 mt-0 self-center no-underline">{(isLoading || isLoading2) ? <SmoothLoader /> : (privateRoom ? "Send Request" : "Join")}</span>
                  </button>
                </>
            }{!joined ? <></> :
              <div className="relative flex items-center gap-8" ref={dropdownRef} >

                <button onClick={handleToggle} className="flex items-center rounded-full border-2 border-black hover:border-white focus:outline-none">
                  <BsThreeDots />
                </button>
                {isOpen && (
                  <div className="absolute right-0 top-10  bg-white rounded-md shadow-lg z-10">
                    <ul className=" bg-black rounded-md ">
                      {isOwner ? <>
                        <li className=" text-white rounded-md hover:bg-gray-700">
                          <button onClick={() => deleteRoom()} to={"/"} className="px-4 py-1 flex items-center gap-1 ">
                            <span>Delete</span> <MdDelete />
                          </button>
                        </li>
                        <hr />
                        <li className=" text-white rounded-md hover:bg-gray-700">
                          <button onClick={() => setBox(true)} to={"/"} className="px-4 py-1 flex items-center m-auto gap-3 ">
                            <span className="m-auto text-center">Title</span> <CiEdit />
                          </button>
                        </li>
                      </> : <>
                        <li className=" text-white hover:bg-grey">
                          <button onClick={() => deleteRoom()} to={"/"} className="px-4 py-1 flex items-center gap-1 ">
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
            <img className=" w-7 xxs:w-8 xs:w-9 rounded-l-lg " src={q} alt="" /><span className=" overflow-clip line-clamp-1 break-all max-w-[70%] bg-white font-ubuntu rounded-r-lg px-1">{roomDetail?.title}</span>
          </div>
        </div>
        <div className='h-[1.5px] bg-gray-800 mt-6'></div>

      </div>


      <div className=' min-h-screen xs:pl-8 sm:pl-16'>
        {privateRoom && !joined ? <ForbiddenPage /> :
          <InfiniteScroll
            dataLength={hotposts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Postskelton />}
            endMessage={hotposts.length > 0 ? <p className=' text-center font-semibold p-4'>{"You've reached the end of the page!"}</p> : <p className=' text-center font-semibold p-4'>No posts available to display!</p>}
          >
            {/* <Hottopic topic={title} dp={dp} bg={bg} /> */}

            <div className=' flex items-center justify-end mx-4 mt-3'>
              <span onClick={() => (refresh())} className=' bg-[#eff1d3] rounded-full p-1'>
                {isSkelton ? <SmallLoader /> : <GrRefresh className=' cursor-pointer text-blue-500 text-xl font-extrabold' />}
              </span>
            </div>

            <div className="post">
              {(hotposts.length == 0 && isSkelton) ? (
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
                    inRoom={true}
                    room={data.room}
                    joined={joined}
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