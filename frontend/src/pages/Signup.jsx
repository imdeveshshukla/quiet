import React, { useRef, useState, useEffect } from 'react'
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdPassword } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loading } from '../redux/loading';
import toast from 'react-hot-toast';
import { FiRefreshCcw } from "react-icons/fi";
import SmallLoader from '../components/SmallLoader';






const Signup = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [onSave, setOnSave] = useState(true);
    const [otpsent, setOtpsent] = useState(false);
    const [otp, setOtp] = useState("");
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPass, setErrorPass] = useState(null);
    const [errorOtp, setErrorOtp] = useState(null);
    const [errorUsername, setErrorUsername] = useState(null);
    const [varifyOtpData, setVarifyOtpData] = useState({ userID: "", email: "", otp: "" });
    const [timeLeft, setTimeLeft] = useState(0);
    const [disable, setdisable] = useState(false);
    const [eye, setEye] = useState(false)
    const [usrnmList, setUsrnmList] = useState([]);
    const passref = useRef();

   
    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else {
            setdisable(false);
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);


    const handleChange = (e) => {
        setErrorEmail(null)
        setErrorPass(null)
        setOnSave(true)
        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(e.target.value);
        
    }

    const handleOtp = async (e) => {
        setErrorOtp(null)
        console.log(e.target.value);
        setOtp(e.target.value);
        setVarifyOtpData({ ...varifyOtpData, otp: e.target.value });
        console.log(varifyOtpData);
    }

    const sendOtp = async () => {
        try {
            const res = await axios.post("http://localhost:3000/auth/signup", form);
            console.log(res);
            if (res.status == 202) {
                setVarifyOtpData({ ...varifyOtpData, userID: res.data.userID, email: res.data.email });
                toast.success("Your OTP is on its way !");
                setOtpsent(true);
            }
            console.log(varifyOtpData);

        } catch (error) {
            if (error.response.status == 500) {
                toast.error("Some error occured! Try Again.")
            } else if (error.response.status == 400) {
                toast.error("User already exists with this Username or email");
            }
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        console.log(form);
        
        if ((form.username.length < 3)) {
            setOnSave(false)
            setErrorUsername("* username must contain more than 3 characters");
        }
        else if (!validateEmail(form.email)) {
            setErrorEmail("* use IET email id!");
            setOnSave(false);
        }
        else if (!validatePassword(form.password)) {
            setOnSave(false)
            setErrorPass('* Password must include a-z,A-Z,0-9,symbols and min-length of 8')
        }
        else {
            dispatch(loading());
            await sendOtp();
            dispatch(loading());
            setdisable(true);
            setTimeLeft(60)

            setForm({ username: "", email: "", password: "" })
            console.log(form);
        }
    }

    const resendOTP = async () => {
        dispatch(loading());
        setErrorOtp(null)

        try {

            const res = await axios.post("http://localhost:3000/auth/resendotp", varifyOtpData);
            if (res.status == 202) {
                setTimeLeft(60);
                setdisable(true)
                setOnSave(true)
                setVarifyOtpData({ ...varifyOtpData, userID: res.data.userID, email: res.data.email });
                toast.success("Your OTP is on its way !");
            } else if (res.status == 500) {
                toast.error("Some error occured! Try Again.")
            }
            console.log(res);

        } catch (error) {
            if (error.response.status == 500) {
                toast.error("Some error occured! Try Again.")
            }
            console.log(error);
        }
        dispatch(loading());

    }

    const varifyOtp = async () => {
        dispatch(loading())
        try {
            console.log(varifyOtpData);

            const res = await axios.post("http://localhost:3000/auth/varifyotp", varifyOtpData);
            console.log(res);

            if (res.status == 202) {
                toast.success("Sign Up Successful!");
                Navigate("/signin");
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                toast.error("Invalid OTP!");
                setOtp("")
            } else if (error.response.status == 403) {
                setErrorOtp("OTP expired! Resend it.")
                setOtp("")
            } else {
                toast.error("Some error occured! Try again")
                Navigate("/signup")
            }


        }
        dispatch(loading())
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


    const validateEmail = (email) => {
        if (String(email).endsWith("@ietlucknow.ac.in")) {
            return true;
        }
        else {
            return false;
        }
    };



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



    





    return (
        <Layout form={form} setForm={setForm} passref={passref} eye={eye} handleEye={handleEye} handleChange={handleChange} handleSubmit={handleSubmit} handleCloseEye={handleCloseEye} errorEmail={errorEmail} errorPass={errorPass} onSave={onSave} errorUsername={errorUsername} otp={otp} otpsent={otpsent}  handleOtp={handleOtp} resendOTP={resendOTP} varifyOtp={varifyOtp} errorOtp={errorOtp} timeLeft={timeLeft} disable={disable} usrnmList={usrnmList} setUsrnmList={setUsrnmList} />
    )
}
export default Signup



export const Layout = ({ form,setForm, passref, eye, handleChange, handleCloseEye, handleEye, handleSubmit, errorUsername, errorEmail, errorPass, onSave, otp, otpsent, resendOTP, handleOtp,usrnmList, setUsrnmList, varifyOtp, errorOtp, timeLeft, disable }) =>{

    const [isLoading, setisLoading] = useState(false);
    const usernameRef= useRef(null);

    const handleClick = ()=>{
        generateUsername();
    }

    const generateUsername = async()=>{
        setisLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/auth/generateusername");
            console.log(res);
            setUsrnmList(res.data.usernames);
            
        } catch (error) {
            
        }
        setisLoading(false)
    }

    const handleSelect=(username)=>{
        usernameRef.current.value= username;
        setForm({...form, username:username});
        
    }
    


    useEffect(() => {
      generateUsername();
    }, [])

return (
    <>
        <div className='w-full flex justify-center items-center h-[89.5vh] m-auto border-x-2 border-black  '>
            <div className=' w-[95%] xxs:w-[90%]  sm:w-[75%]  md:w-[85%] 2_md:w-[70%] xl:w-[90%] 1_5xl:w-[70%] h-[50%] sm:h-[60%] bg-[#6c712e79] rounded-2xl shadow-2xl shadow-current '>

                <form autoComplete='off' className='flex flex-col justify-evenly px-3 xxs:px-6 xs:px-8 sm:px-20 md:px-8 lg:px-16 rounded-2xl backdrop-blur-3xl   gap-4 h-[100%]' onSubmit={(e) => { handleSubmit(e) }}>


                    {otpsent ? <><div className=' flex flex-col gap-5'><div className='relative flex flex-col justify-center items-center'>
                        <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdPassword className=' text-xl' /></span>
                        <input autoFocus value={otp} className='text-white focus:border-white transition-all ease-in delay-200 outline-none pl-10  pr-4 xxs:px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleOtp(e) }} type='text' name="otp" id="otp" placeholder='Enter OTP' />
                        <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorOtp}</div>
                    </div>
                        <div className='flex justify-center cursor-pointer'><div onClick={() => { varifyOtp() }} className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' >Varify OTP</div></div>
                        <button disabled={disable} type='button' className=' underline  self-center text-blue-800 text-sm cursor-pointer' onClick={() =>resendOTP()}>Resend OTP <span className={!disable ? 'hidden' : ''}>({timeLeft}s)</span></button>
                    </div>


                    </> : <><div className='flex flex-col gap-4'>

                        <div className='relative flex flex-col'>
                            <span className='absolute  left-2 top-[50%] translate-y-[-50%]'><FaRegUserCircle className=' text-xl' /></span>
                            <input ref={usernameRef} value={form.username} className='text-white focus:border-white transition-all ease-in delay-200 outline-none  px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="text" name="username" id="username" placeholder='Enter Username'  readOnly/>
                            <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorUsername}</div>
                            
                        </div>

                        <div className=' flex gap-2 flex-wrap items-center justify-stretch'>
                            {Array.from(usrnmList).map(username=><>
                                <div onClick={()=>handleSelect(username)} className=' rounded-xl px-2 cursor-pointer bg-[#b1b390] text-gray-900'>{username}</div>
                            </>
                            )}
                            <div className=''>{isLoading?<SmallLoader/>:<FiRefreshCcw cursor={"pointer"} onClick={()=>handleClick()} className=' font-semibold text-xl'/>}</div>
                        </div>

                        



                        <div className='relative flex flex-col'>
                            <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdOutlineMailLock className=' text-xl' /></span>
                            <input value={form.email} className='text-white focus:border-white transition-all ease-in delay-200 outline-none cursor-text px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="email" name="email" id="email" placeholder='Enter Email' />
                            <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorEmail}</div>
                        </div>
                        <div className='relative flex flex-col'>
                            <span className='absolute left-2 top-[50%] translate-y-[-50%]'><RiLockPasswordFill className=' text-xl' /></span>
                            <input ref={passref} value={form.password} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} placeholder='Enter Password' type="password" name="password" id="password" />
                            <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorPass}</div>
                            <span id='eye' onMouseDown={() => handleEye()} onMouseUp={() => handleCloseEye()} className=' cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] '>{!eye ? <VscEye className='text-xl' /> : <VscEyeClosed />}</span>
                        </div>
                    </div>
                        <div className='flex justify-center items-center flex-col gap-4'>
                            {onSave ? <button className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Sign Up</button> : <button disabled className=' cursor-not-allowed disabled:opacity-60 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Sign Up</button>}
                            <div> <span>Already an user? <Link to={"/signin"}><span className='underline text-blue-800'>Sign In</span></Link></span> </div>

                        </div></>}


                </form>
            </div>

        </div>
    </>
)
}

