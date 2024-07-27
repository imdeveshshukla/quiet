import { useState } from "react"
import { GrGallery } from "react-icons/gr";
import { IoClose } from "react-icons/io5"
import SmallLoader from "../components/SmallLoader";

export default function CreateRoom({setShow}){
    const [selectedOption,setOPtion] = useState({
        "LOL":"",
        "1":""
    })
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [image,setImage] = useState("");
    const [Btnloading,setBtnloading] = useState(false)
    const handleImg =(e)=>{}
    const handleSubmit = ()=>{

    }
    return(
        <div className="fixed z-10 bg-[#0005] top-0 left-0 backdrop-blur-sm min-h-screen min-w-full  pb-10">
      <div className=" absolute w-[50%] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] overflow-auto bg-[#d5d6b5] shadow-md shadow-current rounded-lg px-6 py-5 biggerTablet:h-5/6">
        <div  className="heading flex justify-between">
          <h2 className="text-xl font-bold mb-4 text-[#656923]">Create Your Room</h2>
          <button className="hover:bg-black w-5 h-5 rounded-full" onClick={() => { setShow(false) }}>
            <IoClose className="text-[#656923] m-auto" />
          </button>
        </div>
        



        {/* Title Input */}
        <div className="mb-4 ">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#656923]"
            placeholder="Write your Room Name"
            required />
        </div>
        {/* Content Textarea */}
        <div className="mb-4">
          <textarea
            id="content"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#656923] h-40 resize-none"
            placeholder=""
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#656923] hover:bg-[#a9aa88] w-full text-xl text-black font-bold py-2 px-4 rounded focus:outline-none">
          {Btnloading ? <SmallLoader /> : "Create"}
        </button>
      </div>
    </div>
    )
}