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



const Varifyacc = () => {
    const passref = useRef();
    const Navigate = useNavigate();
    const dispatch = useDispatch()
    const [otpSent, setotpSent] = useState(false)
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorOtp, setErrorOtp] = useState(null);
    const [onSave, setOnSave] = useState(true);
    const [form, setform] = useState({ email: "", otp: "" })
    const [varifyOtpData, setVarifyOtpData] = useState({ userID: "", email: "", otp: "" });



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
        console.log(e.target.value);
        console.log();
        setVarifyOtpData({ ...varifyOtpData, [e.target.name]: e.target.value })
        setOnSave(true)
        setErrorOtp(null)
        setErrorEmail(null)
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
                if (res.status == 202) {
                    setVarifyOtpData({ ...varifyOtpData, userID: res.data.userID, email: res.data.email })
                    setotpSent(true)
                    toast.success("Your OTP is on its way !")
                }


            } catch (error) {
                console.log(error);

                if (error.response.status == 404) {
                    setErrorEmail("User doesn't exists !");
                    setOnSave(false)
                }
                else if (error.response.status == 500) {
                    toast.error("Error sending OTP !  Try Again")
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
                toast.success("Your OTP is on its way !");
                setVarifyOtpData({ ...varifyOtpData, userID: res.data.userID, email: res.data.email })
            }
        } catch (error) {
            console.log(error);
            if (error.response.status == 500) {
                toast.error("Error sending OTP! Try again.")
            }

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
                toast.success("Email has been successfully varified!");
                Navigate("/signin");
            }


        } catch (error) {
            console.log(error);
            if (error.response.status == 403) {
                setErrorOtp("Otp is Expired! Resend it.")
                setform({...form,otp:""})
            } else if (error.response.status == 401) {
                toast.error("Invalid OTP !")
                setform({...form,otp:""})

                setOnSave(false);
            }

        }
        dispatch(loading())
    }







    return (
        <>
            <div className='w-full flex justify-center items-center h-[80vh] m-auto  '>
                <div className='w-[35%] h-[60%] bg-[#6d712eb8] rounded-2xl shadow-2xl shadow-current '>

                    <form autoComplete='off' className='flex flex-col justify-evenly px-20 rounded-2xl backdrop-blur-3xl   gap-4 h-[100%]' onSubmit={(e) => { handleSubmit(e) }}>





                        <div className='flex flex-col gap-8'>

                            {!otpSent && <div className='relative flex flex-col'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdOutlineMailLock className=' text-xl' /></span>
                                <input value={form.email} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type="email" name="email" id="email" placeholder='Enter Email' />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorEmail}</div>
                            </div>}

                            {otpSent && <div className=' flex flex-col gap-5'><div className='relative flex flex-col justify-center items-center'>
                                <span className='absolute left-2 top-[50%] translate-y-[-50%]'><MdPassword className=' text-xl' /></span>
                                <input autoFocus value={form.otp} className='text-white focus:border-white transition-all ease-in delay-200 outline-none px-10 w-full  bg-transparent border-b-2 border-black py-2' onChange={(e) => { handleChange(e) }} type='text' name="otp" id="otp" placeholder='Enter OTP' />
                                <div role="alert" style={{ color: "red", fontSize: "12px" }}>{errorOtp}</div>
                            </div>
                                <div className='flex justify-center cursor-pointer'><button type='button' onClick={() => { varifyOtp() }} className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' >Varify OTP</button></div>
                                <div className=' underline  self-center text-blue-800 text-sm cursor-pointer' onClick={() => resendOtp()}>Resend OTP</div>
                            </div>}



                        </div>
                        {!otpSent && <div className='flex justify-center items-center flex-col gap-4'>
                            {onSave ? <button className=' rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Send OTP</button> : <button disabled className=' cursor-not-allowed disabled:opacity-60 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800' type="submit">Send OTP</button>}

                        </div>}


                    </form>
                </div>

            </div>
        </>
    )
}

export default Varifyacc
