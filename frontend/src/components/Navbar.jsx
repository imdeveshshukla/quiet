import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";

const Navbar = () => {
    const [search, setSearch] = useState("");
    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(search);
        
    }
  return (
    <nav className="bg-[#6d712eb8]  flex justify-between px-8 ">
        <div className="logo w-52">
            <Link to={"/"}><img src={logo} alt="" /></Link>
        </div>
        <div className="search flex items-center relative w-[25%]">
            <span className="absolute left-2"><IoSearchOutline className=" text-2xl"/></span>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <input  onChange={(e)=>setSearch(e.target.value)} value={search} className="outline-none pl-10 pr-4 py-2 w-[100%] bg-[#656923] text-white rounded-3xl" type="search" name="search" id="search" placeholder='Search' />
            </form>
        </div>
        <div className='flex gap-3 items-center'>
            <Link to={"/signin"}><div className="signin cursor-pointer text-lg px-2 py-1 font-semibold hover:text-[#565252]">Sign in</div></Link>
            <Link to={"/signup"}><div className="signup cursor-pointer rounded-xl bg-black text-white px-2 py-1 text-lg  hover:shadow-sm shadow-md shadow-current">Sign up</div></Link> 
        </div>
    </nav>
  )
}

export default Navbar
