import React from 'react'
import Createpost from './Createpost'
import { useSelector } from 'react-redux'
import Posts from './Posts';


const Home = () => {
  const isLogin= useSelector(state=> state.login.value);
  return (
    <div className=' h-full overflow-auto border-x-2 border-black pl-16'>
        
        {isLogin && <Createpost/>}
        <div className='bg-black h-[1px]'></div>

        <div className="post ">
          <Posts/>
        
          <div className='bg-black h-[0.5px]'></div>

        </div>

    </div>
  )
}

export default Home
