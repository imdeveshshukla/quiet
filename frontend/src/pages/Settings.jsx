import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import LeetCode from '../components/LeetCode.jsx'
import baseAddress from '../utils/localhost.js';
import { useDispatch, useSelector } from 'react-redux';
import { SiLeetcode } from "react-icons/si";
import { addCodeforceRank, addLeetCodeID, clearUserInfo, setshowCf, setShowLC, setUserInfo } from '../redux/user.js';
import SmallLoader from '../components/SmallLoader.jsx';
import Switch from '@mui/material/Switch';
import { TbPassword } from "react-icons/tb";
import SmoothLoader from '../assets/SmoothLoader.jsx';
import toast from 'react-hot-toast';
import { logout } from '../redux/login.js';
import { clearPostsInfo } from '../redux/Post.js';
import { clearHotPostsInfo } from '../redux/Hotposts.js';
import { SiCodeforces } from "react-icons/si";
import CryptoJS from 'crypto-js';
import { MdArrowForwardIos } from "react-icons/md";
import { handleDpChange } from '../components/ProfileLayout.jsx';
import { PiCameraPlusLight } from "react-icons/pi";
import banner from '../assets/banner.png'
import { updateBgImg } from '../components/Profilecard.jsx';
import { setBgImg } from '../redux/profile.js';



axios.defaults.withCredentials = true


