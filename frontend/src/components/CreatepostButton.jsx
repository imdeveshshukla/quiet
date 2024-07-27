import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loading } from '../redux/loading';
import { GrGallery } from "react-icons/gr";
import dp from '../assets/dummydp.png';
import axios from 'axios';
import { clearPostsInfo, setPost } from '../redux/Post';
import toast from 'react-hot-toast';
import { setUserInfo, setUserPost } from '../redux/user';
import SmallLoader from './SmallLoader'
import { setSkeltonLoader } from '../redux/skelton';
import { useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import CreatePost from '../pages/CreatePost';


const Createpost = ({ onNewPost }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const selectFile = useRef(null);
  const Navigate = useNavigate()
  const [Btnloading, setLoading] = useState(false);
  const [showCP, setShowCP] = useState(false)
  const dispatch = useDispatch();


  const [selectedOption, setSelectedOption] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
    console.log("Image = " + image);
  }

  const handleSelectChange = (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    console.log(title + "\n" + description + "\n" + selectedOption);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('topic', selectedOption);
    formData.append('body', description);
    formData.append('postImg', image);
    console.log(formData);


    setLoading(true);
    toast.loading("Posting....");
    try {
      const response = await axios.post('http://localhost:3000/posts/postWithImg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.post);
      if (response.status == 201) {
        // dispatch(setPost(response.data.post));
        // dispatch(setUserPost(response.data.post))
        toast.dismiss();
        toast.success("Successfully Posted!")
        setTitle("")
        setDescription("")
        setSelectedOption("")
        setImage(null)
        // getUserData(userInfo.email);
        onNewPost()
      }
    } catch (error) {
      toast.dismiss()
      toast.error("Error uploading the post!")
      console.error('Error uploading the post:', error);
    }
    setLoading(false);
  }

  return (
    <>
      {showCP && <CreatePost showCP={showCP} onNewPost={onNewPost} setShowCP={setShowCP} />}
      <div className=' p-8 flex relative justify-center gap-4' >
        <div onClick={() => { setShowCP(true) }} className='w-[60%] cursor-pointer'>
          <div className="hover:cursor-pointer hover:bg-[#d1d1ab] -z-10 relative flex flex-col gap-2 py-2 px-14  border rounded-xl bg-[#e2e4c6] shadow-md shadow-current justify-center">
            <div className="relative flex gap-2 items-center">
              <IoMdAddCircleOutline size={30} className='text-[#656923]' />
              <p className='text-[#353333]  font-bold'>Start a post...</p>
            </div>
          </div>
        </div>
      </div>
    </>)

}

export default Createpost
