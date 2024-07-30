import axios from "axios";
import { useEffect, useState } from "react";
import baseAddress from "../utils/localhost";
import { useParams } from 'react-router-dom'
import Hottopic from "../components/Hottopic";
import toast from "react-hot-toast";
const Room = function({id}){
    
    const {title,username} = useParams();

    // const [name,setName] = useState("NULL");
    const [img,setImg] = useState(null);
    const [desc,setDescription] = useState("NULL");
    const [bgImg,setBgImg] = useState(null);
    useEffect(() => {
      (async()=>{
        const res = await axios.get(baseAddress+`rooms/getRoom/${title}`);
        if(res.status == 200)
        {
          // setName(res.data.room.title)
          setImg(res.data.room.img);
          setBgImg(res.data.room.bgImg)
          setDescription(res.data.room.desc)
        }
        else{
          // toast.error(res.data.msg);

          console.log(res.data);
        }
      })();
      // return res;
    }, [])
    console.log(username);
    return <div className="w-full">
      <div className=''>
          <div className='border-black border-2 relative shadow-lg shadow-slate-300 rounded-2xl h-48 m-4  '>
              <img className=' w-full h-full object-cover rounded-2xl' src={bgImg} alt="" />
              <div className=' absolute left-14 bottom-0 border-4  translate-y-1/2  h-40 w-40 rounded-full overflow-hidden '>
                  <img className=' h-full w-full object-cover' src={img} alt="" />
              </div>
          </div>
          <div className='flex items-center gap-1 underline justify-end w-full text-center text-4xl font-bold'>
          <div className="bg-black text-white text-sm rounded px-1">{username}/</div><span>{title}</span></div>
          <div className='h-[1.5px] bg-gray-800 mt-10'></div>
      </div>

    </div>
}

export default Room;