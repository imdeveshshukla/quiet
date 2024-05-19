import React, { useRef, useState, useEffect } from 'react'
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdPassword } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { login } from "../redux/login";
import { useNavigate } from "react-router-dom";

const Signin = () => {
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const [form, setForm] = useState({ user: "", password: "" });
    const [otpsent, setOtpsent] = useState(false);
    const [otp, setOtp] = useState("");
    const [onSave, setOnSave] = useState(true);
    const [errorPass, setErrorPass] = useState(null);
    const [errorUser, setErrorUser] = useState(null);
    const [varifyOtpData, setVarifyOtpData] = useState({ userID: "", email: "", otp: "" });
    const [eye, setEye] = useState(false);
    const [isLogin, setisLogin] = useState(false);
    const passref = useRef();




    const sendRequest = async () => {

        if (String(form.user).endsWith("@ietlucknow.ac.in")) {
            const res = await axios.post("http://localhost:3000/auth/signin", { email: form.user, password: form.password });
            if (res.status == 202) {
                dispatch(login())
                Navigate("/")
            }
            console.log(res);
        }
        else {
            const res = await axios.post("http://localhost:3000/auth/signin", { username: form.user, password: form.password });
            if (res.status == 202) {
                dispatch(login())
                Navigate("/")
            }
            console.log(res);

        }
        
        

    }



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
        console.log(form);
    }
    const handleEye = () => {
        console.log("hello");
        passref.current.type = "text"
        setEye(true);

    }
    const handleCloseEye = () => {
        console.log("ok");
        passref.current.type = "password"
        setEye(false);

    }
    const resetPassword = () => {
        console.log("reset");

    }
    return (

        <>
            <div className='w-full flex justify-center items-center h-[80vh] m-auto  '>
                <div className='w-[35%] h-[60%] bg-[#6d712eb8] rounded-2xl shadow-2xl shadow-current '>

                    <form autoComplete='off' className='flex flex-col justify-evenly px-20 rounded-2xl backdrop-blur-3xl   gap-4 h-[100%]' onSubmit={(e) => { handleSubmit(e) }}>
                        {otpsent ? <><div className=' flex flex-col gap-5'><div className='relative flex flex-col justify-center items-center'>
                            <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdPassword className=' text-xl' /></span>
                            <input value={otp} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleOtp(e) }} type='text' name="otp" id="otp" placeholder='Enter OTP' />
                            <div role="alert" style={{ color: "red", fontSize: "12px" }}></div>
                        </div>
                            <div className='flex justify-center'><div onClick={() => { varifyOtp() }} className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' >Varify OTP</div></div>
                            <div className=' underline  self-center text-blue-800 text-sm cursor-pointer' onClick={() => { resendOTP() }}>Resend OTP</div>
                        </div>



                        </> : <><div className='flex flex-col gap-8'>

                            <div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><FaRegUserCircle className=' text-xl' /></span>
                                <input value={form.user} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="text" name="user" id="user" placeholder='Enter Username / Email' />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorUser}</div>
                            </div>



                            <div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><RiLockPasswordFill className=' text-xl' /></span>
                                <input ref={passref} value={form.password} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} placeholder='Enter Password' type="password" name="password" id="password" />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorPass}</div>
                                <span id='eye' onMouseDown={() => handleEye()} onMouseUp={() => handleCloseEye()} className=' cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] '>{!eye ? <VscEye className='text-xl' /> : <VscEyeClosed />}</span>
                            </div>
                        </div>
                            <div className='flex justify-center items-center flex-col gap-4'>
                                {onSave ? <button className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Sign In</button> : <button disabled className=' cursor-not-allowed disabled:opacity-60 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Sign In</button>}
                                <div> <div className='flex flex-col '>
                                    <span>Forgot Password? <Link to={"/resetpassword"} className='underline cursor-pointer text-blue-800' >Reset</Link></span>
                                    <span>Not an user? <Link className='underline text-blue-800' to={"/signup"}>Sign Up</Link> </span>
                                </div></div>

                            </div></>}


                    </form>
                </div>

            </div>

        </>
    )
}

export default Signin
