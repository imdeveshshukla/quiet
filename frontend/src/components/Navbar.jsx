import React, { useRef, useState,useEffect } from 'react'
import logo from '../assets/logo.png'
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {  logout } from '../redux/login'
import axios from 'axios';
import {setUserInfo, clearUserInfo} from '../redux/user'
import {loading} from '../redux/loading';
import { IoIosLogOut } from "react-icons/io";
import dp from '../assets/dummydp.png'

axios.defaults.withCredentials = true


const Navbar = () => {
    const [search, setSearch] = useState("");
    const isLogin = useSelector((state) => state.login.value);
    const dispatch = useDispatch();
    const userInfo = useSelector((state)=>state.user.userInfo);



    const Navigate = useNavigate()



    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

  
    const handleToggle = () => {
      setIsOpen(!isOpen);
    };
  
    const handleClickOutside = (event) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);  
  

  

    const logOut  = async () => {
        dispatch(loading())
        try {
          setIsOpen(!isOpen);
            const res = await axios.post("http://localhost:3000/auth/logout", {  withCredentials: true})
            if(res.status==200){
            dispatch(logout());
            dispatch(clearUserInfo());
            Navigate("/signin");
        }
        } catch (error) {
            console.log(error);
        }
        dispatch(loading())
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(search);
    }
  return (
    <nav className="bg-[#6d712eb8]  flex justify-between px-8 sticky top-0 z-10 backdrop-blur-md ">
        <div className="logo w-52">
            <Link to={"/"}><img src={logo} alt="" /></Link>
        </div>
        <div className="search flex items-center relative w-[25%]">
            <span className="absolute left-2"><IoSearchOutline className=" text-2xl"/></span>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <input  onChange={(e)=>setSearch(e.target.value)} value={search} className="outline-none pl-10 pr-4 py-2 w-[100%] bg-[#656923] text-white rounded-3xl" type="search" name="search" id="search" placeholder='Search' />
            </form>
        </div>
        <div className='flex gap-3 items-center '>
            {isLogin?<>
                <div className="relative" ref={dropdownRef}>
      <button onClick={handleToggle} className="flex items-center rounded-full border-2 border-black hover:border-white focus:outline-none">
        <img
          src={userInfo&&userInfo.dp? userInfo.dp:dp}
          alt="Profile"
          className="w-10 h-10 rounded-full   bg-white"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1 bg-[#656923] rounded-md ">
            
                <li className="px-4 py-2 text-red-900 ">
                  <span className='text-sm text-black '>Welcome</span> {userInfo&&userInfo.username?userInfo.username:`Anonymous`}...
                </li>
                <li className="px-4 py-2 text-white hover:bg-[#6d712eb8]">
      
                  <Link onClick={()=>setIsOpen(!isOpen)} to={"/profile/overview"} className="block">Profile</Link>
                </li>
                <li className="px-4 py-2 text-white hover:bg-[#6d712eb8]"> 
                  <Link onClick={()=>setIsOpen(!isOpen)} to={"/setting/"} className="block">Settings</Link>
                </li>
                <li className="px-4 py-2 text-white cursor-pointer flex items-center gap-3 hover:bg-[#6d712eb8]" onClick={()=>logOut()}>
                  <span>Logout</span> <span><IoIosLogOut/></span>
                </li>
          </ul>
        </div>
      )}
    </div>
            </>
            :<><Link to={"/signin"}><div className="signin cursor-pointer text-lg px-2 py-1 font-semibold hover:text-[#565252]">Sign in</div></Link>
            <Link to={"/signup"}><div className="signup cursor-pointer rounded-xl bg-black text-white px-2 py-1 text-lg  hover:shadow-sm shadow-md shadow-current">Sign up</div></Link></>}  
        </div>
    </nav>
  )
}



export default Navbar