function Settings() {
  const [lcusername, setlcusername] = useState("");
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState("");

  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();
  const [update, setupdate] = useState(false);
  const [show, setShow] = useState(true);
  const [showAlert, setshowAlert] = useState(false);

  const [cfusername, setcfusername] = useState("");
  const [isLoading2, setisLoading2] = useState(false);
  const [error2, seterror2] = useState("");
  const [update2, setupdate2] = useState(false);
  const [isDisable2, setIsDisable2] = useState(false)
  const [show2, setShow2] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isBgOpen, setIsBgOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false)

  const [generating, setGenerating] = useState(false);
  const [usernm, setUsrnmList] = useState([]);
  const [generatedUsername, setUsernameInput] = useState('');
  const [bio, setBio] = useState('');
  const [pass, setPass] = useState('');
  const [updating, setUpdating] = useState(false);
  const [confirmDel, setConfirm] = useState(false);
  const [isDataValid, setIsDataValid] = useState(false);
  const [dpLoc, setdpLoc] = useState("");
  const [bgLoc, setbgLoc] = useState("");
  const dpUploadRef = useRef(null);
  const bgUploadRef = useRef(null);
  const selectFile = useRef(null);
  const selectBgFile = useRef(null);
  const dpRef = useRef(null);
  const bgRef = useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loader, setLoader] = useState(false)

  const nav = useNavigate();
  const validatePassword = (password) => {

    const specialSymbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    const minLength = 8;

    const containsSpecialSymbol = specialSymbolRegex.test(password);
    const containsLetter = letterRegex.test(password);
    const containsNumber = numberRegex.test(password);
    const isValidLength = password.length >= minLength;
    return containsSpecialSymbol && containsLetter && containsNumber && isValidLength;
  }
  const generateUsername = async () => {
    if (usernm.length > 1) {
      setUsernameInput(usernm.pop());
    }
    else {
      setGenerating(true);
      try {

        const res = await axios.get(`${baseAddress}auth/generateusername`);

        setUsrnmList(res.data.usernames);
        setUsernameInput(res.data.usernames[0]);
      } catch (error) {
        toast.error("Not Able to Generate Username!Try Again Later");
      }
      setGenerating(false)
    }
    setIsDataValid(true);
  }
  const updateDetails = async () => {
    if (!isDataValid) return;
    if (pass != '') {
      if (!validatePassword(pass)) {
        toast.error("Invalid Password");
        setIsDataValid(false);
        return;
      }
    }
    const username = generatedUsername == '' ? null : generatedUsername;
    const password = pass == '' ? null : pass;
    const myBio = bio == '' ? null : bio;
    if (!username && !password && !myBio) {
      setIsDataValid(false);
      return;
    }
    setUpdating(true);
    try {
      const res = await axios.post(baseAddress + `u/update`, {
        username,
        password,
        bio: myBio
      });
      setUpdating(false);
      dispatch(setUserInfo(res.data.user));
      dispatch(clearPostsInfo());
      toast.success("Details Updated");

    }
    catch (error) {
      console.log(error.message);
      toast.error("Unknown Error!!Try Again Later")
    }
    setUpdating(false);
  }

  function updateBio(val) {
    setBio(val);
    setIsDataValid(true);
  }

  const addLC = async () => {

    setisLoading(true)

    try {

      const res = await axios.post(`${baseAddress}u/addLeetCode`, {
        lcusername: lcusername,
      });

      if (res.status == 200) {
        dispatch(addLeetCodeID(res.data.leetcode));
        setlcusername("")
        setupdate(false)
      }

    } catch (error) {
      if (error.response.status == 404) {
        setisLoading(false);
        seterror("Invalid username");
      } else {
        console.log(error);

      }

    }
    setisLoading(false)
  }




  const addCF = async () => {
    setisLoading2(true)

    try {
      let cfdata = await fetch(`https://codeforces.com/api/user.info?handles=${cfusername}&checkHistoricHandles=false`);
      let data = await cfdata.json();


      if (data.status === "FAILED") {
        setisLoading2(false);
        seterror2("Invalid username");
        return;
      }

      const res = await axios.post(`${baseAddress}u/update`, {
        rank: data.result[0]?.maxRank,
      });
      if (res.status == 201) {
        dispatch(addCodeforceRank(res.data.user.codeforces));
        setupdate2(false)
      }

    } catch (error) {
      console.log(error);
      toast.error("Server Issue");
    }
    setisLoading2(false)
  }

  const setShowLc = async (value) => {
    setIsDisable(true)

    try {
      const res = await axios.post(`${baseAddress}u/setLcVisibility`, {
        showLC: value,
      })
      //  console.log(res);

    } catch (error) {
      console.log(error);

    }
    setIsDisable(false)
  }

  const setShowCf = async (value) => {
    setIsDisable2(true)
    // console.log(value+" "+typeof (value));

    try {
      const res = await axios.post(`${baseAddress}u/update`, {
        showCF: value,
      })
      //  console.log("setShowCf ",res.data);
    } catch (error) {
      console.log(error);
    }
    setIsDisable2(false)
  }

  const handleChange2 = (e) => {
    setShow2(e.target.checked);
    // console.log(e.target.checked);
    setShowCf(e.target.checked);
    dispatch(setshowCf(e.target.checked));
  }

  const handleChange = (e) => {
    setShow(e.target.checked);
    // console.log(e.target.checked);
    setShowLc(e.target.checked);
    dispatch(setShowLC(e.target.checked))
  }

  async function deleteAccount() {
    if (!confirmDel) {
      setConfirm(true);
      return;
    }
    try {
      const res = await axios.delete(baseAddress + "u/deleteAccount");
      dispatch(clearUserInfo());
      dispatch(clearPostsInfo());
      dispatch(clearHotPostsInfo());
      dispatch(logout());
      nav("/signin")

      toast.success("Account Deleted")
    } catch (error) {
      console.log(error);
      toast.error("Server Issue");
      toast.error("Try Again Later");
    }
  }

  useEffect(() => {
    if (userInfo) {
      setShow(userInfo.showLC)
    }
  }, [userInfo?.showLC])

  useEffect(() => {
    if (userInfo) {
      setShow2(userInfo.showCf)
    }
  }, [userInfo?.showCf])

  const cancelChanges = () => {
    setUsernameInput('');
    setPass('');
    setBio('');
    setIsDataValid(false);
  }


  const handleClickOutside = (event) => {
    if (dpUploadRef.current && !dpUploadRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (bgUploadRef.current && !bgUploadRef.current.contains(event.target)) {
      setIsBgOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDpUpdate = async (e) => {
    const file = e.target.files[0];
    setdpLoc(e.target.files[0])

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dpRef.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  const handleBgUpdate = async (e) => {
    const file = e.target.files[0];
    setbgLoc(e.target.files[0])

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        bgRef.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }





  return (
    <>
      <div className=' py-10 px-6 xxs:p-12 sm:p-24'>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <div className="space-y-8">
          <div className="border-b border-gray-900/10 pb-12 mt-2">


            <div className="col-span-full mt-5">
              <label htmlFor="about" className="block text-sm mb-4 font-medium leading-6 text-gray-900">
                LeetCode ID
              </label>
              {userInfo?.leetcode && !update ? <>

                <div className=' flex justify-between'>
                  <div className=' flex gap-2 items-center'>
                    <SiLeetcode />
                    <a href={`https://leetcode.com/u/${getLCusername(userInfo.leetcode)}/`} target='blank' className=' text-[#01a864]'>{getLCusername(userInfo.leetcode)}</a>
                    <button onClick={() => setupdate(true)} className=' flex  items-center justify-center px-4 py-1 bg-white font-medium rounded-md shadow-sm ring-1 ring-inset ring-gray-300 text-sm '>Update</button>
                  </div>
                  <div className=' relative'>
                    {showAlert && <div className=' absolute right-0 bottom-10 w-40 text-xs text-red-500 font-semibold border-2 border-red-700 rounded-tl-xl rounded-br-xl p-2'>
                      *Display stats on profile.
                    </div>}

                    <Switch disabled={isDisable} onMouseEnter={() => setshowAlert(true)} onMouseLeave={() => setshowAlert(false)} checked={show} onChange={(e) => handleChange(e)} sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#000',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#666923d3',
                      },
                    }} />
                  </div>
                </div>
              </> : <>
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  Add Leetcode profile
                </label>
                <div className='flex mt-2 gap-2'>
                  <div className=" relative rounded-md shadow-sm ring-1 ring-inset ring-gray-300">

                    <span className='absolute left-2 top-[50%] translate-y-[-50%]'><SiLeetcode className='text-xl' /></span>
                    <input
                      id="lcusername"
                      name="lcusername"
                      spellCheck={"false"}
                      value={lcusername}
                      onChange={(e) => {
                        setlcusername(e.target.value)
                        seterror("")
                      }}
                      type="text"
                      placeholder="LeetCode ID"
                      className="block flex-1 outline-none  bg-transparent py-1.5 pl-10 text-gray-900  focus:ring-0 sm:text-sm sm:leading-6    "
                    />
                  </div>
                  <button onClick={() => addLC()} className=' flex  items-center justify-center px-4 bg-[#e3a300] font-medium rounded-md shadow-sm ring-1 ring-inset ring-gray-300 text-sm '>
                    {isLoading ? <SmallLoader /> : <span>Add</span>}
                  </button>
                </div>
                <div className='mt-1 ml-2' role="alert" style={{ color: "red", fontSize: "12px" }}>{error}</div>
              </>}


            </div>

            <div className="col-span-full mt-5">
              <label htmlFor="about" className="block text-sm mb-4 font-medium leading-6 text-gray-900">
                Codeforces ID
              </label>
              {userInfo?.codeforces && !update2 ? <>

                <div className=' flex justify-between'>
                  <div className=' flex gap-2 items-center'>
                    <SiCodeforces />
                    <a href={`https://codeforces.com/profile/${userInfo.codeforces}/`} target='blank' className=' text-[#01a864]'>{userInfo?.codeforces}</a>
                    <button onClick={() => setupdate2(true)} className=' flex  items-center justify-center px-4 py-1 bg-white font-medium rounded-md shadow-sm ring-1 ring-inset ring-gray-300 text-sm '>Update</button>
                  </div>
                  <div className=' relative'>
                    {showAlert && <div className=' absolute right-0 bottom-10 w-40 text-xs text-red-500 font-semibold border-2 border-red-700 rounded-tl-xl rounded-br-xl p-2'>
                      *Display stats on profile.
                    </div>}

                    <Switch disabled={isDisable2} onMouseEnter={() => setshowAlert(true)} onMouseLeave={() => setshowAlert(false)} checked={show2} onChange={(e) => handleChange2(e)} sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#000',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#666923d3',
                      },
                    }} />
                  </div>
                </div>
              </> : <>
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  Add Your Codeforces Rank
                </label>
                <div className='flex mt-2 gap-2'>
                  <div className=" relative rounded-md shadow-sm ring-1 ring-inset ring-gray-300">

                    <span className='absolute left-2 top-[50%] translate-y-[-50%]'><SiCodeforces className='text-xl' /></span>
                    <input
                      id="cfusername"
                      name="cfusername"
                      spellCheck={"false"}
                      value={cfusername}
                      onChange={(e) => {
                        setcfusername(e.target.value)
                        seterror2("")
                      }}
                      type="text"
                      placeholder="Codeforces ID"
                      className="block flex-1 outline-none  bg-transparent py-1.5 pl-10 text-gray-900  focus:ring-0 sm:text-sm sm:leading-6    "
                    />
                  </div>
                  <button onClick={() => addCF()} className=' flex  items-center justify-center px-4 bg-[#e3a300] font-medium rounded-md shadow-sm ring-1 ring-inset ring-gray-300 text-sm '>
                    {isLoading2 ? <SmallLoader /> : <span>Add</span>}
                  </button>
                </div>
                <div className='mt-1 ml-2' role="alert" style={{ color: "red", fontSize: "12px" }}>{error2}</div>
              </>}


            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">

                <div className="flex  rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                  <span className="flex justify-center select-none items-center pl-3 pr-3 bg-green-500 rounded-l-md text-black sm:text-sm hover:cursor-pointer hover:text-gray-600"


                    onClick={() => { generateUsername() }}
                  >{generating ? <SmallLoader /> : "Generate"}</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={generatedUsername ? generatedUsername : userInfo?.username}
                    autoComplete="username"
                    disabled={true}
                    className="block flex-1 border-0 rounded-r-md bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-black focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            {/* about */}
            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={2}
                  placeholder='Write a few sentences about yourself'
                  className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-grey-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[black] sm:text-sm sm:leading-6"
                  value={bio}
                  onChange={(e) => updateBio(e.target.value)}
                />
              </div>
              <p className="mt-3 ml-2 text-sm leading-6 text-gray-600">Be <b>Quiet</b> about yourself</p>

            </div>

            {isOpen && <div className='fixed top-0 left-0 z-10 min-h-screen min-w-full  backdrop-blur-sm'>
              <div ref={dpUploadRef} className='absolute left-[50%] top-[50%] w-[80%]  xs:w-[60%]  sm:w-[40%] rounded-3xl shadow-md h-[30%] lg:w-[30%] 2_md:h-[40%] translate-x-[-50%] translate-y-[-50%] bg-[#808449] p-4 flex items-center justify-center '>

                <div className=' rounded-2xl flex flex-col items-center justify-between gap-4'>
                  <div className='relative  rounded-full'>
                    <img ref={dpRef} src={userInfo && userInfo.dp ? userInfo.dp : dp}
                      alt="Profile"
                      className="w-36 h-36 rounded-full   bg-white "
                    />

                    <button onClick={() => selectFile.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>

                    <input onChange={(e) => handleDpUpdate(e)} accept='image/*' ref={selectFile} type="file" name="media" id="media" hidden />


                  </div>
                  <div className=' flex gap-4'>
                    <button onClick={() => setIsOpen(false)} className='px-4 py-2 rounded-3xl bg-white' type="button">Cancle</button>
                    <button onClick={() => handleDpChange({ dpLoc, setBtnLoading, setIsOpen, dispatch })} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{btnLoading ? <SmallLoader /> : "Save"}</button>
                  </div>
                </div>

              </div>

            </div>}

            <div onClick={() => setIsOpen(true)} className="col-span-full flex items-center justify-between cursor-pointer group">
              <div className="flex flex-col">
                <label
                  htmlFor="dp"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Profile Photo
                </label>
                <span className="text-xs text-gray-500">
                  Edit your avatar or upload an image
                </span>
              </div>

              <div className="rounded-full p-2  group-hover:bg-green-500 group-hover:text-white transition-colors duration-200">
                <MdArrowForwardIos />
              </div>
            </div>



            {isBgOpen && <div className='fixed top-0 left-0 z-10 min-h-screen min-w-full  backdrop-blur-sm'>
              <div ref={bgUploadRef} className='absolute left-[50%] top-[50%] w-[95%] xs:w-[80%]   1_5md::w-[60%] lg:w-[50%]   rounded-3xl shadow-md  h-[30%] xs:h-[40%] translate-x-[-50%] translate-y-[-50%] bg-[#808449] p-4 flex items-center justify-center '>

                <div className=' rounded-2xl flex flex-col w-full items-center justify-between gap-4'>
                  <div className='relative w-full  rounded-2xl xs:px-4'>
                    <img ref={bgRef} src={userInfo?.bgImg || banner}
                      alt="Profile"
                      className="w-full h-44 xs:h-52 rounded-2xl  object-cover  bg-white "
                    />

                    <button onClick={() => selectBgFile.current?.click()} type='button' className='absolute right-[5%] bottom-[5%] text-2xl rounded-full p-1 border border-black bg-neutral-400 hover:bg-slate-300 '><PiCameraPlusLight /></button>

                    <input onChange={(e) => handleBgUpdate(e)} accept='image/*' ref={selectBgFile} type="file" name="media" id="media" hidden />


                  </div>
                  <div className=' flex gap-4'>
                    <button onClick={() => setIsBgOpen(false)} className='px-4 py-2 rounded-3xl bg-white' type="button">Cancle</button>
                    <button onClick={async () => {
                      {
                        await updateBgImg({ bgImg: bgLoc, dispatch, setLoader })
                        setIsBgOpen(false)
                      }
                    }} className='px-4 py-2 rounded-3xl bg-blue-700' type="button">{loader ? <SmallLoader /> : "Save"}</button>
                  </div>
                </div>

              </div>

            </div>}



            <div onClick={() => setIsBgOpen(true)} className="col-span-full flex items-center justify-between   cursor-pointer group">
              <div className="flex flex-col">
                <label
                  htmlFor="dp"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Backgroung Image
                </label>
                <span className="text-xs text-gray-500">
                  Upload a profile background image
                </span>
              </div>

              <div className="rounded-full p-2  group-hover:bg-green-500 group-hover:text-white transition-colors duration-200">
                <MdArrowForwardIos />
              </div>
            </div>




            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                  <span className="flex select-none items-center pl-3 pr-3 text-black sm:text-sm"><TbPassword /></span>
                  <input
                    id="pass"
                    name="password"
                    type="text"
                    placeholder="Janesmith@123"
                    autoComplete="password"
                    onChange={(e) => (setPass(e.target.value), setIsDataValid(true))}
                    value={pass}
                    className="block flex-1 border-0 rounded-r-md bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <p className="mt-3 ml-2 text-sm leading-6 text-gray-600"> Password must include a-z,A-Z,0-9,symbols and min-length of 8</p>
            </div>
          </div>

        </div>

        <div className="border-b border-gray-900/10 my-6 flex items-center justify-end ">
          <div className='my-5 flex gap-x-6'>
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={cancelChanges}>
              Cancel
            </button>
            <button
              type="submit"
              onClick={updateDetails}
              className={isDataValid ? "rounded-md bg-[#656923] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a9aa88] hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black flex justify-center" : "flex justify-center rounded-md bg-[#656923] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:cursor-not-allowed"}
            >
              {updating ? <SmoothLoader /> : 'Save'}
            </button>
          </div>
        </div>

        <div>
          {confirmDel && <p className='text-[#ff3939] font-bold text-xs my-5'>Alert! Your All Data Will Be Deleted eg. Rooms,Posts,Comments,Likes</p>}
          <button className="rounded-md bg-[#ff3939] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a9aa88] hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={deleteAccount}
          >
            {confirmDel ? "Again Click to Confirm" : "Delete Your Account"}
          </button>
        </div>
      </div>
    </>
  )
}

export default Settings;

const getLCusername = (encryptUsername) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptUsername,
    import.meta.env.VITE_LC_SECRETKEY
  );
  const username = bytes.toString(CryptoJS.enc.Utf8);
  return username
}
