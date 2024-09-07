import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import SmoothLoader from "../assets/SmoothLoader";
import axios from "axios";
import baseAddress from "../utils/localhost";
import toast from "react-hot-toast";
import dp from '../assets/dummydp.png'
import { useDebounce } from '../hooks/useDebounce';
import { fetchUsers } from "./Search";
import { v4 as uuidv4 } from "uuid";
import { changeTitle } from "../redux/roomSlice";
import { clearRooms, updateRoomDetail } from "../redux/userRooms";
import { useNavigate } from "react-router-dom";
import { setDate } from "date-fns";
import SmallLoader from "./SmallLoader";



export default function AddMemBox({ setShow, id, update }) {
  const createPostRef = useRef(null);
  const [title, setTitle] = useState('');
  const [fetching, setFetching] = useState(false);
  const [Btnloading, setLoading] = useState(false);
  const [color, setColor] = useState("black");
  const userData = useSelector(state => state.user.userInfo);
  const [error, setError] = useState('');
  const [titleRequired, setTitleRequired] = useState(true);
  const debouncedSearch = useDebounce(title, 500);

  const [users, setUsers] = useState([]);
  const [menu, setMenu] = useState(false);
  const [canSend, setCanSend] = useState(false)
  const dispatch = useDispatch();
  const nav = useNavigate();



  async function sendReq() {
    const title2 = debouncedSearch.trim();
    if (title2.length < 3) {
      setColor("red")
      setError("*Required length is 3")
      setTitleRequired(true)
      return;
    }

    if (containsWhitespace(title2)) {
      setError("*Name cannot include spaces.");
      setColor("red")
      setTitleRequired(true);
      return
    }
    setFetching(true)

    const res = await axios.get(baseAddress + "rooms/titleNameIsUnique?filter=" + title2);

    if (res.data.msg == true) {
      setColor("green");
      setError(` Room name is available`)
      setTitleRequired(false);
    }
    else {
      setColor("red");
      setError(`Sorry ${title} is not available`);
      setTitleRequired(true);
    }
    setFetching(false)
    return res.data;

  }
  const containsWhitespace = str => /\s/.test(str);
  // useEffect(() => {
  //   if (title.length == 0) {
  //     setError("Username required!")
  //     setTitleRequired(true);
  //     setColor("red");
  //   }
  //   else if (!update && title === userData?.username) {
  //     setError("Don't Add Yourself in this room");
  //     setTitleRequired(true);
  //     setColor("red");
  //   }
  //   else if (update && update === title) {
  //     setTitleRequired(true);
  //     setColor("red");
  //     setError("Current Room Name!");
  //   }
  //   else if (update && title.length < 3) {
  //     setTitleRequired(true);
  //     setColor("red");
  //     setError("Title Length Should be greater than 3!");
  //   }
  //   else if (update && containsWhitespace(title)) {
  //     setTitleRequired(true);
  //     setColor('red');
  //     setError("Title should not contain spaces!!");
  //   }
  //   else if (update && update === title) {
  //     setError("Previous Name");
  //     setTitleRequired(true);
  //     setColor("red");
  //   }
  //   else {
  //     setError("");
  //     setColor("black");
  //     setTitleRequired(false);
  //     if (update) customDebouncer(sendReq, 500);
  //   }
  // }, [title])

  const updateRoomTitle = async () => {

    setLoading(true);
    try {
      const res = await axios.post(`${baseAddress}rooms/update`, {
        title: id,
        newTitle: debouncedSearch
      })
      toast.success(res.data.msg);
      dispatch(changeTitle(res.data.updatedRoom.title));
      dispatch(updateRoomDetail(res.data.updatedRoom));
      setShow(false)
      // nav(`/room/${res.data.updatedRoom.CreatorId}/${res.data.updatedRoom.title}`);
    }
    catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.response.data.msg);
    }
    setLoading(false);
  }
  const handleSubmit = async () => {
    // console.log(canSend);

    if (!canSend) return;
    // console.log(id+" "+title);
    setLoading(true);
    try {
      const res = await axios.post(`${baseAddress}rooms/addUserinRoom/${title}`, {
        title: id
      });
      
      // console.log(res);
      const msg = res?.data.msg;
      // console.log(msg);
      if (res.status == 201) {
        toast.success("Successfully Send Request");
      }
      else {
        toast.error(msg);
      }
      setShow(false);
      setLoading(false);
    }
    catch (err) {
      toast.error(`${err.message}`);
      setShow(false);
      setLoading(false);
    }
  }
  // let timeout;
  // var customDebouncer = function (func, delay) {
  //   clearTimeout(timeout);

  //   timeout = setTimeout(func, delay);
  // };
  const handleClickOutside = (event) => {
    if (createPostRef.current && !createPostRef.current.contains(event.target)) {
      setShow(false)
    }
  };

  useEffect(() => {

    const fetchData = async () => {

      if (debouncedSearch) {
        if (update) {
          await sendReq();
        } else {
          setFetching(true);
          const res= await fetchUsers({ debouncedSearch, setUsers });
          if( res.length==0){
            setError("No matching users found.")
            setColor("red")
          }else{
            setError("")
            
          }
          setFetching(false)
        }
      } else {
        setUsers([])
        setTitle("");
        setError("");
        setTitleRequired(true)
      }
    }
    fetchData()

  }, [debouncedSearch]);


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleClick = (val) => {
    setCanSend(true);
    setMenu(false);
    setTitle(val);
    setTitleRequired(false)
  }

  const handleChange = (e) => {
    setTitle(e.target.value);
    setError('')
    setCanSend(false);
    setTitleRequired(true)
  }
  const titleLimit = 25;
  const [titleLen, setTitleLen] = useState(0);
  const handleTitleChange = (e) => {
    let input = String(e.target.value).slice(0, 25);
    setTitle(input)
    setTitleLen((input.length))
  }

  return (
    <div className="fixed z-40 bg-[#0005] top-0 left-0 backdrop-blur-sm min-h-screen min-w-full  pb-10">
      <div ref={createPostRef} className=" absolute w-[85%] xs:w-[75%] sm:w-[60%] md:w-[50%] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] overflow-auto bg-[#d5d6b5] shadow-md shadow-current rounded-lg px-6 py-5 ">
        <div className="heading flex justify-between">
          <h2 className="text-xl font-bold mb-4 text-[#656923]">{update ? "Update Room Title" : "Add Member"}</h2>
          <button className="hover:bg-black w-5 h-5 rounded-full" onClick={() => { setShow(false) }}>
            <IoClose className="text-[#656923] m-auto" />
          </button>
        </div>



        {/* Title Input */}
        <div className="mb-4 relative min-h-[20vh] ">
          <div className="mb-5 flex flex-col gap-1">
            {update ?
              <>
                <div className="flex items-center justify-between">
                  <label htmlFor="title-success"
                    className={`block mb-2 text-sm font-medium text-[#656923]`}>Title<span className="text-red-600">*</span></label>
                  <div className=" text-xs font-mono">{titleLen}/{titleLimit}</div>

                </div>
                <div className=" relative">
                  <input
                    spellCheck="false"
                    type="text"

                    className={`font-bold outline-none border border-${color}-500 text-${color}-900 placeholder-${color}-700 text-sm rounded-lg focus:ring-${color}-900 focus:border-${color}-500 block w-full p-3 `}
                    placeholder="New Room Name"
                    value={title}
                    onChange={(e) => handleTitleChange(e)} />
                  <div className="absolute top-1/2 -translate-y-1/2  right-2">
                    {fetching ? <SmoothLoader /> : <></>}
                  </div>
                </div>
                <p className={`text-${color}-500 text-sm w-full break-all`}>{error}</p>
              </>
              : <><label htmlFor="username-success"
                className={`block mb-2 text-sm font-medium text-[#656923]`}
              >UserName<span className="text-red-600">*</span></label>
              <div className=" relative">

                <input spellCheck="false" onClick={() => setMenu(true)} type="text"
                  className={`bg-${color}-50 border outline-none border-${color}-500 text-${color}-900 placeholder-${color}-700 text-sm rounded-lg focus:ring-${color}-500 focus:border-${color}-500 block w-full p-3 `}
                  placeholder={userData?.username}
                  value={title}
                  onChange={(e) => handleChange(e)} />
                  <div className="absolute top-1/2 -translate-y-1/2  right-2">
                    {fetching ? <SmoothLoader /> : <></>}
                  </div>
                  </div>
                <p className={`text-${color}-500 text-sm w-full break-all`}>{error}</p>

              </>
            }

            {menu && <div className='my-2   mx-16 flex gap-2 flex-col'>
              {users.map(user => {
                return <div key={uuidv4()} onClick={() => handleClick(user.username)} className=' bg-[#bbbd99] flex items-center gap-4 cursor-pointer hover:bg-[#b9c19e] rounded-lg py-2 px-4'>
                  <img
                    src={user.dp ? user.dp : dp}
                    alt="Profile"
                    className="w-8 h-8 rounded-full   bg-white"
                  />
                  <span className=' text-sm font-semibold overflow-clip'>u/{user.username}</span>
                </div>

              })}
            </div>}

          </div>

        </div>

        {/* Submit Button */}

        <button
          onClick={update ? updateRoomTitle : handleSubmit}
          className={titleRequired ? "bg-[#656923] w-32 1_5md:w-48 text-sm text-black font-bold py-2 px-4 rounded focus:outline-none cursor-not-allowed" : "bg-[#656923] hover:bg-[#a9aa88] w-48 text-sm text-black font-bold py-2 px-4 rounded focus:outline-none"}>
          {Btnloading ? <SmoothLoader /> : update ? " Update " : "Send Request"}
        </button>
        <p className={`mt-4 text-xs text-red-500 self-end`}>
          Required fields are marked with (*)
        </p>
      </div>

    </div>
  );
}


