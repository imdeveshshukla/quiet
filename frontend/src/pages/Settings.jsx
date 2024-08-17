import React, { useEffect, useState } from 'react'

import { UserCircleIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import LeetCode from '../components/LeetCode.jsx'
import baseAddress from '../utils/localhost.js';
import { useDispatch, useSelector } from 'react-redux';
import { SiLeetcode } from "react-icons/si";
import { addLeetCodeID, setShowLC } from '../redux/user.js';
import SmallLoader from '../components/SmallLoader.jsx';
import Switch from '@mui/material/Switch';



axios.defaults.withCredentials = true


function Settings() {
  const [lcusername, setlcusername] = useState("");
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState("");
  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();
  const [update, setupdate] = useState(false);
  const [show, setShow] = useState(true);
  const [showAlert, setshowAlert] = useState(false);

  const [lcdata, setlcdata] = useState({});
  const [isDisable, setIsDisable] = useState(false)


 

  const addLC = async () => {

    setisLoading(true)

    try {
      let lcdata = await fetch(`https://leetcode-stats-api.herokuapp.com/${lcusername}`);
      let data = await lcdata.json();

      console.log(data);

      if (data.status == "error") {
        seterror("Invalid username");
        return
      }

      const res = await axios.post(`${baseAddress}u/addLeetCode`, {
        lcusername: lcusername,
      });
      console.log(res);
      if (res.status == 200) {
        dispatch(addLeetCodeID(res.data.leetcode));
        setlcdata(data)
        setupdate(false)
      }

    } catch (error) {
      console.log(error);

    }
    setisLoading(false)
  }

  const setShowLc = async (value)=>{
    setIsDisable(true)
    console.log(value);
    
    try {
      const res=await  axios.post(`${baseAddress}u/setLcVisibility`, {
        showLC:value,
      })
       console.log(res);
       if(res.status==200){

       }
       
    } catch (error) {
      console.log(error);
      
    }
    setIsDisable(false)
  }


  const handleChange= (e)=>{
    setShow(e.target.checked); 
    console.log(e.target.checked);
    setShowLc(e.target.checked);
    dispatch(setShowLC(e.target.checked))
  }

  useEffect(() => {
    if(userInfo){
      setShow(userInfo.showLC)
    }
  }, [userInfo?.showLC])
  



  return (
    <>
      <div className='p-24'>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                    <span className="flex select-none items-center pl-3 pr-3 text-black sm:text-sm">Choose</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="janesmith"
                      autoComplete="username"
                      className="block flex-1 border-0 rounded-r-md bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-black focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>


              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm mb-4 font-medium leading-6 text-gray-900">
                  LeetCode ID
                </label>
                {userInfo?.leetcode && !update ? <>

                  <div className=' flex justify-between'>
                    <div className=' flex gap-2 items-center'>
                      <SiLeetcode />
                      <a href={`https://leetcode.com/u/${userInfo.leetcode}/`} target='blank' className=' text-[#01a864]'>{userInfo.leetcode}</a>
                      <button onClick={() => setupdate(true)} className=' flex  items-center justify-center px-4 py-1 bg-white font-medium rounded-md shadow-sm ring-1 ring-inset ring-gray-300 text-sm '>Update</button>
                    </div>
                    <div className=' relative'>
                      {showAlert && <div className=' absolute right-0 bottom-10 w-40 text-xs text-red-500 font-semibold border-2 border-red-700 rounded-tl-xl rounded-br-xl p-2'>
                        *Display stats on profile.
                      </div>}
                    
                    <Switch disabled={isDisable}  onMouseEnter={()=> setshowAlert(true)} onMouseLeave={()=> setshowAlert(false)} checked={show} onChange={(e) => handleChange(e)} sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#000',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#666923d3',
                      },
                    }} />
                    </div>
                  </div>
                </> : <>
                  <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    Add Leetcode profile
                  </label>
                  <div className='flex mt-2 gap-2'>
                    <div className=" relative rounded-md shadow-sm ring-1 ring-inset ring-gray-300">

                      <span className='absolute left-2 top-[50%] translate-y-[-50%]'><SiLeetcode className='text-xl' /></span>
                      <input
                        id="lcusername"
                        name="lcusername"
                        spellCheck={"false"}
                        value={lcusername}
                        onChange={(e) => {
                          setlcusername(e.target.value)
                          seterror("")
                        }}
                        type="text"
                        placeholder="LeetCode ID"
                        className="block flex-1 outline-none  bg-transparent py-1.5 pl-10 text-gray-900  focus:ring-0 sm:text-sm sm:leading-6    "
                      />
                    </div>
                    <button onClick={() => addLC()} className=' flex  items-center justify-center px-4 bg-[#e3a300] font-medium rounded-md shadow-sm ring-1 ring-inset ring-gray-300 text-sm '>
                      {isLoading ? <SmallLoader /> : <span>Add</span>}
                    </button>
                  </div>
                  <div className='mt-1 ml-2' role="alert" style={{ color: "red", fontSize: "12px" }}>{error}</div>
                </>}


              </div>


              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-grey-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[black] sm:text-sm sm:leading-6"
                    defaultValue={''}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
              </div>

              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon aria-hidden="true" className="h-12 w-12 text-[black]" />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Address</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="col-span-full">
                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    id="street-address"
                    name="street-address"
                    type="text"
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="region"
                    name="region"
                    type="text"
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    id="postal-code"
                    name="postal-code"
                    type="text"
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#656923] focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="comments" className="font-medium text-gray-900">
                        Comments
                      </label>
                      <p className="text-gray-500">Get notified when someones posts a comment on your reply.</p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#656923] focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="candidates" className="font-medium text-gray-900">
                        Posts
                      </label>
                      <p className="text-gray-500">Get notified when any one post new thing.</p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#656923] focus:ring-black"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="offers" className="font-medium text-gray-900">
                        Updates
                      </label>
                      <p className="text-gray-500">Get notified when we push new updates.</p>
                    </div>
                  </div>
                </div>
              </fieldset>

            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#656923] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a9aa88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}

export default Settings;
