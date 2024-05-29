
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import Signup from './components/Signup'
import Signin from './components/Signin'
import { useEffect,useState } from "react"
import axios from "axios"
import Resetpass from './components/Resetpass'
import Varifyacc from './components/Varifyacc'
import toast, { Toaster } from 'react-hot-toast';
import Loader from './components/Loader'
import { login } from "./redux/login"
import { loading } from './redux/loading'
import { useSelector, useDispatch } from 'react-redux'
import { setUserInfo } from './redux/user'
import Settings from './components/Settings'
import Profile from './components/Profile'
import Sidenav from './components/Sidenav'
import Posts from './components/Posts'
import Overview from './components/Overview'
import Upvoted from './components/Upvoted'
import Commented from './components/Commented'
import Profilecard from './components/Profilecard'
import { setPost } from './redux/Post'
import Postdetail from './components/Postdetail'
import { setPostDetail } from './redux/Postdetail'




axios.defaults.withCredentials = true

function App() {

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.value);
  const isLogin = useSelector((state) => state.login.value);
  const userInfo=  useSelector(state=>state.user.userInfo);
  const posts= useSelector(state=> state.post.posts)
  const location = useLocation();

  const getUserData=async(email)=>{ 
 
    dispatch(loading())
    try {
      const res= await axios.get(`http://localhost:3000/u/${email}`, {withCredentials:true});
      console.log(res);
      if(res.status==200){
        dispatch(setUserInfo(res.data));
      }
    } catch (error) {
      console.log(error);
      
    } 
    dispatch(loading())
 }


 const getPost = async()=>{
  try {
    const res = await axios.get('http://localhost:3000/posts/getPost');
    if(res.status==200)
      {
        console.log("getpost", res.data.posts);
        
         dispatch(setPost(res.data.posts));
        //  console.log(res.data.posts);
        //  console.log( String(location.pathname).split("/posts/")[1])
         if(String(location.pathname).split("/posts/")[1]){
         let post= await  Array.from(res.data.posts).find(post=>post.id==String(location.pathname).split("/posts/")[1]);
         console.log(post);
         dispatch(setPostDetail(post))

         }
        
      }
  } catch (error) {
    console.log(error);
  }
}


  const sendReq = async () => {

  dispatch(loading());
    try {
      const res = await axios.post("http://localhost:3000/auth/refreshsignin", {withCredentials: true});
      if (res.status == 200){
        toast.success("Loggin Session Restored")
        dispatch(login());
         await  getUserData(res.data);
         await getPost();

      }
    } catch (error) {
      console.log(error);
      await getPost();

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
     
        {isLoading && <Loader />}

        <Navbar />
        <div className=' grid grid-cols-[1fr_3fr_1.3fr] h-[89.5vh] max-h-[89.5vh] relative'>
          <Sidenav/>
        <Routes>
         
          <Route path='/' exact element={<Home/>} />

         
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/resetpassword' element={<Resetpass />} />
          <Route path='/varifyaccount' element={<Varifyacc />} />
          <Route path='/profile/' element={<Profile/>}>
            <Route path='overview' element={<Overview/>}/>
            <Route path='posts' element={ userInfo?.posts?.map(post=><Posts key={post.id} id={post.id} username={post.username} title={post.title} body={post.body} media={post.img} countComment={post.comments.length}/>)}/>
            <Route path='commented' element={<Commented/>}/>
            <Route path='upvoted' element={<Upvoted/>}/>
            
          </Route>
          <Route path='/setting/' element={<Settings />} />
          <Route path='/posts/:id' element={<Postdetail />} />
        </Routes>
        {String(location.pathname).includes("/profile/")? <Profilecard/>: ''}
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
