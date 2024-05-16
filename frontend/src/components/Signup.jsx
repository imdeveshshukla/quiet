import React, { useRef, useState } from 'react'
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { Link } from 'react-router-dom';
const Signup = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [eye, setEye] = useState(false)
    const passref = useRef();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    }
    const handleEye=()=>{
        console.log("hello");
        passref.current.type="text"
        setEye(true);

    }
    const handleCloseEye=()=>{
        console.log("ok");
        passref.current.type="password"
        setEye(false);
        
    }
 
    return (
        <Layout purpose={"Sign Up"} passref={passref} eye={eye} handleEye={handleEye} handleChange={handleChange} handleSubmit={handleSubmit} handleCloseEye={handleCloseEye} />
    )
}

export const Layout=({purpose,passref,eye,handleChange, handleCloseEye, handleEye, handleSubmit,resetPassword})=>(
<>
<div className='w-full flex justify-center items-center h-[80vh] m-auto  '>
            <div className='w-[35%] h-[50%] bg-[#6d712eb8] rounded-2xl shadow-2xl shadow-current '>

                <form className='flex flex-col justify-evenly px-20 rounded-2xl backdrop-blur-3xl   gap-4 h-[100%]' onSubmit={(e) => { handleSubmit(e) }}>

                    <div className='flex flex-col gap-8'>
                        <div className='relative'>
                            <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdOutlineMailLock className=' text-xl'/></span>
                            <input className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="email" name="email" id="email" placeholder='Enter Email' />
                        </div>
                        <div className='relative'>
                            <span className='absolute left-2 top-[50%] translate-y-[-50%]'><RiLockPasswordFill className=' text-xl'/></span>
                            <input ref={passref} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} placeholder='Enter Password' type="password" name="password" id="password" />
                            <span id='eye' onMouseDown={()=>handleEye()} onMouseUp={()=>handleCloseEye()} className=' cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] '>{!eye?<VscEye className='text-xl'/>:<VscEyeClosed/>}</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center flex-col gap-4'>
                        <button className='rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">{purpose}</button>
                        <div>{purpose=="Sign Up"?<span>Already an user? <Link to={"/signin"}><span className='underline text-blue-800'>Sign In</span></Link></span>: <div className='flex flex-col '>
                            <span>Forgot Password? <span className='underline cursor-pointer text-blue-800' onClick={()=>{resetPassword()}}>Reset</span></span>
                            <span>Not an user? <Link className='underline text-blue-800' to={"/signup"}>Sign Up</Link> </span>
                        </div> }</div>
                        
                    </div>

                    
                </form>
            </div>

        </div>
</>
)

export default Signup
