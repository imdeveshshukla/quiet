import React from 'react'
import Createpost from './Createpost'
import { useSelector } from 'react-redux'


const Home = () => {
  const isLogin= useSelector(state=> state.login.value);
  return (
    <div className=' h-full border-x-2 border-black '>
        
        {isLogin && <Createpost/>}
        <div className='bg-black h-[1px]'></div>

    </div>
  )
}

export default Home
