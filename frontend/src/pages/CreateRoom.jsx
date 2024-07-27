import { useRef, useState } from "react"
import { GrGallery } from "react-icons/gr";
import {IoClose} from "react-icons/io5"
import { MdDelete } from "react-icons/md";
import SmallLoader from "../components/SmallLoader";

export default function CreateRoom({showRoom1,setShow,setShow2,heading})
{
    
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [image,setImage] = useState("");
    const [Btnloading,setBtnloading] = useState(false)

    const selectFile = useRef(null);
    const handleChange = (e) => {
        setImage(e.target.files[0]);
        console.log("Image = " ,e.target.files[0] )
    }

    const handleSubmit = ()=>{
      if(showRoom1)
      {
        setShow(false);
        setShow2(true);

      }
      else{

      }
    }
    const prev = ()=>{
      setShow(true)
      setShow2(false)
    }


    return(
        <div className="fixed z-10 bg-[#0005] top-0 left-0 backdrop-blur-sm min-h-screen min-w-full  pb-10">
      <div className=" absolute w-[50%] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] overflow-auto bg-[#d5d6b5] shadow-md shadow-current rounded-lg px-6 py-5 biggerTablet:h-5/6">
        <div  className="heading flex justify-between">
          <h2 className="text-xl font-bold mb-4 text-[#656923]">{heading}</h2>
          <button className="hover:bg-black w-5 h-5 rounded-full" onClick={() => { setShow(false) }}>
            <IoClose className="text-[#656923] m-auto" />
          </button>
        </div>
        

        {
          showRoom1?
          //Details 1
        <>

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
          <div className="mb-4">
            <textarea
              id="content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#656923] h-40 resize-none"
              placeholder="Description(Optional)"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-[#656923] font-bold mb-1">
              Icon
            </label>
            <div className="flex">
              <div className=" text-sm text-blue-900 line-clamp-1 ml-2 break-words mb-2 underline cursor-not-allowed block">{image?.name}</div>
              {
                  (image!="")?<button className=" w-5 h-5 rounded-full" onClick={() => { setImage("") }}>
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
          <button
          onClick={handleSubmit}
          className="bg-[#656923] hover:bg-[#a9aa88] w-full text-xl text-black font-bold py-2 px-4 rounded focus:outline-none">
          {Btnloading ? <SmallLoader /> : "Save & Next"}
        </button>
        </>
              :
              <>
                <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">Privacy</legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="radio"
                        className="h-4 w-4 rounded border-gray-300 text-[#656923] focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="comments" className="font-medium text-gray-900">
                        Public
                      </label>
                      <p className="text-gray-500">Open For All</p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="radio"
                        className="h-4 w-4 rounded border-gray-300 text-[#656923] focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="candidates" className="font-medium text-gray-900">
                        Private
                      </label>
                      <p className="text-gray-500">Only You can add to people</p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="flex justify-between">
                <button
                  onClick={prev}
                  className="bg-[#656923] hover:bg-[#a9aa88] w-full text-xl text-black font-bold py-2 px-4 rounded focus:outline-none">
                  {Btnloading ? <SmallLoader /> : "Back"}
                </button>
                <button
                onClick={handleSubmit}
                className="bg-[#656923] hover:bg-[#a9aa88] w-full text-xl text-black font-bold py-2 px-4 rounded focus:outline-none">
                {Btnloading ? <SmallLoader /> : "Create Room"}
              </button>

              </div>
              </>
        }

        
      </div>
    </div>
    )
}