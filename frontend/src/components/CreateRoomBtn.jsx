import React, { useState } from 'react'
import CreateRoom from '../pages/CreateRoom'
import { IoAddCircleOutline } from "react-icons/io5";



const CreateRoomBtn = () => {
    const [showRoom1,setShow] = useState(false);
    const [showRoom2,setShow2] = useState(false);
    return (
        <>
            <div onClick={() => setShow(true)}
                className='flex items-center cursor-pointer gap-1 rounded-xl px-2 py-1 font-semibold hover:bg-[#56525252] border-2 border-black '>
                <IoAddCircleOutline className=' text-black text-2xl' />

                <div className="self-center signin cursor-pointer font-normal text-md text-black ">Create Room</div>
            </div>
            {
                showRoom1 && <CreateRoom heading={"Details of Your Room"} showRoom1={showRoom1} setShow={setShow} setShow2={setShow2} />
            }
            {
                showRoom2 && <CreateRoom heading={"What Kind of Room is this?"} showRoom1={showRoom1} setShow={setShow} setShow2={setShow2} />

            }
        </>
    )
}

export default CreateRoomBtn
