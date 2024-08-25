
import { useRef, useState, useEffect } from "react"
import { GrGallery } from "react-icons/gr";
import {IoClose} from "react-icons/io5"
import { MdDelete } from "react-icons/md";
import SmallLoader from "../components/SmallLoader";
import axios from "axios";
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux'
import { addOwnedRoom } from "../redux/user";
import SmoothLoader from "../assets/SmoothLoader";
import { addNewRoom } from "../redux/userRooms";
import baseAddress from "../utils/localhost";
export default function CreateRoom({showRoom1,setShow,setShow2,heading})
{
    
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [image,setImage] = useState(null);
    const [error,setError] = useState("Title Required!");
    const [titleRequired,setTitleRequired] = useState(true);
    const [fetching,setFetching] = useState(false);
    const [Btnloading,setBtnloading] = useState(false);
    const [privacyOption, setPrivacyOption] = useState(false);
    const [color,setColor] = useState("black");
    const [firstPage,setFirstPage] = useState(showRoom1);
    const dispatch = useDispatch();
    const selectFile = useRef(null);
    const roomRef= useRef(null);
    const handleChange = (e) => {
        setImage(e.target.files[0]);
    }
    const containsWhitespace = str => /\s/.test(str);
    const handleSubmit = async()=>{
      const privacy = privacyOption?"true":"false"
      const formData = new FormData();
      try{
        formData.append('title',title);
        formData.append('desc',description);
        formData.append('roomImg',image||"");
        formData.append('privacy',privacy);
        setBtnloading(true);
        const res = await axios.post(baseAddress+'rooms/create',formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if(res.status == 201)
        {
          dispatch(addOwnedRoom(res.data.newRoom));
          toast.success("Room Created Successufully");
        }
        else{
          // toast.dismiss();
          // toast.error("Error :"+res.data.msg);
          toast.error("Server Issue");
          
        }
        
      }
      catch(e)
      {
        // toast.dismiss();
        // toast.error(e)
        toast.error("Got Some Error");
        console.log("IN Catch = "+e);
      }
      finally{
        setBtnloading(false);
        setShow(false);
        setShow2(false);
      }
    }
    const next = ()=>{
      if(titleRequired)return;
      if(firstPage)
      {
        setTitle(title);
        setDescription(description);
        setImage(image);
        setFirstPage(false);

      }
      else{
        console.log(privacyOption);
        
      }
    }
    const prev = ()=>{
      setFirstPage(true);
    }

    
    

    async function sendReq(){
      const title2 = title.trim();
      const res = await axios.get(baseAddress+"rooms/titleNameIsUnique?filter="+title2);
      if(res.data.msg == true)
      {
        setColor("green");
        setError(` Username is available`)
        setTitleRequired(false);
      }
      else{
        setColor("red");
        setError(`Sorry ${title} is not available`);
        setTitleRequired(true);
      }
      setFetching(false);
      return res.data;
    }

    let timeout;
    var debounce = function(func, delay) {
      clearTimeout(timeout);

      timeout = setTimeout(func, delay);
    };
    useEffect(() => {
      if(title.length == 0)
      {
        setError("Title required!");
        setTitleRequired(true);
        setColor("red");
      }
      else if(title.length < 3){
        setTitleRequired(true);
        setColor("red");
        setError("Title Length Should be greater then 3!");
      }
      else if(containsWhitespace(title)){
        setTitleRequired(true);
        setColor('red');
        setError("Title should not contain spaces!!");
      }
      else{
        setError("");
        setFetching(true);
        setColor("black");
        debounce(sendReq,500);
      }
    }, [title])
    


    const handleClickOutside = (event) => {

      if (roomRef.current && !roomRef.current.contains(event.target)) {
        setShow(false);
        setShow2(false)
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return(<>
        <div className="fixed z-50 bg-[#0005] top-0 left-0 backdrop-blur-sm min-h-screen min-w-[100vw]  pb-10">
      <div ref={roomRef} className=" absolute w-[85%] xs:w-[75%] sm:w-[60%] md:w-[50%] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] overflow-auto bg-[#d5d6b5] shadow-md shadow-current rounded-lg px-6 py-5 ">
        <div  className="heading flex justify-between">
          <h2 className="text-xl font-bold mb-4 text-[#656923]">{firstPage?heading:"What Kind of Room is this?"}</h2>
          <button className="hover:bg-black w-5 h-5 rounded-full" onClick={() => { showRoom1?setShow(false):setShow2(false) }}>
            <IoClose className="text-[#656923] m-auto" />
          </button>
        </div>
        

        {
          firstPage?
          //Details 1
        <>

          <div className="mb-4 relative">
              <div className="mb-5">
                <label htmlFor="username-success" 
                className={`block mb-2 text-sm font-medium text-[#656923]`}
                >Room name</label>
                <input type="text" 
                className={`bg-${color}-50 border border-${color}-500 text-${color}-900 placeholder-${color}-700 text-sm rounded-lg focus:ring-${color}-500 focus:border-${color}-500 block w-full p-2.5 `}
                placeholder="ietClub_"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}/>
                <p className={`mt-2 text-sm text-${color}-600`}>
                  {!titleRequired?<span className="font-medium text-green-700">Alright!</span>:<></>}
                  {error}
                  </p>
              </div>
              <div className="absolute top-9 right-3">
                {fetching?<SmoothLoader/>:<></>}
              </div>
          </div>
          <div className="mb-4">
          <label htmlFor="username-success" 
                className={`block mb-2 text-sm font-medium text-[#656923]`}
                >{"Description(Optional)"}</label>
            <textarea
              id="content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#656923] h-40 resize-none"
              placeholder="Tell us about your room"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-[#656923] font-bold mb-1">
              Icon
            </label>
            <div className="flex">
              <div className=" text-sm text-blue-900 line-clamp-1 ml-2 break-words mb-2 underline cursor-not-allowed block">{image?.name}</div>
              {
                  (image)?<button className=" w-5 h-5 rounded-full" onClick={() => { setImage("") }}>
                      <MdDelete  className="text-blue-900 hover:text-black m-auto" />
                  </button>
                  :<></>
              }
            </div>
            <div>
              <button onClick={() => selectFile.current?.click()}
                className='flex items-center gap-2 border-2 text-blue-800 rounded-3xl border-blue-800 px-3 py-1 bg bg-blue-300 hover:bg-blue-400'
                type="button">
                <span>Upload</span><GrGallery /></button>
            </div>
            <input onChange={(e) => handleChange(e)} accept='image/*' ref={selectFile} type="file" name="media" id="media" hidden />
          </div>
          <div className="flex justify-end">

            <button
            onClick={next}
            className={titleRequired?"bg-[#656923] w-32 1_5md:w-48 text-sm text-black font-bold py-2 px-4 rounded focus:outline-none cursor-not-allowed":"bg-[#656923] hover:bg-[#a9aa88] w-48 text-sm text-black font-bold py-2 px-4 rounded focus:outline-none"}>
            {"Save & Next"}
          </button>

          </div>
        </>
              :
              <>
                <div>
                
                <legend className="text-md font-semibold leading-6 text-gray-900">Privacy options:</legend>
                <div className="my-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="RoomInput"
                        type="radio"
                        value="public"
                        checked={privacyOption==false}
                        onChange={(e)=> setPrivacyOption(false)}
                        className="h-4 w-4 rounded border-gray-300 cursor-pointer text-[#656923] focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="comments" className="font-medium cursor-pointer text-gray-900">
                        Public
                      </label>
                      <p className="text-gray-500">Open For All</p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="RoomInput"
                        type="radio"
                        value="private"
                        checked={privacyOption==true}
                        onChange={(e)=>setPrivacyOption(true)}
                        className="h-4 w-4 rounded border-gray-300 text-[#656923] cursor-pointer focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="candidates" className="font-medium cursor-pointer text-gray-900">
                        Private
                      </label>
                      <p className="text-gray-500">Only You can add to people</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-6">
                <button
                  onClick={prev}
                  className="bg-[#656923] hover:bg-[#a9aa88] w-20 text-sm text-black py-2 font-bold px-4 rounded focus:outline-none">
                  {"Back"}
                </button>
                <button
                onClick={handleSubmit}
                className="bg-[#656923] hover:bg-[#a9aa88] w-20 text-sm flex justify-center text-black px-4 py-2 font-bold text-justify rounded focus:outline-none">
                {Btnloading ? <SmoothLoader /> : "Create"}
              </button>

              </div>
              </>
        }

        
      </div>
    </div>
    </>
  )
}
