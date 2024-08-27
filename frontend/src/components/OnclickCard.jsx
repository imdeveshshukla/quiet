import React, { useRef, useState, useEffect } from 'react'
import Profilecard from './Profilecard'
import { FaAddressCard } from "react-icons/fa";


const OnclickCard = ({room}) => {
    const [showCard, setShowCard] = useState(false);


    return (<>
        <div >
            <button className=' text-2xl xxs:text-3xl rounded-full bg-white p-2 hover:text-blue-700 text-blue-500' onClick={() => setShowCard(!showCard)}><FaAddressCard/></button>
            {showCard && <Card room={room} setShowCard={setShowCard} />}
        </div>
    </>
    )
}

export default OnclickCard

export const Card = ({setShowCard, room}) => {
    const cardRef= useRef(null);


    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
          setShowCard(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    return (
        <div className=' 1_5md:hidden fixed top-[74.46px] z-50 left-0 w-[100vw] h-[calc(100vh-74.46px)] bg-black bg-opacity-50 backdrop-blur-sm '>
            <span  ref={cardRef}  className='fixed left-[50%] top-[50%]  translate-x-[-50%] translate-y-[-50%]'>
            <Profilecard room={room}/>
            </span>
        </div>
    )
}