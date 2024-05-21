
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import Signup from './components/Signup'
import Signin from './components/Signin'
import { useSelector, useDispatch } from 'react-redux'
import { login } from "./redux/login"
import axios from "axios"
import { useEffect } from "react"
import Resetpass from './components/Resetpass'
import toast, { Toaster } from 'react-hot-toast';
import Loader from './components/Loader'
import { loading } from './redux/loading'
import Varifyacc from './components/Varifyacc'



axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.loading.value);

  const sendReq = async () => {

    dispatch(loading());
    try {
      const res = await axios.post("http://localhost:3000/auth/refreshsignin", {withCredentials: true});
      if (res.status == 200){
        dispatch(login());
        toast.success("Loggin Session Restored")
      } 
    } catch (error) {
      console.log(error);
      if(error.response.status==404){
        console.log("token not found");
      }else if(error.response.status==401){
        console.log("Invalid token");
      }
    }
    dispatch(loading())
  }
  useEffect(() => {
    sendReq();
  }, [])


  return (
    <>
      <BrowserRouter>
        {isLoading && <Loader />}
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/resetpassword' element={<Resetpass />} />
          <Route path='/varifyaccount' element={<Varifyacc />} />

        </Routes>
        <Toaster position="bottom-center"
          reverseOrder={false} toastOptions={{
            className: '',
            style: {
              width: '100vw',
              border: '1px solid #713200',
              padding: '16px',
              backgroundColor: '#000000',
              color: '#ffff'
            },
          }} />

      </BrowserRouter>
    </>
  )
}

export default App
