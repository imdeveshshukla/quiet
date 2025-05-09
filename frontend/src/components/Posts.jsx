import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import dp from "../assets/dummydp.png";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";
import ReadMore, { linkDecorator } from "./ReadMore";
import { clearPostsInfo, deleteHomePost, toggleUpvote } from "../redux/Post";
import baseAddress from "../utils/localhost";
import Linkify from "react-linkify";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import SmoothLoader from "../assets/SmoothLoader";
import { clearHotPostsInfo, deleteHotPostsInfo } from "../redux/Hotposts";
import { decreaseUserPost, toggleUserInfoUpvote } from "../redux/profile";
import { setOnNewPost } from "../redux/onNewPost";
import { deleteUserPost } from "../redux/userposts";
import { decreaseRoomPost } from "../redux/roomSlice";
import ConfirmWindow from "./ConfirmWindow";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

const Posts = ({
  id,
  post,
  title,
  topic,
  body,
  media,
  countComment,
  inRoom,
  room,
  createdAt,
  user,
  profilepost,
  upvotes,
  joined,
  postDetails,
  insideOverView,
  deleteOverPost,
  deletePopularPost,
}) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLogin = useSelector((state) => state.login.value);
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const userRoom = useSelector((state) => state.rooms.rooms);
  const [upvoteNumber, setUpvote] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoteNum, setDownvotenum] = useState(0);
  const [downvote, setDownVote] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [delLoading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const handleToggle = () => {
    setOpen((v) => !v);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const [itemId, setitemId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [ifDelete, setifDelete] = useState(false);

  const handleDeletePost = (id) => {
    setitemId(id);
    setOpenConfirm(true);
  };

  useEffect(() => {
    if (ifDelete) {
      deletePost(itemId);
    }
  }, [ifDelete]);

  async function deletePost(id) {
    // console.log(id);
    setLoading(true);
    try {
      const res = await axios.delete(`${baseAddress}posts/delete`, {
        data: {
          id,
        },
      });
      toast.success(res?.data?.msg);

      //       dispatch(clearHotPostsInfo());
      dispatch(deleteUserPost(id));
      dispatch(deleteHomePost(id));
      if (insideOverView) {
        deleteOverPost(id);
      }
      if (deletePopularPost) {
        deletePopularPost(id);
      }
      dispatch(decreaseUserPost());
      //       dispatch(clearPostsInfo());
      if (inRoom) {
        dispatch(deleteHotPostsInfo(id));
        dispatch(decreaseRoomPost());
      }
      // Navigate('/')
      // console.log(res);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.msg);
    }
    setLoading(false);
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const getUpvote = async () => {
      const upvoteArr = await upvotes?.filter(
        (vote) => vote.upvotes == 1 && vote.commentId == null
      );
      const downvoteArr = await upvotes?.filter(
        (vote) => vote.upvotes == -1 && vote.commentId == null
      );

      setUpvote(upvoteArr?.length);
      setDownvotenum(downvoteArr?.length);

      if (await upvoteArr?.find((vote) => vote.userId == userInfo?.userID)) {
        setUpvoted(true);
      }
      if (await downvoteArr?.find((vote) => vote.userId == userInfo?.userID)) {
        setDownVote(true);
      }
    };
    getUpvote();
  }, [upvotes, userInfo?.userID]);

  const handleComment = async (id) => {
    if (inRoom) {
      if (!joined) {
        toast.error("First Join The Room");
        return;
      }
    }
    if (!location.pathname.includes("/post/") && id) {
      if (inRoom) Navigate(`/post/${room.id}/${id}`);
      else Navigate(`/post/${id}`);
    }
  };

  const upvote = async (key) => {
    if (inRoom) {
      let res = userRoom.some((e) => e.room.title == room.title);
      if (!res) {
        toast.error("First Join The Room");
        return;
      }
    }
    if (isLogin) {
      let val = 1;
      if (!upvoted) {
        setUpvoted(true);
        if (insideOverView) {
          dispatch(toggleUserInfoUpvote(1));
        }
        if (downvote) setDownvotenum((val) => val - 1);
        setDownVote(false);
        val = 1;
        setUpvote((upvoteNumber) => upvoteNumber + 1);
      } else {
        setUpvoted(false);
        if (insideOverView) {
          dispatch(toggleUserInfoUpvote(-1));
        }
        val = 0;
        setUpvote((upvoteNumber) => upvoteNumber - 1);
      }

      try {
        const res = await axios.post(baseAddress + "posts/vote", {
          postId: key,
          val,
          commentId: null,
        });
        if (res.status == 201) {
          const data = res.data.newUpvote;
          if (val == 1 && data.userId != data.post.userId) {
            sendNotification({
              postId: data.postId,
              toUser: data.post.userId,
              fromUser: data.userId,
              title: "upvoted your post!",
            });
          }
          if (postDetails) dispatch(clearPostsInfo());
          dispatch(toggleUpvote(data));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.dismiss();
      toast.error("Sign In First");
    }
  };

  const downVoteFunc = async (key) => {
    if (inRoom) {
      let res = userRoom.some((e) => e.room.title == room.title);
      if (!res) {
        toast.error("First Join The Room");
        return;
      }
    }
    if (!isLogin) {
      toast.dismiss();
      toast.error("Sign In First");
      return;
    }
    let val = -1;
    if (!downvote) {
      setDownVote(true);
      if (upvoted) {
        if (insideOverView) {
          dispatch(toggleUserInfoUpvote(-1));
        }
        setUpvote((val) => val - 1);
        setUpvoted(false);
      }
      val = -1;
      setDownvotenum((downvote) => downvote + 1);
    } else {
      setDownVote(false);
      val = 0;
      setDownvotenum((upvoteNumber) => upvoteNumber - 1);
    }

    try {
      const res = await axios.post(baseAddress + "posts/vote", {
        postId: key,
        val,
        commentId: null,
      });
      if (res.status == 201) {
        const data = res.data.newUpvote;
        if (val == -1 && data.userId != data.post.userId) {
          sendNotification({
            postId: data.postId,
            toUser: data.post.userId,
            fromUser: data.userId,
            title: "downvoted your post!",
          });
        }
        if (postDetails) dispatch(clearPostsInfo());

        dispatch(toggleUpvote(data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const shareFunction = async (id, room) => {
    if (inRoom) {
      if (!joined) {
        toast.error("First Join The Room");
        return;
      }
      console.log(room);
      console.log("Clicked Share Button inside room");
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${user?.username}'s latest post on our site!`,
          url: `${window.location.origin}/post/${id}`,
        });
      } catch (error) {
        console.error("Error in post sharing", error);
      }
    } else {
      navigator.clipboard
        .writeText(
          inRoom
            ? `${window.location.origin}/post/${id}/`
            : `${window.location.origin}/post/${id}`
        )
        .then(() => {
          alert("Post link copied to clipboard");
        })
        .catch((error) => {
          console.error("Error in Post copying link to clipboard", error);
        });
    }
  };

  const [imageDimensions, setImageDimensions] = useState([]);
  const showControls = media.length > 1;
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Handle image loading to capture the natural dimensions of each image
  const handleImageLoad = (event, index) => {
    const { naturalWidth, naturalHeight } = event.target;
    const updatedDimensions = [...imageDimensions];
    updatedDimensions[index] = {
      width: naturalWidth,
      height: naturalHeight,
      aspectRatio: naturalWidth / naturalHeight,
    };
    setImageDimensions(updatedDimensions);
  };

  return (
    <>
      {openConfirm && (
        <ConfirmWindow
          msg={
            "Are you certain you want to delete this post? This can't be undone."
          }
          setOpenConfirm={setOpenConfirm}
          setifDelete={setifDelete}
        />
      )}
      <div className="px-4 py-2 xxs:px-8 xxs:py-4 border-2 border-[#f9ff86] rounded-2xl animate-glow m-4 xxs:m-8">
        <header className="flex gap-2 items-center my-2">
          <img
            onClick={() => Navigate(`/u/${user?.username}`)}
            src={user && user.dp ? user.dp : dp}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer bg-white"
          />
          <div className=" flex flex-wrap gap-1 xs:gap-2 md:gap-4 items-center">
            <span
              onClick={() => Navigate(`/u/${user?.username}`)}
              className="font-semibold cursor-pointer hover:text-green-900"
            >
              u/{user?.username}
            </span>
            •
            {(inRoom && (
              <>
                <span
                  onClick={() =>
                    Navigate(`/room/${room?.CreatorId}/${room?.title}`)
                  }
                  className=" cursor-pointer hover:text-rose-900 text-sm font-semibold"
                >
                  q/{room?.title}
                </span>{" "}
                <span>•</span>
              </>
            )) ||
              (topic && (
                <>
                  <span
                    onClick={() => Navigate(`/q/${topic}`)}
                    className=" cursor-pointer hover:text-rose-900 text-sm font-semibold"
                  >
                    q/{topic}
                  </span>{" "}
                  <span>•</span>
                </>
              ))}
            <span className="text-xs text-gray-700">{`${getTime(
              createdAt
            )} ago`}</span>
          </div>
          {user?.username === userInfo?.username ? (
            <div
              className="relative flex items-center gap-8 ml-auto"
              ref={dropdownRef}
            >
              <button
                onClick={handleToggle}
                className="flex items-center hover:focus:outline-none"
              >
                {delLoading ? <SmoothLoader /> : <BsThreeDotsVertical />}
              </button>
              {isOpen && (
                <div className="absolute right-1 bottom-6  bg-white rounded-md shadow-lg z-10">
                  <ul className=" bg-[#6d712eb8] rounded-md ">
                    <li className=" text-white hover:text-black">
                      <button
                        onClick={() => handleDeletePost(id)}
                        className="px-4 py-1 flex items-center gap-1 "
                      >
                        {
                          <>
                            <span>Delete</span> <MdDelete />
                          </>
                        }
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </header>
        <main className="">
          <div
            className="text-lg font-sans font-bold my-2 whitespace-pre-wrap break-words overflow-clip "
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              lineHeight: "1.3em",
              wordBreak: "break-word",
            }}
          >
            <Linkify componentDecorator={linkDecorator}>{title}</Linkify>
          </div>

          <div className={` my-2 font-sans whitespace-pre-wrap break-words`}>
            <ReadMore children={body} maxLines={media ? 2 : 10} />
          </div>

          {media && (
            <>
            <div className="relative" style={{ width: "100%", margin: "0 auto" }}>
      <Carousel
        animation="slide" // Slide animation
        autoPlay={false} // Disable autoplay
        indicators={showControls} // Show indicators only if there are multiple images
        navButtonsAlwaysVisible={isDesktop && showControls} 
        navButtonsProps={{
          style: {
            // Style the nav buttons to be vertically centered
            top: "calc(50% - 20px)",
            transform: "translateY(-50%)",
          },
        }}
        indicatorContainerProps={{
          style: {
            position: "relative", // Keep indicators relative to the carousel
           
            zIndex: 2, // Ensure the dots are visible
            display: "flex", // Ensure it's visible and properly aligned
            justifyContent: "center", // Center the dots
            width: "100%", // Take full width for better visibility
          },
        }}
        indicatorProps={{
          style: {
            color: "rgba(0, 0, 0, 0.5)", // Inactive color
          },
        }}
        activeIndicatorProps={{
          style: {
            color: "#ffffff", // Active dot color (white for better visibility)
          },
        }}
        sx={{
          position: "relative", // Ensures proper positioning of the indicators
        }}
      >
        {media.map((img, index) => (
          <Paper
            key={index}
            style={{
              width: "100%",
              minHeight: "420px", // Ensures the carousel has a minimum height during image loading
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:"#c9cbad",
            }}
          >
            <img
              className="xxxs:w-screen xs:w-full py-2"
              src={img}
              alt={`Slide ${index}`}
              onLoad={(e) => handleImageLoad(e, index)}
              style={{
                width: imageDimensions[index]?.width ? "auto" : "100%",
                height: imageDimensions[index]?.height ? "auto" : "100%",
                objectFit: "contain", // Adjusts to maintain aspect ratio
                maxWidth: "100%",
                maxHeight: "420px", // Limit the height for better layout handling
              }}
            />
          </Paper>
        ))}
      </Carousel>
    </div>
            </>
          )}
        </main>
        <footer className="flex py-2 gap-5 xxs:gap-6">
          <div
            className={
              upvoted
                ? "rounded-3xl flex gap-1 items-start justify-center p-2 bg-green-600 text-white"
                : downvote
                ? "rounded-3xl flex gap-1 items-start justify-center p-2 bg-red-600 text-white"
                : "rounded-3xl flex gap-1 items-start justify-center p-2 bg-zinc-400 text-black"
            }
          >
            <BiUpvote
              onClick={() => upvote(id)}
              className={
                upvoted
                  ? "text-2xl hover:text-neutral-950 text-green-900 cursor-pointer"
                  : "text-2xl hover:text-green-700 cursor-pointer"
              }
            />
            <span>{upvoteNumber}</span>
            <BiDownvote
              onClick={() => downVoteFunc(id)}
              className={
                downvote
                  ? "text-2xl hover:text-neutral-950 text-red-900 cursor-pointer"
                  : "text-2xl hover:text-red-700 cursor-pointer"
              }
            />
            <span>{downvoteNum}</span>
          </div>
          <div
            onClick={() => handleComment(id)}
            className="rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-blue-300"
          >
            <GoComment className="text-2xl" />
            <span>{countComment ? countComment : 0}</span>
          </div>
          {!room?.privateRoom ? (
            <div
              onClick={() => shareFunction(id, room)}
              className="rounded-3xl flex gap-2 items-start justify-center p-2 bg-amber-100 hover:text-amber-500 cursor-pointer"
            >
              <RiShareForwardLine className="text-2xl" />
              <span>Share</span>
            </div>
          ) : (
            <></>
          )}
        </footer>
      </div>

      <div className="ml-4 xs:ml-0 bg-gray-700 h-[1px] mr-4"></div>
    </>
  );
};

export default Posts;

export const getTime = (createdAt) => {
  const postDate = new Date(createdAt).getTime();
  const crrTime = new Date().getTime();

  let sec = Math.floor((crrTime - postDate) / 1000);
  let min = Math.floor(sec / 60);
  let hours = Math.floor(sec / 3600);
  let day = Math.floor(sec / (60 * 60 * 24));
  let month = Math.floor(sec / (60 * 60 * 24 * 30));
  let years = Math.floor(sec / (60 * 60 * 24 * 30 * 12));
  const ans =
    years > 0
      ? years + " year"
      : month > 0
      ? month + " month"
      : day > 0
      ? day + " days"
      : hours > 0
      ? hours + " hours"
      : min > 0
      ? min + " minutes"
      : sec > 0
      ? sec + " seconds"
      : 0 + " seconds";

  return ans;
};

export const sendNotification = async ({
  postId,
  toUser,
  fromUser,
  title,
  body,
}) => {
  try {
    const res = await axios.post(baseAddress + "u/sendnotification", {
      postId,
      toUser,
      fromUser,
      title,
      body,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const openUserProfile = () => {};
