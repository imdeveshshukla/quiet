import React, { useRef, useState, useEffect } from 'react'
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdPassword } from "react-icons/md";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loading } from '../redux/loading';
import { useDispatch } from 'react-redux';



const Resetpass = () => {
    const passref = useRef();
    const Navigate = useNavigate();
    const dispatch = useDispatch();


    const [otpSent, setotpSent] = useState(false)
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPass, setErrorPass] = useState(null);
    const [errorOtp, setErrorOtp] = useState(null);
    const [otpVerify, setOtpVerify] = useState(false);
    const [onSave, setOnSave] = useState(true);
    const [form, setform] = useState({ email: "", password: "", otp: "" })
    const [eye, setEye] = useState(false)
    const [varifyOtpData, setVarifyOtpData] = useState({ userID: "", email: "", otp: "" });
    const [varifyPassData, setVarifyPassData] = useState({ userID: "", password: "" });
    const [timeLeft, setTimeLeft] = useState(60);
    const [disable, setdisable] = useState(false);


    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else {
            setdisable(false);
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);

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

    const handleChange = (e) => {
        setErrorOtp(null)
        setErrorEmail(null)
        setErrorPass(null)
        setVarifyOtpData({ ...varifyOtpData, [e.target.name]: e.target.value })
        setVarifyPassData({ ...varifyPassData, [e.target.name]: e.target.value })
        setOnSave(true)
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateEmail(form.email)) {
            setErrorEmail("* Invalid Email");
            setOnSave(false);
        } else {
            dispatch(loading())
            try {
                const res = await axios.post("http://localhost:3000/auth/resetpass", form);
                console.log(res);
                setVarifyOtpData({ ...varifyOtpData, userID: res.data.userID, email: res.data.email })
                setVarifyPassData({ ...varifyPassData, userID: res.data.userID })
                setotpSent(true)
                setTimeLeft(60);
                setdisable(true)
                toast.success("Your OTP is on its way !")

            } catch (error) {
                console.log(error);

                if (error && error.response.status == 404) {
                    setErrorEmail("User doesn't exists !");
                    setOnSave(false)
                }

            }
            dispatch(loading())
        }
    }


    const resendOtp = async () => {
        dispatch(loading())
        try {
            const res = await axios.post("http://localhost:3000/auth/resendotp", varifyOtpData);
            console.log(res);
            console.log(varifyOtpData);

            if (res.status == 202) {
                setTimeLeft(60);
                setdisable(true);
                toast.success("Your OTP is on its way !");
                setVarifyOtpData({ ...varifyOtpData, userID: res.data.userID, email: res.data.email })
            }
        } catch (error) {
            if (error.response.status == 500) {
                toast.error("Error sending OTP! Try Again.")
            }
            console.log(error);
        }
        dispatch(loading())
    }


    const varifyOtp = async () => {
        dispatch(loading())
        try {
            console.log(varifyOtpData);
            const res = await axios.post("http://localhost:3000/auth/varifyotp", varifyOtpData);

            console.log(res);
            console.log(varifyOtpData);
            if (res.status == 202) {
                setOtpVerify(true)
            }

        } catch (error) {
            console.log(error);
            if (error.response.status == 403) {
                setErrorOtp("Otp is Expired! Resend it.")
            } else if (error.response.status == 401) {
                toast.error("Invalid OTP !")
                setOnSave(false)
            }
            else if(error.response.status == 425){
                toast.error("Timeout!Too many request");
                setOnSave(false);
                Navigate("/");

            }
            setform({...form,otp:""});
            setVarifyOtpData({...varifyOtpData,otp:""})
        }
        dispatch(loading())
    }

    const handleConfirm = async () => {
        console.log(form.password);
        if (!validatePassword(form.password)) {
            setOnSave(false)
            setErrorPass("* Password must include a-z,A-Z,0-9,symbols and min-length of 8");
        } else {
            console.log(varifyOtpData, form.password);
            dispatch(loading())
            try {
                const res = await axios.post("http://localhost:3000/auth/updatepass", varifyPassData);
                if (res.status == 201) {
                    toast.success("Password has been updated!");
                    Navigate("/signin")
                }
            } catch (error) {
                console.log(error);
                
                if(error.response.status==304){
                    toast.error("Could't update! Try Again.")
                }else if(error.response.status==400){
                    toast.error("Some error occurred! Try again.")
                }
            }
            dispatch(loading())
        }

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


    return (
        <>
            <div className='w-full flex justify-center items-center h-[80vh] m-auto  '>
                <div className='w-[45%] h-[60%] bg-[#6d712eb8] rounded-2xl shadow-2xl shadow-current '>

                    <form autoComplete='off' className='flex flex-col justify-evenly px-20 rounded-2xl backdrop-blur-3xl   gap-4 h-[100%]' onSubmit={(e) => { handleSubmit(e) }}>





                        <div className='flex flex-col gap-8'>

                            {!otpSent && !otpVerify && <div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdOutlineMailLock className=' text-xl' /></span>
                                <input autoFocus value={form.email} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="email" name="email" id="email" placeholder='Enter Email' />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorEmail}</div>
                            </div>}

                            {otpSent && !otpVerify && <div className=' flex flex-col gap-5'><div className='relative flex flex-col justify-center items-center'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdPassword className=' text-xl' /></span>
                                <input autoFocus value={form.otp} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type='text' name="otp" id="otp" placeholder='Enter OTP' />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorOtp}</div>
                            </div>
                                <div className='flex justify-center cursor-pointer'><div onClick={() => { varifyOtp() }} className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' >Varify OTP</div></div>
                                <button disabled={disable} type='button' className=' underline  self-center text-blue-800 text-sm cursor-pointer' onClick={() => { resendOtp() }}>Resend OTP <span className={!disable ? 'hidden' : ''}>({timeLeft}s)</span></button>
                            </div>}

                            {otpVerify && <><div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><RiLockPasswordFill className=' text-xl' /></span>
                                <input autoFocus ref={passref} value={form.password} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} placeholder='Enter new Password' type="password" name="password" id="password" />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorPass}</div>
                                <span id='eye' onMouseDown={() => handleEye()} onMouseUp={() => handleCloseEye()} className=' cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] '>{!eye ? <VscEye className='text-xl' /> : <VscEyeClosed />}</span>

                            </div >
                                <div className='flex  justify-center'>{onSave ? <button onClick={() => handleConfirm()} type="button" className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800'>Confirm</button> : <button onClick={() => handleConfirm()} type="button" className=' cursor-not-allowed disabled:opacity-60 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800'>Confirm</button>}</div>
                            </>}

                        </div>
                        {!otpSent && !otpVerify && <div className='flex justify-center items-center flex-col gap-4'>
                            {onSave ? <button className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Send OTP</button> : <button disabled className=' cursor-not-allowed disabled:opacity-60 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Send OTP</button>}

                        </div>}


                    </form>
                </div>

            </div>
        </>
    )
}

export default Resetpass
