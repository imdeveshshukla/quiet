import { useRef, useState, useEffect } from "react";
import { GrGallery } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import SmallLoader from "../components/SmallLoader";
import toast from "react-hot-toast";
import baseAddress from "../utils/localhost";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import imageCompression from "browser-image-compression";
import { setPost } from "../redux/Post";
import { setOnNewPost } from "../redux/onNewPost";

axios.defaults.withCredentials = true;

const CreatePost = () => {
  const createPostRef = useRef(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [Btnloading, setLoading] = useState(false);
  const [mediaLoading, setmediaLoading] = useState(false);
  const [disable, setdisable] = useState(false);
  const location = useLocation();
  const selectFile = useRef(null);
  const { roomTitle, roomCreatorId } = useOutletContext();
  const [selectedOption, setSelectedOption] = useState("");
  const [error, seterror] = useState("");
  const titleLimit = 300;
  const [titleLen, setTitleLen] = useState(0);
  const dispatch = useDispatch();

  // console.log("Inside CreatePost");
  // console.log(roomTitle," ",roomCreatorId);
  const handleTitleChange = (e) => {
    let input = String(e.target.value).slice(0, 300);
    seterror("");
    setTitle(input);
    setTitleLen(input.length);
  };

  const handleChange = async (e) => {
    console.log(Array.from(e.target.files));
    setdisable(false);
    setmediaLoading(false);
    let temp = Array.from(e.target.files);
    if (temp.length == 0) return;
    
    setmediaLoading(true);
    setdisable(true);
    for (let i=0;i<temp.length;i++) {
      console.log(temp[i]);
      if (temp[i].size <= 3 * 1024 * 1024) {
        // File size is less than or equal to 3MB, no need to compress
        continue;
      } else {
        // Compression options
        const options = {
          maxSizeMB: 3,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(temp[i], options);
          temp[i]= compressedFile;
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }
    }
    setImage(temp)
    setmediaLoading(false);
    setdisable(false);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    // console.log(title + "\n" + description + "\n" + selectedOption);

    if (description.length == 0) {
      seterror("*Description cannot be empty");
      return;
    }
    const formData = new FormData();
    try {
      formData.append("title", title);
      formData.append("topic", selectedOption);
      formData.append("body", description);
      for (let i = 0; i < image.length; i++) {
        formData.append("postImg", image[i]);
        console.log(image[i]);
      }

      if (roomTitle) formData.append("subCommunity", roomTitle);

      console.log(formData.getAll("postImg"));
      setLoading(true);
      toast.loading("Posting....");
      const response = await axios.post(
        `${baseAddress}posts/postWithImg`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (setPost) {
        setPost(response.data.post);
      }
      if (response.status == 201) {
        toast.dismiss();
        toast.success("Successfully Posted!");

        setTitle("");
        setDescription("");
        setSelectedOption("");
        setImage(null);
        if (!roomTitle) {
          dispatch(setOnNewPost(true));
          navigate("/");
        } else {
          dispatch(setOnNewRoomPost("post"));
          navigate(`/room/${roomCreatorId}/${roomTitle}`);
        }
      }
    } catch (error) {
      toast.dismiss();
      // setShowCP(false);
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data.msg || "Fails To Post");
    }
    setLoading(false);
  };

  return (
    <div className=" relative h-[90%]  overflow-auto">
      <div className="heading flex justify-between ">
        <h2 className="text-xl font-bold mb-2 text-[#656923]">
          Write your thoughts....
        </h2>
      </div>
      {!roomTitle ? (
        <div className="flex mt-2 px-28 justify-start  ">
          <div className="flex  hover:bg-[#808449cf]  items-center px-2 py-1  rounded-full border-[1px] border-black ">
            <span className=" rounded-full border-2 border-white">
              <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="15" fill="black" />
                <text
                  x="50%"
                  y="50%"
                  fontSize="18"
                  textAnchor="middle"
                  fill="white"
                  fontFamily="Arial, sans-serif"
                  dominantBaseline="middle"
                >
                  q/
                </text>
              </svg>
            </span>
            <select
              className=" cursor-pointer bg-transparent  px-2 sm:px-4   outline-none"
              id="options"
              value={selectedOption}
              onChange={(e) => handleSelectChange(e)}
            >
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value=""
              >
                Select a Topic
              </option>
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value="sports"
              >
                Sports
              </option>
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value="dsa"
              >
                DSA
              </option>
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value="iet"
              >
                IET
              </option>
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value="entertainment"
              >
                Entertainment
              </option>
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value="lifestyle"
              >
                Lifestyle
              </option>
              <option
                className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                value="lucknow"
              >
                Lucknow
              </option>
            </select>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Title Input */}
      <div className="mb-4 flex flex-col ">
        <div className=" flex items-center justify-between">
          <label
            htmlFor="title"
            className="block text-[#656923] font-bold mb-2"
          >
            Title
          </label>
          <div className=" text-xs font-mono">
            {titleLen}/{titleLimit}
          </div>
        </div>
        <textarea
          spellCheck="false"
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e)}
          className="w-full p-2 resize-none border h-20 border-gray-300 rounded-md focus:outline-none focus:border-[#656923]"
          placeholder="Write a Specific title"
        />
      </div>
      {/* Content Textarea */}
      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="content"
          className="block text-[#656923] font-bold mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          spellCheck="false"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            seterror("");
          }}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#656923] h-40 resize-none"
          placeholder="Keep It Relevant"
        />

        <span className=" text-red-500 text-xs pl-2">{error}</span>
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block text-[#656923] font-bold mb-1">
          Image
        </label>
        
        <div className=" flex flex-col  mb-2">
          {image.map((img) => (
            <div key={img.name} className=" text-sm flex flex-col text-blue-900 line-clamp-1 ml-2 break-words underline cursor-not-allowed">
              {img.name}
            </div>
          ))}
        </div>

        <div className=" flex items-center gap-2 ">
          <button
            disabled={disable}
            onClick={() => selectFile.current?.click()}
            className={` ${
              disable && " cursor-wait"
            } flex items-center gap-2 border-2 text-blue-800 rounded-3xl border-blue-800 px-3 py-1 bg bg-blue-300 hover:bg-blue-400`}
            type="button"
          >
            <span>Upload</span>
            <GrGallery />
          </button>
          {mediaLoading && <SmallLoader />}
        </div>
        <input
          onChange={(e) => handleChange(e)}
          accept="image/*"
          multiple
          ref={selectFile}
          type="file"
          name="media"
          id="media"
          hidden
        />
      </div>
      {/* Submit Button */}

      <button
        disabled={disable}
        onClick={() => handleSubmit()}
        className={`${
          disable && "bg-[#666923bd] cursor-wait"
        } bg-[#656923] flex justify-center hover:bg-[#a9aa88] w-full text-xl text-black font-bold py-2 px-4 rounded focus:outline-none`}
      >
        {Btnloading ? (
          <span className="">
            <SmallLoader />
          </span>
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
};

export default CreatePost;

export const CreatePostorPoll = () => {
  const createRef = useRef();
  const Navigate = useNavigate();
  const location = useLocation();
  const { roomTitle, roomCreatorId } = useSelector(
    (state) => state.roomCreatePost.value
  );
  const currentPath = location.pathname.split("/").pop();

  const handleClickOutside = (event) => {
    if (createRef.current && !createRef.current.contains(event.target)) {
      // console.log("Clicked OutSide ",roomTitle)
      if (!roomTitle) Navigate("/");
      else Navigate(`/room/${roomCreatorId}/${roomTitle}`);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentPath === "create") {
      Navigate("post", { replace: true });
    }
  }, [currentPath, Navigate]);

  return (
    <>
      <div className="fixed z-40 bg-[#0005] top-0 left-0 backdrop-blur-sm min-h-screen min-w-full ">
        <div
          ref={createRef}
          className=" h-[90%] absolute w-[95%] xxs:w-[85%] xs:w-[75%] sm:w-[60%] md:w-[50%] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%]  bg-[#d5d6b5] shadow-md shadow-current rounded-lg px-6 pb-2 "
        >
          <button
            className=" fixed right-1 top-1 flex items-center justify-center z-auto  w-5 h-5 rounded-full"
            onClick={() =>
              roomTitle
                ? Navigate(`/room/${roomCreatorId}/${roomTitle}`)
                : Navigate("/")
            }
          >
            <IoClose className="text-[#404214] hover:text-red-600 text-2xl" />
          </button>
          <div className=" grid grid-cols-2  items-center mb-2 ">
            <NavLink
              to="post"
              className={(e) =>
                ` ${
                  e.isActive &&
                  " bg-[#8e913c75] border-[#626424] border-b-4 rounded-b-xl"
                }  flex py-1 justify-center font-bold items-center   `
              }
            >
              Post
            </NavLink>
            <NavLink
              to="poll"
              className={(e) =>
                ` ${
                  e.isActive &&
                  " bg-[#8e913c75] border-[#626424] border-b-4 rounded-b-xl"
                }  flex py-1 justify-center font-bold items-center   `
              }
            >
              Poll
            </NavLink>
          </div>

          <Outlet context={{ roomTitle, roomCreatorId }} />
        </div>
      </div>
    </>
  );
};

import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPlusSquareDotted } from "react-icons/bs";
import { setOnNewRoomPost } from "../redux/RoomCreatePosts";

export const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setloading] = useState(false);
  const titleLimit = 150;
  const [titleLen, setTitleLen] = useState(0);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { roomTitle, roomCreatorId } = useOutletContext();
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTitleChange = (e) => {
    let input = String(e.target.value).slice(0, 150);

    setTitle(input);
    setTitleLen(input.length);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  const handleAddOption = () => {
    if (options.length == 7) {
      toast("Options_Limit_Reached", {
        icon: "ℹ️",
      });
      return;
    }
    setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    const poll = {
      title,
      options: options.filter((option) => option.trim() !== ""),
    };
    try {
      const res = await axios.post(`${baseAddress}poll/createpoll`, {
        title: poll.title,
        options: poll.options,
        topic: selectedOption,
        subCommunity: roomTitle,
      });

      if (res.status == 200) {
        setTitle("");
        setOptions(["", ""]);
        dispatch(setOnNewPost(true));
        if (!roomTitle) Navigate("/");
        else {
          dispatch(setOnNewRoomPost("poll"));
          Navigate(`/room/${roomCreatorId}/${roomTitle}`);
        }
      }
    } catch (error) {}

    setloading(false);
  };

  return (
    <div className=" relative h-[90%] overflow-auto">
      <h2 className="text-xl font-bold mb-2 text-[#656923]">Create Poll....</h2>
      <form onSubmit={handleSubmit} className=" flex flex-col ">
        {!roomTitle ? (
          <div className="flex mt-2 px-28 justify-start  ">
            <div className="flex  hover:bg-[#808449cf]  items-center px-2 py-1  rounded-full border-[1px] border-black ">
              <span className=" rounded-full border-2 border-white">
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="15" fill="black" />
                  <text
                    x="50%"
                    y="50%"
                    fontSize="18"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="Arial, sans-serif"
                    dominantBaseline="middle"
                  >
                    q/
                  </text>
                </svg>
              </span>
              <select
                className=" cursor-pointer bg-transparent  px-2 sm:px-4   outline-none"
                id="options"
                value={selectedOption}
                onChange={(e) => handleSelectChange(e)}
              >
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value=""
                >
                  Select a Topic
                </option>
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value="sports"
                >
                  Sports
                </option>
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value="dsa"
                >
                  DSA
                </option>
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value="iet"
                >
                  IET
                </option>
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value="entertainment"
                >
                  Entertainment
                </option>
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value="lifestyle"
                >
                  Lifestyle
                </option>
                <option
                  className="bg-[#808449] text-white font-extralight  1_5md:text-lg"
                  value="lucknow"
                >
                  Lucknow
                </option>
              </select>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div>
          <div>
            <div className=" flex items-center justify-between">
              <label
                htmlFor="title"
                className="block text-[#656923] font-bold mb-2"
              >
                Title
              </label>
              <div className=" text-xs font-mono">
                {titleLen}/{titleLimit}
              </div>
            </div>

            <textarea
              spellCheck="false"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e)}
              className="w-full p-2 resize-none border h-20 border-gray-300 rounded-md focus:outline-none focus:border-[#656923]"
              placeholder="Write a Specific title"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  spellCheck="false"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 outline-none focus:border-[#656923] rounded-md"
                  placeholder={`Option ${index + 1}`}
                />
                {index > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setOptions(options.filter((_, i) => i !== index))
                    }
                    className="ml-2 text-red-700"
                  >
                    <RiDeleteBin6Line />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <button
            disabled={loading}
            type="button"
            onClick={handleAddOption}
            className="mt-2 px-4 py-2 flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white rounded-md"
          >
            <BsPlusSquareDotted /> <span>Option</span>
          </button>
          <button
            disabled={loading}
            type="submit"
            className={` ${
              loading && " cursor-wait bg-[#4e5024]"
            } bg-[#656923] flex justify-center mt-2 hover:bg-[#a9aa88] w-full text-xl text-black font-bold py-2 px-4 rounded focus:outline-none`}
          >
            {loading ? <SmallLoader /> : <span>Create Poll</span>}
          </button>
        </div>
      </form>
    </div>
  );
};
