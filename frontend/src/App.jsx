
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import { login } from "./redux/login"
import { loading } from './redux/loading'
import { useSelector, useDispatch } from 'react-redux'
import User, { setUserInfo } from './redux/user'
import Settings from './pages/Settings'
import Profile from './components/Profile'
import Sidenav from './components/Sidenav'
import Posts from './components/Posts'
import Overview from './pages/Overview'
import Comments from './components/Comments'
import Profilecard from './components/Profilecard'
import Postdetail from './components/Postdetail'
import Postskelton from './components/Postskelton'
import { setSkeltonLoader } from './redux/skelton'
import Userpost from './pages/Userpost'
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
import ProfilePosts from './pages/ProfilePosts'
import Search from './components/Search';
import { setShowSearch } from './redux/search';
import Room from './pages/Room'
import { useRef } from 'react'




axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.value);
  const isLogin = useSelector((state) => state.login.value);
  const userInfo = useSelector(state => state.user.userInfo);
  const searchRef = useRef(null)
  const posts = useSelector(state => state.post.posts)
  const location = useLocation();
  const isSkelton = useSelector(state => state.skelton.value);
  const showSearch = useSelector(state => state.search.value)




  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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



  const getUserNotification = async () => {
    try {
      const res = await axios.get("http://localhost:3000/u/notification", { withCredentials: true });
      console.log(res.data);
      dispatch(setNotification(res.data.data))
    } catch (error) {
      console.log(error);
    }
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
        getUserNotification();
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
    if (!isLogin)
      sendReq();
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

  };



  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);





  // console.log("HEy this is me");


  return (
    <>
      {isLoading && <Loader />}

      <Navbar />
      <div className=' grid  1_5md:grid-cols-[3fr_1.5fr]  xl:grid-cols-[1.2fr_3fr_1.5fr] 1_5xl:grid-cols-[1fr_3fr_1.5fr] '>

        <Sidenav />


        <div className='  md:border-r-2  xl:border-x-2 border-black'>
          <Routes>
            <Route path='/' element={<Home />} />
            {!isLogin && <Route path='/signup' element={<Signup />} />}
            {!isLogin && <Route path='/signin' element={<Signin />} />}
            <Route path='/resetpassword' element={<Resetpass />} />
            <Route path='/varifyaccount' element={<Varifyacc />} />

            <Route path='u/:username' element={<DisplayProfile />} >
              <Route path='overview' element={<Overview />} />
              <Route path='posts' element={<ProfilePosts />} />
              <Route path='upvoted' element={<Profileupvoted />} />
              <Route path='commented' element={<ProfileComments />} />
            </Route>


            <Route path='/post/:id' element={isSkelton ? <Postskelton /> : <Postdetail />} />
            <Route path='/q/sports' element={<HotTopicPosts topic={"sports"} title={"Sports"} dp={sportsdp} bg={sportsbg} />} />
            <Route path='/q/lucknow' element={<HotTopicPosts topic={"lucknow"} title={"Lucknow"} dp={lkodp} bg={lkobg} />} />
            <Route path='/q/iet' element={<HotTopicPosts topic={"iet"} title={"IET-Lucnow"} dp={ietdp} bg={ietbg} />} />
            <Route path='/q/lifestyle' element={<HotTopicPosts topic={"lifestyle"} title={"LifeStyle"} dp={lifedp} bg={lifebg} />} />
            <Route path='/q/entertainment' element={<HotTopicPosts topic={"entertainment"} title={"Entertainment"} dp={enterdp} bg={enterbg} />} />
            <Route path='/q/dsa' element={<HotTopicPosts topic={"dsa"} title={"DS&A"} dp={dsadp} bg={dsabg} />} />
            <Route path='/setting/' element={<Settings />} />
            <Route path="/test/" element={<Postskelton />} />
            <Route path='/room/:username/:title' element={<Room />} />
          </Routes>
        </div>
       

          {location.pathname.includes("/u/") ? <Profilecard /> : location.pathname.includes("/room/") ? <></> : <Rightnav />}
          {/* {!shouldHideRightnav && <Rightnav />} */}



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
          <div className="fixed inset-0  bg-black bg-opacity-50 backdrop-blur-sm z-10 w-full h-full"></div>
          <div ref={searchRef} className="fixed top-[60px] z-50 left-[50%] translate-x-[-50%]">
            <Search />
          </div>
        </>
      )}

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
