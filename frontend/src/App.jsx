
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import Signup from './components/Signup'
import Signin from './components/Signin'
import { useEffect, useState } from "react"
import axios from "axios"
import Resetpass from './components/Resetpass'
import Varifyacc from './components/Varifyacc'
import toast, { Toaster } from 'react-hot-toast';
import Loader from './components/Loader'
import { login } from "./redux/login"
import { loading } from './redux/loading'
import { useSelector, useDispatch } from 'react-redux'
import User, { setUserInfo } from './redux/user'
import Settings from './components/Settings'
import Profile from './components/Profile'
import Sidenav from './components/Sidenav'
import Posts from './components/Posts'
import Overview from './components/Overview'
import Upvoted from './components/Upvoted'
import Commented from './components/Commented'
import Profilecard from './components/Profilecard'
import Postdetail from './components/Postdetail'
import Postskelton from './components/Postskelton'
import { setSkeltonLoader } from './redux/skelton'
import { v4 as uuidv4 } from 'uuid';
import Userpost from './components/Userpost'







axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.value);
  const isLogin = useSelector((state) => state.login.value);
  const userInfo = useSelector(state => state.user.userInfo);

  const posts = useSelector(state => state.post.posts)
  const location = useLocation();
  const isSkelton = useSelector(state => state.skelton.value);



  const getUserData = async (email) => {

    // dispatch(loading())

    try {
      const res = await axios.get(`http://localhost:3000/u/${email}`, { withCredentials: true });
      console.log(res.data.user);
      if (res.status == 200) {
        dispatch(setUserInfo(res.data.user));
      }
    } catch (error) {
      console.log(error);

    }
    // dispatch(loading())
  }





  const sendReq = async () => {

    // dispatch(loading());
    dispatch(setSkeltonLoader());

    try {
      const res = await axios.post("http://localhost:3000/auth/refreshsignin", { withCredentials: true });
      if (res.status == 200) {
        toast.success("Loggin Session Restored")
        dispatch(login());
        getUserData(res.data);
        //  await getPost();

      }
    } catch (error) {
      console.log(error);
      // await getPost();

      if (error.response.status == 404) {
        console.log("token not found");
      } else if (error.response.status == 401) {
        console.log("Invalid token");
      }
    }
    // dispatch(loading())
    dispatch(setSkeltonLoader());

  }



  useEffect(() => {
    sendReq();
  }, [])





  return (
    <>

      {isLoading && <Loader />}

      <Navbar />
      <div className=' grid grid-cols-[1fr_3fr_1.3fr] relative'>
        <Sidenav />
        <Routes>

          <Route path='/' element={<Home />} />


          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/resetpassword' element={<Resetpass />} />
          <Route path='/varifyaccount' element={<Varifyacc />} />
         
            <Route path='/profile/overview' element={<Overview />} />
            <Route path='/profile/posts' element={<Userpost/>}/>
            <Route path='/profile/commented' element={<Commented />} />
            <Route path='/profile/upvoted' element={<Upvoted />} />

          <Route path='/setting/' element={<Settings />} />
          <Route path="/test/" element={<Postskelton />} />
          <Route path='/posts/:id' element={isSkelton ? <Postskelton /> : <Postdetail />} />
        </Routes>
        {String(location.pathname).includes("/profile/") ? <Profilecard /> : ''}
      </div>
      <Toaster position="bottom-center"
        reverseOrder={false} toastOptions={{
          className: '',
          style: {

            width: '100vw',
            border: '1px solid #713200',
            padding: '16px',
            backgroundColor: '#000000',
            color: '#ffff',
          }
        }} />

    </>
  )
}

export default App


// userInfo?.posts == null ? <Postskelton /> :
                //   userInfo.posts.map(post => {
                //     return (
                //       isSkelton ? <Postskelton key={uuidv4()} /> : <Posts key={post.id} id={post.id} title={post.title} body={post.body} media={post.img} countComment={post.comments?.length} createdAt={post.createdAt} user={post.user} />
                //     )
                //   }
                //   )
