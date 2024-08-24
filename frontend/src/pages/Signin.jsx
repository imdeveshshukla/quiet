import React, { useRef, useState, useEffect } from 'react'
import { RiLockPasswordFill } from "react-icons/ri";
import { MdPassword } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {  useDispatch } from 'react-redux'
import { login } from "../redux/login";
import { useNavigate } from "react-router-dom";
import { loading } from '../redux/loading';
import toast from 'react-hot-toast';
import { setUserInfo } from '../redux/user';
import { setSkeltonLoader } from '../redux/skelton';
import baseAddress from "../utils/localhost";
import { getUserData } from '../App';




const Signin = () => {
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const [form, setForm] = useState({ user: "", password: "" });
  
  
    const [onSave, setOnSave] = useState(true);

    


    const [eye, setEye] = useState(false);
    const passref = useRef();


    


    const sendRequest = async () => {

        toast.loading("Signing In...");
        try {
            if (String(form.user).endsWith("@ietlucknow.ac.in")) {
                const res = await axios.post(`${baseAddress}auth/signin`, { email: form.user, password: form.password });
                if (res.status == 202) {
                    toast.dismiss()
                    Navigate("/")
                    await getUserData({email:res.data, dispatch});
                    toast.dismiss()
                    toast.success("Logged In succesfully!")
                    dispatch(login())
                }
            }
            else {
                const res = await axios.post(`${baseAddress}auth/signin`, { username: form.user, password: form.password });
                
                if (res.status == 202) {
                    toast.dismiss()
                    Navigate("/")
                    await getUserData({email:res.data, dispatch});
                    toast.dismiss()
                    toast.success("Logged In succesfully!")
                    dispatch(login())
                }
            }
        } catch (error) {
            toast.dismiss()
            console.log(error);
            if(error.response.status==401){
                toast.error("Invalid Credentials")
            }else if(error.response.status==403){
                toast.error("User is not Varified! Varify your email.")
                Navigate("/varifyaccount")
            } 
            else if(error.response.status == 425)
            {
                toast.error("TimeOut!! Please try again after some times")
                Navigate("/");
            }
        }
    }



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        // dispatch(loading());
        await sendRequest();
        // dispatch(loading());
    }
    const handleEye = () => {
        passref.current.type = "text"
        setEye(true);

    }
    const handleCloseEye = () => {
        passref.current.type = "password"
        setEye(false);

    }

    // #6d712eb8

    return (

        <>
            <div className='w-full flex justify-center items-center h-[89.5vh] m-auto  '>
                <div className=' w-[95%] xxs:w-[90%]  sm:w-[75%]  md:w-[85%] 2_md:w-[70%] xl:w-[90%] 1_5xl:w-[70%] h-[50%] sm:h-[60%] bg-[#6c712e79] rounded-2xl shadow-2xl shadow-current '>

                    <form noValidate autoComplete='off' className='flex flex-col justify-evenly px-3 xxs:px-6 xs:px-8 sm:px-20 md:px-8 lg:px-16 rounded-2xl backdrop-blur-3xl   gap-4 h-[100%]' onSubmit={(e) => { handleSubmit(e) }}>
                         <><div className='flex flex-col gap-8'>

                            <div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><FaRegUserCircle className=' text-xl' /></span>
                                <input spellCheck={"false"} value={form.user} className='text-white focus:border-white transition-all ease-in delay-200 outline-none pl-10  pr-4 xxs:px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="text" name="user" id="user" placeholder='Enter Username / Email' />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}></div>
                            </div>



                            <div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><RiLockPasswordFill className=' text-xl' /></span>
                                <input ref={passref} value={form.password} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} placeholder='Enter Password' type="password" name="password" id="password" />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}></div>
                                <span id='eye' onMouseDown={() => handleEye()} onMouseUp={() => handleCloseEye()} className=' cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] '>{!eye ? <VscEye className='text-xl' /> : <VscEyeClosed />}</span>
                            </div>
                        </div>
                            <div className='flex justify-center items-center flex-col gap-4'>
                                {onSave ? <button className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Sign In</button> : <button disabled className=' cursor-not-allowed disabled:opacity-60 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Sign In</button>}
                                <div> <div className='flex flex-col '>
                                    <span>Forgot Password? <Link to={"/resetpassword"} className='underline cursor-pointer text-blue-800' >Reset</Link></span>
                                    <span>Not an user? <Link className='underline text-blue-800' to={"/signup"}>Sign Up</Link> </span>
                                </div></div>

                            </div></>


                    </form>
                </div>

            </div>

        </>
    )
}

export default Signin



