
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './styles/App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import { useEffect, useState } from "react"
import axios from "axios"
import Resetpass from './pages/Resetpass'
import Varifyacc from './pages/Varifyacc'
import toast, { Toaster } from 'react-hot-toast';
import Loader from './components/Loader'
import { login, logout } from "./redux/login"

import { useSelector, useDispatch } from 'react-redux'
import { setUserInfo, clearUserInfo } from './redux/user'
import Settings from './pages/Settings'
import Sidenav from './components/Sidenav'
import { ErrorBoundary } from 'react-error-boundary';
import Overview from './pages/Overview'
import baseAddress from "./utils/localhost";
import Postdetail from './components/Postdetail'
import Postskelton, { CommentSkelton, PollSkelton, ProfileSkelton } from './components/Postskelton'
import { setSkeltonLoader } from './redux/skelton'
import HotTopicPosts from './pages/HotTopicPosts'
import sportsdp from './assets/sportsdp.jpg'
import sportsbg from './assets/sportsbg.jpg'
import ietdp from './assets/ietdp.png'
import ietbg from './assets/ietbg.jpeg'
import dsabg from './assets/dsabg.png'
import dsadp from './assets/dsadp.jpg'
import enterdp from './assets/enterdp.jpg'
import enterbg from './assets/enterbg.png'
import lkodp from './assets/lkodp.jpg'
import lkobg from './assets/lkobg.jpg'
import lifedp from './assets/lifedp.jpeg'
import lifebg from './assets/lifebg.jpg'
import { setNotification } from './redux/Notification'
import Rightnav from './components/Rightnav'
import DisplayProfile from './pages/DisplayProfile'
import ProfileComments from './pages/ProfileComments'
import Profileupvoted from './pages/Profileupvoted'
import ProfilePosts, { ProfilePostOrPoll } from './pages/ProfilePosts'
import Search from './components/Search';
import { setShowSearch } from './redux/search';
import Room from './pages/Room'
import { useRef } from 'react'
import NotFound from './pages/NotFound'
import Popular from './pages/Popular'
import ForbiddenPage from './pages/ForbiddenPage'
import loading from './redux/loading'
import About, { WelcomePage } from './components/About'
import { hide } from './redux/welcome'
import CreatePost, { CreatePoll, CreatePostorPoll } from './pages/CreatePost'
import Polls from './components/Polls'
import PollDetail from './components/PollDetail'
import ConfirmWindow from './components/ConfirmWindow'





axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch();
  // const isLoading = useSelector((state) => state.loading.value);
  const [isLoading, setLoading] = useState(false);
  const isLogin = useSelector((state) => state.login.value);
  const userInfo = useSelector(state => state.user.userInfo);
  const searchRef = useRef(null)
  const welcomeRef = useRef(null)
  const posts = useSelector(state => state.post.posts)
  const location = useLocation();
  const isSkelton = useSelector(state => state.skelton.value);
  const showSearch = useSelector(state => state.search.value)
  const showWelcome = useSelector(state => state.welcome.value)

  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const visited = localStorage.getItem('visited');
    if (!visited) {
      setIsFirstVisit(true);
      localStorage.setItem('visited', 'true');
    }
  }, []);

  const myAllRoom = useSelector(state => state.rooms.rooms);




  useEffect(() => {
    window.scrollTo(0, 0);
    if ((location.pathname.endsWith("/signin") || location.pathname.endsWith("/signup")) && isLogin) {
      navigate("/");
      toast('You are already logged in!', {
        icon: 'ℹ️',
      });
    }
  }, [isLogin, location.pathname]);









  const getUserNotification = async () => {
    try {
      const res = await axios.get(`${baseAddress}u/notification`, { withCredentials: true });
      dispatch(setNotification(res.data.data))
    } catch (error) {
      console.log(error);
      if (error?.response?.status == 401) {
        dispatch(logout());
        dispatch(clearUserInfo());
        toast.error("Login session expired!");
      }
    }
  }




  const sendReq = async () => {
    dispatch(setSkeltonLoader());
    try {
      const res = await axios.post(`${baseAddress}auth/refreshsignin`, { withCredentials: true });
      if (res.status == 200) {



        await getUserData({ email: res.data, dispatch });
        toast("Loggin Session Restored", {
          icon: 'ℹ️',
        })
        dispatch(login());
        getUserNotification();
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status == 404) {
        console.log("token not found");
      } else if (error.response?.status == 401) {
        console.log("Invalid token");
      }
    }
    dispatch(setSkeltonLoader());
  }




  useEffect(() => {
    if (!isLogin)
      sendReq();  //Faltu ka request send kar when we are loggin out fix later
    let intervalId;
    if (isLogin)
      intervalId = setInterval(getUserNotification, 30000);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLogin]);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      dispatch(setShowSearch(false))
    }
    if (welcomeRef.current && !welcomeRef.current.contains(event.target)) {
      dispatch(hide())
      setIsFirstVisit(false)
    }
  };



  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);







  const room = location.pathname.includes('/room');

  return (
    <>
      {isLoading && <Loader />}

      <Navbar />
      <div className=' grid  1_5md:grid-cols-[3fr_1.5fr]  xl:grid-cols-[1.3fr_3fr_1.5fr] 1_5xl:grid-cols-[1.2fr_3fr_1.5fr] '>

        <Sidenav />


        <div className='md:border-r-2  xl:border-x-2 border-black '>
          <ErrorBoundary fallback={<NotFound gotError={true} />}>
            <Routes>
              <Route path='/' element={<Home />} />
              {!isLogin && <Route path='/signup' element={<Signup />} />}
              {!isLogin && <Route path='/signin' element={<Signin />} />}
              {!isLogin && <Route path='/resetpassword' element={<Resetpass />} />}
              <Route path='/varifyaccount' element={<Varifyacc />} />


              <Route path='/popular' element={<Popular />} />
              <Route path='/confirm' element={<ConfirmWindow />} />


              <Route path='create' element={<CreatePostorPoll/>}>
                <Route path='poll' element={<CreatePoll/>} />
                <Route path='post' element={<CreatePost/>} />
              </Route>



              <Route path='u/:username' element={<DisplayProfile />} >
                <Route path='overview' element={<Overview />} />
                <Route path='posts' element={<ProfilePostOrPoll />} />
                <Route path='upvoted' element={<Profileupvoted />} />
                <Route path='commented' element={<ProfileComments />} />
              </Route>

              <Route path='/post/:roomid/:id' element={<Postdetail myRooms={myAllRoom} />} />

              <Route path='/post/:id' element={ <Postdetail />} />
              <Route path='/poll/:id' element={ <PollDetail />} />

              <Route path='/q/sports' element={<HotTopicPosts topic={"sports"} title={"Sports"} dp={sportsdp} bg={sportsbg} />} />
              <Route path='/q/lucknow' element={<HotTopicPosts topic={"lucknow"} title={"Lucknow"} dp={lkodp} bg={lkobg} />} />
              <Route path='/q/iet' element={<HotTopicPosts topic={"iet"} title={"IET-Lucnow"} dp={ietdp} bg={ietbg} />} />
              <Route path='/q/lifestyle' element={<HotTopicPosts topic={"lifestyle"} title={"LifeStyle"} dp={lifedp} bg={lifebg} />} />
              <Route path='/q/entertainment' element={<HotTopicPosts topic={"entertainment"} title={"Entertainment"} dp={enterdp} bg={enterbg} />} />
              <Route path='/q/dsa' element={<HotTopicPosts topic={"dsa"} title={"DS&A"} dp={dsadp} bg={dsabg} />} />
              <Route path='/setting/' element={<Settings />} />
              <Route path="/test/" element={<Postskelton />} />
              <Route path="/about/" element={<About />} />
              <Route path="/poll" element={<Polls user={userInfo} />} />

              {/* <Route path='/room/:username/:title' element={<Room />} /> */}

              <Route path='/room/:CreatorId/:title' element={<Room />} />
              <Route path='*' element={<NotFound />} />
              <Route path='/room/:CreatorId/:title' element={isLogin ? <Room /> : <ForbiddenPage />} />
            </Routes>
          </ErrorBoundary>
        </div>

        <Rightnav />




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
      {showSearch && (
        <>
          <div className="fixed inset-0  bg-black bg-opacity-50 backdrop-blur-sm z-30 w-full h-full"></div>
          <div ref={searchRef} className="fixed top-[60px] z-50 left-[50%] translate-x-[-50%]">
            <Search />
          </div>
        </>
      )}

      {isFirstVisit && <>
        <div className='fixed top-[74.46px] z-50 left-0 w-[100vw] h-[calc(100vh-74.46px)] bg-black bg-opacity-50 backdrop-blur-sm '>

          <span ref={welcomeRef} className='fixed left-[50%] top-[50%]  translate-x-[-50%] translate-y-[-50%]'>
            <WelcomePage setIsFirstVisit={setIsFirstVisit} />
          </span>
        </div>
      </>}



    </>
  )
}

export default App


export const getUserData = async ({ email, dispatch }) => {
  toast.dismiss()
  toast.loading("Signing In")

  dispatch(setSkeltonLoader())

  try {
    const res = await axios.get(`${baseAddress}u/${email}`, { withCredentials: true });


    if (res.status == 200) {

      dispatch(setUserInfo(res.data.user));
    }
  } catch (error) {
    console.log(error);
  }

  dispatch(setSkeltonLoader())
  toast.dismiss()
}