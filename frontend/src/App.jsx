
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import Signup from './components/Signup'
import Signin from './components/Signin'
import { useSelector, useDispatch } from 'react-redux'
import {login} from "./redux/login"
import axios from "axios"
import { useEffect } from "react"
import Resetpass from './components/Resetpass'
import { Toaster } from 'react-hot-toast';


axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch()

  const sendReq=async()=>{
    const res = await axios.post("http://localhost:3000/auth/refreshsignin", {
            withCredentials: true
        }).catch((err)=>{console.log(err);
        }
        )
          if(res && res.status==200) dispatch(login());
          else console.log("Token expired , login again!!");   
  }
  useEffect(() => {
    sendReq();
  }, [])
  

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/resetpassword' element={<Resetpass/>}/>
      </Routes>
      <Toaster position="bottom-center"
  reverseOrder={false} toastOptions={{
    className: '',
    style: {
      width:'100vw',
      border: '1px solid #713200',
      padding: '16px',
      backgroundColor: '#000000',
      color: '#ffff'
    },
  }}/>

    </BrowserRouter>
    </>
  )
}

export default App
