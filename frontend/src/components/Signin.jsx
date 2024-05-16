import React, { useRef, useState } from 'react'
import { Layout } from './Signup';
const Signin = () => {
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
    const resetPassword=()=>{
        console.log("reset");
        
    }
    return (
        <Layout purpose={"Sign In"} passref={passref} eye={eye} handleEye={handleEye} handleChange={handleChange} handleSubmit={handleSubmit} handleCloseEye={handleCloseEye} resetPassword={resetPassword}/>
    )
}

export default Signin
