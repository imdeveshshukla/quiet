import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import SmoothLoader from "../assets/SmoothLoader";
import axios from "axios";
import baseAddress from "../utils/localhost";
import toast from "react-hot-toast";

export default function AddMemBox({setShow,id}){
    const createPostRef = useRef(null);
  const [title, setTitle] = useState('');
  const [Btnloading, setLoading] = useState(false);
  const [color,setColor] = useState("black");
  const userData = useSelector(state => state.user.userInfo);
  const [error,setError] = useState('');
  const [titleRequired,setTitleRequired] = useState(true);
  useEffect(() => {
    if(title.length == 0)
    {
      setError("Username required!");
      setTitleRequired(true);
      setColor("red");
    }
    else if(title === userData?.username)
    {
      setError("Don't Add Yourself in this room");
      setTitleRequired(true);
      setColor("red");
    }
    else{
      setError("");
      setColor("black");
      setTitleRequired(false);
    }
  }, [title])

  const handleSubmit = async () => {
    setLoading(true);
    try{
      const res = await axios.post(`${baseAddress}rooms/addUserinRoom/${title}`,{
        title:id
      });
      console.clear();
      console.log(res);
      const msg = res?.data.msg;
      console.log(msg);
      if(res.status == 201)
      {
        toast.success("Successfully Send Request");
      }
      else{
        toast.error(msg);
      }
      setShow(false); 
      setLoading(false);
    }
    catch(err){
      toast.error(`${err.message}`);
      setShow(false);
      setLoading(false);
    }
  }

  const handleClickOutside = (event) => {
    if (createPostRef.current && !createPostRef.current.contains(event.target)) {
      setShow(false)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


    return (
        <div className="fixed z-40 bg-[#0005] top-0 left-0 backdrop-blur-sm min-h-screen min-w-full  pb-10">
          <div ref={createPostRef} className=" absolute w-[85%] xs:w-[75%] sm:w-[60%] md:w-[50%] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] overflow-auto bg-[#d5d6b5] shadow-md shadow-current rounded-lg px-6 py-5 biggerTablet:h-5/6">
            <div className="heading flex justify-between">
              <h2 className="text-xl font-bold mb-4 text-[#656923]">Add Member</h2>
              <button className="hover:bg-black w-5 h-5 rounded-full" onClick={() => { setShow(false) }}>
                <IoClose className="text-[#656923] m-auto" />
              </button>
            </div>
            


        {/* Title Input */}
        <div className="mb-4 relative">
              <div className="mb-5">
                <label htmlFor="username-success" 
                className={`block mb-2 text-sm font-medium text-[#656923]`}
                >UserName</label>
                <input type="text" 
                className={`bg-${color}-50 border border-${color}-500 text-${color}-900 placeholder-${color}-700 text-sm rounded-lg focus:ring-${color}-500 focus:border-${color}-500 block w-full p-2.5 `}
                placeholder={userData?.username}
                value={title}
                onChange={(e)=>setTitle(e.target.value)}/>
                <p className={`mt-2 text-sm text-${color}-600`}>
                  {!titleRequired?<span className="font-medium text-green-700">Alright!</span>:<></>}
                  {error}
                  </p>
              </div>
          </div>
        
        {/* Submit Button */}

        <button
            onClick={handleSubmit}
            className={titleRequired?"bg-[#656923] w-32 1_5md:w-48 text-sm text-black font-bold py-2 px-4 rounded focus:outline-none cursor-not-allowed":"bg-[#656923] hover:bg-[#a9aa88] w-48 text-sm text-black font-bold py-2 px-4 rounded focus:outline-none"}>
            {Btnloading?<SmoothLoader/>:"Send Request"}
          </button>
      </div>
    </div>
  );
}